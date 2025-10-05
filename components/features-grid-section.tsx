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
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">NASA MERRA-2 + HYCOM</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl">
            Real science. Real data.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Feature 1 */}
          <div className="scroll-animate" style={{ transitionDelay: "0ms" }}>
            <div className="mb-6 flex">
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Extreme Heat & Cold</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              See if your date hits the top 10% hottest or coldest days. Based on 45 years of NASA reanalysis.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="scroll-animate" style={{ transitionDelay: "100ms" }}>
            <div className="mb-6 flex">
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Ocean Influence</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Coastal locations get sea surface temperature, currents, and land-ocean temperature differences.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="scroll-animate" style={{ transitionDelay: "200ms" }}>
            <div className="mb-6 flex">
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Heavy Precipitation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Identify days with extreme rainfall. Historical likelihood, not a forecast. Perfect for planning.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="scroll-animate" style={{ transitionDelay: "300ms" }}>
            <div className="mb-6 flex">
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                </div>
                <div className="flex gap-[2px]">
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-foreground"></div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Wind & Discomfort</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track extreme wind speeds and heat index. Know when conditions become uncomfortable or dangerous.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}