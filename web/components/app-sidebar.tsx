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
  BarChart3,
  FileText,
  Settings,
} from "lucide-react"

const navSections = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/pages/admin", icon: LayoutDashboard, items: [
        { title: "Overview", url: "/pages/admin" },
        { title: "Analytics", url: "/pages/admin/analytics" },
        { title: "Reports", url: "/pages/admin/reports" },
      ]},
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Users", url: "/pages/admin/users", icon: Users, badge: 0, items: [
        { title: "All Users", url: "/pages/admin/users" },
        { title: "Brokers", url: "/pages/admin/users/brokers" },
      ]},
      { title: "Properties", url: "/pages/admin/properties", icon: Home, badge: 0, items: [
        { title: "All Listings", url: "/pages/admin/properties" },
        { title: "Pending Approval", url: "/pages/admin/properties/pending" },
        { title: "Categories", url: "/pages/admin/properties/categories" },
      ]},
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", url: "/pages/admin/settings", icon: Settings, items: [] },
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
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">D</span>
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground">Dalaal</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold text-violet-500 bg-violet-500/10 px-1.5 py-0.5 rounded-full">Admin</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <NavMain sections={navSections} accentColor="violet" />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-0">
        <NavUser user={{ name: userName, email: userEmail, avatar: user?.profile?.avatar || "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
