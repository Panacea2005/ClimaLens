"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

import {
  AlertTriangle,
  Database,
  TrendingUp,
  Info,
  ThermometerSun,
  Snowflake,
  Wind,
  CloudRain,
  Droplets,
  Gauge,
  BookOpen,
  Timer,
  Globe,
  Server,
  GitBranch,
  ClipboardList,
  ExternalLink,
  Waves,
  Navigation,
} from "lucide-react"

// ---------------- Types ----------------
interface Variable {
  code: string
  name: string
  dataset: string
  unit: string
  usedFor: string[]
  icon: any
  color: string
}

interface Condition {
  name: string
  icon: any
  color: string // Tailwind classes applied to container
  percentile: string
  fallback: string
  formula: string
  description: string
}

// ---------------- Data ----------------
const variablesUsed: Variable[] = [
  {
    code: "T2M",
    name: "2‑meter Air Temperature",
    dataset: "M2T1NXSLV",
    unit: "Kelvin (K)",
    usedFor: ["Very Hot", "Very Cold", "Very Uncomfortable"],
    icon: ThermometerSun,
    color: "text-red-500",
  },
  {
    code: "U10M",
    name: "10‑m Eastward Wind",
    dataset: "M2T1NXSLV",
    unit: "m/s",
    usedFor: ["Very Windy"],
    icon: Wind,
    color: "text-purple-500",
  },
  {
    code: "V10M",
    name: "10‑m Northward Wind",
    dataset: "M2T1NXSLV",
    unit: "m/s",
    usedFor: ["Very Windy"],
    icon: Wind,
    color: "text-purple-500",
  },
  {
    code: "QV2M",
    name: "2‑m Specific Humidity",
    dataset: "M2T1NXSLV",
    unit: "kg/kg",
    usedFor: ["Very Uncomfortable"],
    icon: Droplets,
    color: "text-cyan-500",
  },
  {
    code: "PRECTOT",
    name: "Total Precipitation",
    dataset: "M2T1NXFLX",
    unit: "kg/m²/s → mm/day",
    usedFor: ["Very Wet"],
    icon: CloudRain,
    color: "text-blue-500",
  },
]

const oceanVariablesUsed: Variable[] = [
  {
    code: "water_temp_0",
    name: "Sea Surface Temperature (SST)",
    dataset: "HYCOM/sea_temp_salinity",
    unit: "°C",
    usedFor: ["Ocean Influence (Coastal)"],
    icon: Waves,
    color: "text-blue-600",
  },
  {
    code: "salinity_0",
    name: "Sea Surface Salinity",
    dataset: "HYCOM/sea_temp_salinity",
    unit: "PSU",
    usedFor: ["Ocean Influence (Coastal)"],
    icon: Droplets,
    color: "text-cyan-600",
  },
  {
    code: "velocity_u_0",
    name: "Ocean Current (Eastward)",
    dataset: "HYCOM/sea_water_velocity",
    unit: "m/s",
    usedFor: ["Ocean Influence (Coastal)"],
    icon: Navigation,
    color: "text-purple-600",
  },
  {
    code: "velocity_v_0",
    name: "Ocean Current (Northward)",
    dataset: "HYCOM/sea_water_velocity",
    unit: "m/s",
    usedFor: ["Ocean Influence (Coastal)"],
    icon: Navigation,
    color: "text-purple-600",
  },
]

const conditions: Condition[] = [
  {
    name: "Very Hot",
    icon: ThermometerSun,
    color: "bg-red-500/10 text-red-700 border-red-200",
    percentile: "90th",
    fallback: "≥30 °C (303 K)",
    formula: "T2M ≥ max(90th percentile, 303 K)",
    description: "Top 10% of historical temperatures for that location and date",
  },
  {
    name: "Very Cold",
    icon: Snowflake,
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
    percentile: "10th",
    fallback: "≤0 °C (273 K)",
    formula: "T2M ≤ min(10th percentile, 273 K)",
    description: "Bottom 10% of historical temperatures for that location and date",
  },
  {
    name: "Very Windy",
    icon: Wind,
    color: "bg-purple-500/10 text-purple-700 border-purple-200",
    percentile: "90th",
    fallback: "≥10 m/s",
    formula: "√(U10M² + V10M²) ≥ max(90th percentile, 10)",
    description: "Top 10% of historical wind speeds for that location and date",
  },
  {
    name: "Very Wet",
    icon: CloudRain,
    color: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
    percentile: "95th (rainy days)",
    fallback: "≥10 mm/day",
    formula: "PRECTOT ≥ max(95th percentile of rainy days, 10 mm/day)",
    description: "Top 5% of rainy days (≥1 mm) for that location and date",
  },
  {
    name: "Very Uncomfortable",
    icon: Gauge,
    color: "bg-amber-500/10 text-amber-700 border-amber-200",
    percentile: "90th (both)",
    fallback: "None",
    formula: "T2M ≥ 90th percentile AND QV2M ≥ 90th percentile",
    description: "Both temperature and humidity exceed their 90th percentiles simultaneously",
  },
]

export default function DataMethodsPage() {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="container max-w-7xl py-10 space-y-8">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="uppercase tracking-wide">Documentation</Badge>
              <Badge variant="outline" className="hidden sm:inline-flex">MERRA‑2</Badge>
              <Badge variant="outline" className="hidden sm:inline-flex">GEE</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Data & Methods</h1>
            <p className="text-muted-foreground mt-1">Transparent description of our data sources, variables, and algorithms</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="https://github.com/Panacea2005/ClimaLens" target="_blank" rel="noreferrer">
                <GitBranch className="mr-2 h-4 w-4" /> Repo <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="#api">API</a>
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <Alert variant="destructive" className="border-destructive/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Disclaimer</AlertTitle>
          <AlertDescription>
            This is an independent project created for the NASA Space Apps Challenge 2025. <strong>NASA does not endorse this application.</strong> Results represent historical probabilities and should not be used as weather forecasts. For critical decisions, consult official meteorological services.
          </AlertDescription>
        </Alert>

        {/* Dataset Overview (Bento) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>NASA MERRA‑2 Reanalysis Dataset</CardTitle>
            </div>
            <CardDescription>Modern‑Era Retrospective analysis for Research and Applications, Version 2</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              MERRA‑2 is a state‑of‑the‑art atmospheric reanalysis dataset produced by NASA’s <strong>Global Modeling and Assimilation Office (GMAO)</strong>. It blends observations with numerical models to provide global atmospheric fields from 1980 to the present.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <Kpi title="Temporal Coverage" value="1980–2025" hint="45 years of data" icon={Timer} />
              <Kpi title="Spatial Resolution" value="~50 km" hint="0.5° × 0.625° grid" icon={Globe} />
              <Kpi title="Temporal Resolution" value="Hourly" hint="Aggregated to daily" icon={ClockIcon} />
              <Kpi title="Access Method" value="Google Earth Engine" hint="Optimized cloud processing" icon={Server} />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Data Attribution:</strong> GMAO (2015), MERRA‑2 tavg1_2d_slv_Nx & tavg1_2d_flx_Nx, GES DISC, doi:10.5067/VJAFPLI1CSIV
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Variables */}
        <Tabs defaultValue="variables" className="w-full">
          <TabsList className="grid w-full md:w-fit grid-cols-3">
            <TabsTrigger value="variables">Weather (MERRA-2)</TabsTrigger>
            <TabsTrigger value="ocean">Ocean (HYCOM)</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
          </TabsList>
          <TabsContent value="variables" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Weather Variables (MERRA-2)</CardTitle>
                <CardDescription>We use <strong>5 carefully selected variables</strong> from NASA MERRA‑2 (1980–2024)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {variablesUsed.map((v, i) => (
                  <VariableRow key={i} v={v} />
                ))}
                <Alert className="bg-primary/5 border-primary/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Temporal Coverage:</strong> 45 years (1980–2024) with ±7 day windows. Recent years (2022+) weighted 1.5× for climate change adaptation.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ocean" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Ocean Variables (HYCOM)</CardTitle>
                <CardDescription><strong>4 ocean variables</strong> used for coastal locations (≤50km from coast)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {oceanVariablesUsed.map((v, i) => (
                  <VariableRow key={i} v={v} />
                ))}
                <Alert className="bg-blue-500/5 border-blue-500/20">
                  <Waves className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm">
                    <strong>3-Tier Coastal Zones:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                      <li><strong>≤30km:</strong> Strong coastal influence (100% HYCOM weight)</li>
                      <li><strong>30-50km:</strong> Intermediate zone (linear decay)</li>
                      <li><strong>&gt;50km:</strong> Inland - HYCOM skipped (negligible ocean influence)</li>
                    </ul>
                    <p className="mt-2"><strong>Temporal Coverage:</strong> 32 years (1992–2024), same ±7 day windows and 1.5× weighting for recent years.</p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="conditions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Climate Conditions Analyzed</CardTitle>
                <CardDescription>All five conditions are computed for every query</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {conditions.map((c, i) => (
                  <ConditionCard key={i} c={c} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Methodology */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Analysis Methodology</CardTitle>
            </div>
            <CardDescription>Location‑adaptive percentile‑based probability analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="step-1">
                <AccordionTrigger className="text-base">1. Data Retrieval (20–40 seconds)</AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                  <p>For each query, we fetch 45 years of historical data:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Years 1980–2025 via Google Earth Engine</li>
                    <li>Day‑of‑year window ±7 days (15 total)</li>
                    <li>Five variables from two MERRA‑2 collections (SLV + FLX)</li>
                    <li>Spatial mean over the selected location</li>
                    <li>Result: 45 samples per variable (one per year)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step-2">
                <AccordionTrigger className="text-base">2. Percentile Calculation</AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                  <p>We compute location‑specific thresholds using linear‑interpolated percentiles:</p>
                  <pre className="bg-muted p-3 rounded-md font-mono text-xs whitespace-pre-wrap">sorted = sort(values)
index = (p/100) * (n-1)
threshold = interpolate(sorted, index)</pre>
                  <p className="mt-1">This makes “very hot” in Singapore differ from Phoenix.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step-3">
                <AccordionTrigger className="text-base">3. Fallback Thresholds</AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Global, science‑based minima to ensure meaningful extremes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Hot:</strong> ≥30 °C</li>
                    <li><strong>Cold:</strong> ≤0 °C</li>
                    <li><strong>Windy:</strong> ≥10 m/s</li>
                    <li><strong>Wet:</strong> ≥10 mm/day (R10mm concept)</li>
                    <li><strong>Uncomfortable:</strong> percentile‑only</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step-4">
                <AccordionTrigger className="text-base">4. Probability Computation</AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Exceedance probability equals historical frequency:</p>
                  <pre className="bg-muted p-3 rounded-md font-mono text-xs">P = years_exceeding / total_years</pre>
                  <p>Example: 12/45 → 26.7%</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step-5">
                <AccordionTrigger className="text-base">5. Results Generation</AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                  <p>We assemble a structured report including probabilities, thresholds, historical context, and metadata.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Scientific Standards */}
        <Card>
          <CardHeader>
            <CardTitle>Scientific Standards & References</CardTitle>
            <CardDescription>Methodology aligns with established climate science practices</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <RefCard title="WMO Guidelines" desc="Percentile‑based definitions of climate extremes (e.g., 90th/10th)." />
            <RefCard title="ETCCDI Indices" desc="TX90p, TN10p, R10mm methodology for extremes detection." />
            <RefCard title="IPCC AR6" desc="Chapter 11: Weather and Climate Extreme Events guidance." />
            <RefCard title="Peer‑reviewed" desc="Zhang et al. (2011) indices for monitoring changes in extremes." />
          </CardContent>
        </Card>

        {/* Limitations */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Limitations & Considerations</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-2 text-sm mt-3">
              <li><strong>Historical only:</strong> Not a forecast; climate change may shift distributions.</li>
              <li><strong>Reanalysis:</strong> Model‑assimilated fields; uncertainties exist.</li>
              <li><strong>Resolution:</strong> ~50 km grid; microclimates may differ.</li>
              <li><strong>Percentiles:</strong> By design ~10% around 90th/10th; fallbacks keep results meaningful.</li>
              <li><strong>Processing time:</strong> 20–40 s typical per analysis.</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Data Access & API */}
        <Card id="api">
          <CardHeader>
            <CardTitle>Data Access & API</CardTitle>
            <CardDescription>How we access and process NASA data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <MiniCallout icon={Server} title="Platform" desc="Google Earth Engine (GEE) provides petabyte‑scale access and compute." />
              <MiniCallout icon={ClipboardList} title="Authentication" desc="Service account with authorized access to MERRA‑2 in the GEE catalog." />
              <MiniCallout icon={BookOpen} title="Processing" desc="Percentiles/means computed server‑side in GEE for efficiency." />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Datasets:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">NASA/GSFC/MERRA/slv/2</code> — Single‑Level Diagnostics (1980–2024)</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">NASA/GSFC/MERRA/flx/2</code> — Surface Flux Diagnostics (1980–2024)</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">HYCOM/sea_temp_salinity</code> — Ocean Temperature & Salinity (1992–2024)</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">HYCOM/sea_water_velocity</code> — Ocean Currents (1992–2024)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>
            For detailed algorithm specifications, see our {" "}
            <a href="https://github.com/climalens" className="text-primary hover:underline" target="_blank" rel="noreferrer">GitHub repository</a>
            {" "}or the{ " "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">ClimaLens_ALGORITHMS.md</code> file.
          </p>
          <p className="mt-2"><strong>Version:</strong> 1.0.0 · <strong>Last Updated:</strong> October 2025</p>
        </div>
      </div>
    </div>
  )
}

// ---------------- UI Bits ----------------
function Kpi({ title, value, hint, icon: Icon }: { title: string; value: string; hint?: string; icon: any }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="p-4 rounded-2xl border bg-card shadow-sm flex items-start gap-3">
          <div className="p-2 rounded-xl bg-muted/40"><Icon className="h-5 w-5 text-primary" /></div>
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase">{title}</div>
            <div className="text-xl font-bold leading-tight">{value}</div>
            {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 text-xs">Additional details for {title.toLowerCase()}.</HoverCardContent>
    </HoverCard>
  )
}

function VariableRow({ v }: { v: Variable }) {
  const Icon = v.icon
  return (
    <div className="border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl bg-muted/40 ${v.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold">{v.code}</span>
              <Badge variant="outline" className="text-xs">{v.dataset}</Badge>
            </div>
            <p className="text-sm font-medium">{v.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{v.unit}</p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-default">Used by {v.usedFor.length} condition(s)</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                {v.usedFor.map((u, i) => (
                  <div key={i}>• {u}</div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator />
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground">Used for:</span>
        {v.usedFor.map((u, i) => (
          <Badge key={i} variant="secondary" className="text-xs">{u}</Badge>
        ))}
      </div>
    </div>
  )
}

function ConditionCard({ c }: { c: Condition }) {
  const Icon = c.icon
  return (
    <div className={`border rounded-xl p-4 ${c.color}`}>
      <div className="flex items-start gap-3 mb-3">
        <Icon className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold">{c.name}</h3>
          <p className="text-sm mt-1">{c.description}</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 text-sm">
        <div className="py-2 px-3 bg-background/60 rounded"> <span className="text-muted-foreground">Percentile:</span> <span className="font-medium float-right">{c.percentile}</span> </div>
        <div className="py-2 px-3 bg-background/60 rounded"> <span className="text-muted-foreground">Fallback:</span> <span className="font-medium float-right">{c.fallback}</span> </div>
        <div className="py-2 px-3 bg-background/60 rounded sm:col-span-1 col-span-3"> <span className="text-muted-foreground text-xs">Formula:</span>
          <p className="font-mono text-xs mt-1">{c.formula}</p>
        </div>
      </div>
    </div>
  )
}

function RefCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function MiniCallout({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-2xl border bg-card shadow-sm flex items-start gap-3">
      <div className="p-2 rounded-xl bg-muted/40"><Icon className="h-5 w-5 text-primary" /></div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
    </div>
  )
}

// small replacement for missing lucide icon type above
function ClockIcon(props: any) {
  return <Timer {...props} />
}
