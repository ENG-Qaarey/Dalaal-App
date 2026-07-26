"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Eye, MapPin, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface Property {
  id: string;
  title?: string;
  listing?: { title?: string; city?: string; price?: number; currency?: string; status?: string; createdAt?: string; type?: string };
  city?: string;
  price?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
  propertyType?: string;
  user?: { email?: string; username?: string; profile?: { firstName?: string; lastName?: string } };
  owner?: string;
}

function getListingTitle(p: Property) {
  return p.title || p.listing?.title || "Untitled";
}

function getListingCity(p: Property) {
  return p.city || p.listing?.city || "—";
}

function getListingPrice(p: Property) {
  const price = p.price || p.listing?.price;
  const currency = p.currency || p.listing?.currency || "USD";
  if (!price) return "—";
  return `${currency} ${price.toLocaleString()}`;
}

function getListingStatus(p: Property) {
  return (p.status || p.listing?.status || "PENDING_REVIEW").toUpperCase();
}

function getListingType(p: Property) {
  return p.propertyType || p.listing?.type || "PROPERTY";
}

function getOwnerName(p: Property) {
  if (p.owner) return p.owner;
  if (p.user?.profile?.firstName) return `${p.user.profile.firstName} ${p.user.profile.lastName || ""}`.trim();
  return p.user?.username || p.user?.email || "—";
}

const statusColor: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  PENDING_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  FEATURED: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchProperties() {
      try {
        const result = await api.get("/admin/properties");
        const list = Array.isArray(result) ? result : result?.properties ?? result?.data ?? [];
        setProperties(list);
      } catch (err: any) {
        setError(err.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const filtered = properties.filter((p) => {
    const title = getListingTitle(p).toLowerCase();
    const city = getListingCity(p).toLowerCase();
    const owner = getOwnerName(p).toLowerCase();
    const match = title.includes(search.toLowerCase()) || city.includes(search.toLowerCase()) || owner.includes(search.toLowerCase());
    const status = getListingStatus(p);
    const filt = filter === "All" || status === filter;
    return match && filt;
  });

  const totalCount = properties.length;
  const activeCount = properties.filter(p => getListingStatus(p) === "ACTIVE").length;
  const pendingCount = properties.filter(p => getListingStatus(p) === "PENDING_REVIEW").length;
  const rejectedCount = properties.filter(p => getListingStatus(p) === "REJECTED").length;

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
      <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="mt-1 text-sm text-emerald-50">
            Review, approve, reject, and manage all property listings from one place.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Listings", value: totalCount, accent: "from-emerald-500/20 to-emerald-500/5" },
          { label: "Active", value: activeCount, accent: "from-sky-500/20 to-sky-500/5" },
          { label: "Pending Review", value: pendingCount, accent: "from-amber-500/20 to-amber-500/5" },
          { label: "Rejected", value: rejectedCount, accent: "from-rose-500/20 to-rose-500/5" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-border bg-gradient-to-br ${s.accent} p-4 shadow-sm`}>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
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
            {["All", "ACTIVE", "PENDING_REVIEW", "REJECTED"].map((f) => (
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No properties found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium">{getListingTitle(p)}</p>
                          <p className="text-xs text-muted-foreground">{getListingCity(p)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{getOwnerName(p)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                        {getListingType(p)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{getListingPrice(p)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[getListingStatus(p)] ?? ""}`}>
                        {getListingStatus(p).replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {getListingStatus(p) === "PENDING_REVIEW" && (
                          <>
                            <button className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-muted-foreground hover:text-emerald-600" title="Approve">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-600" title="Reject">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
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
