"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Download,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

export function Topbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isDark, setIsDark] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [timeString, setTimeString] = useState("24 Jul 2026, 00:45:55");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
          ", " +
          now.toLocaleTimeString("en-GB"),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return "Dashboard Overview";
    if (pathname.includes("/companies")) return "Registered Companies";
    if (pathname.includes("/users")) return "Users Management";
    if (pathname.includes("/roles")) return "Permissions & Roles";
    if (pathname.includes("/customers")) return "Customer Database";
    if (pathname.includes("/transactions")) return "Platform Transactions";
    if (pathname.includes("/reports")) return "Reports & Analytics";
    if (pathname.includes("/monitoring")) return "System Monitoring";
    if (pathname.includes("/subscriptions")) return "Subscriptions & Plans";
    if (pathname.includes("/announcements")) return "Broadcast Announcements";
    if (pathname.includes("/support")) return "Support & Tickets";
    if (pathname.includes("/settings")) return "System Settings";
    if (pathname.includes("/profile")) return "Super Admin Profile";
    return "Super Admin Panel";
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#1F2937] px-6 flex items-center justify-between transition-colors">
      {/* Left Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-black text-white tracking-tight leading-none">
          {getPageTitle()}
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1 font-semibold">
          <span>Super Admin</span>
          <span>&gt;</span>
          <span className="text-blue-400">{getPageTitle()}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Live Clock */}
        <div className="hidden md:flex items-center gap-2 bg-[#111827] border border-[#1F2937] px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-300 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>{timeString}</span>
        </div>

        {/* Export Report CTA */}
        <button
          onClick={() => alert("Exporting Super Admin Full System Report...")}
          className="flex items-center gap-2 bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Report</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-xl bg-[#111827] border border-[#1F2937] text-zinc-300 hover:text-white transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-400" />
          )}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => alert("8 Unread System Alerts")}
            className="p-2 rounded-xl bg-[#111827] border border-[#1F2937] text-zinc-300 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center border-2 border-[#0B0F19]">
              8
            </span>
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 bg-[#111827] border border-[#1F2937] p-1.5 pr-3 rounded-xl hover:border-blue-500/50 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 font-black text-white text-xs flex items-center justify-center">
              SO
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-black text-white leading-none">
                System Owner
              </div>
              <div className="text-[9px] font-extrabold text-blue-400 mt-0.5">
                SUPER ADMIN
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl p-2 space-y-1 z-50 text-xs">
              <div className="p-2.5 border-b border-[#1F2937]">
                <div className="font-bold text-white">System Owner</div>
                <div className="text-[10px] text-zinc-400">
                  superadmin@sea.com
                </div>
              </div>
              <a
                href="/super-admin/profile"
                className="flex items-center gap-2 p-2 rounded-xl text-zinc-300 hover:bg-[#1F2937] hover:text-white transition-colors"
              >
                <User className="w-4 h-4" /> Profile Settings
              </a>
              <a
                href="/super-admin/settings"
                className="flex items-center gap-2 p-2 rounded-xl text-zinc-300 hover:bg-[#1F2937] hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" /> System Settings
              </a>
              <button
                onClick={() => alert("Logging out...")}
                className="w-full flex items-center gap-2 p-2 rounded-xl text-red-400 hover:bg-red-950/40 transition-colors text-left font-bold"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
