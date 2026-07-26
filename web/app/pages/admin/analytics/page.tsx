"use client"

import { useState, useEffect } from "react"
import { adminService } from "@/lib/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  Building2,
  Home,
  PlusCircle,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  BarChart3,
} from "lucide-react"

interface AnalyticsData {
  period: { from: string; to: string; label: string }
  users: {
    total: number
    new: number
    brokers: number
    changePercent: number
    brokerChangePercent: number
  }
  listings: {
    active: number
    new: number
    byType: Record<string, number>
    changePercent: number
  }
  escrow: {
    activeCount: number
    activeVolume: number
    periodVolume: number
    changePercent: number
  }
  payments: {
    completedVolume: number
    changePercent: number
  }
  conversion: {
    views: number
    inquiries: number
    rate: number
  }
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [period, setPeriod] = useState("30d")

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      setError("")
      try {
        const result = await adminService.getAnalyticsOverview(period)
        setData(result)
      } catch (err: any) {
        setError("Failed to load analytics. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [period])

  const metricCards = [
    {
      title: "Total Users",
      value: data?.users.total ?? 0,
      change: data?.users.changePercent,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-200 dark:border-blue-900",
      desc: "Registered across Somalia",
    },
    {
      title: "Active Listings",
      value: data?.listings.active ?? 0,
      change: data?.listings.changePercent,
      icon: Building2,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-200 dark:border-violet-900",
      desc: "Properties & vehicles listed",
    },
    {
      title: "New Listings (Period)",
      value: data?.listings.new ?? 0,
      change: data?.listings.changePercent,
      icon: PlusCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-900",
      desc: "Added in selected period",
    },
    {
      title: "Total Views",
      value: (data?.conversion.views ?? 0).toLocaleString(),
      icon: Eye,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/40",
      border: "border-orange-200 dark:border-orange-900",
      desc: "Property page impressions",
    },
  ]

  const periodOptions = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "1y", label: "1 Year" },
  ]

  const topCategories = data?.listings.byType
    ? Object.entries(data.listings.byType)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
    : []

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Market Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real estate & vehicle marketplace performance across Somalia
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          : metricCards.map((m) => (
              <Card
                key={m.title}
                className={`overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${m.border}`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {m.title}
                  </CardTitle>
                  <span className={`p-2 rounded-lg ${m.bg}`}>
                    <m.icon className={`w-4 h-4 ${m.color}`} />
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{m.value}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                    {m.change != null && (
                      <Badge variant="success" className="text-[10px] font-bold">
                        {m.change > 0 ? "+" : ""}
                        {m.change.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Time-Series Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance Trends
          </CardTitle>
          <CardDescription>
            Listing activity and user engagement over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-72 rounded-lg bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Time-series chart will render here</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Powered by Recharts — connect real data for live insights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              Top Performing Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCategories.length > 0
              ? topCategories.map(([cat, count]) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-sm font-medium">{cat}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{count} listings</span>
                    </div>
                  </div>
                ))
              : loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                : (
                    <p className="text-sm text-muted-foreground">No data available</p>
                  )}
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Period Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data ? (
              <>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <span className="text-sm text-muted-foreground">New Users</span>
                  <span className="text-sm font-medium">{data.users.new}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <span className="text-sm text-muted-foreground">Active Brokers</span>
                  <span className="text-sm font-medium">{data.users.brokers}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <span className="text-sm text-muted-foreground">Active Escrow</span>
                  <span className="text-sm font-medium">{data.escrow.activeCount}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <span className="text-sm text-muted-foreground">Escrow Volume</span>
                  <span className="text-sm font-medium">${data.escrow.activeVolume.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <span className="text-sm text-muted-foreground">Inquiries</span>
                  <span className="text-sm font-medium">{data.conversion.inquiries}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                  <span className="text-sm font-medium">{data.conversion.rate.toFixed(1)}%</span>
                </div>
              </>
            ) : loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
