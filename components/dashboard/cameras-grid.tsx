"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Wifi, WifiOff, Wrench, MapPin, Play, Settings } from "lucide-react"
import type { Camera as CameraType } from "@/lib/types"
import { motion } from "framer-motion"

interface CamerasGridProps {
  cameras: CameraType[]
}

const statusConfig = {
  online: {
    label: "Online",
    icon: Wifi,
    color: "bg-success/20 text-success border-success/30",
    dotColor: "bg-success",
    glowClass: "glow-success",
  },
  offline: {
    label: "Offline",
    icon: WifiOff,
    color: "bg-destructive/20 text-destructive border-destructive/30",
    dotColor: "bg-destructive",
    glowClass: "",
  },
  maintenance: {
    label: "Maintenance",
    icon: Wrench,
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    dotColor: "bg-yellow-500",
    glowClass: "glow-warning",
  },
}

export function CamerasGrid({ cameras }: CamerasGridProps) {
  if (cameras.length === 0) {
    return (
      <Card className="bg-card/50 border-border">
        <CardContent className="py-12 text-center">
          <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No cameras configured</h3>
          <p className="text-muted-foreground mb-4">Add your first camera to start monitoring</p>
          <Button>Add Camera</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cameras.map((camera, index) => {
        const config = statusConfig[camera.status]

        return (
          <motion.div
            key={camera.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              className={`bg-card/50 border-border hover:border-primary/30 transition-all group ${config.glowClass}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${config.dotColor} ${camera.status === "online" ? "animate-pulse-live" : ""}`}
                    />
                    {camera.name}
                  </CardTitle>
                  <Badge variant="outline" className={config.color}>
                    <config.icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera preview placeholder */}
                <div className="aspect-video bg-secondary/50 rounded-lg overflow-hidden relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {camera.status === "online" ? (
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                          <Play className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">Live Feed Available</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <config.icon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <span className="text-xs text-muted-foreground">{config.label}</span>
                      </div>
                    )}
                  </div>

                  {camera.status === "online" && (
                    <div className="absolute top-2 right-2">
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Camera info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{camera.location}</span>
                  </div>
                  {camera.highway && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 bg-secondary rounded">{camera.highway}</span>
                      {camera.mile_marker && <span>Mile {camera.mile_marker}</span>}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1" disabled={camera.status !== "online"}>
                    <Play className="h-4 w-4 mr-1" />
                    View Feed
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
