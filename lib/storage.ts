import fs from "fs/promises"
import path from "path"

export class JSONStorage {
  private dataDir: string

  constructor(dataDir = "data") {
    this.dataDir = path.join(process.cwd(), dataDir)
  }

  async ensureDataDir(): Promise<void> {
    await fs.mkdir(this.dataDir, { recursive: true })
  }

  async read<T>(filename: string): Promise<T | null> {
    try {
      await this.ensureDataDir()
      const filePath = path.join(this.dataDir, filename)
      const data = await fs.readFile(filePath, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      console.error(`[v0] Error reading ${filename}:`, error)
      return null
    }
  }

  async write<T>(filename: string, data: T): Promise<boolean> {
    try {
      await this.ensureDataDir()
      const filePath = path.join(this.dataDir, filename)
      await fs.writeFile(filePath, JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      console.error(`[v0] Error writing ${filename}:`, error)
      return false
    }
  }

  async append<T>(filename: string, newItem: T): Promise<T[] | null> {
    try {
      const existingData = (await this.read<T[]>(filename)) || []
      existingData.push(newItem)
      const success = await this.write(filename, existingData)
      return success ? existingData : null
    } catch (error) {
      console.error(`[v0] Error appending to ${filename}:`, error)
      return null
    }
  }

  async update<T extends { id: string | number }>(
    filename: string,
    id: string | number,
    updates: Partial<T>,
  ): Promise<T | null> {
    try {
      const existingData = (await this.read<T[]>(filename)) || []
      const index = existingData.findIndex((item) => item.id === id)

      if (index === -1) {
        return null
      }

      existingData[index] = { ...existingData[index], ...updates }
      const success = await this.write(filename, existingData)
      return success ? existingData[index] : null
    } catch (error) {
      console.error(`[v0] Error updating ${filename}:`, error)
      return null
    }
  }

  async delete<T extends { id: string | number }>(filename: string, id: string | number): Promise<T | null> {
    try {
      const existingData = (await this.read<T[]>(filename)) || []
      const index = existingData.findIndex((item) => item.id === id)

      if (index === -1) {
        return null
      }

      const deletedItem = existingData.splice(index, 1)[0]
      const success = await this.write(filename, existingData)
      return success ? deletedItem : null
    } catch (error) {
      console.error(`[v0] Error deleting from ${filename}:`, error)
      return null
    }
  }

  // Intentional bug: This method has a race condition
  async unsafeWrite<T>(filename: string, data: T): Promise<boolean> {
    // BUG: No directory check, will fail if directory doesn't exist
    const filePath = path.join(this.dataDir, filename)
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      console.error(`[v0] Unsafe write failed for ${filename}:`, error)
      return false
    }
  }
}

// Export singleton instance
export const storage = new JSONStorage()

export class BackupManager {
  private storage: JSONStorage
  private backupDir: string

  constructor() {
    this.storage = new JSONStorage()
    this.backupDir = path.join(process.cwd(), "backups")
  }

  async createBackup(): Promise<string | null> {
    try {
      await fs.mkdir(this.backupDir, { recursive: true })

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const backupPath = path.join(this.backupDir, `backup-${timestamp}.json`)

      // Read all data files
      const dashboardStats = await this.storage.read("dashboard-stats.json")
      const rebels = await this.storage.read("rebels-ranking.json")
      const notifications = await this.storage.read("notifications.json")

      const backupData = {
        timestamp: new Date().toISOString(),
        data: {
          dashboardStats,
          rebels,
          notifications,
        },
      }

      // BUG: Missing error handling for write operation
      await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2))
      return backupPath
    } catch (error) {
      console.error("[v0] Backup creation failed:", error)
      return null
    }
  }

  async restoreBackup(backupPath: string): Promise<boolean> {
    try {
      const backupData = JSON.parse(await fs.readFile(backupPath, "utf-8"))

      // BUG: No validation of backup data structure
      if (backupData.data.dashboardStats) {
        await this.storage.write("dashboard-stats.json", backupData.data.dashboardStats)
      }

      if (backupData.data.rebels) {
        await this.storage.write("rebels-ranking.json", backupData.data.rebels)
      }

      if (backupData.data.notifications) {
        await this.storage.write("notifications.json", backupData.data.notifications)
      }

      return true
    } catch (error) {
      console.error("[v0] Backup restore failed:", error)
      return false
    }
  }
}

export const backupManager = new BackupManager()
