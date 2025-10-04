"use client"

import { useEffect, useState } from "react"

export interface AppSettings {
  // Appearance
  compactMode: boolean
  animationsEnabled: boolean

  // Location & Units
  defaultLocation: string
  unitSystem: "metric" | "imperial"
  temperatureUnit: "celsius" | "fahrenheit" | "kelvin"

  // Analysis
  analysisWindow: number
  showProgressBar: boolean

  // Data & Privacy
  saveHistory: boolean
  autoExport: boolean
  exportFormat: "json" | "csv"

  // Notifications (future)
  notifications: boolean
  analysisComplete: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  compactMode: false,
  animationsEnabled: true,
  defaultLocation: "ho-chi-minh",
  unitSystem: "metric",
  temperatureUnit: "celsius",
  analysisWindow: 7,
  showProgressBar: true,
  saveHistory: true,
  autoExport: false,
  exportFormat: "json",
  notifications: false,
  analysisComplete: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedSettings = localStorage.getItem("climalens-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch (error) {
        console.error("Failed to parse settings:", error)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem("climalens-settings", JSON.stringify(updated))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem("climalens-settings")
  }

  return {
    settings,
    updateSettings,
    resetSettings,
    mounted,
  }
}

// Helper functions to convert units
export function convertTemperature(kelvin: number, unit: "celsius" | "fahrenheit" | "kelvin"): number {
  switch (unit) {
    case "celsius":
      return kelvin - 273.15
    case "fahrenheit":
      return (kelvin - 273.15) * 9/5 + 32
    case "kelvin":
      return kelvin
  }
}

export function convertWindSpeed(ms: number, system: "metric" | "imperial"): number {
  if (system === "imperial") {
    return ms * 2.237 // m/s to mph
  }
  return ms
}

export function convertPrecipitation(mm: number, system: "metric" | "imperial"): number {
  if (system === "imperial") {
    return mm / 25.4 // mm to inches
  }
  return mm
}

export function getTemperatureUnit(unit: "celsius" | "fahrenheit" | "kelvin"): string {
  switch (unit) {
    case "celsius":
      return "°C"
    case "fahrenheit":
      return "°F"
    case "kelvin":
      return "K"
  }
}

export function getWindSpeedUnit(system: "metric" | "imperial"): string {
  return system === "metric" ? "m/s" : "mph"
}

export function getPrecipitationUnit(system: "metric" | "imperial"): string {
  return system === "metric" ? "mm" : "in"
}

