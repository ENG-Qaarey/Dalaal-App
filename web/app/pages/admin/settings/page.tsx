"use client";

import { useState, useEffect } from "react";
import { User, Mail, Globe, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { adminService } from "@/lib/api";

export default function AdminSettings() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      const fullName = user.profile
        ? `${user.profile.firstName || ""} ${user.profile.lastName || ""}`.trim()
        : user.username || "";
      setName(fullName || user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      await adminService.updateUser(user.id, { username: name });
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administrator Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your enterprise platform owner profile.</p>
        </div>
      </div>

      {message && (
        <div className={`text-sm font-semibold px-4 py-2 rounded-lg ${message.includes("success") ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
          {message}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground">
              {name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "SO"}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{name || "System Owner"}</h3>
              <p className="text-sm text-muted-foreground">Super Administrator</p>
              <button className="mt-2 text-sm text-blue-600 hover:underline font-semibold">Change Avatar</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-muted-foreground">Platform Region</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" defaultValue="Somalia (All Regions)" className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
