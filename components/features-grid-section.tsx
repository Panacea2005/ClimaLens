"use client"

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
    <section ref={sectionRef} className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-16 scroll-animate">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">AI-Native Climate Analysis</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
            Break down climate complexity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Feature 1 */}
          <div className="scroll-animate" style={{ transitionDelay: "0ms" }}>
            <div className="mb-6 flex">
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Temperature Tracking</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Monitor global temperature changes with precision and predict future trends based on historical data.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="scroll-animate" style={{ transitionDelay: "100ms" }}>
            <div className="mb-6 flex">
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Air Quality Index</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track air quality metrics in real-time to understand pollution patterns and their environmental impact.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="scroll-animate" style={{ transitionDelay: "200ms" }}>
            <div className="mb-6 flex">
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Precipitation Analysis</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Analyze rainfall patterns and water cycle changes to predict droughts and flooding events accurately.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="scroll-animate" style={{ transitionDelay: "300ms" }}>
            <div className="mb-6 flex">
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Solar Radiation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Monitor solar radiation levels and UV index to understand energy patterns and health implications.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}