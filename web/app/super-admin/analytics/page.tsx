"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Home,
  Car,
  DollarSign,
  Eye,
  MousePointer,
  Clock,
  Globe,
} from "lucide-react";

// --- Data ---

const trafficData = [
  { month: "Jan", visitors: 4200, sessions: 3100, pageviews: 9800 },
  { month: "Feb", visitors: 6800, sessions: 5200, pageviews: 15200 },
  { month: "Mar", visitors: 5900, sessions: 4700, pageviews: 13400 },
  { month: "Apr", visitors: 8100, sessions: 6300, pageviews: 18900 },
  { month: "May", visitors: 7500, sessions: 5800, pageviews: 16700 },
  { month: "Jun", visitors: 10200, sessions: 8100, pageviews: 23500 },
];

const revenueData = [
  { month: "Jan", properties: 12400, vehicles: 4800, escrow: 7200 },
  { month: "Feb", properties: 18900, vehicles: 6100, escrow: 9800 },
  { month: "Mar", properties: 15300, vehicles: 5400, escrow: 8200 },
  { month: "Apr", properties: 22100, vehicles: 7700, escrow: 11500 },
  { month: "May", properties: 19800, vehicles: 6900, escrow: 10300 },
  { month: "Jun", properties: 27600, vehicles: 9200, escrow: 14800 },
];

const categoryData = [
  { name: "Properties", value: 45, color: "#0ea5e9" },
  { name: "Vehicles", value: 28, color: "#8b5cf6" },
  { name: "Escrow", value: 18, color: "#10b981" },
  { name: "Payments", value: 9, color: "#f59e0b" },
];

const topCitiesData = [
  { city: "Mogadishu", users: 14200, percent: 52 },
  { city: "Hargeisa", users: 6100, percent: 22 },
  { city: "Bosaso", users: 3800, percent: 14 },
  { city: "Kismayo", users: 2100, percent: 8 },
  { city: "Baidoa", users: 1100, percent: 4 },
];

const conversionData = [
  { week: "W1", rate: 2.1 },
  { week: "W2", rate: 3.4 },
  { week: "W3", rate: 2.8 },
  { week: "W4", rate: 4.2 },
  { week: "W5", rate: 3.9 },
  { week: "W6", rate: 5.1 },
];

const kpis = [
  {
    label: "Total Visitors",
    value: "42,809",
    change: "+18.2%",
    up: true,
    icon: Users,
    color: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950/40",
  },
  {
    label: "Page Views",
    value: "97,500",
    change: "+24.1%",
    up: true,
    icon: Eye,
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    label: "Avg. Session Duration",
    value: "4m 32s",
    change: "+6.4%",
    up: true,
    icon: Clock,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    label: "Bounce Rate",
    value: "34.8%",
    change: "-3.1%",
    up: false,
    icon: MousePointer,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
];

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

// --- Component ---
export default function AnalyticsPage() {
  const [trafficFilter, setTrafficFilter] = useState<"visitors" | "sessions" | "pageviews">("visitors");

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform-wide traffic, engagement, and revenue breakdown.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl border bg-white dark:bg-zinc-950 p-5 shadow-sm flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg}`}>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold tracking-tight mt-0.5">{kpi.value}</p>
                <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change} vs last month
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Traffic Overview + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic Area Chart */}
        <div className="lg:col-span-2 rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Traffic Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly visitors, sessions & page views</p>
            </div>
            <div className="flex gap-1 rounded-md border p-1 bg-zinc-50 dark:bg-zinc-900/50 text-xs font-medium">
              {(["visitors", "sessions", "pageviews"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTrafficFilter(f)}
                  className={`px-2.5 py-1 rounded-sm capitalize transition-colors ${trafficFilter === f ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"}`}
                >
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

        {/* Category Pie */}
        <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <h3 className="font-semibold mb-1">Activity by Category</h3>
          <p className="text-xs text-muted-foreground mb-4">Breakdown of platform usage</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-zinc-700 dark:text-zinc-300">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Category + Conversion Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stacked Bar Revenue */}
        <div className="lg:col-span-2 rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <div className="mb-6">
            <h3 className="font-semibold">Revenue by Category</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Monthly breakdown — Properties, Vehicles, Escrow</p>
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

        {/* Conversion Rate Line Chart */}
        <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <div className="mb-6">
            <h3 className="font-semibold">Conversion Rate</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Weekly signup conversion %</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={conversionData}>
              <XAxis dataKey="week" fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} name="Conversion" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current rate:</span>
            <span className="font-bold text-emerald-600">5.1%</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Top Cities */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
        <div className="mb-5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold">Top Cities by Users</h3>
        </div>
        <div className="space-y-4">
          {topCitiesData.map((city) => (
            <div key={city.city} className="flex items-center gap-4">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-24 shrink-0">{city.city}</span>
              <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-700"
                  style={{ width: `${city.percent}%` }}
                />
              </div>
              <span className="text-sm font-semibold w-16 text-right">{city.users.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground w-8 text-right">{city.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
