export interface PresetLocation {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  description: string
  climate: string
}

export const PRESET_LOCATIONS: PresetLocation[] = [
  {
    id: "phoenix",
    name: "Phoenix",
    country: "USA",
    lat: 33.4484,
    lon: -112.0740,
    description: "Hot desert climate",
    climate: "Very hot summers, mild winters",
  },
  {
    id: "delhi",
    name: "Delhi",
    country: "India",
    lat: 28.6139,
    lon: 77.2090,
    description: "Humid subtropical climate",
    climate: "Extreme heat, monsoon season",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    lat: 48.8566,
    lon: 2.3522,
    description: "Oceanic climate",
    climate: "Mild and moderately wet year-round",
  },
  {
    id: "hanoi",
    name: "Hanoi",
    country: "Vietnam",
    lat: 21.0285,
    lon: 105.8542,
    description: "Humid subtropical climate",
    climate: "Hot, humid summers with monsoon",
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    lat: -33.8688,
    lon: 151.2093,
    description: "Humid subtropical climate",
    climate: "Warm summers, mild winters",
  },
  {
    id: "manaus",
    name: "Manaus",
    country: "Brazil",
    lat: -3.1190,
    lon: -60.0217,
    description: "Tropical rainforest climate",
    climate: "Hot and humid year-round",
  },
]

export function getPresetLocation(id: string): PresetLocation | undefined {
  return PRESET_LOCATIONS.find((loc) => loc.id === id)
}

