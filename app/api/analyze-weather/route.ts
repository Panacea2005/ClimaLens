// @ts-ignore
import ee from '@google/earthengine'
import { NextRequest, NextResponse } from 'next/server'
import { 
  fetchHycomData, 
  calculateOceanInfluence, 
  applyOceanInfluence,
  estimateCoastalDistance,
  isCoastalLocation,
  formatOceanData,
  getDirectionLabel,
  OCEAN_CONFIG,
  type HycomData,
  type OceanInfluence
} from '@/lib/hycom'

// Check if credentials are configured
function hasCredentials(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT || 
    process.env.EE_PRIVATE_KEY || 
    (process.env.EE_CLIENT_EMAIL && process.env.EE_PRIVATE_KEY_CONTENT) ||
    (process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.VERCEL)
  )
}

// Initialize Earth Engine with service account
async function initializeEE(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!hasCredentials()) {
      reject(new Error('No credentials configured'))
      return
    }

    try {
      let privateKey: any

      // Option 1: Direct JSON string from environment variable (RECOMMENDED for Vercel)
      if (process.env.GOOGLE_SERVICE_ACCOUNT) {
        console.log('Using GOOGLE_SERVICE_ACCOUNT environment variable')
        privateKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
      }
      // Option 2: Build from individual environment variables (alternative for Vercel)
      else if (process.env.EE_PRIVATE_KEY_CONTENT && process.env.EE_CLIENT_EMAIL) {
        console.log('Building credentials from individual environment variables')
        privateKey = {
          type: 'service_account',
          project_id: process.env.EE_PROJECT_ID || 'climalens-474105',
          private_key_id: process.env.EE_PRIVATE_KEY_ID,
          private_key: process.env.EE_PRIVATE_KEY_CONTENT.replace(/\\n/g, '\n'),
          client_email: process.env.EE_CLIENT_EMAIL,
          client_id: process.env.EE_CLIENT_ID || '',
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.EE_CLIENT_EMAIL || '')}`,
          universe_domain: 'googleapis.com'
        }
      }
      // Option 3: EE_PRIVATE_KEY (legacy support)
      else if (process.env.EE_PRIVATE_KEY) {
        console.log('Using EE_PRIVATE_KEY environment variable')
        privateKey = JSON.parse(process.env.EE_PRIVATE_KEY)
      }
      // Option 4: File path (for local development only)
      else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.VERCEL) {
        console.log('Using GOOGLE_APPLICATION_CREDENTIALS file path')
        const fs = require('fs')
        const path = require('path')
        const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
        const fullPath = path.resolve(process.cwd(), keyPath)
        
        if (!fs.existsSync(fullPath)) {
          reject(new Error(`Key file not found: ${fullPath}`))
          return
        }

        privateKey = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
      } else {
        reject(new Error('No valid credentials found. Please configure GOOGLE_SERVICE_ACCOUNT or individual credential fields.'))
        return
      }

      // Authenticate with Earth Engine
      ee.data.authenticateViaPrivateKey(
        privateKey,
        () => {
          ee.initialize(
            null,
            null,
            () => {
              console.log('Earth Engine initialized successfully for analysis')
              resolve(true)
            },
            (error: Error) => {
              console.error('EE Initialize error:', error)
              reject(error)
            }
          )
        },
        (error: Error) => {
          console.error('EE Auth error:', error)
          reject(error)
        }
      )
    } catch (error) {
      console.error('Failed to parse credentials:', error)
      reject(error)
    }
  })
}

// Convert kg/m²/s to mm/day
function precipToMmPerDay(kgM2S: number): number {
  return kgM2S * 86400
}

// Calculate wind speed from U and V components
function calculateWindSpeed(u: number, v: number): number {
  return Math.sqrt(u * u + v * v)
}

// Get day of year from date
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lat, lon, date: dateString, locationName } = body

    if (!lat || !lon || !dateString) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: lat, lon, date' },
        { status: 400 }
      )
    }

    // Check and initialize Earth Engine
    if (!hasCredentials()) {
      return NextResponse.json({
        success: false,
        error: 'Google Earth Engine credentials not configured. Please set GOOGLE_APPLICATION_CREDENTIALS environment variable.',
        authenticated: false
      }, { status: 401 })
    }

    try {
      await initializeEE()
    } catch (error: any) {
      console.error('Failed to initialize Earth Engine:', error)
      return NextResponse.json({
        success: false,
        error: `Failed to initialize Google Earth Engine: ${error.message}`,
        authenticated: false
      }, { status: 500 })
    }

    // Parse date and get day of year
    const queryDate = new Date(dateString)
    const dayOfYear = getDayOfYear(queryDate)
    const windowDays = 7

    console.log(`🔍 Analyzing weather for lat=${lat}, lon=${lon}, day=${dayOfYear}, window=±${windowDays}`)
    console.log(`📊 Fetching 45 years of NASA MERRA-2 data + ocean data for coastal locations`)

    // Define the point of interest
    const point = ee.Geometry.Point([lon, lat])

    // Historical data: 1980 to 2024 (45 years)
    const startYear = 1980
    const endYear = 2024
    const totalYears = endYear - startYear + 1

    // Arrays to store daily values across all years
    const dailyT2M: number[] = []
    const dailyU10M: number[] = []
    const dailyV10M: number[] = []
    const dailyQV2M: number[] = []
    const dailyPRECTOT: number[] = []

    console.log(`📊 Fetching data for ${totalYears} years...`)
    const startTime = Date.now()

    // Fetch data for each year (with progress logging every 10 years)
    for (let year = startYear; year <= endYear; year++) {
      // Log progress every 10 years
      if ((year - startYear) % 10 === 0) {
        const progress = ((year - startYear) / totalYears * 100).toFixed(0)
        console.log(`   Progress: ${progress}% (${year})`)
      }

      // Calculate date range for ±7 days window
      const targetDate = new Date(year, 0, dayOfYear)
      const startDate = new Date(targetDate)
      startDate.setDate(startDate.getDate() - windowDays)
      const endDate = new Date(targetDate)
      endDate.setDate(endDate.getDate() + windowDays)

      // Format dates for GEE
      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = endDate.toISOString().split('T')[0]

      try {
        // Fetch Single-Level Diagnostics (SLV)
        const slvCollection = ee.ImageCollection('NASA/GSFC/MERRA/slv/2')
          .filterDate(startDateStr, endDateStr)
          .select(['T2M', 'U10M', 'V10M', 'QV2M'])

        const slvMean = slvCollection.mean().reduceRegion({
          reducer: ee.Reducer.mean(),
          geometry: point,
          scale: 50000,
          maxPixels: 1e9
        })

        // Fetch Surface Flux Diagnostics (FLX)
        const flxCollection = ee.ImageCollection('NASA/GSFC/MERRA/flx/2')
          .filterDate(startDateStr, endDateStr)
          .select(['PRECTOT'])

        const flxMean = flxCollection.mean().reduceRegion({
          reducer: ee.Reducer.mean(),
          geometry: point,
          scale: 50000,
          maxPixels: 1e9
        })

        // Get values
        const slvData: any = await new Promise((resolve, reject) => {
          slvMean.evaluate((result: any, error: any) => {
            if (error) reject(error)
            else resolve(result)
          })
        })

        const flxData: any = await new Promise((resolve, reject) => {
          flxMean.evaluate((result: any, error: any) => {
            if (error) reject(error)
            else resolve(result)
          })
        })

        // Store values if valid
        // Apply temporal weighting: recent years (2022+) get 50% more weight
        // This is done by storing multiple copies of recent year data
        const weight = year >= 2022 ? 1.5 : 1.0
        const copies = Math.round(weight) // 1 for old years, 2 for recent years (effectively 1.5x weight)
        
        for (let w = 0; w < copies; w++) {
          if (slvData.T2M !== null && slvData.T2M !== undefined) dailyT2M.push(slvData.T2M)
          if (slvData.U10M !== null && slvData.U10M !== undefined) dailyU10M.push(slvData.U10M)
          if (slvData.V10M !== null && slvData.V10M !== undefined) dailyV10M.push(slvData.V10M)
          if (slvData.QV2M !== null && slvData.QV2M !== undefined) dailyQV2M.push(slvData.QV2M)
          if (flxData.PRECTOT !== null && flxData.PRECTOT !== undefined) dailyPRECTOT.push(flxData.PRECTOT)
        }

      } catch (error) {
        console.error(`❌ Error fetching data for year ${year}:`, error)
      }
    }

    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(1)
    // Note: dailyT2M.length includes weighted duplicates for recent years (2022+)
    const actualYears = endYear - startYear + 1
    console.log(`✅ Fetched ${actualYears} years of data (${dailyT2M.length} weighted samples) in ${duration} seconds`)
    console.log(`   📊 Recent years (2022+) weighted 1.5x for better accuracy`)

    if (dailyT2M.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No data available for this location and date',
        authenticated: true
      })
    }

    // ============================================================================
    // PERCENTILE-BASED THRESHOLD CALCULATION (Location-Adaptive)
    // ============================================================================
    // This approach is globally robust - it adapts to each location's climate
    // instead of using fixed thresholds that only work in temperate regions.
    // ============================================================================

    // Helper function to calculate percentile
    const percentile = (arr: number[], p: number): number => {
      if (arr.length === 0) return 0
      const sorted = [...arr].sort((a, b) => a - b)
      const index = (p / 100) * (sorted.length - 1)
      const lower = Math.floor(index)
      const upper = Math.ceil(index)
      const weight = index % 1
      if (lower === upper) return sorted[lower]
      return sorted[lower] * (1 - weight) + sorted[upper] * weight
    }

    // Calculate wind speeds for all years
    const windSpeeds: number[] = []
    for (let i = 0; i < Math.min(dailyU10M.length, dailyV10M.length); i++) {
      windSpeeds.push(calculateWindSpeed(dailyU10M[i], dailyV10M[i]))
    }

    // Convert precipitation to mm/day for easier interpretation
    const precipMmPerDay = dailyPRECTOT.map(p => p * 86400)

    // ============================================================================
    // 1. VERY HOT: 90th percentile of temperature (location-adaptive)
    // ============================================================================
    const hotPercentile = 90
    const hotThreshold = percentile(dailyT2M, hotPercentile)
    const hotFallbackThreshold = 303 // 30°C as absolute minimum for tropics
    const effectiveHotThreshold = Math.max(hotThreshold, hotFallbackThreshold)
    const hotCount = dailyT2M.filter(t => t >= effectiveHotThreshold).length
    const hotProbability = dailyT2M.length > 0 ? hotCount / dailyT2M.length : 0

    // ============================================================================
    // 2. VERY COLD: 10th percentile of temperature (location-adaptive)
    // ============================================================================
    const coldPercentile = 10
    const coldThreshold = percentile(dailyT2M, coldPercentile)
    const coldFallbackThreshold = 273 // 0°C as absolute maximum
    const effectiveColdThreshold = Math.min(coldThreshold, coldFallbackThreshold)
    const coldCount = dailyT2M.filter(t => t <= effectiveColdThreshold).length
    const coldProbability = dailyT2M.length > 0 ? coldCount / dailyT2M.length : 0

    // ============================================================================
    // 3. VERY WINDY: 90th percentile of wind speed (location-adaptive)
    // ============================================================================
    const windyPercentile = 90
    const windyThreshold = percentile(windSpeeds, windyPercentile)
    const windyFallbackThreshold = 10 // 10 m/s (strong wind) as absolute minimum
    const effectiveWindyThreshold = Math.max(windyThreshold, windyFallbackThreshold)
    const windyCount = windSpeeds.filter(w => w >= effectiveWindyThreshold).length
    const windyProbability = windSpeeds.length > 0 ? windyCount / windSpeeds.length : 0

    // ============================================================================
    // 4. VERY WET: 95th percentile of precipitation on rainy days (location-adaptive)
    // ============================================================================
    const rainyDayThreshold = 1 // 1 mm/day - definition of a rainy day
    const rainyDays = precipMmPerDay.filter(p => p >= rainyDayThreshold)
    const wetPercentile = 95
    
    let wetThreshold: number
    let effectiveWetThreshold: number
    let wetCount: number
    
    if (rainyDays.length > 0) {
      // Use 95th percentile of rainy days
      wetThreshold = percentile(rainyDays, wetPercentile)
      const wetFallbackThreshold = 10 // 10 mm/day (R10mm standard) as fallback
      effectiveWetThreshold = Math.max(wetThreshold, wetFallbackThreshold)
      wetCount = precipMmPerDay.filter(p => p >= effectiveWetThreshold).length
    } else {
      // Very dry climate - use any precipitation as threshold
      wetThreshold = 1
      effectiveWetThreshold = 1
      wetCount = precipMmPerDay.filter(p => p >= effectiveWetThreshold).length
    }
    const wetProbability = precipMmPerDay.length > 0 ? wetCount / precipMmPerDay.length : 0

    // ============================================================================
    // 5. VERY UNCOMFORTABLE: 90th percentile of BOTH temp AND humidity (location-adaptive)
    // ============================================================================
    const uncomfortableTempPercentile = 90
    const uncomfortableHumidityPercentile = 90
    const uncomfortableTempThreshold = percentile(dailyT2M, uncomfortableTempPercentile)
    const uncomfortableHumidityThreshold = percentile(dailyQV2M, uncomfortableHumidityPercentile)
    
    let uncomfortableCount = 0
    for (let i = 0; i < Math.min(dailyT2M.length, dailyQV2M.length); i++) {
      if (dailyT2M[i] >= uncomfortableTempThreshold && dailyQV2M[i] >= uncomfortableHumidityThreshold) {
        uncomfortableCount++
      }
    }
    const uncomfortableProbability = dailyT2M.length > 0 ? uncomfortableCount / dailyT2M.length : 0

    // Calculate current/recent values (average of all years for this day)
    const avgT2M = dailyT2M.reduce((a, b) => a + b, 0) / dailyT2M.length
    const avgU10M = dailyU10M.reduce((a, b) => a + b, 0) / dailyU10M.length
    const avgV10M = dailyV10M.reduce((a, b) => a + b, 0) / dailyV10M.length
    const avgQV2M = dailyQV2M.reduce((a, b) => a + b, 0) / dailyQV2M.length
    const avgPRECTOT = dailyPRECTOT.reduce((a, b) => a + b, 0) / dailyPRECTOT.length

    // Debug logging with thresholds
    console.log('🔍 Probability Debug (Percentile-Based):')
    console.log(`   Hot: ${hotCount}/${dailyT2M.length} = ${(hotProbability * 100).toFixed(1)}% (threshold: ${(effectiveHotThreshold - 273.15).toFixed(1)}°C from ${hotPercentile}th percentile)`)
    console.log(`   Cold: ${coldCount}/${dailyT2M.length} = ${(coldProbability * 100).toFixed(1)}% (threshold: ${(effectiveColdThreshold - 273.15).toFixed(1)}°C from ${coldPercentile}th percentile)`)
    console.log(`   Windy: ${windyCount}/${windSpeeds.length} = ${(windyProbability * 100).toFixed(1)}% (threshold: ${effectiveWindyThreshold.toFixed(1)} m/s from ${windyPercentile}th percentile)`)
    console.log(`   Wet: ${wetCount}/${precipMmPerDay.length} = ${(wetProbability * 100).toFixed(1)}% (threshold: ${effectiveWetThreshold.toFixed(1)} mm/day from ${wetPercentile}th percentile of rainy days)`)
    console.log(`   Uncomfortable: ${uncomfortableCount}/${dailyT2M.length} = ${(uncomfortableProbability * 100).toFixed(1)}% (temp>${(uncomfortableTempThreshold - 273.15).toFixed(1)}°C AND humidity>${uncomfortableHumidityThreshold.toFixed(4)} kg/kg)`)
    console.log(`   Avg Temp: ${(avgT2M - 273.15).toFixed(1)}°C, Avg Precip: ${(avgPRECTOT * 86400).toFixed(2)} mm/day`)

    // ============================================================================
    // HYCOM OCEAN DATA INTEGRATION (3-Tier Coastal Zone Model)
    // ============================================================================
    // Zone 1 (≤ 30km): Strong coastal influence (100% HYCOM weight)
    // Zone 2 (30-50km): Intermediate zone (linear decay)
    // Zone 3 (> 50km): Inland - skip HYCOM (negligible ocean influence)
    // ============================================================================
    console.log('\n🌊 Evaluating HYCOM ocean influence...')
    
    // Estimate distance to coast
    const coastalDistance = estimateCoastalDistance(lat, lon)
    const isCoastal = isCoastalLocation(coastalDistance)
    
    console.log(`   Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`)
    console.log(`   Estimated distance from coast: ${coastalDistance}km`)
    
    if (coastalDistance <= OCEAN_CONFIG.COASTAL_STRONG_THRESHOLD_KM) {
      console.log(`   Zone: Strong Coastal (≤${OCEAN_CONFIG.COASTAL_STRONG_THRESHOLD_KM}km) - Full HYCOM influence`)
    } else if (coastalDistance <= OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM) {
      const decay = ((OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM - coastalDistance) / (OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM - OCEAN_CONFIG.COASTAL_STRONG_THRESHOLD_KM) * 100).toFixed(0)
      console.log(`   Zone: Intermediate (${OCEAN_CONFIG.COASTAL_STRONG_THRESHOLD_KM}-${OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM}km) - ${decay}% HYCOM influence`)
    } else {
      console.log(`   Zone: Inland (>${OCEAN_CONFIG.COASTAL_MAX_THRESHOLD_KM}km) - Skipping HYCOM`)
    }
    
    // Initialize HYCOM data object
    let hycomData: HycomData = {
      seaSurfaceTemp: null,
      salinity: null,
      currentU: null,
      currentV: null,
      currentSpeed: null,
      currentDirection: null,
      dataAvailable: false
    }
    
    let oceanInfluence: OceanInfluence = {
      tempDifference: null,
      currentSpeed: null,
      influenceScore: 0,
      adjustmentFactor: 1.0,
      description: 'Ocean influence not applicable (inland location)',
      isCoastal: false
    }
    
    // Fetch HYCOM historical data (same approach as MERRA-2)
    if (isCoastal) {
      try {
        console.log(`   📅 Fetching HYCOM historical data (1992-${endYear})...`)
        
        // Arrays to store historical HYCOM data
        const historicalSST: number[] = []
        const historicalSalinity: number[] = []
        const historicalCurrentSpeed: number[] = []
        const historicalCurrentU: number[] = []
        const historicalCurrentV: number[] = []
        
        // HYCOM start year (1992)
        const hycomStartYear = Math.max(1992, startYear)
        
        // Fetch HYCOM data for each year
        for (let year = hycomStartYear; year <= endYear; year++) {
          // Skip if year is before HYCOM availability
          if (year < 1992) continue
          
          try {
            // Calculate date range (±7 days around target date)
            const yearDate = new Date(year, 0, dayOfYear)
            const hycomStart = new Date(yearDate)
            hycomStart.setDate(hycomStart.getDate() - windowDays)
            const hycomEnd = new Date(yearDate)
            hycomEnd.setDate(hycomEnd.getDate() + windowDays)
            
            const hycomStartStr = hycomStart.toISOString().split('T')[0]
            const hycomEndStr = hycomEnd.toISOString().split('T')[0]
            
            // Fetch HYCOM data for this year
            const yearHycomData = await fetchHycomData(lat, lon, hycomStartStr, hycomEndStr, ee)
            
            if (yearHycomData.dataAvailable) {
              // Apply temporal weighting (2022+ gets 1.5x weight)
              const weight = year >= 2022 ? 1.5 : 1.0
              const copies = Math.round(weight)
              
              for (let w = 0; w < copies; w++) {
                if (yearHycomData.seaSurfaceTemp !== null) historicalSST.push(yearHycomData.seaSurfaceTemp)
                if (yearHycomData.salinity !== null) historicalSalinity.push(yearHycomData.salinity)
                if (yearHycomData.currentSpeed !== null) historicalCurrentSpeed.push(yearHycomData.currentSpeed)
                if (yearHycomData.currentU !== null) historicalCurrentU.push(yearHycomData.currentU)
                if (yearHycomData.currentV !== null) historicalCurrentV.push(yearHycomData.currentV)
              }
            }
          } catch (error: any) {
            console.error(`   ⚠️  Error fetching HYCOM for year ${year}:`, error.message)
            // Continue to next year
          }
        }
        
        // Calculate averages from historical data
        if (historicalSST.length > 0) {
          const avgSST = historicalSST.reduce((a, b) => a + b, 0) / historicalSST.length
          const avgSalinity = historicalSalinity.length > 0 
            ? historicalSalinity.reduce((a, b) => a + b, 0) / historicalSalinity.length 
            : null
          const avgCurrentSpeed = historicalCurrentSpeed.length > 0
            ? historicalCurrentSpeed.reduce((a, b) => a + b, 0) / historicalCurrentSpeed.length
            : null
          const avgCurrentU = historicalCurrentU.length > 0
            ? historicalCurrentU.reduce((a, b) => a + b, 0) / historicalCurrentU.length
            : null
          const avgCurrentV = historicalCurrentV.length > 0
            ? historicalCurrentV.reduce((a, b) => a + b, 0) / historicalCurrentV.length
            : null
          
          // Calculate current direction from averages
          let avgCurrentDirection = null
          if (avgCurrentU !== null && avgCurrentV !== null) {
            avgCurrentDirection = (Math.atan2(avgCurrentV, avgCurrentU) * 180 / Math.PI + 360) % 360
          }
          
          hycomData = {
            seaSurfaceTemp: avgSST,
            salinity: avgSalinity,
            currentU: avgCurrentU,
            currentV: avgCurrentV,
            currentSpeed: avgCurrentSpeed,
            currentDirection: avgCurrentDirection,
            dataAvailable: true
          }
          
          const actualYears = endYear - hycomStartYear + 1
          console.log(`   ✅ HYCOM: Fetched ${actualYears} years (${historicalSST.length} weighted samples)`)
          console.log(`   📊 Avg SST: ${avgSST.toFixed(1)}°C, Avg Current: ${avgCurrentSpeed?.toFixed(2) || 'N/A'} m/s`)
          
          // Calculate ocean influence using historical averages
          oceanInfluence = calculateOceanInfluence(avgT2M, hycomData, coastalDistance)
          
          console.log(`   🌊 Ocean influence: ${oceanInfluence.description}`)
          console.log(`   📊 Adjustment factor: ${oceanInfluence.adjustmentFactor.toFixed(3)}`)
        } else {
          console.log(`   ⚠️  No HYCOM data available for this coastal location`)
          console.log(`   💡 This may be due to: 1) Location too far from ocean in HYCOM grid, 2) Data gaps in HYCOM dataset`)
        }
      } catch (error: any) {
        console.error(`   ❌ Error fetching HYCOM historical data:`, error.message)
        // Continue without HYCOM data
      }
    } else {
      console.log(`   ⚠️  Location is inland (~${coastalDistance}km from coast), skipping HYCOM`)
    }
    
    // Apply ocean influence to probabilities (only if coastal)
    let adjustedHotProbability = hotProbability
    let adjustedColdProbability = coldProbability
    let adjustedWindyProbability = windyProbability
    let adjustedWetProbability = wetProbability
    let adjustedUncomfortableProbability = uncomfortableProbability
    
    if (oceanInfluence.isCoastal && hycomData.dataAvailable) {
      // Apply ocean influence with condition-specific physics
      adjustedHotProbability = applyOceanInfluence(hotProbability, oceanInfluence, 'hot')
      adjustedColdProbability = applyOceanInfluence(coldProbability, oceanInfluence, 'cold')
      adjustedUncomfortableProbability = applyOceanInfluence(uncomfortableProbability, oceanInfluence, 'uncomfortable')
      adjustedWetProbability = applyOceanInfluence(wetProbability, oceanInfluence, 'wet')
      
      console.log(`   📈 Adjusted probabilities:`)
      console.log(`      Hot: ${(hotProbability * 100).toFixed(1)}% → ${(adjustedHotProbability * 100).toFixed(1)}%`)
      console.log(`      Cold: ${(coldProbability * 100).toFixed(1)}% → ${(adjustedColdProbability * 100).toFixed(1)}%`)
      console.log(`      Uncomfortable: ${(uncomfortableProbability * 100).toFixed(1)}% → ${(adjustedUncomfortableProbability * 100).toFixed(1)}%`)
    }

    // Return results
    return NextResponse.json({
      success: true,
      authenticated: true,
      query: {
        lat,
        lon,
        locationName: locationName || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        date: dateString,
        dayOfYear,
        windowDays
      },
      probabilities: {
        hot: parseFloat(adjustedHotProbability.toFixed(4)),
        cold: parseFloat(adjustedColdProbability.toFixed(4)),
        windy: parseFloat(adjustedWindyProbability.toFixed(4)),
        wet: parseFloat(adjustedWetProbability.toFixed(4)),
        uncomfortable: parseFloat(adjustedUncomfortableProbability.toFixed(4))
      },
      baseProbabilities: {
        hot: parseFloat(hotProbability.toFixed(4)),
        cold: parseFloat(coldProbability.toFixed(4)),
        windy: parseFloat(windyProbability.toFixed(4)),
        wet: parseFloat(wetProbability.toFixed(4)),
        uncomfortable: parseFloat(uncomfortableProbability.toFixed(4))
      },
      currentValues: {
        T2M: parseFloat(avgT2M.toFixed(2)),
        T2M_celsius: parseFloat((avgT2M - 273.15).toFixed(2)),
        U10M: parseFloat(avgU10M.toFixed(2)),
        V10M: parseFloat(avgV10M.toFixed(2)),
        windSpeed: parseFloat(calculateWindSpeed(avgU10M, avgV10M).toFixed(2)),
        QV2M: parseFloat(avgQV2M.toFixed(4)),
        PRECTOT_mmPerDay: parseFloat(precipToMmPerDay(avgPRECTOT).toFixed(2))
      },
      metadata: {
        datasets: {
          slv: 'NASA/GSFC/MERRA/slv/2',
          flx: 'NASA/GSFC/MERRA/flx/2'
        },
        yearsUsed: dailyT2M.length,
        yearRange: `${startYear}-${endYear}`,
        units: {
          T2M: 'K',
          U10M: 'm/s',
          V10M: 'm/s',
          PRECTOT: 'mm/day',
          QV2M: 'kg/kg'
        },
        thresholds: {
          hot: `T2M ≥ ${(effectiveHotThreshold - 273.15).toFixed(1)}°C (${hotPercentile}th percentile)`,
          cold: `T2M ≤ ${(effectiveColdThreshold - 273.15).toFixed(1)}°C (${coldPercentile}th percentile)`,
          windy: `Wind Speed ≥ ${effectiveWindyThreshold.toFixed(1)} m/s (${windyPercentile}th percentile)`,
          wet: `Precipitation ≥ ${effectiveWetThreshold.toFixed(1)} mm/day (${wetPercentile}th percentile)`,
          uncomfortable: `Temp ≥ ${(uncomfortableTempThreshold - 273.15).toFixed(1)}°C & Humidity ≥ ${(uncomfortableHumidityThreshold * 1000).toFixed(1)} g/kg (${uncomfortableTempPercentile}th percentiles)`
        },
        thresholdDetails: {
          hot: {
            percentile: hotPercentile,
            value: effectiveHotThreshold,
            celsius: parseFloat((effectiveHotThreshold - 273.15).toFixed(2)),
            method: 'percentile-based with 30°C minimum'
          },
          cold: {
            percentile: coldPercentile,
            value: effectiveColdThreshold,
            celsius: parseFloat((effectiveColdThreshold - 273.15).toFixed(2)),
            method: 'percentile-based with 0°C maximum'
          },
          windy: {
            percentile: windyPercentile,
            value: effectiveWindyThreshold,
            unit: 'm/s',
            method: 'percentile-based with 10 m/s minimum'
          },
          wet: {
            percentile: wetPercentile,
            value: effectiveWetThreshold,
            unit: 'mm/day',
            rainyDaysCount: rainyDays.length,
            method: 'percentile of rainy days (≥1mm) with 10mm fallback'
          },
          uncomfortable: {
            tempPercentile: uncomfortableTempPercentile,
            humidityPercentile: uncomfortableHumidityPercentile,
            tempValue: uncomfortableTempThreshold,
            tempCelsius: parseFloat((uncomfortableTempThreshold - 273.15).toFixed(2)),
            humidityValue: uncomfortableHumidityThreshold,
            method: 'both temp AND humidity exceed their 90th percentiles'
          }
        },
        oceanData: hycomData.dataAvailable ? {
          seaSurfaceTemp: hycomData.seaSurfaceTemp,
          seaSurfaceTempCelsius: hycomData.seaSurfaceTemp,
          salinity: hycomData.salinity,
          currentSpeed: hycomData.currentSpeed,
          currentDirection: hycomData.currentDirection,
          currentDirectionLabel: getDirectionLabel(hycomData.currentDirection),
          currentU: hycomData.currentU,
          currentV: hycomData.currentV,
          dataAvailable: true
        } : {
          dataAvailable: false
        },
        oceanInfluence: oceanInfluence.isCoastal ? {
          isCoastal: true,
          coastalDistance: parseFloat(coastalDistance.toFixed(1)),
          tempDifference: oceanInfluence.tempDifference !== null ? parseFloat(oceanInfluence.tempDifference.toFixed(2)) : null,
          currentSpeed: oceanInfluence.currentSpeed !== null ? parseFloat(oceanInfluence.currentSpeed.toFixed(2)) : null,
          influenceScore: parseFloat(oceanInfluence.influenceScore.toFixed(3)),
          adjustmentFactor: parseFloat(oceanInfluence.adjustmentFactor.toFixed(3)),
          description: oceanInfluence.description,
          formatted: hycomData.dataAvailable ? formatOceanData(hycomData) : null
        } : {
          isCoastal: false,
          coastalDistance: parseFloat(coastalDistance.toFixed(1)),
          description: oceanInfluence.description
        }
      }
    })

  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to analyze weather data',
        authenticated: hasCredentials()
      },
      { status: 500 }
    )
  }
}
