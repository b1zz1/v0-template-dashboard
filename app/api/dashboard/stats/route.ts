import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const STATS_FILE = path.join(DATA_DIR, "dashboard-stats.json")

export async function GET() {
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Try to read existing data
    try {
      const data = await fs.readFile(STATS_FILE, "utf-8")
      return NextResponse.json(JSON.parse(data))
    } catch (error) {
      // If file doesn't exist, create it with default data
      const defaultStats = [
        {
          label: "ISSUES COMPLETED",
          value: "49%",
          description: "WEEKLY SCOPE",
          intent: "positive",
          icon: "gear",
          direction: "up",
        },
        {
          label: "MINUTES LOST",
          value: "642'",
          description: "IN MEETINGS AND RABBIT HOLES",
          intent: "negative",
          icon: "proccesor",
          direction: "down",
        },
        {
          label: "ACCIDENTS",
          value: "0",
          description: "THE CLIENT ALWAYS IS RIGHT",
          intent: "neutral",
          icon: "boom",
          tag: "4 weeks 🔥",
        },
      ]

      await fs.writeFile(STATS_FILE, JSON.stringify(defaultStats, null, 2))
      return NextResponse.json(defaultStats)
    }
  } catch (error) {
    console.error("[v0] Error reading dashboard stats:", error)
    return NextResponse.json({ error: "Failed to load dashboard stats" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newStats = await request.json()

    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Write new stats to file
    await fs.writeFile(STATS_FILE, JSON.stringify(newStats, null, 2))

    return NextResponse.json({ success: true, data: newStats })
  } catch (error) {
    console.error("[v0] Error updating dashboard stats:", error)
    return NextResponse.json({ error: "Failed to update dashboard stats" }, { status: 500 })
  }
}
