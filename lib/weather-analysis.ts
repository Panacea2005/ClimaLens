// Weather Analysis Algorithms for MERRA-2 Data
// Computes probabilities based on historical climate thresholds

interface HistoricalData {
  values: number[]
  dates: string[]
}

interface Threshold {
  hot: number
  cold: number
  wet: number
  windy: number
  uncomfortable: number
}

interface ConditionResult {
  condition: string
  variables: string[]
  threshold: string
  probability: number
  yearsUsed: number
  description: string
  unit: string
}

// Calculate percentile-based thresholds from historical data
export function calculateThresholds(historicalData: HistoricalData): Threshold {
  const sortedValues = [...historicalData.values].sort((a, b) => a - b)
  const p90 = percentile(sortedValues, 90)
  const p10 = percentile(sortedValues, 10)
  const p75 = percentile(sortedValues, 75)
  
  return {
    hot: p90,        // 90th percentile = "hot"
    cold: p10,       // 10th percentile = "cold"
    wet: p75,        // 75th percentile = "wet"
    windy: p90,      // 90th percentile = "windy"
    uncomfortable: p75  // 75th percentile = "uncomfortable"
  }
}

// Calculate percentile
function percentile(arr: number[], p: number): number {
  const index = (p / 100) * (arr.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index % 1
  
  if (lower === upper) return arr[lower]
  return arr[lower] * (1 - weight) + arr[upper] * weight
}

// Calculate probability for a condition
export function calculateProbability(
  currentValue: number,
  threshold: number,
  isAbove: boolean = true
): number {
  if (isAbove) {
    return currentValue >= threshold ? 1.0 : currentValue / threshold
  } else {
    return currentValue <= threshold ? 1.0 : threshold / currentValue
  }
}

// Heat Index calculation (feels-like temperature)
export function calculateHeatIndex(tempC: number, humidity: number): number {
  const T = tempC * 9/5 + 32 // Convert to Fahrenheit
  const RH = humidity * 100    // Convert to percentage
  
  // Rothfusz regression
  const HI = -42.379 + 2.04901523*T + 10.14333127*RH 
           - 0.22475541*T*RH - 0.00683783*T*T 
           - 0.05481717*RH*RH + 0.00122874*T*T*RH 
           + 0.00085282*T*RH*RH - 0.00000199*T*T*RH*RH
  
  // Convert back to Celsius
  return (HI - 32) * 5/9
}

// Wind Chill calculation
export function calculateWindChill(tempC: number, windSpeed: number): number {
  const T = tempC * 9/5 + 32  // Convert to Fahrenheit
  const V = windSpeed * 2.237 // Convert m/s to mph
  
  if (T > 50 || V < 3) return tempC
  
  const WC = 35.74 + 0.6215*T - 35.75*Math.pow(V, 0.16) + 0.4275*T*Math.pow(V, 0.16)
  
  // Convert back to Celsius
  return (WC - 32) * 5/9
}

// Analyze weather conditions for a given day
export async function analyzeWeatherConditions(
  lat: number,
  lon: number,
  date: Date,
  dayOfYear: number
): Promise<{
  conditions: ConditionResult[]
  summary: string
  metadata: {
    location: string
    lat: number
    lon: number
    date: string
    window: string
    yearsAnalyzed: number
  }
}> {
  // TODO: Fetch real MERRA-2 data from API
  // For now, return mock computed results based on the structure
  
  const conditions: ConditionResult[] = []
  
  // HOT condition - based on T2M (2-meter temperature)
  const hotProb = Math.random() * 0.6 + 0.2 // 0.2-0.8
  conditions.push({
    condition: 'Hot',
    variables: ['T2M', 'T2MDEW'],
    threshold: '≥ 308 K (35°C)',
    probability: hotProb,
    yearsUsed: 40,
    description: '2-meter temperature exceeds 90th percentile',
    unit: 'K'
  })
  
  // COLD condition - based on T2M
  const coldProb = Math.random() * 0.4
  conditions.push({
    condition: 'Cold',
    variables: ['T2M'],
    threshold: '≤ 285 K (12°C)',
    probability: coldProb,
    yearsUsed: 40,
    description: '2-meter temperature below 10th percentile',
    unit: 'K'
  })
  
  // WET condition - based on PRECTOT
  const wetProb = Math.random() * 0.5 + 0.1
  conditions.push({
    condition: 'Wet',
    variables: ['PRECTOT', 'PRECLSC'],
    threshold: '≥ 10 mm/day',
    probability: wetProb,
    yearsUsed: 40,
    description: 'Total precipitation exceeds 75th percentile',
    unit: 'mm/day'
  })
  
  // WINDY condition - based on wind speed
  const windyProb = Math.random() * 0.4
  conditions.push({
    condition: 'Windy',
    variables: ['U10M', 'V10M', 'SPEED'],
    threshold: '≥ 8 m/s',
    probability: windyProb,
    yearsUsed: 40,
    description: '10-meter wind speed exceeds 90th percentile',
    unit: 'm/s'
  })
  
  // UNCOMFORTABLE condition - based on heat index/wind chill
  const uncomfortableProb = Math.random() * 0.6
  conditions.push({
    condition: 'Uncomfortable',
    variables: ['T2M', 'QV2M', 'SPEED'],
    threshold: 'Heat Index ≥ 32°C or Wind Chill ≤ 5°C',
    probability: uncomfortableProb,
    yearsUsed: 40,
    description: 'Feels-like temperature outside comfort zone',
    unit: '°C'
  })
  
  // Sort by probability (highest first)
  conditions.sort((a, b) => b.probability - a.probability)
  
  // Generate plain-language summary
  const topCondition = conditions[0]
  const secondCondition = conditions[1]
  const dateStr = format(date, 'MMM d')
  
  const summary = `On ${dateStr} at this location, the highest likelihood is ${topCondition.condition} (${(topCondition.probability * 100).toFixed(0)}%), followed by ${secondCondition.condition} (${(secondCondition.probability * 100).toFixed(0)}%). ${getActionableAdvice(topCondition.condition)}`
  
  return {
    conditions,
    summary,
    metadata: {
      location: 'Selected Location',
      lat,
      lon,
      date: format(date, 'yyyy-MM-dd'),
      window: '±7 days',
      yearsAnalyzed: 40
    }
  }
}

// Get actionable advice based on condition
function getActionableAdvice(condition: string): string {
  const advice: Record<string, string> = {
    'Hot': 'Plan for heat – carry water, wear light clothing, and use sun protection.',
    'Cold': 'Dress warmly in layers and protect against wind chill.',
    'Wet': 'Bring rain gear and plan for possible flooding or delays.',
    'Windy': 'Secure loose objects and be cautious in exposed areas.',
    'Uncomfortable': 'Take precautions for extreme weather – stay hydrated or stay warm.'
  }
  return advice[condition] || 'Monitor weather conditions closely.'
}

// Format date helper
function format(date: Date, formatStr: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  
  if (formatStr === 'MMM d') return `${month} ${day}`
  if (formatStr === 'MMMM d, yyyy') return `${months[date.getMonth()]} ${day}, ${year}`
  if (formatStr === 'yyyy-MM-dd') return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return date.toISOString()
}

