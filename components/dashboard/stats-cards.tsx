"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Bell, AlertTriangle, Activity } from "lucide-react"
import { motion } from "framer-motion"

interface StatsCardsProps {
  stats: {
    vaseSessions: number
    totalDrowsinessEvents: number
    alertsTriggered: number
    totalHazards: number
    activeAlerts: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "VASE Sessions",
      value: stats.vaseSessions,
      subtitle: "Last 24 hours",
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Safety Alerts",
      value: stats.alertsTriggered,
      subtitle: "Drowsiness + hazards",
      icon: Bell,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Hazards Detected",
      value: stats.totalHazards,
      subtitle: "Last 24 hours",
      icon: AlertTriangle,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Active Alerts",
      value: stats.activeAlerts,
      subtitle: "Requires attention",
      icon: Activity,
      color: stats.activeAlerts > 0 ? "text-destructive" : "text-success",
      bgColor: stats.activeAlerts > 0 ? "bg-destructive/10" : "bg-success/10",
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="bg-card/50 border-border hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
