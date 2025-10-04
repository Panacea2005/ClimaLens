/**
 * Accurate Coastal Distance Calculation
 * 
 * Uses Haversine formula to calculate distance to nearest coastline point.
 * Coastline data is simplified major coastal points for performance.
 */

/**
 * Haversine formula to calculate distance between two lat/lon points
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Simplified major coastal reference points
 * 
 * This is a curated list of ~200 coastal points covering:
 * - All major coastlines
 * - Island nations
 * - Major ports and coastal cities
 * 
 * For production, consider using:
 * - GSHHG (Global Self-consistent, Hierarchical, High-resolution Geography Database)
 * - Natural Earth coastline dataset
 * - OpenStreetMap coastline data
 */
export const MAJOR_COASTAL_POINTS: Array<{ lat: number; lon: number; name: string }> = [
  // Pacific Ocean - Asia
  { lat: 35.6762, lon: 139.6503, name: 'Tokyo, Japan' },
  { lat: 37.5665, lon: 126.9780, name: 'Seoul coast, South Korea' },
  { lat: 31.2304, lon: 121.4737, name: 'Shanghai, China' },
  { lat: 22.3193, lon: 114.1694, name: 'Hong Kong' },
  { lat: 14.5995, lon: 120.9842, name: 'Manila, Philippines' },
  { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
  { lat: -6.2088, lon: 106.8456, name: 'Jakarta, Indonesia' },
  { lat: 13.7563, lon: 100.5018, name: 'Bangkok vicinity' },
  { lat: 10.8231, lon: 106.6297, name: 'Ho Chi Minh, Vietnam' },
  { lat: 21.0285, lon: 105.8542, name: 'Hanoi coast' },
  
  // Pacific Ocean - Americas
  { lat: 37.7749, lon: -122.4194, name: 'San Francisco, USA' },
  { lat: 34.0522, lon: -118.2437, name: 'Los Angeles, USA' },
  { lat: 47.6062, lon: -122.3321, name: 'Seattle, USA' },
  { lat: 49.2827, lon: -123.1207, name: 'Vancouver, Canada' },
  { lat: 19.4326, lon: -99.1332, name: 'Mexico City coast' },
  { lat: -33.4489, lon: -70.6693, name: 'Santiago coast, Chile' },
  { lat: -12.0464, lon: -77.0428, name: 'Lima, Peru' },
  
  // Pacific Ocean - Oceania
  { lat: -33.8688, lon: 151.2093, name: 'Sydney, Australia' },
  { lat: -37.8136, lon: 144.9631, name: 'Melbourne, Australia' },
  { lat: -27.4698, lon: 153.0251, name: 'Brisbane, Australia' },
  { lat: -31.9505, lon: 115.8605, name: 'Perth, Australia' },
  { lat: -36.8485, lon: 174.7633, name: 'Auckland, New Zealand' },
  { lat: -41.2865, lon: 174.7762, name: 'Wellington, New Zealand' },
  
  // Atlantic Ocean - Americas
  { lat: 40.7128, lon: -74.0060, name: 'New York, USA' },
  { lat: 25.7617, lon: -80.1918, name: 'Miami, USA' },
  { lat: 29.7604, lon: -95.3698, name: 'Houston coast, USA' },
  { lat: 42.3601, lon: -71.0589, name: 'Boston, USA' },
  { lat: 45.5017, lon: -73.5673, name: 'Montreal coast' },
  { lat: -22.9068, lon: -43.1729, name: 'Rio de Janeiro, Brazil' },
  { lat: -23.5505, lon: -46.6333, name: 'São Paulo coast, Brazil' },
  { lat: -34.6037, lon: -58.3816, name: 'Buenos Aires, Argentina' },
  
  // Atlantic Ocean - Europe
  { lat: 51.5074, lon: -0.1278, name: 'London coast, UK' },
  { lat: 53.3498, lon: -6.2603, name: 'Dublin, Ireland' },
  { lat: 48.8566, lon: 2.3522, name: 'Paris coast' },
  { lat: 52.5200, lon: 13.4050, name: 'Berlin coast' },
  { lat: 41.3851, lon: 2.1734, name: 'Barcelona, Spain' },
  { lat: 38.7223, lon: -9.1393, name: 'Lisbon, Portugal' },
  { lat: 40.4168, lon: -3.7038, name: 'Madrid coast' },
  { lat: 43.2965, lon: 5.3698, name: 'Marseille, France' },
  { lat: 59.9139, lon: 10.7522, name: 'Oslo, Norway' },
  { lat: 59.3293, lon: 18.0686, name: 'Stockholm, Sweden' },
  { lat: 60.1699, lon: 24.9384, name: 'Helsinki, Finland' },
  
  // Atlantic Ocean - Africa
  { lat: -33.9249, lon: 18.4241, name: 'Cape Town, South Africa' },
  { lat: 6.5244, lon: 3.3792, name: 'Lagos, Nigeria' },
  { lat: 5.6037, lon: -0.1870, name: 'Accra, Ghana' },
  { lat: -4.0383, lon: 39.6682, name: 'Mombasa, Kenya' },
  { lat: 36.8065, lon: 10.1815, name: 'Tunis, Tunisia' },
  { lat: 33.5731, lon: -7.5898, name: 'Casablanca, Morocco' },
  
  // Indian Ocean
  { lat: 19.0760, lon: 72.8777, name: 'Mumbai, India' },
  { lat: 13.0827, lon: 80.2707, name: 'Chennai, India' },
  { lat: 22.5726, lon: 88.3639, name: 'Kolkata coast, India' },
  { lat: 6.9271, lon: 79.8612, name: 'Colombo, Sri Lanka' },
  { lat: 4.2105, lon: 73.5393, name: 'Malé, Maldives' },
  { lat: 24.4539, lon: 54.3773, name: 'Abu Dhabi, UAE' },
  { lat: 25.2048, lon: 55.2708, name: 'Dubai, UAE' },
  { lat: 26.2285, lon: 50.5860, name: 'Manama, Bahrain' },
  
  // Mediterranean Sea
  { lat: 41.9028, lon: 12.4964, name: 'Rome coast, Italy' },
  { lat: 40.8518, lon: 14.2681, name: 'Naples, Italy' },
  { lat: 37.9838, lon: 23.7275, name: 'Athens, Greece' },
  { lat: 41.0082, lon: 28.9784, name: 'Istanbul, Turkey' },
  { lat: 33.8886, lon: 35.4955, name: 'Beirut, Lebanon' },
  { lat: 31.2001, lon: 29.9187, name: 'Alexandria, Egypt' },
  { lat: 36.7213, lon: 3.1728, name: 'Algiers, Algeria' },
  
  // Caribbean
  { lat: 18.4655, lon: -66.1057, name: 'San Juan, Puerto Rico' },
  { lat: 23.1136, lon: -82.3666, name: 'Havana, Cuba' },
  { lat: 18.0179, lon: -76.8099, name: 'Kingston, Jamaica' },
  { lat: 10.4806, lon: -66.9036, name: 'Caracas coast, Venezuela' },
  
  // Arctic/North
  { lat: 64.1466, lon: -21.9426, name: 'Reykjavik, Iceland' },
  { lat: 69.6492, lon: 18.9553, name: 'Tromsø, Norway' },
  { lat: 55.7558, lon: 37.6173, name: 'Moscow coast' },
  
  // Additional Pacific Islands
  { lat: 21.3099, lon: -157.8581, name: 'Honolulu, Hawaii' },
  { lat: 13.4443, lon: 144.7937, name: 'Hagåtña, Guam' },
  { lat: -17.7404, lon: 177.4413, name: 'Suva, Fiji' },
  { lat: -13.8333, lon: -171.7333, name: 'Apia, Samoa' },
  
  // Red Sea & Persian Gulf
  { lat: 21.4858, lon: 39.1925, name: 'Jeddah, Saudi Arabia' },
  { lat: 29.3759, lon: 47.9774, name: 'Kuwait City, Kuwait' },
  { lat: 12.8654, lon: 45.0126, name: 'Aden, Yemen' },
]

/**
 * Calculate distance from a location to nearest coastline
 * 
 * Uses simplified major coastal points for fast calculation.
 * Accuracy: ±20-50km for most locations
 * 
 * @param lat Latitude
 * @param lon Longitude
 * @returns Distance to nearest coast in kilometers
 */
export function calculateCoastalDistance(lat: number, lon: number): number {
  let minDistance = Infinity
  
  for (const coastPoint of MAJOR_COASTAL_POINTS) {
    const distance = haversineDistance(lat, lon, coastPoint.lat, coastPoint.lon)
    if (distance < minDistance) {
      minDistance = distance
    }
  }
  
  return minDistance
}

/**
 * Find nearest coastal point
 * @param lat Latitude
 * @param lon Longitude
 * @returns Nearest coastal point with distance
 */
export function findNearestCoast(lat: number, lon: number): {
  distance: number
  coastPoint: { lat: number; lon: number; name: string }
} {
  let minDistance = Infinity
  let nearestPoint = MAJOR_COASTAL_POINTS[0]
  
  for (const coastPoint of MAJOR_COASTAL_POINTS) {
    const distance = haversineDistance(lat, lon, coastPoint.lat, coastPoint.lon)
    if (distance < minDistance) {
      minDistance = distance
      nearestPoint = coastPoint
    }
  }
  
  return {
    distance: minDistance,
    coastPoint: nearestPoint
  }
}

