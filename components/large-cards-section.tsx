import { ArrowRight } from "lucide-react"

export default function LargeCardsSection() {
  return (
    <section className="py-20 bg-background border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <div className="flex gap-2 mb-2">
            <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
            <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
            <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
            <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
          </div>
          <h2 className="text-2xl font-bold">Core Solutions</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Card 1 */}
          <div className="bg-black text-white p-8 relative">
            <div className="absolute top-3 right-3 flex">
              <div className="w-[3px] h-[3px] rounded-full bg-white mr-1"></div>
              <div className="w-[3px] h-[3px] rounded-full bg-white"></div>
            </div>
            <div className="mb-12">
              <div className="text-xs font-medium mb-4 text-white/70 uppercase tracking-wider">Climate Modeling</div>
              <h3 className="text-2xl font-bold mb-3">Climate Simulations</h3>
              <p className="text-white/80 text-sm">
                Simulate real climate scenarios on historical data to predict patterns before they emerge in the real
                world.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-black text-white p-8 relative">
            <div className="absolute top-3 right-3 flex">
              <div className="w-[3px] h-[3px] rounded-full bg-white mr-1"></div>
              <div className="w-[3px] h-[3px] rounded-full bg-white"></div>
            </div>
            <div className="mb-12">
              <div className="text-xs font-medium mb-4 text-white/70 uppercase tracking-wider">Real-Time Monitoring</div>
              <h3 className="text-2xl font-bold mb-3">Alert Systems</h3>
              <p className="text-white/80 text-sm">
                Receive instant alerts for extreme weather events and climate anomalies to take action before problems
                escalate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}