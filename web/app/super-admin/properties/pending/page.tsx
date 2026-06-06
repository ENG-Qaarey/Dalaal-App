"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Eye, Clock } from "lucide-react";

const pending = [
  { id: 1, title: "Apartment in Hodan District", owner: "Axmed Cali", city: "Mogadishu", type: "Apartment", price: "$450/mo", submitted: "Jun 1, 2026", images: 6 },
  { id: 2, title: "Commercial Space in Hargeisa", owner: "Faadumo Xasan", city: "Hargeisa", type: "Commercial", price: "$1,200/mo", submitted: "Jun 1, 2026", images: 4 },
  { id: 3, title: "Villa in Wadajir", owner: "Mahad Ibrahim", city: "Mogadishu", type: "Villa", price: "$2,500/mo", submitted: "May 31, 2026", images: 9 },
  { id: 4, title: "Shop in Bosaso Central Market", owner: "Sahra Yuusuf", city: "Bosaso", type: "Commercial", price: "$600/mo", submitted: "May 31, 2026", images: 3 },
  { id: 5, title: "House in Kismayo", owner: "Cabdi Warsame", city: "Kismayo", type: "House", price: "$350/mo", submitted: "May 30, 2026", images: 5 },
];

const typeColors: Record<string, string> = {
  Apartment: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  Commercial: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  Villa: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  House: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
};

export default function PropertyPendingPage() {
  const [items, setItems] = useState(pending.map(p => ({ ...p, status: "Pending" as string })));
  const [search, setSearch] = useState("");

  const approve = (id: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, status: "Approved" } : p));
  const reject = (id: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, status: "Rejected" } : p));

  const filtered = items.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve or reject new property listings.</p>
      </div>

      {/* Stats row */}
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
        <input type="text" placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="px-5 py-3 font-medium text-zinc-500">Listing</th>
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
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.owner} · {p.city} · {p.images} photos</div>
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
                    <button title="View" className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Eye className="w-4 h-4 text-zinc-500" /></button>
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
