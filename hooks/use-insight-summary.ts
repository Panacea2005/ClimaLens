"use client"

import { useMemo } from "react"
import { Sun, Snowflake, CloudRain, Wind, ThermometerSun, Waves } from "lucide-react"

interface InsightConfig {
  icon: any
  color: string
  message: string
  severity: "high" | "moderate" | "low"
}

interface OceanData {
  seaSurfaceTemp: number | null
  salinity: number | null
  currentSpeed: number | null
  currentDirection: number | null
  currentDirectionLabel: string
  dataAvailable: boolean
}

interface OceanInfluence {
  isCoastal: boolean
  coastalDistance: number
  tempDifference: number | null
  currentSpeed: number | null
  influenceScore: number
  adjustmentFactor: number
  description: string
}

interface AnalysisData {
  probabilities: {
    hot: number
    cold: number
    windy: number
    wet: number
    uncomfortable: number
  }
  baseProbabilities?: {
    hot: number
    cold: number
    windy: number
    wet: number
    uncomfortable: number
  }
  oceanData?: OceanData
  oceanInfluence?: OceanInfluence
}

export function useInsightSummary(data: AnalysisData | null) {
  const insights = useMemo(() => {
    if (!data) return []

    const results: InsightConfig[] = []
    const { hot, cold, windy, wet, uncomfortable } = data.probabilities
    
    // Ocean influence data
    const hasOceanInfluence = data.oceanInfluence?.isCoastal && data.oceanData?.dataAvailable
    const oceanAdjustment = hasOceanInfluence ? data.oceanInfluence?.adjustmentFactor || 1.0 : 1.0
    const oceanImpact = Math.abs(oceanAdjustment - 1.0) // How much ocean changed probabilities
    const tempDiff = data.oceanInfluence?.tempDifference || 0
    const coastalDistance = data.oceanInfluence?.coastalDistance || 0
    const sst = data.oceanData?.seaSurfaceTemp
    const currentSpeed = data.oceanData?.currentSpeed

    // Very Hot Detection (≥50% probability)
    if (hot >= 0.5) {
      let message = "Extreme heat conditions detected. This location historically experiences very hot weather on this date."
      
      // Add ocean context if coastal
      if (hasOceanInfluence && oceanImpact > 0.03) {
        if (tempDiff > 2 && oceanAdjustment > 1.0) {
          message += ` Coastal location (${coastalDistance.toFixed(0)}km from ocean): Land significantly warmer than sea (+${tempDiff.toFixed(1)}°C), slightly increasing heat probability.`
        } else if (tempDiff < -2 && oceanAdjustment < 1.0) {
          message += ` Coastal location: Ocean moderates heat (sea ${Math.abs(tempDiff).toFixed(1)}°C warmer than land), reducing extreme heat risk.`
        } else if (currentSpeed && currentSpeed > 0.5) {
          message += ` Coastal winds (${currentSpeed.toFixed(1)} m/s ocean current) may provide some relief.`
        }
      }
      
      results.push({
        icon: Sun,
        color: "text-red-500",
        message,
        severity: "high",
      })
    } else if (hot >= 0.3) {
      let message = "Elevated heat levels likely. There's a notable chance of hot weather on this date."
      
      if (hasOceanInfluence && sst) {
        if (tempDiff > 3) {
          message += ` Coastal effect: Sea cooler (SST: ${sst.toFixed(1)}°C) may moderate peak temperatures.`
        } else if (tempDiff < -3) {
          message += ` Ocean heating effect: Warm sea (SST: ${sst.toFixed(1)}°C) may enhance temperatures.`
        }
      }
      
      results.push({
        icon: Sun,
        color: "text-orange-500",
        message,
        severity: "moderate",
      })
    }

    // Very Cold Detection (≥50% probability)
    if (cold >= 0.5) {
      let message = "Unusually cold conditions detected. Freezing temperatures are common on this date."
      
      if (hasOceanInfluence && oceanImpact > 0.03) {
        if (tempDiff < -2 && oceanAdjustment < 1.0) {
          message += ` Ocean warming effect: Sea warmer than land (${Math.abs(tempDiff).toFixed(1)}°C difference) reduces extreme cold probability.`
        } else if (coastalDistance < 30 && currentSpeed && currentSpeed > 0.3) {
          message += ` Coastal location with active ocean currents (${currentSpeed.toFixed(1)} m/s) may moderate cold extremes.`
        }
      }
      
      results.push({
        icon: Snowflake,
        color: "text-blue-500",
        message,
        severity: "high",
      })
    } else if (cold >= 0.3) {
      let message = "Cold weather likely. Be prepared for below-average temperatures."
      
      if (hasOceanInfluence && sst && tempDiff < -2) {
        message += ` Coastal warming: Ocean (SST: ${sst.toFixed(1)}°C) warmer than land may buffer cold.`
      }
      
      results.push({
        icon: Snowflake,
        color: "text-blue-400",
        message,
        severity: "moderate",
      })
    }

    // Very Wet Detection (≥50% probability)
    if (wet >= 0.5) {
      let message = "Heavy precipitation event likely. This date historically sees significant rainfall."
      
      if (hasOceanInfluence && oceanImpact > 0.02) {
        if (currentSpeed && currentSpeed > 0.4) {
          message += ` Coastal moisture transport: Ocean currents (${currentSpeed.toFixed(1)} m/s) may enhance precipitation.`
        } else if (coastalDistance < 50) {
          message += ` Coastal location (${coastalDistance.toFixed(0)}km) with ocean moisture influence.`
        }
      }
      
      results.push({
        icon: CloudRain,
        color: "text-cyan-500",
        message,
        severity: "high",
      })
    } else if (wet >= 0.3) {
      let message = "Increased chance of rain. Wet conditions are possible on this date."
      
      if (hasOceanInfluence && coastalDistance < 30) {
        message += ` Sea breeze may trigger convective rainfall near coast.`
      }
      
      results.push({
        icon: CloudRain,
        color: "text-cyan-400",
        message,
        severity: "moderate",
      })
    }

    // Very Windy Detection (≥50% probability)
    if (windy >= 0.5) {
      let message = "Strong wind conditions expected. Historically windy on this date."
      
      if (hasOceanInfluence && currentSpeed && currentSpeed > 0.5) {
        const direction = data.oceanData?.currentDirectionLabel || "coastal"
        message += ` Ocean currents (${currentSpeed.toFixed(1)} m/s ${direction}) indicate active atmospheric circulation.`
      }
      
      results.push({
        icon: Wind,
        color: "text-purple-500",
        message,
        severity: "high",
      })
    } else if (windy >= 0.3) {
      let message = "Moderate wind activity possible. Windier than average conditions."
      
      if (hasOceanInfluence && coastalDistance < 30) {
        message += ` Coastal location may experience sea breeze effects.`
      }
      
      results.push({
        icon: Wind,
        color: "text-purple-400",
        message,
        severity: "moderate",
      })
    }

    // Very Uncomfortable Detection (≥40% probability)
    if (uncomfortable >= 0.4) {
      let message = "Uncomfortable heat and humidity combination. High discomfort index expected."
      
      if (hasOceanInfluence) {
        if (sst && sst > 25 && tempDiff < 0) {
          message += ` Warm ocean (SST: ${sst.toFixed(1)}°C) enhances humidity and discomfort.`
        } else if (coastalDistance < 30 && currentSpeed && currentSpeed < 0.2) {
          message += ` Low ocean winds (${currentSpeed.toFixed(1)} m/s) reduce natural cooling.`
        }
      }
      
      results.push({
        icon: ThermometerSun,
        color: "text-amber-500",
        message,
        severity: "high",
      })
    } else if (uncomfortable >= 0.2) {
      let message = "Moderately uncomfortable conditions possible. Heat and humidity may be elevated."
      
      if (hasOceanInfluence && sst && sst > 20) {
        message += ` Coastal humidity from ocean (SST: ${sst.toFixed(1)}°C) may increase discomfort.`
      }
      
      results.push({
        icon: ThermometerSun,
        color: "text-amber-400",
        message,
        severity: "moderate",
      })
    }

    // Add ocean-specific insight if significant influence but no other events
    if (hasOceanInfluence && oceanImpact > 0.05 && results.length === 0) {
      results.push({
        icon: Waves,
        color: "text-blue-600",
        message: `Coastal location (${coastalDistance.toFixed(0)}km from ocean). Ocean conditions (SST: ${sst?.toFixed(1)}°C, currents: ${currentSpeed?.toFixed(1)} m/s) are influencing local climate by ${(oceanImpact * 100).toFixed(0)}%.`,
        severity: "low",
      })
    }

    // No significant events
    if (results.length === 0) {
      let message = "Moderate conditions expected. No extreme weather events detected for this date."
      
      if (hasOceanInfluence && coastalDistance < 50) {
        message += ` Coastal location benefits from ocean's moderating influence.`
      }
      
      return [
        {
          icon: Sun,
          color: "text-green-500",
          message,
          severity: "low" as const,
        },
      ]
    }

    return results
  }, [data])

  const primaryInsight = insights[0]
  const hasMultipleInsights = insights.length > 1

  return {
    insights,
    primaryInsight,
    hasMultipleInsights,
    hasInsights: insights.length > 0,
  }
}

