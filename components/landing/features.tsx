"use client"

import { motion } from "framer-motion"
import { Video, Brain, Bell, Smartphone, Globe, Zap, Lock, Cloud } from "lucide-react"

const features = [
  {
    icon: Video,
    title: "Multiple Input Sources",
    description: "Upload videos, connect webcam, or stream from dashcam. Works with any video source.",
  },
  {
    icon: Brain,
    title: "Browser-Based AI",
    description: "TensorFlow.js runs models directly in your browser. No server needed, full privacy.",
  },
  {
    icon: Bell,
    title: "Multi-Channel Alerts",
    description: "Visual warnings, audio alarms, SMS notifications, and emergency calls.",
  },
  {
    icon: Smartphone,
    title: "Emergency Contacts",
    description: "Set up contacts to receive alerts when drowsiness or hazards are detected.",
  },
  {
    icon: Globe,
    title: "100% Web-Based",
    description: "No app installation, no special hardware. Just open browser and start.",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Sub-200ms detection time using optimized YOLO models for instant alerts.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "All processing happens locally. Your video never leaves your device.",
  },
  {
    icon: Cloud,
    title: "Optional Cloud Sync",
    description: "Save detection history and analytics to cloud for fleet management.",
  },
]

export function LandingFeatures() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything You Need for <span className="text-gradient">Road Safety</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete AI-powered safety platform that works anywhere, anytime, on any device.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="h-full p-6 rounded-xl bg-card/50 border border-border hover:border-primary/40 transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
