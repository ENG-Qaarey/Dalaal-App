"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Search, Download, RefreshCw, CheckCircle, XCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; icon: React.JSX.Element }> = {
    COMPLETED: { cls: "text-emerald-600", icon: <CheckCircle className="w-3.5 h-3.5" /> },
    PENDING: { cls: "text-amber-600", icon: <Clock className="w-3.5 h-3.5 animate-pulse" /> },
    FAILED: { cls: "text-red-500", icon: <XCircle className="w-3.5 h-3.5" /> },
  };
  const s = map[status] || map.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.cls}`}>
      {s.icon}{status}
    </span>
  );
};

export default function ZaadPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchZaad() {
      try {
        const result = await api.get("/admin/payments?provider=ZAAD");
        const list = Array.isArray(result) ? result : result?.payments ?? result?.data ?? [];
        setTransactions(list);
      } catch (err: any) {
        setError(err.message || "Failed to load Zaad transactions");
      } finally {
        setLoading(false);
      }
    }
    fetchZaad();
  }, []);

  const filtered = transactions.filter(t => {
    const user = t.user?.profile?.firstName ? `${t.user.profile.firstName} ${t.user.profile.lastName || ""}`.trim() : t.user?.username || t.user?.email || "";
    const matchSearch = user.toLowerCase().includes(search.toLowerCase()) || (t.id || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (t.status || "").toUpperCase() === filter;
    return matchSearch && matchFilter;
  });

  const total = transactions.filter(t => (t.status || "").toUpperCase() === "COMPLETED").reduce((sum, t) => sum + (t.amount || 0), 0);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zaad Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">All payments processed via Telesom Zaad mobile money.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Volume", value: `$${total.toLocaleString()}`, color: "text-sky-600" },
          { label: "Completed", value: transactions.filter(t => (t.status || "").toUpperCase() === "COMPLETED").length, color: "text-emerald-600" },
          { label: "Pending", value: transactions.filter(t => (t.status || "").toUpperCase() === "PENDING").length, color: "text-amber-600" },
          { label: "Failed", value: transactions.filter(t => (t.status || "").toUpperCase() === "FAILED").length, color: "text-red-500" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border bg-white dark:bg-zinc-950 p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="text" placeholder="Search by user or ID..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {["All", "COMPLETED", "PENDING", "FAILED"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${filter === f ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-transparent" : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="px-5 py-3 font-medium text-zinc-500">Transaction ID</th>
              <th className="px-5 py-3 font-medium text-zinc-500">User</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Amount</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Status</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">No Zaad transactions found</td></tr>
            ) : (
              filtered.map((t: any) => {
                const user = t.user?.profile?.firstName ? `${t.user.profile.firstName} ${t.user.profile.lastName || ""}`.trim() : t.user?.username || t.user?.email || "—";
                return (
                  <tr key={t.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-sky-600 font-semibold">{t.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{user}</div>
                      <div className="text-xs text-muted-foreground">{t.phone || ""}</div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">{t.currency || "USD"} {(t.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={(t.status || "PENDING").toUpperCase()} /></td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
