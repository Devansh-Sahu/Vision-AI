// lib/models.ts
// Self-hosted TFJS FaceMesh + MediaPipe Object Detector

import * as tf from "@tensorflow/tfjs"
import { ObjectDetector, FilesetResolver } from "@mediapipe/tasks-vision"

let faceMeshModel: tf.GraphModel | null = null
let modelsLoaded = false

let faceMeshLoadingPromise: Promise<void> | null = null

// -------------------------------
// Load MediaPipe Object Detector
// -------------------------------

let objectDetector: ObjectDetector | null = null
let objectLoadingPromise: Promise<void> | null = null

export async function loadModels() {
  if (modelsLoaded) return
  if (typeof window === "undefined") return
  if (objectLoadingPromise) return objectLoadingPromise

  objectLoadingPromise = (async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
      );

      // Use Lite0 for maximum speed (user requested "highly fast")
      objectDetector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/1/efficientdet_lite0.tflite`,
          delegate: "GPU"
        },
        scoreThreshold: 0.25, // Lower threshold to detect small/far animals
        runningMode: "VIDEO"
      });

      console.log("MediaPipe EfficientDet-Lite0 loaded")
      modelsLoaded = true
    } catch (err) {
      console.error("Error loading MediaPipe Detector:", err)
    }
  })()

  return objectLoadingPromise
}

export function getObjectDetector() {
  return objectDetector
}

// ----------------------------------------
// Load FaceMesh graph model (self-hosted)
// ----------------------------------------
export async function ensureFaceMeshLoaded() {
  if (faceMeshModel) return
  if (typeof window === "undefined") return
  if (faceMeshLoadingPromise) return faceMeshLoadingPromise

  faceMeshLoadingPromise = (async () => {
    try {


      faceMeshModel = await tf.loadGraphModel(
        "/models/facemesh/model.json",
        { fromTFHub: false }
      )

      console.log("FaceMesh model loaded (local)")
    } catch (err) {
      console.error("Failed to load FaceMesh:", err)
      faceMeshModel = null
    }
  })()

  return faceMeshLoadingPromise
}

export function getFaceMeshModel() {
  return faceMeshModel
}

// -----------------------------------------------
// Run FaceMesh inference and return raw tensors
// -----------------------------------------------
export async function runFaceMesh(video: HTMLVideoElement) {
  if (!faceMeshModel) return null

  try {
    const input = tf.tidy(() => {
      return tf.browser.fromPixels(video)
        .resizeBilinear([192, 192])
        .expandDims(0)
        .toFloat()
        .div(127.5)
        .sub(1) // Normalize to [-1, 1]
    })

    // Get model output using the correct output names from the model
    // Using execute() instead of executeAsync() since we don't have dynamic output shapes
    const outputs = faceMeshModel.execute(input, [
      'Identity_2', // output_mesh (landmarks)
      'Identity_1', // output_faceflag (confidence)
      'Identity'    // output_contours
    ]) as tf.Tensor[]

    // Clean up input tensor
    input.dispose()

    try {
      // Convert to arrays for debugging
      const [landmarksData, faceFlagData] = await Promise.all([
        outputs[0].array() as Promise<number[][]>,
        outputs[1].array() as Promise<number[][]>
      ])

      // Clean up output tensors
      outputs.forEach(t => t.dispose())

      // Check for valid output
      if (!landmarksData?.[0] || !faceFlagData?.[0]) {
        console.warn('No face detected or invalid output format')
        return null
      }

      // Return the raw tensors for further processing
      // Convert to tensors with proper shapes
      const landmarksTensor = tf.tensor2d(landmarksData, [landmarksData.length, landmarksData[0].length])
      const confidenceTensor = tf.tensor1d(faceFlagData[0])

      return [landmarksTensor, confidenceTensor]
    } catch (error) {
      console.error('Error processing face mesh output:', error)
      // Ensure cleanup on error
      for (const t of outputs) {
        try {
          t.dispose()
        } catch (e) {
          console.warn('Error disposing tensor:', e)
        }
      }
      return null
    }
  } catch (error) {
    console.error('Error in runFaceMesh:', error)
    return null
  }
}
