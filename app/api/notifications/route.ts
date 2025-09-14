import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const NOTIFICATIONS_FILE = path.join(DATA_DIR, "notifications.json")

export async function GET() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })

    try {
      const data = await fs.readFile(NOTIFICATIONS_FILE, "utf-8")
      return NextResponse.json(JSON.parse(data))
    } catch (error) {
      // Default notifications
      const defaultNotifications = [
        {
          id: "notif-1",
          title: "PAYMENT RECEIVED",
          message: "Your payment to Rampant Studio has been processed successfully.",
          timestamp: "2024-07-10T13:39:00Z",
          type: "success",
          read: false,
          priority: "medium",
        },
        {
          id: "notif-2",
          title: "INTRO: JOYCO STUDIO AND V0",
          message: "About us - We're a healthcare company focused on accessibility and innovation.",
          timestamp: "2024-07-10T13:35:00Z",
          type: "info",
          read: false,
          priority: "low",
        },
      ]

      await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(defaultNotifications, null, 2))
      return NextResponse.json(defaultNotifications)
    }
  } catch (error) {
    console.error("[v0] Error reading notifications:", error)
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newNotification = await request.json()

    let notifications = []
    try {
      const data = await fs.readFile(NOTIFICATIONS_FILE, "utf-8")
      notifications = JSON.parse(data)
    } catch (error) {
      // File doesn't exist, start with empty array
    }

    // Add timestamp and ID if not provided
    const notificationWithMeta = {
      ...newNotification,
      id: newNotification.id || `notif-${Date.now()}`,
      timestamp: newNotification.timestamp || new Date().toISOString(),
      read: false,
    }

    notifications.unshift(notificationWithMeta) // Add to beginning

    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2))

    return NextResponse.json({ success: true, data: notificationWithMeta })
  } catch (error) {
    console.error("[v0] Error adding notification:", error)
    return NextResponse.json({ error: "Failed to add notification" }, { status: 500 })
  }
}
