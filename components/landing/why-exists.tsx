"use client"

import { motion } from "framer-motion"
import { Heart, Users, Clock, MapPin } from "lucide-react"

export function WhyExists() {
  return (
    <section id="why-vision-ai" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8">
            Why <span className="text-gradient">Vision-AI</span> Exists
          </h2>

          {/* Story */}
          <div className="max-w-3xl mx-auto space-y-6 text-lg text-muted-foreground text-pretty">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Every day in India, over <span className="text-foreground font-semibold">400 families</span> lose a loved
              one to road accidents. A father driving home from work. A student on their way to college. A truck driver
              providing for their family.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Most of these accidents are <span className="text-foreground font-semibold">preventable</span>. A cow on
              NH-44 at night. A pothole that wasn&apos;t visible. A driver who dozed off for just a second. Moments that
              change lives forever.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Vision-AI exists because we believe{" "}
              <span className="text-success font-semibold">one alert can save a life</span>. One warning about an animal
              ahead. One alarm when eyes start closing. One notification to emergency contacts.
            </motion.p>
          </div>

          {/* Impact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="hidden md:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
          >
            <div className="p-6 rounded-xl bg-card/50 border border-border">
              <Heart className="h-8 w-8 text-destructive mx-auto mb-3" />
              <div className="text-2xl font-bold">1 Alert</div>
              <div className="text-sm text-muted-foreground">Can Save a Life</div>
            </div>
            <div className="p-6 rounded-xl bg-card/50 border border-border">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold">1 Family</div>
              <div className="text-sm text-muted-foreground">Stays Together</div>
            </div>
            <div className="p-6 rounded-xl bg-card/50 border border-border">
              <Clock className="h-8 w-8 text-warning mx-auto mb-3" />
              <div className="text-2xl font-bold">2 Seconds</div>
              <div className="text-sm text-muted-foreground">Early Warning Matters</div>
            </div>
            <div className="p-6 rounded-xl bg-card/50 border border-border">
              <MapPin className="h-8 w-8 text-success mx-auto mb-3" />
              <div className="text-2xl font-bold">Every Road</div>
              <div className="text-sm text-muted-foreground">Made Safer</div>
            </div>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-xl italic text-muted-foreground max-w-2xl mx-auto"
          >
            &quot;We can&apos;t prevent every accident, but we can give everyone a fighting chance. That&apos;s what
            Vision-AI is about.&quot;
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  )
}
