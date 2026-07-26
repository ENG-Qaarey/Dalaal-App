"use client";

import { useState } from "react";
import { ShieldCheck, Key, Smartphone } from "lucide-react";

export default function AdminSecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      setMessage("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      return;
    }
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error("Failed to update password");
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setMessage("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Security Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure administrator login and 2FA authentication.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-900 px-4 py-2 rounded-lg text-sm font-semibold">
          <ShieldCheck className="w-4 h-4" /> System Secured
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Key className="w-5 h-5 text-muted-foreground" /> Change Password
          </h3>
          <p className="text-sm text-muted-foreground">Ensure your account is using a long, random password to stay secure.</p>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              onClick={handleUpdatePassword}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              Update Password
            </button>
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-muted-foreground" /> Two-Factor Authentication
          </h3>
          <p className="text-sm text-muted-foreground">Add additional security to your account using two-factor authentication.</p>

          <div className="pt-2">
            <div className="p-4 border border-border rounded-lg bg-muted/30 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">Authenticator App</h4>
                <p className="text-xs text-muted-foreground">Not configured</p>
              </div>
              <button className="border border-border bg-background hover:bg-muted text-foreground px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
