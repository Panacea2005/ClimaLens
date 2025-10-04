export default function DebugSection() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto mb-20">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Analyze any climate pattern down to a single data point,{" "}
              <span className="text-muted-foreground">and track changes over time</span>
            </h2>
          </div>
          <div className="space-y-6 lg:pt-8">
            <p className="text-xl text-muted-foreground leading-relaxed">
              The first-of-its-kind climate intelligence system that can understand and predict environmental changes
              across vast geographical areas and time periods.
            </p>
          </div>
        </div>

        {/* Two visualization cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Card 1 - Flow diagram */}
          <div className="rounded-3xl bg-foreground text-background p-12 min-h-[400px] flex items-center justify-center">
            <div className="space-y-8">
              <div>
                <div className="text-sm font-medium mb-4 opacity-70">Data Pipeline</div>
                <h3 className="text-3xl font-bold mb-6">
                  Continuously learn from sensors, satellites, and historical data
                </h3>
                <p className="text-base opacity-90 leading-relaxed mb-8">
                  Build a comprehensive understanding of climate behavior over time to identify patterns and predict
                  future changes.
                </p>
              </div>
              {/* Simple flow visualization */}
              <div className="flex items-center gap-4 justify-center">
                <div className="w-20 h-20 rounded-2xl border-2 border-background/30 flex items-center justify-center">
                  <div className="text-xs font-mono">DATA</div>
                </div>
                <div className="text-2xl opacity-50">→</div>
                <div className="w-20 h-20 rounded-2xl border-2 border-background/30 flex items-center justify-center">
                  <div className="text-xs font-mono">PROCESS</div>
                </div>
                <div className="text-2xl opacity-50">→</div>
                <div className="w-20 h-20 rounded-2xl bg-background/20 border-2 border-background/50 flex items-center justify-center">
                  <div className="text-xs font-mono">INSIGHT</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Analysis visualization */}
          <div className="rounded-3xl bg-foreground text-background p-12 min-h-[400px] flex items-center justify-center">
            <div className="space-y-8 w-full">
              <div>
                <div className="text-sm font-medium mb-4 opacity-70">Pattern Recognition</div>
                <h3 className="text-3xl font-bold mb-6">Identify anomalies and trends automatically</h3>
                <p className="text-base opacity-90 leading-relaxed mb-8">
                  Unify climate, environmental, and geographical context to automatically understand why patterns emerge
                  and what they mean.
                </p>
              </div>
              {/* Simple data visualization */}
              <div className="space-y-3">
                {[
                  { label: "Temperature", value: 85 },
                  { label: "Humidity", value: 62 },
                  { label: "Air Quality", value: 78 },
                  { label: "Precipitation", value: 45 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-70">{item.label}</span>
                      <span className="font-mono">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-background/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-background/50 rounded-full transition-all"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
