"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Lock,
  Receipt,
  BarChart3,
  Activity,
  CreditCard,
  Megaphone,
  MessageSquare,
  Settings,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useSidebarStore } from "../../store/sidebar.store";
import { useAuthStore } from "../../store/auth.store";

const navItems = [
  { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
  { label: "Companies", href: "/super-admin/companies", icon: Building2 },
  { label: "Users Management", href: "/super-admin/users", icon: Users },
  { label: "Permissions & Roles", href: "/super-admin/roles", icon: Lock },
  { label: "Customers (All)", href: "/super-admin/customers", icon: Users },
  {
    label: "Transactions (All)",
    href: "/super-admin/transactions",
    icon: Receipt,
  },
  {
    label: "Reports & Analytics",
    href: "/super-admin/reports",
    icon: BarChart3,
  },
  {
    label: "System Monitoring",
    href: "/super-admin/monitoring",
    icon: Activity,
  },
  {
    label: "Subscriptions & Plans",
    href: "/super-admin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Announcements",
    href: "/super-admin/announcements",
    icon: Megaphone,
  },
  {
    label: "Support & Tickets",
    href: "/super-admin/support",
    icon: MessageSquare,
  },
  { label: "System Settings", href: "/super-admin/settings", icon: Settings },
];

const accountItems = [
  { label: "Profile Settings", href: "/super-admin/profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleSidebar } = useSidebarStore();
  const { user } = useAuthStore();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col bg-[#0B3A82] text-white ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="h-20 bg-[#082E6E] px-4 flex items-center justify-between border-b border-blue-900/40 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white uppercase truncate">
                  SOMALI ELECTRIC APP
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/30 text-[9px] font-black uppercase text-blue-200 tracking-wider">
                  SUPER ADMIN
                </span>
                <span className="text-[10px] font-bold text-blue-300">
                  Owner Panel
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-xl bg-blue-900/50 hover:bg-blue-900 text-blue-200 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Profile Bar */}
      <div className="p-3 bg-[#093375] border-b border-blue-900/30 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-blue-950/40 border border-blue-800/30">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xs shrink-0 shadow-md">
            SO
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-black text-white truncate">
                System Owner
              </span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
                ONLINE
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Scroll Region */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 custom-scrollbar">
        {/* Main Nav Section */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-[0.15em] text-blue-300/70">
              MAIN NAVIGATION
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? "bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30"
                    : "text-blue-100/80 hover:bg-blue-900/50 hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <span className="absolute right-2 w-1.5 h-4 bg-white rounded-full hidden group-hover:block" />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-blue-300"}`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Account Section */}
        <div className="space-y-1 pt-2 border-t border-blue-900/40">
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-[0.15em] text-blue-300/70">
              ACCOUNT
            </div>
          )}
          {accountItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30"
                    : "text-blue-100/80 hover:bg-blue-900/50 hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-blue-300" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}

          <button
            onClick={() => alert("Logging out of Super Admin Panel...")}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-all text-left"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0 text-red-400" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Footer Branding Card */}
      {!collapsed && (
        <div className="p-3 bg-[#082E6E] border-t border-blue-900/40 shrink-0">
          <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-[10px] shrink-0">
              N
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black text-white truncate">
                Somali Electric App
              </span>
              <span className="text-[9px] text-blue-300/80 leading-tight">
                Enterprise Electricity Management Platform for Somalia
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
