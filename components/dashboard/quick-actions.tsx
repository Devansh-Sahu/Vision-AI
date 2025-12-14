"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, History, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const actions = [
  {
    title: "Start Vision-AI",
    description: "Launch the unified safety engine",
    icon: Shield,
    href: "/dualvision",
    color: "text-primary",
    bgColor: "bg-primary/10",
    primary: true,
  },
  {
    title: "Session History",
    description: "View past detection sessions",
    icon: History,
    href: "/dashboard/history",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Analytics",
    description: "Safety trends & insights",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Settings",
    description: "Configure alerts & contacts",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant={action.primary ? "default" : "outline"}
                className={`h-auto w-full p-4 flex flex-col items-start gap-2 ${action.primary ? "glow-primary" : "hover:border-primary/50 bg-transparent dark:hover:text-foreground"}`}
                asChild
              >
                <Link href={action.href}>
                  <div className={`p-2 rounded-lg ${action.primary ? "bg-primary-foreground/20" : action.bgColor}`}>
                    <action.icon className={`h-5 w-5 ${action.primary ? "text-primary-foreground" : action.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div
                      className={`text-xs font-normal ${action.primary ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                    >
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
