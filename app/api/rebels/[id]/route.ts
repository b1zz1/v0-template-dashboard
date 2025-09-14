import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const REBELS_FILE = path.join(DATA_DIR, "rebels-ranking.json")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await fs.readFile(REBELS_FILE, "utf-8")
    const rebels = JSON.parse(data)
    const rebel = rebels.find((r: any) => r.id === Number.parseInt(params.id))

    if (!rebel) {
      return NextResponse.json({ error: "Rebel not found" }, { status: 404 })
    }

    return NextResponse.json(rebel)
  } catch (error) {
    console.error("[v0] Error reading rebel:", error)
    return NextResponse.json({ error: "Failed to load rebel" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedRebel = await request.json()
    const data = await fs.readFile(REBELS_FILE, "utf-8")
    const rebels = JSON.parse(data)

    const index = rebels.findIndex((r: any) => r.id === Number.parseInt(params.id))
    if (index === -1) {
      return NextResponse.json({ error: "Rebel not found" }, { status: 404 })
    }

    rebels[index] = { ...rebels[index], ...updatedRebel, id: Number.parseInt(params.id) }

    await fs.writeFile(REBELS_FILE, JSON.stringify(rebels, null, 2))

    return NextResponse.json({ success: true, data: rebels[index] })
  } catch (error) {
    console.error("[v0] Error updating rebel:", error)
    return NextResponse.json({ error: "Failed to update rebel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await fs.readFile(REBELS_FILE, "utf-8")
    const rebels = JSON.parse(data)

    const index = rebels.findIndex((r: any) => r.id === Number.parseInt(params.id))
    if (index === -1) {
      return NextResponse.json({ error: "Rebel not found" }, { status: 404 })
    }

    const deletedRebel = rebels.splice(index, 1)[0]

    await fs.writeFile(REBELS_FILE, JSON.stringify(rebels, null, 2))

    return NextResponse.json({ success: true, data: deletedRebel })
  } catch (error) {
    console.error("[v0] Error deleting rebel:", error)
    return NextResponse.json({ error: "Failed to delete rebel" }, { status: 500 })
  }
}
