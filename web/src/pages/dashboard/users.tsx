import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import { Search, MoreHorizontal, Shield } from "lucide-react"

const users = [
  { id: 1, name: "Ahmed Farah", email: "broker@dalaal.com", role: "broker", status: "Active", joined: "Jan 2026", listings: 12 },
  { id: 2, name: "Muscab Qaarey", email: "user@dalaal.com", role: "seeker", status: "Active", joined: "Jan 2026", listings: 0 },
  { id: 3, name: "Cabdi Maxamed", email: "cabdi@example.com", role: "seeker", status: "Active", joined: "Feb 2026", listings: 0 },
  { id: 4, name: "Xaliimo Axmed", email: "xaliimo@example.com", role: "broker", status: "Active", joined: "Feb 2026", listings: 8 },
  { id: 5, name: "Faarax Yuusuf", email: "faarax@example.com", role: "seeker", status: "Inactive", joined: "Mar 2026", listings: 0 },
  { id: 6, name: "Khadra Cumar", email: "khadra@example.com", role: "broker", status: "Active", joined: "Mar 2026", listings: 5 },
]

export default function UsersPage() {
  const { user, isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <Head><title>Access Denied | DalaalPrime</title></Head>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Shield className="size-16 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-sm text-muted-foreground mt-2">You don't have permission to view this page.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Head><title>Manage Users | DalaalPrime</title></Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Manage Users</h1>
            <p className="text-sm text-muted-foreground">View and manage all registered users</p>
          </div>
          <button className="rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-lg">
            + Add User
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Listings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      u.role === "admin" ? "bg-violet-500/10 text-violet-600" :
                      u.role === "broker" ? "bg-sky-500/10 text-sky-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      u.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground"}`}></span>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{u.listings}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}