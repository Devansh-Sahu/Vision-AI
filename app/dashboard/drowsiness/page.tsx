import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default async function DrowsinessPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from("drowsiness_events")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(50)

  const drowsinessEvents = events || []
  const alertsTriggered = drowsinessEvents.filter((e) => e.triggered_alert).length
  const avgAlertness =
    drowsinessEvents.length > 0
      ? Math.round(drowsinessEvents.reduce((sum, e) => sum + e.alertness_score, 0) / drowsinessEvents.length)
      : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Drowsiness Monitoring</h1>
          <p className="text-muted-foreground">Track driver alertness and drowsiness events</p>
        </div>
        <Button asChild>
          <Link href="/drowsiness-demo">
            <Eye className="h-4 w-4 mr-2" />
            Start Detection
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{drowsinessEvents.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Alerts Triggered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{alertsTriggered}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Alertness</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${avgAlertness > 70 ? "text-success" : avgAlertness > 50 ? "text-warning" : "text-destructive"}`}
            >
              {avgAlertness}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card className="bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Recent Events
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/analytics">
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {drowsinessEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="mb-4">No drowsiness events recorded yet</p>
              <Button asChild>
                <Link href="/drowsiness-demo">Start Detection</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {drowsinessEvents.slice(0, 10).map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${event.triggered_alert ? "bg-destructive/5 border-destructive/20" : "bg-secondary/30 border-border"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${event.alertness_score > 70 ? "bg-success/20" : event.alertness_score > 50 ? "bg-warning/20" : "bg-destructive/20"}`}
                      >
                        <TrendingUp
                          className={`h-5 w-5 ${event.alertness_score > 70 ? "text-success" : event.alertness_score > 50 ? "text-warning" : "text-destructive"}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Alertness: {event.alertness_score}%</span>
                          {event.triggered_alert && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Alert
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>EAR: {event.eye_aspect_ratio?.toFixed(3) || "N/A"}</div>
                      <div>Blinks: {event.blink_frequency || 0}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
