"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  DollarSign,
  ArrowRightLeft,
  Gauge,
  ShieldCheck,
  Search,
  ChevronDown,
  Activity,
  UserCheck,
  CreditCard,
  Radio,
  FileText,
} from "lucide-react";
import { StatCard } from "../../../components/dashboard/StatCard";
import {
  mockCompanies,
  mockRevenueSeries,
  mockRegistrationTrend,
  mockUserDistribution,
  mockSystemStatus,
  mockActivities,
} from "../../../data/super-admin-mock";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function SuperAdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("THIS YEAR");

  const filteredCompanies = mockCompanies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ROW 1: STAT CARDS (6-COLUMN GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Companies"
          value="24"
          subValue="New this month"
          icon={Building2}
          trend="+ 2"
          variant="blue"
        />
        <StatCard
          title="Total Customers"
          value="128,560"
          subValue="This month"
          icon={Users}
          trend="+ 5230"
          variant="emerald"
        />
        <StatCard
          title="Total Revenue"
          value="$1,248,560"
          subValue="From last month"
          icon={DollarSign}
          trend="+ 12.5%"
          variant="purple"
        />
        <StatCard
          title="Total Transactions"
          value="45,632"
          subValue="From last month"
          icon={ArrowRightLeft}
          trend="+ 8.7%"
          variant="orange"
        />
        <StatCard
          title="Active Meters"
          value="136,890"
          subValue="From last month"
          icon={Gauge}
          trend="+ 6.3%"
          variant="cyan"
        />
        <StatCard
          title="System Uptime"
          value="99.9%"
          subValue="Excellent status"
          icon={ShieldCheck}
          trend="+ 0"
          variant="emerald"
        />
      </div>

      {/* ROW 2: CHARTS & SYSTEM STATUS (12-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Overview (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#111827] via-[#111827] to-[#0B0F19] border border-[#1F2937] rounded-[32px] p-6 space-y-4 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-white tracking-tight">
                Revenue Overview
              </h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                ALL COMPANIES
              </p>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#0B0F19] border border-[#1F2937] px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-200 focus:outline-none"
            >
              <option value="THIS YEAR">THIS YEAR</option>
              <option value="LAST YEAR">LAST YEAR</option>
            </select>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockRevenueSeries}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={11}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0F19",
                    borderColor: "#1F2937",
                    borderRadius: "16px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Companies (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-[32px] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-white tracking-tight">
              Top Performing
            </h3>
            <button className="text-[11px] font-black text-blue-400 hover:underline uppercase tracking-wider">
              VIEW ALL
            </button>
          </div>
          <div className="text-[10px] font-black text-zinc-400 flex justify-between uppercase tracking-widest pb-1 border-b border-[#1F2937]/60">
            <span># COMPANY</span>
            <span>REV GROWTH</span>
          </div>

          <div className="space-y-3.5 pt-1 text-xs">
            {mockCompanies.map((comp, idx) => (
              <div
                key={comp.id}
                className="flex items-center justify-between border-b border-[#1F2937]/40 pb-2.5 last:border-0"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-black text-zinc-500 text-xs w-3">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white truncate">
                    {comp.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-white">{comp.revenue}</div>
                  <div className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {comp.growth}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status (3 cols dark card #0B1527) */}
        <div className="lg:col-span-3 bg-[#0B1527] border border-[#1E2D4A] rounded-[32px] p-6 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <h3 className="font-black text-base text-white tracking-tight">
              System Status
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
              LIVE
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs relative z-10">
            {mockSystemStatus.map((sys) => (
              <div
                key={sys.name}
                className="flex items-center justify-between border-b border-[#1E2D4A]/50 pb-2.5 last:border-0"
              >
                <span className="text-zinc-200 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  {sys.name}
                </span>
                <span className="font-black text-xs text-emerald-400 tracking-wider">
                  OK
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: REGISTRATIONS, ROLES, ACTIVITIES (12-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registration Trend (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-[32px] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-white tracking-tight">
                Registration Trend
              </h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                MONTHLY ONBOARDING
              </p>
            </div>
            <select className="bg-[#0B0F19] border border-[#1F2937] px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-200">
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockRegistrationTrend}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0F19",
                    borderColor: "#1F2937",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Donut (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-[32px] p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div>
            <h3 className="font-black text-base text-white tracking-tight">
              User Distribution
            </h3>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              BY ACCOUNT ROLE
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="w-40 h-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockUserDistribution}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mockUserDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs w-full">
              {mockUserDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-zinc-300 font-semibold">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <div className="text-right">
                    <span className="font-black text-white">
                      {item.value.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-zinc-500 ml-1">
                      ({item.percent})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-[32px] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-white tracking-tight">
                Recent Activities
              </h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                SYSTEM LOG
              </p>
            </div>
            <button className="text-[11px] font-black text-blue-400 hover:underline uppercase tracking-wider">
              VIEW ALL
            </button>
          </div>

          <div className="space-y-3.5 pt-1 text-xs">
            {mockActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between border-b border-[#1F2937]/40 pb-2.5 last:border-0"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">
                    {act.title}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-semibold">
                    {act.user}
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-[#0B0F19] text-zinc-300 text-[10px] font-mono border border-[#1F2937] shrink-0">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 4: REGISTERED COMPANIES TABLE (FULL WIDTH) */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-[32px] p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-lg text-white tracking-tight">
              Registered Companies
            </h3>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              TOP REGISTERED ENTITIES
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search companies by name, owner, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1F2937] text-zinc-400 uppercase text-[10px] font-black tracking-widest">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Company Name</th>
                <th className="p-3.5">Owner Name</th>
                <th className="p-3.5">Customers</th>
                <th className="p-3.5">Meters</th>
                <th className="p-3.5">Plan</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]/50">
              {filteredCompanies.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-[#0B0F19]/60 transition-colors"
                >
                  <td className="p-3.5 font-mono font-bold text-zinc-400">
                    {c.id}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black">
                        {c.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-[10px] text-zinc-500">
                          {c.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-zinc-300">
                    {c.ownerName}
                  </td>
                  <td className="p-3.5 font-black text-white">
                    {c.customers.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-black text-white">
                    {c.meters.toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-xl text-[10px] font-black tracking-wider ${
                        c.plan === "PREMIUM"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                          : c.plan === "STANDARD"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {c.plan}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black tracking-wider">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
