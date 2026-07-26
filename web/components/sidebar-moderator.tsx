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
