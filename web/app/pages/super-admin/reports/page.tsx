"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  FileText, Filter, TrendingUp, TrendingDown, Home, DollarSign, Users, Calendar,
  CheckCircle2, XCircle, Clock, Loader2, AlertCircle, Download,
} from "lucide-react";
import { api, adminService } from "@/lib/api";

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
            {p.name}: <span className="text-zinc-900 dark:text-zinc-100">{p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      try {
        const result = await api.get("/admin/analytics/overview");
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  const monthlyRevenueData = data?.monthlyRevenue || [];
  const listingApprovalData = data?.listingApprovals || [];
  const summaryStats = data?.summaryStats || [];
  const types = ["All", "Financial", "Users", "Properties", "Vehicles", "System"];

  const handleExport = async () => {
    try {
      setExporting(true);
      const report = await adminService.exportSystemReport();
      const rows = [
        ["Section", "Id", "Title/Name", "Status", "Details", "Created At"],
        ...((report.users || []).map((user: any) => ["Customer", user.id, `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim() || user.email || user.username || "-", user.status || "-", user.email || user.username || "-", user.createdAt || "-"])),
        ...((report.listings || []).map((listing: any) => ["Listing", listing.id, listing.title || "-", listing.status || "-", `${listing.type || "-"} | ${listing.city || "-"} | ${listing.price ?? "-"}`, listing.createdAt || "-"])),
        ...((report.reports || []).map((item: any) => ["Report", item.id, item.listing?.title || item.reportedUser?.email || "-", item.status || "-", `${item.type || "-"} | ${item.description || "-"} | ${item.resolution || "-"}`, item.createdAt || "-"])),
        ...((report.auditLogs || []).map((item: any) => ["Audit Log", item.id, item.entityType || "-", item.action || "-", `${item.ipAddress || "-"}`, item.createdAt || "-"])),
      ];

      const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dalaal-system-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Failed to export report", err);
      alert(err.message || "Failed to export report");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate, download and review platform-wide reports.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {exporting ? "Exporting..." : "Download Report"}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryStats.map((stat: any) => {
          const Icon = stat.icon === "DollarSign" ? DollarSign : stat.icon === "Home" ? Home : stat.icon === "Users" ? Users : XCircle;
          return (
            <div key={stat.label} className="rounded-xl border bg-white dark:bg-zinc-950 p-5 shadow-sm flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.bg || "bg-sky-50 dark:bg-sky-950/40"}`}>
                <Icon className={`w-5 h-5 ${stat.color || "text-sky-500"}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight mt-0.5">{stat.value}</p>
                {stat.change && (
                  <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${stat.up !== false ? "text-emerald-600" : "text-red-500"}`}>
                    {stat.up !== false ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change} vs last month
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5">
          <h3 className="font-semibold mb-1">Revenue vs Target</h3>
          <p className="text-xs text-muted-foreground mb-5">Monthly performance against set targets</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,161,170,0.15)" vertical={false} />
              <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#71717a" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: "#0ea5e9", r: 4 }} name="Revenue" />
              <Line type="monotone" dataKey="target" stroke="#e4e4e7" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>
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

      {/* Info */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-6 text-center text-sm text-muted-foreground">
        Reports are generated from real platform data. Use the Analytics page for detailed charts.
      </div>
    </div>
  );
}
