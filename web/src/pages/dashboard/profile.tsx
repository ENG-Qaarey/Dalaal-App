import React from "react"
import Head from "next/head"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useAuth } from "@/context/AuthContext"
import { Camera, Mail, Phone, MapPin, Briefcase, Save } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  const profile = {
    email: user?.email || "user@dalaal.com",
    phone: "+252 61 234 5678",
    location: "Mogadishu, Somalia",
    role: user?.role || "seeker",
    bio: "Passionate real estate professional with years of experience in the Somali market.",
    joined: "January 2026",
  }

  return (
    <DashboardLayout>
      <Head><title>Profile | DalaalPrime</title></Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-center">
              <div className="relative mx-auto w-fit">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-500 text-2xl font-black text-white mx-auto">
                  {user?.avatar || "U"}
                </div>
                <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white shadow-md hover:bg-sky-600">
                  <Camera className="size-4" />
                </button>
              </div>
              <h2 className="mt-4 text-lg font-bold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
              <p className="mt-1 text-xs text-muted-foreground">Joined {profile.joined}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                  <Mail className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Phone className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-semibold">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold">{profile.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Personal Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.firstName}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.lastName}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email Address</label>
                  <input
                    type="email"
                    defaultValue={profile.email}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue={profile.phone}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Location</label>
                  <input
                    type="text"
                    defaultValue={profile.location}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Bio</label>
                  <textarea
                    defaultValue={profile.bio}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 resize-none"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-lg">
                  <Save className="size-4" />
                  Save Changes
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-lg">
                  <Briefcase className="size-4" />
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}