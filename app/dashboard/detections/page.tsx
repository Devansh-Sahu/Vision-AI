import { createClient } from "@/lib/supabase/server"
import { DetectionsTable } from "@/components/dashboard/detections-table"

export default async function DetectionsPage() {
  const supabase = await createClient()

  const { data: detections } = await supabase
    .from("detections")
    .select("*, camera:cameras(*)")
    .order("detected_at", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Detections</h2>
        <p className="text-muted-foreground">AI detection history and analysis</p>
      </div>

      <DetectionsTable detections={detections || []} />
    </div>
  )
}
