"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, Download, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface Payment {
  id: string;
  amount: number;
  currency?: string;
  provider?: string;
  type?: string;
  status?: string;
  phone?: string;
  transactionId?: string;
  createdAt: string;
  user?: { email?: string; username?: string; profile?: { firstName?: string; lastName?: string } };
  listing?: { title?: string };
}

function getUserName(p: Payment) { if (p.user?.profile?.firstName) return `${p.user.profile.firstName} ${p.user.profile.lastName || ""}`.trim(); return p.user?.username || p.user?.email || "—"; }
function getItemName(p: Payment) { return p.listing?.title || p.type?.replace(/_/g, " ") || "—"; }

const statusColor: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  REFUNDED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
};

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [method, setMethod] = useState("All");

  useEffect(() => {
    async function fetchPayments() {
      try {
        const result = await api.get("/admin/payments");
        const list = Array.isArray(result) ? result : result?.payments ?? result?.data ?? [];
        setTransactions(list);
      } catch (err: any) {
        setError(err.message || "Failed to load payments");
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const filtered = transactions.filter((t) => {
    const name = getUserName(t).toLowerCase();
    const item = getItemName(t).toLowerCase();
    const match = name.includes(search.toLowerCase()) || item.includes(search.toLowerCase()) || (t.id || "").toLowerCase().includes(search.toLowerCase());
    const filt = filter === "All" || (t.status || "").toUpperCase() === filter;
    const meth = method === "All" || (t.provider || "").toUpperCase() === method;
    return match && filt && meth;
  });

  const totalSuccess = transactions.filter((t) => (t.status || "").toUpperCase() === "COMPLETED").reduce((s, t) => s + (t.amount || 0), 0);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payments API</h1>
            <p className="mt-1 text-sm text-violet-100">
              Monitor mobile money transactions across EVC Plus, Zaad, SAHAL, and cash flows.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Transactions", value: transactions.length, accent: "from-violet-500/20 to-violet-500/5" },
          { label: "Successful", value: transactions.filter(t => (t.status || "").toUpperCase() === "COMPLETED").length, accent: "from-emerald-500/20 to-emerald-500/5" },
          { label: "Failed", value: transactions.filter(t => (t.status || "").toUpperCase() === "FAILED").length, accent: "from-rose-500/20 to-rose-500/5" },
          { label: "Total Processed", value: `$${totalSuccess.toLocaleString()}`, accent: "from-sky-500/20 to-sky-500/5" },
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
            <input className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "COMPLETED", "PENDING", "FAILED", "REFUNDED"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {f === "All" ? "All" : f}
              </button>
            ))}
            <div className="h-5 w-px bg-border mx-1" />
            {["All", "EVC_PLUS", "ZAAD", "SAHAL"].map((m) => (
              <button key={m} onClick={() => setMethod(m)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${method === m ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {m === "All" ? "All" : m.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">TXN ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Item</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Method</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">No transactions found</td></tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                    <td className="px-4 py-3 font-medium">{getUserName(t)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{getItemName(t)}</td>
                    <td className="px-4 py-3 font-semibold">{t.currency || "USD"} {(t.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{(t.provider || "—").replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[(t.status || "").toUpperCase()] ?? "bg-zinc-100 text-zinc-600"}`}>
                        {(t.status || "—").replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}</td>
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
