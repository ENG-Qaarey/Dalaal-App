import Link from "next/link";
import {
  Globe,
  Shield,
  CreditCard,
  Sparkles,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import HomeHero from "@/components/home-hero";
import ListingsGrid from "@/components/listings-grid";
import EscrowExplainer from "@/components/escrow-explainer";
import ClipsPreview from "@/components/clips-preview";
import MortgageCalculator from "@/components/mortgage-calculator";
import FAQAccordion from "@/components/faq-accordion";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      {/* Premium Sticky Glass Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/75 backdrop-blur-md dark:border-zinc-850/50 dark:bg-zinc-950/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/20">
                D
              </span>
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                Dalaal<span className="text-sky-600">.</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/properties"
                className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Properties
              </Link>
              <Link
                href="/vehicles"
                className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Vehicles
              </Link>
              <Link
                href="/escrow"
                className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Escrow Guarantee
              </Link>
              <Link
                href="/clips"
                className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Clips
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Lang Indicator */}
            <LanguageToggle />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Links */}
            <Link
              href="/login"
              className="text-xs font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white transition-all shadow-md shadow-sky-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Layout */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Hero Section */}
        <HomeHero />

        {/* Brand Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-10 border-t border-b border-zinc-200/60 dark:border-zinc-900/60 my-10 bg-white/30 dark:bg-zinc-950/20 backdrop-blur rounded-2xl px-6">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl border border-sky-100 dark:border-sky-900/40">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Escrow Protection
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Deposits held safely in transit.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Mobile Payments
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Integrations for EVC, ZAAD, SAHAL.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                Clips Walkthroughs
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Reels style vertical videos.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Handpicked Listings Grid (Properties & Vehicles) */}
        <ListingsGrid />

        {/* 3. Escrow Protocol Step-by-Step */}
        <EscrowExplainer />

        {/* 4. Dalaal Clips Reels Showcase */}
        <ClipsPreview />

        {/* 5. Affordability Calculator */}
        <MortgageCalculator />

        {/* 6. Bilingual FAQ Accordion */}
        <FAQAccordion />

        {/* Bottom CTA Banner */}
        <section className="py-16 my-16 rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Launch Dalaal App
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to post your property <br />
              or find a new ride?
            </h2>
            <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
              Join thousands of users transacting safely across Somalia. Check
              listing statuses, verify document credentials, and access live
              WebRTC voice calling directly.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/download"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-zinc-900 hover:bg-zinc-100 transition-colors shadow-lg"
              >
                Download for iOS & Android
              </Link>
              <Link
                href="/agents"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 hover:border-white/60 px-6 text-sm font-bold text-white transition-colors"
              >
                <span>Find an Agent</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/20">
                D
              </span>
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                Dalaal
              </span>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Somalia's premier real estate and vehicle rental/sales platform.
              Secure transactions, verified agents, and live video tours.
            </p>
            <div className="flex gap-4 pt-2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200">
              <Link
                href="https://github.com"
                target="_blank"
                className="hover:scale-110 transition-transform"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest mb-4">
              Properties
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/search?type=villa"
                  className="hover:text-sky-600 transition-colors"
                >
                  Villas & Houses
                </Link>
              </li>
              <li>
                <Link
                  href="/search?type=apartment"
                  className="hover:text-sky-600 transition-colors"
                >
                  Apartments for Rent
                </Link>
              </li>
              <li>
                <Link
                  href="/search?type=land"
                  className="hover:text-sky-600 transition-colors"
                >
                  Commercial Lands
                </Link>
              </li>
              <li>
                <Link
                  href="/search?type=office"
                  className="hover:text-sky-600 transition-colors"
                >
                  Offices
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest mb-4">
              Vehicles
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/search?type=suv"
                  className="hover:text-emerald-600 transition-colors"
                >
                  SUVs & Pickups
                </Link>
              </li>
              <li>
                <Link
                  href="/search?type=sedan"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Sedans
                </Link>
              </li>
              <li>
                <Link
                  href="/search?type=truck"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Commercial Trucks
                </Link>
              </li>
              <li>
                <Link
                  href="/search?type=rentals"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Daily Car Rentals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest mb-4">
              Trust & Operations
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/escrow"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Escrow Guarantee
                </Link>
              </li>
              <li>
                <Link
                  href="/verification"
                  className="hover:text-indigo-600 transition-colors"
                >
                  AI Identity Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Transaction Audits
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 mt-12 border-t border-zinc-200/50 dark:border-zinc-900 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          © {new Date().getFullYear()} Dalaal Inc. All rights reserved. Locally
          optimized for Mogadishu, Hargeisa, Garowe, and Kismayo.
        </div>
      </footer>
    </div>
  );
}
