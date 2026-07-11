"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { SettingsIcon } from "lucide-react"

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
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xs">D</span>
          <div>
            <span className="text-sm font-black">Dalaal</span>
            <span className="ml-1.5 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-950 px-1.5 py-0.5 rounded-full">Owner</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
