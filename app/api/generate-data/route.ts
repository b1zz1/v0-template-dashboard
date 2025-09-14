import { NextResponse } from "next/server"
import { RandomDataGenerator } from "@/lib/random-data-generator"

// In-memory storage for the browser environment
let generatedData: any = null

export async function POST() {
  try {
    const generator = new RandomDataGenerator({
      allowInvalidValues: true,
      invalidValueChance: 0.2, // 20% chance for demo purposes
    })

    // Generate all random data
    const dashboardStats = generator.generateDashboardStats()
    const rebelsRanking = generator.generateRebelsRanking()
    const securityStatus = generator.generateSecurityStatus()
    const chartData = generator.generateChartData()

    // Store in memory instead of file system
    generatedData = {
      dashboardStats,
      rebelsRanking,
      securityStatus,
      chartData,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Generated random data successfully")

    return NextResponse.json({
      success: true,
      message: "Random data generated successfully",
      data: generatedData,
    })
  } catch (error) {
    console.error("[v0] Error generating random data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    if (!generatedData) {
      // Generate data if it doesn't exist
      const generator = new RandomDataGenerator({
        allowInvalidValues: true,
        invalidValueChance: 0.15,
      })

      generatedData = {
        dashboardStats: generator.generateDashboardStats(),
        rebelsRanking: generator.generateRebelsRanking(),
        securityStatus: generator.generateSecurityStatus(),
        chartData: generator.generateChartData(),
        timestamp: new Date().toISOString(),
      }
    }

    return NextResponse.json({
      success: true,
      data: generatedData,
    })
  } catch (error) {
    console.error("[v0] Error reading data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
