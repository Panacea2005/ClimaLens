import { Database, Cloud, Activity, Satellite, Waves, TreePine } from "lucide-react"

export default function IntegrationsSection() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Learn from everything
            <br />
            <span className="text-muted-foreground">but start with data</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Dozens of integrations to learn from the systems you already use
          </p>
        </div>

        {/* Data Sources */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8">Data Sources</h3>
          <p className="text-muted-foreground mb-8">
            Integrate with different data sources to start pulling climate insights
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Satellite, label: "Satellite Data" },
              { icon: Database, label: "Weather Stations" },
              { icon: Cloud, label: "Cloud Sensors" },
              { icon: Waves, label: "Ocean Buoys" },
            ].map((source, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl border border-border bg-card hover:bg-accent transition-colors flex flex-col items-center justify-center gap-4 p-6"
              >
                <source.icon className="w-12 h-12" />
                <span className="text-sm font-medium text-center">{source.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Tools */}
        <div>
          <h3 className="text-2xl font-bold mb-8">Analysis Tools</h3>
          <p className="text-muted-foreground mb-8">Connect with your existing analysis and visualization platforms</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Activity, label: "Time Series" },
              { icon: TreePine, label: "Ecosystem" },
              { icon: Database, label: "Data Lakes" },
              { icon: Cloud, label: "Cloud Analytics" },
            ].map((tool, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl border border-border bg-card hover:bg-accent transition-colors flex flex-col items-center justify-center gap-4 p-6"
              >
                <tool.icon className="w-12 h-12" />
                <span className="text-sm font-medium text-center">{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
