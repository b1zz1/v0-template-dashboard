import DashboardPageLayout from "@/components/dashboard/layout"
import BugTracker from "@/components/bug-hunting/bug-tracker"
import PerformanceMonitor from "@/components/bug-hunting/performance-monitor"
import { Bug } from "lucide-react"

export default function BugHuntingPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Bug Hunting Central",
        description: "Track bugs and monitor performance issues",
        icon: Bug,
      }}
    >
      <div className="space-y-8">
        <BugTracker />
        <PerformanceMonitor />
      </div>
    </DashboardPageLayout>
  )
}
