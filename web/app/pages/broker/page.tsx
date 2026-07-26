"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { agentsService, listingsService, adminService } from "@/lib/api";
import {
  Building2, PlusCircle, Eye, MessageSquare, BadgeCheck, TrendingUp,
  ArrowUpRight, PhoneCall, CheckCircle2, Loader2, AlertCircle, Heart,
  Star, Clock, Car, MapPin, DollarSign, BarChart3, Users, FileText,
  Shield, RefreshCw, Send, Pencil, Trash2, TrendingDown, Zap, Target,
  Award, Activity, ChevronRight, Calendar, Home, Search, Filter,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";

const AnnouncementBanner = ({ announcements }: { announcements: any[] }) => {
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {announcements.map((a: any) => (
        <div key={a.id} className={`flex items-start gap-3 p-4 rounded-[10px] border shadow-sm ${
          a.type === 'MAINTENANCE' ? 'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40 text-red-800 dark:text-red-200' :
          a.type === 'FEATURE' ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/40 text-blue-800 dark:text-blue-200' :
          'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200'
        }`}>
          <div className={`p-2 rounded-lg shrink-0 ${
            a.type === 'MAINTENANCE' ? 'bg-red-100 dark:bg-red-900/40 text-red-600' :
            a.type === 'FEATURE' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' :
            'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
          }`}>
            {a.type === 'MAINTENANCE' ? <AlertCircle className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-bold text-sm">{a.title}</h4>
            <p className="text-xs opacity-90 leading-relaxed">{a.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

export default function BrokerDashboard() {
  const { user } = useAuth();
  const name = user?.profile?.firstName || user?.email?.split("@")[0] || "Broker";

  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [statsData, listingsData, annData] = await Promise.all([
          agentsService.getStats(period),
          listingsService.getMine().catch(() => []),
          adminService.getPublicAnnouncements().catch(() => []),
        ]);
        setStats(statsData);
        setListings(Array.isArray(listingsData) ? listingsData : listingsData?.listings ?? []);
        const anns = Array.isArray(annData) ? annData : annData?.announcements ?? annData?.data ?? [];
        setAnnouncements(anns.filter((a: any) => a.isActive));
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [period]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-r from-blue-900 via-indigo-900 to-zinc-950 p-8 text-white animate-pulse">
          <div className="h-8 w-64 bg-white/20 rounded mb-2" />
          <div className="h-4 w-96 bg-white/10 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border rounded-[10px] p-5 shadow-sm animate-pulse">
              <div className="h-4 w-20 bg-muted rounded mb-3" />
              <div className="h-8 w-14 bg-muted rounded mb-2" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border rounded-[10px] p-6 shadow-sm h-80 animate-pulse" />
          <div className="bg-card border rounded-[10px] p-6 shadow-sm h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="font-bold text-lg">Failed to load dashboard</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-[10px] text-sm font-semibold hover:bg-primary/90">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const activeListings = stats?.activeListings ?? 0;
  const totalViews = stats?.views?.total ?? 0;
  const totalLeads = stats?.leads?.active ?? stats?.totalInquiries ?? 0;
  const conversionRate = stats?.conversion?.rate ?? 0;
  const topListings = stats?.listingBreakdown ?? [];
  const recentLeads = stats?.recentLeads ?? [];
  const totalFavorites = stats?.favorites?.total ?? 0;
  const profileRating = stats?.profile?.rating ?? 0;
  const reviewCount = stats?.profile?.reviewCount ?? 0;
  const responseRate = stats?.profile?.responseRate ?? 0;
  const totalListings = stats?.listings?.total ?? 0;

  const pendingListings = listings.filter((l: any) => l.status === "PENDING_REVIEW").length;
  const draftListings = listings.filter((l: any) => l.status === "DRAFT").length;
  const rejectedListings = listings.filter((l: any) => l.status === "REJECTED").length;
  const featuredListings = listings.filter((l: any) => l.status === "FEATURED").length;

  const listingStatusData = [
    { name: "Active", value: activeListings, color: "#10b981" },
    { name: "Pending", value: pendingListings, color: "#f59e0b" },
    { name: "Draft", value: draftListings, color: "#a1a1aa" },
    { name: "Rejected", value: rejectedListings, color: "#ef4444" },
    { name: "Featured", value: featuredListings, color: "#3b82f6" },
  ].filter((d) => d.value > 0);

  const propertyCount = listings.filter((l: any) => l.type === "PROPERTY").length;
  const vehicleCount = listings.filter((l: any) => l.type === "VEHICLE").length;
  const typeBreakdown = [
    { name: "Property", value: propertyCount, color: "#3b82f6" },
    { name: "Vehicle", value: vehicleCount, color: "#8b5cf6" },
  ].filter((d) => d.value > 0);

  const weeklyData =
    topListings.slice(0, 7).map((l: any, i: number) => ({
      name: l.title?.length > 12 ? l.title.slice(0, 12) + "..." : l.title || `#${i + 1}`,
      views: l.viewCount || 0,
      leads: l.inquiryCount || 0,
      favorites: l.favoriteCount || 0,
    })) ?? [];

  const cityBreakdown: Record<string, number> = {};
  listings.forEach((l: any) => {
    if (l.city) cityBreakdown[l.city] = (cityBreakdown[l.city] || 0) + 1;
  });
  const topCities = Object.entries(cityBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const avgPrice = listings.length > 0
    ? listings.reduce((sum: number, l: any) => sum + (l.price || 0), 0) / listings.length
    : 0;

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-r from-blue-900 via-indigo-900 to-zinc-950 p-8 text-white shadow-2xl border border-blue-700/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 backdrop-blur-md">
              <BadgeCheck className="w-4 h-4 text-sky-400" /> Verified Dalaal Broker Space
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome Back, {name}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/80 leading-relaxed">
              Manage property listings, respond to direct customer leads, and keep your sales pipeline moving.
            </p>
            <div className="flex items-center gap-4 pt-1 text-[11px] text-blue-300/70 font-semibold">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
              <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {activeListings} active listings</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/pages/broker/listings/create" className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30">
              <PlusCircle className="w-4 h-4" /> Create New Listing
            </Link>
            <Link href="/pages/broker/messages" className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-blue-950/60 hover:bg-blue-900 text-white font-bold text-xs border border-blue-600/40 transition-all">
              <MessageSquare className="w-4 h-4" /> Messages
            </Link>
          </div>
        </div>
      </div>

      <AnnouncementBanner announcements={announcements} />

      {/* Period Selector */}
      <div className="flex items-center gap-2">
        {[
          { label: "7 Days", value: "7d" },
          { label: "30 Days", value: "30d" },
          { label: "90 Days", value: "90d" },
          { label: "1 Year", value: "1y" },
        ].map((p) => (
          <button key={p.value} onClick={() => setPeriod(p.value)}
            className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all ${
              period === p.value
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI Cards Row - 6 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Link href="/pages/broker/listings" className="bg-card border rounded-[10px] p-4 shadow-sm space-y-2 group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Active</span>
            <div className="p-2 rounded-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600"><Building2 className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-black">{activeListings}</div>
          <div className="text-[10px] text-muted-foreground font-bold">{totalListings} total</div>
        </Link>

        <div className="bg-card border rounded-[10px] p-4 shadow-sm space-y-2 group hover:border-violet-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Views</span>
            <div className="p-2 rounded-[10px] bg-violet-50 dark:bg-violet-950/40 text-violet-600"><Eye className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-black">{totalViews.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[10px] font-bold">
            {stats?.views?.changePercent > 0 ? (
              <span className="text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{stats.views.changePercent}%</span>
            ) : stats?.views?.changePercent < 0 ? (
              <span className="text-red-600 flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{stats.views.changePercent}%</span>
            ) : (
              <span className="text-muted-foreground">vs last period</span>
            )}
          </div>
        </div>

        <Link href="/pages/broker/clients" className="bg-card border rounded-[10px] p-4 shadow-sm space-y-2 group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Leads</span>
            <div className="p-2 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"><Users className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-black">{totalLeads}</div>
          <div className="text-[10px] text-muted-foreground font-bold">{recentLeads.length} recent</div>
        </Link>

        <div className="bg-card border rounded-[10px] p-4 shadow-sm space-y-2 group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Conversion</span>
            <div className="p-2 rounded-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-600"><Target className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-black">{conversionRate.toFixed(1)}%</div>
          <div className="text-[10px] text-muted-foreground font-bold">lead-to-inquiry</div>
        </div>

        <div className="bg-card border rounded-[10px] p-4 shadow-sm space-y-2 group hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Favorites</span>
            <div className="p-2 rounded-[10px] bg-rose-50 dark:bg-rose-950/40 text-rose-600"><Heart className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-black">{totalFavorites}</div>
          <div className="text-[10px] text-muted-foreground font-bold">saved by users</div>
        </div>

        <div className="bg-card border rounded-[10px] p-4 shadow-sm space-y-2 group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Rating</span>
            <div className="p-2 rounded-[10px] bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600"><Star className="w-3.5 h-3.5" /></div>
          </div>
          <div className="text-2xl font-black">{profileRating > 0 ? profileRating.toFixed(1) : "N/A"}</div>
          <div className="text-[10px] text-muted-foreground font-bold">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border rounded-[10px] p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
            <DollarSign className="w-3.5 h-3.5" /> Avg. Price
          </div>
          <div className="text-lg font-black">${Math.round(avgPrice).toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground font-bold">across all listings</div>
        </div>
        <div className="bg-card border rounded-[10px] p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </div>
          <div className="text-lg font-black text-amber-600">{pendingListings}</div>
          <div className="text-[10px] text-muted-foreground font-bold">awaiting admin</div>
        </div>
        <div className="bg-card border rounded-[10px] p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
            <FileText className="w-3.5 h-3.5" /> Drafts
          </div>
          <div className="text-lg font-black text-zinc-500">{draftListings}</div>
          <div className="text-[10px] text-muted-foreground font-bold">incomplete listings</div>
        </div>
        <div className="bg-card border rounded-[10px] p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
            <Shield className="w-3.5 h-3.5" /> Response Rate
          </div>
          <div className="text-lg font-black">{responseRate > 0 ? `${responseRate}%` : "N/A"}</div>
          <div className="text-[10px] text-muted-foreground font-bold">to customer leads</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Bar Chart */}
        <div className="lg:col-span-2 bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base">Listing Performance</h3>
              <p className="text-xs text-muted-foreground">Views, leads & favorites per listing</p>
            </div>
          </div>
          <div className="h-72 w-full pt-4">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} angle={-20} textAnchor="end" height={50} />
                  <YAxis stroke="#a1a1aa" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Views" />
                  <Bar dataKey="leads" fill="#10b981" radius={[4, 4, 0, 0]} name="Leads" />
                  <Bar dataKey="favorites" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Favorites" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No listing data yet</div>
            )}
          </div>
        </div>

        {/* Listing Status Pie */}
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base">Listing Status</h3>
            <p className="text-xs text-muted-foreground">Distribution across all statuses</p>
          </div>
          <div className="h-56">
            {listingStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={listingStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {listingStatusData.map((entry: any, i: number) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {listingStatusData.map((d: any) => (
              <div key={d.name} className="flex items-center gap-2 text-[11px] font-bold">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leads + Reviews + Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base">Recent Leads</h3>
              <p className="text-xs text-muted-foreground">Latest customer inquiries</p>
            </div>
            <Link href="/pages/broker/clients" className="text-xs text-blue-600 font-bold hover:underline">View All</Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No leads yet</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentLeads.slice(0, 5).map((lead: any, i: number) => (
                <div key={i} className="p-3 rounded-[10px] border border-border bg-muted/20 hover:border-blue-500/40 transition-all space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs">{lead.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lead.status === "New"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    }`}>{lead.status}</span>
                  </div>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{lead.property}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">{lead.time}</p>
                </div>
              ))}
            </div>
          )}
          <Link href="/pages/broker/messages" className="w-full h-10 flex items-center justify-center gap-1.5 rounded-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md">
            <PhoneCall className="w-3.5 h-3.5" /> Open Messages
          </Link>
        </div>

        {/* Reviews & Rating */}
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base">Profile & Reviews</h3>
              <p className="text-xs text-muted-foreground">Your reputation score</p>
            </div>
            <Link href="/pages/broker/reviews" className="text-xs text-blue-600 font-bold hover:underline">All Reviews</Link>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-[10px] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/40">
            <div className="text-center">
              <div className="text-4xl font-black text-amber-600">{profileRating > 0 ? profileRating.toFixed(1) : "—"}</div>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(profileRating) ? "fill-amber-400 text-amber-400" : "text-amber-200 dark:text-amber-700"}`} />
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground font-bold mt-1">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">Response Rate</span>
                <span>{responseRate > 0 ? `${responseRate}%` : "N/A"}</span>
              </div>
              <div className="w-full h-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${responseRate}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">Total Listings</span>
                <span>{stats?.profile?.totalListings ?? totalListings}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-[10px] bg-muted/30 text-[11px] font-bold">
              <span className="text-muted-foreground flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Verified Broker</span>
              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-[10px] bg-muted/30 text-[11px] font-bold">
              <span className="text-muted-foreground flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Account Status</span>
              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Good Standing</span>
            </div>
          </div>
          <Link href="/pages/broker/verification" className="w-full h-10 flex items-center justify-center gap-1.5 rounded-[10px] bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-md">
            <Shield className="w-3.5 h-3.5" /> Verification Status
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">Frequently used broker tools</p>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Create New Listing", desc: "Add a property or vehicle", href: "/pages/broker/listings/create", icon: PlusCircle, iconBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600" },
              { label: "View All Listings", desc: `${totalListings} total listings`, href: "/pages/broker/listings", icon: Building2, iconBg: "bg-violet-50 dark:bg-violet-950/40 text-violet-600" },
              { label: "Client Messages", desc: `${totalLeads} active leads`, href: "/pages/broker/messages", icon: MessageSquare, iconBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600" },
              { label: "Performance Analytics", desc: "Detailed metrics & trends", href: "/pages/broker/listings/performance", icon: BarChart3, iconBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600" },
              { label: "Reports & Insights", desc: "Export data & analytics", href: "/pages/broker/reports", icon: FileText, iconBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600" },
              { label: "Account Settings", desc: "Profile & preferences", href: "/pages/broker/settings", icon: Shield, iconBg: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600" },
            ].map((action) => (
              <Link key={action.label} href={action.href}
                className="flex items-center gap-3 p-3 rounded-[10px] border border-border hover:border-blue-500/40 hover:bg-muted/30 transition-all group">
                <div className={`p-2 rounded-[10px] ${action.iconBg}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold group-hover:text-blue-600 transition-colors">{action.label}</div>
                  <div className="text-[10px] text-muted-foreground font-bold">{action.desc}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top Listings Table */}
      <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Top Listings by Views</h3>
            <p className="text-xs text-muted-foreground">Your best performing listings</p>
          </div>
          <Link href="/pages/broker/listings" className="text-xs font-bold text-blue-600 hover:underline">Manage All →</Link>
        </div>
        {topListings.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-bold">No listings yet</p>
            <p className="text-xs mt-1">Create your first listing to start reaching customers.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-3 font-semibold text-muted-foreground">#</th>
                  <th className="p-3 font-semibold text-muted-foreground">Title</th>
                  <th className="p-3 font-semibold text-muted-foreground">Type</th>
                  <th className="p-3 font-semibold text-muted-foreground">Status</th>
                  <th className="p-3 font-semibold text-muted-foreground text-right">Views</th>
                  <th className="p-3 font-semibold text-muted-foreground text-right">Favorites</th>
                  <th className="p-3 font-semibold text-muted-foreground text-right">Leads</th>
                  <th className="p-3 font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topListings.slice(0, 7).map((l: any, i: number) => (
                  <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-muted-foreground font-mono">{i + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-foreground">{l.title}</div>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1 text-muted-foreground font-semibold">
                        {l.type === "VEHICLE" ? <Car className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                        {l.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        l.status === "ACTIVE" ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                          : l.status === "PENDING_REVIEW" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                          : l.status === "FEATURED" ? "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300"
                      }`}>{l.status?.replace(/_/g, " ") ?? "DRAFT"}</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold">{(l.viewCount ?? 0).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <span className="flex items-center justify-end gap-1 text-rose-600 font-bold">
                        <Heart className="w-3 h-3" /> {l.favoriteCount ?? 0}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="flex items-center justify-end gap-1 text-emerald-600 font-bold">
                        <MessageSquare className="w-3 h-3" /> {l.inquiryCount ?? 0}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link href={`/pages/broker/listings/${l.id}/edit`}
                        className="p-1.5 rounded-[10px] text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors inline-flex">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Row: City Breakdown + Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Distribution */}
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base">Listings by City</h3>
            <p className="text-xs text-muted-foreground">Geographic distribution of your portfolio</p>
          </div>
          {topCities.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No city data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCities.map(([city, count]) => {
                const pct = totalListings > 0 ? (count / totalListings) * 100 : 0;
                return (
                  <div key={city} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-muted-foreground" /> {city}</span>
                      <span className="text-muted-foreground">{count} listing{count !== 1 ? "s" : ""} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Type Distribution */}
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base">Property vs Vehicle</h3>
            <p className="text-xs text-muted-foreground">Listing type breakdown</p>
          </div>
          <div className="h-48">
            {typeBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                    {typeBreakdown.map((entry: any, i: number) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-[10px] bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-center">
              <Home className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-black text-blue-600">{propertyCount}</div>
              <div className="text-[10px] font-bold text-muted-foreground">Properties</div>
            </div>
            <div className="p-3 rounded-[10px] bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/40 text-center">
              <Car className="w-5 h-5 text-violet-600 mx-auto mb-1" />
              <div className="text-lg font-black text-violet-600">{vehicleCount}</div>
              <div className="text-[10px] font-bold text-muted-foreground">Vehicles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
