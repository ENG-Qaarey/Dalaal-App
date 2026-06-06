"use client";

import { useState } from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  ShieldCheck,
  Ban,
  Mail,
  Eye,
} from "lucide-react";

const users = [
  { id: 1, name: "Axmed Cali", email: "axmed@dalaal.so", role: "User", status: "Active", joined: "2025-01-12", listings: 4 },
  { id: 2, name: "Faadumo Xasan", email: "faadumo@dalaal.so", role: "Broker", status: "Active", joined: "2025-02-03", listings: 18 },
  { id: 3, name: "Cabdullahi Muuse", email: "cabdullahi@dalaal.so", role: "Broker", status: "Pending", joined: "2025-04-20", listings: 0 },
  { id: 4, name: "Hodan Nuur", email: "hodan@dalaal.so", role: "User", status: "Active", joined: "2025-03-08", listings: 2 },
  { id: 5, name: "Mahad Ibrahim", email: "mahad@dalaal.so", role: "Broker", status: "Active", joined: "2024-11-15", listings: 31 },
  { id: 6, name: "Sahra Warsame", email: "sahra@dalaal.so", role: "User", status: "Banned", joined: "2024-12-01", listings: 0 },
  { id: 7, name: "Cali Dheere", email: "cali@dalaal.so", role: "User", status: "Active", joined: "2025-05-01", listings: 1 },
  { id: 8, name: "Nasteho Ahmed", email: "nasteho@dalaal.so", role: "Broker", status: "Active", joined: "2025-01-29", listings: 9 },
];

const statusColor: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Banned: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const roleColor: Record<string, string> = {
  Broker: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  User: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || u.role === filter || u.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users & Brokers</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all registered users and licensed brokers
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition">
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Users", value: users.length },
          { label: "Brokers", value: users.filter(u => u.role === "Broker").length },
          { label: "Pending Approval", value: users.filter(u => u.status === "Pending").length },
          { label: "Banned", value: users.filter(u => u.status === "Banned").length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
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
            {["All", "Broker", "User", "Pending", "Banned"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
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
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Listings</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[u.status]}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.listings}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground" title="Email">
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      {u.status !== "Banned" && (
                        <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition text-muted-foreground hover:text-red-600" title="Ban">
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {u.status === "Pending" && (
                        <button className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition text-muted-foreground hover:text-emerald-600" title="Approve">
                          <ShieldCheck className="w-3.5 h-3.5" />
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
