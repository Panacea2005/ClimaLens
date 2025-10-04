"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// icons
import {
  ArrowLeft,
  Download,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  Database,
  TrendingUp,
  Sun,
  Snowflake,
  Wind,
  CloudRain,
  ThermometerSun,
  Info,
  X,
  Waves,
  Droplets,
  Navigation,
  Thermometer,
} from "lucide-react"

// NEW: Custom components
import { InsightSummary } from "@/components/insight-summary"
import { ExportButton } from "@/components/export-button"
import { isFutureDate } from "@/lib/doy"

// charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Label,
} from "recharts"

interface ConditionData {
  condition: string
  probability: number
  threshold: string
  description: string
  icon: any
  color: string
}

interface AnalysisResult {
  conditions: ConditionData[]
  summary: string
  metadata: {
    location: string
    lat: number
    lon: number
    date: string
    window: string
    yearsAnalyzed: number
  }
  currentValues: {
    T2M_celsius: number
    windSpeed: number
    PRECTOT_mmPerDay: number
    QV2M: number
  }
  rawData: any
  oceanData?: {
    dataAvailable: boolean
    seaSurfaceTemp?: number
    salinity?: number
    currentSpeed?: number
    currentDirection?: number
    currentDirectionLabel?: string
  }
  oceanInfluence?: {
    isCoastal: boolean
    coastalDistance?: number
    tempDifference?: number | null
    currentSpeed?: number | null
    adjustmentFactor?: number
    description?: string
    formatted?: {
      sst: string
      salinity: string
      currentSpeed: string
      currentDirection: string
    }
  }
  baseProbabilities?: {
    hot: number
    cold: number
    windy: number
    wet: number
    uncomfortable: number
  }
}

const conditionIcons: Record<string, any> = {
  "Very Hot": Sun,
  "Very Cold": Snowflake,
  "Very Windy": Wind,
  "Very Wet": CloudRain,
  "Very Uncomfortable": ThermometerSun,
}

const conditionColors: Record<string, string> = {
  "Very Hot": "#ef4444", // red
  "Very Cold": "#3b82f6", // blue
  "Very Windy": "#8b5cf6", // purple
  "Very Wet": "#06b6d4", // cyan
  "Very Uncomfortable": "#f59e0b", // amber
}

export default function ResultsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [showFutureDisclaimer, setShowFutureDisclaimer] = useState(false)

  useEffect(() => {
    const loadResults = async () => {
      try {
        const stored = sessionStorage.getItem("analysisResults")
        if (!stored) {
          setError("No analysis data found. Please run an analysis first.")
          setLoading(false)
          return
        }

        const data = JSON.parse(stored)

        const conditions: ConditionData[] = [
          {
            condition: "Very Hot",
            probability: data.probabilities.hot,
            threshold: data.metadata.thresholds.hot,
            description: "Extreme high temperatures",
            icon: conditionIcons["Very Hot"],
            color: conditionColors["Very Hot"],
          },
          {
            condition: "Very Cold",
            probability: data.probabilities.cold,
            threshold: data.metadata.thresholds.cold,
            description: "Extreme low temperatures",
            icon: conditionIcons["Very Cold"],
            color: conditionColors["Very Cold"],
          },
          {
            condition: "Very Windy",
            probability: data.probabilities.windy,
            threshold: data.metadata.thresholds.windy,
            description: "Strong wind conditions",
            icon: conditionIcons["Very Windy"],
            color: conditionColors["Very Windy"],
          },
          {
            condition: "Very Wet",
            probability: data.probabilities.wet,
            threshold: data.metadata.thresholds.wet,
            description: "Heavy precipitation",
            icon: conditionIcons["Very Wet"],
            color: conditionColors["Very Wet"],
          },
          {
            condition: "Very Uncomfortable",
            probability: data.probabilities.uncomfortable,
            threshold: data.metadata.thresholds.uncomfortable,
            description: "Hot and humid conditions",
            icon: conditionIcons["Very Uncomfortable"],
            color: conditionColors["Very Uncomfortable"],
          },
        ]

        const sortedConditions = [...conditions].sort((a, b) => b.probability - a.probability)

        const topCondition = sortedConditions[0]
        const hasSignificantProbability = topCondition.probability > 0.1

        let summary = ""
        if (hasSignificantProbability) {
          const secondCondition = sortedConditions[1]
          summary = `Based on 45 years of historical data around ${new Date(
            data.query.date
          ).toLocaleDateString("en-US", { month: "long", day: "numeric" })} at ${
            data.query.locationName.split(",")[0]
          }, the highest likelihood is ${topCondition.condition} (${(topCondition.probability * 100).toFixed(
            0
          )}%), followed by ${secondCondition.condition} (${(secondCondition.probability * 100).toFixed(
            0
          )}%). ${getAdvice(topCondition.condition, topCondition.probability)}`
        } else {
          summary = `Based on 45 years of historical data, extreme weather conditions are relatively rare around ${new Date(
            data.query.date
          ).toLocaleDateString("en-US", { month: "long", day: "numeric" })} at this location. All conditions show low probabilities, suggesting generally moderate weather patterns.`
        }

        const analysisResults: AnalysisResult = {
          conditions: sortedConditions,
          summary,
          metadata: {
            location: data.query.locationName,
            lat: data.query.lat,
            lon: data.query.lon,
            date: data.query.date,
            window: `±${data.query.windowDays} days`,
            yearsAnalyzed: data.metadata.yearsUsed,
          },
          currentValues: data.currentValues,
          rawData: data,
          oceanData: data.metadata?.oceanData,
          oceanInfluence: data.metadata?.oceanInfluence,
          baseProbabilities: data.baseProbabilities,
        }

        setResults(analysisResults)
        
        // NEW: Check if the analyzed date is in the future
        const analyzedDate = new Date(data.query.date)
        setShowFutureDisclaimer(isFutureDate(analyzedDate))
        
        setLoading(false)
      } catch (err) {
        console.error("Error loading results:", err)
        setError("Failed to load analysis results. Please try again.")
        setLoading(false)
      }
    }
    loadResults()
  }, [])

  const getAdvice = (condition: string, probability: number): string => {
    if (probability < 0.1) return ""

    const advice: Record<string, string> = {
      "Very Hot": "Stay hydrated, use sun protection, and avoid prolonged outdoor exposure during peak hours.",
      "Very Cold": "Dress in warm layers, protect extremities, and be cautious of icy conditions.",
      "Very Wet": "Prepare for heavy rainfall, potential flooding, and travel delays.",
      "Very Windy": "Secure loose objects, be cautious in exposed areas, and monitor weather updates.",
      "Very Uncomfortable": "Limit outdoor activities, stay in air-conditioned spaces, and stay hydrated.",
    }
    return advice[condition] || ""
  }

  const handleExportCSV = () => {
    if (!results) return

    const csvContent = [
      ["Condition", "Probability", "Threshold", "Description"],
      ...results.conditions.map((c) => [c.condition, (c.probability * 100).toFixed(2) + "%", c.threshold, c.description]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `climalens-analysis-${results.metadata.date}.csv`
    a.click()
  }

  const handleExportJSON = () => {
    if (!results) return

    const blob = new Blob([JSON.stringify(results.rawData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `climalens-analysis-${results.metadata.date}.json`
    a.click()
  }

  const barChartData = useMemo(
    () =>
      results?.conditions.map((c) => ({
        condition: c.condition.replace("Very ", ""),
        probability: parseFloat((c.probability * 100).toFixed(1)),
        fill: c.color,
      })) ?? [],
    [results]
  )

  const pieChartData = useMemo(
    () =>
      results?.conditions
        .filter((c) => c.probability > 0)
        .map((c) => ({
          name: c.condition.replace("Very ", ""),
          value: parseFloat((c.probability * 100).toFixed(1)),
          fill: c.color,
        })) ?? [],
    [results]
  )

  const hasPieData = pieChartData.length > 0 && pieChartData.some((d) => d.value > 0)

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading analysis results...</p>
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="h-full flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              No Results Found
            </CardTitle>
            <CardDescription>{error || "No analysis data available"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/explore")} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Explore
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="uppercase tracking-wide">Results</Badge>
              <Badge variant="outline" className="hidden sm:inline-flex">Analysis</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Climate Analysis Results</h1>
            <p className="text-muted-foreground mt-1">Historical probability analysis based on NASA MERRA-2 data</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton
              chartElementId="analysis-charts"
              shareData={{
                lat: results.metadata.lat,
                lon: results.metadata.lon,
                date: results.metadata.date,
                locationName: results.metadata.location,
              }}
            />
            <Link href="/dashboard/explore">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
              </Button>
            </Link>
          </div>
        </div>

        {/* Query Summary */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Query Summary</CardTitle>
              <CardDescription>What and where this analysis covers</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{results.metadata.yearsAnalyzed} yrs</Badge>
              <Badge variant="outline">MERRA-2</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryItem icon={MapPin} label="Location">
                <div className="text-sm text-muted-foreground">{results.metadata.location}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {results.metadata.lat.toFixed(4)}°, {results.metadata.lon.toFixed(4)}°
                </div>
              </SummaryItem>
              <SummaryItem icon={Calendar} label="Date & Window">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  {new Date(results.metadata.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {showFutureDisclaimer && (
                    <Badge variant="secondary" className="text-xs">Historical</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{results.metadata.window} window</div>
              </SummaryItem>
              <SummaryItem icon={Database} label="Historical Data">
                <div className="text-sm text-muted-foreground">{results.metadata.yearsAnalyzed} years analyzed</div>
                <div className="text-xs text-muted-foreground mt-1">1980–2025 (MERRA-2)</div>
              </SummaryItem>
            </div>
          </CardContent>
        </Card>

        {/* NEW: Future Date Disclaimer */}
        {showFutureDisclaimer && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <AlertTitle className="text-blue-900 dark:text-blue-100 mb-1">
                  Historical likelihood only — not a forecast
                </AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  These results reflect historical patterns for this date-of-year across 1980–present.{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="underline hover:no-underline font-medium">
                        Learn more
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Historical Climatology vs Weather Forecast</DialogTitle>
                        <DialogDescription className="space-y-3 pt-4 text-left">
                          <p>
                            ClimaLens uses long-term historical data to estimate the <strong>likelihood</strong> of certain conditions on a given date-of-year. It does <strong>not</strong> predict future weather.
                          </p>
                          <p>
                            <strong>What you're seeing:</strong> Based on 45 years of NASA satellite data (1980-present), how often has this location experienced extreme conditions around this date historically?
                          </p>
                          <p>
                            <strong>What this is NOT:</strong> A weather forecast for the specific future date. Weather forecasts are only reliable up to ~10 days ahead.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Consider combining this climatological view with short-range weather forecasts if you need day-specific guidance for planning.
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setShowFutureDisclaimer(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        )}

        {/* NEW: Ocean Influence Card (Coastal Regions) */}
        {results.oceanInfluence?.isCoastal && results.oceanData?.dataAvailable && (
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5 text-blue-500" />
                    Ocean Influence (Coastal Region)
                  </CardTitle>
                  <CardDescription>
                    Sea conditions affecting local climate · {results.oceanInfluence.coastalDistance?.toFixed(0)} km from coast
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                  Coastal Analysis
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ocean Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Sea Surface Temperature */}
                <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                  <Thermometer className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <label className="text-xs text-muted-foreground mb-1">Sea Temp</label>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.oceanData.seaSurfaceTemp?.toFixed(1)}°C
                  </p>
                </div>

                {/* Temperature Difference */}
                <div className={`flex flex-col items-center p-4 rounded-lg border ${
                  (results.oceanInfluence.tempDifference || 0) > 0 
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' 
                    : 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900'
                }`}>
                  <TrendingUp className={`h-5 w-5 mb-2 ${
                    (results.oceanInfluence.tempDifference || 0) > 0 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-cyan-600 dark:text-cyan-400'
                  }`} />
                  <label className="text-xs text-muted-foreground mb-1">Land - Sea ΔT</label>
                  <p className={`text-2xl font-bold ${
                    (results.oceanInfluence.tempDifference || 0) > 0 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-cyan-600 dark:text-cyan-400'
                  }`}>
                    {(results.oceanInfluence.tempDifference || 0) > 0 ? '+' : ''}
                    {results.oceanInfluence.tempDifference?.toFixed(1)}°C
                  </p>
                </div>

                {/* Ocean Current Speed */}
                <div className="flex flex-col items-center p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900">
                  <Wind className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mb-2" />
                  <label className="text-xs text-muted-foreground mb-1">Current Speed</label>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {results.oceanData.currentSpeed?.toFixed(2)} m/s
                  </p>
                </div>

                {/* Current Direction */}
                <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                  <Navigation className="h-5 w-5 text-purple-600 dark:text-purple-400 mb-2" 
                    style={{ transform: `rotate(${results.oceanData.currentDirection || 0}deg)` }} 
                  />
                  <label className="text-xs text-muted-foreground mb-1">Direction</label>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {results.oceanData.currentDirectionLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {results.oceanData.currentDirection?.toFixed(0)}°
                  </p>
                </div>
              </div>

              <Separator />

              {/* Salinity (Secondary Info) */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-sm font-medium">Salinity</label>
                  <p className="text-sm text-muted-foreground">{results.oceanData.salinity?.toFixed(1)} psu (Practical Salinity Unit)</p>
                </div>
              </div>

              {/* Ocean Influence Description */}
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-sm">
                  <strong className="text-blue-900 dark:text-blue-100">Ocean Influence:</strong>{' '}
                  <span className="text-blue-800 dark:text-blue-200">{results.oceanInfluence.description}</span>
                  <br />
                  <span className="text-xs text-muted-foreground mt-2 block">
                    Probabilities adjusted by{' '}
                    <strong>
                      {((results.oceanInfluence.adjustmentFactor || 1) - 1) > 0 ? '+' : ''}
                      {(((results.oceanInfluence.adjustmentFactor || 1) - 1) * 100).toFixed(1)}%
                    </strong>{' '}
                    based on sea-land temperature gradient and ocean currents. Data from HYCOM (Hybrid Coordinate Ocean Model).
                  </span>
                </AlertDescription>
              </Alert>

              {/* Base vs Adjusted Probabilities */}
              {results.baseProbabilities && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span>Probability Adjustment (Base → Adjusted)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {Object.entries(results.baseProbabilities).map(([key, baseProb]) => {
                      const condition = results.conditions.find(c => 
                        c.condition.toLowerCase().includes(key)
                      )
                      if (!condition) return null
                      
                      const adjusted = condition.probability
                      const diff = ((adjusted - baseProb) * 100)
                      
                      return (
                        <div key={key} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="capitalize font-medium">{key}:</span>
                          <span className="flex items-center gap-2">
                            <span className="text-muted-foreground">{(baseProb * 100).toFixed(1)}%</span>
                            <span>→</span>
                            <span className="font-semibold">{(adjusted * 100).toFixed(1)}%</span>
                            <Badge 
                              variant={Math.abs(diff) < 1 ? "outline" : "secondary"}
                              className={`text-xs ${
                                diff > 0 
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100' 
                                  : diff < 0 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                                    : ''
                              }`}
                            >
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                            </Badge>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* NEW: AI Insight Summary */}
        <InsightSummary
          data={{
            probabilities: {
              hot: results.conditions.find(c => c.condition === "Very Hot")?.probability || 0,
              cold: results.conditions.find(c => c.condition === "Very Cold")?.probability || 0,
              windy: results.conditions.find(c => c.condition === "Very Windy")?.probability || 0,
              wet: results.conditions.find(c => c.condition === "Very Wet")?.probability || 0,
              uncomfortable: results.conditions.find(c => c.condition === "Very Uncomfortable")?.probability || 0,
            },
          }}
        />

        {/* Summary */}
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription className="text-sm leading-relaxed">{results.summary}</AlertDescription>
        </Alert>

        {/* Charts - Wrapped for export */}
        <Tabs defaultValue="bars" className="w-full" id="analysis-charts">
          <TabsList className="grid w-full grid-cols-2 md:w-fit">
            <TabsTrigger value="bars">Distribution</TabsTrigger>
            <TabsTrigger value="donut">Relative Share</TabsTrigger>
          </TabsList>

          {/* Bar Chart */}
          <TabsContent value="bars" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Probability Distribution</CardTitle>
                <CardDescription>Likelihood of each extreme weather condition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 18, left: 0, bottom: 6 }}>
                      <defs>
                        {barChartData.map((d, i) => (
                          <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1" key={i}>
                            <stop offset="0%" stopColor={d.fill} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={d.fill} stopOpacity={0.2} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="condition" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis
                        label={{ value: "Probability (%)", angle: -90, position: "insideLeft" }}
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip
                        cursor={{ opacity: 0.1 }}
                        contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                        formatter={(value: number) => [`${value.toFixed(1)}%`, "Probability"]}
                      />
                      <Bar dataKey="probability" radius={[10, 10, 6, 6]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
                        ))}
                        <Label position="top" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donut */}
          <TabsContent value="donut" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relative Comparison</CardTitle>
                <CardDescription>Proportion of probabilities across conditions</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                {hasPieData ? (
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          {pieChartData.map((d, i) => (
                            <linearGradient id={`pgrad-${i}`} x1="0" y1="0" x2="1" y2="1" key={i}>
                              <stop offset="0%" stopColor={d.fill} stopOpacity={0.9} />
                              <stop offset="100%" stopColor={d.fill} stopOpacity={0.3} />
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={72}
                          outerRadius={110}
                          paddingAngle={2}
                          dataKey="value"
                          isAnimationActive
                          animationDuration={700}
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#pgrad-${index})`} />
                          ))}
                          <Label
                            position="center"
                            content={() => {
                              const total = pieChartData.reduce((a, b) => a + b.value, 0)
                              return (
                                <div className="text-center">
                                  <div className="text-sm text-muted-foreground">Total</div>
                                  <div className="text-2xl font-bold">{total.toFixed(1)}%</div>
                                </div>
                              )
                            }}
                          />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detailed Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detailed Analysis</CardTitle>
            <CardDescription>Probability breakdown for each weather condition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.conditions.map((condition, index) => (
              <ConditionRow key={index} condition={condition} isLast={index === results.conditions.length - 1} />
            ))}
          </CardContent>
        </Card>

        {/* Current Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historical Average for This Date</CardTitle>
            <CardDescription>Mean values across all years for this time period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Temperature" value={`${results.currentValues.T2M_celsius.toFixed(1)}°C`} />
              <Stat label="Wind Speed" value={`${results.currentValues.windSpeed.toFixed(1)} m/s`} />
              <Stat label="Precipitation" value={`${results.currentValues.PRECTOT_mmPerDay.toFixed(1)} mm/day`} />
              <Stat label="Humidity" value={`${(results.currentValues.QV2M * 1000).toFixed(2)} g/kg`} />
            </div>
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Export Results</CardTitle>
            <CardDescription>Download your analysis data in multiple formats</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={handleExportCSV} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" /> Export as CSV
            </Button>
            <Button onClick={handleExportJSON} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" /> Export as JSON
            </Button>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert variant="default" className="border-muted">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Data Source:</strong> NASA MERRA-2 reanalysis data (1980–2025) accessed via Google Earth Engine. Results
            represent historical probabilities and should not be used as weather forecasts. NASA does not endorse this
            application.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

/* ---------- UI Bits ---------- */
function SummaryItem({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-xl bg-muted/40">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        {children}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="space-y-1 p-3 rounded-xl border bg-card">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-60 text-xs">Historical mean for the selected date window across all years.</HoverCardContent>
    </HoverCard>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[320px] text-center p-8">
      <CloudRain className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-sm text-muted-foreground">
        All probabilities are very low.
        <br />No significant extreme conditions expected.
      </p>
    </div>
  )
}

function ConditionRow({ condition, isLast }: { condition: ConditionData; isLast: boolean }) {
  const Icon = condition.icon
  const percentage = condition.probability * 100
  const level = percentage >= 30 ? "High" : percentage >= 10 ? "Moderate" : "Low"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: `${condition.color}15` }}>
            <Icon className="h-5 w-5" style={{ color: condition.color }} />
          </div>
          <div>
            <div className="font-medium flex items-center gap-2">
              {condition.condition}
              <Badge variant="outline" className="text-[11px]">{level}</Badge>
            </div>
            <div className="text-xs text-muted-foreground">{condition.description}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: condition.color }}>
            {percentage.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">{condition.threshold}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <UiTooltipProvider>
          <UiTooltip>
            <TooltipTrigger asChild>
              <div className="flex-1">
                <Progress
                  value={percentage}
                  className="h-3"
                  style={{ "--progress-background": condition.color } as React.CSSProperties }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>{condition.condition} probability</TooltipContent>
          </UiTooltip>
        </UiTooltipProvider>
        <div className="text-xs text-muted-foreground w-20 text-right">{level}</div>
      </div>
      {!isLast && <Separator className="mt-4" />}
    </div>
  )
}

function UiTooltipProvider({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
