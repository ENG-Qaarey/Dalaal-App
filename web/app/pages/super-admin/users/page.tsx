"use client";

import { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  ShieldCheck,
  Ban,
  Mail,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  username?: string;
  role: string;
  status: string;
  createdAt: string;
  profile?: { firstName?: string; lastName?: string; city?: string };
  _count?: { listings?: number };
}

const statusColor: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  BANNED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const roleColor: Record<string, string> = {
  BROKER: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  PROPERTY_OWNER: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  VEHICLE_OWNER: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  CUSTOMER: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  SUPER_ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  MODERATOR: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
};

function getUserDisplayName(user: User) {
  if (user.profile?.firstName) {
    return `${user.profile.firstName} ${user.profile.lastName || ""}`.trim();
  }
  return user.username || user.email;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await api.get("/admin/users");
        const list = Array.isArray(result) ? result : result?.users ?? result?.data ?? [];
        setUsers(list);
      } catch (err: any) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const name = getUserDisplayName(u).toLowerCase();
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" || u.role === filter || u.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalUsers = users.length;
  const brokerCount = users.filter((u) => u.role === "BROKER").length;
  const pendingCount = users.filter((u) => u.status === "PENDING").length;
  const bannedCount = users.filter((u) => u.status === "BANNED" || u.status === "SUSPENDED").length;

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
      <div className="rounded-2xl border border-border bg-gradient-to-br from-sky-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Users & Brokers
            </h1>
            <p className="mt-1 text-sm text-sky-100">
              Manage all registered users, broker approvals, and account status.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Users", value: totalUsers, accent: "from-sky-500/20 to-sky-500/5" },
          { label: "Brokers", value: brokerCount, accent: "from-violet-500/20 to-violet-500/5" },
          { label: "Pending Approval", value: pendingCount, accent: "from-amber-500/20 to-amber-500/5" },
          { label: "Suspended/Banned", value: bannedCount, accent: "from-rose-500/20 to-rose-500/5" },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border border-border bg-gradient-to-br ${s.accent} p-4 shadow-sm`}
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["All", "BROKER", "PROPERTY_OWNER", "VEHICLE_OWNER", "CUSTOMER", "PENDING", "SUSPENDED", "BANNED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
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
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Listings</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                          {getUserDisplayName(u).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{getUserDisplayName(u)}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor[u.role] ?? "bg-zinc-100 text-zinc-600"}`}>
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[u.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u._count?.listings ?? 0}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground" title="Email">
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        {u.status !== "BANNED" && u.status !== "SUSPENDED" && (
                          <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition text-muted-foreground hover:text-red-600" title="Ban">
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {u.status === "PENDING" && (
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition text-muted-foreground hover:text-emerald-600" title="Approve">
                            <ShieldCheck className="w-3.5 h-3.5" />
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
