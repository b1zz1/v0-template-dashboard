import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const REBELS_FILE = path.join(DATA_DIR, "rebels-ranking.json")

export async function GET() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })

    try {
      const data = await fs.readFile(REBELS_FILE, "utf-8")
      return NextResponse.json(JSON.parse(data))
    } catch (error) {
      // Default rebels data
      const defaultRebels = [
        {
          id: 1,
          name: "KRIMSON",
          handle: "@KRIMSON",
          streak: "2 WEEKS STREAK 🔥",
          points: 148,
          avatar: "/avatars/user_krimson.png",
          featured: true,
          subtitle: "2 WEEKS STREAK 🔥",
        },
        {
          id: 2,
          name: "MATI",
          handle: "@MATI",
          streak: "",
          points: 129,
          avatar: "/avatars/user_mati.png",
        },
        {
          id: 3,
          name: "PEK",
          handle: "@MATT",
          streak: "",
          points: 108,
          avatar: "/avatars/user_pek.png",
        },
        {
          id: 4,
          name: "JOYBOY",
          handle: "@JOYBOY",
          streak: "",
          points: 64,
          avatar: "/avatars/user_joyboy.png",
        },
      ]

      await fs.writeFile(REBELS_FILE, JSON.stringify(defaultRebels, null, 2))
      return NextResponse.json(defaultRebels)
    }
  } catch (error) {
    console.error("[v0] Error reading rebels data:", error)
    return NextResponse.json({ error: "Failed to load rebels data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newRebel = await request.json()

    // Read existing data
    let rebels = []
    try {
      const data = await fs.readFile(REBELS_FILE, "utf-8")
      rebels = JSON.parse(data)
    } catch (error) {
      // File doesn't exist, start with empty array
    }

    // Add new rebel with auto-generated ID
    const newId = Math.max(...rebels.map((r: any) => r.id), 0) + 1
    const rebelWithId = { ...newRebel, id: newId }
    rebels.push(rebelWithId)

    // Write back to file
    await fs.writeFile(REBELS_FILE, JSON.stringify(rebels, null, 2))

    return NextResponse.json({ success: true, data: rebelWithId })
  } catch (error) {
    console.error("[v0] Error adding rebel:", error)
    return NextResponse.json({ error: "Failed to add rebel" }, { status: 500 })
  }
}
