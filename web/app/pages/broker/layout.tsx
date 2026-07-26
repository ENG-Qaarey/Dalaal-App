"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import ThemeToggle from "@/components/theme-toggle";
import { BrokerSidebar } from "@/components/sidebar-broker";
import { Search, Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/pages/broker": "Broker Performance Dashboard",
  "/pages/broker/listings": "My Listings",
  "/pages/broker/listings/create": "Create Listing",
  "/pages/broker/listings/performance": "Performance Analytics",
  "/pages/broker/clients": "Customer Leads & Clients",
  "/pages/broker/messages": "Messages & Inquiries",
  "/pages/broker/settings": "Agency Settings",
  "/pages/broker/reviews": "Reviews & Feedback",
  "/pages/broker/notifications": "Notifications",
  "/pages/broker/reports": "Reports & Insights",
};

// Dynamic title matching for paths like /pages/broker/listings/[id]/edit
function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (/^\/pages\/broker\/listings\/[^/]+\/edit$/.test(pathname))
    return "Edit Listing";
  return "Broker Portal";
}

export default function BrokerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const name =
    user?.profile?.firstName || user?.email?.split("@")[0] || "Broker";
  const title = getPageTitle(pathname);

  return (
    <SidebarProvider>
      <BrokerSidebar user={user} />
      <SidebarInset className="flex min-h-screen flex-1 flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden w-64 sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search broker workspace..."
                className="h-9 w-full rounded-[10px] border-none bg-zinc-100 pl-9 pr-4 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:bg-zinc-900 dark:focus:ring-zinc-800"
              />
            </div>
            <ThemeToggle />
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-white" />
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {name}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full p-6 pt-4 pb-12">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
