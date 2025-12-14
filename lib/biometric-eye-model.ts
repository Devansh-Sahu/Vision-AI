import { DrowsinessMetrics } from "./types"

// --- Constants & Config ---

const LANDMARKS = {
    // Standard 6-point eye definition for MediaPipe FaceMesh
    // P1: Left Corner, P2: Top Outer, P3: Top Inner, P4: Right Corner, P5: Bot Inner, P6: Bot Outer
    LEFT_EYE: [33, 160, 158, 133, 153, 144],
    RIGHT_EYE: [263, 387, 385, 362, 380, 373],
}

type Point = { x: number; y: number; z?: number }

interface EyeGeometry {
    ear: number
    verticalDist: number
    horizontalWith: number
    // A measure of how much the upper lid deviates from the straight line connecting corners
    upperLidCurvature: number
}

interface EyeStateInternal {
    opennessPercent: number // 0-100
    rawOpennessMetric: number // The raw fused metric before normalization
    velocity: number // deg/sec or unit/sec
    isBlink: boolean
    isMicrosleep: boolean
    isDrowsy: boolean
    confidence: number
}

/**
 * OneEuroFilter for signal smoothing (jitter reduction + responsiveness)
 */
class OneEuroFilter {
    private minCutoff: number
    private beta: number
    private dCutoff: number
    private dxPrev: number = 0
    private xPrev: number | null = null
    private tPrev: number | null = null

    constructor(minCutoff = 1.0, beta = 0.0, dCutoff = 1.0) {
        this.minCutoff = minCutoff
        this.beta = beta
        this.dCutoff = dCutoff
    }

    filter(x: number, t: number = Date.now()): number {
        if (this.xPrev === null || this.tPrev === null) {
            this.xPrev = x
            this.tPrev = t
            return x
        }

        const dt = (t - this.tPrev) / 1000.0
        if (dt === 0) return this.xPrev // Force distinct timestamps

        const a_d = this.smoothingFactor(dt, this.dCutoff)
        const dx = (x - this.xPrev) / dt
        const dxHat = this.exponentialSmoothing(a_d, dx, this.dxPrev)

        const cutoff = this.minCutoff + this.beta * Math.abs(dxHat)
        const a = this.smoothingFactor(dt, cutoff)
        const xHat = this.exponentialSmoothing(a, x, this.xPrev)

        this.xPrev = xHat
        this.dxPrev = dxHat
        this.tPrev = t
        return xHat
    }

    private smoothingFactor(dt: number, cutoff: number): number {
        const r = 2 * Math.PI * cutoff
        return r * dt / (1 + r * dt)
    }

    private exponentialSmoothing(a: number, x: number, xPrev: number): number {
        return a * x + (1 - a) * xPrev
    }

    reset() {
        this.xPrev = null;
        this.tPrev = null;
        this.dxPrev = 0;
    }
}

/**
 * Biometric Eye Engine
 * Encapsulates geometry, calibration, and temporal state.
 */
export class BiometricEyeEngine {
    // Calibration State
    // We track "Open" (approx 95th percentile) and "Closed" (absolute min during blinks)
    // We use asymmetric learning rates to push boundaries
    private calibration = {
        openBaseline: 0.30, // Default to a healthy open eye value
        closedBaseline: 0.10, // Default to fully closed
        isInitialized: false,
        samples: 0
    }

    // Filters
    private opennessFilter = new OneEuroFilter(2.0, 0.01, 1.0) // More responsive, less lag
    private velocityFilter = new OneEuroFilter(10.0, 0.0) // Fast response for velocity

    // State Tracking
    private lastMetric: number = 0.3
    private lastTime: number = 0

    // Event State
    private blinkStartTime: number | null = null
    private microsleepStartTime: number | null = null

    constructor() {
        this.lastTime = Date.now()
    }

    /**
     * Main Process Loop
     */
    public processFrame(landmarks: Point[]): EyeStateInternal | null {
        const now = Date.now()

        // 1. Extract Geometry
        const leftEye = this.getEyeGeometry(landmarks, LANDMARKS.LEFT_EYE)
        const rightEye = this.getEyeGeometry(landmarks, LANDMARKS.RIGHT_EYE)

        if (!leftEye || !rightEye) return null

        // 2. Fusion Logic: Weighted average favoring stability
        const avgEAR = (leftEye.ear + rightEye.ear) / 2

        const rawMetric = avgEAR

        // 3. Adaptive Calibration with Safety Bounds
        this.updateCalibration(rawMetric)

        // 4. Perceptual Normalization
        // Map raw metric to 0-100% based on learnt range
        const normalizedOpenness = this.computePerceptualOpenness(rawMetric)

        // 5. Temporal Smoothing
        const smoothedOpenness = this.opennessFilter.filter(normalizedOpenness, now)

        // 6. Velocity Calculation
        const dt = (now - this.lastTime) / 1000
        // Only calc velocity if time progressed
        let velocity = 0;
        if (dt > 0) {
            velocity = (smoothedOpenness - this.lastMetric) / dt
        }
        this.lastMetric = smoothedOpenness
        this.lastTime = now

        // 7. Event Detection (Blinks, Microsleeps)
        const state = this.detectEvents(smoothedOpenness, velocity, now)

        return {
            opennessPercent: smoothedOpenness,
            rawOpennessMetric: rawMetric,
            velocity,
            ...state
        }
    }

    private getEyeGeometry(landmarks: Point[], indices: number[]): EyeGeometry | null {
        // Need all points
        const points = indices.map(i => landmarks[i])
        if (points.some(p => !p)) return null

        const [p1, p2, p3, p4, p5, p6] = points

        // Vertical 1: p2 -> p6
        const v1 = this.distance(p2, p6)
        // Vertical 2: p3 -> p5
        const v2 = this.distance(p3, p5)
        // Horizontal: p1 -> p4
        const h = this.distance(p1, p4)

        if (h < 1e-4) return null // Avoid div by zero

        const ear = (v1 + v2) / (2 * h)

        return {
            ear,
            verticalDist: (v1 + v2) / 2,
            horizontalWith: h,
            upperLidCurvature: 0
        }
    }

    private distance(a: Point, b: Point): number {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
    }

    /**
     * Adapts the Open/Closed baselines over time.
     * STRICT SAFETY: We prevent the baselines from "collapsing" (Open becoming == Closed).
     * We also enforce absolute limits so "Closed" never looks "Open".
     */
    private updateCalibration(val: number) {
        if (!this.calibration.isInitialized) {
            // Initialization Phase (First 60 frames / ~2 sec)
            // Just aggressively expand bounds
            if (this.calibration.samples < 60) {
                this.calibration.openBaseline = Math.max(0.25, Math.max(this.calibration.openBaseline, val))
                this.calibration.closedBaseline = Math.min(0.15, Math.min(this.calibration.closedBaseline, val))
                this.calibration.samples++
                return
            } else {
                this.calibration.isInitialized = true
            }
        }

        // Dynamic Learning Rates
        const learnUp = 0.05   // Fast adaptation to new max
        const learnDown = 0.001 // Very slow decay to prevent "drowsy" drift

        // 1. Update Open Baseline
        // Only update if value is REASONABLE (not an outlier blink, not a glitch)
        // We assume legitimate "Open" eyes are > 0.20
        if (val > 0.20) {
            if (val > this.calibration.openBaseline) {
                // New local max found - adapt
                this.calibration.openBaseline = val * learnUp + this.calibration.openBaseline * (1 - learnUp)
            } else {
                // Decay very slowly
                this.calibration.openBaseline = this.calibration.openBaseline - (this.calibration.openBaseline * learnDown)
            }
        }

        // 2. Update Closed Baseline
        // Only consider values that look like blinks (< 0.20)
        if (val < 0.20) {
            if (val < this.calibration.closedBaseline) {
                // New local min found - adapt
                this.calibration.closedBaseline = val * learnUp + this.calibration.closedBaseline * (1 - learnUp)
            } else {
                // Decay
                this.calibration.closedBaseline = this.calibration.closedBaseline + (this.calibration.closedBaseline * learnDown)
            }
        }

        // 3. STRICT SAFETY CLAMPS (The Fix)
        // Absolute physically possible limits for "generic" human eyes
        // Open eyes are rarely < 0.22 EAR. Closed eyes are rarely > 0.18 EAR.
        this.calibration.openBaseline = Math.max(0.24, Math.min(0.45, this.calibration.openBaseline))
        this.calibration.closedBaseline = Math.max(0.05, Math.min(0.18, this.calibration.closedBaseline))

        // Ensure Enforced Separation
        if (this.calibration.openBaseline - this.calibration.closedBaseline < 0.10) {
            // Push open baseline up if they get too close
            this.calibration.openBaseline = this.calibration.closedBaseline + 0.10
        }
    }

    /**
     * Non-linear mapping from metric to 0-100 perception.
     */
    private computePerceptualOpenness(val: number): number {
        const { openBaseline, closedBaseline } = this.calibration

        // HARD FORCE CLOSED Logic
        // If EAR is below 0.15, it is physically impossible to be "Open". 
        // Return 0 immediately. This fixes the "100% when closed" bug.
        if (val < 0.15) return 0;

        // 0. Clamping relative to calibration
        if (val <= closedBaseline) return 0
        if (val >= openBaseline) return 100

        // 1. Linear normalization
        let t = (val - closedBaseline) / (openBaseline - closedBaseline)

        // 2. Non-linear perception curve
        // We want the 0-15% range effectively mapped to "closed/nearly closed"
        // We want 80-100% mapped to "fully open"

        let openness = 0;
        if (t < 0.2) {
            openness = (t / 0.2) * 5 // 0-5% (Basically closed)
        } else if (t < 0.6) {
            // Critical zone: 0.2 to 0.6 maps to 5% to 70%
            // This makes the drop-off steeper
            openness = 5 + ((t - 0.2) / 0.4) * 65
        } else {
            // Open zone: 0.6 to 1.0 maps to 70% to 100%
            openness = 70 + ((t - 0.6) / 0.4) * 30
        }

        return openness
    }

    private detectEvents(openness: number, velocity: number, time: number) {
        let isBlink = false
        let isMicrosleep = false
        let isDrowsy = false
        let confidence = 1.0 // Placeholder

        // Blink Logic
        // If openness drops below 10% quickly, it's a blink
        if (openness < 15) {
            if (!this.blinkStartTime) {
                this.blinkStartTime = time
            }
            isBlink = true

            // Microwave/Long Closure Logic
            const duration = time - this.blinkStartTime
            if (duration > 500) { // > 500ms closed
                isMicrosleep = true
            }
        } else {
            // Reset blink timer if eyes open
            if (openness > 30) {
                this.blinkStartTime = null
            }
        }

        // Drowsiness Logic (Composite)
        // 1. Sustained partial closure (hovering at 30-50%)
        // 2. High frequency of microsleeps (external logic usually handles freq, here we handle state)
        // 3. Slow eyelid velocity (droopy)

        if (openness > 15 && openness < 60 && Math.abs(velocity) < 10) {
            // Eyes are half open and NOT moving much -> Drowsy/Droopy
            isDrowsy = true
        }

        // Microsleep overrides drowsy
        if (isMicrosleep) {
            isDrowsy = true
        }

        return { isBlink, isMicrosleep, isDrowsy, confidence }
    }
}
