"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Home,
  Building2,
  Map,
  Store,
  Castle,
  Warehouse,
  Briefcase,
  Plus,
  Trash2,
} from "lucide-react"

interface Category {
  id: string
  name: string
  label: string
  icon: any
  description: string
  listingCount: number
}

const defaultCategories: Category[] = [
  {
    id: "1",
    name: "HOUSE",
    label: "House",
    icon: Home,
    description: "Single-family residential homes and detached houses",
    listingCount: 98,
  },
  {
    id: "2",
    name: "APARTMENT",
    label: "Apartment",
    icon: Building2,
    description: "Multi-unit residential apartments and condominiums",
    listingCount: 214,
  },
  {
    id: "3",
    name: "LAND",
    label: "Land",
    icon: Map,
    description: "Vacant land, plots, and development parcels",
    listingCount: 67,
  },
  {
    id: "4",
    name: "COMMERCIAL",
    label: "Commercial",
    icon: Store,
    description: "Retail spaces, offices, and commercial properties",
    listingCount: 45,
  },
  {
    id: "5",
    name: "VILLA",
    label: "Villa",
    icon: Castle,
    description: "Luxury standalone villas with premium amenities",
    listingCount: 142,
  },
  {
    id: "6",
    name: "TOWNHOUSE",
    label: "Townhouse",
    icon: Warehouse,
    description: "Multi-floor attached residential townhouses",
    listingCount: 53,
  },
  {
    id: "7",
    name: "OFFICE",
    label: "Office",
    icon: Briefcase,
    description: "Commercial office spaces and coworking units",
    listingCount: 31,
  },
]

const categoryIcons: Record<string, any> = {
  HOUSE: Home,
  APARTMENT: Building2,
  LAND: Map,
  COMMERCIAL: Store,
  VILLA: Castle,
  TOWNHOUSE: Warehouse,
  OFFICE: Briefcase,
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [newName, setNewName] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [success, setSuccess] = useState("")

  function handleAdd() {
    if (!newName.trim() || !newLabel.trim()) return
    const upperName = newName.toUpperCase().replace(/\s+/g, "_")
    const Icon = categoryIcons[upperName] || Building2
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: upperName,
      label: newLabel.trim(),
      icon: Icon,
      description: newDesc.trim() || `${newLabel.trim()} properties`,
      listingCount: 0,
    }
    setCategories((prev) => [...prev, cat])
    setNewName("")
    setNewLabel("")
    setNewDesc("")
    setSuccess(`Category "${cat.label}" added successfully!`)
    setTimeout(() => setSuccess(""), 3000)
  }

  function handleRemove(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Property Categories</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage property types and categories available on the marketplace
        </p>
      </div>

      {/* Success Toast */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          {success}
        </div>
      )}

      {/* Category Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Card key={cat.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => handleRemove(cat.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <CardTitle className="mt-2">{cat.label}</CardTitle>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                      {cat.name}
                    </code>
                  </span>
                  <span className="font-medium">{cat.listingCount} listings</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add New Category Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="w-4 h-4" />
            Add New Category
          </CardTitle>
          <CardDescription>
            Create a new property type for brokers to use when listing properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category Key</label>
              <Input
                placeholder="e.g. DUPLEX"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Display Label</label>
              <Input
                placeholder="e.g. Duplex"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Input
                placeholder="e.g. Two-unit residential buildings"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="mt-4"
            onClick={handleAdd}
            disabled={!newName.trim() || !newLabel.trim()}
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
