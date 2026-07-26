"use client";

import Link from "next/link";
import { ShieldCheck, FileText, Lock, Scale } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";
import { useAuth } from "@/lib/auth-context";

export default function TermsPage() {
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
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 text-xs font-bold text-sky-400">
            <Scale className="w-4 h-4" />
            <span>Legal Terms & Privacy Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Terms of Service & Escrow Operating Rules
          </h1>
          <p className="text-xs text-zinc-400">
            Last Updated: July 2026 | Applies to all Dalaal Real Estate & Vehicle Portal users across Somalia.
          </p>
        </div>

        <div className="space-y-8 bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-400" /> 1. Platform Marketplace Role
            </h2>
            <p>
              Dalaal provides a peer-to-peer and broker-mediated platform connecting buyers, renters, and listing owners across Somalia. All property title deeds and vehicle logbooks posted on Dalaal are subject to AI identity and document verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> 2. Escrow Deposit Guarantee
            </h2>
            <p>
              When a buyer or renter uses Dalaal Escrow via EVC Plus, ZAAD, or SAHAL mobile money, funds are held in automated multi-signature vault accounts. Escrow release requires physical inspection signoff from the buyer or authorized representative.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" /> 3. Data Protection & Privacy
            </h2>
            <p>
              User personal data, phone numbers, and identity verification credentials are encrypted in transit and at rest using AES-256 standards. We do not sell user data to third parties.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
