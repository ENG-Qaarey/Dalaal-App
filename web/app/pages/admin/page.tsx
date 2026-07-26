"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  ShieldCheck,
  Download,
  Calendar,
  ChevronDown,
  Home,
  Search,
  AlertTriangle,
  MessageSquare,
  Eye,
  Clock,
  Car,
  FileText,
  Star,
  CreditCard,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { adminService } from "@/lib/api";

const ROLE_COLORS: Record<string, string> = {
  BROKER: "#3b82f6",
  PROPERTY_OWNER: "#10b981",
  VEHICLE_OWNER: "#f59e0b",
  CUSTOMER: "#8b5cf6",
  SUPER_ADMIN: "#ef4444",
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const name = user?.profile?.firstName || user?.email?.split("@")[0] || "Admin";

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((data) => setDashboard(data))
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const users = dashboard?.users ?? {};
  const listings = dashboard?.listings ?? {};
  const payments = dashboard?.payments ?? {};
  const escrow = dashboard?.escrow ?? {};
  const recentActivities = dashboard?.recentActivities ?? {};

  const userDistribution = Object.entries({
    Brokers: users.brokers ?? 0,
    "Property Owners": users.propertyOwners ?? 0,
    "Vehicle Owners": users.vehicleOwners ?? 0,
    Customers: users.customers ?? 0,
    Admins: users.superAdmins ?? 0,
  })
    .map(([name, value]) => ({ name, value: value as number }))
    .filter((d) => d.value > 0);

  const listingDistribution = [
    { name: "Active", value: listings.active ?? 0, color: "#10b981" },
    { name: "Pending", value: listings.pending ?? 0, color: "#f59e0b" },
    { name: "Featured", value: listings.featured ?? 0, color: "#3b82f6" },
  ].filter((d) => d.value > 0);

  const kpis = [
    {
      icon: Users,
      label: "Total Users",
      value: formatNumber(users.total ?? 0),
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      href: "/pages/admin/users",
    },
    {
      icon: Home,
      label: "Active Listings",
      value: formatNumber(listings.active ?? 0),
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      href: "/pages/admin/listings",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${formatNumber(payments.totalRevenue ?? 0)}`,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      href: "/pages/admin/payments",
    },
    {
      icon: Activity,
      label: "Escrow Volume",
      value: `$${formatNumber(escrow.totalVolume ?? 0)}`,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      href: "/pages/admin/escrow",
    },
    {
      icon: Clock,
      label: "Pending Verifs",
      value: String(dashboard?.pendingVerifications ?? 0),
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/10",
      href: "/pages/admin/verifications",
    },
    {
      icon: AlertTriangle,
      label: "Open Reports",
      value: String(dashboard?.fraudReports ?? 0),
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
      href: "/pages/admin/reports",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-950 p-8 text-white shadow-2xl border border-indigo-700/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Secure Admin Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome Back, {name}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
              Monitor escrow transactions, approve pending properties/vehicles, manage system users, and review dispute reports across Somalia.
            </p>
            <div className="flex items-center gap-4 pt-1 text-[11px] text-indigo-300/70 font-semibold">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {listings.active ?? 0} active listings</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {users.total ?? 0} registered users</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/pages/admin/reports" className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-lg shadow-red-600/30">
              <AlertTriangle className="w-4 h-4" /> View Reports ({dashboard?.fraudReports ?? 0})
            </Link>
            <Link href="/pages/admin/verifications" className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-indigo-950/60 hover:bg-indigo-900 text-white font-bold text-xs border border-indigo-600/40 transition-all">
              <UserCheck className="w-4 h-4" /> Verifications ({dashboard?.pendingVerifications ?? 0})
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-[10px] p-5 space-y-3 shadow-sm animate-pulse">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))
          : kpis.map((kpi) => (
              <Link key={kpi.label} href={kpi.href} className="bg-card border border-border rounded-[10px] p-4 shadow-sm space-y-2 group hover:border-indigo-500/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                  <div className={`p-2 rounded-[10px] ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                    <kpi.icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                </div>
              </Link>
            ))}
      </div>

      {/* Middle Section: Listings + Users charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Listings Distribution */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground">Listing Distribution</h3>
            <p className="text-xs text-muted-foreground mt-1">By Status</p>
          </div>
          {loading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : listingDistribution.length > 0 ? (
            <div className="flex items-center gap-6">
              <div className="w-40 h-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={listingDistribution}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {listingDistribution.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 text-sm flex-1">
                {listingDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-semibold">{item.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                  Total: {(listings.total ?? 0).toLocaleString()} · Property: {(listings.property ?? 0)} · Vehicle: {(listings.vehicle ?? 0)}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No listings data</p>
          )}
        </div>

        {/* User Distribution */}
        <div className="lg:col-span-7 bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground">User Distribution</h3>
            <p className="text-xs text-muted-foreground mt-1">By Role</p>
          </div>
          {loading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : userDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={userDistribution} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {userDistribution.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={ROLE_COLORS[entry.name] ?? "#6b7280"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">No users</p>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Listings */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-card-foreground">Recent Listings</h3>
            <Link href="/pages/admin/listings" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (recentActivities.latestListings ?? []).length > 0 ? (
            <div className="space-y-3">
              {recentActivities.latestListings.map((listing: any) => (
                <div key={listing.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {listing.type === "PROPERTY" ? <Home className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium truncate">{listing.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {listing.user?.username ?? listing.user?.email} · {listing.city}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-sm font-medium">{listing.currency} {Number(listing.price).toLocaleString()}</div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      listing.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-600" :
                      listing.status === "PENDING_REVIEW" ? "bg-amber-500/10 text-amber-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {listing.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent listings</p>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-card-foreground">Recent Payments</h3>
            <Link href="/pages/admin/payments" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (recentActivities.latestPayments ?? []).length > 0 ? (
            <div className="space-y-3">
              {recentActivities.latestPayments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{payment.user?.email ?? payment.user?.username}</div>
                      <div className="text-xs text-muted-foreground">{payment.provider} · {payment.type}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-sm font-medium">{payment.currency} {Number(payment.amount).toLocaleString()}</div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      payment.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600" :
                      payment.status === "PENDING" ? "bg-amber-500/10 text-amber-600" :
                      "bg-red-500/10 text-red-600"
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent payments</p>
          )}
        </div>

        {/* Recent Reports */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-card-foreground">Recent Reports</h3>
            <Link href="/pages/admin/reports" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (recentActivities.latestReports ?? []).length > 0 ? (
            <div className="space-y-3">
              {recentActivities.latestReports.map((report: any) => (
                <div key={report.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{report.type}</div>
                      <div className="text-xs text-muted-foreground">{report.reporter?.email ?? report.reporter?.username}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      report.status === "SUBMITTED" || report.status === "PENDING" || report.status === "OPEN" ? "bg-blue-500/10 text-blue-600" :
                      report.status === "INVESTIGATING" || report.status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-600" :
                      report.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-600" :
                      report.status === "DISMISSED" || report.status === "CLOSED" ? "bg-red-500/10 text-red-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {report.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reports</p>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-card-foreground">Recent Reviews</h3>
            <Link href="/pages/admin/reviews" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (recentActivities.latestReviews ?? []).length > 0 ? (
            <div className="space-y-3">
              {recentActivities.latestReviews.map((review: any) => (
                <div key={review.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Star className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {review.reviewer?.username ?? review.reviewer?.email} → {review.reviewee?.username ?? review.reviewee?.email}
                      </div>
                      <div className="text-xs text-muted-foreground">{review.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{review.overallRating}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet</p>
          )}
        </div>
      </div>

      {/* Recent Logins */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground">Recent Logins</h3>
            <p className="text-xs text-muted-foreground mt-1">Platform user activity</p>
          </div>
          <Link href="/pages/admin/audit-logs" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (recentActivities.latestLogins ?? []).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs font-semibold">
                  <th className="p-3 pl-0">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Login</th>
                  <th className="p-3 pr-0 text-right">Online</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentActivities.latestLogins.map((user: any) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 pl-0">
                      <div>
                        <div className="font-medium text-foreground">{user.username ?? user.email}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{user.role?.replace("_", " ")}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-600" :
                        user.status === "SUSPENDED" ? "bg-amber-500/10 text-amber-600" :
                        "bg-red-500/10 text-red-600"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">{user.lastLoginAt ? timeAgo(user.lastLoginAt) : "Never"}</td>
                    <td className="p-3 pr-0 text-right">
                      {user.isOnline ? (
                        <span className="flex items-center gap-1.5 justify-end text-xs text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Offline</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent logins</p>
        )}
      </div>
    </div>
  );
}
