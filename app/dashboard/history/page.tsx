"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, AlertTriangle, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { DVSESessionRecord } from "@/lib/types"

export default function SessionHistoryPage() {
  const [sessions, setSessions] = useState<DVSESessionRecord[]>([])

  useEffect(() => {
    const supabase = createClient()

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("vase_sessions")
        .select("*")
        .order("start_time", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error loading VASE sessions", error)
        return
      }

      setSessions((data || []) as DVSESessionRecord[])
    }

    fetchSessions()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Session History</h1>
        <p className="text-muted-foreground">View your past Vision-AI Safety Engine sessions</p>
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => {
          const date = new Date(session.start_time)
          const durationMinutes = session.duration_seconds ? Math.round(session.duration_seconds / 60) : 0
          const avgAlertness = session.average_alertness ?? 0
          const hazardsDetected = session.hazards_detected
          const alertsTriggered = session.total_alerts
          const status = session.end_time ? "completed" : "active"

          return (
            <Card key={session.id} className="bg-card/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">VASE Session</CardTitle>
                      <CardDescription>
                        {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{durationMinutes} min</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">{Math.round(avgAlertness)}%</div>
                      <div className="text-xs text-muted-foreground">Avg Alertness</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <div>
                      <div className="text-sm font-medium">{hazardsDetected}</div>
                      <div className="text-xs text-muted-foreground">Hazards</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-destructive" />
                    <div>
                      <div className="text-sm font-medium">{alertsTriggered}</div>
                      <div className="text-xs text-muted-foreground">Alerts</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {sessions.length === 0 && (
          <Card className="bg-card/50">
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-medium mb-1">No sessions yet</h3>
              <p className="text-sm text-muted-foreground">
                Start your first Vision-AI session to see your history here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
