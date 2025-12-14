"use client"
import { useState, useEffect } from "react"
import { motion} from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Eye, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { VisionAILogo } from "@/components/ui/vision-ai-logo"

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-10">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.25_0.02_260)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.25_0.02_260)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Main Container */}
      <div className="relative z-10 max-w-[1500px] px-6 lg:px-3 py-12 w-full">
        
        {/* NEW 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE — TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left max-w-3xl"
          >
            {/* Logo */}
            <div className="mb-6 lg:ml-18">
              <VisionAILogo size="xl" animate showText={false} />
            </div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-sm text-primary">Vision-AI Safety Engine (VASE)</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-7xl lg:text-8xl xl:text-7xl font-extrabold leading-[0.96]"
            >
              <span className="text-gradient">Vision-AI</span>
              <br/>
              <span className="text-foreground">Saving Lives on Roads WorldWide</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-lg text-muted-foreground max-w-md"
            >
              A unified AI system for drowsiness monitoring and real-time road hazard detection, sending alerts before accidents happen.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 flex flex-wrap gap-4"

            >
              <Button size="lg" asChild className="group glow-primary">
                <Link href="/dualvision">
                  <Shield className="mr-2 h-5 w-5" />
                  Try Vision-AI Demo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="hidden md:flex md:flex-wrap md:gap-4 mt-6"
            >
           <FeaturePill icon={<Eye className="h-4 w-4 text-primary" />} text="Front Camera: Driver Alertness" />
           <FeaturePill icon={<AlertTriangle className="h-4 w-4 text-warning" />} text="Rear Camera: Road Hazards" />
           <FeaturePill icon={<Shield className="h-4 w-4 text-success" />} text="Unified Risk Assessment" />
         </motion.div>


        </motion.div>

          {/* RIGHT SIDE — COW DEMO */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 flex flex-wrap gap-4"
          >
          <div className="w-[460px] lg:w-[580px] xl:w-[650px] lg:-ml-4 xl:-ml-6 relative z-10 pointer-events-none">
            <CowDetectionDemo />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FeaturePill({ icon, text }: any) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground">
      {icon}
      {text}
    </div>
  )
}

function CowDetectionDemo() {
  const frames = [
    {
      src: "/cow.png",
      label: "cow",
      confidence: 0.94,
      box: { top: "33%", left: "32%", width: "31%", height: "38%" }
    },
    {
      src: "/pothole.png",
      label: "pothole",
      confidence: 0.87,
      box: { top: "55%", left: "28%", width: "22%", height: "18%" }
    },
    {
      src: "/tree.png",
      label: "fallen tree",
      confidence: 0.91,
      box: { top: "22%", left: "18%", width: "55%", height: "40%" }
    }
  ]

  const [index, setIndex] = useState(0)

  // Change image every 1.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % frames.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const frame = frames[index]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border bg-card/50 backdrop-blur">
      {/* Live Demo Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/90 text-destructive-foreground text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          LIVE DEMO
        </div>
      </div>

      {/* Camera Feed Frame */}
      <div className="relative aspect-[4/3] bg-secondary/50 overflow-hidden">

        {/* Animated frame switching */}
        <motion.img
          key={frame.src}
          src={frame.src}
          alt={frame.label}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </div>

        {/* Bounding Box */}
        <motion.div
          key={frame.label + "-box"}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute"
          style={frame.box}
        >
          <div className="absolute inset-0 border-2 border-warning rounded animate-pulse" />
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-warning" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-warning" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-warning" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-warning" />
        </motion.div>

        {/* Label */}
        <motion.div
          key={frame.label + "-label"}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute"
          style={{
            top: `calc(${frame.box.top} - 32px)`,
            left: frame.box.left
          }}
        >
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-warning text-warning-foreground text-sm font-medium">
              {frame.label}
            </div>
            <div className="px-2 py-1 rounded bg-background/80 text-foreground text-sm font-mono">
              {frame.confidence}
            </div>
          </div>
        </motion.div>

        {/* Glow pulse */}
        <motion.div
          className="absolute inset-0 border-4 border-warning/50 rounded-lg"
          animate={{ opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">VASE Active</span>
              </div>
              <div className="text-sm text-muted-foreground">Rear Camera Feed</div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500 font-medium">Hazard Alert Triggered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="p-4 bg-card/80 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          <span className="text-foreground font-medium">Example:</span>{" "}
          {frame.label} detected with {frame.confidence} confidence. Vision-AI alerts the driver.
        </p>
      </div>
    </div>
  )
}

export default CowDetectionDemo
