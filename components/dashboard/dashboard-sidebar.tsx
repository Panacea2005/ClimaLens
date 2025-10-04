"use client"

import { useState } from "react"
import {
  Search,
  BarChart2,
  Database,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const tabs = [
    { icon: Search, label: "Explore", href: "/dashboard/explore" },
    { icon: BarChart2, label: "Results", href: "/dashboard/results" },
    { icon: Database, label: "Data & Methods", href: "/dashboard/data-methods" },
  ]

  return (
    <aside
      className={cn(
        "h-full border-r bg-card flex flex-col transition-all duration-300",
        isCollapsed ? "w-14" : "w-52"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        {!isCollapsed && (
          <Link href="/" className="block">
            <Image
              src="/ClimaLens.png"
              alt="ClimaLens"
              width={140}
              height={36}
              className="h-24 w-auto"
              priority
            />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("h-8 w-8", isCollapsed && "mx-auto")}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-3">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-1">
            {tabs.map((tab) => {
              const isActive =
                pathname === tab.href || pathname?.startsWith(tab.href + "/")
              const link = (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
                    "px-2.5 py-2",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    isCollapsed && "justify-center"
                  )}
                >
                  <tab.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{tab.label}</span>}
                </Link>
              )
              return isCollapsed ? (
                <Tooltip key={tab.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{tab.label}</TooltipContent>
                </Tooltip>
              ) : (
                link
              )
            })}
          </div>
        </TooltipProvider>
      </nav>

      <Separator />

      {/* Footer Section */}
      <div className="p-3 mt-auto space-y-3">
        {/* Account Section */}
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
            "hover:bg-accent hover:text-foreground"
          )}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>Pa</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-medium text-sm">Panacea</span>
              <span className="text-xs text-muted-foreground">
                View profile
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Settings */}
        <TooltipProvider delayDuration={0}>
          <div>
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
                "px-2.5 py-2 text-muted-foreground hover:text-foreground hover:bg-accent",
                isCollapsed && "justify-center"
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">Settings</span>}
            </Link>
          </div>
        </TooltipProvider>
      </div>
    </aside>
  )
}
