"use client";

import { useState } from "react";
import { Search, Unlock, Clock, CheckCircle } from "lucide-react";

const escrows = [
  { id: "ESC-001", buyer: "Axmed Cali", seller: "Faadumo Xasan", item: "Villa in Hodan District", amount: "$85,000", method: "EVC Plus", status: "Held", created: "2025-05-10", due: "2025-06-10" },
  { id: "ESC-002", buyer: "Hodan Nuur", seller: "Mahad Ibrahim", item: "Office Space, Makka", amount: "$3,600", method: "Zaad", status: "Released", created: "2025-04-01", due: "2025-05-01" },
  { id: "ESC-003", buyer: "Cali Dheere", seller: "Nasteho Ahmed", item: "Toyota Prado rental (7d)", amount: "$770", method: "EVC Plus", status: "Held", created: "2025-06-01", due: "2025-06-08" },
  { id: "ESC-004", buyer: "Sahra Warsame", seller: "Axmed Cali", item: "2BR Apartment, Hamar Weyne", amount: "$900", method: "Zaad", status: "Disputed", created: "2025-05-20", due: "2025-06-20" },
  { id: "ESC-005", buyer: "Cabdullahi Muuse", seller: "Nasteho Ahmed", item: "Kia Sportage rental (5d)", amount: "$375", method: "EVC Plus", status: "Released", created: "2025-05-05", due: "2025-05-12" },
  { id: "ESC-006", buyer: "Mahad Ibrahim", seller: "Faadumo Xasan", item: "Land Plot, Dharkenley", amount: "$12,000", method: "Zaad", status: "Held", created: "2025-06-03", due: "2025-07-03" },
];

const statusColor: Record<string, string> = {
  Held: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Released: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Disputed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export default function EscrowPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = escrows.filter((e) => {
    const match = e.item.toLowerCase().includes(search.toLowerCase()) ||
      e.buyer.toLowerCase().includes(search.toLowerCase()) ||
      e.seller.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const filt = filter === "All" || e.status === filter;
    return match && filt;
  });

  const totalHeld = escrows.filter(e => e.status === "Held").reduce((sum, e) => {
    const num = parseFloat(e.amount.replace(/[$,]/g, ""));
    return sum + num;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Escrow Vault</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage all escrow-protected transactions on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Escrows", value: escrows.length },
          { label: "Currently Held", value: escrows.filter(e => e.status === "Held").length },
          { label: "Released", value: escrows.filter(e => e.status === "Released").length },
          { label: "Disputed", value: escrows.filter(e => e.status === "Disputed").length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Total held banner */}
      <div className="rounded-xl border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Total Value Currently In Escrow</p>
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">${totalHeld.toLocaleString()}</p>
        </div>
        <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400 opacity-60" />
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search escrows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["All", "Held", "Released", "Disputed"].map((f) => (
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
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Item</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Buyer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Seller</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Method</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Due</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium max-w-[180px] truncate">{e.item}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.buyer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.seller}</td>
                  <td className="px-4 py-3 font-semibold">{e.amount}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[e.status]}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{e.due}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {e.status === "Held" && (
                        <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 transition">
                          <Unlock className="w-3 h-3" /> Release
                        </button>
                      )}
                      {e.status === "Disputed" && (
                        <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 transition">
                          <CheckCircle className="w-3 h-3" /> Resolve
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
