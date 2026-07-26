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
  Building2,
  PlusCircle,
  Users,
  MessageSquare,
  Settings,
  User,
  Star,
  Bell,
  FileText,
  Zap,
} from "lucide-react";

const brokerNavSections = [
  {
    label: "MAIN NAVIGATION",
    items: [
      { title: "Dashboard", url: "/pages/broker", icon: LayoutDashboard },
      {
        title: "Listings",
        url: "/pages/broker/listings",
        icon: Building2,
        items: [
          { title: "All Listings", url: "/pages/broker/listings" },
          { title: "Create Listing", url: "/pages/broker/listings/create" },
          { title: "Performance", url: "/pages/broker/listings/performance" },
        ],
      },
      { title: "Clients & Leads", url: "/pages/broker/clients", icon: Users },
      {
        title: "Messages",
        url: "/pages/broker/messages",
        icon: MessageSquare,
        badge: 3,
      },
      { title: "Reviews", url: "/pages/broker/reviews", icon: Star },
      {
        title: "Notifications",
        url: "/pages/broker/notifications",
        icon: Bell,
      },
      { title: "Reports", url: "/pages/broker/reports", icon: FileText },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        title: "Profile & Settings",
        url: "/pages/broker/settings",
        icon: User,
      },
    ],
  },
];

export function BrokerSidebar({ user }: { user: any }) {
  const name =
    user?.profile?.firstName || user?.email?.split("@")[0] || "Dalaal Broker";
  const navUser = user
    ? {
        name,
        email: user.email || "broker@dalaal.so",
        avatar: user.profile?.avatar || "",
      }
    : { name: "Dalaal Broker", email: "broker@dalaal.so", avatar: "" };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-3">
        {/* User Quick Pill */}
        <div className="p-2 rounded-xl bg-sidebar-accent/50 border border-sidebar-border flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
            {name[0]?.toUpperCase() || "B"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-sidebar-foreground truncate">
              {name}
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
              ONLINE
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-1">
        <NavMain sections={brokerNavSections} accentColor="blue" />
      </SidebarContent>

      <SidebarFooter className="p-2 space-y-2">
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-900/60 to-indigo-950/60 border border-blue-800/40 text-white group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              D
            </div>
            <span className="text-xs font-bold">Broker Portal</span>
          </div>
        </div>

        <NavUser user={navUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
