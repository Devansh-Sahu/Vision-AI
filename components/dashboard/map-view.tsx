"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Wifi, WifiOff, Wrench } from "lucide-react"
import type { Camera } from "@/lib/types"

interface Hazard {
  objectClass: string
  confidence: number
  timestamp: string
  latitude?: number | null
  longitude?: number | null
}

interface MapViewProps {
  cameras: Camera[]
  hazards?: Hazard[]
}

const statusConfig = {
  online: { color: "bg-success", icon: Wifi },
  offline: { color: "bg-destructive", icon: WifiOff },
  maintenance: { color: "bg-yellow-500", icon: Wrench },
}

const defaultLat = 28.6139
const defaultLon = 77.2090

export function MapView({ cameras, hazards = [] }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current).setView([defaultLat, defaultLon], 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    mapInstanceRef.current = map
    markersRef.current = L.layerGroup().addTo(map)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return

    markersRef.current.clearLayers()

    // Cameras
    cameras.forEach((camera) => {
      const lat = camera.latitude ?? defaultLat + (Math.random() - 0.5) * 0.01
      const lon = camera.longitude ?? defaultLon + (Math.random() - 0.5) * 0.01

      const Icon = statusConfig[camera.status]?.icon || Wifi
      const color = statusConfig[camera.status]?.color || "bg-gray-500"

      const iconHtml = `<div class="w-6 h-6 ${color} rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>`

      const marker = L.marker([lat, lon], {
        icon: L.divIcon({
          html: iconHtml,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      })

      marker.bindPopup(`
        <strong>${camera.name}</strong><br/>
        ${camera.location}<br/>
        Status: <span class="capitalize">${camera.status}</span>
      `)

      markersRef.current?.addLayer(marker)
    })

    // Hazards
    hazards.forEach((hazard) => {
      const lat = hazard.latitude ?? defaultLat + (Math.random() - 0.5) * 0.01
      const lon = hazard.longitude ?? defaultLon + (Math.random() - 0.5) * 0.01

      const color = (() => {
        if (["cow", "buffalo", "deer", "elk", "bear"].includes(hazard.objectClass)) return "#dc2626"
        if (["fallen_tree", "pothole", "debris"].includes(hazard.objectClass)) return "#ea580c"
        return "#eab308"
      })()

      const circle = L.circleMarker([lat, lon], {
        radius: 8 + hazard.confidence * 12,
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.6,
      })

      circle.bindPopup(`
        <strong>${hazard.objectClass}</strong><br/>
        Confidence: ${Math.round(hazard.confidence * 100)}%<br/>
        ${new Date(hazard.timestamp).toLocaleString()}
      `)

      markersRef.current?.addLayer(circle)
    })
  }, [cameras, hazards])

  const statusCounts = cameras.reduce(
    (acc: Record<string, number>, cam: Camera) => {
      acc[cam.status] = (acc[cam.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Live Map View
          </CardTitle>
          <div className="flex gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Badge key={status} variant="outline" className={`${statusConfig[status as keyof typeof statusConfig]?.color} text-white`}>
                {status}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
          <div ref={mapRef} className="w-full h-full" />
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded p-2 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600" />
              <span>Animal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-600" />
              <span>Tree/Debris</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600" />
              <span>Other</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}