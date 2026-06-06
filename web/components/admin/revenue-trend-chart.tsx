"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", revenue: 12400, escrow: 8200 },
  { month: "Feb", revenue: 15800, escrow: 10400 },
  { month: "Mar", revenue: 14200, escrow: 9800 },
  { month: "Apr", revenue: 18900, escrow: 12600 },
  { month: "May", revenue: 22100, escrow: 15100 },
  { month: "Jun", revenue: 26400, escrow: 18200 },
];

export function RevenueTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, ""]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="currentColor"
          strokeWidth={2}
          dot={false}
          className="stroke-sky-600 dark:stroke-sky-400"
        />
        <Line
          type="monotone"
          dataKey="escrow"
          name="Escrow volume"
          stroke="currentColor"
          strokeWidth={2}
          dot={false}
          className="stroke-zinc-400 dark:stroke-zinc-500"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
