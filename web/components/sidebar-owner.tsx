"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar"

const navData = {
  navMain: [
    { title: "Dashboard", url: "/pages/owner", items: [] },
    { title: "My Properties", url: "/pages/owner/properties", items: [
      { title: "All Properties", url: "/pages/owner/properties" },
      { title: "Add Property", url: "/pages/owner/properties/create" },
    ]},
    { title: "My Vehicles", url: "/pages/owner/vehicles", items: [
      { title: "All Vehicles", url: "/pages/owner/vehicles" },
      { title: "Add Vehicle", url: "/pages/owner/vehicles/create" },
    ]},
    { title: "Messages", url: "/pages/owner/messages", items: [] },
    { title: "Payments", url: "/pages/owner/payments", items: [] },
    { title: "Settings", url: "/pages/owner/settings", items: [] },
  ],
}

export function OwnerSidebar({ user }: { user: any }) {
  const navUser = user ? { name: user.profile?.firstName || user.email?.split("@")[0] || "Owner", email: user.email || "", avatar: user.profile?.avatar || "" } : null
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">D</span>
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground">Dalaal</span>
            <span className="ml-1.5 text-[10px] font-semibold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full">Owner</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={navData.navMain} accentColor="orange" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
