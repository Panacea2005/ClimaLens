"use client"

import { useState } from "react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <DashboardSidebar />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">ClimaLens</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  )
}

