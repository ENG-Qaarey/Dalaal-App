"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  FileText,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Home,
  Car,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

// --- Data ---

const monthlyRevenueData = [
  { month: "Jan", revenue: 24400, target: 20000 },
  { month: "Feb", revenue: 31200, target: 25000 },
  { month: "Mar", revenue: 27800, target: 28000 },
  { month: "Apr", revenue: 40100, target: 32000 },
  { month: "May", revenue: 36900, target: 35000 },
  { month: "Jun", revenue: 51600, target: 40000 },
];

const listingApprovalData = [
  { month: "Jan", approved: 112, rejected: 18 },
  { month: "Feb", approved: 143, rejected: 24 },
  { month: "Mar", approved: 128, rejected: 19 },
  { month: "Apr", approved: 167, rejected: 31 },
  { month: "May", approved: 155, rejected: 22 },
  { month: "Jun", approved: 198, rejected: 28 },
];

const reports = [
  {
    id: "RPT-001",
    title: "Monthly Revenue Summary",
    type: "Financial",
    status: "Ready",
    generated: "Jun 1, 2026",
    size: "1.2 MB",
  },
  {
    id: "RPT-002",
    title: "User Growth Report",
    type: "Users",
    status: "Ready",
    generated: "Jun 1, 2026",
    size: "870 KB",
  },
  {
    id: "RPT-003",
    title: "Property Listings Audit",
    type: "Properties",
    status: "Ready",
    generated: "May 31, 2026",
    size: "2.4 MB",
  },
  {
    id: "RPT-004",
    title: "Vehicle Rentals Overview",
    type: "Vehicles",
    status: "Processing",
    generated: "Jun 2, 2026",
    size: "—",
  },
  {
    id: "RPT-005",
    title: "Escrow Transactions Ledger",
    type: "Financial",
    status: "Ready",
    generated: "May 30, 2026",
    size: "3.1 MB",
  },
  {
    id: "RPT-006",
    title: "Payment Gateway Reconciliation",
    type: "Financial",
    status: "Failed",
    generated: "Jun 2, 2026",
    size: "—",
  },
  {
    id: "RPT-007",
    title: "Broker Performance Report",
    type: "Users",
    status: "Ready",
    generated: "May 28, 2026",
    size: "1.8 MB",
  },
  {
    id: "RPT-008",
    title: "Platform Activity Logs Export",
    type: "System",
    status: "Ready",
    generated: "Jun 2, 2026",
    size: "5.6 MB",
  },
];

const summaryStats = [
  {
    label: "Total Revenue (Jun)",
    value: "$51,600",
    change: "+39.8%",
    up: true,
    icon: DollarSign,
    color: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-950/40",
  },
  {
    label: "Listings Approved",
    value: "198",
    change: "+27.7%",
    up: true,
    icon: Home,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    label: "New Users",
    value: "1,340",
    change: "+12.4%",
    up: true,
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    label: "Rejected Listings",
    value: "28",
    change: "+5.1%",
    up: false,
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/40",
  },
];

const typeColors: Record<string, string> = {
  Financial: "bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300",
  Users: "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300",
  Properties: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
  Vehicles: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
  System: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-md min-w-[140px]">
        <p className="text-xs font-semibold text-zinc-500 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}:{" "}
            <span className="text-zinc-900 dark:text-zinc-100">
              {p.value.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [filterType, setFilterType] = useState("All");
  const types = ["All", "Financial", "Users", "Properties", "Vehicles", "System"];

  const filtered =
    filterType === "All" ? reports : reports.filter((r) => r.type === filterType);

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate, download and review platform-wide reports.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
          <FileText className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border bg-white dark:bg-zinc-950 p-5 shadow-sm flex items-start gap-4"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight mt-0.5">{stat.value}</p>
                <div
                  className={`flex items-center gap-1 text-xs font-medium mt-1 ${
                    stat.up ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {stat.up ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change} vs last month
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue vs Target */}
        <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <h3 className="font-semibold mb-1">Revenue vs Target</h3>
          <p className="text-xs text-muted-foreground mb-5">Monthly performance against set targets</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,161,170,0.15)" vertical={false} />
              <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                stroke="#71717a"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={{ fill: "#0ea5e9", r: 4 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#e4e4e7"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Listing Approvals */}
        <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <h3 className="font-semibold mb-1">Listing Approvals</h3>
          <p className="text-xs text-muted-foreground mb-5">Monthly approved vs rejected listings</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={listingApprovalData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,161,170,0.15)" vertical={false} />
              <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(161,161,170,0.08)" }} />
              <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} name="Approved" />
              <Bar dataKey="rejected" fill="#f87171" radius={[4, 4, 0, 0]} name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm">
        <div className="p-5 flex items-center justify-between flex-wrap gap-4 border-b">
          <div>
            <h3 className="font-semibold">Generated Reports</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              All platform reports available for download
            </p>
          </div>
          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                  filterType === t
                    ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-zinc-50/50 dark:bg-zinc-900/20">
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Report</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Type</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Generated</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Size</th>
                <th className="px-5 py-3 font-medium text-zinc-500 dark:text-zinc-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.id}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[r.type]}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        r.status === "Ready"
                          ? "text-emerald-600"
                          : r.status === "Processing"
                          ? "text-amber-600"
                          : "text-red-500"
                      }`}
                    >
                      {r.status === "Ready" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {r.status === "Processing" && <Clock className="w-3.5 h-3.5 animate-spin" />}
                      {r.status === "Failed" && <XCircle className="w-3.5 h-3.5" />}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {r.generated}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-zinc-600 dark:text-zinc-400">{r.size}</td>
                  <td className="px-5 py-3.5">
                    <button
                      disabled={r.status !== "Ready"}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                        r.status === "Ready"
                          ? "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          : "opacity-40 cursor-not-allowed text-zinc-400"
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
