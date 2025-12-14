"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, ArrowRight, Wifi, WifiOff, Wrench } from "lucide-react"
import Link from "next/link"
import type { Camera as CameraType } from "@/lib/types"

interface CameraStatusProps {
  cameras: CameraType[]
}

const statusConfig = {
  online: {
    label: "Online",
    icon: Wifi,
    color: "bg-success/20 text-success border-success/30",
    dotColor: "bg-success",
  },
  offline: {
    label: "Offline",
    icon: WifiOff,
    color: "bg-destructive/20 text-destructive border-destructive/30",
    dotColor: "bg-destructive",
  },
  maintenance: {
    label: "Maintenance",
    icon: Wrench,
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    dotColor: "bg-yellow-500",
  },
}

export function CameraStatus({ cameras }: CameraStatusProps) {
  const sortedCameras = [...cameras].sort((a, b) => {
    const order = { online: 0, maintenance: 1, offline: 2 }
    return order[a.status] - order[b.status]
  })

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Camera Status
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/cameras">
            Manage
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {cameras.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No cameras configured</p>
            <Button variant="outline" size="sm" className="mt-4 bg-transparent" asChild>
              <Link href="/dashboard/cameras">Add Camera</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedCameras.slice(0, 6).map((camera) => {
              const config = statusConfig[camera.status]
              return (
                <div
                  key={camera.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <div className={`h-2 w-2 rounded-full ${config.dotColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{camera.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{camera.location}</p>
                  </div>
                  <Badge variant="outline" className={config.color}>
                    <config.icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
              )
            })}
            {cameras.length > 6 && (
              <p className="text-xs text-muted-foreground text-center pt-2">+{cameras.length - 6} more cameras</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
