"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { SettingsIcon } from "lucide-react"

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
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white font-black text-xs">D</span>
          <div>
            <span className="text-sm font-black">Dalaal</span>
            <span className="ml-1.5 text-[10px] font-bold text-violet-500 bg-violet-50 dark:bg-violet-950 px-1.5 py-0.5 rounded-full">Moderator</span>
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
