"use client"

import { useEffect, useRef } from "react"

export default function AwarenessSection() {
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
    <section ref={sectionRef} className="py-32 bg-muted/50 relative overflow-hidden">
      <div className="absolute right-10 bottom-20 text-muted-foreground/10 text-xs leading-tight pointer-events-none hidden xl:block">
        <pre className="font-mono">
          {`    ┌───┐     ┌───┐
    │   │     │   │
    │   │ ┌───┤   │
    │   │ │   │   │
    │   │ │   │   │
    └───┴─┴───┴───┘`}
        </pre>
      </div>

      <div className="absolute left-20 top-20 text-muted-foreground/10 text-xs leading-tight pointer-events-none hidden xl:block animate-parallax-float">
        <pre className="font-mono">
          {`    ·     ·   ·
      ·  ·    ·
    ·      · ·
       ·  ·     ·
    ·    ·   ·`}
        </pre>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center scroll-animate">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">Global Climate Awareness</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Navigate, analyze, and understand climate data across millions of data points and hundreds of monitoring
            stations worldwide.
          </p>
        </div>
      </div>
    </section>
  )
}
