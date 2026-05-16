import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import { Save, Shield, Database, Globe, Bell, Key } from "lucide-react"

export default function SystemPage() {
  const { isAdmin } = useAuth()

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
      <Head><title>System Settings | DalaalPrime</title></Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">System Settings</h1>
          <p className="text-sm text-muted-foreground">Platform configuration and maintenance</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                <Globe className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">General Settings</h2>
                <p className="text-sm text-muted-foreground">Basic platform configuration</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Platform Name</label>
                <input
                  type="text"
                  defaultValue="DalaalPrime"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Platform Email</label>
                <input
                  type="email"
                  defaultValue="support@dalaalprime.com"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Support Phone</label>
                <input
                  type="tel"
                  defaultValue="+252 61 000 0000"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Bell className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Email Configuration</h2>
                <p className="text-sm text-muted-foreground">SMTP and notification settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">SMTP Host</label>
                <input
                  type="text"
                  defaultValue="smtp.mailgun.org"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">SMTP Port</label>
                  <input
                    type="text"
                    defaultValue="587"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">SMTP User</label>
                  <input
                    type="text"
                    defaultValue="postmaster@dalaalprime.com"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Database className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Database</h2>
                <p className="text-sm text-muted-foreground">Database connection settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Database URL</label>
                <input
                  type="text"
                  defaultValue="postgresql://localhost:5432/dalaal"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Database Status</p>
                  <p className="text-xs text-muted-foreground">Connected and healthy</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Healthy
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                <Key className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">API Keys</h2>
                <p className="text-sm text-muted-foreground">Manage API credentials</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: "Google Maps API", key: "AIzaSy•••••••••••••••••••••••" },
                { name: "Stream Chat API", key: "xxxx-xxxx-xxxx-xxxx-xxxx" },
                { name: "Email Service API", key: "mk_live_•••••••••••••••••" },
              ].map((api) => (
                <div key={api.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{api.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{api.key}</p>
                  </div>
                  <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">
                    Rotate
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted">
              Cancel
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-lg">
              <Save className="size-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}