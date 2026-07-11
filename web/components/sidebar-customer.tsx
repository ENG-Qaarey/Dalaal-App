"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar"

const navData = {
  navMain: [
    { title: "Home", url: "/pages/customer", items: [] },
    { title: "My Favorites", url: "/pages/customer/favorites", items: [] },
    { title: "Messages", url: "/pages/customer/messages", items: [] },
    { title: "My Bookings", url: "/pages/customer/bookings", items: [] },
    { title: "Settings", url: "/pages/customer/settings", items: [] },
  ],
}

export function CustomerSidebar({ user }: { user: any }) {
  const navUser = user ? { name: user.profile?.firstName || user.email?.split("@")[0] || "User", email: user.email || "", avatar: user.profile?.avatar || "" } : null
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">D</span>
          </div>
          <span className="text-sm font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Dalaal</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={navData.navMain} accentColor="emerald" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
