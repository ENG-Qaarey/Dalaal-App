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
  User,
  ArrowRight,
  Shield,
  CheckCircle2,
  Briefcase,
  Home as HomeIcon,
  Car,
  UserCircle,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { authService } from "@/lib/api";

type UserRole = "CUSTOMER" | "PROPERTY_OWNER" | "VEHICLE_OWNER" | "REGULAR_DALAAL";

interface RoleOption {
  value: UserRole;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const roleOptions: RoleOption[] = [
  { value: "CUSTOMER", label: "Customer", desc: "", icon: <UserCircle className="w-3.5 h-3.5" /> },
  { value: "PROPERTY_OWNER", label: "Property Owner", desc: "", icon: <HomeIcon className="w-3.5 h-3.5" /> },
  { value: "VEHICLE_OWNER", label: "Vehicle Owner", desc: "", icon: <Car className="w-3.5 h-3.5" /> },
  { value: "REGULAR_DALAAL", label: "Dalaal / Broker", desc: "", icon: <Briefcase className="w-3.5 h-3.5" /> },
];

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("CUSTOMER");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email address";
    if (!phone) newErrors.phone = "Phone number is required";
    else if (!/^\+?[0-9]{7,15}$/.test(phone.replace(/\s/g, ""))) newErrors.phone = "Enter a valid phone (e.g. +252612345678)";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Must be at least 8 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!agreedTerms) newErrors.terms = "You must accept the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError("");

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await authService.register({
        fullName,
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
      });

      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (error: any) {
      const msg = error?.message || "Registration failed. Please try again.";
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrength = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = getStrength();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength] || "";
  const strengthColor = ["bg-zinc-200 dark:bg-zinc-800", "bg-red-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500"][strength];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-950 dark:text-zinc-50 transition-colors">
      <header className="w-full border-b border-zinc-200/50 dark:border-zinc-900/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[5px] bg-sky-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-sky-600/20">D</span>
            <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">Dalaal<span className="text-sky-600">.</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mb-5">
              <Shield className="w-3 h-3" />
              <span>AI-Verified Identity Onboarding</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Create Your Account</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Join the trusted marketplace for properties and vehicles in Somalia.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[20px] p-7 shadow-xl">
            {serverError && (
              <div className="mb-4 p-3 rounded-[5px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs font-semibold text-red-600 dark:text-red-400">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type="text" id="register-first-name" placeholder="Abdi" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-950 border rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.firstName ? "border-red-400 focus:ring-red-500/30" : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"}`} />
                  </div>
                  {errors.firstName && <p className="text-[11px] text-red-500 font-semibold">{errors.firstName}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Last Name</label>
                    <input type="text" id="register-last-name" placeholder="Hassan" value={lastName} onChange={(e) => setLastName(e.target.value)}
                    className={`w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-950 border rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.lastName ? "border-red-400 focus:ring-red-500/30" : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"}`} />
                  {errors.lastName && <p className="text-[11px] text-red-500 font-semibold">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type="email" id="register-email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-950 border rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-400 focus:ring-red-500/30" : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"}`} />
                </div>
                {errors.email && <p className="text-[11px] text-red-500 font-semibold">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Phone Number (Somali Networks)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type="tel" id="register-phone" placeholder="+252 61 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className={`w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-950 border rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.phone ? "border-red-400 focus:ring-red-500/30" : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"}`} />
                </div>
                {errors.phone && <p className="text-[11px] text-red-500 font-semibold">{errors.phone}</p>}
                <p className="text-[10px] text-zinc-400">Used for EVC Plus / ZAAD / SAHAL verification.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type={showPassword ? "text" : "password"} id="register-password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-11 pl-10 pr-11 bg-zinc-50 dark:bg-zinc-950 border rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-red-400 focus:ring-red-500/30" : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-500 font-semibold">{errors.password}</p>}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-zinc-200 dark:bg-zinc-800"}`} />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold ${strength <= 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : strength === 3 ? "text-sky-500" : "text-emerald-500"}`}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input type={showPassword ? "text" : "password"} id="register-confirm-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full h-11 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-950 border rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? "border-red-400 focus:ring-red-500/30" : "border-zinc-200 dark:border-zinc-800 focus:ring-sky-500/30"}`} />
                </div>
                {errors.confirmPassword && <p className="text-[11px] text-red-500 font-semibold">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 block">I want to join as:</label>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setRole(opt.value)}
                      className={`p-2 rounded-[5px] border text-left transition-all duration-200 ${role === opt.value ? "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800 ring-2 ring-sky-500/20" : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}>
                      <div className="flex items-center gap-1.5">
                        <div className={`${role === opt.value ? "text-sky-600 dark:text-sky-400" : "text-zinc-400"}`}>{opt.icon}</div>
                        <div className="text-[10px] font-bold text-zinc-900 dark:text-white">{opt.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-start gap-2.5">
                  <button type="button" onClick={() => setAgreedTerms(!agreedTerms)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all mt-0.5 shrink-0 ${agreedTerms ? "bg-sky-600 border-sky-600 text-white" : errors.terms ? "border-red-400" : "border-zinc-300 dark:border-zinc-700"}`}>
                    {agreedTerms && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    I agree to the <Link href="/terms" className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 underline">Terms of Service</Link> and <Link href="/privacy" className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 underline">Privacy Policy</Link>, including escrow transaction data processing.
                  </span>
                </div>
                {errors.terms && <p className="text-[11px] text-red-500 font-semibold pl-6">{errors.terms}</p>}
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-[5px] bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-lg shadow-sky-600/20 disabled:opacity-60 disabled:cursor-not-allowed">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <button type="button" disabled
              className="w-full h-11 flex items-center justify-center gap-3 rounded-[5px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm font-bold text-zinc-700 dark:text-zinc-300 opacity-50 cursor-not-allowed transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors">Sign in instead</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
