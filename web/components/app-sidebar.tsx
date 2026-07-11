"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  Users,
  Home,
  Car,
  CreditCard,
  ShieldCheck,
  Settings,
} from "lucide-react"

const navSections = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/pages/super-admin", icon: LayoutDashboard, items: [
        { title: "Overview", url: "/pages/super-admin" },
        { title: "Analytics", url: "/pages/super-admin/analytics" },
        { title: "Reports", url: "/pages/super-admin/reports" },
      ]},
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Users", url: "/pages/super-admin/users", icon: Users, badge: 3, items: [
        { title: "All Users", url: "/pages/super-admin/users" },
        { title: "Brokers", url: "/pages/super-admin/users/brokers" },
        { title: "Roles", url: "/pages/super-admin/users/roles" },
      ]},
      { title: "Properties", url: "/pages/super-admin/properties", icon: Home, badge: 5, items: [
        { title: "All Listings", url: "/pages/super-admin/properties" },
        { title: "Pending Approval", url: "/pages/super-admin/properties/pending" },
        { title: "Categories", url: "/pages/super-admin/properties/categories" },
      ]},
      { title: "Vehicles", url: "/pages/super-admin/vehicles", icon: Car, badge: 2, items: [
        { title: "All Vehicles", url: "/pages/super-admin/vehicles" },
        { title: "Pending Approval", url: "/pages/super-admin/vehicles/pending" },
        { title: "Categories", url: "/pages/super-admin/vehicles/categories" },
      ]},
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Payments", url: "/pages/super-admin/payments", icon: CreditCard, items: [
        { title: "Transactions", url: "/pages/super-admin/payments" },
        { title: "EVC Plus", url: "/pages/super-admin/payments/evc" },
        { title: "Zaad", url: "/pages/super-admin/payments/zaad" },
      ]},
      { title: "Escrow", url: "/pages/super-admin/escrow", icon: ShieldCheck, items: [] },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", url: "/pages/super-admin/settings", icon: Settings, items: [] },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const userName = user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim() : user?.email?.split("@")[0] || "Admin"
  const userEmail = user?.email || "admin@dalaal.so"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">D</span>
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground">Dalaal</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-full">Admin</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <NavMain sections={navSections} accentColor="blue" />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-0">
        <NavUser user={{ name: userName, email: userEmail, avatar: user?.profile?.avatar || "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
