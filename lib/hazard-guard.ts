import { HazardDetection, BoundingBox } from "@/lib/types"

// Configuration Constants
const CONFIG = {
    // Region of Interest (ROI) - Static Trapezoid for highway driving
    // (Assuming camera mounted at dash height, center-aligned)
    ROI_TOP_Y: 0.45,    // Horizon line approx
    ROI_BOTTOM_Y: 1.0,  // Bottom of frame
    ROI_LEFT_X_TOP: 0.40, // Narrow at horizon
    ROI_RIGHT_X_TOP: 0.60,
    ROI_LEFT_X_BOTTOM: 0.0, // Full width at bottom
    ROI_RIGHT_X_BOTTOM: 1.0,

    // Temporal Persistence
    CONFIRMATION_FRAMES_CRITICAL: 1, // Persons/Cars = immediate (if confidence high)
    CONFIRMATION_FRAMES_MEDIUM: 3,   // Potholes/Debris = wait 3 frames to reject noise
    TRACK_IOU_THRESHOLD: 0.3,        // Loose matching for tracking
    MAX_DROPOUT_FRAMES: 2,           // Keep track alive for 2 frames if detection missed

    // Size Heuristics
    MIN_RELATIVE_WIDTH: 0.02, // Objects smaller than 2% of screen width are likely noise/too far
    MAX_DISTANCE_Z: 150,      // Meters (Approximate)

    // Logic Thresholds
    EGO_LANE_CENTER_X: 0.5,
    EGO_LANE_WIDTH_AT_BOTTOM: 0.6, // +/- 0.3 from center
    // WRONG_WAY_VELOCITY_THRESHOLD: 0.005, // Normalized units per frame (approx) - Removed, now using isApproaching
}

interface TrackedHazard {
    id: string
    firstSeen: number
    lastSeen: number
    hitCounter: number
    missCounter: number
    objectClass: string
    box: BoundingBox
    confidenceHistory: number[]
    confirmed: boolean

    // Motion State
    velocityX: number
    velocityY: number
    expansionRate: number
    isApproaching: boolean
}

/**
 * HazardGuard: Safety-Critical Post-Processing Filter
 * 
 * Responsibilities:
 * 1. Reject detections outside the drivable road correlation (ROI).
 * 2. Track objects over time to suppress single-frame flickering (noise).
 * 3. Enforce size/depth constraints to ignore background objects.
 * 4. Filter generic vehicles unless they exhibit hazardous motion (Wrong Way).
 */
export class HazardGuard {
    private tracks: Map<string, TrackedHazard> = new Map()
    private nextTrackId = 1
    private frameCount = 0

    constructor() { }

    public process(detections: HazardDetection[], frameWidth: number, frameHeight: number): HazardDetection[] {
        this.frameCount++
        const now = Date.now()

        // 1. ROI & Geomtric Filtering
        const validDetections = detections.filter(d => this.isValidCandidate(d))

        // 2. Temporal Tracking (Sort-Pro-Lite logic)
        // Predict/Associate
        const matched = this.associateTracks(validDetections)

        // Update Tracks
        const activeTracks: HazardDetection[] = []

        // A. Handle Matches
        matched.matches.forEach(match => {
            const track = this.tracks.get(match.trackId)!
            const det = validDetections[match.detIndex]

            this.updateTrack(track, det, now)

            if (this.isConfirmed(track)) {
                // LOGIC FILTER: Only output if it's a confirmed threat
                const threatLevel = this.assessThreat(track);

                if (threatLevel !== 'safe') {
                    // If it was generic vehicle but now detected as wrong way, upgrade it
                    let finalClass = track.objectClass;
                    let finalSeverity = det.severity;

                    if (threatLevel === 'wrong_way') {
                        finalClass = 'wrong_way_vehicle';
                        finalSeverity = 'critical';
                    }

                    activeTracks.push({
                        ...det,
                        id: `trk_${match.trackId}`,
                        objectClass: finalClass as any,
                        severity: finalSeverity
                    })
                }
            }
        })

        // B. Handle Unmatched Detections (New Tracks)
        matched.unmatchedDetections.forEach(detIndex => {
            const det = validDetections[detIndex]
            const newTrack = this.createTrack(det, now)

            // Critical hazards might be confirmed immediately if confidence is super high
            if (this.isConfirmed(newTrack)) {
                // New track doesn't have velocity history yet.
                // If it's explicitly generic 'vehicle', we assume safe for 1st frame to avoid flash.
                // Unless explicitly 'wrong_way_vehicle'.
                const threatLevel = this.assessThreat(newTrack);

                if (threatLevel !== 'safe') {
                    activeTracks.push({
                        ...det,
                        id: `trk_${newTrack.id}`
                    })
                }
            }
        })

        // C. Handle Unmatched Tracks (Misses)
        matched.unmatchedTracks.forEach(trackId => {
            const track = this.tracks.get(trackId)!
            track.missCounter++

            // If confirmed and only missed briefly, keep outputting it (ghost)? 
            // For safety, we usually stop outputting immediately but keep memory for re-association.
            // So we do NOT push to activeTracks here unless we want "coasting".
            // Let's NOT coast for safety (avoid predicting hazards that moved).

            if (track.missCounter > CONFIG.MAX_DROPOUT_FRAMES) {
                this.tracks.delete(trackId)
            }
        })

        return activeTracks
    }

    // --- 1. Geometric & Logic Filtering ---

    private isValidCandidate(d: HazardDetection): boolean {
        const box = d.bbox
        const cls = d.objectClass

        // 1. Size Check (Too small = likely far background or noise)
        if (box.width < CONFIG.MIN_RELATIVE_WIDTH) return false

        // 2. ROI Check (Drivable Corridor)
        const bottomCenterX = box.x + box.width / 2
        const bottomCenterY = box.y + box.height

        if (!this.isInTrapezoid(bottomCenterX, bottomCenterY)) {
            // EXCEPTION: Large animals entering from side might be valid even if just outside 
            // But strict ROI for now.
            return false
        }

        // 3. Logic Filter: Traffic Rules
        // We ALLOW generic vehicles here so we can track them to check velocity.
        // Filtering happens in 'assessThreat'.
        return true
    }

    private assessThreat(track: TrackedHazard): 'safe' | 'hazard' | 'wrong_way' {
        const cls = track.objectClass;

        // 1. Explicit Hazards are always hazards
        if (['pothole', 'debris', 'fallen_tree', 'pedestrian', 'cow', 'animal', 'wrong_way_vehicle'].some(c => cls.includes(c))) {
            return 'hazard';
        }

        // 2. Generic Vehicles -> Check Motion
        if (this.isVehicle(cls)) {
            // If explicitly labelled wrong way, trust it (if model is trusted)
            if (cls === 'wrong_way_vehicle') return 'wrong_way';

            // Motion Logic for generic 'vehicle' / 'car'
            if (track.isApproaching) {
                // Check Lane Position (Center of box relative to screen)
                const centerX = track.box.x + track.box.width / 2;

                // Is it in Ego Lane? (Center usually 0.5)
                const distFromCenter = Math.abs(centerX - CONFIG.EGO_LANE_CENTER_X);

                // Rough check: is it within the central lane corridor?
                if (distFromCenter < 0.20) {
                    // APPROACHING in CENTER LANE -> WRONG WAY
                    return 'wrong_way';
                }
            }

            // Otherwise, it's normal traffic (moving away or adjacent)
            return 'safe';
        }

        // Default safe
        return 'safe';
    }

    private isVehicle(cls: string): boolean {
        return ['vehicle', 'wrong_way_vehicle', 'broken_vehicle', 'car', 'truck', 'bus', 'motorcycle'].includes(cls);
    }

    private isInTrapezoid(x: number, y: number): boolean {
        // Check Y bounds
        if (y < CONFIG.ROI_TOP_Y || y > CONFIG.ROI_BOTTOM_Y) return false

        // Linearly interpolate X bounds based on Y
        const progress = (y - CONFIG.ROI_TOP_Y) / (CONFIG.ROI_BOTTOM_Y - CONFIG.ROI_TOP_Y)

        // Perspective correction: trapezoid widens at bottom
        const minX = CONFIG.ROI_LEFT_X_TOP + (CONFIG.ROI_LEFT_X_BOTTOM - CONFIG.ROI_LEFT_X_TOP) * progress
        const maxX = CONFIG.ROI_RIGHT_X_TOP + (CONFIG.ROI_RIGHT_X_BOTTOM - CONFIG.ROI_RIGHT_X_TOP) * progress

        return x >= minX && x <= maxX
    }

    // --- 2. Temporal Tracking ---

    private associateTracks(detections: HazardDetection[]) {
        const matches: { trackId: string, detIndex: number }[] = []
        const unmatchedDetections: number[] = []
        const unmatchedTracks = new Set(this.tracks.keys())

        // Greedy IOU matching
        // O(N*M) is fine for N,M < 20 (typical road scene)

        // Sort detections by confidence high->low
        const sortedIndices = detections.map((_, i) => i).sort((a, b) => detections[b].confidence - detections[a].confidence)

        for (const i of sortedIndices) {
            const det = detections[i]
            let bestIoU = -1
            let bestTrackId = null

            for (const trackId of unmatchedTracks) {
                const track = this.tracks.get(trackId)!
                const iou = this.computeIoU(det.bbox, track.box)
                if (iou > CONFIG.TRACK_IOU_THRESHOLD && iou > bestIoU) {
                    bestIoU = iou
                    bestTrackId = trackId
                }
            }

            if (bestTrackId) {
                matches.push({ trackId: bestTrackId, detIndex: i })
                unmatchedTracks.delete(bestTrackId)
            } else {
                unmatchedDetections.push(i)
            }
        }

        return { matches, unmatchedDetections, unmatchedTracks: Array.from(unmatchedTracks) }
    }

    private updateTrack(track: TrackedHazard, det: HazardDetection, now: number) {
        const prev = track.box;
        const curr = det.bbox;

        // Velocity Calculation (Simple Diff)
        // Moving Down (+Y) = Approaching (usually) or Moving away slower than ego? 
        // In dashcam: Object getting bigger + Center Y moving down = APPROACHING

        const newVelocityY = curr.y - prev.y;
        const newExpansion = curr.width - prev.width;

        // Smooth Velocity
        track.velocityY = track.velocityY * 0.7 + newVelocityY * 0.3;
        track.expansionRate = track.expansionRate * 0.7 + newExpansion * 0.3;

        // Logic: Approaching if Y is increasing (moving down screen) AND Width is increasing
        track.isApproaching = (track.velocityY > 0.001) && (track.expansionRate > 0.001);

        track.hitCounter++
        track.missCounter = 0
        track.lastSeen = now
        track.box = det.bbox // Update box
        track.confidenceHistory.push(det.confidence)
        if (track.confidenceHistory.length > 5) track.confidenceHistory.shift()
    }

    private createTrack(det: HazardDetection, now: number): TrackedHazard {
        const id = (this.nextTrackId++).toString()
        const track = {
            id,
            firstSeen: now,
            lastSeen: now,
            hitCounter: 1,
            missCounter: 0,
            objectClass: det.objectClass,
            box: det.bbox,
            confidenceHistory: [det.confidence],
            confirmed: false,
            velocityX: 0,
            velocityY: 0,
            expansionRate: 0,
            isApproaching: false
        }
        this.tracks.set(id, track)
        return track
    }

    private isConfirmed(track: TrackedHazard): boolean {
        // Already confirmed?
        if (track.confirmed) return true

        const meanConf = track.confidenceHistory.reduce((a, b) => a + b, 0) / track.confidenceHistory.length

        // CRITICAL: Person, Car, Truck, Cow - Confirm Fast
        // We define 'critical' class set here or derive from severity
        // Assuming 'objectClass' maps to existing categories
        const criticalClasses = ['person', 'car', 'truck', 'bus', 'motorcycle', 'cow', 'pedestrian', 'animal_large']
        const isCritical = criticalClasses.some(c => track.objectClass.includes(c))

        if (isCritical) {
            if (meanConf > 0.6) {
                track.confirmed = true
                return true
            }
            // If lower confidence, wait 1 more frame
            if (track.hitCounter >= 2) {
                track.confirmed = true
                return true
            }
        } else {
            // STANDARD: Potholes, Debris, Cones - Wait for persistence
            // These are noisy. Wait for 3 frames.
            if (track.hitCounter >= CONFIG.CONFIRMATION_FRAMES_MEDIUM) {
                track.confirmed = true
                return true
            }
        }

        return false
    }

    private computeIoU(b1: BoundingBox, b2: BoundingBox): number {
        const x1 = Math.max(b1.x, b2.x)
        const y1 = Math.max(b1.y, b2.y)
        const x2 = Math.min(b1.x + b1.width, b2.x + b2.width)
        const y2 = Math.min(b1.y + b1.height, b2.y + b2.height)

        if (x2 < x1 || y2 < y1) return 0

        const intersection = (x2 - x1) * (y2 - y1)
        const area1 = b1.width * b1.height
        const area2 = b2.width * b2.height

        return intersection / (area1 + area2 - intersection)
    }
}

export const hazardGuard = new HazardGuard()
