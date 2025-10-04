"use client"

import { useEffect, useRef } from "react"

export default function IntroSection() {
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
    <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
      <div className="absolute right-0 top-1/4 text-muted-foreground/10 text-xs leading-tight pointer-events-none hidden lg:block animate-parallax-float">
        <pre className="font-mono">
          {`    ····················
  ··························
 ·······················
··········    ··········
·········      ·········
········        ········
·······          ·······
······            ······
·····              ·····
····                ····
···                  ···
··                    ··
·                      ·`}
        </pre>
      </div>

      <div className="absolute left-10 bottom-20 text-muted-foreground/10 text-xs leading-tight pointer-events-none hidden lg:block">
        <pre className="font-mono">
          {`    ╭─────────╮
    │  ▄▄▄▄▄  │
    │ ▄▀    ▀▄│
    │▀       ▀│
    ╰─────────╯`}
        </pre>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl scroll-animate">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Introducing ClimaSense
            <br />
            <span className="text-muted-foreground">Our smartest models capable of</span> predicting climate patterns
          </h2>
        </div>
      </div>
    </section>
  )
}
