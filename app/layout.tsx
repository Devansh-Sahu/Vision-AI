import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Vision-AI | Web-Based Accident Prevention AI for India",
  description:
    "Vision-AI is a web-based accident-prevention AI system for India that detects hazardous objects, potholes, and driver drowsiness in real time, sending life-saving alerts to prevent accidents.",
  keywords: [
    "Vision-AI",
    "road safety",
    "accident prevention",
    "driver drowsiness detection",
    "pothole detection",
    "highway safety India",
    "AI object detection",
    "TensorFlow.js",
    "YOLO",
    "smart roads",
  ],
  authors: [{ name: "Vision-AI" }],
  openGraph: {
    title: "Vision-AI | Saving Lives on Indian Roads",
    description:
      "Real-time AI detection of road hazards and driver drowsiness. Preventing accidents before they happen.",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} font-sans antialiased`}>
          <div className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-10 w-full">
            {children}
          </div>
        <Analytics />
      </body>
    </html>
  )
}
