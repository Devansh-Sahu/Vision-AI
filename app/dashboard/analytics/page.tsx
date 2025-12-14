import { createClient } from "@/lib/supabase/server"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [drowsinessRes, hazardsRes, alertsRes] = await Promise.all([
    supabase.from("drowsiness_events").select("*"),
    supabase.from("hazard_detections").select("*"),
    supabase.from("alerts").select("*"),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">Insights and trends from your Vision-AI detection data</p>
      </div>

      <AnalyticsDashboard
        drowsinessEvents={drowsinessRes.data || []}
        hazardDetections={hazardsRes.data || []}
        alerts={alertsRes.data || []}
      />
    </div>
  )
}
