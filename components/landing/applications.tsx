"use client"

import { motion } from "framer-motion"
import { Truck, Construction, Bus, AlertTriangle, MapPin, Building2, Package, Moon } from "lucide-react"

const applications = [
  {
    icon: AlertTriangle,
    title: "Highway Animal Detection",
    description: "Detect cows, buffalos, dogs, and other animals on national highways to prevent collisions.",
    color: "text-warning",
  },
  {
    icon: Construction,
    title: "Pothole Identification",
    description: "Smart City infrastructure assessment tool for identifying road damage and maintenance needs.",
    color: "text-accent",
  },
  {
    icon: Truck,
    title: "Drowsiness Detection for Fleet Drivers",
    description: "Monitor truck and long-haul drivers for fatigue, preventing accidents from drowsy driving.",
    color: "text-primary",
  },
  {
    icon: Bus,
    title: "School Bus Safety Monitoring",
    description: "Ensure student safety with driver alertness monitoring on school transport routes.",
    color: "text-success",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Hazard Detection",
    description: "Identify fallen poles, trees, debris, and other sudden road obstructions.",
    color: "text-destructive",
  },
  {
    icon: MapPin,
    title: "Wrong-Way Vehicle Detection",
    description: "Alert systems for vehicles entering highways from wrong directions.",
    color: "text-warning",
  },
  {
    icon: Package,
    title: "Logistics Fleet Safety",
    description: "Enterprise solution for Amazon, DHL, and other logistics companies to reduce delivery accidents.",
    color: "text-accent",
  },
  {
    icon: Moon,
    title: "Two-Wheeler Night Ride Safety",
    description: "Enhanced detection and alerts for motorcycle and scooter riders during night travel.",
    color: "text-primary",
  },
  {
    icon: Building2,
    title: "Government Road Assessment",
    description: "Infrastructure evaluation tool for MoRTH, NHAI, and State Highway departments.",
    color: "text-success",
  },
]

export function Applications() {
  return (
    <section id="applications" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Real-World <span className="text-gradient">Applications</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From individual drivers to government agencies, Vision-AI serves diverse safety needs across India.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {applications.map((app, index) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="h-full p-5 rounded-xl bg-card/50 border border-border hover:border-primary/40 hover:bg-card/80 transition-all duration-300">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <app.icon className={`h-5 w-5 ${app.color}`} />
                </div>
                <h3 className="font-semibold mb-2 text-sm">{app.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{app.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
