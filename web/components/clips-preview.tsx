"use client";

import { useState } from "react";
import { Play, Pause, Heart, MessageCircle, Bookmark, Eye, Sparkles, Smartphone, ChevronRight } from "lucide-react";

interface ClipMockup {
  id: number;
  title: string;
  price: string;
  location: string;
  broker: string;
  views: string;
  likes: string;
  bgImage: string;
}

const mockClips: ClipMockup[] = [
  {
    id: 1,
    title: "Stunning Sea-View Penthouse Tour",
    price: "$1,200/mo",
    location: "Lido Beach, Mogadishu",
    broker: "Aminu Dalaal",
    views: "24.5k",
    likes: "3.2k",
    bgImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Toyota Hilux 4x4 Double Cabin Walkthrough",
    price: "$28,000",
    location: "Hargeisa Central",
    broker: "Khadra Motors",
    views: "18.2k",
    likes: "2.1k",
    bgImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Prime Commercial Plot Near Airport Road",
    price: "$180,000",
    location: "Waberi, Mogadishu",
    broker: "Sahal Lands",
    views: "34.1k",
    likes: "4.8k",
    bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
  }
];

export default function ClipsPreview() {
  const [activeClipIdx, setActiveClipIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const activeClip = mockClips[activeClipIdx];

  const handleNext = () => {
    setActiveClipIdx((prev) => (prev + 1) % mockClips.length);
    setIsLiked(false);
  };

  return (
    <section className="py-20 border-t border-zinc-100 dark:border-zinc-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Info Text */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-100 bg-sky-50 dark:border-sky-950/60 dark:bg-sky-950/30 text-xs font-bold text-sky-700 dark:text-sky-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Mobile Feature</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
            Watch Properties & <br />
            Vehicles via Dalaal Clips
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Swipe through premium video walkthroughs, overlay pricing cards, ask questions, and book tours directly. Our Reels-style Clips feature inside the mobile app brings properties to life before you visit in person.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 mt-1">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">Optimized for Mobile</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Full screen vertical immersive player designed for high-resolution video streams on Expo React Native.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold rounded-xl text-sm transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 mt-4 shadow-lg"
          >
            <span>Next Clip Walkthrough</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Phone Mockup Container */}
        <div className="lg:col-span-5 flex justify-center relative">
          {/* Phone Outer Shell */}
          <div className="relative w-80 h-[580px] bg-zinc-950 rounded-[48px] p-3 shadow-2xl border-4 border-zinc-800 ring-12 ring-zinc-900/50 flex flex-col overflow-hidden">
            {/* Camera Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-950 rounded-full z-30 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-900/80 mr-2 border border-zinc-800" />
              <div className="w-2 h-2 rounded-full bg-zinc-900/80" />
            </div>

            {/* Screen Content */}
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

              {/* Floating Action Buttons */}
              <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-5 items-center">
                {/* Like Button */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex flex-col items-center gap-1 group text-white focus:outline-none"
                >
                  <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
                    isLiked ? "bg-red-500/90 scale-110" : "bg-black/40 hover:bg-black/60"
                  }`}>
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider drop-shadow">{isLiked ? "Liked" : activeClip.likes}</span>
                </button>

                {/* Comment Button */}
                <button className="flex flex-col items-center gap-1 text-white">
                  <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider drop-shadow">Chat</span>
                </button>

                {/* Save Button */}
                <button className="flex flex-col items-center gap-1 text-white">
                  <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider drop-shadow">Save</span>
                </button>
              </div>

              {/* Bottom Clip Information Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-2xl text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-500 overflow-hidden">
                    <div className="w-full h-full bg-sky-600 flex items-center justify-center text-[9px] font-extrabold">
                      {activeClip.broker.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <span className="text-xs font-bold">@{activeClip.broker}</span>
                </div>

                <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed mb-3">
                  {activeClip.title}
                </p>

                {/* Listing Details Card */}
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

              {/* Central Play/Pause State Indicator overlay */}
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-15 bg-transparent"
              >
                {!isPlaying && (
                  <div className="p-4 rounded-full bg-black/60 text-white backdrop-blur-sm animate-ping">
                    <Play className="w-6 h-6 fill-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
