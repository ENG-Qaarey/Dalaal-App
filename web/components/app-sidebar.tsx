"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, UsersIcon, MapPinIcon, CarIcon, BanknoteIcon, CreditCardIcon, ShieldCheckIcon, FileTextIcon, SettingsIcon, HomeIcon, BarChart3Icon } from "lucide-react"

const data = {
  user: {
    name: "Muscab Qaareey",
    email: "muscabqaareey@gmail.com",
    avatar: "",
  },
  teams: [
    {
      name: "Dalaal Admin",
      logo: <ShieldCheckIcon className="size-4" />,
      plan: "Super Admin",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/super-admin",
      icon: <LayoutDashboardIcon />,
      isActive: true,
      items: [
        { title: "Overview", url: "/super-admin" },
        { title: "Analytics", url: "/super-admin/analytics" },
        { title: "Reports", url: "/super-admin/reports" },
      ],
    },
    {
      title: "Users & Brokers",
      url: "/super-admin/users",
      icon: <UsersIcon />,
      items: [
        { title: "All Users", url: "/super-admin/users" },
        { title: "Brokers", url: "/super-admin/users/brokers" },
        { title: "Roles", url: "/super-admin/users/roles" },
      ],
    },
    {
      title: "Properties",
      url: "/super-admin/properties",
      icon: <HomeIcon />,
      items: [
        { title: "All Listings", url: "/super-admin/properties" },
        { title: "Pending Approval", url: "/super-admin/properties/pending" },
        { title: "Categories", url: "/super-admin/properties/categories" },
      ],
    },
    {
      title: "Vehicles",
      url: "/super-admin/vehicles",
      icon: <CarIcon />,
      items: [
        { title: "All Vehicles", url: "/super-admin/vehicles" },
        { title: "Pending Approval", url: "/super-admin/vehicles/pending" },
        { title: "Categories", url: "/super-admin/vehicles/categories" },
      ],
    },
    {
      title: "Payments API",
      url: "/super-admin/payments",
      icon: <CreditCardIcon />,
      items: [
        { title: "Transactions", url: "/super-admin/payments" },
        { title: "EVC Plus", url: "/super-admin/payments/evc" },
        { title: "Zaad", url: "/super-admin/payments/zaad" },
      ],
    },
    {
      title: "Settings",
      url: "/super-admin/settings",
      icon: <SettingsIcon />,
      items: [
        { title: "General", url: "/super-admin/settings" },
        { title: "Security", url: "/super-admin/settings/security" },
        { title: "Notifications", url: "/super-admin/settings/notifications" },
      ],
    },
  ],
  projects: [
    {
      name: "Escrow Vault",
      url: "/super-admin/escrow",
      icon: <BanknoteIcon />,
    },
    {
      name: "Location Map",
      url: "/super-admin/map",
      icon: <MapPinIcon />,
    },
    {
      name: "Activity Logs",
      url: "/super-admin/logs",
      icon: <FileTextIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
