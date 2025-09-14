import { NextResponse } from "next/server"

export async function GET() {
  // BUG: Sometimes returns undefined data
  const shouldFail = Math.random() < 0.3 // 30% chance of failure

  if (shouldFail) {
    // BUG: Returns 200 status with error data instead of proper error status
    return NextResponse.json({
      error: "Random failure occurred",
      chartData: null,
    })
  }

  // BUG: Inconsistent data structure
  const data = {
    chartData: {
      week: [
        {
          date: "06/07",
          sales: 50000,
          spendings: 30000,
          coffee: 10000,
        },
        {
          date: "07/07",
          sales: 250000,
          spendings: 15000,
          coffee: 30000,
        },
        // BUG: Missing some properties in some objects
        {
          date: "08/07",
          sales: 200000,
          spendings: 50000,
          // coffee property missing
        },
        {
          date: "09/07",
          sales: 280000,
          spendings: 60000,
          coffee: 45000,
        },
      ],
    },
  }

  // BUG: Artificial delay that can cause timeouts
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000))

  return NextResponse.json(data)
}
