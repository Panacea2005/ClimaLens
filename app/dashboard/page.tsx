import { Suspense } from "react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardContent from "@/components/dashboard/dashboard-content"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  )
}
