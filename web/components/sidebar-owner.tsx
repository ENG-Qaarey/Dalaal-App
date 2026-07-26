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
    { title: "Settings", url: "/pages/owner/settings", items: [] },
  ],
}

export function OwnerSidebar({ user }: { user: any }) {
  const navUser = user ? { name: user.profile?.firstName || user.email?.split("@")[0] || "Owner", email: user.email || "", avatar: user.profile?.avatar || "" } : null
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2">
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
