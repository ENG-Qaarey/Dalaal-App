"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/sidebar.store";
import { useAuth } from "@/lib/auth-context";
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
  PanelLeftClose,
  PanelLeft,
  ShieldCheck,
  Home,
  Car,
  Star,
  Shield,
  ClipboardList,
  Headphones,
  Wallet,
} from "lucide-react";

interface MenuItem {
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const superAdminMenuItems: MenuItem[] = [
  { label: "Dashboard", route: "/super-admin/dashboard", icon: LayoutDashboard },
  { label: "Companies", route: "/super-admin/companies", icon: Building2 },
  { label: "Users Management", route: "/super-admin/users", icon: Users },
  { label: "Permissions & Roles", route: "/super-admin/roles", icon: Lock },
  { label: "Customers (All)", route: "/super-admin/customers", icon: Users },
  { label: "Transactions (All)", route: "/super-admin/transactions", icon: Receipt },
  { label: "Reports & Analytics", route: "/super-admin/reports", icon: BarChart3 },
  { label: "System Monitoring", route: "/super-admin/monitoring", icon: Activity },
  { label: "Subscriptions & Plans", route: "/super-admin/subscriptions", icon: CreditCard },
  { label: "Announcements", route: "/super-admin/announcements", icon: Megaphone },
  { label: "Support & Tickets", route: "/super-admin/support", icon: MessageSquare },
  { label: "System Settings", route: "/super-admin/settings", icon: Settings },
];

const superAdminAccountItems: MenuItem[] = [
  { label: "Profile Settings", route: "/super-admin/profile", icon: UserCircle },
];

const companyOwnerMenuItems: MenuItem[] = [
  { label: "Dashboard", route: "/company-owner/dashboard", icon: LayoutDashboard },
  { label: "My Listings", route: "/company-owner/listings", icon: Home },
  { label: "Properties", route: "/company-owner/properties", icon: Building2 },
  { label: "Vehicles", route: "/company-owner/vehicles", icon: Car },
  { label: "Customers", route: "/company-owner/customers", icon: Users },
  { label: "Transactions", route: "/company-owner/transactions", icon: Receipt },
  { label: "Analytics", route: "/company-owner/analytics", icon: BarChart3 },
  { label: "Messages", route: "/company-owner/messages", icon: MessageSquare },
  { label: "Payments", route: "/company-owner/payments", icon: Wallet },
  { label: "Settings", route: "/company-owner/settings", icon: Settings },
];

const companyOwnerAccountItems: MenuItem[] = [
  { label: "Profile Settings", route: "/company-owner/profile", icon: UserCircle },
];

const customerMenuItems: MenuItem[] = [
  { label: "Home", route: "/customer/dashboard", icon: LayoutDashboard },
  { label: "Browse Properties", route: "/customer/properties", icon: Home },
  { label: "Browse Vehicles", route: "/customer/vehicles", icon: Car },
  { label: "My Favorites", route: "/customer/favorites", icon: Star },
  { label: "Messages", route: "/customer/messages", icon: MessageSquare },
  { label: "My Bookings", route: "/customer/bookings", icon: ClipboardList },
  { label: "Transactions", route: "/customer/transactions", icon: Receipt },
  { label: "Escrow", route: "/customer/escrow", icon: Shield },
  { label: "Reviews", route: "/customer/reviews", icon: Star },
  { label: "Support", route: "/customer/support", icon: Headphones },
  { label: "Settings", route: "/customer/settings", icon: Settings },
];

const customerAccountItems: MenuItem[] = [
  { label: "Profile Settings", route: "/customer/profile", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isSuperAdmin = pathname.startsWith("/super-admin");
  const isCompanyOwner = pathname.startsWith("/company-owner");

  const menuItems = isSuperAdmin
    ? superAdminMenuItems
    : isCompanyOwner
    ? companyOwnerMenuItems
    : customerMenuItems;

  const accountItems = isSuperAdmin
    ? superAdminAccountItems
    : isCompanyOwner
    ? companyOwnerAccountItems
    : customerAccountItems;

  const roleLabel = isSuperAdmin ? "SUPER ADMIN" : isCompanyOwner ? "COMPANY OWNER" : "CUSTOMER";

  const userName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName || ""}`.trim()
    : user?.email?.split("@")[0] || "Admin";

  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (route: string) => pathname === route || pathname.startsWith(route + "/");

  return (
    <>
      {/* Mobile toggle */}
      {mounted && (
        <button
          onClick={toggleCollapse}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <LayoutDashboard className="w-5 h-5 text-slate-600" />
        </button>
      )}

      {/* Mobile backdrop */}
      {mounted && !isCollapsed && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={toggleCollapse} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-blue-600 text-white
          border-r border-blue-500/30
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-56"}
          ${isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className={`px-4 py-4 border-b border-blue-500/30 ${isCollapsed ? "flex flex-col items-center gap-3" : ""}`}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-black text-sm">D</span>
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white leading-none">Dalaal</h1>
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-blue-200">{roleLabel}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-blue-700/40">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold shrink-0">
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">{userName}</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[9px] text-green-300 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-1">
                <span className="text-blue-600 font-black text-sm">D</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold relative">
                {userInitials}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-blue-600" />
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto custom-scrollbar py-3 ${isCollapsed ? "px-2" : "px-3"}`}>
          {!isCollapsed && (
            <p className="px-1 mb-2 text-[9px] font-bold uppercase tracking-widest text-blue-200">Navigation</p>
          )}

          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.route);
              return (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    title={isCollapsed ? item.label : undefined}
                    className={`
                      flex items-center rounded-lg transition-all duration-150
                      ${isCollapsed ? "justify-center p-2.5" : "gap-2.5 px-2.5 py-2"}
                      ${active ? "bg-white/15 text-white" : "text-blue-100 hover:bg-white/10 hover:text-white"}
                    `}
                  >
                    <Icon size={18} className={`shrink-0 ${active ? "text-white" : "text-blue-200"}`} />
                    {!isCollapsed && <span className="text-[13px] font-medium truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Account */}
          {!isCollapsed && (
            <>
              <p className="px-1 mt-5 mb-2 text-[9px] font-bold uppercase tracking-widest text-blue-200">Account</p>
              <ul className="space-y-0.5">
                {accountItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.route);
                  return (
                    <li key={item.route}>
                      <Link
                        href={item.route}
                        className={`
                          flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150
                          ${active ? "bg-white/15 text-white" : "text-blue-100 hover:bg-white/10 hover:text-white"}
                        `}
                      >
                        <Icon size={18} className={`shrink-0 ${active ? "text-white" : "text-blue-200"}`} />
                        <span className="text-[13px] font-medium truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg w-full text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-150"
                  >
                    <LogOut size={18} className="shrink-0 text-blue-200" />
                    <span className="text-[13px] font-medium truncate">Log out</span>
                  </button>
                </li>
              </ul>
            </>
          )}

          {isCollapsed && (
            <div className="mt-4 space-y-0.5">
              {accountItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.route);
                return (
                  <li key={item.route} className="list-none">
                    <Link
                      href={item.route}
                      title={item.label}
                      className={`flex items-center justify-center p-2.5 rounded-lg transition-all duration-150 ${active ? "bg-white/15 text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"}`}
                    >
                      <Icon size={18} />
                    </Link>
                  </li>
                );
              })}
              <button
                onClick={() => logout()}
                title="Log out"
                className="flex items-center justify-center p-2.5 rounded-lg w-full text-blue-200 hover:bg-white/10 hover:text-white transition-all duration-150"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className={`px-4 py-3 border-t border-blue-500/30 ${isCollapsed ? "flex justify-center" : ""}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-300 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-blue-100">Dalaal Platform</p>
                <p className="text-[8px] text-blue-200">Secure Marketplace</p>
              </div>
            </div>
          ) : (
            <ShieldCheck size={16} className="text-green-300/60" />
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          className="absolute top-12 right-0 translate-x-1/2 z-[100] w-6 h-6 rounded-full bg-blue-600 border border-blue-400/50 hover:bg-blue-500 text-blue-200 hover:text-white flex items-center justify-center transition-all duration-200 hidden lg:flex"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <PanelLeft size={12} /> : <PanelLeftClose size={12} />}
        </button>
      </aside>
    </>
  );
}
