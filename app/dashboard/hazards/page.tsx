import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, ArrowRight, MapPin } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

const severityColors = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-accent text-accent-foreground",
  low: "bg-muted text-muted-foreground",
}

const classLabels: Record<string, string> = {
  cow: "Cow",
  dog: "Dog",
  buffalo: "Buffalo",
  goat: "Goat",
  deer: "Deer",
  pothole: "Pothole",
  fallen_tree: "Fallen Tree",
  debris: "Debris",
  broken_vehicle: "Broken Vehicle",
  pedestrian: "Pedestrian",
  wrong_way_vehicle: "Wrong-Way Vehicle",
  landslide: "Landslide",
  flooding: "Flooding",
}

export default async function HazardsPage() {
  const supabase = await createClient()

  const { data: hazards } = await supabase
    .from("hazard_detections")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(50)

  const hazardDetections = hazards || []
  const criticalCount = hazardDetections.filter((h) => h.severity_level === "critical").length
  const highCount = hazardDetections.filter((h) => h.severity_level === "high").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hazard Detections</h1>
          <p className="text-muted-foreground">Road hazards detected from video analysis</p>
        </div>
        <Button asChild>
          <Link href="/hazard-demo">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Start Detection
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Hazards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{hazardDetections.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-destructive">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{criticalCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10 border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-warning">High</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{highCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {hazardDetections.length > 0
                ? Math.round(
                    (hazardDetections.reduce((sum, h) => sum + h.confidence, 0) / hazardDetections.length) * 100,
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hazards List */}
      <Card className="bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Recent Detections
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/analytics">
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {hazardDetections.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="mb-4">No hazards detected yet</p>
              <Button asChild>
                <Link href="/hazard-demo">Start Detection</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {hazardDetections.slice(0, 10).map((hazard) => (
                <div
                  key={hazard.id}
                  className={`p-4 rounded-lg border ${hazard.severity_level === "critical" ? "bg-destructive/5 border-destructive/20" : hazard.severity_level === "high" ? "bg-warning/5 border-warning/20" : "bg-secondary/30 border-border"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${hazard.severity_level === "critical" ? "bg-destructive/20" : hazard.severity_level === "high" ? "bg-warning/20" : "bg-accent/20"}`}
                      >
                        <AlertTriangle
                          className={`h-5 w-5 ${hazard.severity_level === "critical" ? "text-destructive" : hazard.severity_level === "high" ? "text-warning" : "text-accent"}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{classLabels[hazard.object_class] || hazard.object_class}</span>
                          <Badge className={severityColors[hazard.severity_level as keyof typeof severityColors]}>
                            {hazard.severity_level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(hazard.timestamp), { addSuffix: true })}
                          </span>
                          {hazard.highway_name && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {hazard.highway_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{Math.round(hazard.confidence * 100)}%</div>
                      <div className="text-xs text-muted-foreground">confidence</div>
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
