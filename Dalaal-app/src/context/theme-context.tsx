import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  themeMode: ThemeMode;
  scheme: 'light' | 'dark';
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme() as 'light' | 'dark' | null;
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const scheme = themeMode === 'system' ? (systemScheme ?? 'light') : themeMode;
  const isDark = scheme === 'dark';

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      scheme,
      isDark,
      setThemeMode,
      toggleTheme: () => setThemeMode((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [isDark, scheme, themeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }

  return context;
}
