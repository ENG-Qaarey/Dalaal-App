"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Eye, MapPin } from "lucide-react";

const properties = [
  { id: 1, title: "Villa in Hodan District", owner: "Faadumo Xasan", city: "Mogadishu", type: "Villa", price: "$85,000", status: "Active", date: "2025-05-10" },
  { id: 2, title: "2BR Apartment, Hamar Weyne", owner: "Mahad Ibrahim", city: "Mogadishu", type: "Apartment", price: "$450/mo", status: "Pending", date: "2025-06-01" },
  { id: 3, title: "Office Space, Makka Al-Mukarama", owner: "Nasteho Ahmed", city: "Mogadishu", type: "Commercial", price: "$1,200/mo", status: "Active", date: "2025-04-14" },
  { id: 4, title: "Land Plot, Dharkenley", owner: "Cali Dheere", city: "Mogadishu", type: "Land", price: "$12,000", status: "Pending", date: "2025-06-03" },
  { id: 5, title: "3BR House, Warta Nabadda", owner: "Axmed Cali", city: "Mogadishu", type: "House", price: "$350/mo", status: "Active", date: "2025-03-22" },
  { id: 6, title: "Shop, Hargeisa Market", owner: "Cabdullahi Muuse", city: "Hargeisa", type: "Commercial", price: "$600/mo", status: "Rejected", date: "2025-05-28" },
  { id: 7, title: "Studio Flat, Bosaso", owner: "Hodan Nuur", city: "Bosaso", type: "Apartment", price: "$200/mo", status: "Active", date: "2025-02-18" },
  { id: 8, title: "Farmland, Kismayo", owner: "Sahra Warsame", city: "Kismayo", type: "Land", price: "$7,500", status: "Pending", date: "2025-06-04" },
];

const statusColor: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const typeColor: Record<string, string> = {
  Villa: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  Apartment: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Commercial: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  Land: "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-400",
  House: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
};

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = properties.filter((p) => {
    const match = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.owner.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const filt = filter === "All" || p.status === filter || p.type === filter;
    return match && filt;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All property listings — approve, reject, or remove
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Listings", value: properties.length },
          { label: "Active", value: properties.filter(p => p.status === "Active").length },
          { label: "Pending Review", value: properties.filter(p => p.status === "Pending").length },
          { label: "Rejected", value: properties.filter(p => p.status === "Rejected").length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Active", "Pending", "Rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Property</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.owner}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[p.type] ?? ""}`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{p.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      {p.status === "Pending" && (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-muted-foreground hover:text-emerald-600" title="Approve"><CheckCircle className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-600" title="Reject"><XCircle className="w-3.5 h-3.5" /></button>
                        </>
                      )}
                    </div>
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
