"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Eye, Clock, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface PendingListing {
  id: string;
  title?: string;
  listing?: { title?: string; city?: string; price?: number; currency?: string; status?: string; createdAt?: string };
  city?: string;
  price?: number;
  currency?: string;
  propertyType?: string;
  createdAt?: string;
  user?: { email?: string; username?: string; profile?: { firstName?: string; lastName?: string } };
  _count?: { images?: number };
}

function getTitle(p: PendingListing) { return p.title || p.listing?.title || "Untitled"; }
function getCity(p: PendingListing) { return p.city || p.listing?.city || "—"; }
function getPrice(p: PendingListing) { const price = p.price || p.listing?.price; const cur = p.currency || p.listing?.currency || "USD"; return price ? `${cur} ${price.toLocaleString()}` : "—"; }
function getOwner(p: PendingListing) { if (p.user?.profile?.firstName) return `${p.user.profile.firstName} ${p.user.profile.lastName || ""}`.trim(); return p.user?.username || p.user?.email || "—"; }

const typeColors: Record<string, string> = {
  APARTMENT: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  COMMERCIAL: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  VILLA: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  HOUSE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  LAND: "bg-lime-100 text-lime-700 dark:bg-lime-950/60 dark:text-lime-300",
};

export default function PropertyPendingPage() {
  const [items, setItems] = useState<(PendingListing & { localStatus?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPending() {
      try {
        const result = await api.get("/admin/pending-listings");
        const list = Array.isArray(result) ? result : result?.listings ?? result?.data ?? [];
        setItems(list);
      } catch (err: any) {
        setError(err.message || "Failed to load pending listings");
      } finally {
        setLoading(false);
      }
    }
    fetchPending();
  }, []);

  const approve = (id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, localStatus: "Approved" } : p));
    api.post(`/admin/listings/${id}/approve`).catch(() => {});
  };

  const reject = (id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, localStatus: "Rejected" } : p));
    api.post(`/admin/listings/${id}/reject`, { reason: "Rejected by admin" }).catch(() => {});
  };

  const filtered = items.filter(p =>
    getTitle(p).toLowerCase().includes(search.toLowerCase()) ||
    getCity(p).toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = items.filter(i => !i.localStatus && i.listing?.status !== "APPROVED").length;
  const approvedCount = items.filter(i => i.localStatus === "Approved" || i.listing?.status === "APPROVED").length;
  const rejectedCount = items.filter(i => i.localStatus === "Rejected").length;

  if (loading) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve or reject new property listings.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40" },
          { label: "Approved", value: approvedCount, icon: CheckCircle, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Rejected", value: rejectedCount, icon: XCircle, color: "text-red-500 bg-red-50 dark:bg-red-950/40" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border bg-white dark:bg-zinc-950 p-4 shadow-sm flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}><Icon className="w-4 h-4" /></div>
              <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
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
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">No pending listings</td></tr>
            ) : (
              filtered.map(p => {
                const status = p.localStatus || "Pending";
                return (
                  <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{getTitle(p)}</div>
                      <div className="text-xs text-muted-foreground">{getOwner(p)} · {getCity(p)}{p._count?.images ? ` · ${p._count.images} photos` : ""}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[(p.propertyType || "").toUpperCase()] ?? "bg-zinc-100 text-zinc-600"}`}>{p.propertyType || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-sky-600">{getPrice(p)}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium ${status === "Approved" ? "text-emerald-600" : status === "Rejected" ? "text-red-500" : "text-amber-600"}`}>{status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button title="View" className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Eye className="w-4 h-4 text-zinc-500" /></button>
                        {status === "Pending" && (<>
                          <button onClick={() => approve(p.id)} className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-md transition-colors"><CheckCircle className="w-4 h-4 text-emerald-600" /></button>
                          <button onClick={() => reject(p.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"><XCircle className="w-4 h-4 text-red-500" /></button>
                        </>)}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
