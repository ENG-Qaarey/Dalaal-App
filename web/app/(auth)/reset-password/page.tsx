"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { authService } from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (code.length !== 6) newErrors.code = "Enter the 6-digit code";
    if (newPassword.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (newPassword !== confirmPassword) newErrors.confirm = "Passwords do not match";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await authService.resetPassword(email, code, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setErrors({ general: err?.message || "Failed to reset password" });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
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
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black mb-3">Password Reset!</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">Your password has been reset. You can now sign in.</p>
            <button onClick={() => router.push("/login")}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-[5px] bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-lg">
              <span>Go to Login</span><ArrowRight className="w-4 h-4" />
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
              <Shield className="w-3 h-3" /><span>Secure Reset</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Reset Password</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Enter the code sent to {email} and your new password.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[20px] p-7 shadow-xl">
            {errors.general && (
              <div className="mb-4 p-3 rounded-[5px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600">{errors.general}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Verification Code</label>
                <input type="text" placeholder="123456" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className={`w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border rounded-[10px] text-sm font-medium text-center tracking-[0.5em] focus:outline-none focus:ring-2 transition-all ${errors.code ? "border-red-400 focus:ring-red-500/30" : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"}`} />
                {errors.code && <p className="text-[11px] text-red-500 font-semibold">{errors.code}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full h-11 pl-10 pr-11 bg-zinc-50 dark:bg-zinc-950 border rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-red-400 focus:ring-red-500/30" : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-500 font-semibold">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input type={showPassword ? "text" : "password"} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-950 border rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.confirm ? "border-red-400 focus:ring-red-500/30" : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"}`} />
                </div>
                {errors.confirm && <p className="text-[11px] text-red-500 font-semibold">{errors.confirm}</p>}
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-[5px] bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-lg shadow-sky-600/20 disabled:opacity-60">
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Reset Password</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
            <Link href="/login" className="font-bold text-sky-600 hover:text-sky-700">Back to Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
