"use client";

import { useState } from "react";
import { Search, UserPlus, MoreHorizontal, ShieldCheck, Ban, Mail, Eye } from "lucide-react";

const brokers = [
  { id: 1, name: "Axmed Cali", email: "axmed@dalaal.so", phone: "+252 61 234 5678", city: "Mogadishu", listings: 24, status: "Verified", joined: "Jan 12, 2026" },
  { id: 2, name: "Faadumo Xasan", email: "faadumo@dalaal.so", phone: "+252 63 876 5432", city: "Hargeisa", listings: 18, status: "Verified", joined: "Feb 3, 2026" },
  { id: 3, name: "Mahad Ibrahim", email: "mahad@dalaal.so", phone: "+252 65 321 0987", city: "Bosaso", listings: 9, status: "Pending", joined: "Mar 19, 2026" },
  { id: 4, name: "Sahra Yuusuf", email: "sahra@dalaal.so", phone: "+252 61 555 4321", city: "Kismayo", listings: 5, status: "Suspended", joined: "Apr 5, 2026" },
  { id: 5, name: "Cabdi Warsame", email: "cabdi@dalaal.so", phone: "+252 68 111 2233", city: "Mogadishu", listings: 31, status: "Verified", joined: "Jan 28, 2026" },
  { id: 6, name: "Lul Maxamed", email: "lul@dalaal.so", phone: "+252 63 998 7766", city: "Hargeisa", listings: 12, status: "Pending", joined: "May 11, 2026" },
];

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    Verified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
    Suspended: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? "bg-zinc-100 text-zinc-700"}`}>
      {status}
    </span>
  );
};

export default function BrokersPage() {
  const [search, setSearch] = useState("");
  const filtered = brokers.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brokers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all registered brokers on the platform.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
          <UserPlus className="w-4 h-4" />
          Add Broker
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Brokers", value: brokers.length },
          { label: "Verified", value: brokers.filter(b => b.status === "Verified").length },
          { label: "Pending", value: brokers.filter(b => b.status === "Pending").length },
          { label: "Suspended", value: brokers.filter(b => b.status === "Suspended").length },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border bg-white dark:bg-zinc-950 p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search brokers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="px-5 py-3 font-medium text-zinc-500">Name</th>
              <th className="px-5 py-3 font-medium text-zinc-500">City</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Listings</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Status</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Joined</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.email}</div>
                </td>
                <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400">{b.city}</td>
                <td className="px-5 py-3.5 font-semibold text-sky-600">{b.listings}</td>
                <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
                <td className="px-5 py-3.5 text-xs text-zinc-500">{b.joined}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button title="View" className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Eye className="w-4 h-4 text-zinc-500" /></button>
                    <button title="Email" className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Mail className="w-4 h-4 text-zinc-500" /></button>
                    <button title={b.status === "Suspended" ? "Unsuspend" : "Suspend"} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"><Ban className="w-4 h-4 text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
