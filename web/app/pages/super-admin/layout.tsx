import { AppSidebar } from "@/components/app-sidebar";
import { SuperAdminBreadcrumb } from "@/components/admin/super-admin-breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ThemeToggle from "@/components/theme-toggle";
import { Bell, Search } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-background/80 px-4 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <SuperAdminBreadcrumb />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden sm:block w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search dashboards..."
                className="h-9 w-full rounded-xl border border-border bg-zinc-100/80 pl-9 pr-4 text-sm outline-none ring-0 transition focus:border-primary/60 focus:bg-background dark:bg-zinc-900/70"
              />
            </div>

            <ThemeToggle />

            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-zinc-500 transition hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
