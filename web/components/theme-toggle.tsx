"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dalaal-theme");
    if (
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dalaal-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dalaal-theme", "light");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/40 dark:border-zinc-700/40 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="relative w-4 h-4">
        {/* Sun Icon – shown in dark mode (click to go light) */}
        <Sun
          className={`w-4 h-4 absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-50"
          }`}
        />
        {/* Moon Icon – shown in light mode (click to go dark) */}
        <Moon
          className={`w-4 h-4 absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-0 -rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
      </div>
    </button>
  );
}
