"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Heart,
  Settings,
  User,
  Users,
  Building,
  BarChart3,
  Shield,
  LogOut,
  ChevronDown,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Properties", href: "/dashboard/properties", icon: Building2 },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: 3 },
  { title: "Saved", href: "/dashboard/saved", icon: Heart },
]

const accountNavItems: NavItem[] = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
  { title: "Profile", href: "/dashboard/profile", icon: User },
]

const adminNavItems: NavItem[] = [
  { title: "Users", href: "/dashboard/users", icon: Users },
  { title: "All Properties", href: "/dashboard/all-properties", icon: Building },
  { title: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { title: "System", href: "/dashboard/system", icon: Shield },
]

export function AppSidebar() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(href + "/")

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2.5 px-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/10">
                  <span className="text-[10px] font-black tracking-tighter">DP</span>
                </div>
                <span className="text-base font-black tracking-tighter text-slate-900 dark:text-white group-data-[collapsible=icon]:hidden">
                  Dalaal<span className="text-sky-500">Prime</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className={cn(
                      "h-9 px-3 rounded-lg transition-all duration-200",
                      isActive(item.href) 
                        ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("size-4 transition-transform duration-200", isActive(item.href) && "scale-105")} />
                      <span className="text-xs ml-0.5">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="bg-sky-500 text-white font-bold px-1 py-0.5 rounded-full scale-[0.65] origin-right">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {accountNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className={cn(
                      "h-9 px-3 rounded-lg transition-all duration-200",
                      isActive(item.href) 
                        ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("size-4 transition-transform duration-200", isActive(item.href) && "scale-105")} />
                      <span className="text-xs ml-0.5">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === "admin" && (
          <SidebarGroup className="mt-2">
            <SidebarGroupLabel className="px-3 text-[9px] font-black uppercase tracking-[0.2em] text-sky-500/80 mb-1">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      className={cn(
                        "h-9 px-3 rounded-lg transition-all duration-200",
                        isActive(item.href) 
                          ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className={cn("size-4 transition-transform duration-200", isActive(item.href) && "scale-105")} />
                        <span className="text-xs ml-0.5">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu className="mb-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "h-9 px-3 rounded-lg transition-all duration-200 text-slate-500 hover:text-red-500 hover:bg-red-500/5",
                "group-data-[collapsible=icon]:!justify-center"
              )}
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span className="text-xs ml-0.5 font-bold group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className={cn(
          "flex items-center gap-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 p-2 backdrop-blur-md",
          "group-data-[collapsible=icon]:!flex-col group-data-[collapsible=icon]:!p-1.5"
        )}>
          <div className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-sm",
            "group-data-[collapsible=icon]:h-6 w-6"
          )}>
            <span className="text-[10px] font-black uppercase">{user?.firstName?.charAt(0) || "U"}</span>
          </div>
          <div className={cn(
            "flex-1 overflow-hidden",
            "group-data-[collapsible=icon]:hidden"
          )}>
            <p className="truncate text-xs font-black text-slate-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-[9px] font-black uppercase tracking-wider text-sky-500/80">
              {user?.role}
            </p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}