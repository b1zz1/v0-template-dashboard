"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface BuggyOverviewProps {
  children: React.ReactNode
}

export default function BuggyOverview({ children }: BuggyOverviewProps) {
  const [renderCount, setRenderCount] = useState(0)
  const [memoryLeak, setMemoryLeak] = useState<NodeJS.Timeout[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCount((prev) => {
        console.log("[v0] Render count:", prev + 1) // Fixed stale closure by using prev
        return prev + 1
      })
    }, 5000) // Slower interval

    // Bug: Still not clearing interval properly, but storing it
    setMemoryLeak((prev) => [...prev, interval])

    const cleanup = setTimeout(() => {
      clearInterval(interval)
      setMemoryLeak((prev) => prev.filter((i) => i !== interval))
    }, 30000)

    return () => {
      clearTimeout(cleanup)
    }
  }, []) // Removed renderCount dependency to prevent infinite re-renders

  useEffect(() => {
    const element = document.getElementById("non-existent-element")
    if (element) {
      element.style.display = "none"
    } else {
      console.log("[v0] Bug: Trying to access non-existent element")
    }

    // Bug: Event listener without cleanup (but less frequent)
    const handleClick = () => {
      if (Math.random() < 0.1) {
        // Only log 10% of clicks
        console.log("[v0] Global click detected - memory leak bug!")
      }
    }

    document.addEventListener("click", handleClick)
    // Missing: return () => document.removeEventListener('click', handleClick);
  }, [])

  const buggyCalculation = () => {
    let result = 0
    for (let i = 0; i < 10000; i++) {
      // Reduced from 1,000,000
      result += Math.random()
    }
    return result.toFixed(2)
  }

  return (
    <div>
      {/* Hidden debug info that causes layout issues */}
      <div style={{ position: "absolute", top: -1000, left: -1000 }}>
        Render count: {renderCount}
        Memory leaks: {memoryLeak.length}
        Calculation: {buggyCalculation()}
      </div>
      {children}
    </div>
  )
}
