"use client"

import { Thermometer, Wind, Droplets, Sun } from "lucide-react"
import { useEffect, useRef } from "react"

export default function FeaturesGridSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".scroll-animate")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-muted/50 relative overflow-hidden">
      <div className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground/10 text-xs leading-tight pointer-events-none hidden xl:block">
        <pre className="font-mono">
          {`    │
    │     ╱╲
    │    ╱  ╲    ╱
    │   ╱    ╲  ╱
    │  ╱      ╲╱
    │ ╱
    └──────────────`}
        </pre>
      </div>

      <div className="container mx-auto px-6">
        <div className="mb-16 scroll-animate">
          <div className="text-sm font-medium text-muted-foreground mb-4">AI-Powered Analysis</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">Break down climate complexity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="space-y-4 scroll-animate" style={{ transitionDelay: "0ms" }}>
            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center">
              <Thermometer className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Temperature Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">
              Monitor global temperature changes with precision and predict future trends based on historical data.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-4 scroll-animate" style={{ transitionDelay: "100ms" }}>
            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Air Quality Index</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track air quality metrics in real-time to understand pollution patterns and their environmental impact.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-4 scroll-animate" style={{ transitionDelay: "200ms" }}>
            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Precipitation Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Analyze rainfall patterns and water cycle changes to predict droughts and flooding events accurately.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="space-y-4 scroll-animate" style={{ transitionDelay: "300ms" }}>
            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Solar Radiation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Monitor solar radiation levels and UV index to understand energy patterns and health implications.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
