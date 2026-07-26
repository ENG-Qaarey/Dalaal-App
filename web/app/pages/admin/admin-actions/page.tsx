"use client";

import { useState, useEffect } from "react";
import { Activity, Search, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminActions() {
  const [search, setSearch] = useState("");
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchActions() {
      try {
        const result = await api.get("/admin/audit-logs");
        const list = Array.isArray(result) ? result : result?.logs ?? result?.data ?? [];
        setActions(list.slice(0, 50));
      } catch (err: any) {
        setError(err.message || "Failed to load admin actions");
      } finally {
        setLoading(false);
      }
    }
    fetchActions();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  const filtered = actions.filter(a =>
    (a.action || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.admin || a.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.details || a.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Actions</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all actions performed by admin users.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search actions..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs font-semibold">
                <th className="p-4 pl-0">Admin</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-sm text-muted-foreground">No admin actions found</td></tr>
              ) : (
                filtered.map((a: any) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-0 font-medium">{a.admin || a.user?.email || "System"}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                        {a.action || a.type || "Unknown action"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{a.details || a.description || "—"}</td>
                    <td className="p-4 text-muted-foreground text-xs font-mono">{a.ip || "—"}</td>
                    <td className="p-4 text-muted-foreground text-xs">{a.createdAt ? new Date(a.createdAt).toLocaleString() : a.timestamp || "—"}</td>
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
