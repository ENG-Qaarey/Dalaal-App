"use client";

import { Save, User, Mail, ShieldCheck } from "lucide-react";

export default function CustomerSettings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer profile and preferences.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-4xl font-bold">
              HA
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">Hassan Ali <ShieldCheck className="w-4 h-4 text-emerald-600" /></h3>
              <p className="text-sm text-muted-foreground">Registered Customer</p>
              <button className="mt-2 text-sm text-blue-600 hover:underline font-semibold">Change Avatar</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" defaultValue="Hassan Ali" className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" defaultValue="hassan.ali@gmail.com" disabled className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
              <input type="text" defaultValue="+252 61 222 3344" className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
