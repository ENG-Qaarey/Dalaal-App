import type { AppProps } from 'next/app';
import 'antd/dist/reset.css';
import '@/styles/globals.css';
import { ConfigProvider } from 'antd';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563eb',
            colorSuccess: '#059669',
            borderRadius: 14,
            fontFamily: 'inherit',
          },
        }}
      >
        <LanguageProvider>
          <AuthProvider>
            <Component {...pageProps} />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </LanguageProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}
