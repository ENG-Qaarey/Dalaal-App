"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ShieldCheck, Shield, Eye } from "lucide-react";

const roles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to all platform features and settings.",
    users: 1,
    permissions: ["Manage Users", "Manage Properties", "Manage Vehicles", "Manage Payments", "View Reports", "System Settings", "Manage Roles"],
    color: "text-red-600 bg-red-50 dark:bg-red-950/40",
    icon: ShieldCheck,
  },
  {
    id: 2,
    name: "Admin",
    description: "Access to manage listings, users, and reports.",
    users: 4,
    permissions: ["Manage Users", "Manage Properties", "Manage Vehicles", "View Reports"],
    color: "text-sky-600 bg-sky-50 dark:bg-sky-950/40",
    icon: Shield,
  },
  {
    id: 3,
    name: "Moderator",
    description: "Can review and approve listings. No access to financials.",
    users: 8,
    permissions: ["Manage Properties", "Manage Vehicles", "View Reports"],
    color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40",
    icon: Eye,
  },
  {
    id: 4,
    name: "Support",
    description: "Read-only access to user and listing data.",
    users: 12,
    permissions: ["View Reports"],
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    icon: Eye,
  },
];

const allPermissions = [
  "Manage Users",
  "Manage Properties",
  "Manage Vehicles",
  "Manage Payments",
  "View Reports",
  "System Settings",
  "Manage Roles",
];

export default function RolesPage() {
  const [selected, setSelected] = useState(roles[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define what each role can access across the platform.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          New Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Role List */}
        <div className="space-y-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected.id === role.id
                    ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 shadow-sm"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">{role.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{role.users} user{role.users !== 1 ? "s" : ""}</span>
                </div>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </button>
            );
          })}
        </div>

        {/* Permission Editor */}
        <div className="lg:col-span-2 rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">{selected.name}</h3>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                <Edit className="w-4 h-4 text-zinc-500" />
              </button>
              {selected.id !== 1 && (
                <button className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Permissions</p>
            {allPermissions.map((perm) => {
              const hasIt = selected.permissions.includes(perm);
              return (
                <div key={perm} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{perm}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={hasIt}
                      disabled={selected.id === 1}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-sky-500 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed" />
                  </label>
                </div>
              );
            })}
          </div>

          {selected.id !== 1 && (
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
