"use client";

import { useState, useEffect } from "react";
import { Search, Unlock, Clock, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface Escrow {
  id: string;
  amount: number;
  currency?: string;
  status?: string;
  provider?: string;
  createdAt: string;
  buyer?: { email?: string; username?: string; profile?: { firstName?: string; lastName?: string } };
  seller?: { email?: string; username?: string; profile?: { firstName?: string; lastName?: string } };
  listing?: { title?: string };
  description?: string;
  releasedAt?: string;
}

function getUserName(u: any) { if (u?.profile?.firstName) return `${u.profile.firstName} ${u.profile.lastName || ""}`.trim(); return u?.username || u?.email || "—"; }

const statusColor: Record<string, string> = {
  HELD: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  RELEASED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  DISPUTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
};

export default function EscrowPage() {
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchEscrow() {
      try {
        const result = await api.get("/admin/escrow");
        const list = Array.isArray(result) ? result : result?.escrows ?? result?.data ?? [];
        setEscrows(list);
      } catch (err: any) {
        setError(err.message || "Failed to load escrow data");
      } finally {
        setLoading(false);
      }
    }
    fetchEscrow();
  }, []);

  const filtered = escrows.filter((e) => {
    const item = (e.listing?.title || e.description || "").toLowerCase();
    const buyer = getUserName(e.buyer).toLowerCase();
    const seller = getUserName(e.seller).toLowerCase();
    const match = item.includes(search.toLowerCase()) || buyer.includes(search.toLowerCase()) || seller.includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    const status = (e.status || "").toUpperCase();
    const filt = filter === "All" || status === filter;
    return match && filt;
  });

  const totalHeld = escrows
    .filter((e) => (e.status || "").toUpperCase() === "HELD" || (e.status || "").toUpperCase() === "PENDING")
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Escrow Vault</h1>
          <p className="mt-1 text-sm text-amber-50">
            Manage all escrow-protected transactions, disputes, and release workflows.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Escrows", value: escrows.length, accent: "from-amber-500/20 to-amber-500/5" },
          { label: "Currently Held", value: escrows.filter(e => (e.status || "").toUpperCase() === "HELD" || (e.status || "").toUpperCase() === "PENDING").length, accent: "from-sky-500/20 to-sky-500/5" },
          { label: "Released", value: escrows.filter(e => (e.status || "").toUpperCase() === "RELEASED" || (e.status || "").toUpperCase() === "COMPLETED").length, accent: "from-emerald-500/20 to-emerald-500/5" },
          { label: "Disputed", value: escrows.filter(e => (e.status || "").toUpperCase() === "DISPUTED").length, accent: "from-rose-500/20 to-rose-500/5" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-border bg-gradient-to-br ${s.accent} p-4 shadow-sm`}>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Total held banner */}
      <div className="rounded-xl border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Total Value Currently In Escrow</p>
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">USD {totalHeld.toLocaleString()}</p>
        </div>
        <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400 opacity-60" />
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search escrows..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["All", "HELD", "RELEASED", "DISPUTED", "PENDING", "COMPLETED"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Item</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Buyer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Seller</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">No escrow transactions found</td></tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium max-w-[180px] truncate">{e.listing?.title || e.description || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{getUserName(e.buyer)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{getUserName(e.seller)}</td>
                    <td className="px-4 py-3 font-semibold">{e.currency || "USD"} {(e.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[(e.status || "").toUpperCase()] ?? "bg-zinc-100 text-zinc-600"}`}>
                        {(e.status || "—").replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{e.createdAt ? new Date(e.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {((e.status || "").toUpperCase() === "HELD" || (e.status || "").toUpperCase() === "PENDING") && (
                          <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 transition">
                            <Unlock className="w-3 h-3" /> Release
                          </button>
                        )}
                        {(e.status || "").toUpperCase() === "DISPUTED" && (
                          <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 transition">
                            <CheckCircle className="w-3 h-3" /> Resolve
                          </button>
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
