"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Camera, Clock } from "lucide-react"
import type { Detection } from "@/lib/types"
import { format } from "date-fns"

interface DetectionsTableProps {
  detections: (Detection & { camera?: { name: string; location: string } })[]
}

const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
  deer: { label: "Deer", color: "bg-success/20 text-success", icon: "🦌" },
  elk: { label: "Elk", color: "bg-primary/20 text-primary", icon: "🫎" },
  moose: { label: "Moose", color: "bg-accent/20 text-accent", icon: "🫎" },
  bear: { label: "Bear", color: "bg-yellow-500/20 text-yellow-400", icon: "🐻" },
  coyote: {
    label: "Coyote",
    color: "bg-orange-500/20 text-orange-400",
    icon: "🐺",
  },
  debris: {
    label: "Debris",
    color: "bg-destructive/20 text-destructive",
    icon: "⚠️",
  },
  pedestrian: {
    label: "Pedestrian",
    color: "bg-purple-500/20 text-purple-400",
    icon: "🚶",
  },
  vehicle_stopped: {
    label: "Stopped Vehicle",
    color: "bg-blue-500/20 text-blue-400",
    icon: "🚗",
  },
  other: { label: "Other", color: "bg-muted text-muted-foreground", icon: "❓" },
}

export function DetectionsTable({ detections }: DetectionsTableProps) {
  if (detections.length === 0) {
    return (
      <Card className="bg-card/50 border-border">
        <CardContent className="py-12 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No detections yet</h3>
          <p className="text-muted-foreground">Detections will appear here when the AI identifies objects</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-accent" />
          Recent Detections
          <Badge variant="secondary" className="ml-2">
            {detections.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Camera</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detections.map((detection) => {
                const config = typeConfig[detection.detection_type] || typeConfig.other
                const confidence = Math.round(detection.confidence * 100)

                return (
                  <TableRow key={detection.id} className="hover:bg-secondary/20">
                    <TableCell>
                      <Badge variant="outline" className={config.color}>
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              confidence >= 90 ? "bg-success" : confidence >= 70 ? "bg-yellow-500" : "bg-orange-500"
                            }`}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{confidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{detection.camera?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{detection.camera?.location || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(detection.detected_at), "MMM d, h:mm a")}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
