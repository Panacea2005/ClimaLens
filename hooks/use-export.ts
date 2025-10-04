"use client"

import { useCallback } from "react"
// @ts-ignore - html2canvas types issue
import html2canvas from "html2canvas"

export function useExport() {
  const exportAsImage = useCallback(async (elementId: string, filename: string = "climalens-chart") => {
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error("Element not found")
      }

      // Hide scrollbars temporarily
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      const canvas = await html2canvas(element, {
        background: "#ffffff",
        logging: false,
        useCORS: true,
        // @ts-ignore - scale is not in types but supported by html2canvas
        scale: 2,
      })

      // Restore overflow
      document.body.style.overflow = originalOverflow

      // Convert to blob and download
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          throw new Error("Failed to create image")
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${filename}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })

      return true
    } catch (error) {
      console.error("Export failed:", error)
      throw error
    }
  }, [])

  const copyShareLink = useCallback((params: { lat: number; lon: number; date: string; locationName?: string }) => {
    try {
      const baseUrl = window.location.origin
      const searchParams = new URLSearchParams({
        lat: params.lat.toFixed(4),
        lon: params.lon.toFixed(4),
        date: params.date,
      })

      if (params.locationName) {
        searchParams.append("location", params.locationName)
      }

      const shareUrl = `${baseUrl}/dashboard/explore?${searchParams.toString()}`
      
      navigator.clipboard.writeText(shareUrl)
      
      return shareUrl
    } catch (error) {
      console.error("Failed to copy link:", error)
      throw error
    }
  }, [])

  return {
    exportAsImage,
    copyShareLink,
  }
}

