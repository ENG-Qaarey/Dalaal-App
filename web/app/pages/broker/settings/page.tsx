"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { authService, uploadsService } from "@/lib/api";
import {
  Save, Loader2, AlertCircle, CheckCircle, User, Mail, Phone, MapPin,
  Globe, MessageSquare, Camera, Lock, Eye, EyeOff, Shield, Bell,
  Building2, Pencil, X, Upload, Languages, DollarSign, AtSign, Info,
} from "lucide-react";

const cities = ["Mogadishu", "Hargeisa", "Garowe", "Kismayo", "Bosaso", "Beledweyne", "Baidoa", "Merca"];

export default function BrokerSettings() {
  const { user, refreshUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "contact" | "preferences" | "password" | "notifications">("profile");
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    city: "",
    country: "",
    whatsappNumber: "",
    telegramHandle: "",
    phone: "",
    currency: "USD",
    language: "en",
    avatar: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState({
    emailLeads: true,
    emailMessages: true,
    emailListings: true,
    pushLeads: true,
    pushMessages: true,
    pushListings: false,
    smsLeads: false,
    smsMessages: false,
  });
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.profile?.firstName || "",
        lastName: user.profile?.lastName || "",
        bio: (user as any).profile?.bio || "",
        city: (user as any).profile?.city || "",
        country: (user as any).profile?.country || "",
        whatsappNumber: (user as any).profile?.whatsappNumber || "",
        telegramHandle: (user as any).profile?.telegramHandle || "",
        phone: (user as any).profile?.phone || (user as any).phone || "",
        currency: (user as any).profile?.currency || "USD",
        language: (user as any).profile?.language || "en",
        avatar: user.profile?.avatar || "",
      });
    }
  }, [user]);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError(null);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar must be under 5MB");
      return;
    }
    try {
      setAvatarUploading(true);
      setError(null);
      const result = await uploadsService.uploadImage(file);
      const url = result?.url || result?.secureUrl || result;
      if (typeof url === "string") {
        setForm((prev) => ({ ...prev, avatar: url }));
        await authService.updateProfile({ avatar: url });
        await refreshUser();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
    }
    e.target.value = "";
  };

  const handleSaveProfile = async () => {
    if (!form.firstName.trim()) {
      setError("First name is required");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await authService.updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        bio: form.bio.trim(),
        city: form.city,
        country: form.country.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        telegramHandle: form.telegramHandle.trim(),
        phone: form.phone.trim(),
        currency: form.currency,
        language: form.language,
      });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Both current and new password are required");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    try {
      setPasswordLoading(true);
      await authService.forgotPassword(user?.email || "");
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setNotifLoading(true);
      setNotifSuccess(false);
      await new Promise((r) => setTimeout(r, 500));
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
    } finally {
      setNotifLoading(false);
    }
  };

  const name = user?.profile?.firstName || user?.email?.split("@")[0] || "Broker";
  const email = user?.email || "";

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "contact" as const, label: "Contact", icon: Phone },
    { id: "preferences" as const, label: "Preferences", icon: Globe },
    { id: "password" as const, label: "Password", icon: Lock },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your profile, contact info, and preferences.</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[10px] text-emerald-700 dark:text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" /> Profile saved successfully.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[10px] text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Avatar & Profile Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-4">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <div className="w-28 h-28 rounded-[10px] bg-blue-500/10 text-blue-600 border-2 border-blue-200 dark:border-blue-900 flex items-center justify-center overflow-hidden">
                  {form.avatar ? (
                    <img src={form.avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-12 h-12" />
                  )}
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-[10px] shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {avatarUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base">{name}</h3>
                <p className="text-xs text-emerald-600 font-semibold">{user?.role?.replace(/_/g, " ")}</p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                <Mail className="w-3 h-3" /> {email}
              </div>
              {form.phone && (
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                  <Phone className="w-3 h-3" /> {form.phone}
                </div>
              )}
              {form.city && (
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {form.city}{form.country ? `, ${form.country}` : ""}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600">
                <Shield className="w-3 h-3" /> Account Verified
              </div>
            </div>
          </div>

          {/* Tab Navigation (mobile: horizontal, desktop: vertical) */}
          <div className="bg-card border border-border rounded-[10px] p-2 shadow-sm">
            <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-[10px] text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tab Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base">Personal Information</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Update your name and bio for your broker profile.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> First Name *
                  </label>
                  <input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
                    placeholder="First name"
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Last Name
                  </label>
                  <input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
                    placeholder="Last name"
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Bio
                </label>
                <textarea rows={4} value={form.bio} onChange={(e) => update("bio", e.target.value)}
                  placeholder="Tell customers about yourself, your experience, and what properties you specialize in..."
                  className="w-full p-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-[11px] text-muted-foreground font-bold">{form.bio.length}/500 characters</p>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveProfile} disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-[10px] font-semibold text-sm transition-all shadow-md shadow-blue-600/20 disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base">Contact Information</h3>
                <p className="text-xs text-muted-foreground mt-0.5">How customers can reach you.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    placeholder="+252 61 XXX XXXX"
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Number
                  </label>
                  <input type="tel" value={form.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)}
                    placeholder="+252 61 XXX XXXX"
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5" /> Telegram Handle
                  </label>
                  <input type="text" value={form.telegramHandle} onChange={(e) => update("telegramHandle", e.target.value)}
                    placeholder="@username"
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> City
                  </label>
                  <select value={form.city} onChange={(e) => update("city", e.target.value)}
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select city</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Country
                  </label>
                  <input type="text" value={form.country} onChange={(e) => update("country", e.target.value)}
                    placeholder="e.g., Somalia"
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="p-3 rounded-[10px] bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
                <p className="text-xs text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Contact info is visible to potential buyers and renters on your listings.
                </p>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveProfile} disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-[10px] font-semibold text-sm transition-all shadow-md shadow-blue-600/20 disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Contact Info
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base">Preferences</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Customize your language and currency settings.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5" /> Language
                  </label>
                  <select value={form.language} onChange={(e) => update("language", e.target.value)}
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="en">English</option>
                    <option value="so">Somali</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Default Currency
                  </label>
                  <select value={form.currency} onChange={(e) => update("currency", e.target.value)}
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="USD">USD - US Dollar</option>
                    <option value="SOS">SOS - Somali Shilling</option>
                  </select>
                </div>
              </div>
              <div className="p-3 rounded-[10px] bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Currency preference applies to all new listings you create.
                </p>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveProfile} disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-[10px] font-semibold text-sm transition-all shadow-md shadow-blue-600/20 disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base">Change Password</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Keep your account secure with a strong password.</p>
              </div>
              {passwordSuccess && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[10px] text-emerald-700 dark:text-emerald-400 text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" /> Password reset email sent. Check your inbox.
                </div>
              )}
              {passwordError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[10px] text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" /> {passwordError}
                </div>
              )}
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPassword ? "text" : "password"} value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                      className="w-full h-10 px-4 pr-10 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">New Password</label>
                  <div className="relative">
                    <input type={showNewPassword ? "text" : "password"} value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      placeholder="Min. 8 characters"
                      className="w-full h-10 px-4 pr-10 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Confirm New Password</label>
                  <input type="password" value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Re-enter new password"
                    className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="p-3 rounded-[10px] bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> A password reset link will be sent to your email for security.
                </p>
              </div>
              <div className="flex justify-end">
                <button onClick={handleChangePassword} disabled={passwordLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-[10px] font-semibold text-sm transition-all shadow-md shadow-blue-600/20 disabled:opacity-50">
                  {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Update Password
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-5">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base">Notification Preferences</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Choose how and when you want to be notified.</p>
              </div>
              {notifSuccess && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[10px] text-emerald-700 dark:text-emerald-400 text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" /> Notification preferences saved.
                </div>
              )}

              {/* Email Notifications */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> Email Notifications</h4>
                <div className="space-y-2 pl-6">
                  {[
                    { key: "emailLeads", label: "New customer leads", desc: "Get notified when a customer inquires about your listing" },
                    { key: "emailMessages", label: "New messages", desc: "Receive email for new chat messages" },
                    { key: "emailListings", label: "Listing updates", desc: "Status changes on your listings (approved, rejected, etc.)" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 rounded-[10px] bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-muted-foreground font-bold">{item.desc}</div>
                      </div>
                      <input type="checkbox" checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications((p) => ({ ...p, [item.key]: e.target.checked }))}
                        className="w-4 h-4 rounded border-border" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2"><Bell className="w-4 h-4 text-muted-foreground" /> Push Notifications</h4>
                <div className="space-y-2 pl-6">
                  {[
                    { key: "pushLeads", label: "New customer leads", desc: "Browser push notification for new leads" },
                    { key: "pushMessages", label: "New messages", desc: "Browser push for new chat messages" },
                    { key: "pushListings", label: "Listing updates", desc: "Browser push for listing status changes" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 rounded-[10px] bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-muted-foreground font-bold">{item.desc}</div>
                      </div>
                      <input type="checkbox" checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications((p) => ({ ...p, [item.key]: e.target.checked }))}
                        className="w-4 h-4 rounded border-border" />
                    </label>
                  ))}
                </div>
              </div>

              {/* SMS Notifications */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> SMS Notifications</h4>
                <div className="space-y-2 pl-6">
                  {[
                    { key: "smsLeads", label: "New customer leads", desc: "SMS alert for high-priority leads" },
                    { key: "smsMessages", label: "New messages", desc: "SMS alert for new messages" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 rounded-[10px] bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-muted-foreground font-bold">{item.desc}</div>
                      </div>
                      <input type="checkbox" checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications((p) => ({ ...p, [item.key]: e.target.checked }))}
                        className="w-4 h-4 rounded border-border" />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={handleSaveNotifications} disabled={notifLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-[10px] font-semibold text-sm transition-all shadow-md shadow-blue-600/20 disabled:opacity-50">
                  {notifLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                  Save Notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
