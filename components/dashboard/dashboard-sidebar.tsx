"use client"

import { Home, BarChart3, Globe, TrendingUp, Settings, FileText, Cloud } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardSidebar() {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Globe, label: "Global Map", href: "/dashboard/map" },
    { icon: TrendingUp, label: "Trends", href: "/dashboard/trends" },
    { icon: Cloud, label: "Forecasts", href: "/dashboard/forecasts" },
    { icon: FileText, label: "Reports", href: "/dashboard/reports" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card p-6 hidden md:block">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">ClimaLens</h1>
        <p className="text-sm text-muted-foreground mt-1">Climate Intelligence</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
