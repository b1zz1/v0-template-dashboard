"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function BrokenChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // BUG: Async function without proper error handling
    const fetchData = async () => {
      try {
        const response = await fetch("/api/chart-data")
        const result = await response.json()

        // BUG: Not checking if result exists or has expected structure
        setData(result.chartData.week)
        setLoading(false)
      } catch (error) {
        // BUG: Error is caught but not handled properly
        console.log("Error occurred")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // BUG: Division by zero potential
  const calculateAverage = (data: any[]) => {
    const total = data.reduce((sum, item) => sum + item.sales, 0)
    return total / data.length // Will be NaN if data.length is 0
  }

  // BUG: Accessing array without checking if it exists
  const maxSales = data.length > 0 ? Math.max(...data.map((item: any) => item.sales)) : 0

  if (loading) {
    return <div>Loading chart...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Performance (Buggy Version)</CardTitle>
        <div className="text-sm text-muted-foreground">
          {/* BUG: Potential NaN display */}
          Average: ${calculateAverage(data).toFixed(2)} | Max: ${maxSales.toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {/* BUG: Missing key prop and potential undefined color */}
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            <Line type="monotone" dataKey="spendings" stroke="#82ca9d" />
            <Line type="monotone" dataKey="coffee" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
