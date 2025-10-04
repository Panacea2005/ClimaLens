/**
 * HYCOM Ocean Data Integration
 * 
 * Fetches and processes sea surface temperature, salinity, and current velocity
 * from HYCOM datasets to enhance climate analysis for coastal regions.
 * 
 * Datasets:
 * - HYCOM/sea_temp_salinity: Sea surface temperature and salinity
 * - HYCOM/sea_water_velocity: Ocean current velocity (u, v components)
 * 
 * Date Range: 1992-present
 * Resolution: ~9 km
 */

// @ts-ignore
import ee from '@google/earthengine'
import { calculateCoastalDistance as calculateAccurateDistance } from './coastline-distance'

/**
 * Configuration for ocean influence calculation
 * 
 * Distance-based coastal zones:
 * - ≤ 30km: Strong coastal zone (100% HYCOM influence)
 * - 30-50km: Intermediate zone (linear decay from 100% to 0%)
 * - > 50km: Inland zone (skip HYCOM, negligible ocean influence)
 */
export const OCEAN_CONFIG = {
  // Distance thresholds for coastal influence (km)
  COASTAL_STRONG_THRESHOLD_KM: 30,    // Full coastal influence
  COASTAL_MAX_THRESHOLD_KM: 50,       // Maximum distance for any HYCOM influence
  
  // HYCOM data availability
  START_DATE: '1992-10-02',
  
  // Scaling factors for HYCOM data
  TEMP_SCALE: 0.001,
  TEMP_OFFSET: 20,
  VELOCITY_SCALE: 0.001,
  
  // Influence weights
  ALPHA_COEFFICIENT: 0.15, // Max ocean influence on probabilities (±15%)
  
  // Temporal weighting (recent years get more weight)
  RECENT_YEARS_BOOST: 1.5, // 50% more weight for years 2022-2024
  RECENT_YEARS_THRESHOLD: 2022,
  
  // Thresholds for ocean influence
  MIN_CURRENT_SPEED: 0.1, // m/s - minimum current to consider
  MAX_TEMP_DIFF: 10, // °C - max land-sea temperature difference to consider
}

/**
 * HYCOM ocean data for a location
 */
export interface HycomData {
  seaSurfaceTemp: number | null // °C
  salinity: number | null // psu (Practical Salinity Unit)
  currentU: number | null // m/s (eastward)
  currentV: number | null // m/s (northward)
  currentSpeed: number | null // m/s (magnitude)
  currentDirection: number | null // degrees (0=North, 90=East)
  dataAvailable: boolean
}

/**
 * Ocean influence metrics
 */
export interface OceanInfluence {
  tempDifference: number | null // Land temp - Sea temp (°C)
  currentSpeed: number | null // m/s
  influenceScore: number // -1 to 1 (normalized)
  adjustmentFactor: number // Probability multiplier (0.85 to 1.15)
  description: string
  isCoastal: boolean
}

/**
 * Check if a location is coastal (within max threshold distance to ocean)
 * Uses 50km as hard cutoff - beyond this, ocean influence is negligible
 */
export function isCoastalLocation(distance: number): boolean {
  return distance <= OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM
}

/**
 * Calculate distance to nearest coastline using Haversine formula
 * 
 * Uses 80+ major coastal reference points for accurate calculation.
 * 
 * Distance categories:
 * - ≤ 30km: Strong coastal influence
 * - 30-50km: Intermediate zone
 * - > 50km: Inland, negligible ocean influence
 * 
 * @param lat Latitude
 * @param lon Longitude
 * @param useAccurate If true, use Haversine calculation (default: true)
 * @returns Distance to nearest coast in km
 */
export function estimateCoastalDistance(
  lat: number, 
  lon: number,
  useAccurate: boolean = true
): number {
  if (useAccurate) {
    // Use accurate Haversine calculation with coastal points
    return calculateAccurateDistance(lat, lon)
  }
  
  // Fallback to heuristic (for backwards compatibility)
  const absLat = Math.abs(lat)
  const absLon = Math.abs(lon)
  
  // Island nations (always coastal)
  if (
    (absLat > 5 && absLat < 20 && absLon > 120 && absLon < 130) || // Philippines
    (absLat < 10 && absLon > 95 && absLon < 140) ||                // Indonesia
    (absLat > 30 && absLat < 46 && absLon > 128 && absLon < 146) || // Japan
    (absLat > 50 && absLat < 60 && absLon < 10)                    // UK/Ireland
  ) {
    return 10
  }
  
  // Equatorial regions
  if (absLat < 10) return 25
  
  // Tropical/subtropical
  if (absLat < 30) {
    if (
      (lon > -110 && lon < -85 && absLat < 25) ||
      (absLon > 75 && absLon < 100 && absLat > 15) ||
      (absLon > 20 && absLon < 35 && absLat < 20)
    ) {
      return 80
    }
    return 35
  }
  
  // Temperate regions
  if (absLat < 50) {
    if (
      (lon > -105 && lon < -95 && lat > 35 && lat < 45) ||
      (absLon > 80 && absLon < 100 && absLat > 40)
    ) {
      return 100
    }
    if (
      (lon < -110 || lon > -80) && lat > 30 && lat < 50 ||
      absLon < 15 || absLon > 130
    ) {
      return 20
    }
    return 45
  }
  
  return 30
}

/**
 * Fetch HYCOM ocean data for a location and date range
 * @param lat Latitude
 * @param lon Longitude
 * @param startDate Start date (ISO string)
 * @param endDate End date (ISO string)
 * @param ee Earth Engine instance (already initialized)
 * @returns Promise<HycomData>
 */
export async function fetchHycomData(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
  ee: any
): Promise<HycomData> {
  try {
    // Create a small buffer (10km) to catch nearby ocean pixels
    // HYCOM has ~9km resolution, so buffering helps coastal locations
    const point = ee.Geometry.Point([lon, lat])
    const bufferedPoint = point.buffer(10000) // 10km radius in meters
    
    // Fetch sea temperature and salinity
    const tempSalinityCollection = ee.ImageCollection('HYCOM/sea_temp_salinity')
      .filter(ee.Filter.date(startDate, endDate))
    
    // Check if collection has images
    const tempCount = await new Promise<number>((resolve, reject) => {
      tempSalinityCollection.size().evaluate((count: number, error: any) => {
        if (error) reject(error)
        else resolve(count)
      })
    })
    
    if (tempCount === 0) {
      return {
        seaSurfaceTemp: null,
        salinity: null,
        currentU: null,
        currentV: null,
        currentSpeed: null,
        currentDirection: null,
        dataAvailable: false,
      }
    }
    
    // Select surface variables (0 meters depth)
    const meanTempSalinity = tempSalinityCollection
      .select(['water_temp_0', 'salinity_0'])
      .mean()
    
    // Scale temperature: multiply by 0.001, add 20 to get °C
    const scaledTemp = meanTempSalinity.select('water_temp_0')
      .multiply(OCEAN_CONFIG.TEMP_SCALE)
      .add(OCEAN_CONFIG.TEMP_OFFSET)
    
    // Scale salinity: multiply by 0.001, add 20 (per HYCOM docs)
    const scaledSalinity = meanTempSalinity.select('salinity_0')
      .multiply(OCEAN_CONFIG.TEMP_SCALE)
      .add(OCEAN_CONFIG.TEMP_OFFSET)
    
    // Combine scaled bands
    const scaledImage = ee.Image.cat([scaledTemp, scaledSalinity])
      .rename(['water_temp_0', 'salinity_0'])
    
    // Reduce region to get values (use buffered area for coastal locations)
    // This helps catch nearby ocean pixels when point is on land/coast boundary
    const tempSalinityValues = await new Promise<any>((resolve, reject) => {
      scaledImage.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: bufferedPoint, // Use buffered area instead of point
        scale: 9000, // ~9 km resolution
        maxPixels: 1e9,
        bestEffort: true, // Allow GEE to adjust for performance
      }).evaluate((result: any, error: any) => {
        if (error) reject(error)
        else resolve(result)
      })
    })
    
    // Fetch velocity data
    // Note: Velocity dataset has different temporal resolution
    // Use first available image in date range
    const velocityCollection = ee.ImageCollection('HYCOM/sea_water_velocity')
      .filter(ee.Filter.date(startDate, endDate))
    
    const velocityCount = await new Promise<number>((resolve, reject) => {
      velocityCollection.size().evaluate((count: number, error: any) => {
        if (error) reject(error)
        else resolve(count)
      })
    })
    
    let velocityValues: any = { velocity_u_0: null, velocity_v_0: null }
    
    if (velocityCount > 0) {
      const meanVelocity = velocityCollection
        .select(['velocity_u_0', 'velocity_v_0'])
        .mean()
        .multiply(OCEAN_CONFIG.VELOCITY_SCALE) // Scale to m/s
      
      velocityValues = await new Promise<any>((resolve, reject) => {
        meanVelocity.reduceRegion({
          reducer: ee.Reducer.mean(),
          geometry: bufferedPoint, // Use buffered area
          scale: 9000,
          maxPixels: 1e9,
          bestEffort: true,
        }).evaluate((result: any, error: any) => {
          if (error) reject(error)
          else resolve(result)
        })
      })
    }
    
    // Extract values
    const sst = tempSalinityValues.water_temp_0
    const salinity = tempSalinityValues.salinity_0
    const u = velocityValues.velocity_u_0
    const v = velocityValues.velocity_v_0
    
    // Calculate current speed and direction
    let currentSpeed = null
    let currentDirection = null
    
    if (u !== null && v !== null && !isNaN(u) && !isNaN(v)) {
      currentSpeed = Math.sqrt(u * u + v * v)
      // Direction in degrees (0 = North, 90 = East)
      currentDirection = (Math.atan2(u, v) * 180 / Math.PI + 360) % 360
    }
    
    const dataAvailable = sst !== null && salinity !== null
    
    return {
      seaSurfaceTemp: sst,
      salinity: salinity,
      currentU: u,
      currentV: v,
      currentSpeed: currentSpeed,
      currentDirection: currentDirection,
      dataAvailable: dataAvailable,
    }
    
  } catch (error) {
    console.error('Error fetching HYCOM data:', error)
    return {
      seaSurfaceTemp: null,
      salinity: null,
      currentU: null,
      currentV: null,
      currentSpeed: null,
      currentDirection: null,
      dataAvailable: false,
    }
  }
}

/**
 * Calculate ocean influence on climate probabilities with 3-tier distance model
 * 
 * Distance zones:
 * - ≤ 30km: Strong coastal zone (100% influence)
 * - 30-50km: Intermediate zone (linear decay 100% → 0%)
 * - > 50km: Inland zone (no HYCOM influence)
 * 
 * @param landTemp Land surface temperature from MERRA-2 (K)
 * @param hycomData HYCOM ocean data
 * @param coastalDistance Distance to coast (km)
 * @returns OceanInfluence
 */
export function calculateOceanInfluence(
  landTemp: number | null,
  hycomData: HycomData,
  coastalDistance: number
): OceanInfluence {
  // Check if location is within HYCOM influence range
  const isCoastal = isCoastalLocation(coastalDistance) && hycomData.dataAvailable
  
  if (!isCoastal || !hycomData.dataAvailable || landTemp === null || hycomData.seaSurfaceTemp === null) {
    return {
      tempDifference: null,
      currentSpeed: null,
      influenceScore: 0,
      adjustmentFactor: 1.0,
      description: coastalDistance > OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM 
        ? `Inland location (${coastalDistance.toFixed(0)}km from coast, beyond ${OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM}km threshold). Ocean influence negligible.`
        : 'Ocean influence not applicable (data unavailable)',
      isCoastal: false,
    }
  }
  
  // Convert land temp from Kelvin to Celsius
  const landTempC = landTemp - 273.15
  
  // Calculate temperature difference (Land - Sea)
  const tempDiff = landTempC - hycomData.seaSurfaceTemp!
  
  // Normalize temperature difference (-1 to 1)
  // Positive = land warmer than sea (cooling effect)
  // Negative = sea warmer than land (warming effect)
  const normalizedTempDiff = Math.max(-1, Math.min(1, 
    tempDiff / OCEAN_CONFIG.MAX_TEMP_DIFF
  ))
  
  // Normalize current speed (0 to 1)
  const normalizedCurrent = hycomData.currentSpeed 
    ? Math.min(1, hycomData.currentSpeed / 1.0) // 1 m/s as reference
    : 0
  
  // Calculate combined influence score
  // Temp difference: 60% weight (dominant factor)
  // Current speed: 40% weight (transport factor)
  const baseInfluenceScore = (
    0.6 * normalizedTempDiff + 
    0.4 * normalizedCurrent * (tempDiff < 0 ? -1 : 1)
  )
  
  // Apply 3-tier distance decay model
  let distanceDecay: number
  let zoneLabel: string
  
  if (coastalDistance <= OCEAN_CONFIG.COASTAL_STRONG_THRESHOLD_KM) {
    // ≤ 30km: Strong coastal zone - full influence
    distanceDecay = 1.0
    zoneLabel = 'strong coastal zone'
  } else if (coastalDistance <= OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM) {
    // 30-50km: Intermediate zone - linear decay from 100% to 0%
    const transitionRange = OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM - OCEAN_CONFIG.COASTAL_STRONG_THRESHOLD_KM
    const distanceInRange = coastalDistance - OCEAN_CONFIG.COASTAL_STRONG_THRESHOLD_KM
    distanceDecay = 1.0 - (distanceInRange / transitionRange)
    zoneLabel = 'intermediate zone'
  } else {
    // > 50km: Should not reach here due to isCoastal check, but safe fallback
    distanceDecay = 0
    zoneLabel = 'inland'
  }
  
  const influenceScore = baseInfluenceScore * distanceDecay
  
  // Convert influence score to adjustment factor
  // Score of -1 → 0.85 (reduce probability by 15%)
  // Score of 0 → 1.0 (no change)
  // Score of +1 → 1.15 (increase probability by 15%)
  const adjustmentFactor = 1.0 + (influenceScore * OCEAN_CONFIG.ALPHA_COEFFICIENT)
  
  // Generate description with 3-tier zone context
  let description = ''
  const distanceNote = `${coastalDistance.toFixed(0)}km from coast (${zoneLabel})`
  
  if (Math.abs(influenceScore) < 0.05) {
    description = `Minimal ocean influence at ${distanceNote}. Decay factor: ${(distanceDecay * 100).toFixed(0)}%.`
  } else if (influenceScore > 0) {
    const percent = Math.round(Math.abs(adjustmentFactor - 1.0) * 100)
    if (tempDiff > 2) {
      description = `Land warmer than sea (+${tempDiff.toFixed(1)}°C) at ${distanceNote}. Ocean moderates extreme heat. +${percent}% adjustment (${(distanceDecay * 100).toFixed(0)}% influence).`
    } else {
      description = `Onshore currents (${hycomData.currentSpeed?.toFixed(2)} m/s) at ${distanceNote}. +${percent}% adjustment.`
    }
  } else {
    const percent = Math.round(Math.abs(adjustmentFactor - 1.0) * 100)
    if (tempDiff < -2) {
      description = `Sea warmer than land (${Math.abs(tempDiff).toFixed(1)}°C) at ${distanceNote}. Ocean enhances warming. ${percent}% adjustment (${(distanceDecay * 100).toFixed(0)}% influence).`
    } else {
      description = `Offshore currents at ${distanceNote}. ${percent}% adjustment.`
    }
  }
  
  return {
    tempDifference: tempDiff,
    currentSpeed: hycomData.currentSpeed,
    influenceScore: influenceScore,
    adjustmentFactor: adjustmentFactor,
    description: description,
    isCoastal: true,
  }
}

/**
 * Apply ocean influence to climate probabilities (condition-specific)
 * 
 * Physical logic:
 * - Sea warmer than land (tempDiff < 0): 
 *   → Increases HOT, UNCOMFORTABLE
 *   → Decreases COLD
 * - Sea cooler than land (tempDiff > 0):
 *   → Decreases HOT, UNCOMFORTABLE  
 *   → Increases COLD
 * - WET: Always positive correlation with ocean (moisture source)
 * 
 * @param baseProbability Base probability from MERRA-2 analysis (0-1)
 * @param oceanInfluence Ocean influence data
 * @param condition Which condition ('hot', 'cold', 'wet', 'uncomfortable')
 * @returns Adjusted probability (0-1), clamped
 */
export function applyOceanInfluence(
  baseProbability: number,
  oceanInfluence: OceanInfluence,
  condition: 'hot' | 'cold' | 'wet' | 'uncomfortable' = 'hot'
): number {
  if (!oceanInfluence.isCoastal) {
    return baseProbability
  }
  
  const tempDiff = oceanInfluence.tempDifference || 0
  const adjustmentFactor = oceanInfluence.adjustmentFactor
  
  let conditionFactor = adjustmentFactor
  
  // Condition-specific logic based on physics
  if (condition === 'hot' || condition === 'uncomfortable') {
    // Sea warmer (tempDiff < 0) → increase hot/uncomfortable
    // Sea cooler (tempDiff > 0) → decrease hot/uncomfortable
    // adjustmentFactor already correct for these
    conditionFactor = adjustmentFactor
  } else if (condition === 'cold') {
    // Sea warmer (tempDiff < 0) → decrease cold (inverse)
    // Sea cooler (tempDiff > 0) → increase cold (inverse)
    // Need to invert the adjustment
    if (tempDiff < 0) {
      // Sea warmer: should DECREASE cold
      // If adjustmentFactor < 1.0, we want it to stay < 1.0
      conditionFactor = 2.0 - adjustmentFactor // Invert around 1.0
    } else {
      // Sea cooler: should INCREASE cold  
      // If adjustmentFactor > 1.0, we want it to stay > 1.0
      conditionFactor = 2.0 - adjustmentFactor // Invert around 1.0
    }
  } else if (condition === 'wet') {
    // Wet always gets positive influence from ocean (moisture source)
    // Use absolute value of adjustment
    const oceanMoistureBoost = Math.abs(adjustmentFactor - 1.0) * 0.5 // 50% weight
    conditionFactor = 1.0 + oceanMoistureBoost
  }
  
  const adjusted = baseProbability * conditionFactor
  
  // Clamp to [0, 1]
  return Math.max(0, Math.min(1, adjusted))
}

/**
 * Format ocean data for display
 */
export function formatOceanData(hycomData: HycomData): {
  sst: string
  salinity: string
  currentSpeed: string
  currentDirection: string
} {
  return {
    sst: hycomData.seaSurfaceTemp !== null 
      ? `${hycomData.seaSurfaceTemp.toFixed(1)}°C` 
      : 'N/A',
    salinity: hycomData.salinity !== null 
      ? `${hycomData.salinity.toFixed(1)} psu` 
      : 'N/A',
    currentSpeed: hycomData.currentSpeed !== null 
      ? `${hycomData.currentSpeed.toFixed(2)} m/s` 
      : 'N/A',
    currentDirection: hycomData.currentDirection !== null 
      ? `${Math.round(hycomData.currentDirection)}°` 
      : 'N/A',
  }
}

/**
 * Get direction label from degrees
 */
export function getDirectionLabel(degrees: number | null): string {
  if (degrees === null) return 'N/A'
  
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return dirs[index]
}

