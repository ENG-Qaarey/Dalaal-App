"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { HomeIcon, HeartIcon, MessageSquareIcon, SettingsIcon, HelpCircleIcon } from "lucide-react"

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
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs">D</span>
          <span className="text-sm font-black">Dalaal</span>
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
