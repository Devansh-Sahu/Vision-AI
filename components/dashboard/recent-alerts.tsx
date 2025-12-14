"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import type { Alert } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface RecentAlertsProps {
  alerts: (Alert & { camera?: { name: string; location: string } })[]
}

const severityColors = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

const statusColors = {
  active: "bg-destructive/20 text-destructive border-destructive/30",
  acknowledged: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  resolved: "bg-success/20 text-success border-success/30",
  false_positive: "bg-muted text-muted-foreground",
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Recent Alerts
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/alerts">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div
                  className={`h-2 w-2 rounded-full mt-2 ${
                    alert.severity === "critical"
                      ? "bg-destructive animate-pulse"
                      : alert.severity === "high"
                        ? "bg-orange-500"
                        : alert.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm truncate">{alert.title}</p>
                    <Badge variant="outline" className={severityColors[alert.severity]}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className={statusColors[alert.status]}>
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.camera?.name} - {alert.camera?.location}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(alert.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
