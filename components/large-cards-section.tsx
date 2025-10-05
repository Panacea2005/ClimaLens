import { ArrowRight } from "lucide-react"

export default function LargeCardsSection() {
  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <div className="flex gap-2 mb-2">
            <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
            <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
            <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
            <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
          </div>
          <h2 className="text-2xl font-bold text-foreground">How it works</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Card 1 */}
          <div className="bg-foreground text-background p-8 relative">
            <div className="absolute top-3 right-3 flex">
              <div className="w-[3px] h-[3px] rounded-full bg-background mr-1"></div>
              <div className="w-[3px] h-[3px] rounded-full bg-background"></div>
            </div>
            <div className="mb-12">
              <div className="text-xs font-medium mb-4 text-background/70 uppercase tracking-wider">Pick any date</div>
              <h3 className="text-2xl font-bold mb-3">Past or future. Up to 2100.</h3>
              <p className="text-background/80 text-sm">
                Select a location and date. We map it to day-of-year and show you historical likelihood. Not a forecast—just what history says about that day.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-foreground text-background p-8 relative">
            <div className="absolute top-3 right-3 flex">
              <div className="w-[3px] h-[3px] rounded-full bg-background mr-1"></div>
              <div className="w-[3px] h-[3px] rounded-full bg-background"></div>
            </div>
            <div className="mb-12">
              <div className="text-xs font-medium mb-4 text-background/70 uppercase tracking-wider">Instant analysis</div>
              <h3 className="text-2xl font-bold mb-3">Results in minutes.</h3>
              <p className="text-background/80 text-sm">
                See probabilities for extreme heat, cold, precipitation, wind, and discomfort. Export charts. Share links. Try example locations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}