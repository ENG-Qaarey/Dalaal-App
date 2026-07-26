"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Eye, Car, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface Vehicle {
  id: string;
  listing?: { title?: string; city?: string; price?: number; currency?: string; status?: string; createdAt?: string };
  make?: string;
  model?: string;
  year?: number;
  vehicleType?: string;
  seats?: number;
  price?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
  city?: string;
  user?: { email?: string; username?: string; profile?: { firstName?: string; lastName?: string } };
  owner?: string;
}

function getVehicleTitle(v: Vehicle) {
  if (v.make) return `${v.make} ${v.model || ""}`.trim();
  return v.listing?.title || "Untitled Vehicle";
}

function getVehicleCity(v: Vehicle) {
  return v.city || v.listing?.city || "—";
}

function getVehiclePrice(v: Vehicle) {
  const price = v.price || v.listing?.price;
  const currency = v.currency || v.listing?.currency || "USD";
  if (!price) return "—";
  return `${currency} ${price.toLocaleString()}`;
}

function getVehicleStatus(v: Vehicle) {
  return (v.status || v.listing?.status || "PENDING_REVIEW").toUpperCase();
}

function getOwnerName(v: Vehicle) {
  if (v.owner) return v.owner;
  if (v.user?.profile?.firstName) return `${v.user.profile.firstName} ${v.user.profile.lastName || ""}`.trim();
  return v.user?.username || v.user?.email || "—";
}

const statusColor: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  PENDING_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const typeColor: Record<string, string> = {
  SUV: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  VAN: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  SEDAN: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
  TRUCK: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const result = await api.get("/admin/vehicles");
        const list = Array.isArray(result) ? result : result?.vehicles ?? result?.data ?? [];
        setVehicles(list);
      } catch (err: any) {
        setError(err.message || "Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  const filtered = vehicles.filter((v) => {
    const title = getVehicleTitle(v).toLowerCase();
    const city = getVehicleCity(v).toLowerCase();
    const owner = getOwnerName(v).toLowerCase();
    const match = title.includes(search.toLowerCase()) || city.includes(search.toLowerCase()) || owner.includes(search.toLowerCase());
    const status = getVehicleStatus(v);
    const vtype = (v.vehicleType || "").toUpperCase();
    const filt = filter === "All" || status === filter || vtype === filter;
    return match && filt;
  });

  const totalCount = vehicles.length;
  const activeCount = vehicles.filter(v => getVehicleStatus(v) === "ACTIVE").length;
  const pendingCount = vehicles.filter(v => getVehicleStatus(v) === "PENDING_REVIEW").length;
  const rejectedCount = vehicles.filter(v => getVehicleStatus(v) === "REJECTED").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

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
          { label: "Total Vehicles", value: totalCount },
          { label: "Active", value: activeCount },
          { label: "Pending Review", value: pendingCount },
          { label: "Rejected", value: rejectedCount },
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
            {["All", "ACTIVE", "PENDING_REVIEW", "REJECTED", "SUV", "SEDAN", "VAN", "TRUCK"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f === "All" ? "All" : f.replace("_", " ")}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium">{getVehicleTitle(v)}</p>
                          <p className="text-xs text-muted-foreground">{getVehicleCity(v)}{v.seats ? ` · ${v.seats} seats` : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{getOwnerName(v)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[(v.vehicleType || "").toUpperCase()] ?? "bg-zinc-100 text-zinc-600"}`}>
                        {v.vehicleType || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{v.year || "—"}</td>
                    <td className="px-4 py-3 font-medium">{getVehiclePrice(v)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[getVehicleStatus(v)] ?? ""}`}>
                        {getVehicleStatus(v).replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><Eye className="w-3.5 h-3.5" /></button>
                        {getVehicleStatus(v) === "PENDING_REVIEW" && (
                          <>
                            <button className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-muted-foreground hover:text-emerald-600"><CheckCircle className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-600"><XCircle className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
