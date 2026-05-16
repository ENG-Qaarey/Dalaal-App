import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import { BarChart3, TrendingUp, Building2, Users, Download, Calendar } from "lucide-react"

const reportStats = [
  { title: "Total Properties", value: "248", change: "+15%", icon: Building2, color: "text-sky-500", bg: "bg-sky-500/10" },
  { title: "Active Listings", value: "187", change: "+8%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Registered Users", value: "1,243", change: "+22%", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { title: "Total Inquiries", value: "3,456", change: "+18%", icon: BarChart3, color: "text-violet-500", bg: "bg-violet-500/10" },
]

const monthlyData = [
  { month: "Jan", listings: 42, inquiries: 312 },
  { month: "Feb", listings: 38, inquiries: 287 },
  { month: "Mar", listings: 51, inquiries: 398 },
  { month: "Apr", listings: 47, inquiries: 341 },
  { month: "May", listings: 55, inquiries: 421 },
  { month: "Jun", listings: 61, inquiries: 489 },
]

const topBrokers = [
  { name: "Ahmed Farah", listings: 12, views: 1245, inquiries: 89 },
  { name: "Xaliimo Axmed", listings: 8, views: 987, inquiries: 67 },
  { name: "Khadra Cumar", listings: 5, views: 654, inquiries: 43 },
]

export default function ReportsPage() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <Head><title>Access Denied | DalaalPrime</title></Head>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BarChart3 className="size-16 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-sm text-muted-foreground mt-2">You don't have permission to view this page.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Head><title>Reports | DalaalPrime</title></Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">Platform performance insights</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-lg">
            <Download className="size-4" />
            Export Report
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reportStats.map((stat) => (
            <div key={stat.title} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
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
              <h2 className="text-lg font-bold">Listings & Inquiries by Month</h2>
            </div>
            <div className="space-y-3">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-4">
                  <span className="w-10 text-sm font-medium text-muted-foreground">{data.month}</span>
                  <div className="flex-1 flex gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Listings</span>
                      <div className="h-2 flex-1 rounded-full bg-sky-500/20">
                        <div className="h-2 rounded-full bg-sky-500" style={{ width: `${(data.listings / 70) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-semibold">{data.listings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Inquiries</span>
                      <div className="h-2 flex-1 rounded-full bg-indigo-500/20">
                        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(data.inquiries / 500) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-semibold">{data.inquiries}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Top Brokers</h2>
            </div>
            <div className="space-y-4">
              {topBrokers.map((broker, i) => (
                <div key={broker.name} className="flex items-center gap-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-xs font-bold text-sky-500">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{broker.name}</p>
                    <p className="text-xs text-muted-foreground">{broker.listings} listings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{broker.inquiries} inquiries</p>
                    <p className="text-xs text-muted-foreground">{broker.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}