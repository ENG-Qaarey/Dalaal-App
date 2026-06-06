"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { city: "Mogadishu", listings: 186 },
  { city: "Hargeisa", listings: 124 },
  { city: "Bosaso", listings: 78 },
  { city: "Kismayo", listings: 52 },
  { city: "Garowe", listings: 41 },
  { city: "Baidoa", listings: 29 },
];

export function CityBreakdownChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="city"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Bar
          dataKey="listings"
          name="Active listings"
          fill="currentColor"
          radius={[0, 4, 4, 0]}
          className="fill-sky-600 dark:fill-sky-400"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
