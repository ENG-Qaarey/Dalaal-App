"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Shield, CheckCircle } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { authService } from "@/lib/api";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950" />
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || !email) return;
    setIsLoading(true);
    setError("");
    try {
      await authService.verifyEmail(email, code);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!success) return;
    const ROLE_HOME: Record<string, string> = {
      SUPER_ADMIN: "/pages/super-admin",
      BROKER: "/pages/broker",
      PROPERTY_OWNER: "/pages/owner",
      VEHICLE_OWNER: "/pages/owner",
      CUSTOMER: "/pages/customer",
    };
    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : null;
    const home = ROLE_HOME[user?.role] || "/pages/customer";
    const timer = setTimeout(() => router.push(home), 2000);
    return () => clearTimeout(timer);
  }, [success, router]);

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setIsResending(true);
    setError("");
    try {
      await authService.resendVerification(email);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-950 dark:text-zinc-50">
        <header className="w-full border-b border-zinc-200/50 dark:border-zinc-900/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xs">
                D
              </span>
              <span className="text-lg font-black tracking-tight">
                Dalaal<span className="text-sky-600">.</span>
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black mb-3">Email Verified!</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
              Your email has been verified. You can now access all features.
            </p>
            <button
              onClick={() => {
                const ROLE_HOME: Record<string, string> = {
                  SUPER_ADMIN: "/pages/super-admin",
                  BROKER: "/pages/broker",
                  PROPERTY_OWNER: "/pages/owner",
                  VEHICLE_OWNER: "/pages/owner",
                  CUSTOMER: "/pages/customer",
                };
                const stored = localStorage.getItem("user");
                const user = stored ? JSON.parse(stored) : null;
                router.push(ROLE_HOME[user?.role] || "/pages/customer");
              }}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-lg"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
            <span className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xs">
              D
            </span>
            <span className="text-lg font-black tracking-tight">
              Dalaal<span className="text-sky-600">.</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-200 bg-sky-50 dark:border-sky-900/50 dark:bg-sky-950/30 text-[11px] font-bold text-sky-700 dark:text-sky-300 mb-5">
              <Shield className="w-3 h-3" />
              <span>Verify Your Email</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Check Your Inbox
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              {email ? (
                <>
                  Enter the 6-digit code sent to <strong>{email}</strong>
                </>
              ) : (
                "Enter your email to verify your account"
              )}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-7 shadow-xl">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-lg shadow-sky-600/20 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : isResending
                    ? "Sending..."
                    : "Resend Code"}
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
            <Link
              href="/login"
              className="font-bold text-sky-600 hover:text-sky-700"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
