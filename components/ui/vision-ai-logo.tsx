"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface VisionAILogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  animate?: boolean
  showText?: boolean
}

export function VisionAILogo({ className, size = "md", animate = false, showText = true }: VisionAILogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
    xl: { icon: 64, text: "text-3xl" },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  const EyeIcon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative"
    >
      {/* Outer eye shape */}
      <motion.path
        d="M32 12C18 12 6 32 6 32C6 32 18 52 32 52C46 52 58 32 58 32C58 32 46 12 32 12Z"
        stroke="url(#eyeGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* Iris */}
      <motion.circle
        cx="32"
        cy="32"
        r="12"
        stroke="url(#irisGradient)"
        strokeWidth="2.5"
        fill="none"
        initial={animate ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: animate ? 0.8 : 0 }}
      />
      {/* Pupil */}
      <motion.circle
        cx="32"
        cy="32"
        r="5"
        fill="url(#pupilGradient)"
        initial={animate ? { scale: 0 } : { scale: 1 }}
        animate={animate ? { scale: [0, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.6, delay: animate ? 1 : 0 }}
      />
      {/* Light reflection */}
      <motion.circle
        cx="36"
        cy="28"
        r="2"
        fill="white"
        opacity={0.8}
        initial={animate ? { opacity: 0 } : { opacity: 0.8 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.3, delay: animate ? 1.3 : 0 }}
      />
      {/* AI scan lines */}
      <motion.g
        initial={animate ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: animate ? 1.5 : 0 }}
      >
        <line x1="20" y1="32" x2="26" y2="32" stroke="url(#scanGradient)" strokeWidth="1.5" opacity="0.6" />
        <line x1="38" y1="32" x2="44" y2="32" stroke="url(#scanGradient)" strokeWidth="1.5" opacity="0.6" />
        <line x1="32" y1="20" x2="32" y2="26" stroke="url(#scanGradient)" strokeWidth="1.5" opacity="0.6" />
        <line x1="32" y1="38" x2="32" y2="44" stroke="url(#scanGradient)" strokeWidth="1.5" opacity="0.6" />
      </motion.g>
      <defs>
        <linearGradient id="eyeGradient" x1="6" y1="32" x2="58" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="0.5" stopColor="#06b6d4" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="irisGradient" x1="20" y1="32" x2="44" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <radialGradient id="pupilGradient" cx="32" cy="32" r="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e1b4b" />
          <stop offset="1" stopColor="#4f46e5" />
        </radialGradient>
        <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  )

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        {EyeIcon}
        {animate && (
          <motion.div
            className="absolute inset-0 blur-xl bg-primary/30 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.3] }}
            transition={{ duration: 2, delay: 1 }}
          />
        )}
      </div>
      {showText && (
        <motion.span
          className={cn("font-bold tracking-tight", textSize)}
          initial={animate ? { opacity: 0, x: -10 } : { opacity: 1 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: animate ? 0.5 : 0 }}
        >
          Vision-AI
        </motion.span>
      )}
    </div>
  )
}
