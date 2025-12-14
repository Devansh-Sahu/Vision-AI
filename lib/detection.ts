// lib/detection.ts
import * as tf from "@tensorflow/tfjs"
import {
  getFaceMeshModel,
  ensureFaceMeshLoaded,
  runFaceMesh,
  getObjectDetector,
  loadModels,
} from "./models"

import type {
  DrowsinessMetrics,
  HazardDetection,
  HazardObjectClass,
  BoundingBox
} from "@/lib/types"

import { alertSound } from './sounds';
import { BiometricEyeEngine } from "./biometric-eye-model"

// --- Global State ---

let tfReady: Promise<void> | null = null;

function ensureTFReady() {
  if (!tfReady) {
    tfReady = tf.ready();
  }
  return tfReady;
}

// Instantiate the engine permanently so calibration persists
const eyeEngine = new BiometricEyeEngine();

// Tracking state for UI counters
let blinkCount = 0;
let wasBlinking = false;
let lastBlinkTime = 0;

// Track alert state
let lastAlertTime = 0;
const ALERT_COOLDOWN = 10000;
let currentAlert: 'hazard' | 'drowsiness' | null = null;
let lastAlertType: 'hazard' | 'drowsiness' | null = null;

// Reset tracking when no face is detected for a while
let noFaceCounter = 0;
const MAX_NO_FACE_FRAMES = 10;

// Debug state
const debug = {
  frameCount: 0
};

// --- Helper Functions ---

export function triggerAlert(type: 'hazard' | 'drowsiness') {
  const now = Date.now();

  if (type === lastAlertType && (now - lastAlertTime) < ALERT_COOLDOWN) {
    return;
  }

  if (type !== currentAlert) {
    alertSound.play();
  }

  currentAlert = type;
  lastAlertType = type;
  lastAlertTime = now;

  setTimeout(() => {
    if (currentAlert === type) {
      currentAlert = null;
    }
  }, 5000);
}

export function getCurrentAlert() {
  return currentAlert;
}

// --- Main Drowsiness Detection ---

export async function runRealDrowsinessDetection(
  videoEl: HTMLVideoElement | null
): Promise<DrowsinessMetrics | null> {
  if (!videoEl || videoEl.readyState < 2) return null

  await ensureTFReady()
  await ensureFaceMeshLoaded()

  const model = getFaceMeshModel()
  if (!model) return null

  try {
    const outputs = await runFaceMesh(videoEl)
    if (!outputs || outputs.length < 2) return null

    const [landmarksTensor, confidenceTensor] = outputs

    // Process Tensors
    const landmarksData = await landmarksTensor.array();
    const confidenceData = await confidenceTensor.arraySync();

    landmarksTensor.dispose();
    confidenceTensor.dispose();

    const landmarksArray = Array.isArray(landmarksData[0])
      ? (landmarksData as number[][])[0]
      : landmarksData as number[]

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

    const points: { x: number, y: number, z: number }[] = [];
    for (let i = 0; i < landmarksArray.length; i += 3) {
      points.push({
        x: (landmarksArray[i] as number),
        y: (landmarksArray[i + 1] as number),
        z: (landmarksArray[i + 2] as number)
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
      blinkFrequency: 0, // detailed freq not implemented yet in new engine
      isAlert,

      // Placeholders
      headTilt: null,
      lookingAway: false,
      yawning: false,
      lastUpdated: now,
    }

  } catch (err) {
    console.warn("FaceMesh detection failed:", err)
    return null
  }
}

// ----------------- Hazard Detection -----------------

import { hazardGuard } from "./hazard-guard";

const HAZARD_MIN_CONFIDENCE = 0.20 // Lowered further for "hard" classes

const COCO_TO_HAZARD_CLASS: Record<string, HazardObjectClass> = {
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
  bench: "fallen_tree",  // Large horizontal object
  chair: "fallen_tree",
  couch: "fallen_tree",
  bed: "fallen_tree",
  diningtable: "fallen_tree",
  pottedplant: "fallen_tree", // Bush/Small tree

  // Aggressive Mapping for "Potholes/Debris"
  // Using small low objects as proxies
  backpack: "pothole", // Dark patches often look like bags
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
  traffic_light: "other", // could be hazard if red?
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
}

function mapToHazardClass(cls: string): HazardObjectClass {
  // COCO classes use underscores or spaces depending on version, normalize
  const normalized = cls.toLowerCase().replace(" ", "_");
  return COCO_TO_HAZARD_CLASS[normalized] ?? "other"
}

export async function runRealHazardDetection(
  videoEl: HTMLVideoElement | null
): Promise<HazardDetection[]> {
  if (!videoEl) return []
  // await ensureTFReady(); // MediaPipe doesn't depend on global TF readiness same way? but we keep for FaceMesh
  await loadModels()


  const detector = getObjectDetector()
  if (!detector) return []

  try {
    // MediaPipe requires timestamp
    const now = Date.now()
    const result = detector.detectForVideo(videoEl, now)

    if (!result || !result.detections) return []

    const rawHazards: HazardDetection[] = []

    for (let i = 0; i < result.detections.length; i++) {
      const det = result.detections[i];
      const category = det.categories[0];

      if (!category || category.score < HAZARD_MIN_CONFIDENCE) continue

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
        severity: (mappedClass === 'pedestrian' || mappedClass === 'cow' || mappedClass === 'wrong_way_vehicle')
          ? "critical" : "high",
        bbox: {
          x: bbox.originX / videoEl.videoWidth,
          y: bbox.originY / videoEl.videoHeight,
          width: bbox.width / videoEl.videoWidth,
          height: bbox.height / videoEl.videoHeight
        },
        timestamp: now,
      })
    }

    // --- PIPELINE STEP 2: HAZARD GUARD ---
    const filteredHazards = hazardGuard.process(rawHazards, videoEl.videoWidth, videoEl.videoHeight);

    return filteredHazards;
  } catch (err) {
    console.error("Hazard detection failed:", err)
    return []
  }
}
