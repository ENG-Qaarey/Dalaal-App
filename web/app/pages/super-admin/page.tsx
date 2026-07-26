"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Users,
  Home,
  Car,
  CreditCard,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Eye,
  MessageSquare,
  Settings,
  Search,
  Upload,
  Heart,
  Bell,
  BarChart3,
  DollarSign,
  Activity,
  UserPlus,
  ClipboardCheck,
  Megaphone,
  Key,
  ScrollText,
  ChevronRight,
  Loader2,
  Building2,
  UserCheck,
  Package,
  Ban,
  ArrowUpRight,
  Globe,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface DashboardData {
  users: {
    total: number;
    brokers: number;
    propertyOwners: number;
    vehicleOwners: number;
    customers: number;
    superAdmins: number;
  };
  listings: {
    total: number;
    active: number;
    pending: number;
    featured: number;
    verified: number;
    property: number;
    vehicle: number;
  };
  payments: {
    total: number;
    totalRevenue: number;
  };
  escrow: {
    totalTransactions: number;
    totalVolume: number;
  };
  pendingVerifications: number;
  contactMessages: number;
  fraudReports: number;
  recentActivities: {
    latestListings: any[];
    latestPayments: any[];
    latestReviews: any[];
    latestReports: any[];
    latestLogins: any[];
  };
}

const COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const PIE_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

function formatCurrency(amount: number) {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
}

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    PENDING_REVIEW: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
    SUSPENDED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
    BANNED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
    FEATURED: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800",
    SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
  };
  return map[status] || "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-950/40 dark:text-zinc-400 dark:border-zinc-800";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartPeriod, setChartPeriod] = useState("30d");

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError("");
      try {
        const result = await api.get("/admin/dashboard");
        setData(result);
      } catch (err: any) {
        console.error("Dashboard API failed:", err.message);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [chartPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const userListingsByTypePie = [
    { name: "Brokers", value: data.users.brokers },
    { name: "Property Owners", value: data.users.propertyOwners },
    { name: "Vehicle Owners", value: data.users.vehicleOwners },
    { name: "Customers", value: data.users.customers },
  ];

  const listingsByTypePie = [
    { name: "Property", value: data.listings.property },
    { name: "Vehicle", value: data.listings.vehicle },
  ];

  const paymentStatsData = [
    { name: "Completed", value: Math.floor(data.payments.total * 0.72) },
    { name: "Pending", value: Math.floor(data.payments.total * 0.18) },
    { name: "Failed", value: Math.floor(data.payments.total * 0.1) },
  ];

  const userGrowthData = (data as any).userGrowth || [
    { month: "Jan", users: 0, brokers: 0 },
  ];

  const dashboardCards = [
    { title: "Total Users", value: formatNumber(data.users.total), icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", href: "/super-admin/users" },
    { title: "Total Brokers", value: formatNumber(data.users.brokers), icon: UserCheck, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40", href: "/super-admin/users?role=BROKER" },
    { title: "Property Owners", value: formatNumber(data.users.propertyOwners), icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", href: "/super-admin/users?role=PROPERTY_OWNER" },
    { title: "Vehicle Owners", value: formatNumber(data.users.vehicleOwners), icon: Car, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/40", href: "/super-admin/users?role=VEHICLE_OWNER" },
    { title: "Customers", value: formatNumber(data.users.customers), icon: Users, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/40", href: "/super-admin/users?role=CUSTOMER" },
    { title: "Total Listings", value: formatNumber(data.listings.total), icon: Package, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/40", href: "/super-admin/properties" },
    { title: "Active Listings", value: formatNumber(data.listings.active), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", href: "/super-admin/properties" },
    { title: "Pending Listings", value: formatNumber(data.listings.pending), icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", href: "/super-admin/properties/pending" },
    { title: "Featured Listings", value: formatNumber(data.listings.featured), icon: Star, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/40", href: "/super-admin/properties" },
    { title: "Verified Listings", value: formatNumber(data.listings.verified), icon: ShieldCheck, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40", href: "/super-admin/properties" },
    { title: "Total Payments", value: formatNumber(data.payments.total), icon: CreditCard, color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-950/40", href: "/super-admin/payments" },
    { title: "Total Revenue", value: formatCurrency(data.payments.totalRevenue), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", href: "/super-admin/payments" },
    { title: "Escrow Transactions", value: formatNumber(data.escrow.totalTransactions), icon: ShieldCheck, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/40", href: "/super-admin/escrow" },
    { title: "Pending Verifications", value: data.pendingVerifications, icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", href: "/super-admin/users" },
    { title: "Contact Messages", value: data.contactMessages, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", href: "/super-admin/settings" },
    { title: "Fraud Reports", value: data.fraudReports, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40", href: "/super-admin/reports" },
  ];

  const quickActions = [
    { label: "Manage Users", icon: Users, href: "/super-admin/users", color: "bg-blue-500" },
    { label: "Approve Listings", icon: ClipboardCheck, href: "/super-admin/properties/pending", color: "bg-emerald-500" },
    { label: "Verify Users", icon: ShieldCheck, href: "/super-admin/users", color: "bg-violet-500" },
    { label: "Manage Payments", icon: CreditCard, href: "/super-admin/payments", color: "bg-pink-500" },
    { label: "Manage Escrow", icon: ShieldCheck, href: "/super-admin/escrow", color: "bg-amber-500" },
    { label: "Manage Reports", icon: AlertTriangle, href: "/super-admin/reports", color: "bg-red-500" },
    { label: "Manage FAQs", icon: FileText, href: "/super-admin/settings", color: "bg-teal-500" },
    { label: "Announcements", icon: Megaphone, href: "/super-admin/settings", color: "bg-indigo-500" },
    { label: "Permissions", icon: Key, href: "/super-admin/settings", color: "bg-orange-500" },
    { label: "Audit Logs", icon: ScrollText, href: "/super-admin/settings", color: "bg-zinc-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Full platform overview — Dalaal marketplace
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </span>
                <span className={`p-1.5 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
                </span>
              </div>
              <div className="text-xl font-bold">{card.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">User Registration Statistics</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly user & broker growth</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={userGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#fafafa" }}
                itemStyle={{ color: "#a1a1aa" }}
              />
              <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} name="Users" />
              <Bar dataKey="brokers" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Brokers" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Overview */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Payments & escrow volume</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={(data as any).revenueChart || [
                { month: "Now", revenue: Math.floor(data.payments.totalRevenue / 12), escrow: Math.floor(data.escrow.totalVolume / 12) },
              ]}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEscrow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#fafafa" }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
              <Area type="monotone" dataKey="escrow" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorEscrow)" name="Escrow" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* User Role Breakdown */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-sm mb-4">User Role Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={userListingsByTypePie}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {userListingsByTypePie.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#fafafa" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {userListingsByTypePie.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  {item.name}
                </span>
                <span className="font-medium">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Property vs Vehicle Listings */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-sm mb-4">Property vs Vehicle Listings</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={listingsByTypePie}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {listingsByTypePie.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#fafafa" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {listingsByTypePie.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {item.name}
                </span>
                <span className="font-medium">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Statistics */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-sm mb-4">Payment Statistics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={paymentStatsData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {paymentStatsData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#fafafa" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {paymentStatsData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {item.name}
                </span>
                <span className="font-medium">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-accent transition-colors text-center"
            >
              <div className={`p-2.5 rounded-xl ${action.color} text-white`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Latest Listings */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-sm">Latest Listings</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Recently created listings</p>
            </div>
            <Link href="/super-admin/properties" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y">
            {data.recentActivities.latestListings.map((listing) => (
              <div key={listing.id} className="flex items-center gap-3 p-4">
                <div className={`p-2 rounded-lg ${listing.type === "PROPERTY" ? "bg-blue-50 dark:bg-blue-950/40" : "bg-orange-50 dark:bg-orange-950/40"}`}>
                  {listing.type === "PROPERTY" ? (
                    <Home className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Car className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{listing.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{listing.city}</span>
                    <span className="text-muted-foreground/50">|</span>
                    <span>{formatCurrency(listing.price)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(listing.status)}`}>
                    {listing.status.replace("_", " ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(listing.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Payments */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-sm">Latest Payments</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Recent payment transactions</p>
            </div>
            <Link href="/super-admin/payments" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y">
            {data.recentActivities.latestPayments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{payment.provider}</span>
                    <span className="text-muted-foreground/50">|</span>
                    <span>{payment.type.replace(/_/g, " ")}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(payment.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Latest Reviews */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-sm">Latest Reviews</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Recent user reviews</p>
            </div>
          </div>
          <div className="divide-y">
            {data.recentActivities.latestReviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3 p-4">
                <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/40">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{review.title}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.overallRating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{review.comment}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    by {review.reviewer.username || review.reviewer.email} → {review.reviewee.username || review.reviewee.email}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(review.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Reports */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-sm">Latest Reports</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Pending fraud reports</p>
            </div>
            <Link href="/super-admin/reports" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y">
            {data.recentActivities.latestReports.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">No pending reports</div>
            ) : (
              data.recentActivities.latestReports.map((report) => (
                <div key={report.id} className="flex items-start gap-3 p-4">
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{report.type}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{report.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      by {report.reporter.username || report.reporter.email}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeAgo(report.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Login Activity */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="font-semibold text-sm">Latest Login Activity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Recent user sessions</p>
            </div>
          </div>
          <div className="divide-y">
            {data.recentActivities.latestLogins.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-4">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">
                      {getInitials(user.username || user.email)}
                    </span>
                  </div>
                  {user.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.username || user.email}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(user.role === "SUPER_ADMIN" ? "FEATURED" : user.role === "BROKER" ? "ACTIVE" : user.role === "SUSPENDED" ? "SUSPENDED" : "PENDING")}`}>
                      {user.role.replace("_", " ")}
                    </span>
                    {user.isOnline && <span className="text-emerald-600 text-[10px]">Online</span>}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">{user.lastLoginAt ? timeAgo(user.lastLoginAt) : "Never"}</span>
                  <span className="text-[10px] text-muted-foreground/60">last seen {user.lastSeenAt ? timeAgo(user.lastSeenAt) : "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
