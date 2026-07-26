"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "blue" | "emerald" | "purple" | "orange" | "cyan";
}

const variantStyles = {
  blue: {
    bg: "bg-gradient-to-br from-blue-950/50 via-[#111827] to-[#0B0F19]",
    iconBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-blue-500/10",
    glow: "hover:border-blue-500/50",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-950/50 via-[#111827] to-[#0B0F19]",
    iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10",
    glow: "hover:border-emerald-500/50",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-950/50 via-[#111827] to-[#0B0F19]",
    iconBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-purple-500/10",
    glow: "hover:border-purple-500/50",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-950/50 via-[#111827] to-[#0B0F19]",
    iconBg: "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-orange-500/10",
    glow: "hover:border-orange-500/50",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-950/50 via-[#111827] to-[#0B0F19]",
    iconBg: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-cyan-500/10",
    glow: "hover:border-cyan-500/50",
  },
};

export function StatCard({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  variant = "blue",
}: StatCardProps) {
  const style = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-[#1F2937] p-5 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${style.bg} ${style.glow} group`}
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]" />

      <div className="flex items-center justify-between relative z-10">
        <div className={`p-3 rounded-xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>

        {trend && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-wider uppercase">
            {trend}
          </span>
        )}
      </div>

      <div className="space-y-1 relative z-10">
        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">
          {title}
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          {value}
        </div>
        <div className="text-[11px] font-semibold text-zinc-400">
          {subValue}
        </div>
      </div>
    </div>
  );
}
