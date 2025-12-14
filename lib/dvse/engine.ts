// Vision-AI Safety Engine (VASE) - Core Engine Logic

import type { DVSERiskAssessment, DrowsinessMetrics, HazardDetection, SafetyStatus, AlertnessWindow } from "@/lib/types"

// Configuration constants
const CONFIG = {
  ALERTNESS_THRESHOLD: 50, // Below this triggers alert
  HAZARD_CONFIDENCE_THRESHOLD: 0.5, // Minimum confidence for hazard alerts
  RISK_WEIGHTS: {
    drowsiness: 0.6, // Drowsiness contributes 60% to risk
    hazard: 0.4, // Hazard contributes 40% to risk
  },
  ALERTNESS_WINDOW_SIZE: 20, // Rolling window for smoothing (10 seconds at 2 fps)
  CRITICAL_HAZARDS: ["cow", "buffalo", "elephant", "wrong_way_vehicle", "pedestrian", "broken_vehicle"],
  HIGH_RISK_THRESHOLD: 70,
  CAUTION_THRESHOLD: 40,
}

// Create rolling window for smoothed alertness
export function createAlertnessWindow(size: number = CONFIG.ALERTNESS_WINDOW_SIZE): AlertnessWindow {
  return {
    samples: [],
    windowSize: size,
    average: 100, // Start optimistic
  }
}

// Update rolling window with new alertness sample
export function updateAlertnessWindow(window: AlertnessWindow, newSample: number): AlertnessWindow {
  const newSamples = [...window.samples, newSample]
  if (newSamples.length > window.windowSize) {
    newSamples.shift()
  }
  const average = newSamples.reduce((a, b) => a + b, 0) / newSamples.length
  return {
    ...window,
    samples: newSamples,
    average,
  }
}

// Calculate Eye Aspect Ratio (EAR) from landmarks
export function calculateEAR(eyePoints: { x: number; y: number }[]): number {
  if (eyePoints.length < 6) return 0.3 // Default open

  // Vertical distances
  const v1 = Math.sqrt(Math.pow(eyePoints[1].x - eyePoints[5].x, 2) + Math.pow(eyePoints[1].y - eyePoints[5].y, 2))
  const v2 = Math.sqrt(Math.pow(eyePoints[2].x - eyePoints[4].x, 2) + Math.pow(eyePoints[2].y - eyePoints[4].y, 2))

  // Horizontal distance
  const h = Math.sqrt(Math.pow(eyePoints[0].x - eyePoints[3].x, 2) + Math.pow(eyePoints[0].y - eyePoints[3].y, 2))

  if (h === 0) return 0.3
  return (v1 + v2) / (2.0 * h)
}

// Convert EAR to alertness score (0-100)
export function earToAlertness(ear: number): number {
  // EAR typically ranges from 0.15 (closed) to 0.35 (open)
  const minEAR = 0.15
  const maxEAR = 0.35
  const normalized = Math.max(0, Math.min(1, (ear - minEAR) / (maxEAR - minEAR)))
  return Math.round(normalized * 100)
}

// Get hazard severity based on class and confidence
export function getHazardSeverity(objectClass: string, confidence: number): "critical" | "high" | "medium" | "low" {
  const isCriticalClass = CONFIG.CRITICAL_HAZARDS.includes(objectClass)

  if (isCriticalClass && confidence > 0.8) return "critical"
  if (isCriticalClass && confidence > 0.6) return "high"
  if (confidence > 0.8) return "high"
  if (confidence > 0.6) return "medium"
  return "low"
}

// Calculate hazard risk score from detections
export function calculateHazardRisk(hazards: HazardDetection[]): number {
  if (hazards.length === 0) return 0

  let maxRisk = 0
  for (const hazard of hazards) {
    let risk = hazard.confidence * 100

    // Boost risk for critical hazards
    if (CONFIG.CRITICAL_HAZARDS.includes(hazard.objectClass)) {
      risk = Math.min(100, risk * 1.3)
    }

    // Severity multiplier
    const severityMultiplier = {
      critical: 1.0,
      high: 0.8,
      medium: 0.5,
      low: 0.3,
    }
    risk *= severityMultiplier[hazard.severity]

    maxRisk = Math.max(maxRisk, risk)
  }

  return Math.round(maxRisk)
}

// Main VASE risk assessment function
export function assessRisk(
  drowsiness: DrowsinessMetrics | null,
  hazards: HazardDetection[],
  smoothedAlertness: number,
): DVSERiskAssessment {
  // Calculate individual risks
  const alertnessRisk = drowsiness ? Math.max(0, 100 - smoothedAlertness) : 0
  const hazardRisk = calculateHazardRisk(hazards)

  // Combined risk score (weighted)
  const riskScore = Math.round(alertnessRisk * CONFIG.RISK_WEIGHTS.drowsiness + hazardRisk * CONFIG.RISK_WEIGHTS.hazard)

  // Determine overall status
  let overallStatus: SafetyStatus = "safe"
  if (riskScore >= CONFIG.HIGH_RISK_THRESHOLD) {
    overallStatus = "high-risk"
  } else if (riskScore >= CONFIG.CAUTION_THRESHOLD) {
    overallStatus = "caution"
  }

  // Determine if alert should trigger
  const shouldAlert =
    smoothedAlertness < CONFIG.ALERTNESS_THRESHOLD ||
    hazards.some((h) => h.severity === "critical" || h.severity === "high")

  // Generate alert message
  let alertMessage: string | null = null
  if (shouldAlert) {
    if (smoothedAlertness < CONFIG.ALERTNESS_THRESHOLD && hazards.length > 0) {
      alertMessage = `DANGER: Drowsy driving detected + ${hazards[0].objectClass} on road!`
    } else if (smoothedAlertness < CONFIG.ALERTNESS_THRESHOLD) {
      alertMessage = "ALERT: Drowsiness detected - Please take a break!"
    } else if (hazards.length > 0) {
      const criticalHazard = hazards.find((h) => h.severity === "critical")
      if (criticalHazard) {
        alertMessage = `DANGER: ${criticalHazard.objectClass.replace("_", " ")} detected ahead!`
      } else {
        alertMessage = `WARNING: ${hazards[0].objectClass.replace("_", " ")} detected on road`
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
    alertMessage,
  }
}

// Get status color for UI
export function getStatusColor(status: SafetyStatus): string {
  switch (status) {
    case "safe":
      return "text-success"
    case "caution":
      return "text-warning"
    case "high-risk":
      return "text-destructive"
  }
}

export function getStatusBgColor(status: SafetyStatus): string {
  switch (status) {
    case "safe":
      return "bg-success"
    case "caution":
      return "bg-warning"
    case "high-risk":
      return "bg-destructive"
  }
}
