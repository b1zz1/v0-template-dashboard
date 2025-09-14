"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, AlertTriangle, Bug } from "lucide-react"

interface BugReport {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "investigating" | "fixed" | "wontfix"
  component: string
  reportedAt: string
  fixedAt?: string
}

const KNOWN_BUGS: BugReport[] = [
  {
    id: "bug-001",
    title: "Memory Leak in MemoryLeakComponent",
    description: "setInterval not cleared, causing memory leaks and performance degradation",
    severity: "high",
    status: "open",
    component: "MemoryLeakComponent",
    reportedAt: "2024-07-10T10:00:00Z",
  },
  {
    id: "bug-002",
    title: "Race Condition in Async Operations",
    description: "Multiple async operations can overwrite each other's state updates",
    severity: "medium",
    status: "open",
    component: "RaceConditionDemo",
    reportedAt: "2024-07-10T10:15:00Z",
  },
  {
    id: "bug-003",
    title: "API Error Handling Missing",
    description: "Chart component doesn't handle API errors properly, causing crashes",
    severity: "high",
    status: "open",
    component: "BrokenChart",
    reportedAt: "2024-07-10T10:30:00Z",
  },
  {
    id: "bug-004",
    title: "Division by Zero in Chart Calculations",
    description: "calculateAverage function can return NaN when data array is empty",
    severity: "medium",
    status: "open",
    component: "BrokenChart",
    reportedAt: "2024-07-10T10:45:00Z",
  },
  {
    id: "bug-005",
    title: "Missing Confirmation Dialog",
    description: "Delete operations in RebelManager don't ask for confirmation",
    severity: "low",
    status: "open",
    component: "RebelManager",
    reportedAt: "2024-07-10T11:00:00Z",
  },
]

export default function BugTracker() {
  const [bugs, setBugs] = useState<BugReport[]>(KNOWN_BUGS)
  const [newBug, setNewBug] = useState({
    title: "",
    description: "",
    severity: "medium" as const,
    component: "",
  })
  const [filter, setFilter] = useState<"all" | "open" | "fixed">("all")

  const handleAddBug = () => {
    if (!newBug.title || !newBug.description) return

    const bug: BugReport = {
      id: `bug-${Date.now()}`,
      ...newBug,
      status: "open",
      reportedAt: new Date().toISOString(),
    }

    setBugs([...bugs, bug])
    setNewBug({ title: "", description: "", severity: "medium", component: "" })
  }

  const handleStatusChange = (bugId: string, newStatus: BugReport["status"]) => {
    setBugs(
      bugs.map((bug) =>
        bug.id === bugId
          ? {
              ...bug,
              status: newStatus,
              fixedAt: newStatus === "fixed" ? new Date().toISOString() : undefined,
            }
          : bug,
      ),
    )
  }

  const filteredBugs = bugs.filter((bug) => {
    if (filter === "all") return true
    if (filter === "open") return bug.status === "open" || bug.status === "investigating"
    if (filter === "fixed") return bug.status === "fixed"
    return true
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fixed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "open":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "investigating":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Bug className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Bug Tracker
          </CardTitle>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({bugs.length})
            </Button>
            <Button variant={filter === "open" ? "default" : "outline"} size="sm" onClick={() => setFilter("open")}>
              Open ({bugs.filter((b) => b.status === "open" || b.status === "investigating").length})
            </Button>
            <Button variant={filter === "fixed" ? "default" : "outline"} size="sm" onClick={() => setFilter("fixed")}>
              Fixed ({bugs.filter((b) => b.status === "fixed").length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Bug title"
              value={newBug.title}
              onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
            />
            <Input
              placeholder="Component name"
              value={newBug.component}
              onChange={(e) => setNewBug({ ...newBug, component: e.target.value })}
            />
          </div>
          <Textarea
            placeholder="Bug description"
            value={newBug.description}
            onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
          />
          <div className="flex gap-2 items-center">
            <select
              value={newBug.severity}
              onChange={(e) => setNewBug({ ...newBug, severity: e.target.value as any })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <Button onClick={handleAddBug} disabled={!newBug.title || !newBug.description}>
              Report Bug
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredBugs.map((bug) => (
          <Card key={bug.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(bug.status)}
                    <h3 className="font-semibold">{bug.title}</h3>
                    <Badge variant={getSeverityColor(bug.severity)}>{bug.severity}</Badge>
                    {bug.component && <Badge variant="outline">{bug.component}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{bug.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Reported: {new Date(bug.reportedAt).toLocaleString()}
                    {bug.fixedAt && <span className="ml-4">Fixed: {new Date(bug.fixedAt).toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button
                    size="sm"
                    variant={bug.status === "investigating" ? "default" : "outline"}
                    onClick={() => handleStatusChange(bug.id, "investigating")}
                  >
                    Investigating
                  </Button>
                  <Button
                    size="sm"
                    variant={bug.status === "fixed" ? "default" : "outline"}
                    onClick={() => handleStatusChange(bug.id, "fixed")}
                  >
                    Fixed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
