"use client";

import { useState } from "react";
import { Search, RefreshCw, Download } from "lucide-react";

const transactions = [
  { id: "TXN-0091", user: "Axmed Cali", item: "Property deposit", amount: "$850", method: "EVC Plus", phone: "252612345678", status: "Success", date: "2025-06-04 09:12" },
  { id: "TXN-0090", user: "Faadumo Xasan", item: "Vehicle rental", amount: "$120", method: "Zaad", phone: "252631234567", status: "Success", date: "2025-06-04 08:40" },
  { id: "TXN-0089", user: "Mahad Ibrahim", item: "Listing fee", amount: "$25", method: "EVC Plus", phone: "252618765432", status: "Failed", date: "2025-06-03 22:15" },
  { id: "TXN-0088", user: "Hodan Nuur", item: "Escrow deposit", amount: "$12,000", method: "Zaad", phone: "252634567890", status: "Success", date: "2025-06-03 17:05" },
  { id: "TXN-0087", user: "Nasteho Ahmed", item: "Subscription plan", amount: "$49", method: "EVC Plus", phone: "252619876543", status: "Pending", date: "2025-06-03 14:30" },
  { id: "TXN-0086", user: "Cali Dheere", item: "Property deposit", amount: "$450", method: "Zaad", phone: "252632345678", status: "Success", date: "2025-06-02 11:00" },
  { id: "TXN-0085", user: "Cabdullahi Muuse", item: "Vehicle rental", amount: "$375", method: "EVC Plus", phone: "252613456789", status: "Success", date: "2025-06-01 09:50" },
  { id: "TXN-0084", user: "Sahra Warsame", item: "Listing fee", amount: "$25", method: "Zaad", phone: "252635678901", status: "Refunded", date: "2025-05-31 16:20" },
];

const statusColor: Record<string, string> = {
  Success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Refunded: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [method, setMethod] = useState("All");

  const filtered = transactions.filter((t) => {
    const match = t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.item.toLowerCase().includes(search.toLowerCase());
    const filt = filter === "All" || t.status === filter;
    const meth = method === "All" || t.method === method;
    return match && filt && meth;
  });

  const totalSuccess = transactions
    .filter(t => t.status === "Success")
    .reduce((s, t) => s + parseFloat(t.amount.replace(/[$,]/g, "")), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments API</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All mobile money transactions via EVC Plus &amp; Zaad
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium rounded-lg border px-4 py-2 hover:bg-muted transition">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Transactions", value: transactions.length },
          { label: "Successful", value: transactions.filter(t => t.status === "Success").length },
          { label: "Failed", value: transactions.filter(t => t.status === "Failed").length },
          { label: "Total Processed", value: `$${totalSuccess.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Method breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        {["EVC Plus", "Zaad"].map((m) => {
          const mtxns = transactions.filter(t => t.method === m);
          const msuccess = mtxns.filter(t => t.status === "Success");
          const mamt = msuccess.reduce((s, t) => s + parseFloat(t.amount.replace(/[$,]/g, "")), 0);
          return (
            <div key={m} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{m}</h3>
                <span className="text-xs text-muted-foreground">{mtxns.length} transactions</span>
              </div>
              <p className="text-2xl font-bold">${mamt.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">{msuccess.length} successful</p>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(msuccess.length / mtxns.length) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Success", "Pending", "Failed", "Refunded"].map((f) => (
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
            <div className="h-5 w-px bg-border mx-1" />
            {["All", "EVC Plus", "Zaad"].map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  method === m ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {m}
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
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="px-4 py-3 font-medium">{t.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.item}</td>
                  <td className="px-4 py-3 font-semibold">{t.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.method}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      {t.status === "Failed" && (
                        <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-muted hover:bg-muted/80 transition text-muted-foreground">
                          <RefreshCw className="w-3 h-3" /> Retry
                        </button>
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
