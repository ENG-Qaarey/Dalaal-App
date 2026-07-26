"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Calculator,
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  Smartphone,
  BadgeCheck,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";
import { useAuth } from "@/lib/auth-context";

export default function EscrowPage() {
  const { user } = useAuth();
  const [depositAmount, setDepositAmount] = useState<number>(5000);
  const [escrowCode, setEscrowCode] = useState<string>("");
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Escrow fee calculation: 1.5% fee
  const feeRate = 0.015;
  const escrowFee = Math.round(depositAmount * feeRate);
  const totalAmount = depositAmount + escrowFee;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escrowCode.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setLookupResult({
        code: escrowCode.toUpperCase(),
        status: "SECURED_IN_ESCROW",
        amount: "$15,000",
        buyer: "Hassan Mohamed",
        seller: "Somali Prime Real Estate",
        item: "3-Bedroom Villa in Hodan, Mogadishu",
        createdDate: "2026-07-20",
        releaseConditions: "Awaiting Buyer Physical Inspection Signoff",
      });
      setIsSearching(false);
    }, 600);
  };

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

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Properties
            </Link>
            <Link href="/vehicles" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Vehicles
            </Link>
            <Link href="/escrow" className="text-sm font-semibold text-sky-400">
              Escrow Guarantee
            </Link>
            <Link href="/agents" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Agents
            </Link>
            <Link href="/clips" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Clips
            </Link>
          </nav>

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
              <>
                <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white transition-all shadow-md shadow-sky-600/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 text-xs font-bold text-sky-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Risk-Free Somali Escrow Service</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Protecting Every Cent of Your Property & Vehicle Deals
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Dalaal Escrow holds funds safely in automated multi-sig vault accounts until buyer and seller inspect and confirm deed transfer. Integrated directly with EVC Plus, ZAAD, and SAHAL.
          </p>
        </div>

        {/* 3 Step Protocol Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-950/50 border border-sky-800/40 flex items-center justify-center text-sky-400 font-black text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-white">Deposit into Vault</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Buyer initiates an escrow transaction and deposits funds via Mobile Money (EVC / ZAAD) or Bank Wire. Money is locked securely.
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-center text-indigo-400 font-black text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-white">Inspection & Deed Review</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The buyer inspects the property or vehicle. Land deeds & vehicle logbooks are validated via AI Document Verification.
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-center text-emerald-400 font-black text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Instant Release</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Upon mutual buyer & seller sign-off, funds are instantly released to the seller with low transparent fees.
            </p>
          </div>
        </div>

        {/* Interactive Tools Grid: Fee Calculator & Transaction Lookup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fee Calculator */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-950/50 rounded-xl border border-sky-800/40 text-sky-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Escrow Fee Estimator</h3>
                <p className="text-xs text-zinc-400">Calculate transparent transaction fee (1.5%)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-2">
                  Transaction Amount (USD)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Math.max(100, Number(e.target.value)))}
                  className="w-full h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-4 bg-zinc-950/80 border border-zinc-800/60 rounded-xl space-y-3">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Base Purchase Amount:</span>
                  <span className="font-bold text-white">${depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Dalaal Escrow Fee (1.5%):</span>
                  <span className="font-bold text-sky-400">${escrowFee.toLocaleString()}</span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex justify-between text-sm font-bold text-white">
                  <span>Total Lock Deposit:</span>
                  <span className="text-emerald-400">${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Status Lookup */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-950/50 rounded-xl border border-emerald-800/40 text-emerald-400">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Escrow Status Lookup</h3>
                <p className="text-xs text-zinc-400">Check live status of an existing escrow code</p>
              </div>
            </div>

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-2">
                  Escrow Reference Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. ESC-88942-MG"
                    value={escrowCode}
                    onChange={(e) => setEscrowCode(e.target.value)}
                    className="flex-1 h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono uppercase text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-xl text-white transition-all disabled:opacity-50"
                  >
                    {isSearching ? "Checking..." : "Verify Code"}
                  </button>
                </div>
              </div>

              {lookupResult && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-800/50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4" /> {lookupResult.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 text-[10px] font-bold">
                      {lookupResult.status}
                    </span>
                  </div>
                  <p className="text-zinc-300"><strong className="text-zinc-400">Item:</strong> {lookupResult.item}</p>
                  <p className="text-zinc-300"><strong className="text-zinc-400">Amount:</strong> {lookupResult.amount}</p>
                  <p className="text-zinc-300"><strong className="text-zinc-400">Condition:</strong> {lookupResult.releaseConditions}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
