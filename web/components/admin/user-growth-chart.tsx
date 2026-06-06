"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", users: 420, brokers: 28 },
  { month: "Feb", users: 580, brokers: 35 },
  { month: "Mar", users: 710, brokers: 42 },
  { month: "Apr", users: 890, brokers: 51 },
  { month: "May", users: 1120, brokers: 64 },
  { month: "Jun", users: 1380, brokers: 78 },
];

export function UserGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
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
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Area
          type="monotone"
          dataKey="users"
          name="Users"
          stackId="1"
          stroke="currentColor"
          fill="currentColor"
          fillOpacity={0.2}
          className="stroke-sky-600 fill-sky-600 dark:stroke-sky-400 dark:fill-sky-400"
        />
        <Area
          type="monotone"
          dataKey="brokers"
          name="Brokers"
          stackId="2"
          stroke="currentColor"
          fill="currentColor"
          fillOpacity={0.15}
          className="stroke-zinc-500 fill-zinc-500 dark:stroke-zinc-400 dark:fill-zinc-400"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
