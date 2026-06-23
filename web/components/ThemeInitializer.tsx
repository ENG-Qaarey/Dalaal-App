'use client';

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    try {
      const t = localStorage.getItem("dalaal-theme");
      if (t === "dark" || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // ignore errors
    }
  }, []);

  return null;
}
