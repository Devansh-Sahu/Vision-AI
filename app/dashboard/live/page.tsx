"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Video, VideoOff, Eye, AlertTriangle, Volume2, VolumeX, Shield, Camera, Gauge } from "lucide-react"
import type { DVSERiskAssessment, DrowsinessMetrics, HazardDetection, SafetyStatus, AlertnessWindow } from "@/lib/types"
import { assessRisk, createAlertnessWindow, updateAlertnessWindow, getStatusColor } from "@/lib/dvse/engine"
import { runRealDrowsinessDetection, runRealHazardDetection } from "@/lib/detection"

const hazardLabels: Record<string, string> = {
  cow: "Cow",
  dog: "Dog",
  buffalo: "Buffalo",
  pothole: "Pothole",
  debris: "Debris",
  pedestrian: "Pedestrian",
}

export default function LiveDetectionPage() {
  const frontVideoRef = useRef<HTMLVideoElement>(null)
  const rearVideoRef = useRef<HTMLVideoElement>(null)

  const [frontCameraActive, setFrontCameraActive] = useState(false)
  const [rearCameraActive, setRearCameraActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

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
  const [showAlert, setShowAlert] = useState(false)
  const [alertHistory, setAlertHistory] = useState<{ time: Date; message: string; status: SafetyStatus }[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // // Simulate drowsiness detection
  // const simulateDrowsinessDetection = useCallback((): DrowsinessMetrics => {
  //   const baseAlertness = 75
  //   const timeVariation = Math.sin(Date.now() / 15000) * 25
  //   const randomVariation = (Math.random() - 0.5) * 15
  //   const alertnessScore = Math.max(0, Math.min(100, baseAlertness + timeVariation + randomVariation))

  //   return {
  //     alertnessScore: Math.round(alertnessScore),
  //     eyeAspectRatio: 0.2 + (alertnessScore / 100) * 0.15,
  //     blinkCount: Math.floor(Math.random() * 20) + 10,
  //     blinkFrequency: Math.floor(Math.random() * 10) + 12,
  //     isAlert: alertnessScore >= 50,
  //     headTilt: (Math.random() - 0.5) * 20,
  //     lookingAway: Math.random() > 0.9,
  //     yawning: Math.random() > 0.95,
  //     lastUpdated: Date.now(),
  //   }
  // }, [])

  // // Simulate hazard detection
  // const simulateHazardDetection = useCallback((): HazardDetection[] => {
  //   if (Math.random() > 0.7) return []

  //   const classes: Array<keyof typeof hazardLabels> = ["cow", "pothole", "debris", "pedestrian", "dog"]
  //   const detectedClass = classes[Math.floor(Math.random() * classes.length)]
  //   const confidence = 0.6 + Math.random() * 0.35

  //   const isCritical = ["cow", "pedestrian"].includes(detectedClass)
  //   let severity: HazardDetection["severity"] = "low"
  //   if (isCritical && confidence > 0.8) severity = "critical"
  //   else if (isCritical && confidence > 0.6) severity = "high"
  //   else if (confidence > 0.8) severity = "high"
  //   else if (confidence > 0.6) severity = "medium"

  //   return [
  //     {
  //       id: `${Date.now()}`,
  //       objectClass: detectedClass,
  //       confidence,
  //       severity,
  //       bbox: {
  //         x: 0.2 + Math.random() * 0.4,
  //         y: 0.3 + Math.random() * 0.3,
  //         width: 0.15 + Math.random() * 0.1,
  //         height: 0.2 + Math.random() * 0.1,
  //       },
  //       timestamp: Date.now(),
  //     },
  //   ]
  // }, [])

  // Main detection loop
  const runDetection = useCallback(async () => {
    try {
      // 1) Real drowsiness from front camera
      const newDrowsiness = await runRealDrowsinessDetection(frontVideoRef.current)
      if (newDrowsiness) {
        setDrowsiness(newDrowsiness)
        const newWindow = updateAlertnessWindow(alertnessWindow, newDrowsiness.alertnessScore)
        setAlertnessWindow(newWindow)
      } else {
        // if no face detected, you may choose to slowly degrade alertness or keep previous value
        const newWindow = updateAlertnessWindow(alertnessWindow, alertnessWindow.average) // keep same
        setAlertnessWindow(newWindow)
      }

      // 2) Real hazard detection from rear camera
      let newHazards: HazardDetection[] = []
      if (rearCameraActive) {
        newHazards = await runRealHazardDetection(rearVideoRef.current)
        setHazards(newHazards)
      } else {
        setHazards([])
      }

      // 3) Assess risk using existing engine
      const assessment = assessRisk(newDrowsiness, newHazards, alertnessWindow.average)
      setRiskAssessment(assessment)

      // 4) Alert logic (reuse your existing logic)
      if (assessment.shouldAlert && !showAlert) {
        setShowAlert(true)
        setAlertHistory((prev) => [
          ...prev.slice(-9),
          {
            time: new Date(),
            message: assessment.alertMessage || "Alert triggered",
            status: assessment.overallStatus,
          },
        ])

        if (soundEnabled && audioRef.current) {
          audioRef.current.play().catch(() => { })
        }

        setTimeout(() => setShowAlert(false), 5000)
      }

      // 5) Draw detections on canvas (placeholder - integrate with canvas if needed)
      drawDetections(newHazards)
    } catch (err) {
      console.error("runDetection error", err)
    }
  }, [alertnessWindow, showAlert, soundEnabled, rearCameraActive])

  // Simple placeholder for drawing detections; extend with canvas rendering as needed
  const drawDetections = (detections: HazardDetection[]) => {
    // No-op for now; keep for future visualization logic
  }

  // Toggle front camera
  const toggleFrontCamera = async () => {
    if (frontCameraActive) {
      const stream = frontVideoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
      if (frontVideoRef.current) frontVideoRef.current.srcObject = null
      setFrontCameraActive(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        })
        if (frontVideoRef.current) {
          frontVideoRef.current.srcObject = stream
          setFrontCameraActive(true)
        }
      } catch (err) {
        console.error("Front camera access failed:", err)
      }
    }
  }

  // Toggle rear camera
  const toggleRearCamera = async () => {
    if (rearCameraActive) {
      const stream = rearVideoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
      if (rearVideoRef.current) rearVideoRef.current.srcObject = null
      setRearCameraActive(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 1280, height: 720 },
        })
        if (rearVideoRef.current) {
          rearVideoRef.current.srcObject = stream
          setRearCameraActive(true)
        }
      } catch (err) {
        console.error("Rear camera access failed:", err)
      }
    }
  }

  useEffect(() => {
    if (!isProcessing) return
    const interval = setInterval(runDetection, 500)
    return () => clearInterval(interval)
  }, [isProcessing, runDetection])

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
    <div className="space-y-6">
      <audio ref={audioRef} preload="auto" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vision-AI Live</h1>
          <p className="text-muted-foreground">Real-time drowsiness and hazard monitoring</p>
        </div>
        <Button onClick={() => setIsProcessing(!isProcessing)} variant={isProcessing ? "destructive" : "default"}>
          {isProcessing ? "Stop Vision-AI" : "Start Vision-AI"}
        </Button>
      </div>

      {/* Risk Banner */}
      <motion.div
        className={`p-4 rounded-xl border ${riskAssessment.overallStatus === "high-risk"
            ? "border-destructive bg-destructive/10"
            : riskAssessment.overallStatus === "caution"
              ? "border-warning bg-warning/10"
              : "border-success bg-success/10"
          }`}
      >
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${statusDisplay.bg}`}>
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className={`text-xl font-bold ${statusDisplay.text}`}>{statusDisplay.label}</div>
            <div className="text-sm text-muted-foreground">Risk Score: {riskAssessment.riskScore}%</div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Front Camera */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Front Camera</CardTitle>
                  <CardDescription>Driver Alertness</CardDescription>
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
              {!frontCameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}
              {frontCameraActive && drowsiness && (
                <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Alertness</span>
                    <span className={`font-bold ${getStatusColor(riskAssessment.overallStatus)}`}>
                      {Math.round(alertnessWindow.average)}%
                    </span>
                  </div>
                  <Progress value={alertnessWindow.average} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rear Camera */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <CardTitle>Rear Camera</CardTitle>
                  <CardDescription>Road Hazards</CardDescription>
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
              {!rearCameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}
              {rearCameraActive && hazards.length > 0 && (
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="animate-pulse">
                    {hazards.length} Hazard Detected
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Controls */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Risk Meter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold text-center mb-4 ${getStatusColor(riskAssessment.overallStatus)}`}>
              {riskAssessment.riskScore}%
            </div>
            <div className="h-3 rounded-full bg-gradient-to-r from-success via-warning to-destructive" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Hazards</CardTitle>
          </CardHeader>
          <CardContent>
            {hazards.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No hazards detected</p>
            ) : (
              <div className="space-y-2">
                {hazards.map((h) => (
                  <div key={h.id} className="p-2 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="flex justify-between">
                      <span className="font-medium">{hazardLabels[h.objectClass]}</span>
                      <span className="text-sm">{Math.round(h.confidence * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <Label>Alert Sounds</Label>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
