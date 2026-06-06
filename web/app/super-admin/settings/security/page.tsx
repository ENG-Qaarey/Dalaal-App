"use client";

import { useState } from "react";
import { Lock, Save, Eye, EyeOff, ShieldCheck, Smartphone } from "lucide-react";

export default function SecuritySettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your password and account security settings.</p>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center">
            <Lock className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <h3 className="font-semibold">Change Password</h3>
            <p className="text-xs text-muted-foreground">Use a strong, unique password.</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Current Password", show: showCurrent, toggle: () => setShowCurrent(v => !v) },
            { label: "New Password", show: showNew, toggle: () => setShowNew(v => !v) },
            { label: "Confirm New Password", show: showConfirm, toggle: () => setShowConfirm(v => !v) },
          ].map(field => (
            <div key={field.label} className="space-y-1.5">
              <label className="text-sm font-medium">{field.label}</label>
              <div className="relative">
                <input
                  type={field.show ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                />
                <button type="button" onClick={field.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                  {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${saved ? "bg-emerald-600 text-white" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Update Password"}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h3 className="font-semibold">Two-Factor Authentication</h3>
            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium text-sm">Authenticator App (TOTP)</p>
            <p className="text-xs text-muted-foreground mt-0.5">Use Google Authenticator or Authy to generate codes.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(v => !v)} className="sr-only peer" />
            <div className="w-9 h-5 bg-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-sky-500" />
          </label>
        </div>

        {twoFA && (
          <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 rounded-lg p-4 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-xs text-sky-700 dark:text-sky-300">
              Two-factor authentication is currently <strong>enabled</strong>. Your account is protected with an additional verification step on login.
            </p>
          </div>
        )}
      </div>

      {/* Login Alerts */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 border-b mb-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold">Login Alerts</h3>
            <p className="text-xs text-muted-foreground">Be notified when a new login is detected.</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Email alerts on new login</p>
            <p className="text-xs text-muted-foreground mt-0.5">You'll receive an email any time a new device logs in.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={loginAlerts} onChange={() => setLoginAlerts(v => !v)} className="sr-only peer" />
            <div className="w-9 h-5 bg-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-sky-500" />
          </label>
        </div>
      </div>
    </div>
  );
}
