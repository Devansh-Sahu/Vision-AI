"use client"

import { motion } from "framer-motion"
import { Train, Car, Shield, Zap, Eye, AlertTriangle } from "lucide-react"

export function Kavach() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Inspired by Indian Railways Kavach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-gradient">Kavach for Roads</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Just as Kavach prevents train collisions, Vision-AI prevents vehicle accidents with the same philosophy:
              Early Detection, Early Warning, Save Lives.
            </p>
          </div>

          {/* Comparison */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Kavach Railways */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card/50 border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Train className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Kavach - Railways</h3>
                  <p className="text-sm text-muted-foreground">Train Collision Avoidance</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-accent mt-0.5" />
                  <span>Auto-braking on collision course</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-accent mt-0.5" />
                  <span>Real-time signal monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-accent mt-0.5" />
                  <span>Driver alerting system</span>
                </li>
              </ul>
            </motion.div>

            {/* Vision-AI Roads */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-primary/10 border border-primary/30"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Vision-AI - Roads</h3>
                  <p className="text-sm text-muted-foreground">Vehicle Accident Prevention</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5" />
                  <span>AI hazard detection & alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-primary mt-0.5" />
                  <span>Real-time road monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary mt-0.5" />
                  <span>Drowsiness detection system</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Common Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center p-8 rounded-2xl border border-success/30 bg-success/5"
          >
            <h3 className="text-xl font-semibold text-success mb-4">Same Philosophy, Different Domain</h3>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">Early Detection</div>
                <p className="text-sm text-muted-foreground">Identify threats before impact</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">Early Warning</div>
                <p className="text-sm text-muted-foreground">Alert users immediately</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">Save Lives</div>
                <p className="text-sm text-muted-foreground">Prevent accidents, save families</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
