"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 2000)

    // Remove splash screen after fade out animation completes
    const removeTimer = setTimeout(() => {
      setIsVisible(false)
    }, 3200) // 2s delay + 1.2s fade out

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-1000 ease-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="relative"
        style={{
          animation: fadeOut 
            ? 'splash-fade-out 1000ms ease-out forwards' 
            : 'splash-fade-in 1000ms ease-out forwards'
        }}
      >
        <Image
          src="/ClimaLens.png"
          alt="ClimaLens"
          width={500}
          height={500}
          priority
          className="w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] object-contain"
        />
      </div>
    </div>
  )
}
