"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Search,
  Heart,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Settings,
  User,
  Zap,
} from "lucide-react";

const customerNavSections = [
  {
    label: "MAIN NAVIGATION",
    items: [
      { title: "Dashboard", url: "/pages/customer", icon: LayoutDashboard },
      { title: "Search & Inquire Properties", url: "/pages/customer/search", icon: Search },
      { title: "My Saved Favorites", url: "/pages/customer/favorites", icon: Heart },
      { title: "Viewing Appointments", url: "/pages/customer/bookings", icon: Calendar },
      { title: "Messages & Inquiries", url: "/pages/customer/messages", icon: MessageSquare },
      { title: "Account Settings", url: "/pages/customer/settings", icon: Settings },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { title: "Profile Management", url: "/pages/customer/settings", icon: User },
    ],
  },
];

export function CustomerSidebar({ user }: { user: any }) {
  const name = user?.profile?.firstName || user?.email?.split("@")[0] || "Customer";
  const navUser = user
    ? {
        name,
        email: user.email || "customer@dalaal.so",
        avatar: user.profile?.avatar || "",
      }
    : { name: "Customer", email: "customer@dalaal.so", avatar: "" };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-3">
        {/* User Quick Pill */}
        <div className="p-2 rounded-xl bg-sidebar-accent/50 border border-sidebar-border flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
            {name[0]?.toUpperCase() || "C"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-sidebar-foreground truncate">{name}</div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-1">
        <NavMain sections={customerNavSections} accentColor="emerald" />
      </SidebarContent>

      <SidebarFooter className="p-2 space-y-2">
        <NavUser user={navUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
