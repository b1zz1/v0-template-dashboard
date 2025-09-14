import DashboardPageLayout from "@/components/dashboard/layout"
import BrokenChart from "@/components/buggy/broken-chart"
import MemoryLeakComponent from "@/components/buggy/memory-leak-component"
import RaceConditionDemo from "@/components/buggy/race-condition-demo"
import { Bug } from "lucide-react"

export default function BugsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Bug Hunting Ground",
        description: "Find and fix the intentional bugs in these components",
        icon: Bug,
      }}
    >
      <div className="space-y-6">
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h3 className="font-semibold text-yellow-600 mb-2">Bug Hunting Instructions</h3>
          <p className="text-sm text-muted-foreground">
            This page contains intentionally buggy components. Your mission is to identify and fix:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Memory leaks and missing cleanup functions</li>
            <li>• Race conditions and unsafe state updates</li>
            <li>• API error handling issues</li>
            <li>• Performance problems and expensive re-renders</li>
            <li>• Missing error boundaries and validation</li>
          </ul>
        </div>

        <BrokenChart />
        <MemoryLeakComponent />
        <RaceConditionDemo />
      </div>
    </DashboardPageLayout>
  )
}
