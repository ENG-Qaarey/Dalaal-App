"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";
import { Bell, Search, ChevronRight } from "lucide-react";

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += "/" + seg;
    crumbs.push({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: path,
    });
  }
  return crumbs;
}

export default function Topbar() {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md pl-14 lg:pl-4 pr-4 transition-all duration-300">
      <nav className="hidden sm:flex items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3 h-3 text-zinc-400" />}
            <span
              className={
                i === crumbs.length - 1
                  ? "font-bold text-zinc-900 dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden sm:block w-56">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow"
          />
        </div>

        <LanguageToggle />
        <ThemeToggle />

        <button className="relative w-9 h-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
        </button>
      </div>
    </header>
  );
}
