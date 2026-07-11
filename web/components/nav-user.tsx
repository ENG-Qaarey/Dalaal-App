"use client"

import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  ChevronsUpDown,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  HelpCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar?: string
  } | null
}) {
  const { isMobile } = useSidebar()
  const { logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("dalaal-theme")
    setIsDark(stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches))
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("dalaal-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("dalaal-theme", "light")
    }
  }

  if (!user) return null

  const name = user.name || "User"
  const email = user.email || ""
  const avatar = user.avatar || ""
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group/user h-auto rounded-lg px-3 py-2.5 hover:bg-sidebar-accent transition-colors duration-150 data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8 rounded-lg shrink-0 group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7">
                <AvatarImage src={avatar} alt={name} className="object-cover" />
                <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-foreground/60 font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* User Info — hidden when collapsed */}
              <div className="flex-1 min-w-0 text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-[13px] font-semibold text-sidebar-foreground block">{name}</span>
                <span className="truncate text-[11px] text-sidebar-foreground/50 block mt-0.5">{email}</span>
              </div>

              {/* Chevron — hidden when collapsed */}
              <ChevronsUpDown className="ml-1 size-4 text-sidebar-foreground/30 group-hover/user:text-sidebar-foreground/50 transition-colors group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-60 rounded-xl border-sidebar-border shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            {/* User Header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 border-b border-sidebar-border">
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage src={avatar} alt={name} className="object-cover" />
                  <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-foreground/60 font-semibold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="truncate font-semibold text-sm text-sidebar-foreground block">{name}</span>
                  <span className="truncate text-[11px] text-sidebar-foreground/50 block mt-0.5">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Menu Items */}
            <DropdownMenuGroup className="px-1.5 py-1">
              <DropdownMenuItem asChild className="rounded-lg h-9 cursor-pointer">
                <Link href="/pages/super-admin/settings" className="flex items-center gap-2.5 text-[13px] font-medium">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-sidebar-accent">
                    <User className="w-3.5 h-3.5 text-sidebar-foreground/50" />
                  </div>
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg h-9 cursor-pointer">
                <Link href="/pages/super-admin/payments" className="flex items-center gap-2.5 text-[13px] font-medium">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-sidebar-accent">
                    <CreditCard className="w-3.5 h-3.5 text-sidebar-foreground/50" />
                  </div>
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg h-9 cursor-pointer">
                <Link href="/pages/super-admin" className="flex items-center gap-2.5 text-[13px] font-medium">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-sidebar-accent">
                    <Bell className="w-3.5 h-3.5 text-sidebar-foreground/50" />
                  </div>
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg h-9 cursor-pointer">
                <Link href="/pages/super-admin/settings" className="flex items-center gap-2.5 text-[13px] font-medium">
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-sidebar-accent">
                    <Settings className="w-3.5 h-3.5 text-sidebar-foreground/50" />
                  </div>
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Theme Toggle */}
            <DropdownMenuGroup className="px-1.5 py-1">
              <DropdownMenuItem
                onClick={toggleTheme}
                className="rounded-lg h-9 cursor-pointer flex items-center gap-2.5 text-[13px] font-medium"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-sidebar-accent">
                  {isDark ? (
                    <Sun className="w-3.5 h-3.5 text-sidebar-foreground/50" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-sidebar-foreground/50" />
                  )}
                </div>
                {isDark ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg h-9 cursor-pointer flex items-center gap-2.5 text-[13px] font-medium">
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-sidebar-accent">
                  <HelpCircle className="w-3.5 h-3.5 text-sidebar-foreground/50" />
                </div>
                Help & Support
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <div className="px-1.5 pb-1.5">
              <DropdownMenuItem
                onClick={() => logout()}
                className="rounded-lg h-9 cursor-pointer flex items-center gap-2.5 text-[13px] font-medium text-red-500 hover:bg-red-500/8 focus:bg-red-500/8"
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-red-500/10">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
                Sign Out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
