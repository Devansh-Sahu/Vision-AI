import { createClient } from "@/lib/supabase/server"
import { CamerasGrid } from "@/components/dashboard/cameras-grid"

export default async function CamerasPage() {
  const supabase = await createClient()

  const { data: cameras } = await supabase.from("cameras").select("*").order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Camera Management</h2>
          <p className="text-muted-foreground">Monitor and manage your camera network</p>
        </div>
      </div>

      <CamerasGrid cameras={cameras || []} />
    </div>
  )
}
