"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  Car,
  LayoutGrid,
  List,
  MapPin,
  Heart,
  TrendingUp,
  MoreVertical,
} from "lucide-react";
import { adminService } from "@/lib/api";

const statusColors: Record<string, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  PENDING_REVIEW:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  DRAFT: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  FEATURED: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  PENDING_REVIEW: "Pending Review",
  DRAFT: "Draft",
  REJECTED: "Rejected",
  FEATURED: "Featured",
};

const formatPrice = (price: number, currency?: string) => {
  const sym = currency === "SOS" ? "Sh" : "$";
  return `${sym}${Number(price).toLocaleString()}`;
};

export default function AdminVehicles() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAllListings({ type: "VEHICLE", limit: "100" });
      setListings(Array.isArray(data) ? data : data?.listings ?? data?.data ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    const close = () => setMenuId(null);
    if (menuId) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuId]);

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      setListings((prev) => prev.filter((l) => l.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = listings.filter((l) => {
    const matchesSearch =
      !search ||
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = listings.reduce(
    (acc: Record<string, number>, l: any) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {listings.length} total vehicle{listings.length !== 1 ? "s" : ""} across
            all brokers
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 border border-border px-4 py-2 rounded-[10px] text-sm font-semibold text-muted-foreground">
          <Car className="w-4 h-4" /> {listings.length} Total
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "ACTIVE", "PENDING_REVIEW", "DRAFT", "REJECTED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
              }`}
            >
              {status === "ALL" ? "All" : statusLabels[status] || status}
              <span className="ml-1.5 text-[10px] opacity-80">
                (
                {status === "ALL" ? listings.length : statusCounts[status] || 0}
                )
              </span>
            </button>
          ),
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-[10px] transition-colors ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-950/40"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-[10px] transition-colors ${
              viewMode === "table"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-950/40"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border rounded-[10px] overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                  <div className="h-6 w-1/3 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-[10px] animate-pulse" />
            ))}
          </div>
        )
      ) : error ? (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-1">Failed to load vehicles</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={fetchListings}
            className="px-4 py-2 bg-blue-600 text-white rounded-[10px] text-sm font-semibold hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="font-bold text-lg mb-1">
            {listings.length === 0 ? "No vehicles yet" : "No results found"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {listings.length === 0
              ? "Vehicles will appear here once brokers create listings."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ========== GRID VIEW ========== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((l) => {
            const img = l.featuredImage || l.images?.[0]?.url;
            return (
              <div
                key={l.id}
                className="bg-card border border-border rounded-[10px] overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={l.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-12 h-12 text-blue-300 dark:text-blue-700" />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-[10px] text-[10px] font-bold backdrop-blur-sm ${statusColors[l.status] || statusColors.DRAFT}`}
                  >
                    {statusLabels[l.status] || l.status}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-[10px] bg-black/50 text-white text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
                    <Car className="w-3 h-3" /> VEHICLE
                  </span>
                  <div className="absolute bottom-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuId(menuId === l.id ? null : l.id);
                      }}
                      className="p-1.5 rounded-[10px] bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuId === l.id && (
                      <div className="absolute bottom-full right-0 mb-1 bg-card border border-border rounded-[10px] shadow-xl py-1 min-w-[140px] z-10">
                        <button
                          onClick={() => {
                            setDeleteId(l.id);
                            setMenuId(null);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-colors w-full text-left"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {l.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      {l.city}
                      {l.district ? `, ${l.district}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                      {formatPrice(l.price, l.currency)}
                    </span>
                    {l.priceNegotiable && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md">
                        Negotiable
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {l.viewCount ?? 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {l.favoriteCount ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {l.inquiryCount ?? 0}
                    </span>
                  </div>

                  {/* Vehicle Details */}
                  {l.vehicle && (
                    <div className="flex flex-wrap gap-1.5">
                      {l.vehicle.make && (
                        <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                          {l.vehicle.make}
                        </span>
                      )}
                      {l.vehicle.year && (
                        <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                          {l.vehicle.year}
                        </span>
                      )}
                      {l.vehicle.fuelType && (
                        <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                          {l.vehicle.fuelType}
                        </span>
                      )}
                      {l.vehicle.transmission && (
                        <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                          {l.vehicle.transmission}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Broker */}
                  <div className="pt-2 flex items-center justify-between text-xs font-semibold border-t border-border">
                    <span className="text-muted-foreground">
                      {l.user?.profile
                        ? [l.user.profile.firstName, l.user.profile.lastName].filter(Boolean).join(" ") || l.user?.email
                        : l.user?.email || "Unknown"}
                    </span>
                    <span className="text-blue-600">View Details</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========== TABLE VIEW ========== */
        <div className="bg-card border border-border rounded-[10px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground text-xs font-semibold">
                  <th className="p-4 pl-5">Listing</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Stats</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((l) => {
                  const img = l.featuredImage || l.images?.[0]?.url;
                  return (
                    <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-[10px] bg-muted overflow-hidden shrink-0">
                            {img ? (
                              <img src={img} alt={l.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm truncate max-w-[200px]">
                              {l.title}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {l.city || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-blue-600 dark:text-blue-400 text-sm">
                        {formatPrice(l.price, l.currency)}
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {l.city || "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {l.viewCount ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {l.favoriteCount ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-[10px] text-[10px] font-bold ${statusColors[l.status] || statusColors.DRAFT}`}>
                          {statusLabels[l.status] || l.status}
                        </span>
                      </td>
                      <td className="p-4 pr-5">
                        <button
                          onClick={() => setDeleteId(l.id)}
                          className="p-2 rounded-[10px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-card border rounded-[10px] p-6 shadow-2xl max-w-sm w-full mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">Delete Vehicle?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This listing will be permanently removed.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-[10px] border text-sm font-semibold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-[10px] bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
