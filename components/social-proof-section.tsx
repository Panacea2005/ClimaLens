"use client"

import { Cloud, Leaf, Globe } from "lucide-react"
import { useEffect, useRef } from "react"

export default function SocialProofSection() {
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
    <section ref={sectionRef} className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute right-20 top-10 text-muted-foreground/10 text-xs leading-tight pointer-events-none hidden xl:block">
        <pre className="font-mono">
          {`    ┌─────────────┐
    │   ▄▄▄▄▄▄▄   │
    │  ▄▀      ▀▄ │
    │ ▀         ▀ │
    │             │
    └─────────────┘`}
        </pre>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Stat 1 */}
          <div className="text-center space-y-4 scroll-animate" style={{ transitionDelay: "0ms" }}>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center">
                <Cloud className="w-8 h-8" />
              </div>
            </div>
            <div className="text-5xl font-bold">10M+</div>
            <div className="text-muted-foreground">Data points analyzed daily</div>
          </div>

          {/* Stat 2 */}
          <div className="text-center space-y-4 scroll-animate" style={{ transitionDelay: "100ms" }}>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center">
                <Leaf className="w-8 h-8" />
              </div>
            </div>
            <div className="text-5xl font-bold">95%</div>
            <div className="text-muted-foreground">Prediction accuracy achieved</div>
          </div>

          {/* Stat 3 */}
          <div className="text-center space-y-4 scroll-animate" style={{ transitionDelay: "200ms" }}>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center">
                <Globe className="w-8 h-8" />
              </div>
            </div>
            <div className="text-5xl font-bold">150+</div>
            <div className="text-muted-foreground">Countries monitored globally</div>
          </div>
        </div>
      </div>
    </section>
  )
}
