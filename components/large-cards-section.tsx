import { ArrowRight } from "lucide-react"

export default function LargeCardsSection() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Card 1 */}
          <div className="rounded-3xl bg-foreground text-background p-12 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="text-sm font-medium mb-4 opacity-70">Climate Modeling</div>
              <h3 className="text-4xl font-bold mb-6">Climate Simulations</h3>
              <p className="text-lg opacity-90 leading-relaxed">
                Simulate real climate scenarios on historical data to predict patterns before they emerge in the real
                world.
              </p>
            </div>
            <button className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-foreground hover:bg-background/90 transition-all w-fit font-medium">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl bg-foreground text-background p-12 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="text-sm font-medium mb-4 opacity-70">Real-Time Monitoring</div>
              <h3 className="text-4xl font-bold mb-6">Alert Systems</h3>
              <p className="text-lg opacity-90 leading-relaxed">
                Receive instant alerts for extreme weather events and climate anomalies to take action before problems
                escalate.
              </p>
            </div>
            <button className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-foreground hover:bg-background/90 transition-all w-fit font-medium">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
