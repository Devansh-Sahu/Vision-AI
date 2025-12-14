(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/models.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/models.ts
// Self-hosted TFJS FaceMesh + MediaPipe Object Detector
__turbopack_context__.s([
    "ensureFaceMeshLoaded",
    ()=>ensureFaceMeshLoaded,
    "getFaceMeshModel",
    ()=>getFaceMeshModel,
    "getObjectDetector",
    ()=>getObjectDetector,
    "loadModels",
    ()=>loadModels,
    "runFaceMesh",
    ()=>runFaceMesh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tensorflow/tfjs/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$converter$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tensorflow/tfjs-converter/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tensorflow/tfjs-core/dist/globals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$ops$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__browser$3e$__ = __turbopack_context__.i("[project]/node_modules/@tensorflow/tfjs-core/dist/ops/browser.js [app-client] (ecmascript) <export * as browser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$ops$2f$tensor2d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tensorflow/tfjs-core/dist/ops/tensor2d.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$ops$2f$tensor1d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tensorflow/tfjs-core/dist/ops/tensor1d.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs [app-client] (ecmascript)");
;
;
let faceMeshModel = null;
let modelsLoaded = false;
let faceMeshLoadingPromise = null;
// -------------------------------
// Load MediaPipe Object Detector
// -------------------------------
let objectDetector = null;
let objectLoadingPromise = null;
async function loadModels() {
    if (modelsLoaded) return;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (objectLoadingPromise) return objectLoadingPromise;
    objectLoadingPromise = (async ()=>{
        try {
            const vision = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilesetResolver"].forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm");
            // Use Lite0 for maximum speed (user requested "highly fast")
            objectDetector = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ObjectDetector"].createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/1/efficientdet_lite0.tflite`,
                    delegate: "GPU"
                },
                scoreThreshold: 0.25,
                runningMode: "VIDEO"
            });
            console.log("MediaPipe EfficientDet-Lite0 loaded");
            modelsLoaded = true;
        } catch (err) {
            console.error("Error loading MediaPipe Detector:", err);
        }
    })();
    return objectLoadingPromise;
}
function getObjectDetector() {
    return objectDetector;
}
async function ensureFaceMeshLoaded() {
    if (faceMeshModel) return;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (faceMeshLoadingPromise) return faceMeshLoadingPromise;
    faceMeshLoadingPromise = (async ()=>{
        try {
            faceMeshModel = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$converter$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadGraphModel"]("/models/facemesh/model.json", {
                fromTFHub: false
            });
            console.log("FaceMesh model loaded (local)");
        } catch (err) {
            console.error("Failed to load FaceMesh:", err);
            faceMeshModel = null;
        }
    })();
    return faceMeshLoadingPromise;
}
function getFaceMeshModel() {
    return faceMeshModel;
}
async function runFaceMesh(video) {
    if (!faceMeshModel) return null;
    try {
        const input = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tidy"](()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$ops$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__browser$3e$__["browser"].fromPixels(video).resizeBilinear([
                192,
                192
            ]).expandDims(0).toFloat().div(127.5).sub(1) // Normalize to [-1, 1]
            ;
        });
        // Get model output using the correct output names from the model
        // Using execute() instead of executeAsync() since we don't have dynamic output shapes
        const outputs = faceMeshModel.execute(input, [
            'Identity_2',
            'Identity_1',
            'Identity' // output_contours
        ]);
        // Clean up input tensor
        input.dispose();
        try {
            // Convert to arrays for debugging
            const [landmarksData, faceFlagData] = await Promise.all([
                outputs[0].array(),
                outputs[1].array()
            ]);
            // Clean up output tensors
            outputs.forEach((t)=>t.dispose());
            // Check for valid output
            if (!landmarksData?.[0] || !faceFlagData?.[0]) {
                console.warn('No face detected or invalid output format');
                return null;
            }
            // Return the raw tensors for further processing
            // Convert to tensors with proper shapes
            const landmarksTensor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$ops$2f$tensor2d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tensor2d"](landmarksData, [
                landmarksData.length,
                landmarksData[0].length
            ]);
            const confidenceTensor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$ops$2f$tensor1d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tensor1d"](faceFlagData[0]);
            return [
                landmarksTensor,
                confidenceTensor
            ];
        } catch (error) {
            console.error('Error processing face mesh output:', error);
            // Ensure cleanup on error
            for (const t of outputs){
                try {
                    t.dispose();
                } catch (e) {
                    console.warn('Error disposing tensor:', e);
                }
            }
            return null;
        }
    } catch (error) {
        console.error('Error in runFaceMesh:', error);
        return null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/sounds.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Soft alert sound (using Web Audio API for better control)
__turbopack_context__.s([
    "alertSound",
    ()=>alertSound
]);
class AlertSound {
    audioContext = null;
    oscillator = null;
    gainNode = null;
    constructor(){
        // Initialize audio context on user interaction
        if ("TURBOPACK compile-time truthy", 1) {
            window.addEventListener('click', this.initAudio, {
                once: true
            });
        }
    }
    initAudio = ()=>{
        if (this.audioContext) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = 0.3; // 30% volume
            this.gainNode.connect(this.audioContext.destination);
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    };
    play() {
        if (!this.audioContext) this.initAudio();
        if (!this.audioContext || !this.gainNode) return;
        // Stop any existing sound
        if (this.oscillator) {
            this.oscillator.stop();
        }
        // Create oscillator for the alert sound
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5 note
        this.oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.5 // Ramp down to A4 over 0.5s
        );
        // Connect and play
        this.oscillator.connect(this.gainNode);
        this.oscillator.start();
        this.oscillator.stop(this.audioContext.currentTime + 1); // Stop after 1 second
    }
}
const alertSound = new AlertSound();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/biometric-eye-model.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BiometricEyeEngine",
    ()=>BiometricEyeEngine
]);
// --- Constants & Config ---
const LANDMARKS = {
    // Standard 6-point eye definition for MediaPipe FaceMesh
    // P1: Left Corner, P2: Top Outer, P3: Top Inner, P4: Right Corner, P5: Bot Inner, P6: Bot Outer
    LEFT_EYE: [
        33,
        160,
        158,
        133,
        153,
        144
    ],
    RIGHT_EYE: [
        263,
        387,
        385,
        362,
        380,
        373
    ]
};
/**
 * OneEuroFilter for signal smoothing (jitter reduction + responsiveness)
 */ class OneEuroFilter {
    minCutoff;
    beta;
    dCutoff;
    dxPrev = 0;
    xPrev = null;
    tPrev = null;
    constructor(minCutoff = 1.0, beta = 0.0, dCutoff = 1.0){
        this.minCutoff = minCutoff;
        this.beta = beta;
        this.dCutoff = dCutoff;
    }
    filter(x, t = Date.now()) {
        if (this.xPrev === null || this.tPrev === null) {
            this.xPrev = x;
            this.tPrev = t;
            return x;
        }
        const dt = (t - this.tPrev) / 1000.0;
        if (dt === 0) return this.xPrev // Force distinct timestamps
        ;
        const a_d = this.smoothingFactor(dt, this.dCutoff);
        const dx = (x - this.xPrev) / dt;
        const dxHat = this.exponentialSmoothing(a_d, dx, this.dxPrev);
        const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);
        const a = this.smoothingFactor(dt, cutoff);
        const xHat = this.exponentialSmoothing(a, x, this.xPrev);
        this.xPrev = xHat;
        this.dxPrev = dxHat;
        this.tPrev = t;
        return xHat;
    }
    smoothingFactor(dt, cutoff) {
        const r = 2 * Math.PI * cutoff;
        return r * dt / (1 + r * dt);
    }
    exponentialSmoothing(a, x, xPrev) {
        return a * x + (1 - a) * xPrev;
    }
    reset() {
        this.xPrev = null;
        this.tPrev = null;
        this.dxPrev = 0;
    }
}
class BiometricEyeEngine {
    // Calibration State
    // We track "Open" (approx 95th percentile) and "Closed" (absolute min during blinks)
    // We use asymmetric learning rates to push boundaries
    calibration = {
        openBaseline: 0.30,
        closedBaseline: 0.10,
        isInitialized: false,
        samples: 0
    };
    // Filters
    opennessFilter = new OneEuroFilter(2.0, 0.01, 1.0) // More responsive, less lag
    ;
    velocityFilter = new OneEuroFilter(10.0, 0.0) // Fast response for velocity
    ;
    // State Tracking
    lastMetric = 0.3;
    lastTime = 0;
    // Event State
    blinkStartTime = null;
    microsleepStartTime = null;
    constructor(){
        this.lastTime = Date.now();
    }
    /**
     * Main Process Loop
     */ processFrame(landmarks) {
        const now = Date.now();
        // 1. Extract Geometry
        const leftEye = this.getEyeGeometry(landmarks, LANDMARKS.LEFT_EYE);
        const rightEye = this.getEyeGeometry(landmarks, LANDMARKS.RIGHT_EYE);
        if (!leftEye || !rightEye) return null;
        // 2. Fusion Logic: Weighted average favoring stability
        const avgEAR = (leftEye.ear + rightEye.ear) / 2;
        const rawMetric = avgEAR;
        // 3. Adaptive Calibration with Safety Bounds
        this.updateCalibration(rawMetric);
        // 4. Perceptual Normalization
        // Map raw metric to 0-100% based on learnt range
        const normalizedOpenness = this.computePerceptualOpenness(rawMetric);
        // 5. Temporal Smoothing
        const smoothedOpenness = this.opennessFilter.filter(normalizedOpenness, now);
        // 6. Velocity Calculation
        const dt = (now - this.lastTime) / 1000;
        // Only calc velocity if time progressed
        let velocity = 0;
        if (dt > 0) {
            velocity = (smoothedOpenness - this.lastMetric) / dt;
        }
        this.lastMetric = smoothedOpenness;
        this.lastTime = now;
        // 7. Event Detection (Blinks, Microsleeps)
        const state = this.detectEvents(smoothedOpenness, velocity, now);
        return {
            opennessPercent: smoothedOpenness,
            rawOpennessMetric: rawMetric,
            velocity,
            ...state
        };
    }
    getEyeGeometry(landmarks, indices) {
        // Need all points
        const points = indices.map((i)=>landmarks[i]);
        if (points.some((p)=>!p)) return null;
        const [p1, p2, p3, p4, p5, p6] = points;
        // Vertical 1: p2 -> p6
        const v1 = this.distance(p2, p6);
        // Vertical 2: p3 -> p5
        const v2 = this.distance(p3, p5);
        // Horizontal: p1 -> p4
        const h = this.distance(p1, p4);
        if (h < 1e-4) return null // Avoid div by zero
        ;
        const ear = (v1 + v2) / (2 * h);
        return {
            ear,
            verticalDist: (v1 + v2) / 2,
            horizontalWith: h,
            upperLidCurvature: 0
        };
    }
    distance(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    /**
     * Adapts the Open/Closed baselines over time.
     * STRICT SAFETY: We prevent the baselines from "collapsing" (Open becoming == Closed).
     * We also enforce absolute limits so "Closed" never looks "Open".
     */ updateCalibration(val) {
        if (!this.calibration.isInitialized) {
            // Initialization Phase (First 60 frames / ~2 sec)
            // Just aggressively expand bounds
            if (this.calibration.samples < 60) {
                this.calibration.openBaseline = Math.max(0.25, Math.max(this.calibration.openBaseline, val));
                this.calibration.closedBaseline = Math.min(0.15, Math.min(this.calibration.closedBaseline, val));
                this.calibration.samples++;
                return;
            } else {
                this.calibration.isInitialized = true;
            }
        }
        // Dynamic Learning Rates
        const learnUp = 0.05 // Fast adaptation to new max
        ;
        const learnDown = 0.001 // Very slow decay to prevent "drowsy" drift
        ;
        // 1. Update Open Baseline
        // Only update if value is REASONABLE (not an outlier blink, not a glitch)
        // We assume legitimate "Open" eyes are > 0.20
        if (val > 0.20) {
            if (val > this.calibration.openBaseline) {
                // New local max found - adapt
                this.calibration.openBaseline = val * learnUp + this.calibration.openBaseline * (1 - learnUp);
            } else {
                // Decay very slowly
                this.calibration.openBaseline = this.calibration.openBaseline - this.calibration.openBaseline * learnDown;
            }
        }
        // 2. Update Closed Baseline
        // Only consider values that look like blinks (< 0.20)
        if (val < 0.20) {
            if (val < this.calibration.closedBaseline) {
                // New local min found - adapt
                this.calibration.closedBaseline = val * learnUp + this.calibration.closedBaseline * (1 - learnUp);
            } else {
                // Decay
                this.calibration.closedBaseline = this.calibration.closedBaseline + this.calibration.closedBaseline * learnDown;
            }
        }
        // 3. STRICT SAFETY CLAMPS (The Fix)
        // Absolute physically possible limits for "generic" human eyes
        // Open eyes are rarely < 0.22 EAR. Closed eyes are rarely > 0.18 EAR.
        this.calibration.openBaseline = Math.max(0.24, Math.min(0.45, this.calibration.openBaseline));
        this.calibration.closedBaseline = Math.max(0.05, Math.min(0.18, this.calibration.closedBaseline));
        // Ensure Enforced Separation
        if (this.calibration.openBaseline - this.calibration.closedBaseline < 0.10) {
            // Push open baseline up if they get too close
            this.calibration.openBaseline = this.calibration.closedBaseline + 0.10;
        }
    }
    /**
     * Non-linear mapping from metric to 0-100 perception.
     */ computePerceptualOpenness(val) {
        const { openBaseline, closedBaseline } = this.calibration;
        // HARD FORCE CLOSED Logic
        // If EAR is below 0.15, it is physically impossible to be "Open". 
        // Return 0 immediately. This fixes the "100% when closed" bug.
        if (val < 0.15) return 0;
        // 0. Clamping relative to calibration
        if (val <= closedBaseline) return 0;
        if (val >= openBaseline) return 100;
        // 1. Linear normalization
        let t = (val - closedBaseline) / (openBaseline - closedBaseline);
        // 2. Non-linear perception curve
        // We want the 0-15% range effectively mapped to "closed/nearly closed"
        // We want 80-100% mapped to "fully open"
        let openness = 0;
        if (t < 0.2) {
            openness = t / 0.2 * 5; // 0-5% (Basically closed)
        } else if (t < 0.6) {
            // Critical zone: 0.2 to 0.6 maps to 5% to 70%
            // This makes the drop-off steeper
            openness = 5 + (t - 0.2) / 0.4 * 65;
        } else {
            // Open zone: 0.6 to 1.0 maps to 70% to 100%
            openness = 70 + (t - 0.6) / 0.4 * 30;
        }
        return openness;
    }
    detectEvents(openness, velocity, time) {
        let isBlink = false;
        let isMicrosleep = false;
        let isDrowsy = false;
        let confidence = 1.0 // Placeholder
        ;
        // Blink Logic
        // If openness drops below 10% quickly, it's a blink
        if (openness < 15) {
            if (!this.blinkStartTime) {
                this.blinkStartTime = time;
            }
            isBlink = true;
            // Microwave/Long Closure Logic
            const duration = time - this.blinkStartTime;
            if (duration > 500) {
                isMicrosleep = true;
            }
        } else {
            // Reset blink timer if eyes open
            if (openness > 30) {
                this.blinkStartTime = null;
            }
        }
        // Drowsiness Logic (Composite)
        // 1. Sustained partial closure (hovering at 30-50%)
        // 2. High frequency of microsleeps (external logic usually handles freq, here we handle state)
        // 3. Slow eyelid velocity (droopy)
        if (openness > 15 && openness < 60 && Math.abs(velocity) < 10) {
            // Eyes are half open and NOT moving much -> Drowsy/Droopy
            isDrowsy = true;
        }
        // Microsleep overrides drowsy
        if (isMicrosleep) {
            isDrowsy = true;
        }
        return {
            isBlink,
            isMicrosleep,
            isDrowsy,
            confidence
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/hazard-guard.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HazardGuard",
    ()=>HazardGuard,
    "hazardGuard",
    ()=>hazardGuard
]);
// Configuration Constants
const CONFIG = {
    // Region of Interest (ROI) - Static Trapezoid for highway driving
    // (Assuming camera mounted at dash height, center-aligned)
    ROI_TOP_Y: 0.45,
    ROI_BOTTOM_Y: 1.0,
    ROI_LEFT_X_TOP: 0.40,
    ROI_RIGHT_X_TOP: 0.60,
    ROI_LEFT_X_BOTTOM: 0.0,
    ROI_RIGHT_X_BOTTOM: 1.0,
    // Temporal Persistence
    CONFIRMATION_FRAMES_CRITICAL: 1,
    CONFIRMATION_FRAMES_MEDIUM: 3,
    TRACK_IOU_THRESHOLD: 0.3,
    MAX_DROPOUT_FRAMES: 2,
    // Size Heuristics
    MIN_RELATIVE_WIDTH: 0.02,
    MAX_DISTANCE_Z: 150,
    // Logic Thresholds
    EGO_LANE_CENTER_X: 0.5,
    EGO_LANE_WIDTH_AT_BOTTOM: 0.6
};
class HazardGuard {
    tracks = new Map();
    nextTrackId = 1;
    frameCount = 0;
    constructor(){}
    process(detections, frameWidth, frameHeight) {
        this.frameCount++;
        const now = Date.now();
        // 1. ROI & Geomtric Filtering
        const validDetections = detections.filter((d)=>this.isValidCandidate(d));
        // 2. Temporal Tracking (Sort-Pro-Lite logic)
        // Predict/Associate
        const matched = this.associateTracks(validDetections);
        // Update Tracks
        const activeTracks = [];
        // A. Handle Matches
        matched.matches.forEach((match)=>{
            const track = this.tracks.get(match.trackId);
            const det = validDetections[match.detIndex];
            this.updateTrack(track, det, now);
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
                        objectClass: finalClass,
                        severity: finalSeverity
                    });
                }
            }
        });
        // B. Handle Unmatched Detections (New Tracks)
        matched.unmatchedDetections.forEach((detIndex)=>{
            const det = validDetections[detIndex];
            const newTrack = this.createTrack(det, now);
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
                    });
                }
            }
        });
        // C. Handle Unmatched Tracks (Misses)
        matched.unmatchedTracks.forEach((trackId)=>{
            const track = this.tracks.get(trackId);
            track.missCounter++;
            // If confirmed and only missed briefly, keep outputting it (ghost)? 
            // For safety, we usually stop outputting immediately but keep memory for re-association.
            // So we do NOT push to activeTracks here unless we want "coasting".
            // Let's NOT coast for safety (avoid predicting hazards that moved).
            if (track.missCounter > CONFIG.MAX_DROPOUT_FRAMES) {
                this.tracks.delete(trackId);
            }
        });
        return activeTracks;
    }
    // --- 1. Geometric & Logic Filtering ---
    isValidCandidate(d) {
        const box = d.bbox;
        const cls = d.objectClass;
        // 1. Size Check (Too small = likely far background or noise)
        if (box.width < CONFIG.MIN_RELATIVE_WIDTH) return false;
        // 2. ROI Check (Drivable Corridor)
        const bottomCenterX = box.x + box.width / 2;
        const bottomCenterY = box.y + box.height;
        if (!this.isInTrapezoid(bottomCenterX, bottomCenterY)) {
            // EXCEPTION: Large animals entering from side might be valid even if just outside 
            // But strict ROI for now.
            return false;
        }
        // 3. Logic Filter: Traffic Rules
        // We ALLOW generic vehicles here so we can track them to check velocity.
        // Filtering happens in 'assessThreat'.
        return true;
    }
    assessThreat(track) {
        const cls = track.objectClass;
        // 1. Explicit Hazards are always hazards
        if ([
            'pothole',
            'debris',
            'fallen_tree',
            'pedestrian',
            'cow',
            'animal',
            'wrong_way_vehicle'
        ].some((c)=>cls.includes(c))) {
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
    isVehicle(cls) {
        return [
            'vehicle',
            'wrong_way_vehicle',
            'broken_vehicle',
            'car',
            'truck',
            'bus',
            'motorcycle'
        ].includes(cls);
    }
    isInTrapezoid(x, y) {
        // Check Y bounds
        if (y < CONFIG.ROI_TOP_Y || y > CONFIG.ROI_BOTTOM_Y) return false;
        // Linearly interpolate X bounds based on Y
        const progress = (y - CONFIG.ROI_TOP_Y) / (CONFIG.ROI_BOTTOM_Y - CONFIG.ROI_TOP_Y);
        // Perspective correction: trapezoid widens at bottom
        const minX = CONFIG.ROI_LEFT_X_TOP + (CONFIG.ROI_LEFT_X_BOTTOM - CONFIG.ROI_LEFT_X_TOP) * progress;
        const maxX = CONFIG.ROI_RIGHT_X_TOP + (CONFIG.ROI_RIGHT_X_BOTTOM - CONFIG.ROI_RIGHT_X_TOP) * progress;
        return x >= minX && x <= maxX;
    }
    // --- 2. Temporal Tracking ---
    associateTracks(detections) {
        const matches = [];
        const unmatchedDetections = [];
        const unmatchedTracks = new Set(this.tracks.keys());
        // Greedy IOU matching
        // O(N*M) is fine for N,M < 20 (typical road scene)
        // Sort detections by confidence high->low
        const sortedIndices = detections.map((_, i)=>i).sort((a, b)=>detections[b].confidence - detections[a].confidence);
        for (const i of sortedIndices){
            const det = detections[i];
            let bestIoU = -1;
            let bestTrackId = null;
            for (const trackId of unmatchedTracks){
                const track = this.tracks.get(trackId);
                const iou = this.computeIoU(det.bbox, track.box);
                if (iou > CONFIG.TRACK_IOU_THRESHOLD && iou > bestIoU) {
                    bestIoU = iou;
                    bestTrackId = trackId;
                }
            }
            if (bestTrackId) {
                matches.push({
                    trackId: bestTrackId,
                    detIndex: i
                });
                unmatchedTracks.delete(bestTrackId);
            } else {
                unmatchedDetections.push(i);
            }
        }
        return {
            matches,
            unmatchedDetections,
            unmatchedTracks: Array.from(unmatchedTracks)
        };
    }
    updateTrack(track, det, now) {
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
        track.isApproaching = track.velocityY > 0.001 && track.expansionRate > 0.001;
        track.hitCounter++;
        track.missCounter = 0;
        track.lastSeen = now;
        track.box = det.bbox; // Update box
        track.confidenceHistory.push(det.confidence);
        if (track.confidenceHistory.length > 5) track.confidenceHistory.shift();
    }
    createTrack(det, now) {
        const id = (this.nextTrackId++).toString();
        const track = {
            id,
            firstSeen: now,
            lastSeen: now,
            hitCounter: 1,
            missCounter: 0,
            objectClass: det.objectClass,
            box: det.bbox,
            confidenceHistory: [
                det.confidence
            ],
            confirmed: false,
            velocityX: 0,
            velocityY: 0,
            expansionRate: 0,
            isApproaching: false
        };
        this.tracks.set(id, track);
        return track;
    }
    isConfirmed(track) {
        // Already confirmed?
        if (track.confirmed) return true;
        const meanConf = track.confidenceHistory.reduce((a, b)=>a + b, 0) / track.confidenceHistory.length;
        // CRITICAL: Person, Car, Truck, Cow - Confirm Fast
        // We define 'critical' class set here or derive from severity
        // Assuming 'objectClass' maps to existing categories
        const criticalClasses = [
            'person',
            'car',
            'truck',
            'bus',
            'motorcycle',
            'cow',
            'pedestrian',
            'animal_large'
        ];
        const isCritical = criticalClasses.some((c)=>track.objectClass.includes(c));
        if (isCritical) {
            if (meanConf > 0.6) {
                track.confirmed = true;
                return true;
            }
            // If lower confidence, wait 1 more frame
            if (track.hitCounter >= 2) {
                track.confirmed = true;
                return true;
            }
        } else {
            // STANDARD: Potholes, Debris, Cones - Wait for persistence
            // These are noisy. Wait for 3 frames.
            if (track.hitCounter >= CONFIG.CONFIRMATION_FRAMES_MEDIUM) {
                track.confirmed = true;
                return true;
            }
        }
        return false;
    }
    computeIoU(b1, b2) {
        const x1 = Math.max(b1.x, b2.x);
        const y1 = Math.max(b1.y, b2.y);
        const x2 = Math.min(b1.x + b1.width, b2.x + b2.width);
        const y2 = Math.min(b1.y + b1.height, b2.y + b2.height);
        if (x2 < x1 || y2 < y1) return 0;
        const intersection = (x2 - x1) * (y2 - y1);
        const area1 = b1.width * b1.height;
        const area2 = b2.width * b2.height;
        return intersection / (area1 + area2 - intersection);
    }
}
const hazardGuard = new HazardGuard();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/detection.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/detection.ts
__turbopack_context__.s([
    "getCurrentAlert",
    ()=>getCurrentAlert,
    "runRealDrowsinessDetection",
    ()=>runRealDrowsinessDetection,
    "runRealHazardDetection",
    ()=>runRealHazardDetection,
    "triggerAlert",
    ()=>triggerAlert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tensorflow/tfjs/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tensorflow/tfjs-core/dist/globals.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sounds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sounds.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$biometric$2d$eye$2d$model$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/biometric-eye-model.ts [app-client] (ecmascript)");
// ----------------- Hazard Detection -----------------
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hazard$2d$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hazard-guard.ts [app-client] (ecmascript)");
;
;
;
;
// --- Global State ---
let tfReady = null;
function ensureTFReady() {
    if (!tfReady) {
        tfReady = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tensorflow$2f$tfjs$2d$core$2f$dist$2f$globals$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ready"]();
    }
    return tfReady;
}
// Instantiate the engine permanently so calibration persists
const eyeEngine = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$biometric$2d$eye$2d$model$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BiometricEyeEngine"]();
// Tracking state for UI counters
let blinkCount = 0;
let wasBlinking = false;
let lastBlinkTime = 0;
// Track alert state
let lastAlertTime = 0;
const ALERT_COOLDOWN = 10000;
let currentAlert = null;
let lastAlertType = null;
// Reset tracking when no face is detected for a while
let noFaceCounter = 0;
const MAX_NO_FACE_FRAMES = 10;
// Debug state
const debug = {
    frameCount: 0
};
function triggerAlert(type) {
    const now = Date.now();
    if (type === lastAlertType && now - lastAlertTime < ALERT_COOLDOWN) {
        return;
    }
    if (type !== currentAlert) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sounds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alertSound"].play();
    }
    currentAlert = type;
    lastAlertType = type;
    lastAlertTime = now;
    setTimeout(()=>{
        if (currentAlert === type) {
            currentAlert = null;
        }
    }, 5000);
}
function getCurrentAlert() {
    return currentAlert;
}
async function runRealDrowsinessDetection(videoEl) {
    if (!videoEl || videoEl.readyState < 2) return null;
    await ensureTFReady();
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureFaceMeshLoaded"])();
    const model = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFaceMeshModel"])();
    if (!model) return null;
    try {
        const outputs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runFaceMesh"])(videoEl);
        if (!outputs || outputs.length < 2) return null;
        const [landmarksTensor, confidenceTensor] = outputs;
        // Process Tensors
        const landmarksData = await landmarksTensor.array();
        const confidenceData = await confidenceTensor.arraySync();
        landmarksTensor.dispose();
        confidenceTensor.dispose();
        const landmarksArray = Array.isArray(landmarksData[0]) ? landmarksData[0] : landmarksData;
        // Check validity
        if (!landmarksArray || landmarksArray.length < 468 * 3) {
            noFaceCounter++;
            if (noFaceCounter > MAX_NO_FACE_FRAMES) {
            // Optionally reset engine filters? eyeEngine.reset() if we implemented it
            // For now, the engine handles time gaps natively
            }
            return null;
        }
        noFaceCounter = 0;
        // Convert to Point[] {x, y, z}
        // We only need 2D for the current engine, but z might be useful later
        // landmarksArray comes as [x,y,z, x,y,z, ...] normalized 0-1 (usually)
        // IMPORTANT: FaceMesh usually outputs normalized coordinates.
        // The engine expects raw pixels OR consistent units. 
        // If we pass normalized, aspect ratio matters. 
        // The engine calculates EAR (ratio), so scale cancels out mostly.
        // However, for velocity, we need consistent time.
        const points = [];
        for(let i = 0; i < landmarksArray.length; i += 3){
            points.push({
                x: landmarksArray[i],
                y: landmarksArray[i + 1],
                z: landmarksArray[i + 2]
            });
        }
        // --- ENGINE PROCESSING ---
        const eyeState = eyeEngine.processFrame(points);
        if (!eyeState) return null;
        // --- Post-Processing & State Tracking ---
        // Blink Counting (Rising Edge of isBlink)
        // But engine.isBlink might be true for multiple frames.
        // We want to count 'events'.
        const now = Date.now();
        if (eyeState.isBlink && !wasBlinking) {
            blinkCount++;
            wasBlinking = true;
            lastBlinkTime = now;
        } else if (!eyeState.isBlink) {
            wasBlinking = false;
        }
        // Calculate Frequency
        // Simple window: blinks in last minute? 
        // For now we just return a placeholder or accumulated
        const blinkFrequency = 12; // Placeholder or calculate properly
        // Drowsiness Decision
        // Use the engine's rigorous classification
        // We remove the explicit >30 check because normal blinks drop below 30 but shouldn't trigger "Not Alert" status
        // unless the engine detects microsleep or drowsiness patterns.
        const isAlert = !eyeState.isDrowsy && !eyeState.isMicrosleep;
        // Debug Log
        if (debug.frameCount++ % 30 === 0) {
            console.log("Biometric Eye State:", {
                openness: eyeState.opennessPercent.toFixed(1) + "%",
                raw: eyeState.rawOpennessMetric.toFixed(3),
                isBlink: eyeState.isBlink,
                isMicrosleep: eyeState.isMicrosleep,
                state: isAlert ? "ALERT" : "DROWSY"
            });
        }
        return {
            // Core Requirement: "Continuous percentage (0-100)"
            alertnessScore: Math.round(eyeState.opennessPercent),
            // Pass the raw EAR equivalent for legacy UI graphs if needed
            // (normalized to 0-1 range approx for UI)
            eyeAspectRatio: eyeState.rawOpennessMetric,
            blinkCount,
            blinkFrequency: 0,
            isAlert,
            // Placeholders
            headTilt: null,
            lookingAway: false,
            yawning: false,
            lastUpdated: now
        };
    } catch (err) {
        console.warn("FaceMesh detection failed:", err);
        return null;
    }
}
;
const HAZARD_MIN_CONFIDENCE = 0.20 // Lowered further for "hard" classes
;
const COCO_TO_HAZARD_CLASS = {
    person: "pedestrian",
    bicycle: "cyclist",
    car: "vehicle",
    motorcycle: "vehicle",
    airplane: "other",
    bus: "vehicle",
    train: "vehicle",
    truck: "vehicle",
    boat: "other",
    // Aggressive Mapping for "Fallen Trees" / "Road Obstacles"
    bench: "fallen_tree",
    chair: "fallen_tree",
    couch: "fallen_tree",
    bed: "fallen_tree",
    diningtable: "fallen_tree",
    pottedplant: "fallen_tree",
    // Aggressive Mapping for "Potholes/Debris"
    // Using small low objects as proxies
    backpack: "pothole",
    handbag: "pothole",
    suitcase: "debris",
    umbrella: "debris",
    bottle: "pothole",
    cup: "pothole",
    bowl: "pothole",
    // Animals
    bird: "animal",
    cat: "animal",
    dog: "dog",
    horse: "animal_large",
    sheep: "animal_large",
    cow: "cow",
    elephant: "animal_large",
    bear: "bear",
    zebra: "animal_large",
    giraffe: "animal_large",
    // Misc Debris
    traffic_light: "other",
    fire_hydrant: "road_barrier",
    stop_sign: "road_barrier",
    parking_meter: "road_barrier",
    tie: "other",
    frisbee: "debris",
    skis: "debris",
    snowboard: "debris",
    sports_ball: "debris",
    kite: "debris",
    baseball_bat: "debris",
    baseball_glove: "debris",
    skateboard: "debris",
    surfboard: "debris",
    tennis_racket: "debris",
    wine_glass: "debris",
    fork: "debris",
    knife: "debris",
    spoon: "debris",
    banana: "debris",
    apple: "debris",
    sandwich: "debris",
    orange: "debris",
    broccoli: "debris",
    carrot: "debris",
    hot_dog: "debris",
    pizza: "debris",
    donut: "debris",
    cake: "debris",
    toilet: "debris",
    tv: "debris",
    laptop: "debris",
    mouse: "debris",
    remote: "debris",
    keyboard: "debris",
    cell_phone: "debris",
    microwave: "debris",
    oven: "debris",
    toaster: "debris",
    sink: "debris",
    refrigerator: "debris",
    book: "debris",
    clock: "debris",
    vase: "debris",
    scissors: "debris",
    teddy_bear: "debris",
    hair_drier: "debris",
    toothbrush: "debris"
};
function mapToHazardClass(cls) {
    // COCO classes use underscores or spaces depending on version, normalize
    const normalized = cls.toLowerCase().replace(" ", "_");
    return COCO_TO_HAZARD_CLASS[normalized] ?? "other";
}
async function runRealHazardDetection(videoEl) {
    if (!videoEl) return [];
    // await ensureTFReady(); // MediaPipe doesn't depend on global TF readiness same way? but we keep for FaceMesh
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadModels"])();
    const detector = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getObjectDetector"])();
    if (!detector) return [];
    try {
        // MediaPipe requires timestamp
        const now = Date.now();
        const result = detector.detectForVideo(videoEl, now);
        if (!result || !result.detections) return [];
        const rawHazards = [];
        for(let i = 0; i < result.detections.length; i++){
            const det = result.detections[i];
            const category = det.categories[0];
            if (!category || category.score < HAZARD_MIN_CONFIDENCE) continue;
            const mappedClass = mapToHazardClass(category.categoryName?.toLowerCase() || 'unknown');
            // Filter out 'other' immediately
            if (mappedClass === 'other') continue;
            // MediaPipe BBox is { originX, originY, width, height, angle } (pixels)
            // We need to normalize to 0-1
            const bbox = det.boundingBox;
            if (!bbox) continue;
            rawHazards.push({
                id: `${now}-${i}`,
                objectClass: mappedClass,
                confidence: category.score,
                // Severity Logic
                severity: mappedClass === 'pedestrian' || mappedClass === 'cow' || mappedClass === 'wrong_way_vehicle' ? "critical" : "high",
                bbox: {
                    x: bbox.originX / videoEl.videoWidth,
                    y: bbox.originY / videoEl.videoHeight,
                    width: bbox.width / videoEl.videoWidth,
                    height: bbox.height / videoEl.videoHeight
                },
                timestamp: now
            });
        }
        // --- PIPELINE STEP 2: HAZARD GUARD ---
        const filteredHazards = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hazard$2d$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hazardGuard"].process(rawHazards, videoEl.videoWidth, videoEl.videoHeight);
        return filteredHazards;
    } catch (err) {
        console.error("Hazard detection failed:", err);
        return [];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://uccchhgmaazdmiimwoup.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjY2NoaGdtYWF6ZG1paW13b3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTM0MjgsImV4cCI6MjA4MDg2OTQyOH0.Ixn8eSAbaL9hRJhcJhYn_Ax2ho7X7OcDj6MK0tSYP3g"));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase/analytics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "endVaseSession",
    ()=>endVaseSession,
    "getEmergencyContact",
    ()=>getEmergencyContact,
    "logDrowsinessEvent",
    ()=>logDrowsinessEvent,
    "logHazardEvents",
    ()=>logHazardEvents,
    "logVaseAlert",
    ()=>logVaseAlert,
    "saveEmergencyContact",
    ()=>saveEmergencyContact,
    "startVaseSession",
    ()=>startVaseSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)");
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
async function getUserId() {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            // Suppress "Auth session missing!" error which is expected for anon users
            if (!error.message.includes("Auth session missing")) {
                console.error("Supabase getUser error", error);
            }
            return null;
        }
        return data.user?.id ?? null;
    } catch (err) {
        return null;
    }
}
async function logDrowsinessEvent(args) {
    const userId = await getUserId();
    if (!userId) return;
    const { error } = await supabase.from("drowsiness_events").insert({
        user_id: userId,
        organization_id: null,
        alertness_score: args.alertnessScore,
        eye_aspect_ratio: args.ear,
        blink_frequency: args.blinkFrequency,
        triggered_alert: args.triggeredAlert,
        alert_type: null,
        emergency_contact: null,
        session_id: args.sessionId
    });
    if (error) console.error("logDrowsinessEvent error", error);
}
async function logHazardEvents(hazards, sessionId) {
    if (!hazards.length) return;
    const userId = await getUserId();
    if (!userId) return;
    const rows = hazards.map((h)=>({
            user_id: userId,
            organization_id: null,
            object_class: h.objectClass,
            confidence: h.confidence,
            severity_level: h.severity,
            bbox: h.bbox,
            frame_source: "webcam",
            frame_url: null,
            location_lat: null,
            location_lng: null,
            highway_name: null,
            session_id: sessionId
        }));
    const { error } = await supabase.from("hazard_detections").insert(rows);
    if (error) console.error("logHazardEvents error", error);
}
async function startVaseSession() {
    const userId = await getUserId();
    if (!userId) return null;
    const { data, error } = await supabase.from("vase_sessions").insert({
        user_id: userId,
        organization_id: null,
        start_time: new Date().toISOString(),
        total_alerts: 0,
        hazards_detected: 0,
        emergency_contact_notified: false
    }).select("id").single();
    if (error) {
        console.error("startVaseSession error", error);
        return null;
    }
    return data?.id ?? null;
}
async function endVaseSession(args) {
    if (!args.sessionId) return;
    const end = new Date();
    const durationSeconds = args.startTime ? Math.round((end.getTime() - args.startTime.getTime()) / 1000) : null;
    const { error } = await supabase.from("vase_sessions").update({
        end_time: end.toISOString(),
        duration_seconds: durationSeconds,
        total_alerts: args.totalAlerts,
        average_alertness: args.averageAlertness,
        hazards_detected: args.hazardsDetected,
        emergency_contact_notified: args.emergencyContactNotified
    }).eq("id", args.sessionId);
    if (error) console.error("endVaseSession error", error);
}
async function logVaseAlert(args) {
    try {
        if (!supabase) {
            console.warn('Supabase client not initialized');
            return;
        }
        // Only log in production or if explicitly enabled in development
        if (("TURBOPACK compile-time value", "development") === 'development' && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_ENABLE_ANALYTICS_LOGGING) {
            console.log('VASE Alert (not logged in development):', args.title);
            return;
        }
        const { error } = await supabase.from("alerts").insert({
            detection_id: null,
            camera_id: null,
            organization_id: null,
            severity: args.severity,
            status: "active",
            title: args.title,
            description: args.description,
            session_id: args.sessionId,
            created_at: new Date().toISOString()
        });
        if (error) {
            console.error('Failed to log VASE alert:', {
                error,
                alertData: args,
                timestamp: new Date().toISOString()
            });
        } else {
            console.log('VASE alert logged successfully:', args.title);
        }
    } catch (err) {
        console.error('Unexpected error in logVaseAlert:', {
            error: err,
            alertData: args,
            timestamp: new Date().toISOString()
        });
    }
}
async function saveEmergencyContact(email) {
    const userId = await getUserId();
    if (!userId) {
        console.warn("Cannot save contact: No user logged in");
        return null;
    }
    // Upsert into emergency_contacts table
    // Assuming table structure matches interface roughly or user provided it
    // We try to update if exists for this user, or insert.
    // Since we don't have exact PK knowledge, we assume user_id is unique or we use a query to find existing.
    // Strategy: Delete old, Insert new (simplest for single contact enforcement)
    // Or better: UPSERT based on user_id if that's a constraint.
    // Let's try explicit upsert logic if we had a constraint, but here we'll just try to INSERT and handle error?
    // User said "hook it wuth supabase databse we are using before".
    // We will look for an existing contact first.
    const { data: existing } = await supabase.from("emergency_contacts").select("id").eq("user_id", userId).limit(1).single();
    let error;
    if (existing) {
        const res = await supabase.from("emergency_contacts").update({
            name: "VASE Emergency Contact",
            phone: email,
            updated_at: new Date().toISOString()
        }).eq("id", existing.id);
        error = res.error;
    } else {
        const res = await supabase.from("emergency_contacts").insert({
            user_id: userId,
            name: "VASE Emergency Contact",
            phone: email,
            is_primary: true,
            notify_on_hazard: true,
            notify_on_drowsiness: true
        });
        error = res.error;
    }
    if (error) {
        console.error("saveEmergencyContact error details:", JSON.stringify(error, null, 2));
        throw new Error(`Supabase Error: ${error.message || JSON.stringify(error)}`);
    }
    return true;
}
async function getEmergencyContact() {
    const userId = await getUserId();
    if (!userId) return null;
    const { data, error } = await supabase.from("emergency_contacts").select("*").eq("user_id", userId).limit(1).single();
    if (error) {
        // Ignore "Row not found" errors
        if (error.code !== 'PGRST116') {
            console.error("getEmergencyContact error", error);
        }
        return null;
    }
    // Retrieve email from phone column
    return data.phone || null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:hover:text-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 dark:hover:text-foreground',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/alert-notification.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertNotification",
    ()=>AlertNotification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function AlertNotification({ type, message, onClose }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AlertNotification.useEffect": ()=>{
            const timer = setTimeout({
                "AlertNotification.useEffect.timer": ()=>{
                    onClose();
                }
            }["AlertNotification.useEffect.timer"], 5000); // Auto-close after 5 seconds
            return ({
                "AlertNotification.useEffect": ()=>clearTimeout(timer)
            })["AlertNotification.useEffect"];
        }
    }["AlertNotification.useEffect"], [
        onClose
    ]);
    if (!type) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                x: '100%',
                opacity: 0
            },
            animate: {
                x: 0,
                opacity: 1
            },
            exit: {
                x: '100%',
                opacity: 0
            },
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300
            },
            className: "fixed bottom-6 right-6 z-50 max-w-sm w-full bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-start space-x-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "h-6 w-6 text-white flex-shrink-0 mt-0.5"
                }, void 0, false, {
                    fileName: "[project]/components/ui/alert-notification.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-medium",
                            children: type === 'hazard' ? 'Hazard Detected!' : 'Drowsiness Detected!'
                        }, void 0, false, {
                            fileName: "[project]/components/ui/alert-notification.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm opacity-90",
                            children: message
                        }, void 0, false, {
                            fileName: "[project]/components/ui/alert-notification.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/alert-notification.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "text-white opacity-70 hover:opacity-100 transition-opacity",
                    "aria-label": "Close alert",
                    children: "✕"
                }, void 0, false, {
                    fileName: "[project]/components/ui/alert-notification.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/alert-notification.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-notification.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(AlertNotification, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = AlertNotification;
var _c;
__turbopack_context__.k.register(_c, "AlertNotification");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center px-6 [.border-t]:pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/switch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Switch",
    ()=>Switch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-switch/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Switch({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "switch",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Thumb"], {
            "data-slot": "switch-thumb",
            className: 'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
        }, void 0, false, {
            fileName: "[project]/components/ui/switch.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/switch.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Switch;
;
var _c;
__turbopack_context__.k.register(_c, "Switch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden', {
    variants: {
        variant: {
            default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
            secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
            destructive: 'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'span';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/progress.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Progress",
    ()=>Progress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-progress/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Progress({ className, value, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "progress",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "progress-indicator",
            className: "bg-primary h-full w-full flex-1 transition-all",
            style: {
                transform: `translateX(-${100 - (value || 0)}%)`
            }
        }, void 0, false, {
            fileName: "[project]/components/ui/progress.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/progress.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Progress;
;
var _c;
__turbopack_context__.k.register(_c, "Progress");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function Dialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Dialog;
function DialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = DialogTrigger;
function DialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = DialogPortal;
function DialogClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        "data-slot": "dialog-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c3 = DialogClose;
function DialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c4 = DialogOverlay;
function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        "data-slot": "dialog-portal",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg', className),
                ...props,
                children: [
                    children,
                    showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        "data-slot": "dialog-close",
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/dialog.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c5 = DialogContent;
function DialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-2 text-center sm:text-left', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_c6 = DialogHeader;
function DialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c7 = DialogFooter;
function DialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-lg leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_c8 = DialogTitle;
function DialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_c9 = DialogDescription;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Dialog");
__turbopack_context__.k.register(_c1, "DialogTrigger");
__turbopack_context__.k.register(_c2, "DialogPortal");
__turbopack_context__.k.register(_c3, "DialogClose");
__turbopack_context__.k.register(_c4, "DialogOverlay");
__turbopack_context__.k.register(_c5, "DialogContent");
__turbopack_context__.k.register(_c6, "DialogHeader");
__turbopack_context__.k.register(_c7, "DialogFooter");
__turbopack_context__.k.register(_c8, "DialogTitle");
__turbopack_context__.k.register(_c9, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/vision-ai-logo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VisionAILogo",
    ()=>VisionAILogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function VisionAILogo({ className, size = "md", animate = false, showText = true }) {
    const sizes = {
        sm: {
            icon: 24,
            text: "text-lg"
        },
        md: {
            icon: 32,
            text: "text-xl"
        },
        lg: {
            icon: 48,
            text: "text-2xl"
        },
        xl: {
            icon: 64,
            text: "text-3xl"
        }
    };
    const { icon: iconSize, text: textSize } = sizes[size];
    const EyeIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: iconSize,
        height: iconSize,
        viewBox: "0 0 64 64",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].path, {
                d: "M32 12C18 12 6 32 6 32C6 32 18 52 32 52C46 52 58 32 58 32C58 32 46 12 32 12Z",
                stroke: "url(#eyeGradient)",
                strokeWidth: "3",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                fill: "none",
                initial: animate ? {
                    pathLength: 0
                } : {
                    pathLength: 1
                },
                animate: {
                    pathLength: 1
                },
                transition: {
                    duration: 1.5,
                    ease: "easeInOut"
                }
            }, void 0, false, {
                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].circle, {
                cx: "32",
                cy: "32",
                r: "12",
                stroke: "url(#irisGradient)",
                strokeWidth: "2.5",
                fill: "none",
                initial: animate ? {
                    scale: 0
                } : {
                    scale: 1
                },
                animate: {
                    scale: 1
                },
                transition: {
                    duration: 0.5,
                    delay: animate ? 0.8 : 0
                }
            }, void 0, false, {
                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].circle, {
                cx: "32",
                cy: "32",
                r: "5",
                fill: "url(#pupilGradient)",
                initial: animate ? {
                    scale: 0
                } : {
                    scale: 1
                },
                animate: animate ? {
                    scale: [
                        0,
                        1.2,
                        1
                    ]
                } : {
                    scale: 1
                },
                transition: {
                    duration: 0.6,
                    delay: animate ? 1 : 0
                }
            }, void 0, false, {
                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].circle, {
                cx: "36",
                cy: "28",
                r: "2",
                fill: "white",
                opacity: 0.8,
                initial: animate ? {
                    opacity: 0
                } : {
                    opacity: 0.8
                },
                animate: {
                    opacity: 0.8
                },
                transition: {
                    duration: 0.3,
                    delay: animate ? 1.3 : 0
                }
            }, void 0, false, {
                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].g, {
                initial: animate ? {
                    opacity: 0
                } : {
                    opacity: 1
                },
                animate: {
                    opacity: 1
                },
                transition: {
                    duration: 0.5,
                    delay: animate ? 1.5 : 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "20",
                        y1: "32",
                        x2: "26",
                        y2: "32",
                        stroke: "url(#scanGradient)",
                        strokeWidth: "1.5",
                        opacity: "0.6"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/vision-ai-logo.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "38",
                        y1: "32",
                        x2: "44",
                        y2: "32",
                        stroke: "url(#scanGradient)",
                        strokeWidth: "1.5",
                        opacity: "0.6"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/vision-ai-logo.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "32",
                        y1: "20",
                        x2: "32",
                        y2: "26",
                        stroke: "url(#scanGradient)",
                        strokeWidth: "1.5",
                        opacity: "0.6"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/vision-ai-logo.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "32",
                        y1: "38",
                        x2: "32",
                        y2: "44",
                        stroke: "url(#scanGradient)",
                        strokeWidth: "1.5",
                        opacity: "0.6"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/vision-ai-logo.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "eyeGradient",
                        x1: "6",
                        y1: "32",
                        x2: "58",
                        y2: "32",
                        gradientUnits: "userSpaceOnUse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                stopColor: "#4f46e5"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0.5",
                                stopColor: "#06b6d4"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#22c55e"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/vision-ai-logo.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "irisGradient",
                        x1: "20",
                        y1: "32",
                        x2: "44",
                        y2: "32",
                        gradientUnits: "userSpaceOnUse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                stopColor: "#4f46e5"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#06b6d4"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/vision-ai-logo.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: "pupilGradient",
                        cx: "32",
                        cy: "32",
                        r: "5",
                        gradientUnits: "userSpaceOnUse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                stopColor: "#1e1b4b"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#4f46e5"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/vision-ai-logo.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "scanGradient",
                        x1: "0",
                        y1: "0",
                        x2: "1",
                        y2: "0",
                        gradientUnits: "objectBoundingBox",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                stopColor: "#22c55e"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#06b6d4"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/vision-ai-logo.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/vision-ai-logo.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    EyeIcon,
                    animate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "absolute inset-0 blur-xl bg-primary/30 rounded-full",
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: [
                                0,
                                0.5,
                                0.3
                            ]
                        },
                        transition: {
                            duration: 2,
                            delay: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/ui/vision-ai-logo.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            showText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-bold tracking-tight", textSize),
                initial: animate ? {
                    opacity: 0,
                    x: -10
                } : {
                    opacity: 1
                },
                animate: {
                    opacity: 1,
                    x: 0
                },
                transition: {
                    duration: 0.5,
                    delay: animate ? 0.5 : 0
                },
                children: "Vision-AI"
            }, void 0, false, {
                fileName: "[project]/components/ui/vision-ai-logo.tsx",
                lineNumber: 124,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/vision-ai-logo.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_c = VisionAILogo;
var _c;
__turbopack_context__.k.register(_c, "VisionAILogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/dvse/engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Vision-AI Safety Engine (VASE) - Core Engine Logic
__turbopack_context__.s([
    "assessRisk",
    ()=>assessRisk,
    "calculateEAR",
    ()=>calculateEAR,
    "calculateHazardRisk",
    ()=>calculateHazardRisk,
    "createAlertnessWindow",
    ()=>createAlertnessWindow,
    "earToAlertness",
    ()=>earToAlertness,
    "getHazardSeverity",
    ()=>getHazardSeverity,
    "getStatusBgColor",
    ()=>getStatusBgColor,
    "getStatusColor",
    ()=>getStatusColor,
    "updateAlertnessWindow",
    ()=>updateAlertnessWindow
]);
// Configuration constants
const CONFIG = {
    ALERTNESS_THRESHOLD: 50,
    HAZARD_CONFIDENCE_THRESHOLD: 0.5,
    RISK_WEIGHTS: {
        drowsiness: 0.6,
        hazard: 0.4
    },
    ALERTNESS_WINDOW_SIZE: 20,
    CRITICAL_HAZARDS: [
        "cow",
        "buffalo",
        "elephant",
        "wrong_way_vehicle",
        "pedestrian",
        "broken_vehicle"
    ],
    HIGH_RISK_THRESHOLD: 70,
    CAUTION_THRESHOLD: 40
};
function createAlertnessWindow(size = CONFIG.ALERTNESS_WINDOW_SIZE) {
    return {
        samples: [],
        windowSize: size,
        average: 100
    };
}
function updateAlertnessWindow(window, newSample) {
    const newSamples = [
        ...window.samples,
        newSample
    ];
    if (newSamples.length > window.windowSize) {
        newSamples.shift();
    }
    const average = newSamples.reduce((a, b)=>a + b, 0) / newSamples.length;
    return {
        ...window,
        samples: newSamples,
        average
    };
}
function calculateEAR(eyePoints) {
    if (eyePoints.length < 6) return 0.3 // Default open
    ;
    // Vertical distances
    const v1 = Math.sqrt(Math.pow(eyePoints[1].x - eyePoints[5].x, 2) + Math.pow(eyePoints[1].y - eyePoints[5].y, 2));
    const v2 = Math.sqrt(Math.pow(eyePoints[2].x - eyePoints[4].x, 2) + Math.pow(eyePoints[2].y - eyePoints[4].y, 2));
    // Horizontal distance
    const h = Math.sqrt(Math.pow(eyePoints[0].x - eyePoints[3].x, 2) + Math.pow(eyePoints[0].y - eyePoints[3].y, 2));
    if (h === 0) return 0.3;
    return (v1 + v2) / (2.0 * h);
}
function earToAlertness(ear) {
    // EAR typically ranges from 0.15 (closed) to 0.35 (open)
    const minEAR = 0.15;
    const maxEAR = 0.35;
    const normalized = Math.max(0, Math.min(1, (ear - minEAR) / (maxEAR - minEAR)));
    return Math.round(normalized * 100);
}
function getHazardSeverity(objectClass, confidence) {
    const isCriticalClass = CONFIG.CRITICAL_HAZARDS.includes(objectClass);
    if (isCriticalClass && confidence > 0.8) return "critical";
    if (isCriticalClass && confidence > 0.6) return "high";
    if (confidence > 0.8) return "high";
    if (confidence > 0.6) return "medium";
    return "low";
}
function calculateHazardRisk(hazards) {
    if (hazards.length === 0) return 0;
    let maxRisk = 0;
    for (const hazard of hazards){
        let risk = hazard.confidence * 100;
        // Boost risk for critical hazards
        if (CONFIG.CRITICAL_HAZARDS.includes(hazard.objectClass)) {
            risk = Math.min(100, risk * 1.3);
        }
        // Severity multiplier
        const severityMultiplier = {
            critical: 1.0,
            high: 0.8,
            medium: 0.5,
            low: 0.3
        };
        risk *= severityMultiplier[hazard.severity];
        maxRisk = Math.max(maxRisk, risk);
    }
    return Math.round(maxRisk);
}
function assessRisk(drowsiness, hazards, smoothedAlertness) {
    // Calculate individual risks
    const alertnessRisk = drowsiness ? Math.max(0, 100 - smoothedAlertness) : 0;
    const hazardRisk = calculateHazardRisk(hazards);
    // Combined risk score (weighted)
    const riskScore = Math.round(alertnessRisk * CONFIG.RISK_WEIGHTS.drowsiness + hazardRisk * CONFIG.RISK_WEIGHTS.hazard);
    // Determine overall status
    let overallStatus = "safe";
    if (riskScore >= CONFIG.HIGH_RISK_THRESHOLD) {
        overallStatus = "high-risk";
    } else if (riskScore >= CONFIG.CAUTION_THRESHOLD) {
        overallStatus = "caution";
    }
    // Determine if alert should trigger
    const shouldAlert = smoothedAlertness < CONFIG.ALERTNESS_THRESHOLD || hazards.some((h)=>h.severity === "critical" || h.severity === "high");
    // Generate alert message
    let alertMessage = null;
    if (shouldAlert) {
        if (smoothedAlertness < CONFIG.ALERTNESS_THRESHOLD && hazards.length > 0) {
            alertMessage = `DANGER: Drowsy driving detected + ${hazards[0].objectClass} on road!`;
        } else if (smoothedAlertness < CONFIG.ALERTNESS_THRESHOLD) {
            alertMessage = "ALERT: Drowsiness detected - Please take a break!";
        } else if (hazards.length > 0) {
            const criticalHazard = hazards.find((h)=>h.severity === "critical");
            if (criticalHazard) {
                alertMessage = `DANGER: ${criticalHazard.objectClass.replace("_", " ")} detected ahead!`;
            } else {
                alertMessage = `WARNING: ${hazards[0].objectClass.replace("_", " ")} detected on road`;
            }
        }
    }
    return {
        overallStatus,
        riskScore,
        alertnessRisk,
        hazardRisk,
        timestamp: Date.now(),
        shouldAlert,
        alertMessage
    };
}
function getStatusColor(status) {
    switch(status){
        case "safe":
            return "text-success";
        case "caution":
            return "text-warning";
        case "high-risk":
            return "text-destructive";
    }
}
function getStatusBgColor(status) {
    switch(status){
        case "safe":
            return "bg-success";
        case "caution":
            return "bg-warning";
        case "high-risk":
            return "bg-destructive";
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dualvision/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DualVisionDemo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/models.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$detection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/detection.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/analytics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$notification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-notification.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/progress.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as Video>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VideoOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/video-off.js [app-client] (ecmascript) <export default as VideoOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-x.js [app-client] (ecmascript) <export default as VolumeX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-client] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$vision$2d$ai$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/vision-ai-logo.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dvse$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dvse/engine.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// Hazard class labels
const hazardLabels = {
    cow: "Cow",
    dog: "Dog",
    buffalo: "Buffalo",
    pothole: "Pothole",
    debris: "Debris",
    pedestrian: "Pedestrian",
    broken_vehicle: "Broken Vehicle",
    fallen_tree: "Fallen Tree",
    vehicle: "Vehicle",
    animal: "Animal",
    animal_large: "Large Animal",
    bear: "Bear",
    cat: "Cat",
    horse: "Horse"
};
function DualVisionDemo() {
    _s();
    // Camera refs
    const frontVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rearVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const frontCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rearCanvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // State
    const [frontCameraActive, setFrontCameraActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rearCameraActive, setRearCameraActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProcessing, setIsProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [alert, setAlert] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type: null,
        message: ''
    });
    const [soundEnabled, setSoundEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [emergencyContact, setEmergencyContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // VASE State
    const [drowsiness, setDrowsiness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hazards, setHazards] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [riskAssessment, setRiskAssessment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        overallStatus: "safe",
        riskScore: 0,
        alertnessRisk: 0,
        hazardRisk: 0,
        timestamp: Date.now(),
        shouldAlert: false,
        alertMessage: null
    });
    const [alertnessWindow, setAlertnessWindow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DualVisionDemo.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dvse$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAlertnessWindow"])()
    }["DualVisionDemo.useState"]);
    const [alertHistory, setAlertHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sessionStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sessionIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const alertCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const hazardCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const alertnessSumRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const alertnessSamplesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastAlertTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Load persistence
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DualVisionDemo.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEmergencyContact"])().then({
                "DualVisionDemo.useEffect": (email)=>{
                    if (email) setEmergencyContact(email);
                }
            }["DualVisionDemo.useEffect"]);
        }
    }["DualVisionDemo.useEffect"], []);
    const handleSaveContact = async ()=>{
        if (!emergencyContact || !emergencyContact.includes("@")) {
            window.alert("Please enter a valid email.");
            return;
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveEmergencyContact"])(emergencyContact);
            window.alert(`Emergency contact saved to Supabase: ${emergencyContact}`);
        } catch (e) {
            console.error(e);
            window.alert("Failed to save contact. See console.");
        }
    };
    // Startup Guide State
    const [showGuide, setShowGuide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Show guide on mount once
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DualVisionDemo.useEffect": ()=>{
            setShowGuide(true);
        }
    }["DualVisionDemo.useEffect"], []);
    // ================= CAMERA DEVICE HELPER =================
    async function getCameraDevices() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter((d)=>d.kind === "videoinput");
        // FRONT CAMERA → Laptop webcam
        const frontCam = cams.find((c)=>c.label.toLowerCase().includes("integrated")) || cams[0];
        // REAR CAMERA → Phone webcam (DroidCam / Iriun)
        const rearCam = cams.find((c)=>c.label.toLowerCase().includes("iriun") || c.label.toLowerCase().includes("droid"));
        return {
            frontCam,
            rearCam
        };
    }
    // Main detection loop
    const runDetection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DualVisionDemo.useCallback[runDetection]": async ()=>{
            // Drowsiness (front)
            let newDrowsiness = null;
            if (frontCameraActive && frontVideoRef.current) {
                try {
                    const dr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$detection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runRealDrowsinessDetection"])(frontVideoRef.current);
                    if (dr) {
                        newDrowsiness = dr;
                        setDrowsiness(dr);
                        const newWindow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dvse$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateAlertnessWindow"])(alertnessWindow, dr.alertnessScore);
                        setAlertnessWindow(newWindow);
                    }
                } catch (err) {
                    console.error("Real drowsiness detection error:", err);
                }
            } else {
                newDrowsiness = drowsiness;
            }
            // Hazards (rear)
            let newHazards = [];
            if (rearCameraActive && rearVideoRef.current) {
                try {
                    newHazards = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$detection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runRealHazardDetection"])(rearVideoRef.current);
                    setHazards(newHazards);
                } catch (err) {
                    console.error("Real hazard detection error:", err);
                    newHazards = [];
                }
            } else {
                newHazards = [];
                setHazards([]);
            }
            // Access Risk
            const smoothed = alertnessWindow.average;
            const assessment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dvse$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assessRisk"])(newDrowsiness, newHazards, smoothed);
            setRiskAssessment(assessment);
            // accumulate stats
            if (newDrowsiness) {
                alertnessSumRef.current += newDrowsiness.alertnessScore;
                alertnessSamplesRef.current += 1;
            }
            hazardCountRef.current += newHazards.length;
            // Log per-tick
            if (newDrowsiness) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logDrowsinessEvent"])({
                    alertnessScore: newDrowsiness.alertnessScore,
                    ear: newDrowsiness.eyeAspectRatio,
                    blinkFrequency: newDrowsiness.blinkFrequency,
                    triggeredAlert: assessment.shouldAlert,
                    sessionId: sessionIdRef.current
                });
            }
            if (newHazards.length > 0) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logHazardEvents"])(newHazards, sessionIdRef.current);
            }
            // Handle Alerts
            if (assessment.shouldAlert) {
                alertCountRef.current += 1;
                // Determine Alert Type
                let alertType = null;
                let detailedMessage = "";
                if (assessment.overallStatus === 'high-risk' || assessment.hazardRisk > 50) {
                    alertType = 'hazard';
                    // Filter to distinct hazard labels
                    const distinctHazards = Array.from(new Set(newHazards.map({
                        "DualVisionDemo.useCallback[runDetection].distinctHazards": (h)=>hazardLabels[h.objectClass] || h.objectClass
                    }["DualVisionDemo.useCallback[runDetection].distinctHazards"])));
                    detailedMessage = `HAZARD: ${distinctHazards.join(", ")}`;
                } else if (newDrowsiness && newDrowsiness.alertnessScore < 60) {
                    alertType = 'drowsiness';
                    detailedMessage = `DROWSINESS: Alertness ${newDrowsiness.alertnessScore}%`;
                }
                if (alertType) {
                    // DEBOUNCE LOGIC: Only update if different or enough time passed
                    // This prevents "boomerang" flickering
                    const now = Date.now();
                    if (alert.type !== alertType || alert.message !== detailedMessage || now - lastAlertTime.current > 2000) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$detection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["triggerAlert"])(alertType);
                        setAlert({
                            type: alertType,
                            message: detailedMessage
                        });
                        lastAlertTime.current = now;
                        // Verify we don't spam history
                        const lastHistory = alertHistory[alertHistory.length - 1];
                        if (!lastHistory || lastHistory.message !== detailedMessage || now - lastHistory.time.getTime() > 5000) {
                            setAlertHistory({
                                "DualVisionDemo.useCallback[runDetection]": (prev)=>[
                                        ...prev.slice(-9),
                                        {
                                            time: new Date(),
                                            message: detailedMessage,
                                            status: assessment.overallStatus
                                        }
                                    ]
                            }["DualVisionDemo.useCallback[runDetection]"]);
                        }
                    }
                    // Auto-send email logic (Backend API)
                    const highSeverityHazards = [
                        "cow",
                        "buffalo",
                        "deer",
                        "bear",
                        "fallen_tree",
                        "pothole",
                        "wrong_way_vehicle"
                    ];
                    const hasCritical = newHazards.some({
                        "DualVisionDemo.useCallback[runDetection].hasCritical": (h)=>highSeverityHazards.includes(h.objectClass)
                    }["DualVisionDemo.useCallback[runDetection].hasCritical"]);
                    // Triggers email if drowsiness drops below 50 (User Request)
                    const criticalDrowsiness = newDrowsiness && newDrowsiness.alertnessScore < 50;
                    if ((hasCritical || criticalDrowsiness) && emergencyContact) {
                        // Rate Limit: Only send 1 email per 60 seconds to avoid spamming user
                        const lastEmail = localStorage.getItem('last_emergency_email');
                        const now = Date.now();
                        if (!lastEmail || now - parseInt(lastEmail) > 60000) {
                            console.log("Triggering Emergency Email to:", emergencyContact);
                            localStorage.setItem('last_emergency_email', now.toString());
                            fetch('/api/email-alert', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    to: emergencyContact,
                                    subject: `URGENT: Vision-AI ${alertType?.toUpperCase()} Alert`,
                                    message: `Vision-AI detected a critical safety event.\n\nType: ${alertType}\nDetails: ${detailedMessage}\nTime: ${new Date().toLocaleString()}\n\nPlease check on the driver immediately.`
                                })
                            }).catch({
                                "DualVisionDemo.useCallback[runDetection]": (err)=>console.error("Failed to send email:", err)
                            }["DualVisionDemo.useCallback[runDetection]"]);
                        }
                    }
                }
            } else {
                // Clear alert if safe for > 2 seconds (Debounce clearing)
                // This prevents the alert from disappearing instantly if detection flickers for 1 frame
                if (alert.type) {
                    const now = Date.now();
                    if (now - lastAlertTime.current > 2000) {
                        setAlert({
                            type: null,
                            message: ''
                        });
                    }
                }
            }
            // draw boxes
            drawDetections(newHazards);
        }
    }["DualVisionDemo.useCallback[runDetection]"], [
        frontCameraActive,
        rearCameraActive,
        alertnessWindow,
        drowsiness,
        alert,
        soundEnabled,
        emergencyContact,
        alertHistory
    ]);
    // Draw bounding boxes on rear camera canvas
    const drawDetections = (detections)=>{
        const canvas = rearCanvasRef.current;
        const video = rearVideoRef.current;
        if (!canvas || !video) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        detections.forEach((det)=>{
            const x = det.bbox.x * canvas.width;
            const y = det.bbox.y * canvas.height;
            const w = det.bbox.width * canvas.width;
            const h = det.bbox.height * canvas.height;
            // Color based on severity
            const colors = {
                critical: "#ef4444",
                high: "#f59e0b",
                medium: "#06b6d4",
                low: "#22c55e"
            };
            ctx.strokeStyle = colors[det.severity];
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, w, h);
            // Label
            const label = `${hazardLabels[det.objectClass] || det.objectClass} ${Math.round(det.confidence * 100)}%`;
            ctx.fillStyle = ctx.strokeStyle;
            const textWidth = ctx.measureText(label).width;
            ctx.fillRect(x, y - 24, textWidth + 12, 24);
            ctx.fillStyle = "#fff";
            ctx.font = "14px sans-serif";
            ctx.fillText(label, x + 6, y - 7);
        });
    };
    // ================= FRONT CAMERA (Laptop Webcam) =================
    const toggleFrontCamera = async ()=>{
        if (frontCameraActive) {
            // Stop front camera
            const stream = frontVideoRef.current?.srcObject;
            stream?.getTracks().forEach((track)=>track.stop());
            if (frontVideoRef.current) frontVideoRef.current.srcObject = null;
            setFrontCameraActive(false);
            return;
        }
        try {
            const { frontCam } = await getCameraDevices();
            if (!frontCam) {
                console.error("No front (laptop) camera found");
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: frontCam.deviceId,
                    width: 640,
                    height: 480
                }
            });
            if (frontVideoRef.current) {
                frontVideoRef.current.srcObject = stream;
                await frontVideoRef.current.play();
                setFrontCameraActive(true);
                if (!sessionStartRef.current) sessionStartRef.current = new Date();
            }
        } catch (err) {
            console.error("Front camera access failed:", err);
        }
    };
    // ================= REAR CAMERA (Phone Webcam) =================
    const toggleRearCamera = async ()=>{
        if (rearCameraActive) {
            // Stop rear camera
            const stream = rearVideoRef.current?.srcObject;
            stream?.getTracks().forEach((track)=>track.stop());
            if (rearVideoRef.current) rearVideoRef.current.srcObject = null;
            setRearCameraActive(false);
            return;
        }
        try {
            const { rearCam } = await getCameraDevices();
            if (!rearCam) {
                console.error("No phone (rear) camera found. Is DroidCam/Iriun running?");
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: rearCam.deviceId,
                    width: 1280,
                    height: 720
                }
            });
            if (rearVideoRef.current) {
                rearVideoRef.current.srcObject = stream;
                await rearVideoRef.current.play();
                setRearCameraActive(true);
                setHazards([]); // Clear old hazards
                if (!sessionStartRef.current) sessionStartRef.current = new Date();
            }
        } catch (err) {
            console.error("Rear camera access failed:", err);
        }
    };
    // Toggle processing
    const toggleProcessing = ()=>{
        if (!isProcessing) {
            // starting a new VASE session
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startVaseSession"])().then((id)=>{
                sessionIdRef.current = id;
                alertCountRef.current = 0;
                hazardCountRef.current = 0;
                alertnessSumRef.current = 0;
                alertnessSamplesRef.current = 0;
            });
        } else {
            // stopping session: finalize stats
            if (sessionIdRef.current) {
                const averageAlertness = alertnessSamplesRef.current > 0 ? alertnessSumRef.current / alertnessSamplesRef.current : null;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endVaseSession"])({
                    sessionId: sessionIdRef.current,
                    startTime: sessionStartRef.current,
                    totalAlerts: alertCountRef.current,
                    averageAlertness,
                    hazardsDetected: hazardCountRef.current,
                    emergencyContactNotified: false
                });
            }
            sessionIdRef.current = null;
        }
        setIsProcessing(!isProcessing);
    };
    // Run detection loop when processing
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DualVisionDemo.useEffect": ()=>{
            if (!isProcessing) return;
            let active = true;
            const loop = {
                "DualVisionDemo.useEffect.loop": async ()=>{
                    while(active && isProcessing){
                        await runDetection(); // wait for model to finish
                        await new Promise({
                            "DualVisionDemo.useEffect.loop": (r)=>setTimeout(r, 500)
                        }["DualVisionDemo.useEffect.loop"]); // pause 500ms
                    }
                }
            }["DualVisionDemo.useEffect.loop"];
            loop();
            return ({
                "DualVisionDemo.useEffect": ()=>{
                    active = false;
                }
            })["DualVisionDemo.useEffect"];
        }
    }["DualVisionDemo.useEffect"], [
        isProcessing,
        runDetection
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DualVisionDemo.useEffect": ()=>{
            // Listen for alert changes
            const checkAlert = {
                "DualVisionDemo.useEffect.checkAlert": ()=>{
                    const currentAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$detection$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentAlert"])();
                    if (currentAlert) {
                        setAlert({
                            type: currentAlert,
                            message: currentAlert === 'hazard' ? 'Potential hazard detected.' : 'Drowsiness detected.'
                        });
                    } else {
                        setAlert({
                            type: null,
                            message: ''
                        });
                    }
                }
            }["DualVisionDemo.useEffect.checkAlert"];
            const alertInterval = setInterval(checkAlert, 1000);
            return ({
                "DualVisionDemo.useEffect": ()=>clearInterval(alertInterval)
            })["DualVisionDemo.useEffect"];
        }
    }["DualVisionDemo.useEffect"], []);
    // Load TensorFlow models on client mount only
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DualVisionDemo.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
             // prevent SSR failures
            let mounted = true;
            ({
                "DualVisionDemo.useEffect": async ()=>{
                    try {
                        console.log("Loading TFJS models...");
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$models$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadModels"])();
                        if (mounted) console.log("Models ready ✔");
                    } catch (err) {
                        console.error("Error loading models:", err);
                    }
                }
            })["DualVisionDemo.useEffect"]();
            return ({
                "DualVisionDemo.useEffect": ()=>{
                    mounted = false;
                }
            })["DualVisionDemo.useEffect"];
        }
    }["DualVisionDemo.useEffect"], []);
    // Get status display
    const getStatusDisplay = (status)=>{
        switch(status){
            case "safe":
                return {
                    label: "SAFE",
                    bg: "bg-success",
                    text: "text-success"
                };
            case "caution":
                return {
                    label: "CAUTION",
                    bg: "bg-warning",
                    text: "text-warning"
                };
            case "high-risk":
                return {
                    label: "HIGH RISK",
                    bg: "bg-destructive",
                    text: "text-destructive"
                };
        }
    };
    const statusDisplay = getStatusDisplay(riskAssessment.overallStatus);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: showGuide,
                onOpenChange: setShowGuide,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "sm:max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "Welcome to VASE (Vision-AI Safety Engine)"
                                }, void 0, false, {
                                    fileName: "[project]/app/dualvision/page.tsx",
                                    lineNumber: 528,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    className: "pt-2 space-y-2",
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-muted-foreground text-sm pt-2 space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    "To utilize the ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Dual-Vision"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 34
                                                    }, this),
                                                    " capabilities effectively, please ensure:"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dualvision/page.tsx",
                                                lineNumber: 531,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "list-disc pl-5 space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Front Camera:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 536,
                                                                columnNumber: 21
                                                            }, this),
                                                            " To monitor driver drowsiness."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 535,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Rear Camera:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 539,
                                                                columnNumber: 21
                                                            }, this),
                                                            " Connect an external webcam/dashcam or use your phone to monitor the road ahead."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 538,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dualvision/page.tsx",
                                                lineNumber: 534,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground mt-2",
                                                children: "This setup allows VASE to detect both internal driver state and external road hazards simultaneously."
                                            }, void 0, false, {
                                                fileName: "[project]/app/dualvision/page.tsx",
                                                lineNumber: 542,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 530,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dualvision/page.tsx",
                                    lineNumber: 529,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dualvision/page.tsx",
                            lineNumber: 527,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "sm:justify-start gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    onClick: ()=>setShowGuide(false),
                                    children: "I Understand"
                                }, void 0, false, {
                                    fileName: "[project]/app/dualvision/page.tsx",
                                    lineNumber: 549,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "secondary",
                                    onClick: ()=>setShowGuide(false),
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/app/dualvision/page.tsx",
                                    lineNumber: 552,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dualvision/page.tsx",
                            lineNumber: 548,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dualvision/page.tsx",
                    lineNumber: 526,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dualvision/page.tsx",
                lineNumber: 525,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                ref: audioRef,
                preload: "auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                    src: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleU9PT46xvqF0Q0VBetjD2aJtOUJdxN7j4Z2CUUpBfbG8rH1LS0ttyuLx8qqIU0tBfaq6rnlKSEtzz+j2+qqJVEpAf6m5r3pJR0p40O3++q2MVUY8g6y5r31KSEp40vD//7GOVkY7hK66sH5KSUl41PL//7KQWEI4h6+7sYBLSkh41vT//7WSWUE2iLC8soFMS0h41/X//7iTW0E1irC8s4JNTEh52Pb//7qUXEAzjLG9tIROTUd52ff//7yVXkAyi7K+tYVPTkd52vj//76XX0Axi7O/toZQT0Z63Pn//8CYYEA…",
                    type: "audio/wav"
                }, void 0, false, {
                    fileName: "[project]/app/dualvision/page.tsx",
                    lineNumber: 561,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dualvision/page.tsx",
                lineNumber: 560,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$notification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertNotification"], {
                type: alert.type,
                message: alert.message,
                onClose: ()=>setAlert({
                        type: null,
                        message: ''
                    })
            }, void 0, false, {
                fileName: "[project]/app/dualvision/page.tsx",
                lineNumber: 568,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        className: "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dualvision/page.tsx",
                                                lineNumber: 583,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hidden sm:inline",
                                                children: "Back"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dualvision/page.tsx",
                                                lineNumber: 584,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 579,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$vision$2d$ai$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VisionAILogo"], {
                                        size: "sm"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 586,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dualvision/page.tsx",
                                lineNumber: 578,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "secondary",
                                className: "gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                        className: "h-3 w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 589,
                                        columnNumber: 15
                                    }, this),
                                    "Vision-AI Safety Engine (VASE)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dualvision/page.tsx",
                                lineNumber: 588,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dualvision/page.tsx",
                        lineNumber: 577,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/dualvision/page.tsx",
                    lineNumber: 576,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dualvision/page.tsx",
                lineNumber: 575,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: `mb-6 p-4 rounded-xl border ${riskAssessment.overallStatus === "high-risk" ? "border-destructive bg-destructive/10" : riskAssessment.overallStatus === "caution" ? "border-warning bg-warning/10" : "border-success bg-success/10"}`,
                        animate: riskAssessment.shouldAlert ? {
                            scale: [
                                1,
                                1.02,
                                1
                            ]
                        } : {},
                        transition: {
                            duration: 0.5,
                            repeat: riskAssessment.shouldAlert ? Number.POSITIVE_INFINITY : 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row items-center justify-between gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `h-16 w-16 rounded-full flex items-center justify-center ${statusDisplay.bg}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                className: "h-8 w-8 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dualvision/page.tsx",
                                                lineNumber: 611,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 610,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `text-2xl font-bold ${statusDisplay.text}`,
                                                    children: statusDisplay.label
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 614,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: [
                                                        "Risk Score: ",
                                                        riskAssessment.riskScore,
                                                        "% | Alertness Risk: ",
                                                        Math.round(riskAssessment.alertnessRisk),
                                                        "% | Hazard Risk: ",
                                                        riskAssessment.hazardRisk,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 615,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 613,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dualvision/page.tsx",
                                    lineNumber: 609,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: toggleProcessing,
                                        variant: isProcessing ? "destructive" : "default",
                                        size: "lg",
                                        children: isProcessing ? "Stop VASE" : "Start VASE"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 622,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dualvision/page.tsx",
                                    lineNumber: 621,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dualvision/page.tsx",
                            lineNumber: 608,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dualvision/page.tsx",
                        lineNumber: 598,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid lg:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        className: "pb-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "h-5 w-5 text-primary"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 635,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                                    children: "Front Camera"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 637,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                                    children: "Driver Alertness Monitoring"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 638,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 636,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 634,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: toggleFrontCamera,
                                                    variant: frontCameraActive ? "destructive" : "outline",
                                                    size: "sm",
                                                    children: frontCameraActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VideoOff$3e$__["VideoOff"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 642,
                                                        columnNumber: 40
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 642,
                                                        columnNumber: 75
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 641,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 633,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 632,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "p-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative aspect-video bg-secondary/30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                    ref: frontVideoRef,
                                                    autoPlay: true,
                                                    playsInline: true,
                                                    muted: true,
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 648,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                                                    ref: frontCanvasRef,
                                                    className: "absolute inset-0 w-full h-full pointer-events-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 649,
                                                    columnNumber: 17
                                                }, this),
                                                !frontCameraActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                className: "h-12 w-12 text-muted-foreground/30 mx-auto mb-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 654,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: "Front camera for drowsiness detection"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 655,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 653,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 652,
                                                    columnNumber: 19
                                                }, this),
                                                frontCameraActive && drowsiness && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur rounded-lg p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium",
                                                                    children: "Alertness"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 664,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `text-lg font-bold ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dvse$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatusColor"])(riskAssessment.overallStatus)}`,
                                                                    children: [
                                                                        Math.round(alertnessWindow.average),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 665,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 663,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Progress"], {
                                                            value: alertnessWindow.average,
                                                            className: "h-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 669,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between text-xs text-muted-foreground mt-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        "EAR: ",
                                                                        drowsiness.eyeAspectRatio.toFixed(3)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 671,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        " ",
                                                                        drowsiness.blinkFrequency
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 672,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 670,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 662,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 647,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 646,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dualvision/page.tsx",
                                lineNumber: 631,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        className: "pb-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                            className: "h-5 w-5 text-warning"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 685,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                                    children: "Rear Camera"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 687,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                                    children: "Road Hazard Detection"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 688,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 686,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: toggleRearCamera,
                                                    variant: rearCameraActive ? "destructive" : "outline",
                                                    size: "sm",
                                                    children: rearCameraActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VideoOff$3e$__["VideoOff"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 692,
                                                        columnNumber: 39
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 692,
                                                        columnNumber: 74
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 691,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 683,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 682,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "p-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative aspect-video bg-secondary/30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                    ref: rearVideoRef,
                                                    autoPlay: true,
                                                    playsInline: true,
                                                    muted: true,
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 698,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                                                    ref: rearCanvasRef,
                                                    className: "absolute inset-0 w-full h-full pointer-events-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 699,
                                                    columnNumber: 17
                                                }, this),
                                                !rearCameraActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                                className: "h-12 w-12 text-muted-foreground/30 mx-auto mb-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 704,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: "Rear camera for hazard detection"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 705,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 703,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 702,
                                                    columnNumber: 19
                                                }, this),
                                                rearCameraActive && hazards.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-4 right-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "destructive",
                                                        className: "animate-pulse",
                                                        children: [
                                                            hazards.length,
                                                            " Hazard",
                                                            hazards.length > 1 ? "s" : "",
                                                            " Detected"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 713,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 712,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 697,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 696,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dualvision/page.tsx",
                                lineNumber: 681,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dualvision/page.tsx",
                        lineNumber: 629,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid lg:grid-cols-3 gap-6 mt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 729,
                                                    columnNumber: 17
                                                }, this),
                                                "Unified Risk Meter"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 728,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 727,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative h-32 flex items-end justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-5xl font-bold ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dvse$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStatusColor"])(riskAssessment.overallStatus)}`,
                                                            children: [
                                                                riskAssessment.riskScore,
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 737,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 736,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 735,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-4 rounded-full bg-gradient-to-r from-success via-warning to-destructive overflow-hidden",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                        className: "h-full bg-foreground/20",
                                                        style: {
                                                            marginLeft: `${riskAssessment.riskScore}%`
                                                        },
                                                        animate: {
                                                            marginLeft: `${riskAssessment.riskScore}%`
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 743,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 742,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-xs text-muted-foreground",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Safe"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 750,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Caution"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 751,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "High Risk"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 752,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 749,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 734,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 733,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dualvision/page.tsx",
                                lineNumber: 726,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 762,
                                                    columnNumber: 17
                                                }, this),
                                                "Active Hazards"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 761,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 760,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        children: hazards.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center py-8 text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                    className: "h-8 w-8 mx-auto mb-2 opacity-30"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 769,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: "No hazards detected"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 770,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 768,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: hazards.map((hazard)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-3 rounded-lg bg-warning/10 border border-warning/20",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium",
                                                                    children: hazardLabels[hazard.objectClass] || hazard.objectClass
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 777,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: hazard.severity === "critical" ? "destructive" : "secondary",
                                                                    className: "text-xs",
                                                                    children: hazard.severity
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 778,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 776,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-muted-foreground mt-1",
                                                            children: [
                                                                "Confidence: ",
                                                                Math.round(hazard.confidence * 100),
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 785,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, hazard.id, true, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 775,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 773,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 766,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dualvision/page.tsx",
                                lineNumber: 759,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 799,
                                                    columnNumber: 17
                                                }, this),
                                                "Settings & Alerts"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dualvision/page.tsx",
                                            lineNumber: 798,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 797,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            soundEnabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 806,
                                                                columnNumber: 35
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__["VolumeX"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 806,
                                                                columnNumber: 69
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                htmlFor: "sound",
                                                                children: "Alert Sound"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 807,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 805,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Switch"], {
                                                        id: "sound",
                                                        checked: soundEnabled,
                                                        onCheckedChange: setSoundEnabled
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 809,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dualvision/page.tsx",
                                                lineNumber: 804,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "emergency",
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                                    className: "h-4 w-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 815,
                                                                    columnNumber: 21
                                                                }, this),
                                                                "Emergency Contact Email"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 814,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    id: "emergency",
                                                                    type: "email",
                                                                    placeholder: "emergency@example.com",
                                                                    value: emergencyContact,
                                                                    onChange: (e)=>setEmergencyContact(e.target.value)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 819,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "outline",
                                                                    onClick: handleSaveContact,
                                                                    children: "Save"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                                    lineNumber: 826,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 818,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground",
                                                            children: "Alerts from Critical Hazards or Drowsiness will prompt an email draft."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dualvision/page.tsx",
                                                            lineNumber: 833,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dualvision/page.tsx",
                                                    lineNumber: 813,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dualvision/page.tsx",
                                                lineNumber: 812,
                                                columnNumber: 15
                                            }, this),
                                            alertHistory.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pt-4 border-t border-border",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-medium mb-2",
                                                        children: "Recent Alerts"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 841,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1 max-h-32 overflow-y-auto",
                                                        children: alertHistory.slice(-5).map((alert, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-muted-foreground flex justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate flex-1 mr-2",
                                                                        children: alert.message
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                                        lineNumber: 845,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "whitespace-nowrap",
                                                                        children: alert.time.toLocaleTimeString()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                                        lineNumber: 846,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/app/dualvision/page.tsx",
                                                                lineNumber: 844,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dualvision/page.tsx",
                                                        lineNumber: 842,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dualvision/page.tsx",
                                                lineNumber: 840,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dualvision/page.tsx",
                                        lineNumber: 803,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dualvision/page.tsx",
                                lineNumber: 796,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dualvision/page.tsx",
                        lineNumber: 724,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dualvision/page.tsx",
                lineNumber: 596,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dualvision/page.tsx",
        lineNumber: 523,
        columnNumber: 5
    }, this);
}
_s(DualVisionDemo, "2CUZLAeiWxAozTeyMAdSQ9CNjas=");
_c = DualVisionDemo;
var _c;
__turbopack_context__.k.register(_c, "DualVisionDemo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_10853e6a._.js.map