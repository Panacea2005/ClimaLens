"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useInsightSummary } from "@/hooks/use-insight-summary"

interface InsightSummaryProps {
  data: {
    probabilities: {
      hot: number
      cold: number
      windy: number
      wet: number
      uncomfortable: number
    }
  } | null
}

export function InsightSummary({ data }: InsightSummaryProps) {
  const { insights, primaryInsight, hasMultipleInsights } = useInsightSummary(data)

  if (!data || !primaryInsight) return null

  const Icon = primaryInsight.icon

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className={`h-5 w-5 ${primaryInsight.color}`} />
            Climate Insight
          </CardTitle>
          <Badge variant={primaryInsight.severity === "high" ? "destructive" : primaryInsight.severity === "moderate" ? "default" : "secondary"}>
            {primaryInsight.severity === "high" ? "High Impact" : primaryInsight.severity === "moderate" ? "Moderate" : "Normal"}
          </Badge>
        </div>
        <CardDescription>AI-generated summary based on historical data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Insight */}
        <Alert className={
          primaryInsight.severity === "high" ? "bg-destructive/5 border-destructive/20" :
          primaryInsight.severity === "moderate" ? "bg-primary/5 border-primary/20" :
          "bg-muted border-muted"
        }>
          <Icon className={`h-4 w-4 ${primaryInsight.color}`} />
          <AlertDescription className="font-medium">
            {primaryInsight.message}
          </AlertDescription>
        </Alert>

        {/* Additional Insights */}
        {hasMultipleInsights && insights.length > 1 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Additional Conditions:</p>
            <div className="space-y-2">
              {insights.slice(1).map((insight, index) => {
                const InsightIcon = insight.icon
                return (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <InsightIcon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${insight.color}`} />
                    <span className="text-muted-foreground">{insight.message}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            ℹ️ This insight is generated based on percentile analysis of 45 years of historical data.
            It represents the likelihood of specific weather patterns, not a forecast.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

