"use client"

import { loadModels } from "@/lib/models"
import { runRealDrowsinessDetection, runRealHazardDetection, getCurrentAlert, triggerAlert } from "@/lib/detection"
import { logDrowsinessEvent, logHazardEvents, startVaseSession, endVaseSession, logVaseAlert, saveEmergencyContact, getEmergencyContact } from "@/lib/supabase/analytics"
import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertNotification } from "@/components/ui/alert-notification"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Eye,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  ArrowLeft,
  Shield,
  Bell,
  Camera,
  Gauge,
} from "lucide-react"
import Link from "next/link"
import { VisionAILogo } from "@/components/ui/vision-ai-logo"
import type { DVSERiskAssessment, DrowsinessMetrics, HazardDetection, SafetyStatus, AlertnessWindow } from "@/lib/types"
import {
  assessRisk,
  createAlertnessWindow,
  updateAlertnessWindow,
  getStatusColor,
} from "@/lib/dvse/engine"

// Hazard class labels
const hazardLabels: Record<string, string> = {
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
}

export default function DualVisionDemo() {
  // Camera refs
  const frontVideoRef = useRef<HTMLVideoElement>(null)
  const rearVideoRef = useRef<HTMLVideoElement>(null)
  const frontCanvasRef = useRef<HTMLCanvasElement>(null)
  const rearCanvasRef = useRef<HTMLCanvasElement>(null)

  // State
  const [frontCameraActive, setFrontCameraActive] = useState(false)
  const [rearCameraActive, setRearCameraActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [alert, setAlert] = useState<{ type: 'hazard' | 'drowsiness' | null, message: string }>({ type: null, message: '' })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [emergencyContact, setEmergencyContact] = useState("")

  // VASE State
  const [drowsiness, setDrowsiness] = useState<DrowsinessMetrics | null>(null)
  const [hazards, setHazards] = useState<HazardDetection[]>([])
  const [riskAssessment, setRiskAssessment] = useState<DVSERiskAssessment>({
    overallStatus: "safe",
    riskScore: 0,
    alertnessRisk: 0,
    hazardRisk: 0,
    timestamp: Date.now(),
    shouldAlert: false,
    alertMessage: null,
  })
  const [alertnessWindow, setAlertnessWindow] = useState<AlertnessWindow>(() => createAlertnessWindow())
  const [alertHistory, setAlertHistory] = useState<{ time: Date; message: string; status: SafetyStatus }[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sessionStartRef = useRef<Date | null>(null)
  const sessionIdRef = useRef<string | null>(null)
  const alertCountRef = useRef(0)
  const hazardCountRef = useRef(0)
  const alertnessSumRef = useRef(0)
  const alertnessSamplesRef = useRef(0)
  const lastAlertTime = useRef(0)

  // Load persistence
  useEffect(() => {
    getEmergencyContact().then(email => {
      if (email) setEmergencyContact(email);
    });
  }, []);

  const handleSaveContact = async () => {
    if (!emergencyContact || !emergencyContact.includes("@")) {
      window.alert("Please enter a valid email.");
      return;
    }
    try {
      await saveEmergencyContact(emergencyContact);
      window.alert(`Emergency contact saved to Supabase: ${emergencyContact}`);
    } catch (e) {
      console.error(e);
      window.alert("Failed to save contact. See console.");
    }
  };

  // Startup Guide State
  const [showGuide, setShowGuide] = useState(false)

  // Show guide on mount once
  useEffect(() => {
    setShowGuide(true)
  }, [])

  // ================= CAMERA DEVICE HELPER =================
  async function getCameraDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const cams = devices.filter(d => d.kind === "videoinput")

    // FRONT CAMERA → Laptop webcam
    const frontCam =
      cams.find(c => c.label.toLowerCase().includes("integrated")) ||
      cams[0]

    // REAR CAMERA → Phone webcam (DroidCam / Iriun)
    const rearCam = cams.find(c =>
      c.label.toLowerCase().includes("iriun") ||
      c.label.toLowerCase().includes("droid")
    )

    return { frontCam, rearCam }
  }

  // Main detection loop
  const runDetection = useCallback(async () => {
    // Drowsiness (front)
    let newDrowsiness = null
    if (frontCameraActive && frontVideoRef.current) {
      try {
        const dr = await runRealDrowsinessDetection(frontVideoRef.current)
        if (dr) {
          newDrowsiness = dr
          setDrowsiness(dr)
          const newWindow = updateAlertnessWindow(alertnessWindow, dr.alertnessScore)
          setAlertnessWindow(newWindow)
        }
      } catch (err) {
        console.error("Real drowsiness detection error:", err)
      }
    } else {
      newDrowsiness = drowsiness
    }

    // Hazards (rear)
    let newHazards: HazardDetection[] = []
    if (rearCameraActive && rearVideoRef.current) {
      try {
        newHazards = await runRealHazardDetection(rearVideoRef.current)
        setHazards(newHazards)
      } catch (err) {
        console.error("Real hazard detection error:", err)
        newHazards = []
      }
    } else {
      newHazards = []
      setHazards([])
    }

    // Access Risk
    const smoothed = alertnessWindow.average
    const assessment = assessRisk(newDrowsiness, newHazards, smoothed)
    setRiskAssessment(assessment)

    // accumulate stats
    if (newDrowsiness) {
      alertnessSumRef.current += newDrowsiness.alertnessScore
      alertnessSamplesRef.current += 1
    }
    hazardCountRef.current += newHazards.length

    // Log per-tick
    if (newDrowsiness) {
      logDrowsinessEvent({
        alertnessScore: newDrowsiness.alertnessScore,
        ear: newDrowsiness.eyeAspectRatio,
        blinkFrequency: newDrowsiness.blinkFrequency,
        triggeredAlert: assessment.shouldAlert,
        sessionId: sessionIdRef.current,
      })
    }

    if (newHazards.length > 0) {
      logHazardEvents(newHazards, sessionIdRef.current)
    }

    // Handle Alerts
    if (assessment.shouldAlert) {
      alertCountRef.current += 1

      // Determine Alert Type
      let alertType: 'hazard' | 'drowsiness' | null = null;
      let detailedMessage = "";

      if (assessment.overallStatus === 'high-risk' || assessment.hazardRisk > 50) {
        alertType = 'hazard';
        // Filter to distinct hazard labels
        const distinctHazards = Array.from(new Set(newHazards.map(h => hazardLabels[h.objectClass] || h.objectClass)));
        detailedMessage = `HAZARD: ${distinctHazards.join(", ")}`;
      } else if (newDrowsiness && newDrowsiness.alertnessScore < 60) {
        alertType = 'drowsiness';
        detailedMessage = `DROWSINESS: Alertness ${newDrowsiness.alertnessScore}%`;
      }

      if (alertType) {
        // DEBOUNCE LOGIC: Only update if different or enough time passed
        // This prevents "boomerang" flickering
        const now = Date.now();
        if (alert.type !== alertType || alert.message !== detailedMessage || (now - lastAlertTime.current) > 2000) {
          triggerAlert(alertType);
          setAlert({
            type: alertType,
            message: detailedMessage
          });
          lastAlertTime.current = now;

          // Verify we don't spam history
          const lastHistory = alertHistory[alertHistory.length - 1];
          if (!lastHistory || lastHistory.message !== detailedMessage || (now - lastHistory.time.getTime()) > 5000) {
            setAlertHistory((prev) => [
              ...prev.slice(-9),
              { time: new Date(), message: detailedMessage, status: assessment.overallStatus },
            ])
          }
        }

        // Auto-send email logic (Backend API)
        const highSeverityHazards = ["cow", "buffalo", "deer", "bear", "fallen_tree", "pothole", "wrong_way_vehicle"];
        const hasCritical = newHazards.some(h => highSeverityHazards.includes(h.objectClass));

        // Triggers email if drowsiness drops below 50 (User Request)
        const criticalDrowsiness = newDrowsiness && newDrowsiness.alertnessScore < 50;

        if ((hasCritical || criticalDrowsiness) && emergencyContact) {
          // Rate Limit: Only send 1 email per 60 seconds to avoid spamming user
          const lastEmail = localStorage.getItem('last_emergency_email');
          const now = Date.now();

          if (!lastEmail || (now - parseInt(lastEmail)) > 60000) {
            console.log("Triggering Emergency Email to:", emergencyContact);
            localStorage.setItem('last_emergency_email', now.toString());

            fetch('/api/email-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: emergencyContact,
                subject: `URGENT: Vision-AI ${alertType?.toUpperCase()} Alert`,
                message: `Vision-AI detected a critical safety event.\n\nType: ${alertType}\nDetails: ${detailedMessage}\nTime: ${new Date().toLocaleString()}\n\nPlease check on the driver immediately.`
              })
            }).catch(err => console.error("Failed to send email:", err));
          }
        }
      }
    } else {
      // Clear alert if safe for > 2 seconds (Debounce clearing)
      // This prevents the alert from disappearing instantly if detection flickers for 1 frame
      if (alert.type) {
        const now = Date.now();
        if ((now - lastAlertTime.current) > 2000) {
          setAlert({ type: null, message: '' });
        }
      }
    }

    // draw boxes
    drawDetections(newHazards)
  }, [frontCameraActive, rearCameraActive, alertnessWindow, drowsiness, alert, soundEnabled, emergencyContact, alertHistory])

  // Draw bounding boxes on rear camera canvas
  const drawDetections = (detections: HazardDetection[]) => {
    const canvas = rearCanvasRef.current
    const video = rearVideoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    detections.forEach((det) => {
      const x = det.bbox.x * canvas.width
      const y = det.bbox.y * canvas.height
      const w = det.bbox.width * canvas.width
      const h = det.bbox.height * canvas.height

      // Color based on severity
      const colors = {
        critical: "#ef4444",
        high: "#f59e0b",
        medium: "#06b6d4",
        low: "#22c55e",
      } as const
      ctx.strokeStyle = colors[det.severity]
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, w, h)

      // Label
      const label = `${hazardLabels[det.objectClass] || det.objectClass} ${Math.round(det.confidence * 100)}%`
      ctx.fillStyle = ctx.strokeStyle
      const textWidth = ctx.measureText(label).width
      ctx.fillRect(x, y - 24, textWidth + 12, 24)
      ctx.fillStyle = "#fff"
      ctx.font = "14px sans-serif"
      ctx.fillText(label, x + 6, y - 7)
    })
  }

  // ================= FRONT CAMERA (Laptop Webcam) =================
  const toggleFrontCamera = async () => {
    if (frontCameraActive) {
      // Stop front camera
      const stream = frontVideoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach(track => track.stop())
      if (frontVideoRef.current) frontVideoRef.current.srcObject = null
      setFrontCameraActive(false)
      return
    }

    try {
      const { frontCam } = await getCameraDevices()

      if (!frontCam) {
        console.error("No front (laptop) camera found")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: frontCam.deviceId,
          width: 640,
          height: 480,
        },
      })

      if (frontVideoRef.current) {
        frontVideoRef.current.srcObject = stream
        await frontVideoRef.current.play()
        setFrontCameraActive(true)
        if (!sessionStartRef.current) sessionStartRef.current = new Date()
      }
    } catch (err) {
      console.error("Front camera access failed:", err)
    }
  }


  // ================= REAR CAMERA (Phone Webcam) =================
  const toggleRearCamera = async () => {
    if (rearCameraActive) {
      // Stop rear camera
      const stream = rearVideoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach(track => track.stop())
      if (rearVideoRef.current) rearVideoRef.current.srcObject = null
      setRearCameraActive(false)
      return
    }

    try {
      const { rearCam } = await getCameraDevices()

      if (!rearCam) {
        console.error("No phone (rear) camera found. Is DroidCam/Iriun running?")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: rearCam.deviceId,
          width: 1280,
          height: 720,
        },
      })

      if (rearVideoRef.current) {
        rearVideoRef.current.srcObject = stream
        await rearVideoRef.current.play()
        setRearCameraActive(true)
        setHazards([]) // Clear old hazards
        if (!sessionStartRef.current) sessionStartRef.current = new Date()
      }
    } catch (err) {
      console.error("Rear camera access failed:", err)
    }
  }


  // Toggle processing
  const toggleProcessing = () => {
    if (!isProcessing) {
      // starting a new VASE session
      startVaseSession().then((id) => {
        sessionIdRef.current = id
        alertCountRef.current = 0
        hazardCountRef.current = 0
        alertnessSumRef.current = 0
        alertnessSamplesRef.current = 0
      })
    } else {
      // stopping session: finalize stats
      if (sessionIdRef.current) {
        const averageAlertness =
          alertnessSamplesRef.current > 0 ? alertnessSumRef.current / alertnessSamplesRef.current : null

        endVaseSession({
          sessionId: sessionIdRef.current,
          startTime: sessionStartRef.current,
          totalAlerts: alertCountRef.current,
          averageAlertness,
          hazardsDetected: hazardCountRef.current,
          emergencyContactNotified: false,
        })
      }
      sessionIdRef.current = null
    }
    setIsProcessing(!isProcessing)
  }

  // Run detection loop when processing
  useEffect(() => {
    if (!isProcessing) return

    let active = true

    const loop = async () => {
      while (active && isProcessing) {
        await runDetection() // wait for model to finish
        await new Promise((r) => setTimeout(r, 500)) // pause 500ms
      }
    }

    loop()

    return () => {
      active = false
    }
  }, [isProcessing, runDetection])

  useEffect(() => {
    // Listen for alert changes
    const checkAlert = () => {
      const currentAlert = getCurrentAlert();
      if (currentAlert) {
        setAlert({
          type: currentAlert,
          message: currentAlert === 'hazard'
            ? 'Potential hazard detected.'
            : 'Drowsiness detected.'
        });
      } else {
        setAlert({ type: null, message: '' });
      }
    };

    const alertInterval = setInterval(checkAlert, 1000);
    return () => clearInterval(alertInterval);
  }, []);

  // Load TensorFlow models on client mount only
  useEffect(() => {
    if (typeof window === "undefined") return // prevent SSR failures

    let mounted = true
      ; (async () => {
        try {
          console.log("Loading TFJS models...")
          await loadModels()
          if (mounted) console.log("Models ready ✔")
        } catch (err) {
          console.error("Error loading models:", err)
        }
      })()

    return () => {
      mounted = false
    }
  }, [])

  // Get status display
  const getStatusDisplay = (status: SafetyStatus) => {
    switch (status) {
      case "safe":
        return { label: "SAFE", bg: "bg-success", text: "text-success" }
      case "caution":
        return { label: "CAUTION", bg: "bg-warning", text: "text-warning" }
      case "high-risk":
        return { label: "HIGH RISK", bg: "bg-destructive", text: "text-destructive" }
    }
  }

  const statusDisplay = getStatusDisplay(riskAssessment.overallStatus)

  return (
    <div className="min-h-screen bg-background">
      {/* Startup Guide Dialog */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to VASE (Vision-AI Safety Engine)</DialogTitle>
            <DialogDescription className="pt-2 space-y-2" asChild>
              <div className="text-muted-foreground text-sm pt-2 space-y-2">
                <p>
                  To utilize the <strong>Dual-Vision</strong> capabilities effectively, please ensure:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Front Camera:</strong> To monitor driver drowsiness.
                  </li>
                  <li>
                    <strong>Rear Camera:</strong> Connect an external webcam/dashcam or use your phone to monitor the road ahead.
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  This setup allows VASE to detect both internal driver state and external road hazards simultaneously.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start gap-2">
            <Button type="button" onClick={() => setShowGuide(false)}>
              I Understand
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowGuide(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audio for alerts */}
      <audio ref={audioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleU9PT46xvqF0Q0VBetjD2aJtOUJdxN7j4Z2CUUpBfbG8rH1LS0ttyuLx8qqIU0tBfaq6rnlKSEtzz+j2+qqJVEpAf6m5r3pJR0p40O3++q2MVUY8g6y5r31KSEp40vD//7GOVkY7hK66sH5KSUl41PL//7KQWEI4h6+7sYBLSkh41vT//7WSWUE2iLC8soFMS0h41/X//7iTW0E1irC8s4JNTEh52Pb//7qUXEAzjLG9tIROTUd52ff//7yVXkAyi7K+tYVPTkd52vj//76XX0Axi7O/toZQT0Z63Pn//8CYYEA…"
          type="audio/wav"
        />
      </audio>

      {/* Alert Notifications */}
      <AlertNotification
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: null, message: '' })}
      />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <VisionAILogo size="sm" />
            </div>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              Vision-AI Safety Engine (VASE)
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Risk Assessment Banner */}
        <motion.div
          className={`mb-6 p-4 rounded-xl border ${riskAssessment.overallStatus === "high-risk"
            ? "border-destructive bg-destructive/10"
            : riskAssessment.overallStatus === "caution"
              ? "border-warning bg-warning/10"
              : "border-success bg-success/10"
            }`}
          animate={riskAssessment.shouldAlert ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: riskAssessment.shouldAlert ? Number.POSITIVE_INFINITY : 0 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${statusDisplay.bg}`}>
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className={`text-2xl font-bold ${statusDisplay.text}`}>{statusDisplay.label}</div>
                <div className="text-sm text-muted-foreground">
                  Risk Score: {riskAssessment.riskScore}% | Alertness Risk: {Math.round(riskAssessment.alertnessRisk)}% | Hazard
                  Risk: {riskAssessment.hazardRisk}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={toggleProcessing} variant={isProcessing ? "destructive" : "default"} size="lg">
                {isProcessing ? "Stop VASE" : "Start VASE"}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Front Camera - Drowsiness */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Front Camera</CardTitle>
                    <CardDescription>Driver Alertness Monitoring</CardDescription>
                  </div>
                </div>
                <Button onClick={toggleFrontCamera} variant={frontCameraActive ? "destructive" : "outline"} size="sm">
                  {frontCameraActive ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-secondary/30">
                <video ref={frontVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={frontCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                {!frontCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Front camera for drowsiness detection</p>
                    </div>
                  </div>
                )}

                {/* Drowsiness Overlay */}
                {frontCameraActive && drowsiness && (
                  <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Alertness</span>
                      <span className={`text-lg font-bold ${getStatusColor(riskAssessment.overallStatus)}`}>
                        {Math.round(alertnessWindow.average)}%
                      </span>
                    </div>
                    <Progress value={alertnessWindow.average} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>EAR: {drowsiness.eyeAspectRatio.toFixed(3)}</span>
                      <span> {drowsiness.blinkFrequency}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rear Camera - Hazards */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <CardTitle>Rear Camera</CardTitle>
                    <CardDescription>Road Hazard Detection</CardDescription>
                  </div>
                </div>
                <Button onClick={toggleRearCamera} variant={rearCameraActive ? "destructive" : "outline"} size="sm">
                  {rearCameraActive ? <VideoOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-secondary/30">
                <video ref={rearVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={rearCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                {!rearCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Rear camera for hazard detection</p>
                    </div>
                  </div>
                )}

                {/* Hazard Overlay */}
                {rearCameraActive && hazards.length > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="animate-pulse">
                      {hazards.length} Hazard{hazards.length > 1 ? "s" : ""} Detected
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Risk Meter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Unified Risk Meter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-32 flex items-end justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-5xl font-bold ${getStatusColor(riskAssessment.overallStatus)}`}>
                      {riskAssessment.riskScore}%
                    </div>
                  </div>
                </div>
                <div className="h-4 rounded-full bg-gradient-to-r from-success via-warning to-destructive overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground/20"
                    style={{ marginLeft: `${riskAssessment.riskScore}%` }}
                    animate={{ marginLeft: `${riskAssessment.riskScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Safe</span>
                  <span>Caution</span>
                  <span>High Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Detections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Hazards
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hazards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No hazards detected</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {hazards.map((hazard) => (
                    <div key={hazard.id} className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{hazardLabels[hazard.objectClass] || hazard.objectClass}</span>
                        <Badge
                          variant={hazard.severity === "critical" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {hazard.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Confidence: {Math.round(hazard.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings & Alert History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Settings & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <Label htmlFor="sound">Alert Sound</Label>
                </div>
                <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="emergency" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Emergency Contact Email
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="emergency"
                      type="email"
                      placeholder="emergency@example.com"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={handleSaveContact}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Alerts from Critical Hazards or Drowsiness will prompt an email draft.
                  </p>
                </div>
              </div>

              {alertHistory.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-medium mb-2">Recent Alerts</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {alertHistory.slice(-5).map((alert, i) => (
                      <div key={i} className="text-xs text-muted-foreground flex justify-between">
                        <span className="truncate flex-1 mr-2">{alert.message}</span>
                        <span className="whitespace-nowrap">{alert.time.toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
