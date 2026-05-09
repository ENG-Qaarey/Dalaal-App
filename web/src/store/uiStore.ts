'use client';

import { create } from 'zustand';

interface UIState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  setIsDarkMode: (value: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  isSidebarOpen: true,
  setIsDarkMode: (value) => set({ isDarkMode: value }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (value) => set({ isSidebarOpen: value }),
}));
