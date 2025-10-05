"use client"

import Image from "next/image"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/ClimaLens.png"
            alt="ClimaLens"
            width={150}
            height={40}
            className="h-8 sm:h-10 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          )}
          <Link
            href="/dashboard"
            className="px-4 sm:px-6 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 font-medium text-sm sm:text-base"
          >
            Dashboard
          </Link>
        </div>
      </nav>
    </header>
  )
}

