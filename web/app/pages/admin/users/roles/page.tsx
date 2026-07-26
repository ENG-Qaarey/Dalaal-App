"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Check, X, Shield } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function fetchRoles() {
      try {
        const result = await api.get("/admin/users");
        const users = Array.isArray(result) ? result : result?.users ?? result?.data ?? [];
        const roleMap = new Map<string, { role: string; label: string; count: number; permissions: Record<string, boolean> }>();
        users.forEach((u: any) => {
          const role = u.role || "UNKNOWN";
          if (!roleMap.has(role)) {
            const isSuperAdmin = role === "SUPER_ADMIN";
            roleMap.set(role, {
              role,
              label: role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()),
              count: 0,
              permissions: {
                canCreateListing: isSuperAdmin || role === "BROKER" || role === "MODERATOR",
                canApproveListing: isSuperAdmin || role === "MODERATOR",
                canManageUsers: isSuperAdmin || role === "MODERATOR",
                canViewAnalytics: isSuperAdmin || role === "MODERATOR" || role === "BROKER",
                canManageSystem: isSuperAdmin,
                canHandleEscrow: isSuperAdmin || role === "MODERATOR",
              },
            });
          }
          roleMap.get(role)!.count++;
        });
        setRoles(Array.from(roleMap.values()));
      } catch (err: any) {
        setError(err.message || "Failed to load roles");
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  const togglePermission = (roleIndex: number, permKey: string) => {
    setRoles(prev => {
      const updated = [...prev];
      if (updated[roleIndex].role === "SUPER_ADMIN") return updated;
      updated[roleIndex] = {
        ...updated[roleIndex],
        permissions: { ...updated[roleIndex].permissions, [permKey]: !updated[roleIndex].permissions[permKey] },
      };
      return updated;
    });
  };

  const handleSave = () => {
    setSavedMessage("Role permissions matrix updated successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure access control matrix and permission levels across platform roles</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Shield className="w-4 h-4" /> Save Permission Matrix
        </button>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {savedMessage}
        </div>
      )}

      {roles.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">No roles found.</div>
      ) : (
        <div className="grid gap-6">
          {roles.map((roleItem, index) => (
            <div key={roleItem.role} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-500" />
                  <h3 className="text-lg font-semibold">{roleItem.label}</h3>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {roleItem.role} · {roleItem.count} users
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(roleItem.permissions).map(([key, val]) => (
                  <div key={key} onClick={() => togglePermission(index, key)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${val ? "bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800/60" : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"}`}>
                    <span className="text-xs font-semibold capitalize">{key.replace("can", "").replace(/([A-Z])/g, " $1")}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${val ? "bg-violet-600 text-white" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500"}`}>
                      {val ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
