"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Building2, Phone } from "lucide-react"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"

// ⚠️ Replace with your Stripe Publishable Key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string)

export function LandingCTA() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const prices = {
    pro: billingCycle === "monthly" ? 5 : 50,
    enterprise: billingCycle === "monthly" ? 20 : 200,
  }

  // ⚠️ Replace these with your real Stripe Price IDs
  const STRIPE_PRICES = {
    pro: {
      monthly: "price_1SdZM5FukbsOAJbKPtMJgZtH",
      yearly: "price_1SdZM5FukbsOAJbKNmlxe4A3",
    },
    enterprise: {
      monthly: "price_1SdZMTFukbsOAJbKxCe0z2KE",
      yearly: "price_1SdZMnFukbsOAJbKig3R1of5",
    },
  }
  async function handleCheckout(priceId: string) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ priceId })
    })
  
    const data = await res.json()
  
    if (data?.url) {
      window.location.href = data.url   // Redirect user to Stripe Checkout
    } else {
      console.error("Stripe checkout failed:", data)
    }
  }
  
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

          {/* ==================== HEADING ==================== */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Start Using <span className="text-gradient">Vision-AI</span> Today
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a plan that fits your needs. Vision-AI gives real-time hazard detection,
            drowsiness alerts, and VASE intelligent mapping.
          </p>

          {/* ==================== BILLING TOGGLE ==================== */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex gap-4 items-center">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1 rounded-full text-sm transition ${
                  billingCycle === "monthly" ? "bg-primary text-white" : "text-gray-300"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1 rounded-full text-sm transition ${
                  billingCycle === "yearly" ? "bg-primary text-white" : "text-gray-300"
                }`}
              >
                Yearly (-20%)
              </button>
            </div>
          </div>

          {/* ==================== PRICING CARDS ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

            {/* -------- FREE PLAN -------- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 
              hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 flex flex-col"
            >
              <h3 className="text-2xl font-semibold text-white mb-2">Free</h3>
              <p className="text-muted-foreground mb-4">Perfect to get started</p>

              <ul className="space-y-2 text-gray-300 text-sm text-left flex-1">
                <li>• Basic Hazard Detection</li>
                <li>• Eye & Face Tracking</li>
                <li>• On-Device AI Engine</li>
                <li>• 10 VASE Map Updates / Day</li>
                <li>• Community Support</li>
              </ul>

              <div className="mt-6 text-3xl font-bold text-white">$0</div>

              <Button className="mt-6 w-full glow-primary" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </motion.div>

            {/* -------- PRO PLAN -------- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/20 
              backdrop-blur-xl p-6 hover:scale-[1.03] transition-all duration-300 shadow-lg shadow-primary/10 flex flex-col"
            >
              <div className="mb-2">
                <span className="text-xs bg-primary/30 px-2 py-1 rounded-full text-primary font-semibold">
                  MOST POPULAR
                </span>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-2">Pro</h3>
              <p className="text-gray-300 mb-4">Best for daily drivers</p>

              <ul className="space-y-2 text-gray-200 text-sm text-left flex-1">
                <li>• Advanced Hazard Classifier</li>
                <li>• Drowsiness Alerts</li>
                <li>• Unlimited AI Inference</li>
                <li>• 100 VASE Heatmap Updates / Day</li>
                <li>• Priority Support</li>
              </ul>

              <div className="mt-6 text-3xl font-bold text-white">
                ${prices.pro}
                <span className="text-lg font-medium text-gray-300">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
              </div>

              <Button
                className="mt-6 w-full bg-primary text-white hover:bg-primary/80 glow-primary"
                onClick={() => handleCheckout(STRIPE_PRICES.pro[billingCycle])}
              >
                Buy Now
              </Button>
            </motion.div>

            {/* -------- ENTERPRISE PLAN -------- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 
              hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 flex flex-col"
            >
              <h3 className="text-2xl font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-4">For fleet & highway agencies</p>

              <ul className="space-y-2 text-gray-300 text-sm text-left flex-1">
                <li>• Full Vision-AI + VASE Suite</li>
                <li>• Fleet Dashboard & Telemetry</li>
                <li>• Government-Grade Alerts</li>
                <li>• Unlimited Geo-Updates</li>
                <li>• 24/7 Support</li>
              </ul>

              <div className="mt-6 text-3xl font-bold text-white">
                ${prices.enterprise}
                <span className="text-lg font-medium text-gray-300">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
              </div>

              <Button
                className="mt-6 w-full glow-primary"
                onClick={() => handleCheckout(STRIPE_PRICES.enterprise[billingCycle])}
              >
                Buy Now
              </Button>
            </motion.div>
          </div>

          {/* ============ GOVERNMENT CTA ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-20 p-8 rounded-2xl border border-primary/30 bg-primary/5"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Government & Enterprise</h3>
            </div>

            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Are you from highway authorities or transport ministries? 
              Let's explore how Vision-AI can reduce accidents at scale.
            </p>

            <Button variant="outline" size="lg" asChild>
              <Link href="/about#contact">
                <Phone className="mr-2 h-4 w-4" />
                Contact for Partnership
              </Link>
            </Button>
          </motion.div>

          <p className="mt-8 text-sm text-muted-foreground">
            Vision-AI pricing plans vary for individual users and organizations.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
