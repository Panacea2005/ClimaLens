import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TemperatureChart from "./temperature-chart"
import CO2Chart from "./co2-chart"
import { TrendingUp, TrendingDown, AlertTriangle, Droplets } from "lucide-react"

export default function DashboardContent() {
  const keyMetrics = [
    {
      title: "Global Temperature",
      value: "+1.2°C",
      change: "+0.08°C",
      trend: "up",
      icon: TrendingUp,
      description: "vs pre-industrial average",
    },
    {
      title: "CO₂ Levels",
      value: "421 ppm",
      change: "+2.5 ppm",
      trend: "up",
      icon: AlertTriangle,
      description: "atmospheric concentration",
    },
    {
      title: "Sea Level Rise",
      value: "+101 mm",
      change: "+3.4 mm/yr",
      trend: "up",
      icon: Droplets,
      description: "since 1993",
    },
    {
      title: "Arctic Ice",
      value: "4.2M km²",
      change: "-12.6%",
      trend: "down",
      icon: TrendingDown,
      description: "September minimum",
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Climate Overview</h2>
        <p className="text-muted-foreground">Real-time insights and key metrics</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="rounded-2xl border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">{metric.title}</CardDescription>
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    metric.trend === "up" ? "bg-red-500/10" : "bg-blue-500/10",
                  )}
                >
                  <metric.icon className={cn("w-4 h-4", metric.trend === "up" ? "text-red-500" : "text-blue-500")} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
              <div className="flex items-center gap-2 text-sm">
                <span className={cn("font-medium", metric.trend === "up" ? "text-red-500" : "text-blue-500")}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemperatureChart />
        <CO2Chart />
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
              <div>
                <p className="font-medium text-sm">Heat Wave Warning</p>
                <p className="text-xs text-muted-foreground">Southern Europe - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
              <div>
                <p className="font-medium text-sm">Drought Conditions</p>
                <p className="text-xs text-muted-foreground">Western US - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
              <div>
                <p className="font-medium text-sm">Storm System</p>
                <p className="text-xs text-muted-foreground">Pacific Ocean - 8 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Data Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Satellite Coverage</span>
                <span className="font-medium">98%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[98%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Station Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[99.9%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Data Freshness</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[95%]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
              Generate Report
            </button>
            <button className="w-full px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium">
              Export Data
            </button>
            <button className="w-full px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium">
              Share Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
