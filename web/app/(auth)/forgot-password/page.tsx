"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft, Shield } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { authService } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-950 dark:text-zinc-50">
        <header className="w-full border-b border-zinc-200/50 dark:border-zinc-900/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xs">D</span>
              <span className="text-lg font-black tracking-tight">Dalaal<span className="text-sky-600">.</span></span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-6">
              <Mail className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black mb-3">Check Your Email</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
              We sent a 6-digit code to <strong>{email}</strong>. Enter it on the next screen to reset your password.
            </p>
            <button onClick={() => router.push("/reset-password?email=" + encodeURIComponent(email))}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-[5px] bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-lg">
              <span>Continue to Reset</span><ArrowRight className="w-4 h-4" />
            </button>
            <Link href="/login" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-700">
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-950 dark:text-zinc-50">
      <header className="w-full border-b border-zinc-200/50 dark:border-zinc-900/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xs">D</span>
            <span className="text-lg font-black tracking-tight">Dalaal<span className="text-sky-600">.</span></span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-200 bg-sky-50 dark:border-sky-900/50 dark:bg-sky-950/30 text-[11px] font-bold text-sky-700 dark:text-sky-300 mb-5">
              <Shield className="w-3 h-3" /><span>Password Recovery</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Forgot Password?</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Enter your email and we&apos;ll send you a reset code.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[20px] p-7 shadow-xl">
            {error && (
              <div className="mb-4 p-3 rounded-[5px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all" />
                </div>
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-[5px] bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-lg shadow-sky-600/20 disabled:opacity-60">
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Send Reset Code</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
            Remember your password? <Link href="/login" className="font-bold text-sky-600 hover:text-sky-700">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
