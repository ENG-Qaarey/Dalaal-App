"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Eye, Clock } from "lucide-react";

const pending = [
  { id: 1, make: "Toyota Land Cruiser", owner: "Axmed Cali", city: "Mogadishu", type: "SUV", price: "$120/day", submitted: "Jun 1, 2026" },
  { id: 2, make: "Toyota Hiace Van", owner: "Faadumo Xasan", city: "Hargeisa", type: "Van", price: "$85/day", submitted: "Jun 1, 2026" },
  { id: 3, make: "Nissan Patrol", owner: "Mahad Ibrahim", city: "Bosaso", type: "SUV", price: "$140/day", submitted: "May 31, 2026" },
  { id: 4, make: "Toyota Corolla", owner: "Sahra Yuusuf", city: "Kismayo", type: "Sedan", price: "$55/day", submitted: "May 31, 2026" },
  { id: 5, make: "Isuzu Truck", owner: "Cabdi Warsame", city: "Mogadishu", type: "Truck", price: "$200/day", submitted: "May 30, 2026" },
];

const typeColors: Record<string, string> = {
  SUV: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  Van: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  Sedan: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  Truck: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
};

export default function VehiclePendingPage() {
  const [items, setItems] = useState(pending.map(p => ({ ...p, status: "Pending" as string })));
  const [search, setSearch] = useState("");

  const approve = (id: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, status: "Approved" } : p));
  const reject = (id: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, status: "Rejected" } : p));

  const filtered = items.filter(p =>
    p.make.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve or reject new vehicle listings.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: items.filter(i => i.status === "Pending").length, icon: Clock, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40" },
          { label: "Approved", value: items.filter(i => i.status === "Approved").length, icon: CheckCircle, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Rejected", value: items.filter(i => i.status === "Rejected").length, icon: XCircle, color: "text-red-500 bg-red-50 dark:bg-red-950/40" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border bg-white dark:bg-zinc-950 p-4 shadow-sm flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input type="text" placeholder="Search vehicles..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="px-5 py-3 font-medium text-zinc-500">Vehicle</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Type</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Price</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Submitted</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Status</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{p.make}</div>
                  <div className="text-xs text-muted-foreground">{p.owner} · {p.city}</div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[p.type]}`}>{p.type}</span>
                </td>
                <td className="px-5 py-3.5 font-semibold text-sky-600">{p.price}</td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.submitted}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium ${p.status === "Approved" ? "text-emerald-600" : p.status === "Rejected" ? "text-red-500" : "text-amber-600"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Eye className="w-4 h-4 text-zinc-500" /></button>
                    {p.status === "Pending" && (<>
                      <button onClick={() => approve(p.id)} className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-md transition-colors"><CheckCircle className="w-4 h-4 text-emerald-600" /></button>
                      <button onClick={() => reject(p.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"><XCircle className="w-4 h-4 text-red-500" /></button>
                    </>)}
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
