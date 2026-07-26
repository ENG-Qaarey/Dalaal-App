"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, Eye, MousePointer, Clock, Globe, Loader2, AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

const COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-md min-w-[140px]">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: <span className="text-zinc-900 dark:text-zinc-100">{typeof p.value === "number" && p.value > 100 ? p.value.toLocaleString() : p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trafficFilter, setTrafficFilter] = useState<"visitors" | "sessions" | "pageviews">("visitors");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const result = await api.get("/admin/analytics/overview");
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  const trafficData = data?.traffic || [];
  const revenueData = data?.revenue || [];
  const categoryData = data?.categories || [];
  const topCitiesData = data?.topCities || [];
  const conversionData = data?.conversion || [];
  const kpis = data?.kpis || [];

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform-wide traffic, engagement, and revenue breakdown.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi: any) => {
          const Icon = kpi.icon === "Users" ? Users : kpi.icon === "Eye" ? Eye : kpi.icon === "Clock" ? Clock : MousePointer;
          return (
            <div key={kpi.label} className="rounded-xl border bg-white dark:bg-zinc-950 p-5 shadow-sm flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg || "bg-sky-50 dark:bg-sky-950/40"}`}>
                <Icon className={`w-5 h-5 ${kpi.color || "text-sky-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold tracking-tight mt-0.5">{kpi.value}</p>
                {kpi.change && (
                  <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${kpi.up !== false ? "text-emerald-600" : "text-red-500"}`}>
                    {kpi.up !== false ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change} vs last month
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Traffic + Category Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Traffic Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly visitors, sessions & page views</p>
            </div>
            <div className="flex gap-1 rounded-md border p-1 bg-zinc-50 dark:bg-zinc-900/50 text-xs font-medium">
              {(["visitors", "sessions", "pageviews"] as const).map((f) => (
                <button key={f} onClick={() => setTrafficFilter(f)}
                  className={`px-2.5 py-1 rounded-sm capitalize transition-colors ${trafficFilter === f ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(14,165,233,0.2)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey={trafficFilter} stroke="#0ea5e9" strokeWidth={2} fill="url(#trafficGrad)" name={trafficFilter} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <h3 className="font-semibold mb-1">Activity by Category</h3>
          <p className="text-xs text-muted-foreground mb-4">Breakdown of platform usage</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {categoryData.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item: any, i: number) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-zinc-700 dark:text-zinc-300">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue + Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <div className="mb-6">
            <h3 className="font-semibold">Revenue by Category</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Monthly breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,161,170,0.15)" vertical={false} />
              <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(161,161,170,0.08)" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="properties" stackId="a" fill="#0ea5e9" name="Properties" radius={[0, 0, 0, 0]} />
              <Bar dataKey="vehicles" stackId="a" fill="#8b5cf6" name="Vehicles" />
              <Bar dataKey="escrow" stackId="a" fill="#10b981" name="Escrow" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <div className="mb-6">
            <h3 className="font-semibold">Conversion Rate</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Weekly signup conversion %</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={conversionData}>
              <XAxis dataKey="week" fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} fill="rgba(16,185,129,0.1)" name="Conversion" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Cities */}
      {topCitiesData.length > 0 && (
        <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <div className="mb-5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold">Top Cities by Users</h3>
          </div>
          <div className="space-y-4">
            {topCitiesData.map((city: any) => (
              <div key={city.city} className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-24 shrink-0">{city.city}</span>
                <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full bg-sky-500 transition-all duration-700" style={{ width: `${city.percent || 0}%` }} />
                </div>
                <span className="text-sm font-semibold w-16 text-right">{(city.users || 0).toLocaleString()}</span>
                <span className="text-xs text-muted-foreground w-8 text-right">{city.percent || 0}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
