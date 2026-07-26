"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Search,
  Heart,
  Calendar,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { favoritesService, chatService, adminService, api } from "@/lib/api";
import { Megaphone, AlertCircle } from "lucide-react";

const AnnouncementBanner = ({ announcements }: { announcements: any[] }) => {
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {announcements.map((a: any) => (
        <div key={a.id} className={`flex items-start gap-3 p-4 rounded-2xl border shadow-sm ${
          a.type === 'MAINTENANCE' ? 'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/40 text-red-800 dark:text-red-200' :
          a.type === 'FEATURE' ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/40 text-blue-800 dark:text-blue-200' :
          'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200'
        }`}>
          <div className={`p-2 rounded-xl shrink-0 ${
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


export default function CustomerDashboard() {
  const { user } = useAuth();
  const name = user?.profile?.firstName || user?.email?.split("@")[0] || "there";

  const [favCount, setFavCount] = useState(0);
  const [convCount, setConvCount] = useState(0);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [favData, convData, annData] = await Promise.allSettled([
        favoritesService.getMy(),
        chatService.getConversations(),
        adminService.getPublicAnnouncements(),
      ]);

      if (favData.status === "fulfilled") {
        const favs = Array.isArray(favData.value) ? favData.value : favData.value?.favorites ?? favData.value?.data ?? [];
        setFavCount(favs.length);
        setFavorites(favs.slice(0, 4));
      }

      if (convData.status === "fulfilled") {
        const convs = Array.isArray(convData.value) ? convData.value : convData.value?.conversations ?? convData.value?.data ?? [];
        setConvCount(convs.length);
        setConversations(convs.slice(0, 2));
      }

      if (annData.status === "fulfilled") {
        const anns = Array.isArray(annData.value) ? annData.value : annData.value?.announcements ?? annData.value?.data ?? [];
        setAnnouncements(anns.filter((a: any) => a.isActive));
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* 1. Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-zinc-950 p-8 text-white shadow-2xl border border-emerald-700/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Protected by Dalaal Escrow Deposit Guarantee
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome Back, {name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              Search verified properties across Mogadishu, Hargeisa, Garowe, Bosaso, and Kismayo. Track your viewing requests and active inquiries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/pages/customer/search"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30"
            >
              <Search className="w-4 h-4" />
              <span>Search Properties</span>
            </Link>
            <Link
              href="/pages/customer/favorites"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 text-white font-bold text-xs border border-emerald-600/40 transition-all"
            >
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span>Wishlist ({favCount})</span>
            </Link>
          </div>
        </div>
      </div>

      <AnnouncementBanner announcements={announcements} />

      {/* 2. Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link href="/pages/customer/search" className="group">
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group-hover:border-emerald-500/50 transition-all h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Marketplace Listings</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>Browse</span>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-[11px] text-muted-foreground">Explore verified villas & apartments</p>
          </div>
        </Link>

        <Link href="/pages/customer/favorites" className="group">
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group-hover:border-emerald-500/50 transition-all h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Saved Favorites</span>
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500">
                <Heart className="w-4 h-4 fill-red-500" />
              </div>
            </div>
            <div className="text-3xl font-black">{favCount}</div>
            <p className="text-[11px] text-muted-foreground">Properties in your wishlist</p>
          </div>
        </Link>

        <Link href="/pages/customer/bookings" className="group">
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group-hover:border-emerald-500/50 transition-all h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Conversations</span>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black">{convCount}</div>
            <p className="text-[11px] text-muted-foreground">Active broker chats</p>
          </div>
        </Link>

        <Link href="/pages/customer/messages" className="group">
          <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden group-hover:border-emerald-500/50 transition-all h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Messages</span>
              <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black">{convCount}</div>
            <p className="text-[11px] text-muted-foreground">Conversations with brokers</p>
          </div>
        </Link>
      </div>

      {/* 3. Recent Conversations */}
      {conversations.length > 0 && (
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base">Recent Conversations</h3>
              <p className="text-xs text-muted-foreground">Your active chats with brokers</p>
            </div>
            <Link href="/pages/customer/messages" className="text-xs font-bold text-emerald-600 hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversations.map((conv: any) => (
              <div key={conv.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                <h4 className="font-bold text-sm">{conv.listing?.title || conv.title || "Conversation"}</h4>
                <p className="text-xs text-muted-foreground">
                  {conv.lastMessageAt ? `Last active ${new Date(conv.lastMessageAt).toLocaleDateString()}` : `Started ${new Date(conv.createdAt).toLocaleDateString()}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Saved Favorites Showcase Grid */}
      {favorites.length > 0 && (
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base">Saved Favorites</h3>
              <p className="text-xs text-muted-foreground">Quick access to listings you are monitoring</p>
            </div>
            <Link href="/pages/customer/favorites" className="text-xs font-bold text-emerald-600 hover:underline">
              Manage Wishlist →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((fav: any) => {
              const listing = fav.listing;
              if (!listing) return null;
              const image = listing.images?.[0]?.url || "/placeholder-property.jpg";
              const price = `${listing.currency === "USD" ? "$" : ""}${Number(listing.price).toLocaleString()}`;
              return (
                <div key={fav.id} className="rounded-xl border overflow-hidden flex flex-col sm:flex-row hover:border-emerald-500/50 transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={listing.title} className="w-full sm:w-44 h-36 object-cover shrink-0" />
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-sm">{listing.title}</h4>
                      <p className="text-xs text-muted-foreground">{listing.city}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        {price}
                      </span>
                      <Link
                        href={`/listings/${listing.id}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
