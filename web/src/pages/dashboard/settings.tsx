import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import { Save, Bell, Moon, Globe, Shield } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <Head><title>Settings | DalaalPrime</title></Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account preferences</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                <Bell className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Configure how you receive updates</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Email notifications", desc: "Receive email updates about your listings" },
                { label: "Push notifications", desc: "Get instant alerts on your device" },
                { label: "SMS notifications", desc: "Receive text messages for urgent updates" },
                { label: "Weekly digest", desc: "Get a weekly summary of your activity" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Moon className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize the look and feel</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Light", "Dark", "System"].map((theme) => (
                <button
                  key={theme}
                  className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${theme === "System" ? "border-sky-500 bg-sky-500/10 text-sky-500" : "border-border hover:border-sky-500/50"}`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Globe className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Language & Region</h2>
                <p className="text-sm text-muted-foreground">Set your preferred language</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Language</label>
              <select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20">
                <option>English (US)</option>
                <option>Somali (Soomaali)</option>
                <option>Arabic (العربية)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                <Shield className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Privacy & Security</h2>
                <p className="text-sm text-muted-foreground">Manage your privacy settings</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Show profile to other users" },
                { label: "Allow search engines to index" },
                { label: "Two-factor authentication" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-500 peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-lg">
              <Save className="size-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}