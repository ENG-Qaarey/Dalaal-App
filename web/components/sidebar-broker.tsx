"use client"
import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { SettingsIcon } from "lucide-react"

const navData = {
  navMain: [
    { title: "Dashboard", url: "/pages/broker", items: [] },
    { title: "My Listings", url: "/pages/broker/listings", items: [
      { title: "All Listings", url: "/pages/broker/listings" },
      { title: "Create Listing", url: "/pages/broker/listings/create" },
    ]},
    { title: "Clients", url: "/pages/broker/clients", items: [] },
    { title: "Messages", url: "/pages/broker/messages", items: [] },
    { title: "Payments", url: "/pages/broker/payments", items: [] },
    { title: "Settings", url: "/pages/broker/settings", items: [] },
  ],
}

export function BrokerSidebar({ user }: { user: any }) {
  const navUser = user ? { name: user.profile?.firstName || user.email?.split("@")[0] || "Broker", email: user.email || "", avatar: user.profile?.avatar || "" } : null
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">D</span>
          <div>
            <span className="text-sm font-black">Dalaal</span>
            <span className="ml-1.5 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded-full">Broker</span>
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
