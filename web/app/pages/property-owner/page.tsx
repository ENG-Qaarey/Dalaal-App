"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import ThemeToggle from "@/components/theme-toggle";
import { OwnerSidebar } from "@/components/sidebar-owner";
import {
  Home,
  PlusCircle,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Bell,
  Search,
  Upload,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const propertyMonthlyViewsData = [
  { month: "Jan", views: 450, inquiries: 12 },
  { month: "Feb", views: 520, inquiries: 18 },
  { month: "Mar", views: 610, inquiries: 22 },
  { month: "Apr", views: 780, inquiries: 28 },
  { month: "May", views: 890, inquiries: 35 },
  { month: "Jun", views: 1020, inquiries: 41 },
  { month: "Jul", views: 1150, inquiries: 48 },
];

const propertyEarningsData = [
  { month: "Jan", earnings: 4500 },
  { month: "Feb", earnings: 5200 },
  { month: "Mar", earnings: 6800 },
  { month: "Apr", earnings: 7400 },
  { month: "May", earnings: 8100 },
  { month: "Jun", earnings: 9500 },
  { month: "Jul", earnings: 10200 },
];

const mockPropertyListings = [
  { id: "1", title: "Luxury 3-Bedroom Villa", location: "Hodan, Mogadishu", price: "$245,000", status: "AVAILABLE", type: "SALE", views: 412, inquiries: 18 },
  { id: "2", title: "Modern Beachfront Apartment", location: "Jigjiga Yar, Hargeisa", price: "$1,200/mo", status: "RENTED", type: "RENT", views: 185, inquiries: 6 },
  { id: "3", title: "Commercial Plot in Wadajir", location: "Wadajir, Mogadishu", price: "$180,000", status: "AVAILABLE", type: "SALE", views: 630, inquiries: 29 },
];

const recentInquiriesMock = [
  { id: "inq-1", customer: "Ahmed Ali Mohamed", property: "Luxury 3-Bedroom Villa", time: "10m ago", status: "NEW" },
  { id: "inq-2", customer: "Fatima Hassan Farah", property: "Modern Beachfront Apartment", time: "2h ago", status: "RESPONDED" },
];

export default function PropertyOwnerDashboard() {
  const { user } = useAuth();
  const name = user?.profile?.firstName || user?.email?.split("@")[0] || "Property Owner";

  return (
    <SidebarProvider>
      <OwnerSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbPage>Property Owner Dashboard</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden sm:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full h-9 pl-9 pr-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800 transition-shadow"
              />
            </div>
            <ThemeToggle />
            <button className="relative w-9 h-9 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-zinc-900 dark:bg-white rounded-full" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-4 pb-12">
          {/* 1. Hero Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-zinc-950 p-8 text-white shadow-2xl border border-emerald-700/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Property Owner
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Welcome Back, {name}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                  Your properties have 2.3k impressions this week. Manage your listings, respond to inquiries, and track your rental/sales earnings all in one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Property</span>
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 text-white font-bold text-xs border border-emerald-600/40 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Customer Inquiries</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Primary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">My Properties</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                  <Home className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black">3</div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
                <span>2 Available • 1 Rented</span>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Views This Week</span>
                <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black">2,320</div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> +24% vs last week
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Customer Inquiries</span>
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black">53</div>
              <Link
                href="#"
                className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold hover:underline"
              >
                View 3 New Inquiries <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Total Earnings</span>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black">$24,500</div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-bold">
                <span>This Year</span>
              </div>
            </div>
          </div>

          {/* 3. Recharts Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Views Chart */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Monthly Property Views & Inquiries</h3>
                  <p className="text-xs text-muted-foreground">Total impressions vs customer inquiries per month</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  2026 Performance
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propertyMonthlyViewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} />
                    <YAxis stroke="#a1a1aa" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                    />
                    <Bar dataKey="views" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="inquiries" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Earnings Area Chart */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Monthly Earnings Overview</h3>
                  <p className="text-xs text-muted-foreground">Track your rental/sales income</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  This Year
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={propertyEarningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" stroke="#a1a1aa" fontSize={11} />
                    <YAxis stroke="#a1a1aa" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="earnings" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 4. Active Listings & Recent Inquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Properties */}
            <div className="lg:col-span-2 bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">My Property Listings</h3>
                  <p className="text-xs text-muted-foreground">Manage your available, sold, and rented properties</p>
                </div>
                <Link href="#" className="text-xs font-bold text-emerald-600 hover:underline">
                  Manage All Properties →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="p-3 font-semibold text-muted-foreground">Title</th>
                      <th className="p-3 font-semibold text-muted-foreground">Location</th>
                      <th className="p-3 font-semibold text-muted-foreground">Price</th>
                      <th className="p-3 font-semibold text-muted-foreground">Type</th>
                      <th className="p-3 font-semibold text-muted-foreground">Status</th>
                      <th className="p-3 font-semibold text-muted-foreground">Views</th>
                      <th className="p-3 font-semibold text-muted-foreground">Inquiries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockPropertyListings.map((l) => (
                      <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3 font-bold text-foreground">{l.title}</td>
                        <td className="p-3 text-muted-foreground">{l.location}</td>
                        <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{l.price}</td>
                        <td className="p-3 text-muted-foreground">{l.type}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            l.status === "AVAILABLE"
                              ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                              : l.status === "RENTED"
                              ? "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
                              : "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground font-mono">{l.views}</td>
                        <td className="p-3 font-bold text-emerald-600">{l.inquiries}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base">Recent Inquiries</h3>
                  <Link href="#" className="text-xs text-emerald-600 font-bold hover:underline">
                    View All
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Latest customers interested in your properties</p>

                <div className="space-y-3">
                  {recentInquiriesMock.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1 hover:border-emerald-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs">{inq.customer}</h4>
                        <span className="text-[10px] text-muted-foreground">{inq.time}</span>
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{inq.property}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="#"
                className="w-full h-10 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md mt-4"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Open Inquiries Inbox
              </Link>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
