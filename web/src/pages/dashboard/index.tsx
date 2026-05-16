import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import { Building2, MessageSquare, Eye, Heart, TrendingUp, Users, ArrowUpRight } from "lucide-react"

const stats = [
  { title: "Total Properties", value: "24", change: "+12%", icon: Building2, color: "text-sky-500", bg: "bg-sky-500/10" },
  { title: "Messages", value: "18", change: "+5%", icon: MessageSquare, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { title: "Profile Views", value: "156", change: "+23%", icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Saved by Users", value: "43", change: "+8%", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
]

const recentActivity = [
  { id: 1, user: "Cabdi Maxamed", action: "viewed your listing", property: "Luxury Villa in KM", time: "2 min ago" },
  { id: 2, user: "Xaliimo Axmed", action: "messaged you about", property: "Apartment Downtown", time: "15 min ago" },
  { id: 3, user: "Faarax Yuusuf", action: "saved", property: "Beach House", time: "1 hour ago" },
  { id: 4, user: "Khadra Cumar", action: "contacted you for", property: "Office Space", time: "3 hours ago" },
]

const quickActions = [
  { label: "Add New Property", icon: Building2, href: "/dashboard/properties/new", color: "bg-sky-500", text: "text-white" },
  { label: "View Messages", icon: MessageSquare, href: "/dashboard/messages", color: "bg-indigo-500", text: "text-white" },
  { label: "Generate Report", icon: TrendingUp, href: "/dashboard/reports", color: "bg-emerald-500", text: "text-white" },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | DalaalPrime</title>
      </Head>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Welcome back, {user?.firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening with your properties today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <stat.icon className={`size-4 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black">{stat.value}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="size-3" />
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Activity</h2>
              <a href="/dashboard/messages" className="text-xs font-semibold text-sky-500 hover:underline">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 text-sm font-bold text-sky-500">
                    {item.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{item.user}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>{" "}
                      <span className="font-medium text-sky-500">{item.property}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Quick Actions</h2>
            </div>
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg ${action.color} ${action.text}`}
                >
                  <action.icon className="size-5" />
                  {action.label}
                  <ArrowUpRight className="ml-auto size-4 opacity-50" />
                </a>
              ))}
            </div>

            {user?.role === "admin" && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Admin Links</h3>
                <div className="space-y-2">
                  <a href="/dashboard/users" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-sky-500">
                    <Users className="size-4" />
                    Manage Users
                  </a>
                  <a href="/dashboard/all-properties" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-sky-500">
                    <Building2 className="size-4" />
                    All Properties
                  </a>
                  <a href="/dashboard/system" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-sky-500">
                    <ArrowUpRight className="size-4" />
                    System Settings
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}