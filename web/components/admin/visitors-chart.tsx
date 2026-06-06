"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "Apr 7", desktop: 1200, mobile: 600 },
  { date: "Apr 10", desktop: 2100, mobile: 800 },
  { date: "Apr 13", desktop: 1100, mobile: 400 },
  { date: "Apr 16", desktop: 3200, mobile: 1100 },
  { date: "Apr 19", desktop: 1500, mobile: 700 },
  { date: "Apr 22", desktop: 2800, mobile: 900 },
  { date: "Apr 26", desktop: 1800, mobile: 1200 },
  { date: "Apr 29", desktop: 4100, mobile: 1800 },
  { date: "May 2", desktop: 2500, mobile: 1100 },
  { date: "May 5", desktop: 4900, mobile: 2100 },
  { date: "May 8", desktop: 1400, mobile: 600 },
  { date: "May 11", desktop: 3100, mobile: 1200 },
  { date: "May 14", desktop: 4800, mobile: 1500 },
  { date: "May 17", desktop: 3500, mobile: 1800 },
  { date: "May 21", desktop: 1900, mobile: 900 },
  { date: "May 24", desktop: 3800, mobile: 1400 },
  { date: "May 28", desktop: 2200, mobile: 1100 },
  { date: "May 31", desktop: 4500, mobile: 2000 },
  { date: "Jun 3", desktop: 1800, mobile: 800 },
  { date: "Jun 6", desktop: 4200, mobile: 1700 },
  { date: "Jun 9", desktop: 2800, mobile: 1200 },
  { date: "Jun 12", desktop: 5100, mobile: 2300 },
  { date: "Jun 15", desktop: 1500, mobile: 700 },
  { date: "Jun 18", desktop: 4700, mobile: 1900 },
  { date: "Jun 22", desktop: 2900, mobile: 1300 },
  { date: "Jun 25", desktop: 5300, mobile: 2500 },
  { date: "Jun 28", desktop: 2100, mobile: 1000 },
  { date: "Jun 30", desktop: 4600, mobile: 2200 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-md">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">{label}</p>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              Desktop
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{payload[0].value}</span>
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-200 dark:bg-sky-900" />
              Mobile
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{payload[1].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function VisitorsChart() {
  const [filter, setFilter] = useState("3m");

  const filteredData = data.slice(
    filter === "7d" ? -4 : filter === "30d" ? -10 : 0
  );

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-start justify-between mb-8 px-2">
        <div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Total Visitors</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Total for the last 3 months</p>
        </div>
        <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 p-1">
          <button
            onClick={() => setFilter("3m")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
              filter === "3m"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            Last 3 months
          </button>
          <button
            onClick={() => setFilter("30d")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
              filter === "30d"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setFilter("7d")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
              filter === "7d"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            Last 7 days
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={filteredData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bae6fd" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#bae6fd" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#71717a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            minTickGap={20}
          />
          <YAxis
            stroke="#71717a"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(161, 161, 170, 0.2)", strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Area
            type="monotone"
            dataKey="desktop"
            stroke="#0ea5e9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorDesktop)"
            className="stroke-sky-500"
          />
          <Area
            type="monotone"
            dataKey="mobile"
            stroke="#bae6fd"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorMobile)"
            className="stroke-sky-200 dark:stroke-sky-900"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
