import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { LanguageProvider } from '@/lib/LanguageContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <Component {...pageProps} />
        <Toaster position="top-right" richColors />
      </LanguageProvider>
    </ThemeProvider>
  );
}
