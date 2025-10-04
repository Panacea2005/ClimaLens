"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface MapSelectorProps {
  lat: number
  lon: number
  onLocationSelect: (lat: number, lon: number, placeName?: string) => void
  placeName?: string
}

export default function MapSelector({ lat, lon, onLocationSelect }: MapSelectorProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize map only once
    if (!mapRef.current) {
      // Add a small delay to ensure container is fully mounted
      const timer = setTimeout(() => {
        if (!containerRef.current || mapRef.current) return

        try {
          mapRef.current = L.map(containerRef.current, {
            center: [lat, lon],
            zoom: 10,
            zoomControl: true,
            preferCanvas: true, // Better performance
          })

          // Add tile layer with a modern style
          L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 20,
          }).addTo(mapRef.current)

          // Add click handler
          mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
          })

          // Create initial marker
          markerRef.current = L.marker([lat, lon], {
            draggable: true,
          }).addTo(mapRef.current)

          // Add drag event
          markerRef.current.on("dragend", () => {
            if (markerRef.current) {
              const pos = markerRef.current.getLatLng()
              onLocationSelect(pos.lat, pos.lng)
            }
          })

          // Force a size update after initialization
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.invalidateSize()
            }
          }, 100)
        } catch (error) {
          console.error("Error initializing map:", error)
        }
      }, 100)

      return () => clearTimeout(timer)
    } else {
      // Update marker position when lat/lon changes
      if (markerRef.current && mapRef.current) {
        try {
          markerRef.current.setLatLng([lat, lon])
          
          // Center map on marker with error handling
          mapRef.current.setView([lat, lon], mapRef.current.getZoom(), {
            animate: true,
            duration: 0.5
          })
        } catch (error) {
          console.error("Error updating map:", error)
        }
      }
    }
  }, [lat, lon, onLocationSelect])

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.off()
        mapRef.current.remove()
        mapRef.current = null
      }
      if (markerRef.current) {
        markerRef.current.off()
        markerRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px]"
      style={{ background: "#f8f9fa" }}
    />
  )
}

