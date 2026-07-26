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
  Users,
  Receipt,
  BarChart3,
  Activity,
  HelpCircle,
  Settings,
  Zap,
  MessageSquare,
  ShoppingCart,
  FileText,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  Bell,
  Car,
  Home,
  Briefcase,
  NotepadText,
  Star,
  FileSearch,
  Send,
  ScrollText,
  Lock,
  LogOut,
} from "lucide-react";

const adminNavSections = [
  {
    label: "SUPER ADMIN SIDEBAR",
    items: [
      { title: "Dashboard", url: "/pages/admin", icon: LayoutDashboard },
      {
        title: "User Management",
        url: "/pages/admin/users",
        icon: Users,
        items: [
          { title: "All Users", url: "/pages/admin/users" },
          { title: "Brokers", url: "/pages/admin/users/brokers" },
          { title: "Vehicle Owners", url: "/pages/admin/users/vehicle-owners" },
          { title: "Customers", url: "/pages/admin/users/customers" },
        ],
      },
      {
        title: "Listings",
        url: "/pages/admin/listings",
        icon: Building2,
        items: [
          { title: "All Listings", url: "/pages/admin/listings" },
          { title: "Properties", url: "/pages/admin/properties" },
          { title: "Vehicles", url: "/pages/admin/vehicles" },
          { title: "Pending Listings", url: "/pages/admin/properties/pending" },
          { title: "Featured Listings", url: "/pages/admin/featured-listings" },
        ],
      },
      {
        title: "Communication",
        url: "/pages/admin/contact-messages",
        icon: MessageSquare,
        items: [
          { title: "Contact Messages", url: "/pages/admin/contact-messages" },
          { title: "Notifications", url: "/pages/admin/notifications" },
          { title: "Announcements", url: "/pages/admin/announcements" },
        ],
      },
      { title: "Reviews", url: "/pages/admin/reviews", icon: Star },
      {
        title: "Reports",
        url: "/pages/admin/reports",
        icon: FileText,
        items: [
          { title: "Reports", url: "/pages/admin/reports" },
          { title: "Analytics", url: "/pages/admin/analytics" },
        ],
      },
      {
        title: "Administration",
        url: "/pages/admin/audit-logs",
        icon: Activity,
        items: [
          { title: "Audit Logs", url: "/pages/admin/audit-logs" },
          { title: "FAQs", url: "/pages/admin/faqs" },
          { title: "Categories", url: "/pages/admin/categories" },
        ],
      },
      { title: "Settings", url: "/pages/admin/settings", icon: Settings },
      { title: "Logout", url: "/", icon: LogOut },
    ],
  },
];

export function AdminSidebar({ user }: { user: any }) {
  const navUser = user
    ? {
        name: user.profile?.firstName
          ? `${user.profile.firstName} ${user.profile.lastName || ""}`.trim()
          : user.email?.split("@")[0] || "System Owner",
        email: user.email || "superadmin@dalaal.so",
        avatar: user.profile?.avatar || "",
      }
    : { name: "System Owner", email: "superadmin@dalaal.so", avatar: "" };

  const displayName = navUser.name;
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-3">
        <div className="p-2 rounded-xl bg-sidebar-accent/50 border border-sidebar-border flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-sidebar-foreground truncate">{displayName}</div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ADMIN
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-1">
        <NavMain sections={adminNavSections} accentColor="blue" />
      </SidebarContent>

      <SidebarFooter className="p-2 space-y-2">
        <NavUser user={navUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}