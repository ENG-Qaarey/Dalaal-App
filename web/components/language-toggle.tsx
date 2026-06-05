"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-200/40 dark:border-zinc-700/40 transition-colors cursor-pointer"
    >
      <Globe className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      <span>{lang === "en" ? "EN / SO" : "SO / EN"}</span>
    </button>
  );
}
