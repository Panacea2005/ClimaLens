import { Cloud, TrendingUp, Globe, BarChart3 } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: Cloud,
      title: "Real-Time Monitoring",
      description: "Track climate metrics and environmental data as they happen with live updates and alerts.",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Leverage AI-powered forecasting to anticipate climate trends and prepare for future scenarios.",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access comprehensive data from thousands of monitoring stations across every continent.",
    },
    {
      icon: BarChart3,
      title: "Advanced Visualization",
      description: "Transform raw data into intuitive charts, graphs, and interactive maps for better understanding.",
    },
  ]

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
            Powerful Climate Intelligence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need to understand and respond to climate change
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
