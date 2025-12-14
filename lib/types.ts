export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  organization_id: string | null
  full_name: string | null
  role: "admin" | "operator" | "viewer"
  created_at: string
  updated_at: string
}

// ============================================
// VISION-AI SAFETY ENGINE (VASE) TYPES
// ============================================

// Combined Safety Status from both detection systems
export type SafetyStatus = "safe" | "caution" | "high-risk"

// Vision-AI unified risk assessment
export interface DVSERiskAssessment {
  overallStatus: SafetyStatus
  riskScore: number // 0-100, 100 = highest risk
  alertnessRisk: number // 0-100 from drowsiness detection
  hazardRisk: number // 0-100 from hazard detection
  timestamp: number
  shouldAlert: boolean
  alertMessage: string | null
}

// Drowsiness Detection Types
export interface DrowsinessMetrics {
  alertnessScore: number // 0-100, higher = more alert
  eyeAspectRatio: number // EAR value
  blinkCount: number
  blinkFrequency: number // blinks per minute
  isAlert: boolean
  headTilt: number | null // degrees
  lookingAway: boolean
  yawning: boolean
  lastUpdated: number
}

// Rolling window for smoothed alertness calculation
export interface AlertnessWindow {
  samples: number[]
  windowSize: number
  average: number
}

// Hazard Detection Types
export type HazardObjectClass =
  | "cow"
  | "dog"
  | "bear"
  | "animal"
  | "animal_large"
  | "buffalo"
  | "goat"
  | "deer"
  | "elephant"
  | "camel"
  | "pothole"
  | "fallen_tree"
  | "debris"
  | "landslide"
  | "broken_vehicle"
  | "road_barrier"
  | "construction"
  | "pedestrian"
  | "cyclist"
  | "wrong_way_vehicle"
  | "black_spot"
  | "flooding"
  | "oil_spill"
  | "vehicle"
  | "other"

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface HazardDetection {
  id: string
  objectClass: HazardObjectClass
  confidence: number
  severity: "critical" | "high" | "medium" | "low"
  bbox: BoundingBox
  timestamp: number
}

// Frame source types
export type FrameSource = "front_camera" | "rear_camera" | "upload" | "stream"

// Vision-AI Session State
export interface VASESession {
  id: string
  startTime: number
  isActive: boolean
  frontCameraActive: boolean
  rearCameraActive: boolean
  currentDrowsiness: DrowsinessMetrics | null
  currentHazards: HazardDetection[]
  riskAssessment: DVSERiskAssessment
  alertsTriggered: number
  emergencyContactNotified: boolean
}

// ============================================
// DATABASE ENTITY TYPES
// ============================================

export interface Camera {
  id: string
  organization_id: string
  name: string
  location: string
  latitude: number | null
  longitude: number | null
  stream_url: string | null
  status: "online" | "offline" | "maintenance"
  highway: string | null
  mile_marker: string | null
  created_at: string
  updated_at: string
}

export interface Detection {
  id: string
  camera_id: string
  organization_id: string
  detection_type: HazardObjectClass
  confidence: number
  bounding_box: BoundingBox | null
  frame_url: string | null
  detected_at: string
  created_at: string
  camera?: Camera
}

export interface Alert {
  id: string
  detection_id: string | null
  camera_id: string | null
  organization_id: string
  user_id: string | null
  severity: "critical" | "high" | "medium" | "low"
  status: "active" | "acknowledged" | "resolved" | "false_positive"
  title: string
  description: string | null
  alert_source: "drowsiness" | "hazard" | "combined"
  acknowledged_by: string | null
  acknowledged_at: string | null
  resolved_at: string | null
  created_at: string
  camera?: Camera
  detection?: Detection
}

// VASE Session Records (for database)
export interface DVSESessionRecord {
  id: string
  user_id: string
  organization_id: string | null
  start_time: string
  end_time: string | null
  duration_seconds: number | null
  total_alerts: number
  average_alertness: number | null
  hazards_detected: number
  emergency_contact_notified: boolean
  created_at: string
}

// VASE Event Log (for database)
export interface DVSEEventLog {
  id: string
  session_id: string
  user_id: string
  event_type: "drowsiness_alert" | "hazard_detected" | "risk_elevated" | "emergency_notified"
  alertness_score: number | null
  hazard_class: HazardObjectClass | null
  hazard_confidence: number | null
  risk_score: number
  timestamp: string
  created_at: string
}

export interface EmergencyContact {
  id: string
  user_id: string
  name: string
  phone: string
  relationship: string | null
  is_primary: boolean
  notify_on_drowsiness: boolean
  notify_on_hazard: boolean
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalCameras: number
  onlineCameras: number
  totalDetections24h: number
  activeAlerts: number
  detectionsByType: { type: string; count: number }[]
  alertsBySeverity: { severity: string; count: number }[]
}

// ============================================
// VALIDATION SCHEMAS (for auth stability)
// ============================================

export interface AuthValidation {
  email: {
    pattern: RegExp
    minLength: number
    maxLength: number
  }
  password: {
    minLength: number
    maxLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumber: boolean
  }
  fullName: {
    minLength: number
    maxLength: number
  }
}

export const AUTH_VALIDATION: AuthValidation = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    minLength: 5,
    maxLength: 254,
  },
  password: {
    minLength: 6,
    maxLength: 128,
    requireUppercase: false,
    requireLowercase: false,
    requireNumber: false,
  },
  fullName: {
    minLength: 2,
    maxLength: 100,
  },
}

// Detection result from TensorFlow.js models
export interface DetectionResult {
  class: string
  confidence: number
  bbox: BoundingBox
}
