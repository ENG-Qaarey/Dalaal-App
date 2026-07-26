"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import {
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Share2,
  Eye,
  MapPin,
  BadgeCheck,
  Play,
  Pause,
  ChevronRight,
  Sparkles,
  Smartphone,
} from "lucide-react";

interface ClipMockup {
  id: number;
  title: string;
  price: string;
  location: string;
  broker: string;
  brokerInitials: string;
  views: string;
  likes: string;
  comments: string;
  bgImage: string;
}

const mockClips: ClipMockup[] = [
  {
    id: 1,
    title: "Stunning Sea-View Penthouse Tour",
    price: "$1,200/mo",
    location: "LIDO BEACH, MOGADISHU",
    broker: "Aminu Dalaal",
    brokerInitials: "AD",
    views: "24.5K",
    likes: "3.2K",
    comments: "120",
    bgImage:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Toyota Hilux 4x4 Double Cabin Walkthrough",
    price: "$28,000",
    location: "HARGEISA CENTRAL",
    broker: "Khadra Motors",
    brokerInitials: "KM",
    views: "18.2K",
    likes: "2.1K",
    comments: "87",
    bgImage:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Prime Commercial Plot Near Airport Road",
    price: "$180,000",
    location: "WABERI, MOGADISHU",
    broker: "Sahal Lands",
    brokerInitials: "SL",
    views: "34.1K",
    likes: "4.8K",
    comments: "203",
    bgImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
  },
];

const PROGRESS_MS = 6000;

export default function ClipsPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [commented, setCommented] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const clip = mockClips[idx];

  const go = useCallback((next: number) => {
    setIdx(next);
    setLiked(false);
    setSaved(false);
    setShared(false);
    setCommented(false);
    setProgress(0);
    setLikeCount(0);
    setCommentCount(0);
  }, []);

  const handleNext = useCallback(() => {
    go((idx + 1) % mockClips.length);
  }, [idx, go]);

  // auto-progress
  useEffect(() => {
    if (!playing) return;
    const t0 = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - t0;
      setProgress(Math.min((elapsed / PROGRESS_MS) * 100, 100));
      if (elapsed >= PROGRESS_MS) handleNext();
    }, 30);
    return () => clearInterval(id);
  }, [playing, idx, handleNext]);

  // Scroll reveal with Intersection Observer
  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const phone = phoneRef.current;
    if (!section || !left || !phone) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (prefersReduced) {
            Array.from(left.children).forEach((child) => {
              (child as HTMLElement).style.opacity = "1";
            });
            phone.style.opacity = "1";
            observer.unobserve(section);
            return;
          }

          Array.from(left.children).forEach((child, i) => {
            const el = child as HTMLElement;
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
            el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`;
            requestAnimationFrame(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            });
          });

          phone.style.opacity = "0";
          phone.style.transform = "translateY(80px) scale(0.9) rotateY(-10deg)";
          phone.style.transition =
            "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 300ms, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 300ms";
          requestAnimationFrame(() => {
            phone.style.opacity = "1";
            phone.style.transform = "translateY(0) scale(1) rotateY(0)";
          });

          observer.unobserve(section);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const handleComment = () => {
    setCommented(!commented);
    setCommentCount((c) => (commented ? c - 1 : c + 1));
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 600);
  };

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* MeshGradient Background */}
      <div className="absolute inset-0 -z-10">
        <MeshGradient
          style={{ height: "100%", width: "100%" }}
          distortion={0.8}
          swirl={0.1}
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
          colors={[
            "hsl(216, 90%, 27%)",
            "hsl(243, 68%, 36%)",
            "hsl(205, 68%, 36%)",
            "hsl(205, 91%, 64%)",
            "hsl(211, 61%, 57%)",
          ]}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* ── Left ─────────────────────────────────────────────── */}
        <div ref={leftRef} className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-xs font-bold text-white dark:text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Mobile Feature</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white dark:text-white leading-tight">
            Watch Properties &<br />
            Vehicles via Dalaal Clips
          </h2>

          <p className="text-white/70 dark:text-white/70 text-base sm:text-lg leading-relaxed max-w-xl">
            Swipe through premium video walkthroughs, overlay pricing cards, ask
            questions, and book tours directly.
          </p>

          <div className="flex items-start gap-3 pt-2">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white dark:text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white dark:text-white text-sm">
                Optimized for Mobile
              </h3>
              <p className="text-white/50 dark:text-white/50 text-xs mt-1">
                Full screen vertical immersive player on Expo React Native.
              </p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-3 pt-2">
            {mockClips.map((c, i) => (
              <button
                key={c.id}
                onClick={() => {
                  go(i);
                  setPlaying(false);
                }}
                className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  i === idx
                    ? "border-[#1DA1F2] shadow-lg shadow-[#1DA1F2]/25 scale-105"
                    : "border-white/20 opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={c.bgImage}
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
                {i === idx && playing && (
                  <div className="absolute inset-0 bg-[#1DA1F2]/20 flex items-center justify-center">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 font-bold rounded-xl text-sm transition-all hover:opacity-90 shadow-lg"
            >
              <span>Next Clip</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="inline-flex items-center gap-2 px-4 py-3 border border-white/20 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              {playing ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{playing ? "Pause" : "Play"}</span>
            </button>
          </div>
        </div>

        {/* ── Right Phone ──────────────────────────────────────── */}
        <div
          className="lg:col-span-5 flex justify-center relative"
          style={{ perspective: "1200px" }}
        >
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 bg-[#1DA1F2]/10 rounded-full blur-3xl" />
          </div>

          {/* Phone */}
          <div
            ref={phoneRef}
            className="relative w-[280px] sm:w-[300px] h-[560px] sm:h-[600px] bg-zinc-950 rounded-[44px] p-[10px] shadow-2xl border-[3px] border-zinc-800 flex flex-col overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Dynamic Island */}
            <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-zinc-950 rounded-full z-30 flex items-center justify-center gap-[6px]">
              <div className="w-[10px] h-[10px] rounded-full bg-zinc-900 border border-zinc-800" />
              <div className="w-[5px] h-[5px] rounded-full bg-zinc-800" />
            </div>

            {/* Screen */}
            <div className="relative flex-1 w-full h-full rounded-[36px] overflow-hidden bg-zinc-900 z-10 select-none">
              {/* Image */}
              <img
                src={clip.bgImage}
                alt={clip.title}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.65]"
              />

              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70 pointer-events-none z-10" />

              {/* ── Views Badge ──────────────────── */}
              <div className="absolute top-[52px] left-3 z-20 h-8 flex items-center gap-1.5 bg-black/45 backdrop-blur-[16px] px-3 rounded-full border border-white/[0.12]">
                <Eye className="w-3 h-3 text-white/70" />
                <span className="text-[11px] font-semibold text-white/90">
                  {clip.views} Views
                </span>
              </div>

              {/* ── Progress Bar ─────────────────── */}
              <div className="absolute top-[44px] left-3 right-3 z-30 h-[3px] rounded-full overflow-hidden bg-white/20">
                <div
                  className="h-full rounded-full bg-white/70 transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* ── Right Action Buttons ─────────── */}
              <div className="absolute right-3 bottom-[130px] z-20 flex flex-col items-center gap-[14px]">
                {/* Like */}
                <div className="flex flex-col items-center gap-[2px]">
                  <button
                    onClick={handleLike}
                    className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-[16px] border border-white/[0.12] transition-all duration-200 active:scale-[0.92]"
                    style={{
                      background: liked ? "#1DA1F2" : "rgba(0,0,0,0.45)",
                      boxShadow: liked
                        ? "0 4px 20px rgba(29,161,242,0.4)"
                        : "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <ThumbsUp
                      className={`w-[18px] h-[18px] transition-all duration-200 ${
                        liked ? "fill-white text-white scale-110" : "text-white"
                      }`}
                    />
                  </button>
                  <span className="text-[10px] font-semibold text-white/90">
                    {liked
                      ? `${(3200 + likeCount).toLocaleString()}`
                      : clip.likes}
                  </span>
                </div>

                {/* Comment */}
                <div className="flex flex-col items-center gap-[2px]">
                  <button
                    onClick={handleComment}
                    className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-[16px] border border-white/[0.12] transition-all duration-200 active:scale-[0.92]"
                    style={{
                      background: "rgba(0,0,0,0.45)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <MessageCircle className="w-[18px] h-[18px] text-white" />
                  </button>
                  <span className="text-[10px] font-semibold text-white/90">
                    {commented ? 120 + commentCount : clip.comments}
                  </span>
                </div>

                {/* Save */}
                <div className="flex flex-col items-center gap-[2px]">
                  <button
                    onClick={handleSave}
                    className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-[16px] border border-white/[0.12] transition-all duration-200 active:scale-[0.92]"
                    style={{
                      background: "rgba(0,0,0,0.45)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Bookmark
                      className={`w-[18px] h-[18px] transition-all duration-200 ${
                        saved ? "fill-white text-white" : "text-white"
                      }`}
                    />
                  </button>
                  <span className="text-[11px] font-medium text-white/90">
                    Save
                  </span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center gap-[2px]">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-[16px] border border-white/[0.12] transition-all duration-200 active:scale-[0.92]"
                    style={{
                      background: "rgba(0,0,0,0.45)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Share2
                      className={`w-[18px] h-[18px] text-white transition-all duration-200 ${
                        shared ? "rotate-12 opacity-60" : ""
                      }`}
                    />
                  </button>
                  <span className="text-[11px] font-medium text-white/90">
                    Share
                  </span>
                </div>
              </div>

              {/* ── Bottom Gradient Fade ────────── */}
              <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

              {/* ── Bottom Overlay ───────────────── */}
              <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-5 pt-16">
                {/* Agent + Price Row */}
                <div className="flex items-end justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#2563EB] flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-[#1DA1F2]/20 relative shrink-0">
                      {clip.brokerInitials}
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-zinc-950 rounded-full flex items-center justify-center">
                        <BadgeCheck className="w-3 h-3 text-[#1DA1F2] fill-zinc-950" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-white leading-tight">
                        {clip.broker}
                      </span>
                      <span className="text-[10px] text-white/40 font-medium leading-tight">
                        Licensed Agent
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-white leading-none">
                      {clip.price}
                    </div>
                  </div>
                </div>

                {/* Location + CTA Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <MapPin className="w-3 h-3 text-white/50 shrink-0" />
                    <span className="text-[11px] font-medium text-white/60 tracking-wide uppercase truncate">
                      {clip.location}
                    </span>
                  </div>
                  <button
                    className="shrink-0 h-9 px-5 rounded-full text-[11px] font-bold text-white tracking-wide transition-all duration-200 active:scale-[0.95]"
                    style={{
                      background: "linear-gradient(135deg, #1DA1F2, #2563EB)",
                      boxShadow: "0 4px 20px rgba(29,161,242,0.4)",
                    }}
                  >
                    Inquire Now
                  </button>
                </div>
              </div>

              {/* Play/Pause Overlay */}
              <div
                onClick={() => setPlaying(!playing)}
                className="absolute inset-0 z-[5] cursor-pointer flex items-center justify-center"
              >
                {!playing && (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                  </div>
                )}
              </div>
            </div>

            {/* Side buttons */}
            <div className="absolute right-[-2px] top-[100px] w-[3px] h-[36px] bg-zinc-700 rounded-l" />
            <div className="absolute left-[-2px] top-[90px] w-[3px] h-[28px] bg-zinc-700 rounded-r" />
            <div className="absolute left-[-2px] top-[130px] w-[3px] h-[28px] bg-zinc-700 rounded-r" />
          </div>
        </div>
      </div>
    </section>
  );
}
