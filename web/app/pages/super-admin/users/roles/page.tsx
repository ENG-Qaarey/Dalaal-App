"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Check, X, Shield } from "lucide-react";
import { api } from "@/lib/api";

interface RoleData {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  userCount?: number;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<RoleData | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const result = await api.get("/admin/users?role=SUPER_ADMIN");
        const allUsers = Array.isArray(result) ? result : result?.users ?? result?.data ?? [];
        const roleMap = new Map<string, RoleData>();
        allUsers.forEach((u: any) => {
          const role = u.role || "UNKNOWN";
          if (!roleMap.has(role)) {
            roleMap.set(role, { id: role, name: role.replace("_", " "), permissions: [], userCount: 0 });
          }
          roleMap.get(role)!.userCount = (roleMap.get(role)!.userCount || 0) + 1;
        });
        const roleList = Array.from(roleMap.values());
        setRoles(roleList);
        if (roleList.length > 0) setSelected(roleList[0]);
      } catch (err: any) {
        setError(err.message || "Failed to load roles");
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  const allPermissions = ["Manage Users", "Manage Properties", "Manage Vehicles", "Manage Payments", "View Reports", "System Settings", "Manage Roles"];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">Define what each role can access across the platform.</p>
        </div>
      </div>

      {roles.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">No roles found. Roles are determined by user registrations.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            {roles.map((role) => (
              <button key={role.id} onClick={() => setSelected(role)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === role.id ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 shadow-sm" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-50 dark:bg-violet-950/40 text-violet-600">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">{role.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{role.userCount} user{role.userCount !== 1 ? "s" : ""}</span>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="lg:col-span-2 rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-lg">{selected.name}</h3>
                <p className="text-sm text-muted-foreground">Role configuration for {selected.userCount} users</p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Permissions</p>
                {allPermissions.map((perm) => (
                  <div key={perm} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <p className="text-sm font-medium">{perm}</p>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center ${selected.id === "SUPER_ADMIN" ? "bg-emerald-600 text-white" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500"}`}>
                      {selected.id === "SUPER_ADMIN" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
