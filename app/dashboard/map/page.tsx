import { createClient } from "@/lib/supabase/server"
import { MapView } from "@/components/dashboard/map-view"

export default async function MapPage() {
  const supabase = await createClient()

  let cameras = []
  let hazards = []

  try {
    const [camerasRes, hazardsRes] = await Promise.all([
      supabase.from("cameras").select("*"),
      supabase
        .from("hazard_detections")
        .select("*")
        .gte("timestamp", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ])

    cameras = camerasRes.data || []
    hazards = hazardsRes.data || []
  } catch (error) {
    console.error("Failed to fetch map data:", error)
    // Fallback: keep empty arrays so the map still renders
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Map View</h2>
        <p className="text-muted-foreground">Geographic view of your camera network and recent hazard detections</p>
      </div>

      <MapView cameras={cameras} hazards={hazards} />
    </div>
  )
}
