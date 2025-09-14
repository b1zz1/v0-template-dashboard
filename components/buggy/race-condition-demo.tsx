"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RaceConditionDemo() {
  const [counter, setCounter] = useState(0)
  const [status, setStatus] = useState("idle")
  const [results, setResults] = useState<string[]>([])

  // BUG: Race condition - multiple async operations can interfere
  const simulateAsyncOperation = async (id: number) => {
    setStatus("loading")

    // Simulate network delay
    const delay = Math.random() * 2000 + 500
    await new Promise((resolve) => setTimeout(resolve, delay))

    // BUG: This can be overwritten by other operations
    setStatus("completed")
    setResults((prev) => [...prev, `Operation ${id} completed after ${delay.toFixed(0)}ms`])

    // BUG: Counter increment has race condition
    setCounter((prev) => prev + 1)
  }

  const handleMultipleOperations = () => {
    // BUG: Starting multiple operations simultaneously creates race conditions
    for (let i = 1; i <= 3; i++) {
      simulateAsyncOperation(i)
    }
  }

  // BUG: Unsafe state update
  const handleUnsafeIncrement = () => {
    // These will likely not work as expected due to stale closures
    setTimeout(() => setCounter(counter + 1), 100)
    setTimeout(() => setCounter(counter + 1), 200)
    setTimeout(() => setCounter(counter + 1), 300)
  }

  const resetDemo = () => {
    setCounter(0)
    setStatus("idle")
    setResults([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Race Condition Demo</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={status === "loading" ? "default" : "secondary"}>{status}</Badge>
          <span className="text-sm">Counter: {counter}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleMultipleOperations}>Start Multiple Operations</Button>
          <Button onClick={handleUnsafeIncrement} variant="outline">
            Unsafe Increment
          </Button>
          <Button onClick={resetDemo} variant="destructive">
            Reset
          </Button>
        </div>

        <div className="max-h-32 overflow-y-auto text-xs space-y-1">
          {results.map((result, index) => (
            <div key={index} className="p-2 bg-muted rounded">
              {result}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
