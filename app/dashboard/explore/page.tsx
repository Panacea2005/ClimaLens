"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

// icons
import { Calendar as CalendarIcon, Search, MapPin, Loader2, AlertCircle, LocateFixed, MapPinned, Sparkles, Info } from "lucide-react"

import { format } from "date-fns"
import { useGeolocation } from "@/hooks/use-geolocation"
import { PRESET_LOCATIONS, type PresetLocation } from "@/lib/preset-locations"
import { useToast } from "@/hooks/use-toast"
import { getDOY, isFutureDate, isLeapDay } from "@/lib/doy"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Dynamic import for Leaflet map to avoid SSR issues
const MapSelector = dynamic(() => import("@/components/dashboard/map-selector"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
})

export default function ExplorePage() {
  const router = useRouter()
  const { toast } = useToast()
  const geolocation = useGeolocation()

  // Location state (Default: Ho Chi Minh City, Vietnam)
  const [lat, setLat] = useState<number>(10.8231)
  const [lon, setLon] = useState<number>(106.6297)
  const [locationName, setLocationName] = useState<string>("Ho Chi Minh City, Vietnam")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searching, setSearching] = useState(false)

  // Suggestion state via shadcn Command inside a Popover (portals above map)
  const [openSuggestions, setOpenSuggestions] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])

  // Date state (Default to recent date within MERRA-2 range)
  const [date, setDate] = useState<Date>(() => {
    const today = new Date()
    const maxDate = new Date("2025-09-01")
    return today > maxDate ? maxDate : today
  })
  const [selectedYear, setSelectedYear] = useState<string>(date.getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState<string>((date.getMonth() + 1).toString())
  const [selectedDay, setSelectedDay] = useState<string>(date.getDate().toString())

  // Analysis state
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string>("")

  // NEW: Preset location tracking
  const [activePreset, setActivePreset] = useState<PresetLocation | null>(null)

  // Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate()
  const isDateInRange = (year: number, month: number, day: number) => {
    const testDate = new Date(year, month - 1, day)
    const minDate = new Date("1980-01-01")
    const maxDate = new Date("2100-12-31")  // NEW: Allow future dates up to 2100
    return testDate >= minDate && testDate <= maxDate
  }
  const updateDateFromSelectors = (year: string, month: string, day: string) => {
    const y = parseInt(year)
    const m = parseInt(month)
    const d = parseInt(day)
    if (isDateInRange(y, m, d)) setDate(new Date(y, m - 1, d))
  }

  // Map click
  const handleMapClick = useCallback(async (newLat: number, newLon: number, placeName?: string) => {
    setLat(newLat)
    setLon(newLon)
    if (placeName) {
      setLocationName(placeName)
      setSearchQuery(placeName.split(",")[0])
      return
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLon}`)
      const data = await response.json()
      const name = data.display_name || `${newLat.toFixed(2)}, ${newLon.toFixed(2)}`
      setLocationName(name)
      setSearchQuery(name.split(",")[0])
    } catch {
      const fallback = `${newLat.toFixed(2)}, ${newLon.toFixed(2)}`
      setLocationName(fallback)
      setSearchQuery(fallback)
    }
  }, [])

  // Debounce search to Nominatim
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onSearchInput = (value: string) => {
    setSearchQuery(value)
    if (value.trim().length < 3) {
      setSearchSuggestions([])
      setOpenSuggestions(false)
      return
    }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=8&addressdetails=1`,
          { headers: { "User-Agent": "ClimaLens/1.0" } }
        )
        if (!response.ok) throw new Error("Search failed")
        const data = await response.json()
        const filtered = data.filter((item: any) => {
          const type = item.type
          const cls = item.class
          return type === "city" || type === "town" || type === "administrative" || cls === "place" || cls === "boundary"
        })
        setSearchSuggestions(filtered.slice(0, 8))
        setOpenSuggestions(filtered.length > 0)
      } catch {
        setSearchSuggestions([])
        setOpenSuggestions(false)
      }
    }, 400)
  }

  const handleSelectSuggestion = (s: any) => {
    setLat(parseFloat(s.lat))
    setLon(parseFloat(s.lon))
    setLocationName(s.display_name)
    setSearchQuery(s.display_name.split(",")[0])
    setOpenSuggestions(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setError("")
    setOpenSuggestions(false)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        { headers: { "User-Agent": "ClimaLens/1.0" } }
      )
      if (!response.ok) throw new Error(`Search failed with status: ${response.status}`)
      const data = await response.json()
      if (data && data.length > 0) {
        const r = data[0]
        setLat(parseFloat(r.lat))
        setLon(parseFloat(r.lon))
        setLocationName(r.display_name)
      } else {
        setError("Location not found. Please try a different search.")
      }
    } catch (e: any) {
      setError(e.message || "Failed to search location. Please try again or use the map.")
    } finally {
      setSearching(false)
    }
  }

  const handleAnalysis = async () => {
    if (!locationName) return setError("Please select a location first")
    setAnalyzing(true)
    setError("")
    try {
      const start = new Date(date.getFullYear(), 0, 0)
      const dayOfYear = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const response = await fetch("/api/analyze-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon, locationName, date: format(date, "yyyy-MM-dd") }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error || "Analysis failed")
      sessionStorage.setItem(
        "analysisResults",
        JSON.stringify({
          query: data.query,
          probabilities: data.probabilities,
          currentValues: data.currentValues,
          metadata: data.metadata,
          location: locationName,
          lat,
          lon,
          date: format(date, "MMMM d, yyyy"),
          dayOfYear,
        })
      )
      router.push("/dashboard/results")
    } catch (e: any) {
      setError(e.message || "Failed to analyze weather. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  // Close suggestions on escape
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpenSuggestions(false)
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [])

  // NEW: Handle geolocation
  const handleUseMyLocation = useCallback(async () => {
    try {
      const position = await geolocation.getCurrentPosition()
      await handleMapClick(position.lat, position.lon)
      setActivePreset(null)
      
      toast({
        title: "Location detected",
        description: "Using your current location",
        duration: 3000,
      })
    } catch (error: any) {
      toast({
        title: "Location access denied",
        description: error.message || "Please search manually",
        variant: "destructive",
        duration: 5000,
      })
    }
  }, [geolocation, handleMapClick, toast])

  // NEW: Handle preset location selection
  const handlePresetLocation = useCallback(async (preset: PresetLocation) => {
    setLat(preset.lat)
    setLon(preset.lon)
    setLocationName(`${preset.name}, ${preset.country}`)
    setSearchQuery(preset.name)
    setActivePreset(preset)
    
    toast({
      title: `Sample: ${preset.name}`,
      description: preset.climate,
      duration: 4000,
    })
  }, [toast])

  return (
    <div className="h-full p-3 sm:p-4 md:p-6 bg-background overflow-y-auto">
      <div className="max-w-[1800px] mx-auto">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="uppercase tracking-wide text-xs">Explore</Badge>
            <Badge variant="outline" className="hidden sm:inline-flex text-xs">Interactive</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Climate Explorer</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Select any location and date to analyze historical climate patterns</p>
        </div>

        {/* Bento Grid Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 pb-4">
          {/* Preset Location Banner */}
          {activePreset && (
            <Alert className="lg:col-span-12 bg-primary/5 border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-sm">
                  Showing sample data for <strong>{activePreset.name}, {activePreset.country}</strong> · {activePreset.description}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePreset(null)}
                  className="h-6 px-2 shrink-0"
                >
                  Clear
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Search Bar with Actions */}
          <Card className="lg:col-span-12 relative">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full">
                {/* Action Buttons Row */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Preset Locations Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10" title="Try example locations">
                        <MapPinned className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel>Try Example Locations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {PRESET_LOCATIONS.map((preset) => (
                      <DropdownMenuItem
                        key={preset.id}
                        onClick={() => handlePresetLocation(preset)}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="font-medium">
                            {preset.name}, {preset.country}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {preset.climate}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Use My Location Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUseMyLocation}
                    disabled={geolocation.loading}
                    className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                    title="Use my location"
                  >
                    {geolocation.loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LocateFixed className="h-4 w-4" />
                    )}
                  </Button>

                  <div className="flex-1 flex gap-2 relative">
                  {/* Input + Suggestions via Popover (portaled above map) */}
                    <Popover open={openSuggestions} onOpenChange={setOpenSuggestions} modal={false}>
                      <PopoverTrigger asChild>
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            placeholder="Search location..."
                            value={searchQuery}
                            onChange={(e) => onSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            onFocus={() => searchSuggestions.length > 0 && setOpenSuggestions(true)}
                            disabled={searching}
                            className="pl-10 h-9 sm:h-10 text-sm sm:text-base"
                            aria-expanded={openSuggestions}
                            aria-controls="search-suggestions"
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        sideOffset={8}
                        className="p-0 w-[calc(100vw-2rem)] sm:w-[min(720px,90vw)] shadow-xl border-2"
                        collisionPadding={16}
                      >
                      <Command shouldFilter={false} aria-label="Location suggestions" className="rounded-lg">
                        <CommandList id="search-suggestions" className="max-h-[320px]">
                          <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                            No locations found. Try a different search term.
                          </CommandEmpty>
                          <CommandGroup heading="Locations" className="p-2">
                            {searchSuggestions.map((s: any, i: number) => (
                              <CommandItem
                                key={`${s.place_id}-${i}`}
                                value={s.display_name}
                                onSelect={() => handleSelectSuggestion(s)}
                                className="flex items-start gap-3 py-3 px-3 rounded-lg cursor-pointer"
                              >
                                <div className="p-1.5 rounded-md bg-primary/10 flex-shrink-0">
                                  <MapPin className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{s.display_name.split(",")[0]}</div>
                                  <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    {s.display_name.split(",").slice(1).join(",").trim()}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                      </PopoverContent>
                    </Popover>

                    <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()} className="h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base">
                      {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="hidden sm:inline">Search</span>}
                      {searching ? null : <Search className="h-4 w-4 sm:hidden" />}
                    </Button>
                  </div>
                </div>

                {/* Location Display - Full Width on Mobile */}
                {locationName && (
                  <div className="flex items-center gap-2 px-3 py-2 sm:py-0 bg-muted/30 sm:bg-transparent rounded-md sm:rounded-none border sm:border-0 border-border">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <div className="text-sm min-w-0 flex-1">
                      <span className="font-medium truncate block sm:inline">{locationName.split(",")[0]}</span>
                      <span className="text-muted-foreground ml-0 sm:ml-2 text-xs block sm:inline">{lat.toFixed(2)}°, {lon.toFixed(2)}°</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Map - Large Center Section (ensure it never overlays search popover) */}
          <Card className="lg:col-span-8 lg:row-span-11 overflow-hidden relative h-[400px] lg:h-auto">
            <div className="absolute inset-0 z-0">
              <MapSelector lat={lat} lon={lon} onLocationSelect={handleMapClick} />
            </div>
          </Card>

          {/* Date Picker - Right Top */}
          <Card className="lg:col-span-4 lg:row-span-5">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg sm:text-xl">Select Date</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            We use historical climatology (1980–present). Future dates show historical likelihood, not a forecast.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Choose any date (1980-2100) for historical climate analysis
                    {isLeapDay(date) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-2 text-xs text-primary cursor-help">ⓘ Leap day</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">
                              Leap-day handling: mapped to historical distribution around Feb 28/Mar 1.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex text-xs">Climatology</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Month */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Month</label>
                  <Select
                    value={selectedMonth}
                    onValueChange={(value) => {
                      setSelectedMonth(value)
                      const maxDay = getDaysInMonth(parseInt(selectedYear), parseInt(value))
                      if (parseInt(selectedDay) > maxDay) {
                        setSelectedDay(maxDay.toString())
                        updateDateFromSelectors(selectedYear, value, maxDay.toString())
                      } else {
                        updateDateFromSelectors(selectedYear, value, selectedDay)
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 sm:h-11 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                        <SelectItem key={m} value={(i+1).toString()}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Day */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Day</label>
                  <Select
                    value={selectedDay}
                    onValueChange={(value) => {
                      setSelectedDay(value)
                      updateDateFromSelectors(selectedYear, selectedMonth, value)
                    }}
                  >
                    <SelectTrigger className="h-9 sm:h-11 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {Array.from({ length: getDaysInMonth(parseInt(selectedYear), parseInt(selectedMonth)) }, (_, i) => i + 1).map((d) => (
                        <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Year */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Year</label>
                  <Select
                    value={selectedYear}
                    onValueChange={(value) => {
                      setSelectedYear(value)
                      const maxDay = getDaysInMonth(parseInt(value), parseInt(selectedMonth))
                      if (parseInt(selectedDay) > maxDay) {
                        setSelectedDay(maxDay.toString())
                        updateDateFromSelectors(value, selectedMonth, maxDay.toString())
                      } else {
                        updateDateFromSelectors(value, selectedMonth, selectedDay)
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 sm:h-11 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {/* NEW: Allow years from 1980 to 2100 */}
                      {Array.from({ length: 2100 - 1980 + 1 }, (_, i) => 2100 - i).map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Selected Date */}
              <div className="p-3 sm:p-4 bg-muted rounded-lg text-center">
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Selected Date</div>
                <div className="text-xl sm:text-2xl font-bold">{format(date, "MMMM d, yyyy")}</div>
              </div>

              {/* Date Info */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <InfoTile label="Day of Year" value={`${Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))}`} />
                <InfoTile label="Week" value={`${Math.ceil(Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)) / 7)}`} />
              </div>
            </CardContent>
          </Card>

          {/* Analysis Section - Right Bottom */}
          <Card className="lg:col-span-4 lg:row-span-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Run Analysis</CardTitle>
              <CardDescription className="text-xs">Review and start climate analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <SummaryRow label="Location" value={locationName.split(",")[0]} />
                <SummaryRow label="Date" value={format(date, "MMM d, yyyy")} />
                <SummaryRow label="Coordinates" value={`${lat.toFixed(2)}°, ${lon.toFixed(2)}°`} />
              </div>

              <Separator />

              <Button onClick={handleAnalysis} disabled={analyzing} className="w-full h-11 sm:h-12 text-sm sm:text-base">
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> Analyzing Climate...
                  </>
                ) : (
                  <>Analyze Climate</>
                )}
              </Button>

              {analyzing ? (
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Processing NASA MERRA-2 + HYCOM data</span>
                    <span className="text-muted-foreground font-mono"><AnimatedDots /></span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-progress-indeterminate" />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">Fetching 45 years weather + 32 years ocean data</p>
                </div>
              ) : (
                <p className="text-xs text-center text-muted-foreground mt-2">Analysis uses NASA MERRA-2 (weather) + HYCOM (ocean) data.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Alert - Floating */}
        {error && (
          <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-96 z-[80]">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-md">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium line-clamp-1 max-w-[160px]">{value}</span>
    </div>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-base sm:text-lg font-bold">{value}</span>
    </div>
  )
}

// Animated Dots Component
function AnimatedDots() {
  return (
    <span className="inline-flex">
      <span className="animate-bounce-dot" style={{ animationDelay: "0ms" }}>.</span>
      <span className="animate-bounce-dot" style={{ animationDelay: "200ms" }}>.</span>
      <span className="animate-bounce-dot" style={{ animationDelay: "400ms" }}>.</span>
    </span>
  )
}