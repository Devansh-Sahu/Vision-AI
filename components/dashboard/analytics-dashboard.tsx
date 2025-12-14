"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Eye, AlertTriangle, PieChart, Activity } from "lucide-react"
import type { DrowsinessEvent, HazardDetection, Alert } from "@/lib/types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts"

interface AnalyticsDashboardProps {
  drowsinessEvents: DrowsinessEvent[]
  hazardDetections: HazardDetection[]
  alerts: Alert[]
}

const COLORS = [
  "oklch(0.55 0.22 265)",
  "oklch(0.75 0.18 195)",
  "oklch(0.7 0.22 145)",
  "oklch(0.78 0.18 85)",
  "oklch(0.55 0.24 25)",
  "oklch(0.6 0.15 300)",
]

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

export function AnalyticsDashboard({ drowsinessEvents, hazardDetections, alerts }: AnalyticsDashboardProps) {
  // Hazard detections by type
  const hazardsByType = hazardDetections.reduce(
    (acc, h) => {
      acc[h.object_class] = (acc[h.object_class] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(hazardsByType)
    .map(([name, value]) => ({
      name: hazardLabels[name] || name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  // Hazards by severity
  const hazardsBySeverity = hazardDetections.reduce(
    (acc, h) => {
      acc[h.severity_level] = (acc[h.severity_level] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const severityData = ["critical", "high", "medium", "low"]
    .filter((s) => hazardsBySeverity[s])
    .map((severity) => ({
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      count: hazardsBySeverity[severity] || 0,
      fill:
        severity === "critical"
          ? "oklch(0.55 0.24 25)"
          : severity === "high"
            ? "oklch(0.78 0.18 85)"
            : severity === "medium"
              ? "oklch(0.75 0.18 195)"
              : "oklch(0.5 0.05 260)",
    }))

  // Alertness distribution
  const alertnessRanges = [
    { range: "0-30%", count: drowsinessEvents.filter((e) => e.alertness_score <= 30).length },
    {
      range: "31-50%",
      count: drowsinessEvents.filter((e) => e.alertness_score > 30 && e.alertness_score <= 50).length,
    },
    {
      range: "51-70%",
      count: drowsinessEvents.filter((e) => e.alertness_score > 50 && e.alertness_score <= 70).length,
    },
    { range: "71-100%", count: drowsinessEvents.filter((e) => e.alertness_score > 70).length },
  ]

  // Avg metrics
  const avgAlertness =
    drowsinessEvents.length > 0
      ? Math.round(drowsinessEvents.reduce((sum, e) => sum + e.alertness_score, 0) / drowsinessEvents.length)
      : 0

  const avgHazardConfidence =
    hazardDetections.length > 0
      ? Math.round((hazardDetections.reduce((sum, h) => sum + h.confidence, 0) / hazardDetections.length) * 100)
      : 0

  const alertsTriggered = drowsinessEvents.filter((e) => e.triggered_alert).length

  return (
    <div className="grid gap-6">
      {/* Summary stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drowsiness Events</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drowsinessEvents.length}</div>
            <p className="text-xs text-muted-foreground">{alertsTriggered} alerts triggered</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Alertness</CardTitle>
            <TrendingUp
              className={`h-4 w-4 ${avgAlertness > 70 ? "text-success" : avgAlertness > 50 ? "text-warning" : "text-destructive"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${avgAlertness > 70 ? "text-success" : avgAlertness > 50 ? "text-warning" : "text-destructive"}`}
            >
              {avgAlertness}%
            </div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hazards Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hazardDetections.length}</div>
            <p className="text-xs text-muted-foreground">
              {hazardDetections.filter((h) => h.severity_level === "critical").length} critical
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Detection Accuracy</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHazardConfidence}%</div>
            <p className="text-xs text-muted-foreground">Avg confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hazard types pie chart */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-warning" />
              Hazards by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No hazard data available
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.13 0.02 260)",
                        border: "1px solid oklch(0.22 0.02 260)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0.01 260)",
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hazards by severity */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-destructive" />
              Hazards by Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {severityData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No hazard data available
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData}>
                    <XAxis
                      dataKey="severity"
                      stroke="oklch(0.5 0.01 260)"
                      tick={{ fill: "oklch(0.8 0.01 260)", fontSize: 12 }}
                    />
                    <YAxis stroke="oklch(0.5 0.01 260)" tick={{ fill: "oklch(0.8 0.01 260)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.13 0.02 260)",
                        border: "1px solid oklch(0.22 0.02 260)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0.01 260)",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertness Distribution */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Alertness Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {drowsinessEvents.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No drowsiness data available
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={alertnessRanges}>
                  <defs>
                    <linearGradient id="alertnessGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.22 265)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.55 0.22 265)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="range"
                    stroke="oklch(0.5 0.01 260)"
                    tick={{ fill: "oklch(0.8 0.01 260)", fontSize: 12 }}
                  />
                  <YAxis stroke="oklch(0.5 0.01 260)" tick={{ fill: "oklch(0.8 0.01 260)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.13 0.02 260)",
                      border: "1px solid oklch(0.22 0.02 260)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0.01 260)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="oklch(0.55 0.22 265)"
                    strokeWidth={2}
                    fill="url(#alertnessGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
