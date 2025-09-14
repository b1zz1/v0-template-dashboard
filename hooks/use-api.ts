"use client"

import { useState, useEffect } from "react"

export function useApiData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api${endpoint}`)

        // BUG: Not checking if response is ok
        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        console.error("[v0] API fetch error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useApiMutation<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (endpoint: string, options: RequestInit = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (err) {
      console.error("[v0] API mutation error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}

// BUG: This hook has a memory leak - doesn't cleanup interval
export function useRealTimeData<T>(endpoint: string, interval = 5000) {
  const [data, setData] = useState<T | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api${endpoint}`)
        const result = await response.json()
        setData(result)
        setLastUpdated(new Date())
      } catch (error) {
        console.error("[v0] Real-time fetch error:", error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, interval)

    // BUG: Missing cleanup function
    // return () => clearInterval(intervalId)
  }, [endpoint, interval])

  return { data, lastUpdated }
}
