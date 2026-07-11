"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Eye, Car } from "lucide-react";

const vehicles = [
  { id: 1, make: "Toyota Land Cruiser", owner: "Mahad Ibrahim", city: "Mogadishu", type: "SUV", price: "$120/day", status: "Active", year: 2021, seats: 7 },
  { id: 2, make: "Toyota Hiace (Minibus)", owner: "Axmed Cali", city: "Mogadishu", type: "Van", price: "$80/day", status: "Active", year: 2019, seats: 14 },
  { id: 3, make: "Nissan Patrol", owner: "Nasteho Ahmed", city: "Hargeisa", type: "SUV", price: "$100/day", status: "Pending", year: 2020, seats: 5 },
  { id: 4, make: "Kia Sportage", owner: "Faadumo Xasan", city: "Bosaso", type: "SUV", price: "$75/day", status: "Active", year: 2022, seats: 5 },
  { id: 5, make: "Toyota Corolla", owner: "Hodan Nuur", city: "Mogadishu", type: "Sedan", price: "$45/day", status: "Pending", year: 2018, seats: 5 },
  { id: 6, make: "Isuzu Truck", owner: "Cabdullahi Muuse", city: "Kismayo", type: "Truck", price: "$150/day", status: "Rejected", year: 2017, seats: 2 },
  { id: 7, make: "Toyota Prado", owner: "Cali Dheere", city: "Mogadishu", type: "SUV", price: "$110/day", status: "Active", year: 2023, seats: 7 },
  { id: 8, make: "Honda Accord", owner: "Sahra Warsame", city: "Hargeisa", type: "Sedan", price: "$55/day", status: "Active", year: 2020, seats: 5 },
];

const statusColor: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const typeColor: Record<string, string> = {
  SUV: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  Van: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  Sedan: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
  Truck: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
};

export default function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = vehicles.filter((v) => {
    const match = v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.owner.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase());
    const filt = filter === "All" || v.status === filter || v.type === filter;
    return match && filt;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
        <p className="text-muted-foreground text-sm mt-1">
          All vehicle rental listings — approve, reject, or remove
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Vehicles", value: vehicles.length },
          { label: "Active", value: vehicles.filter(v => v.status === "Active").length },
          { label: "Pending Review", value: vehicles.filter(v => v.status === "Pending").length },
          { label: "Rejected", value: vehicles.filter(v => v.status === "Rejected").length },
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
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Active", "Pending", "Rejected", "SUV", "Sedan", "Van", "Truck"].map((f) => (
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
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Vehicle</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Year</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">{v.make}</p>
                        <p className="text-xs text-muted-foreground">{v.city} · {v.seats} seats</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{v.owner}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[v.type] ?? ""}`}>
                      {v.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{v.year}</td>
                  <td className="px-4 py-3 font-medium">{v.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[v.status]}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                      {v.status === "Pending" && (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-muted-foreground hover:text-emerald-600"><CheckCircle className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-600"><XCircle className="w-3.5 h-3.5" /></button>
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
