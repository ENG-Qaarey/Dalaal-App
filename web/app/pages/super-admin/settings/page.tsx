"use client";

import { useState, useEffect } from "react";
import { User, Lock, Bell, Shield, Save, Upload, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const result = await api.get("/users/profile");
        setProfile(result);
      } catch {
        // Use localStorage fallback
        try {
          const stored = localStorage.getItem("user");
          if (stored) setProfile(JSON.parse(stored));
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const displayName = profile?.profile?.firstName
    ? `${profile.profile.firstName} ${profile.profile.lastName || ""}`.trim()
    : profile?.username || profile?.email || "Admin";
  const email = profile?.email || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-200">
          Manage your account settings and platform preferences from a single admin control center.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex flex-col gap-1">
          {[
            { key: "account", label: "Account", icon: User },
            { key: "security", label: "Security", icon: Lock },
            { key: "notifications", label: "Notifications", icon: Bell },
            { key: "platform", label: "Platform", icon: Shield },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
              </div>
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 border flex items-center justify-center text-xl font-bold">{initials}</div>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <Upload className="w-4 h-4" /> Change Avatar
                  </button>
                </div>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input type="text" defaultValue={displayName} className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input type="email" defaultValue={email} className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <input type="text" disabled defaultValue={profile?.role?.replace("_", " ") || "Super Admin"} className="w-full px-3 py-2 border rounded-md text-sm bg-muted text-muted-foreground cursor-not-allowed" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">Update your password and secure your account.</p>
              </div>
              <div className="border-t border-border pt-6 space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <input type="password" placeholder="Enter current password" className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">Choose what you want to be notified about.</p>
              </div>
              <div className="border-t border-border pt-6 space-y-4">
                {[
                  { title: "New user registrations", desc: "Receive an email when a new user signs up." },
                  { title: "New property listings", desc: "Receive an email when a property is listed." },
                  { title: "Escrow disputes", desc: "Get notified immediately if an escrow transaction is disputed." },
                  { title: "Platform updates", desc: "Monthly newsletter with platform statistics." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i !== 3} className="sr-only peer" />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "platform" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Platform Preferences</h3>
                <p className="text-sm text-muted-foreground">Global settings for the admin dashboard.</p>
              </div>
              <div className="border-t border-border pt-6 space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Language</label>
                  <select className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>English</option>
                    <option>Somali</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timezone</label>
                  <select className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Africa/Mogadishu (UTC+3)</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
