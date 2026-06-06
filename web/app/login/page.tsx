"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (method === "email") {
      if (!email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = "Enter a valid email address";
    } else {
      if (!phone) newErrors.phone = "Phone number is required";
      else if (!/^\+?[0-9]{7,15}$/.test(phone.replace(/\s/g, "")))
        newErrors.phone = "Enter a valid phone number (e.g. +252612345678)";
    }
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1500));
    setIsLoading(false);
    
    // Super-admin hardcoded route
    const cleanPhone = phone.replace(/[\s\+]/g, "");
    const cleanEmail = email.trim();
    
    // Check if either email contains the number/admin email, or phone ends with the number
    const isSuperAdmin = 
      (method === "phone" && cleanPhone.includes("614463895")) || 
      (method === "email" && (cleanEmail.includes("muscabqaareey@gmail.com") || cleanEmail.includes("mmqaareey@gmail.com")));
      
    if (isSuperAdmin && password.trim() === "muscab123") {
      router.push("/super-admin");
      return;
    }

    // Show error if credentials don't match the demo admin
    setErrors({
      ...(method === "email" ? { email: "Account not found in demo system" } : { phone: "Account not found in demo system" }),
      password: "Or incorrect password"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-950 dark:text-zinc-50 transition-colors">
      {/* Mini Header */}
      <header className="w-full border-b border-zinc-200/50 dark:border-zinc-900/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-sky-600/20">
              D
            </span>
            <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
              Dalaal<span className="text-sky-600">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/register"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative">
        {/* Background Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          {/* Top Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-200 bg-sky-50 dark:border-sky-900/50 dark:bg-sky-950/30 text-[11px] font-bold text-sky-700 dark:text-sky-300 mb-5">
              <Shield className="w-3 h-3" />
              <span>Secure Encrypted Login</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Sign in to access your listings, messages, and escrow dashboard.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-7 shadow-xl">
            {/* Method Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMethod("email");
                  setErrors({});
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  method === "email"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod("phone");
                  setErrors({});
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  method === "phone"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                Phone
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email or Phone Input */}
              {method === "email" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      id="login-email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-950 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? "border-red-400 focus:ring-red-500/30"
                          : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="tel"
                      id="login-phone"
                      placeholder="+252 61 234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-950 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
                          ? "border-red-400 focus:ring-red-500/30"
                          : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-11 pl-10 pr-11 bg-zinc-50 dark:bg-zinc-950 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-400 focus:ring-red-500/30"
                        : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRemember(!remember)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    remember
                      ? "bg-sky-600 border-sky-600 text-white"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {remember && <CheckCircle2 className="w-3 h-3" />}
                </button>
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Remember me for 30 days
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-lg shadow-sky-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            {/* Google SSO Mock */}
            <button
              type="button"
              className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Bottom Link */}
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
