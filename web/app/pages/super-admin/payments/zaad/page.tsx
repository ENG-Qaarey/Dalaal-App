"use client";

import * as React from "react";
import { useState } from "react";
import { Search, Download, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

const zaadTransactions = [
  { id: "ZAD-0041", user: "Cabdi Warsame", phone: "+252 63 111 2233", item: "Property deposit – Hargeisa Villa", amount: "$720", fee: "$7.20", status: "Completed", date: "Jun 2, 2026 · 11:00 AM" },
  { id: "ZAD-0040", user: "Lul Maxamed", phone: "+252 63 998 7766", item: "Escrow – Commercial Plot", amount: "$1,800", fee: "$18.00", status: "Completed", date: "Jun 2, 2026 · 9:45 AM" },
  { id: "ZAD-0039", user: "Xasan Axmed", phone: "+252 63 444 0011", item: "Vehicle rental – Nissan Patrol", amount: "$280", fee: "$2.80", status: "Pending", date: "Jun 1, 2026 · 4:00 PM" },
  { id: "ZAD-0038", user: "Hodan Ali", phone: "+252 63 333 5566", item: "Property deposit – Apartment", amount: "$450", fee: "$4.50", status: "Failed", date: "Jun 1, 2026 · 1:30 PM" },
  { id: "ZAD-0037", user: "Amina Farah", phone: "+252 63 222 7788", item: "Escrow release – Land", amount: "$3,200", fee: "$32.00", status: "Completed", date: "May 31, 2026 · 10:00 AM" },
  { id: "ZAD-0036", user: "Omar Jama", phone: "+252 63 777 1234", item: "Vehicle rental – Hiace Van", amount: "$340", fee: "$3.40", status: "Completed", date: "May 30, 2026 · 8:30 AM" },
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

export default function ZaadPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = zaadTransactions.filter(t => {
    const matchSearch = t.user.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const total = zaadTransactions.filter(t => t.status === "Completed").reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zaad Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">All payments processed via Telesom Zaad mobile money.</p>
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
          { label: "Completed", value: zaadTransactions.filter(t => t.status === "Completed").length, color: "text-emerald-600" },
          { label: "Pending", value: zaadTransactions.filter(t => t.status === "Pending").length, color: "text-amber-600" },
          { label: "Failed", value: zaadTransactions.filter(t => t.status === "Failed").length, color: "text-red-500" },
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
