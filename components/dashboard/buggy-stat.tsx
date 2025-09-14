"use client"

import type React from "react"
import { useEffect, useState } from "react"
import NumberFlow from "@number-flow/react"

interface BuggyStatProps {
  label: string
  value: string
  description: string
  icon: React.ComponentType<any>
  tag?: string
  intent: "positive" | "negative" | "neutral"
  direction?: "up" | "down"
}

export default function BuggyStat({ label, value, description, icon: Icon, tag, intent, direction }: BuggyStatProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const numericValue = Number.parseInt(value.replace("%", "").replace("'", ""))

    if (numericValue > 100) {
      console.error(`[v0] Invalid value detected: ${numericValue}% - This is a bug!`)
      setHasError(true)
      return
    }

    // Bug: State update after component might be unmounted
    setTimeout(() => {
      setDisplayValue(value)
      setIsAnimating(false)
    }, Math.random() * 5000) // Random delay causes UI inconsistency
  }, [value])

  const handleClick = () => {
    try {
      const element = document.getElementById("undefined-element")
      if (element) {
        element.style.color = "red" // Will throw error if element doesn't exist
      }
    } catch (error) {
      console.error("[v0] Bug detected in handleClick:", error)
    }
  }

  // Bug: Conditional rendering that can cause hydration mismatch
  if (typeof window === "undefined") {
    return <div>Loading...</div> // Different content on server vs client
  }

  return (
    <div
      className={`bg-card rounded-lg p-6 border border-border hover:bg-accent/50 transition-colors cursor-pointer ${
        hasError ? "border-red-500 bg-red-50 dark:bg-red-950/20" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-muted">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-muted-foreground tracking-wider">{label}</span>
        </div>

        {direction && (
          <div
            className={`flex items-center gap-1 ${
              intent === "positive"
                ? "text-green-500"
                : intent === "negative"
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {/* Bug: Wrong arrow direction logic */}
            <span className="text-xs">{direction === "up" ? "↓" : "↑"}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          {hasError ? (
            <span className="text-2xl font-bold text-red-500">ERROR: {displayValue}</span>
          ) : (
            <NumberFlow
              value={displayValue}
              className="text-2xl font-bold text-foreground"
              format={{ notation: "compact" }}
            />
          )}
          {tag && (
            <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 font-medium">{tag}</span>
          )}
        </div>

        <p className="text-xs text-muted-foreground tracking-wider">{description}</p>
        {hasError && <p className="text-xs text-red-500">🐛 Bug detected: Invalid percentage value</p>}
      </div>

      {/* Bug: Animation that never stops */}
      {isAnimating && <div className="absolute inset-0 bg-blue-500/20 animate-pulse pointer-events-none" />}
    </div>
  )
}
