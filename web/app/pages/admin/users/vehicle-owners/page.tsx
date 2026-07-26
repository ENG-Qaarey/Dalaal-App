"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Mail, Loader2, Users, UserCheck, UserX } from "lucide-react";

interface User {
  id: string;
  fullName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  isActive?: boolean;
  listingsCount?: number;
  createdAt: string;
}

function getDisplayName(u: User): string {
  return u.fullName || u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email.split("@")[0];
}

export default function AdminVehicleOwners() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await adminService.getUsers({ role: "VEHICLE_OWNER", limit: "50" });
        setUsers(Array.isArray(data) ? data : data?.users || data?.data || []);
      } catch (err: any) {
        console.error("Failed to fetch vehicle owners:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  async function handleToggleStatus(user: User) {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await adminService.updateUserStatus(user.id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
    } catch (err: any) {
      console.error("Failed to update status:", err.message);
    }
  }

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = getDisplayName(u).toLowerCase();
    return name.includes(q) || u.email.toLowerCase().includes(q);
  });

  const activeCount = users.filter((u) => u.status === "ACTIVE").length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Owners</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage vehicle owners registered on Dalaal
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vehicle owners by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4" /> {users.length} Total
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-4 h-4" /> {activeCount} Active
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left font-medium text-muted-foreground py-3 px-4">Name</th>
                    <th className="text-left font-medium text-muted-foreground py-3 px-4">Email</th>
                    <th className="text-center font-medium text-muted-foreground py-3 px-4">Role</th>
                    <th className="text-center font-medium text-muted-foreground py-3 px-4">Listings</th>
                    <th className="text-center font-medium text-muted-foreground py-3 px-4">Status</th>
                    <th className="text-center font-medium text-muted-foreground py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground">
                        No vehicle owners found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-medium">{getDisplayName(u)}</td>
                        <td className="py-3 px-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="w-3.5 h-3.5" /> {u.email}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900">
                            {u.role.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">{u.listingsCount ?? 0}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              u.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            size="xs"
                            variant={u.status === "ACTIVE" ? "destructive" : "outline"}
                            onClick={() => handleToggleStatus(u)}
                          >
                            {u.status === "ACTIVE" ? (
                              <>
                                <UserX className="w-3 h-3 mr-1" /> Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" /> Activate
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
