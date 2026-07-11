"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  Bookmark,
  Eye,
  Share2,
  Smartphone,
  ArrowUpRight,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Film,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";

interface Clip {
  id: number;
  title: string;
  price: string;
  location: string;
  type: "property" | "vehicle";
  broker: string;
  brokerInitials: string;
  views: string;
  likes: string;
  comments: string;
  bgImage: string;
  thumbnail: string;
}

const clips: Clip[] = [
  {
    id: 1,
    title: "Stunning Sea-View Penthouse Tour",
    price: "$1,200/mo",
    location: "Lido Beach, Mogadishu",
    type: "property",
    broker: "Aminu Dalaal",
    brokerInitials: "AD",
    views: "24.5k",
    likes: "3.2k",
    comments: "186",
    bgImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Toyota Hilux 4x4 Double Cabin Walkthrough",
    price: "$28,000",
    location: "Hargeisa Central",
    type: "vehicle",
    broker: "Khadra Motors",
    brokerInitials: "KM",
    views: "18.2k",
    likes: "2.1k",
    comments: "94",
    bgImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Prime Commercial Plot Near Airport Road",
    price: "$180,000",
    location: "Waberi, Mogadishu",
    type: "property",
    broker: "Sahal Lands",
    brokerInitials: "SL",
    views: "34.1k",
    likes: "4.8k",
    comments: "312",
    bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Luxury Diaspora Villa Full Walkthrough",
    price: "$245,000",
    location: "Hodan, Mogadishu",
    type: "property",
    broker: "Abdi Rahman",
    brokerInitials: "AR",
    views: "42.8k",
    likes: "6.1k",
    comments: "287",
    bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    title: "Nissan Patrol Super Safari Interior Tour",
    price: "$52,000",
    location: "KM4, Mogadishu",
    type: "vehicle",
    broker: "Amina Dalaal",
    brokerInitials: "AA",
    views: "29.3k",
    likes: "3.9k",
    comments: "158",
    bgImage: "https://images.unsplash.com/photo-1606611013016-969c19ba27c5?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1606611013016-969c19ba27c5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 6,
    title: "Modern 3-Bedroom Apartment Tour",
    price: "$750/mo",
    location: "Jigjiga Yar, Hargeisa",
    type: "property",
    broker: "Faisal Yusuf",
    brokerInitials: "FY",
    views: "15.7k",
    likes: "1.8k",
    comments: "73",
    bgImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 7,
    title: "Kia Sportage GT-Line Quick Review",
    price: "$55/day",
    location: "Jigjiga Yar, Hargeisa",
    type: "vehicle",
    broker: "Faisal Yusuf",
    brokerInitials: "FY",
    views: "21.4k",
    likes: "2.7k",
    comments: "112",
    bgImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 8,
    title: "Beachfront Family Villa Drone Shot",
    price: "$320,000",
    location: "Lido Beach, Mogadishu",
    type: "property",
    broker: "Sahal Properties",
    brokerInitials: "SP",
    views: "56.2k",
    likes: "8.4k",
    comments: "423",
    bgImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 9,
    title: "Toyota Land Cruiser Prado Desert Drive",
    price: "$48,500",
    location: "Garowe, Puntland",
    type: "vehicle",
    broker: "Mustafa Ali",
    brokerInitials: "MA",
    views: "38.6k",
    likes: "5.3k",
    comments: "241",
    bgImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80",
  },
];

export default function ClipsPage() {
  const [activeClipIdx, setActiveClipIdx] = useState(0);
  const [filter, setFilter] = useState<"all" | "property" | "vehicle">("all");
  const [likedClips, setLikedClips] = useState<Set<number>>(new Set());
  const [savedClips, setSavedClips] = useState<Set<number>>(new Set());

  const filteredClips = clips.filter((c) => filter === "all" || c.type === filter);
  const activeClip = filteredClips[activeClipIdx] || filteredClips[0];

  const handleNext = () => {
    setActiveClipIdx((prev) => (prev + 1) % filteredClips.length);
  };

  const handlePrev = () => {
    setActiveClipIdx((prev) => (prev - 1 + filteredClips.length) % filteredClips.length);
  };

  const toggleLike = (id: number) => {
    setLikedClips((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSavedClips((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/75 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/20">
                D
              </span>
              <span className="text-xl font-black tracking-tight text-white">
                Dalaal<span className="text-sky-600">.</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/properties" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                Properties
              </Link>
              <Link href="/vehicles" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                Vehicles
              </Link>
              <Link href="/clips" className="text-sm font-semibold text-sky-400 transition-colors">
                Clips
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white transition-all shadow-md shadow-sky-600/20">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Film className="w-4 h-4" />
            <span>Dalaal Clips</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Watch Property & Vehicle Tours
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            Short-form vertical video walkthroughs from verified brokers. Tap, swipe, and discover your next deal.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {[
            { label: "All Clips", value: "all" },
            { label: "Properties", value: "property" },
            { label: "Vehicles", value: "vehicle" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setFilter(tab.value as typeof filter); setActiveClipIdx(0); }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab.value
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Clip Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Active Clip - Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-80 h-[580px] bg-zinc-950 rounded-[48px] p-3 shadow-2xl border-4 border-zinc-800 ring-12 ring-zinc-900/50 flex flex-col overflow-hidden">
              {/* Camera Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-950 rounded-full z-30 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-900/80 mr-2 border border-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-900/80" />
              </div>

              {/* Screen */}
              <div className="relative flex-1 w-full h-full rounded-[38px] overflow-hidden bg-zinc-900 z-10 select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeClip.bgImage}
                  alt={activeClip.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-75 transition-all duration-700"
                />

                {/* Top View Count */}
                <div className="absolute top-12 left-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold">
                  <Eye className="w-3.5 h-3.5 text-zinc-300" />
                  <span>{activeClip.views} views</span>
                </div>

                {/* Floating Actions */}
                <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-5 items-center">
                  <button
                    onClick={() => toggleLike(activeClip.id)}
                    className="flex flex-col items-center gap-1 group text-white focus:outline-none"
                  >
                    <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
                      likedClips.has(activeClip.id) ? "bg-red-500/90 scale-110" : "bg-black/40 hover:bg-black/60"
                    }`}>
                      <Heart className={`w-5 h-5 ${likedClips.has(activeClip.id) ? "fill-white" : ""}`} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider drop-shadow">
                      {likedClips.has(activeClip.id) ? "Liked" : activeClip.likes}
                    </span>
                  </button>

                  <button className="flex flex-col items-center gap-1 text-white">
                    <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider drop-shadow">{activeClip.comments}</span>
                  </button>

                  <button
                    onClick={() => toggleSave(activeClip.id)}
                    className="flex flex-col items-center gap-1 text-white"
                  >
                    <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
                      savedClips.has(activeClip.id) ? "bg-sky-500/90 scale-110" : "bg-black/40 hover:bg-black/60"
                    }`}>
                      <Bookmark className={`w-5 h-5 ${savedClips.has(activeClip.id) ? "fill-white" : ""}`} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider drop-shadow">
                      {savedClips.has(activeClip.id) ? "Saved" : "Save"}
                    </span>
                  </button>

                  <button className="flex flex-col items-center gap-1 text-white">
                    <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider drop-shadow">Share</span>
                  </button>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-2xl text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-500 overflow-hidden flex items-center justify-center">
                      <span className="text-[9px] font-extrabold text-white">{activeClip.brokerInitials}</span>
                    </div>
                    <span className="text-xs font-bold">@{activeClip.broker}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      activeClip.type === "property" ? "bg-sky-600/80" : "bg-emerald-600/80"
                    }`}>
                      {activeClip.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed mb-3">
                    {activeClip.title}
                  </p>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-zinc-300 font-semibold tracking-wider uppercase">{activeClip.location}</div>
                      <div className="text-xs font-extrabold text-sky-300">{activeClip.price}</div>
                    </div>
                    <button className="px-3 py-1 bg-sky-600 hover:bg-sky-500 rounded-lg text-[10px] font-bold tracking-wide transition-colors">
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:block">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block">
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Clip Details Sidebar */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{activeClip.title}</h2>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {activeClip.location}
                </span>
                <span>·</span>
                <span className="font-bold text-sky-400">{activeClip.price}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {activeClip.views}
                </span>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-white">{activeClip.likes}</div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Likes</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-white">{activeClip.views}</div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Views</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-white">{activeClip.comments}</div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Comments</div>
              </div>
            </div>

            {/* Clip Grid */}
            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">All Clips</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredClips.map((clip, idx) => (
                  <button
                    key={clip.id}
                    onClick={() => setActiveClipIdx(idx)}
                    className={`group relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activeClipIdx
                        ? "border-sky-500 ring-2 ring-sky-500/20"
                        : "border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clip.thumbnail}
                      alt={clip.title}
                      className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition-all"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                      <div className="p-2 rounded-full bg-black/50 mb-2">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                      <span className="text-[9px] font-bold text-white text-center line-clamp-2 drop-shadow-lg">
                        {clip.title}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-[8px] font-bold text-zinc-300 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">
                        {clip.views}
                      </span>
                      <span className={`text-[8px] font-bold text-white px-1.5 py-0.5 rounded ${
                        clip.type === "property" ? "bg-sky-600/80" : "bg-emerald-600/80"
                      }`}>
                        {clip.type === "property" ? "PROP" : "VEH"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 border-t border-zinc-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Why Dalaal Clips?</h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              The fastest way to preview properties and vehicles before visiting in person.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-sky-950/50 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Vertical-First Design</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Full-screen immersive player built for mobile. Swipe through listings like Reels.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-950/50 flex items-center justify-center">
                <Play className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Broker Walkthroughs</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Every clip is filmed by a verified Dalaal broker with real-time pricing overlays.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-950/50 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Instant Inquiries</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Like, comment, or tap Inquire to start a secure WebRTC call with the listing agent.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 my-12 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Create Your Own Clip
            </h2>
            <p className="text-sky-100 text-sm sm:text-base max-w-lg mx-auto mb-6">
              Record a walkthrough of your listing, add pricing overlays, and publish to thousands of buyers across Somalia.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-zinc-900 hover:bg-zinc-100 transition-colors shadow-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 hover:border-white/60 px-6 text-sm font-bold text-white transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/20">D</span>
              <span className="text-xl font-black tracking-tight text-white">Dalaal</span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Somalia&apos;s premier real estate and vehicle marketplace. Secure transactions, verified agents, and live video tours.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest mb-4">Properties</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-400">
              <li><Link href="/properties" className="hover:text-sky-400 transition-colors">All Properties</Link></li>
              <li><Link href="/properties" className="hover:text-sky-400 transition-colors">Villas & Houses</Link></li>
              <li><Link href="/properties" className="hover:text-sky-400 transition-colors">Apartments</Link></li>
              <li><Link href="/properties" className="hover:text-sky-400 transition-colors">Commercial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest mb-4">Vehicles</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-400">
              <li><Link href="/vehicles" className="hover:text-emerald-400 transition-colors">All Vehicles</Link></li>
              <li><Link href="/vehicles" className="hover:text-emerald-400 transition-colors">SUVs & Pickups</Link></li>
              <li><Link href="/vehicles" className="hover:text-emerald-400 transition-colors">Sedans</Link></li>
              <li><Link href="/vehicles" className="hover:text-emerald-400 transition-colors">Daily Rentals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest mb-4">More</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-400">
              <li><Link href="/clips" className="hover:text-sky-400 transition-colors">Clips</Link></li>
              <li><Link href="/login" className="hover:text-sky-400 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-sky-400 transition-colors">Create Account</Link></li>
              <li><Link href="/" className="hover:text-sky-400 transition-colors">Home</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 mt-12 border-t border-zinc-800 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
          © {new Date().getFullYear()} Dalaal Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
