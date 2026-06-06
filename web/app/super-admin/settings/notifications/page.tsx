"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone, Save, CheckCircle } from "lucide-react";

const notificationGroups = [
  {
    group: "User Activity",
    icon: "👤",
    items: [
      { id: "new_user", label: "New User Registration", desc: "Get notified when a new user signs up on the platform.", defaultOn: true },
      { id: "user_ban", label: "User Banned / Suspended", desc: "Receive a confirmation when a user is suspended or banned.", defaultOn: true },
    ],
  },
  {
    group: "Listings",
    icon: "🏠",
    items: [
      { id: "new_listing", label: "New Property Listing", desc: "Get notified when a new property listing is submitted for review.", defaultOn: true },
      { id: "listing_approved", label: "Listing Approved", desc: "Receive a confirmation when a listing is approved.", defaultOn: false },
      { id: "listing_rejected", label: "Listing Rejected", desc: "Receive a confirmation when a listing is rejected.", defaultOn: true },
      { id: "new_vehicle", label: "New Vehicle Listing", desc: "Get notified when a new vehicle listing is submitted.", defaultOn: true },
    ],
  },
  {
    group: "Payments & Escrow",
    icon: "💳",
    items: [
      { id: "payment_fail", label: "Payment Failed", desc: "Immediate alert when a payment fails.", defaultOn: true },
      { id: "escrow_dispute", label: "Escrow Dispute Opened", desc: "Get notified immediately when an escrow dispute is raised.", defaultOn: true },
      { id: "escrow_release", label: "Escrow Funds Released", desc: "Receive a notification when escrow funds are released.", defaultOn: false },
    ],
  },
  {
    group: "System",
    icon: "⚙️",
    items: [
      { id: "system_update", label: "Platform Update Available", desc: "Be informed of new platform version updates.", defaultOn: false },
      { id: "monthly_report", label: "Monthly Report Ready", desc: "Get notified when the monthly report is generated.", defaultOn: true },
    ],
  },
];

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(
      notificationGroups.flatMap(g => g.items.map(i => [i.id, i.defaultOn]))
    )
  );
  const [channel, setChannel] = useState<"email" | "push" | "both">("both");
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => setPrefs(p => ({ ...p, [id]: !p[id] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which events trigger a notification and how you'd like to receive them.
        </p>
      </div>

      {/* Notification Channel */}
      <div className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-6">
        <div className="flex items-center gap-3 pb-4 border-b mb-5">
          <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center">
            <Bell className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <h3 className="font-semibold">Notification Channel</h3>
            <p className="text-xs text-muted-foreground">Choose how you receive notifications.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: "email", label: "Email Only", icon: Mail },
            { value: "push", label: "Push Only", icon: Smartphone },
            { value: "both", label: "Email & Push", icon: Bell },
          ].map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => setChannel(opt.value as typeof channel)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-colors ${
                  channel === opt.value
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300"
                    : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        {notificationGroups.map(group => (
          <div key={group.group} className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <span className="text-lg">{group.icon}</span>
              <h3 className="font-semibold">{group.group}</h3>
            </div>
            <div className="space-y-4">
              {group.items.map(item => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={prefs[item.id]}
                      onChange={() => toggle(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-sky-500" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
            saved ? "bg-emerald-600 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Preferences Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
