"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useSidebarStore } from "../../store/sidebar.store";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-zinc-100 font-sans antialiased">
      <Sidebar />
      <div
        className={`transition-all duration-300 flex flex-col min-h-screen ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Topbar />
        <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
