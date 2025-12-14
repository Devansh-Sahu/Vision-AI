"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, AlertTriangle } from "lucide-react"
import type { DrowsinessEvent, HazardDetection } from "@/lib/types"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts"

interface DetectionChartProps {
  drowsinessEvents: DrowsinessEvent[]
  hazardDetections: HazardDetection[]
}

const hazardLabels: Record<string, string> = {
  cow: "Cow",
  dog: "Dog",
  buffalo: "Buffalo",
  pothole: "Pothole",
  debris: "Debris",
  pedestrian: "Pedestrian",
  fallen_tree: "Fallen Tree",
  broken_vehicle: "Broken Vehicle",
  wrong_way_vehicle: "Wrong-Way",
  other: "Other",
}

const hazardColors: Record<string, string> = {
  cow: "oklch(0.78 0.18 85)",
  dog: "oklch(0.65 0.2 145)",
  buffalo: "oklch(0.75 0.15 50)",
  pothole: "oklch(0.55 0.24 25)",
  debris: "oklch(0.6 0.15 260)",
  pedestrian: "oklch(0.55 0.22 265)",
  fallen_tree: "oklch(0.5 0.18 140)",
  broken_vehicle: "oklch(0.6 0.1 200)",
  wrong_way_vehicle: "oklch(0.55 0.24 25)",
  other: "oklch(0.5 0.05 260)",
}

export function DetectionChart({ drowsinessEvents, hazardDetections }: DetectionChartProps) {
  // Process drowsiness data for timeline chart
  const drowsinessData = drowsinessEvents
    .slice(0, 20)
    .reverse()
    .map((event, i) => ({
      time: new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      alertness: event.alertness_score,
      index: i,
    }))

  // Group hazard detections by type
  const hazardGrouped = hazardDetections.reduce(
    (acc, det) => {
      const type = det.object_class
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const hazardChartData = Object.entries(hazardGrouped)
    .map(([type, count]) => ({
      type,
      label: hazardLabels[type] || type,
      count,
      color: hazardColors[type] || hazardColors.other,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle>Detection Activity (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="drowsiness" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="drowsiness" className="gap-2">
              <Eye className="h-4 w-4" />
              Alertness
            </TabsTrigger>
            <TabsTrigger value="hazards" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Hazards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drowsiness">
            {drowsinessData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No drowsiness events recorded</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={drowsinessData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="alertnessGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.22 265)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.55 0.22 265)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="oklch(0.5 0.01 260)" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} stroke="oklch(0.5 0.01 260)" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.13 0.02 260)",
                        border: "1px solid oklch(0.22 0.02 260)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0.01 260)",
                      }}
                      formatter={(value: number) => [`${value}%`, "Alertness"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="alertness"
                      stroke="oklch(0.55 0.22 265)"
                      strokeWidth={2}
                      fill="url(#alertnessGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hazards">
            {hazardChartData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No hazards detected</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hazardChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <XAxis type="number" stroke="oklch(0.5 0.01 260)" />
                    <YAxis
                      type="category"
                      dataKey="label"
                      stroke="oklch(0.5 0.01 260)"
                      tick={{ fill: "oklch(0.8 0.01 260)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.13 0.02 260)",
                        border: "1px solid oklch(0.22 0.02 260)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0.01 260)",
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {hazardChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
