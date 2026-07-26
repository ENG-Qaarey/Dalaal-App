"use client";

import Link from "next/link";
import {
  Smartphone,
  Shield,
  Video,
  CreditCard,
  QrCode,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";
import { useAuth } from "@/lib/auth-context";

export default function DownloadPage() {
  const { user } = useAuth();
  const roleHome = user?.role
    ? user.role === "SUPER_ADMIN" || user.role === "MODERATOR"
      ? "/pages/admin"
      : user.role === "BROKER" || user.role === "PROPERTY_OWNER" || user.role === "VEHICLE_OWNER"
      ? "/pages/broker"
      : "/pages/customer"
    : "/login";

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/75 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/20">
              D
            </span>
            <span className="text-xl font-black tracking-tight text-white">
              Dalaal<span className="text-sky-600">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            {user ? (
              <Link
                href={roleHome}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white transition-all shadow-md shadow-sky-600/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 text-xs font-bold text-sky-400">
            <Smartphone className="w-4 h-4" />
            <span>Available for iOS & Android</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Take Dalaal Platform in Your Pocket
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            Instant push notifications for price drops, real-time WebRTC audio & video calls with brokers, vertical Clips Reels, and one-click Mobile Money Escrow payments.
          </p>
        </div>

        {/* Download Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* iOS Card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.75 1.04-1.8 1.04-2.85 0-.14-.01-.29-.04-.42-.98.04-2.17.65-2.87 1.47-.58.67-.99 1.74-.99 2.8 0 .15.02.3.04.34 1.1-.08 2.24-.65 2.82-1.34z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Apple App Store</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Requires iOS 15.0 or later. Compatible with iPhone, iPad, and iPod touch.
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("iOS Beta TestFlight build active. Downloading build link..."); }}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm transition-all"
            >
              Download for iOS
            </a>
          </div>

          {/* Android Card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5516 0 .9997.4482.9997.9993 0 .5511-.4481.9997-.9997.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5516 0 .9997.4482.9997.9993 0 .5511-.4481.9997-.9997.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.594 8.2435 13.8533 7.82 12 7.82c-1.8533 0-3.594.4235-5.1368 1.1297L4.8409 5.4467a.416.416 0 0 0-.5676-.1521.416.416 0 0 0-.1521.5676l1.9973 3.4592C2.6889 11.0866.354 14.156.0355 17.842h23.929c-.3185-3.686-2.6534-6.7554-6.0825-8.5206z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Google Play Store</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Requires Android 8.0 or higher. APK direct download also available for offline distribution.
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Direct APK package downloading..."); }}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all"
            >
              Download APK / Android App
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
