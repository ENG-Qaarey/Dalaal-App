"use client"

import { useState, useEffect } from "react"
import { adminService } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Loader2, Building2, UserCheck, UserX } from "lucide-react"

interface Broker {
  id: string
  fullName?: string
  name?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  role: string
  status?: string
  isActive?: boolean
  listingsCount?: number
  createdAt: string
}

const roleStyles: Record<string, string> = {
  BROKER: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  PROPERTY_OWNER:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900",
}

function getDisplayName(b: Broker): string {
  return b.fullName || b.name || `${b.firstName || ""}`.trim() || b.email.split("@")[0]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function AdminBrokers() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchBrokers() {
      try {
        const data = await adminService.getUsers({ role: "BROKER,PROPERTY_OWNER", limit: "50" });
        setBrokers(Array.isArray(data) ? data : data?.users || data?.data || []);
      } catch (err: any) {
        console.error("Failed to fetch brokers:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBrokers();
  }, [])

  async function handleToggleStatus(broker: Broker) {
    const newStatus = broker.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await adminService.updateUserStatus(broker.id, newStatus);
      setBrokers((prev) =>
        prev.map((b) => (b.id === broker.id ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      console.error("Failed to update status:", err.message);
    }
  }

  const filtered = brokers.filter((b) => {
    if (!search) return true
    const q = search.toLowerCase()
    const name = getDisplayName(b).toLowerCase()
    return name.includes(q) || b.email.toLowerCase().includes(q) || b.role.toLowerCase().includes(q)
  })

  const activeCount = brokers.filter((b) => b.status === "ACTIVE").length

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Brokers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage brokers and property owners on the platform
        </p>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search brokers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            {brokers.length} total
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-4 h-4" />
            {activeCount} active
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Brokers Table */}
      {!loading && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left font-medium text-muted-foreground py-3 px-4">Name</th>
                    <th className="text-left font-medium text-muted-foreground py-3 px-4">Email</th>
                    <th className="text-center font-medium text-muted-foreground py-3 px-4">Role</th>
                    <th className="text-center font-medium text-muted-foreground py-3 px-4">Listings</th>
                    <th className="text-center font-medium text-muted-foreground py-3 px-4">Status</th>
                    <th className="text-center font-medium text-muted-foreground py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground">
                        No brokers found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((b) => (
                      <tr
                        key={b.id}
                        className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{getDisplayName(b)}</td>
                        <td className="py-3 px-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" />
                            {b.email}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                          >
                            {b.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {b.listingsCount ?? 0}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className="text-xs font-medium"
                          >
                            { (b.isActive ? "ACTIVE" : "INACTIVE")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            size="xs"
                            variant={b.status === "ACTIVE" ? "destructive" : "outline"}
                            onClick={() => handleToggleStatus(b)}
                          >
                            {b.status === "ACTIVE" ? (
                              <>
                                <UserX className="w-3 h-3" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3" />
                                Activate
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


