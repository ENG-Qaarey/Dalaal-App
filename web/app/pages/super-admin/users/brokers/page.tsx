"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, ShieldCheck, Ban, Mail, Eye, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface Broker {
  id: string;
  email: string;
  username?: string;
  status: string;
  createdAt: string;
  profile?: { firstName?: string; lastName?: string; city?: string; phone?: string };
  _count?: { listings?: number };
}

function getBrokerName(b: Broker) {
  if (b.profile?.firstName) return `${b.profile.firstName} ${b.profile.lastName || ""}`.trim();
  return b.username || b.email;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
    SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? "bg-zinc-100 text-zinc-700"}`}>
      {status}
    </span>
  );
};

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchBrokers() {
      try {
        const result = await api.get("/admin/users?role=BROKER");
        const list = Array.isArray(result) ? result : result?.users ?? result?.data ?? [];
        setBrokers(list);
      } catch (err: any) {
        setError(err.message || "Failed to load brokers");
      } finally {
        setLoading(false);
      }
    }
    fetchBrokers();
  }, []);

  const filtered = brokers.filter(
    (b) =>
      getBrokerName(b).toLowerCase().includes(search.toLowerCase()) ||
      (b.profile?.city ?? "").toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase())
  );

  const verifiedCount = brokers.filter((b) => b.status === "ACTIVE").length;
  const pendingCount = brokers.filter((b) => b.status === "PENDING").length;
  const suspendedCount = brokers.filter((b) => b.status === "SUSPENDED").length;

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
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brokers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all registered brokers on the platform.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Brokers", value: brokers.length },
          { label: "Verified", value: verifiedCount },
          { label: "Pending", value: pendingCount },
          { label: "Suspended", value: suspendedCount },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border bg-white dark:bg-zinc-950 p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search brokers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="px-5 py-3 font-medium text-zinc-500">Name</th>
              <th className="px-5 py-3 font-medium text-zinc-500">City</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Listings</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Status</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Joined</th>
              <th className="px-5 py-3 font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No brokers found
                </td>
              </tr>
            ) : (
              filtered.map(b => (
                <tr key={b.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{getBrokerName(b)}</div>
                    <div className="text-xs text-muted-foreground">{b.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-400">{b.profile?.city ?? "—"}</td>
                  <td className="px-5 py-3.5 font-semibold text-sky-600">{b._count?.listings ?? 0}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-3.5 text-xs text-zinc-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button title="View" className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Eye className="w-4 h-4 text-zinc-500" /></button>
                      <button title="Email" className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"><Mail className="w-4 h-4 text-zinc-500" /></button>
                      <button title={b.status === "SUSPENDED" ? "Unsuspend" : "Suspend"} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"><Ban className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
