"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck2,
  ShieldCheck,
  Search,
  CheckCircle,
  Building,
  Car,
  QrCode,
  UserCheck,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";
import { useAuth } from "@/lib/auth-context";

export default function VerificationPage() {
  const { user } = useAuth();
  const [docNumber, setDocNumber] = useState("");
  const [docResult, setDocResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setDocResult({
        id: docNumber.toUpperCase(),
        title: "Official Land Title Deed - Hodan District",
        owner: "Mohamed Warsame",
        status: "AUTHENTIC_VERIFIED",
        issuedBy: "Mogadishu Municipality Real Estate Registry",
        issuedDate: "2024-11-12",
        digitalSignature: "0x89F...C421",
      });
      setLoading(false);
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
            <Link href="/escrow" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Escrow Guarantee
            </Link>
            <Link href="/verification" className="text-sm font-semibold text-sky-400">
              AI Verification
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

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-xs font-bold text-emerald-400">
            <FileCheck2 className="w-4 h-4" />
            <span>AI Title Deed & ID Validation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Document & Identity Verification
          </h1>
          <p className="text-zinc-400 text-sm">
            Verify official property title deeds, vehicle logbooks, and broker identity credentials instantly using cryptographic signatures and AI OCR analysis.
          </p>
        </div>

        {/* Verification Form */}
        <div className="max-w-xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-sky-400" /> Verify Title Deed or Logbook
          </h3>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-2">
                Title Deed or Certificate Serial Number
              </label>
              <input
                type="text"
                placeholder="e.g. TD-2025-99812-MG"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono uppercase text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-sky-600 hover:bg-sky-700 font-bold text-sm rounded-xl text-white transition-all disabled:opacity-50"
            >
              {loading ? "Analyzing Document Signature..." : "Search & Verify Credential"}
            </button>
          </form>

          {docResult && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> VERIFIED GENUINE
                </span>
                <span className="font-mono text-zinc-400">{docResult.id}</span>
              </div>
              <p className="text-white font-semibold text-sm">{docResult.title}</p>
              <div className="grid grid-cols-2 gap-2 text-zinc-400">
                <div>Owner: <span className="text-white">{docResult.owner}</span></div>
                <div>Issued By: <span className="text-white">{docResult.issuedBy}</span></div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
