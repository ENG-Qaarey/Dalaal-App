import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/lib/language-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeInitializer from "@/components/ThemeInitializer";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dalaal — Somalia's Trusted Real Estate & Vehicle Marketplace",
  description: "Browse verified properties, rent vehicles, and transact safely using escrow-protected mobile money payments across Somalia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <head>
<ThemeInitializer />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <TooltipProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
