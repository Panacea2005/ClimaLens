export default function TwoColumnSection() {
  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
              Predictive models that <span className="text-muted-foreground">anticipate and prevent climate risks</span>
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-xl text-muted-foreground leading-relaxed">
              ClimaLens works directly with your data scientists to predict, prevent, and analyze climate events before
              they cause significant impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
