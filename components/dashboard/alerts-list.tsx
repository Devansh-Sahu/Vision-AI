"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MapPin, Check, X, Eye, Filter } from "lucide-react"
import type { Alert } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AlertsListProps {
  alerts: (Alert & {
    camera?: { name: string; location: string }
    detection?: { detection_type: string; confidence: number }
  })[]
}

const severityColors = {
  critical: "bg-destructive text-destructive-foreground border-destructive",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

const statusColors = {
  active: "bg-destructive/20 text-destructive border-destructive/30",
  acknowledged: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  resolved: "bg-success/20 text-success border-success/30",
  false_positive: "bg-muted text-muted-foreground border-muted",
}

export function AlertsList({ alerts }: AlertsListProps) {
  const [filter, setFilter] = useState<string>("all")

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((a) => a.status === filter)

  const statusCounts = {
    all: alerts.length,
    active: alerts.filter((a) => a.status === "active").length,
    acknowledged: alerts.filter((a) => a.status === "acknowledged").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {Object.entries(statusCounts).map(([status, count]) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className="gap-2"
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            <Badge variant="secondary" className="ml-1">
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Alerts */}
      {filteredAlerts.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
            <p className="text-muted-foreground">
              {filter === "all" ? "No alerts have been generated yet" : `No ${filter} alerts`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card
                  className={`bg-card/50 border-border hover:border-primary/30 transition-all ${
                    alert.status === "active" && alert.severity === "critical" ? "glow-critical" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Severity indicator */}
                      <div
                        className={`h-3 w-3 rounded-full mt-1.5 ${
                          alert.severity === "critical"
                            ? "bg-destructive animate-pulse"
                            : alert.severity === "high"
                              ? "bg-orange-500"
                              : alert.severity === "medium"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                        }`}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge variant="outline" className={severityColors[alert.severity]}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline" className={statusColors[alert.status]}>
                            {alert.status}
                          </Badge>
                        </div>

                        {alert.description && <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          {alert.camera && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.camera.name} - {alert.camera.location}
                            </div>
                          )}
                          {alert.detection && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {alert.detection.detection_type} ({Math.round(alert.detection.confidence * 100)}%
                              confidence)
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(alert.created_at), {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {alert.status === "active" && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Check className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                          <Button variant="ghost" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
