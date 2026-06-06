"use client";

import { Search, Bell, Menu } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  // Create simple breadcrumb from pathname
  const paths = pathname.split('/').filter(p => p);
  const breadcrumb = paths.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {breadcrumb}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative hidden sm:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800 transition-shadow"
          />
        </div>

        <LanguageToggle />
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-zinc-900 dark:bg-white rounded-full" />
        </button>

        {/* User Nav */}
        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 cursor-pointer">
          SA
        </div>
      </div>
    </header>
  );
}
