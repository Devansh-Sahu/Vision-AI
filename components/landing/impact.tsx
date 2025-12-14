"use client"

import { motion } from "framer-motion"
import { Heart, TrendingDown, Shield } from "lucide-react"
import { useEffect, useState, useRef } from "react"

const stats = [
  { value: 1190000, label: "Annual Road Deaths across World", suffix: "+", icon: Heart },
  { value: 40, label: "Potential Reduction", suffix: "%", icon: TrendingDown },
  { value: 62000, label: "Lives That Could Be Saved", suffix: "", icon: Shield },
]

const causes = [
  { cause: "Animals on Highways", percentage: 15 },
  { cause: "Potholes & Road Damage", percentage: 12 },
  { cause: "Drowsy/Distracted Driving", percentage: 25 },
  { cause: "Sudden Obstructions", percentage: 18 },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true)
          const duration = 2000
          const steps = 60
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setDisplayValue(value)
              clearInterval(timer)
            } else {
              setDisplayValue(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export function Impact() {
  return (
    <section id="impact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-background to-success/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Impact: <span className="text-gradient">Saving Lives WorldWide</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            WorldWide over 11.9 lakh road deaths every year. Vision-AI addresses the leading causes with AI-powered
            early detection and alerts.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-card/50 border border-border"
            >
              <stat.icon
                className={`h-8 w-8 mx-auto mb-4 ${index === 2 ? "text-success" : index === 1 ? "text-accent" : "text-destructive"}`}
              />
              <div className="text-4xl sm:text-5xl font-bold text-foreground">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Cause Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card/30 p-8 mb-16"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Major Causes Vision-AI Addresses</h3>
          <div className="space-y-4">
            {causes.map((item) => (
              <div key={item.cause} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.cause}</span>
                  <span className="text-primary">{item.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percentage * 2}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Government Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden md:block text-center"

        >
          <h3 className="text-lg font-semibold mb-6">Designed for Collaboration With</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {["Ministries of Transport", "National Highway & Infrastructure Agencies", "Road Safety Councils", "Smart City Mission", "Public Transit & Municipal Agencies"].map((org) => (
              <div
                key={org}
                className="px-6 py-3 rounded-full bg-card border border-border text-sm text-muted-foreground"
              >
                {org}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
