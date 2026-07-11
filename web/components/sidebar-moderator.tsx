"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar"

const navData = {
  navMain: [
    { title: "Dashboard", url: "/pages/moderator", items: [] },
    { title: "Users", url: "/pages/moderator/users", items: [] },
    { title: "Listings", url: "/pages/moderator/listings", items: [] },
    { title: "Reports", url: "/pages/moderator/reports", items: [] },
    { title: "Settings", url: "/pages/moderator/settings", items: [] },
  ],
}

export function ModeratorSidebar({ user }: { user: any }) {
  const navUser = user ? { name: user.profile?.firstName || user.email?.split("@")[0] || "Moderator", email: user.email || "", avatar: user.profile?.avatar || "" } : null
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">D</span>
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground">Dalaal</span>
            <span className="ml-1.5 text-[10px] font-semibold text-violet-500 bg-violet-500/10 px-1.5 py-0.5 rounded-full">Moderator</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={navData.navMain} accentColor="violet" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
