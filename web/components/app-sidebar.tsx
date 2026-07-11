"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { ShieldCheckIcon, BanknoteIcon, MapPinIcon, FileTextIcon } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const data = {
  navMain: [
    { title: "Dashboard", url: "/pages/super-admin", items: [
      { title: "Overview", url: "/pages/super-admin" },
      { title: "Analytics", url: "/pages/super-admin/analytics" },
      { title: "Reports", url: "/pages/super-admin/reports" },
    ]},
    { title: "Users", url: "/pages/super-admin/users", items: [
      { title: "All Users", url: "/pages/super-admin/users" },
      { title: "Brokers", url: "/pages/super-admin/users/brokers" },
      { title: "Roles", url: "/pages/super-admin/users/roles" },
    ]},
    { title: "Properties", url: "/pages/super-admin/properties", items: [
      { title: "All Listings", url: "/pages/super-admin/properties" },
      { title: "Pending Approval", url: "/pages/super-admin/properties/pending" },
      { title: "Categories", url: "/pages/super-admin/properties/categories" },
    ]},
    { title: "Vehicles", url: "/pages/super-admin/vehicles", items: [
      { title: "All Vehicles", url: "/pages/super-admin/vehicles" },
      { title: "Pending Approval", url: "/pages/super-admin/vehicles/pending" },
      { title: "Categories", url: "/pages/super-admin/vehicles/categories" },
    ]},
    { title: "Payments", url: "/pages/super-admin/payments", items: [
      { title: "Transactions", url: "/pages/super-admin/payments" },
      { title: "EVC Plus", url: "/pages/super-admin/payments/evc" },
      { title: "Zaad", url: "/pages/super-admin/payments/zaad" },
    ]},
    { title: "Escrow", url: "/pages/super-admin/escrow", items: [] },
    { title: "Settings", url: "/pages/super-admin/settings", items: [] },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const userName = user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim() : user?.email?.split("@")[0] || "Admin"
  const userEmail = user?.email || "admin@dalaal.so"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xs">D</span>
          <div>
            <span className="text-sm font-black">Dalaal</span>
            <span className="ml-1.5 text-[10px] font-bold text-sky-500 bg-sky-50 dark:bg-sky-950 px-1.5 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: userName, email: userEmail, avatar: user?.profile?.avatar || "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
