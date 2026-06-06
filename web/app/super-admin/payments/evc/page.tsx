"use client";

import * as React from "react";
import { useState } from "react";
import { Search, Download, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

const evcTransactions = [
  { id: "EVC-0091", user: "Axmed Cali", phone: "+252 61 234 5678", item: "Property deposit – Hodan Villa", amount: "$850", fee: "$8.50", status: "Completed", date: "Jun 2, 2026 · 10:25 AM" },
  { id: "EVC-0090", user: "Faadumo Xasan", phone: "+252 63 876 5432", item: "Vehicle rental – Land Cruiser", amount: "$420", fee: "$4.20", status: "Completed", date: "Jun 2, 2026 · 9:10 AM" },
  { id: "EVC-0089", user: "Mahad Ibrahim", phone: "+252 65 321 0987", item: "Escrow release – Commercial Space", amount: "$1,200", fee: "$12.00", status: "Pending", date: "Jun 1, 2026 · 3:45 PM" },
  { id: "EVC-0088", user: "Sahra Yuusuf", phone: "+252 61 555 4321", item: "Property deposit – Apartment", amount: "$350", fee: "$3.50", status: "Failed", date: "Jun 1, 2026 · 2:00 PM" },
  { id: "EVC-0087", user: "Cabdi Warsame", phone: "+252 68 111 2233", item: "Vehicle rental – Hiace Van", amount: "$255", fee: "$2.55", status: "Completed", date: "May 31, 2026 · 11:30 AM" },
  { id: "EVC-0086", user: "Lul Maxamed", phone: "+252 63 998 7766", item: "Escrow – Land in Hargeisa", amount: "$2,400", fee: "$24.00", status: "Completed", date: "May 31, 2026 · 9:00 AM" },
  { id: "EVC-0085", user: "Xasan Axmed", phone: "+252 61 444 0011", item: "Property deposit – House", amount: "$600", fee: "$6.00", status: "Pending", date: "May 30, 2026 · 4:15 PM" },
];

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { cls: string; icon: React.JSX.Element }> = {
    Completed: { cls: "text-emerald-600", icon: <CheckCircle className="w-3.5 h-3.5" /> },
    Pending: { cls: "text-amber-600", icon: <Clock className="w-3.5 h-3.5 animate-pulse" /> },
    Failed: { cls: "text-red-500", icon: <XCircle className="w-3.5 h-3.5" /> },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.cls}`}>
      {s.icon}{status}
    </span>
  );
};

export default function EVCPlusPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = evcTransactions.filter(t => {
    const matchSearch = t.user.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const total = evcTransactions.filter(t => t.status === "Completed").reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EVC Plus Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">All payments processed via Hormuud EVC Plus mobile money.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Volume", value: `$${total.toLocaleString()}`, color: "text-sky-600" },
          { label: "Completed", value: evcTransactions.filter(t => t.status === "Completed").length, color: "text-emerald-600" },
          { label: "Pending", value: evcTransactions.filter(t => t.status === "Pending").length, color: "text-amber-600" },
          { label: "Failed", value: evcTransactions.filter(t => t.status === "Failed").length, color: "text-red-500" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border bg-white dark:bg-zinc-950 p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input type="text" placeholder="Search by user or ID..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {["All", "Completed", "Pending", "Failed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${filter === f ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-transparent" : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="px-5 py-3 font-medium text-zinc-500">Transaction ID</th>
              <th className="px-5 py-3 font-medium text-zinc-500">User</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Item</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Amount</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Fee</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Status</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Date</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-sky-600 font-semibold">{t.id}</td>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{t.user}</div>
                  <div className="text-xs text-muted-foreground">{t.phone}</div>
                </td>
                <td className="px-5 py-3.5 text-xs text-zinc-600 dark:text-zinc-400 max-w-[180px] truncate">{t.item}</td>
                <td className="px-5 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">{t.amount}</td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.fee}</td>
                <td className="px-5 py-3.5"><StatusBadge status={t.status} /></td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.date}</td>
                <td className="px-5 py-3.5">
                  {t.status === "Failed" && (
                    <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
