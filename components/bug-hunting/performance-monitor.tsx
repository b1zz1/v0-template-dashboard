"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Zap, AlertTriangle } from "lucide-react"

interface PerformanceMetric {
  timestamp: number
  renderTime: number
  memoryUsage: number
  componentName: string
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [alerts, setAlerts] = useState<string[]>([])
  const renderStartTime = useRef<number>(0)

  useEffect(() => {
    renderStartTime.current = performance.now()
  })

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current

    if (renderTime > 16) {
      // More than one frame (60fps = 16.67ms per frame)
      setAlerts((prev) => [
        ...prev.slice(-4), // Keep only last 4 alerts
        `Slow render detected: ${renderTime.toFixed(2)}ms`,
      ])
    }

    if (isMonitoring) {
      const metric: PerformanceMetric = {
        timestamp: Date.now(),
        renderTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        componentName: "PerformanceMonitor",
      }

      setMetrics((prev) => [...prev.slice(-19), metric]) // Keep last 20 metrics
    }
  })

  const startMonitoring = () => {
    setIsMonitoring(true)
    setMetrics([])
    setAlerts([])
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
  }

  const clearData = () => {
    setMetrics([])
    setAlerts([])
  }

  const averageRenderTime = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length : 0

  const slowRenders = metrics.filter((m) => m.renderTime > 16).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Monitor
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={startMonitoring} disabled={isMonitoring} size="sm">
            <Zap className="h-4 w-4 mr-1" />
            Start Monitoring
          </Button>
          <Button onClick={stopMonitoring} disabled={!isMonitoring} size="sm" variant="outline">
            Stop
          </Button>
          <Button onClick={clearData} size="sm" variant="destructive">
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{metrics.length}</div>
            <div className="text-sm text-muted-foreground">Samples</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{averageRenderTime.toFixed(2)}ms</div>
            <div className="text-sm text-muted-foreground">Avg Render</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{slowRenders}</div>
            <div className="text-sm text-muted-foreground">Slow Renders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {metrics.length > 0 ? ((metrics[metrics.length - 1]?.memoryUsage || 0) / 1024 / 1024).toFixed(1) : "0"}
              MB
            </div>
            <div className="text-sm text-muted-foreground">Memory</div>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Performance Alerts
            </h4>
            {alerts.map((alert, index) => (
              <div key={index} className="text-sm p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                {alert}
              </div>
            ))}
          </div>
        )}

        {metrics.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Recent Metrics</h4>
            <div className="max-h-32 overflow-y-auto text-xs space-y-1">
              {metrics.slice(-5).map((metric, index) => (
                <div key={index} className="flex justify-between p-2 bg-muted rounded">
                  <span>{new Date(metric.timestamp).toLocaleTimeString()}</span>
                  <span>
                    Render: {metric.renderTime.toFixed(2)}ms
                    {metric.renderTime > 16 && (
                      <Badge className="ml-2" variant="destructive">
                        Slow
                      </Badge>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
