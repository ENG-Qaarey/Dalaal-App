"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { useSidebarStore } from "@/store/sidebar.store";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isCollapsed ? "4rem" : "14rem" }}
      >
        <Topbar />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
