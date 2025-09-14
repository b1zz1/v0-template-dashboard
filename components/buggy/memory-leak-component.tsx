"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MemoryLeakComponent() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // BUG: Memory leak - interval not cleared
    const interval = setInterval(() => {
      setCount((prev) => prev + 1)

      // BUG: Continuously adding to array without cleanup
      setData((prev) => [
        ...prev,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          randomData: Math.random() * 1000,
        },
      ])
    }, 1000)

    // BUG: Missing cleanup function
    // return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // BUG: Event listener not removed
    const handleResize = () => {
      console.log("[v0] Window resized, data length:", data.length)
    }

    window.addEventListener("resize", handleResize)

    // BUG: Missing cleanup
    // return () => window.removeEventListener('resize', handleResize)
  }, [data.length])

  // BUG: Expensive operation on every render
  const expensiveCalculation = () => {
    let result = 0
    for (let i = 0; i < 100000; i++) {
      result += Math.random()
    }
    return result
  }

  const handleClearData = () => {
    // BUG: Only clears data but not the intervals
    setData([])
    setCount(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Leak Demo</CardTitle>
        <div className="text-sm text-muted-foreground">
          Count: {count} | Data items: {data.length}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">Expensive calculation result: {expensiveCalculation().toFixed(2)}</div>

        <div className="max-h-32 overflow-y-auto text-xs">
          {data.slice(-5).map((item) => (
            <div key={item.id}>
              {item.timestamp}: {item.randomData.toFixed(2)}
            </div>
          ))}
        </div>

        <Button onClick={handleClearData} variant="destructive">
          Clear Data (Won't Fix Memory Leaks)
        </Button>
      </CardContent>
    </Card>
  )
}
