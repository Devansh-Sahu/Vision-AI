"use client"

import { motion } from "framer-motion"
import { Smartphone, Cpu, Shield, Bell, Eye, AlertTriangle, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Smartphone,
    title: "Dual Camera Input",
    description: "Front camera monitors your face for drowsiness. Rear camera (or dashcam) watches the road ahead.",
    color: "text-primary",
  },
  {
    icon: Cpu,
    title: "Vision-AI Processing",
    description: "TensorFlow.js + YOLO models run locally in your browser. No data leaves your device.",
    color: "text-accent",
  },
  {
    icon: Shield,
    title: "Unified Risk Assessment",
    description: "VASE combines both signals into a single Safety Status: Safe, Caution, or High-Risk.",
    color: "text-warning",
  },
  {
    icon: Bell,
    title: "Instant Life-Saving Alerts",
    description: "Visual warnings, audio alarms, and emergency SMS/calls when danger is detected.",
    color: "text-success",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            How <span className="text-gradient">Vision-AI</span> Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            One unified system. Two cameras. Complete safety coverage.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="
  rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all group

  /* MOBILE square tile */
  aspect-square p-3 flex flex-col items-center justify-center text-center space-y-2

  /* DESKTOP original layout */
  md:aspect-auto md:p-6 md:block md:text-left
"
>
                <div className="flex items-center gap-3 mb-4">
                <div className="
  h-8 w-8 md:h-10 md:w-10
  rounded-lg bg-primary/10 flex items-center justify-center
  group-hover:bg-primary/20 transition-colors
">
  <step.icon className={`h-4 w-4 md:h-5 md:w-5 ${step.color}`} />
</div>

                  <span className="hidden md:inline text-4xl font-bold text-muted-foreground/20">
  {index + 1}
</span>

                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="hidden md:block text-sm text-muted-foreground">
  {step.description}
</p>

              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 w-6 items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Vision-AI Detection Categories (Screenshot Version) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden md:block rounded-2xl border border-border bg-card/30 p-10 mt-10"
        >
          <h3 className="text-2xl font-semibold mb-10 text-center">
            What Vision-AI Detects
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Animals */}
            <div className="p-6 rounded-xl bg-card/50 border border-border hover:border-primary/40 transition-all">
              <h4 className="font-semibold text-lg mb-2 text-primary">Animals</h4>
              <p className="text-sm text-muted-foreground">
                Cow, Dog, Buffalo, Deer
              </p>
            </div>

            {/* Road Hazards */}
            <div className="p-6 rounded-xl bg-card/50 border border-border hover:border-primary/40 transition-all">
              <h4 className="font-semibold text-lg mb-2 text-primary">Road Hazards</h4>
              <p className="text-sm text-muted-foreground">
                Potholes, Debris, Fallen Trees
              </p>
            </div>

            {/* Vehicles */}
            <div className="p-6 rounded-xl bg-card/50 border border-border hover:border-primary/40 transition-all">
              <h4 className="font-semibold text-lg mb-2 text-primary">Vehicles</h4>
              <p className="text-sm text-muted-foreground">
                Wrong-way, Broken-down
              </p>
            </div>

            {/* Infrastructure */}
            <div className="p-6 rounded-xl bg-card/50 border border-border hover:border-primary/40 transition-all">
              <h4 className="font-semibold text-lg mb-2 text-primary">Infrastructure</h4>
              <p className="text-sm text-muted-foreground">
                Barriers, Construction, Black Spots
              </p>
            </div>

            {/* People */}
            <div className="p-6 rounded-xl bg-card/50 border border-border hover:border-primary/40 transition-all">
              <h4 className="font-semibold text-lg mb-2 text-primary">People</h4>
              <p className="text-sm text-muted-foreground">
                Pedestrians, Cyclists
              </p>
            </div>

            {/* Natural */}
            <div className="p-6 rounded-xl bg-card/50 border border-border hover:border-primary/40 transition-all">
              <h4 className="font-semibold text-lg mb-2 text-primary">Natural</h4>
              <p className="text-sm text-muted-foreground">
                Landslides, Flooding
              </p>
            </div>
          </div>
        </motion.div>
        {/* Driver Drowsiness Detection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-8"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">

            {/* Text Section */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Driver Drowsiness Detection</h3>
              </div>

              <p className="text-muted-foreground mb-4">
                Using TensorFlow.js face mesh and eye tracking, Vision-AI monitors driver alertness in real-time:
              </p>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Eye Aspect Ratio (EAR) monitoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Blink frequency analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  If alertness drops below 50%, triggers alarm
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Optional SMS/call to emergency contact
                </li>
              </ul>
            </div>

            {/* Right-Side Alertness Preview */}
            <div className="w-full lg:w-80">
              <div className="rounded-xl bg-card border border-border p-6">
                <div className="text-sm text-muted-foreground mb-2">Real-time Alertness</div>

                <div className="h-4 rounded-full bg-secondary overflow-hidden mb-2">
                  <div className="h-full w-[45%] alertness-gradient" />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-warning">45%</span>
                  <span className="text-xs text-destructive animate-pulse flex items-center gap-1">
                    <Bell className="h-3 w-3" /> Alert Triggered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
