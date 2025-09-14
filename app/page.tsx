"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import RebelsRanking from "@/components/dashboard/rebels-ranking"
import SecurityStatus from "@/components/dashboard/security-status"
import BracketsIcon from "@/components/icons/brackets"
import GearIcon from "@/components/icons/gear"
import ProcessorIcon from "@/components/icons/proccesor"
import BoomIcon from "@/components/icons/boom"
import BuggyOverview from "@/components/buggy/overview-bugs"
import BuggyStat from "@/components/dashboard/buggy-stat"
import { useEffect, useState } from "react"
import mockDataJson from "@/mock.json"
import type { MockData } from "@/types/dashboard"

const mockData = mockDataJson as MockData

// Icon mapping
const iconMap = {
  gear: GearIcon,
  proccesor: ProcessorIcon,
  boom: BoomIcon,
}

export default function DashboardOverview() {
  const [data, setData] = useState(mockData)
  const [useBuggyComponents, setUseBuggyComponents] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dataGenerated, setDataGenerated] = useState(false)

  useEffect(() => {
    const generateInitialData = async () => {
      try {
        console.log("[v0] Generating initial random data...")
        const response = await fetch("/api/generate-data", { method: "POST" })

        if (!response.ok) {
          console.error(`[v0] HTTP error! status: ${response.status}`)
          const errorText = await response.text()
          console.error("[v0] Error response:", errorText)
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          setData((prev) => ({
            ...prev,
            ...result.data,
          }))
          setDataGenerated(true)
          console.log("[v0] Random data generated and applied successfully")
        } else {
          console.error("[v0] API returned error:", result.error)
        }
      } catch (error) {
        console.error("[v0] Failed to generate initial data:", error)
        console.log("[v0] Using fallback mock data")
      } finally {
        setIsLoading(false)
      }
    }

    generateInitialData()

    setUseBuggyComponents(Math.random() < 0.15) // 15% chance
  }, [])

  const StatComponent = useBuggyComponents ? BuggyStat : DashboardStat

  if (isLoading) {
    return (
      <DashboardPageLayout
        header={{
          title: "Overview",
          description: "Loading random data...",
          icon: BracketsIcon,
        }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Generating random data...</div>
        </div>
      </DashboardPageLayout>
    )
  }

  return (
    <BuggyOverview>
      <DashboardPageLayout
        header={{
          title: "Overview",
          description: `${dataGenerated ? "Random data generated" : "Using mock data"} • Updated ${new Date().toLocaleTimeString()} ${useBuggyComponents ? "🐛" : ""}`,
          icon: BracketsIcon,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {data.dashboardStats.map((stat, index) => (
            <StatComponent
              key={index}
              label={stat.label}
              value={stat.value}
              description={stat.description}
              icon={iconMap[stat.icon as keyof typeof iconMap]}
              tag={stat.tag}
              intent={stat.intent}
              direction={stat.direction}
            />
          ))}
        </div>

        <div className="mb-6">
          <DashboardChart />
        </div>

        {/* Main 2-column grid section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RebelsRanking rebels={data.rebelsRanking} />
          <SecurityStatus statuses={data.securityStatus} />
        </div>
      </DashboardPageLayout>
    </BuggyOverview>
  )
}
