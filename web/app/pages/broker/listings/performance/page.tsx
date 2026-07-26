"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { agentsService } from "@/lib/api";
import { Loader2, AlertCircle, TrendingUp, Eye, Star, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const periods = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "1 Year", value: "1y" },
];

export default function BrokerPerformance() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const data = await agentsService.getStats(period);
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load performance data");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-72 bg-muted rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border rounded-[10px] p-5 shadow-sm h-28 animate-pulse" />
          ))}
        </div>
        <div className="bg-card border rounded-[10px] p-6 shadow-sm h-80 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="font-bold text-lg">Failed to load performance</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-[10px] text-sm font-semibold">Retry</button>
        </div>
      </div>
    );
  }

  const chartData = stats?.listingBreakdown?.slice(0, 10)?.map((l: any, i: number) => ({
    name: l.title?.substring(0, 15) || `Listing ${i + 1}`,
    views: l.viewCount || 0,
    leads: l.inquiryCount || 0,
  })) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your listing performance and conversion metrics.</p>
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-colors ${
                period === p.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card border rounded-[10px] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Active Listings</span>
            <div className="p-2.5 rounded-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black">{stats?.activeListings ?? 0}</div>
          <div className="text-[11px] text-muted-foreground font-bold">
            {stats?.listings?.total ?? 0} total listings
          </div>
        </div>

        <div className="bg-card border rounded-[10px] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Views</span>
            <div className="p-2.5 rounded-[10px] bg-violet-50 dark:bg-violet-950/40 text-violet-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black">{(stats?.views?.total ?? 0).toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            {stats?.views?.changePercent != null ? `${stats.views.changePercent > 0 ? "+" : ""}${stats.views.changePercent}%` : "N/A"} vs previous period
          </div>
        </div>

        <div className="bg-card border rounded-[10px] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Favorites</span>
            <div className="p-2.5 rounded-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black">{stats?.favorites?.total ?? 0}</div>
          <div className="text-[11px] text-muted-foreground font-bold">
            {stats?.favorites?.changePercent != null ? `${stats.favorites.changePercent > 0 ? "+" : ""}${stats.favorites.changePercent}%` : "N/A"} vs previous
          </div>
        </div>

        <div className="bg-card border rounded-[10px] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Conversion Rate</span>
            <div className="p-2.5 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black">{(stats?.conversion?.rate ?? 0).toFixed(1)}%</div>
          <div className="text-[11px] text-muted-foreground font-bold">
            {stats?.totalInquiries ?? 0} total inquiries
          </div>
        </div>
      </div>

      {/* Listings Chart */}
      <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-base">Top Listings by Views</h3>
          <p className="text-xs text-muted-foreground">Your best performing listings in this period</p>
        </div>
        {chartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="views" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Views" />
                <Bar dataKey="leads" fill="#10b981" radius={[6, 6, 0, 0]} name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-sm text-muted-foreground">No listing data available</div>
        )}
      </div>

      {/* Listings Table */}
      <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base">Listing Breakdown</h3>
        {stats?.listingBreakdown?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-3 font-semibold text-muted-foreground">Title</th>
                  <th className="p-3 font-semibold text-muted-foreground">Type</th>
                  <th className="p-3 font-semibold text-muted-foreground">Status</th>
                  <th className="p-3 font-semibold text-muted-foreground">Views</th>
                  <th className="p-3 font-semibold text-muted-foreground">Leads</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.listingBreakdown.map((l: any) => (
                  <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{l.title}</td>
                    <td className="p-3 text-muted-foreground">{l.type}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        l.status === "ACTIVE"
                          ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                          : "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                      }`}>
                        {l.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground font-mono">{l.viewCount ?? 0}</td>
                    <td className="p-3 font-bold text-emerald-600">{l.inquiryCount ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No listing data available</p>
        )}
      </div>

      {/* Profile Stats */}
      {stats?.profile && (
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base">Profile Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black">{stats.profile.rating?.toFixed(1) ?? "N/A"}</div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black">{stats.profile.reviewCount ?? 0}</div>
              <div className="text-xs text-muted-foreground">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black">{stats.profile.responseRate ?? 0}%</div>
              <div className="text-xs text-muted-foreground">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black">{stats.profile.totalListings ?? 0}</div>
              <div className="text-xs text-muted-foreground">Total Listings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
