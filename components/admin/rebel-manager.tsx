"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApiData, useApiMutation } from "@/hooks/use-api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus } from "lucide-react"

interface Rebel {
  id: number
  name: string
  handle: string
  points: number
  avatar: string
  streak?: string
  featured?: boolean
}

export default function RebelManager() {
  const { data: rebels, loading, error, refetch } = useApiData<Rebel[]>("/rebels")
  const { mutate, loading: mutating } = useApiMutation()
  const [editingRebel, setEditingRebel] = useState<Rebel | null>(null)
  const [newRebel, setNewRebel] = useState({
    name: "",
    handle: "",
    points: 0,
    avatar: "/avatars/user_default.png",
  })

  const handleAddRebel = async () => {
    try {
      await mutate("/rebels", {
        method: "POST",
        body: JSON.stringify(newRebel),
      })
      setNewRebel({ name: "", handle: "", points: 0, avatar: "/avatars/user_default.png" })
      refetch()
    } catch (error) {
      console.error("[v0] Failed to add rebel:", error)
    }
  }

  const handleUpdateRebel = async (id: number, updates: Partial<Rebel>) => {
    try {
      await mutate(`/rebels/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      })
      setEditingRebel(null)
      refetch()
    } catch (error) {
      console.error("[v0] Failed to update rebel:", error)
    }
  }

  const handleDeleteRebel = async (id: number) => {
    // BUG: No confirmation dialog
    try {
      await mutate(`/rebels/${id}`, {
        method: "DELETE",
      })
      refetch()
    } catch (error) {
      console.error("[v0] Failed to delete rebel:", error)
    }
  }

  if (loading) return <div className="p-4">Loading rebels...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Rebel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Name"
              value={newRebel.name}
              onChange={(e) => setNewRebel({ ...newRebel, name: e.target.value })}
            />
            <Input
              placeholder="Handle (e.g., @USERNAME)"
              value={newRebel.handle}
              onChange={(e) => setNewRebel({ ...newRebel, handle: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Points"
              value={newRebel.points}
              onChange={(e) => setNewRebel({ ...newRebel, points: Number.parseInt(e.target.value) || 0 })}
            />
            <Input
              placeholder="Avatar URL"
              value={newRebel.avatar}
              onChange={(e) => setNewRebel({ ...newRebel, avatar: e.target.value })}
            />
          </div>
          <Button onClick={handleAddRebel} disabled={mutating || !newRebel.name}>
            {mutating ? "Adding..." : "Add Rebel"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {rebels?.map((rebel) => (
          <Card key={rebel.id}>
            <CardContent className="p-4">
              {editingRebel?.id === rebel.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={editingRebel.name}
                      onChange={(e) => setEditingRebel({ ...editingRebel, name: e.target.value })}
                    />
                    <Input
                      value={editingRebel.handle}
                      onChange={(e) => setEditingRebel({ ...editingRebel, handle: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      value={editingRebel.points}
                      onChange={(e) =>
                        setEditingRebel({ ...editingRebel, points: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                    <Input
                      value={editingRebel.avatar}
                      onChange={(e) => setEditingRebel({ ...editingRebel, avatar: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdateRebel(rebel.id, editingRebel)} disabled={mutating}>
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingRebel(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={rebel.avatar || "/placeholder.svg"} alt={rebel.name} />
                      <AvatarFallback>{rebel.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{rebel.name}</div>
                      <div className="text-sm text-muted-foreground">{rebel.handle}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{rebel.points} points</Badge>
                        {rebel.featured && <Badge variant="default">Featured</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingRebel(rebel)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRebel(rebel.id)}
                      disabled={mutating}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
