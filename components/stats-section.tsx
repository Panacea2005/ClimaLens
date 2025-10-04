export default function StatsSection() {
  const stats = [
    { value: "10M+", label: "Data Points Daily" },
    { value: "195", label: "Countries Covered" },
    { value: "99.9%", label: "Uptime Reliability" },
    { value: "50K+", label: "Active Users" },
  ]

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
            Trusted by Organizations Worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of researchers, policymakers, and organizations using ClimaLens
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-8 rounded-2xl bg-muted/30 border border-border">
              <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
