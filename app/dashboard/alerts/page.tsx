import { createClient } from "@/lib/supabase/server"
import { AlertsList } from "@/components/dashboard/alerts-list"

export default async function AlertsPage() {
  const supabase = await createClient()

  const { data: alerts } = await supabase
    .from("alerts")
    .select("*, camera:cameras(*), detection:detections(*)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Alerts</h2>
        <p className="text-muted-foreground">Monitor and manage detection alerts</p>
      </div>

      <AlertsList alerts={alerts || []} />
    </div>
  )
}
