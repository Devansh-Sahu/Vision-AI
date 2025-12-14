import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DetectionChart } from "@/components/dashboard/detection-chart"
import { Shield } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch dashboard data with error handling
  let alerts: any[] = []
  let drowsinessEvents: any[] = []
  let hazardDetections: any[] = []
  let vaseSessionsCount = 0

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const [alertsRes, drowsinessRes, hazardsRes, sessionsRes] = await Promise.all([
      supabase.from("alerts").select("*, camera:cameras(*)").order("created_at", { ascending: false }).limit(5),
      supabase
        .from("drowsiness_events")
        .select("*")
        .gte("timestamp", since),
      supabase
        .from("hazard_detections")
        .select("*")
        .gte("timestamp", since),
      supabase
        .from("vase_sessions")
        .select("id"),
    ])

    alerts = alertsRes.data || []
    drowsinessEvents = drowsinessRes.data || []
    hazardDetections = hazardsRes.data || []
    vaseSessionsCount = sessionsRes.data?.length || 0
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
  }

  const stats = {
    vaseSessions: vaseSessionsCount,
    totalDrowsinessEvents: drowsinessEvents.length,
    alertsTriggered: alerts.length,
    totalHazards: hazardDetections.length,
    activeAlerts: alerts.filter((a) => a.status === "active").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vision-AI Dashboard</h1>
          <p className="text-muted-foreground">Monitor your safety metrics and start new detection sessions.</p>
        </div>
      </div>

      <StatsCards stats={stats} />

      <QuickActions />

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentAlerts alerts={alerts} />
        <DetectionChart drowsinessEvents={drowsinessEvents} hazardDetections={hazardDetections} />
      </div>
    </div>
  )
}
