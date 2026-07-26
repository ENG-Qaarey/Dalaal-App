"use client";

import { AdminSidebar } from "@/components/sidebar-admin";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ThemeToggle from "@/components/theme-toggle";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset className="h-svh overflow-hidden">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden sm:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 pl-9 pr-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800 transition-shadow"
              />
            </div>
            <ThemeToggle />
            <button className="relative w-9 h-9 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-zinc-900 dark:bg-white rounded-full" />
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
