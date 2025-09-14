export interface RandomDataConfig {
  allowInvalidValues?: boolean
  invalidValueChance?: number // 0-1, chance of generating invalid values
}

export class RandomDataGenerator {
  private config: RandomDataConfig

  constructor(config: RandomDataConfig = {}) {
    this.config = {
      allowInvalidValues: config.allowInvalidValues ?? true,
      invalidValueChance: config.invalidValueChance ?? 0.15, // 15% chance
    }
  }

  // Generate random percentage (can exceed 100% if invalid values allowed)
  generatePercentage(): string {
    const shouldBeInvalid = this.config.allowInvalidValues && Math.random() < this.config.invalidValueChance

    if (shouldBeInvalid) {
      // Generate invalid percentages
      const invalidValue = Math.floor(Math.random() * 300) + 101 // 101-400%
      return `${invalidValue}%`
    }

    const value = Math.floor(Math.random() * 100)
    return `${value}%`
  }

  // Generate random number with potential overflow
  generateNumber(min = 0, max = 1000): number {
    const shouldBeInvalid = this.config.allowInvalidValues && Math.random() < this.config.invalidValueChance

    if (shouldBeInvalid) {
      // Generate extremely large numbers
      return Math.floor(Math.random() * 999999) + 100000
    }

    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Generate random time value
  generateTimeValue(): string {
    const shouldBeInvalid = this.config.allowInvalidValues && Math.random() < this.config.invalidValueChance

    if (shouldBeInvalid) {
      // Generate impossible time values
      const value = Math.floor(Math.random() * 9999) + 1440 // More than 24 hours
      return `${value}'`
    }

    const value = Math.floor(Math.random() * 1440) // 0-1440 minutes (24 hours)
    return `${value}'`
  }

  // Generate dashboard stats with random values
  generateDashboardStats() {
    const stats = [
      {
        label: "ISSUES COMPLETED",
        value: this.generatePercentage(),
        description: "WEEKLY SCOPE",
        intent: Math.random() > 0.5 ? "positive" : "negative",
        icon: "gear",
        direction: Math.random() > 0.5 ? "up" : "down",
      },
      {
        label: "MINUTES LOST",
        value: this.generateTimeValue(),
        description: "IN MEETINGS AND RABBIT HOLES",
        intent: "negative",
        icon: "proccesor",
        direction: "down",
      },
      {
        label: "ACCIDENTS",
        value: this.generateNumber(0, 50).toString(),
        description: "THE CLIENT ALWAYS IS RIGHT",
        intent: "neutral",
        icon: "boom",
        tag: Math.random() > 0.3 ? `${Math.floor(Math.random() * 8) + 1} weeks 🔥` : undefined,
      },
    ]

    return stats
  }

  // Generate rebels ranking with random points
  generateRebelsRanking() {
    const rebels = [
      {
        id: 1,
        name: "KRIMSON",
        handle: "@KRIMSON",
        avatar: "/avatars/user_krimson.png",
        featured: true,
      },
      {
        id: 2,
        name: "MATI",
        handle: "@MATI",
        avatar: "/avatars/user_mati.png",
      },
      {
        id: 3,
        name: "PEK",
        handle: "@MATT", // Intentional bug: handle doesn't match name
        avatar: "/avatars/user_pek.png",
      },
      {
        id: 4,
        name: "JOYBOY",
        handle: "@JOYBOY",
        avatar: "/avatars/user_joyboy.png",
      },
    ]

    // Generate random points and sort
    const rebelsWithPoints = rebels.map((rebel) => ({
      ...rebel,
      points: this.generateNumber(50, 200),
      streak: Math.random() > 0.6 ? `${Math.floor(Math.random() * 5) + 1} WEEKS STREAK 🔥` : "",
      subtitle: Math.random() > 0.6 ? `${Math.floor(Math.random() * 5) + 1} WEEKS STREAK 🔥` : "",
    }))

    // Sort by points (but introduce occasional sorting bug)
    if (Math.random() < 0.1) {
      // 10% chance of wrong sorting
      return rebelsWithPoints // Return unsorted - intentional bug
    }

    return rebelsWithPoints.sort((a, b) => b.points - a.points)
  }

  // Generate security status with random values
  generateSecurityStatus() {
    const shouldBeInvalid = this.config.allowInvalidValues && Math.random() < this.config.invalidValueChance

    const guardBots = shouldBeInvalid
      ? `${this.generateNumber(125, 999)}/${this.generateNumber(100, 124)}` // More bots than capacity
      : `${this.generateNumber(100, 124)}/124`

    const firewall = shouldBeInvalid
      ? `${(Math.random() * 50 + 100).toFixed(1)}%` // Over 100%
      : `${(Math.random() * 10 + 90).toFixed(1)}%` // 90-100%

    const warnings = this.generateNumber(0, 50000)

    return [
      {
        title: "GUARD BOTS",
        value: guardBots,
        status: "[RUNNING...]",
        variant: shouldBeInvalid ? "warning" : "success",
      },
      {
        title: "FIREWALL",
        value: firewall,
        status: "[BLOCKED]",
        variant: shouldBeInvalid ? "warning" : "success",
      },
      {
        title: "HTML WARNINGS",
        value: warnings.toString(),
        status: "[ACCESSIBILITY]",
        variant: warnings > 20000 ? "error" : warnings > 10000 ? "warning" : "success",
      },
    ]
  }

  // Generate chart data with potential anomalies
  generateChartData() {
    const generateDataPoint = (date: string) => {
      const shouldHaveAnomaly = Math.random() < 0.1 // 10% chance of anomaly

      return {
        date,
        sales: shouldHaveAnomaly ? this.generateNumber(1000000, 9999999) : this.generateNumber(50000, 500000),
        spendings: this.generateNumber(10000, 100000),
        coffee: this.generateNumber(5000, 50000),
      }
    }

    return {
      week: [
        generateDataPoint("06/07"),
        generateDataPoint("07/07"),
        generateDataPoint("08/07"),
        generateDataPoint("09/07"),
        generateDataPoint("10/07"),
        generateDataPoint("11/07"),
        generateDataPoint("12/07"),
        generateDataPoint("13/07"),
      ],
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) =>
        generateDataPoint(month),
      ),
      year: ["2020", "2021", "2022", "2023", "2024"].map((year) => generateDataPoint(year)),
    }
  }
}
