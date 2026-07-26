"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Search,
  Bell,
  Download,
  Calendar,
  ChevronDown,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
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

// Revenue Overview Data
const revenueData = [
  { month: "Jan", revenue: 60000 },
  { month: "Feb", revenue: 140000 },
  { month: "Mar", revenue: 180000 },
  { month: "Apr", revenue: 120000 },
  { month: "May", revenue: 170000 },
  { month: "Jun", revenue: 140000 },
  { month: "Jul", revenue: 190000 },
  { month: "Aug", revenue: 160000 },
  { month: "Sep", revenue: 210000 },
  { month: "Oct", revenue: 180000 },
  { month: "Nov", revenue: 240000 },
  { month: "Dec", revenue: 220000 },
];

// Registration Trend Data
const registrationTrend = [
  { month: "Feb", count: 18 },
  { month: "Apr", count: 24 },
  { month: "Jun", count: 14 },
  { month: "Aug", count: 20 },
  { month: "Oct", count: 16 },
  { month: "Dec", count: 22 },
];

// Donut User Distribution Data
const userDistribution = [
  { name: "Company Owners", value: 24, color: "#3b82f6" },
  { name: "Company Admins", value: 96, color: "#06b6d4" },
  { name: "Employees", value: 1248, color: "#eab308" },
  { name: "Meter Readers", value: 1150, color: "#8b5cf6" },
  { name: "Customers", value: 128560, color: "#0ea5e9" },
];

// Top Performing Companies
const topPerforming = [
  { rank: 1, name: "BECO (Benaadir Electric)", revenue: "$285,450", growth: "+15.6%" },
  { rank: 2, name: "Daha Electric Company", revenue: "$198,670", growth: "+12.3%" },
  { rank: 3, name: "SomPower Electric", revenue: "$162,340", growth: "+10.8%" },
  { rank: 4, name: "Nugaal Electric", revenue: "$98,120", growth: "+8.2%" },
  { rank: 5, name: "GEDO Electric", revenue: "$72,440", growth: "+6.7%" },
];

// System Status Monitors
const systemStatus = [
  { name: "API Services", status: "OK", color: "text-emerald-400" },
  { name: "Database", status: "OK", color: "text-emerald-400" },
  { name: "Payment Gateway", status: "OK", color: "text-emerald-400" },
  { name: "File Storage", status: "OK", color: "text-emerald-400" },
  { name: "Backup System", status: "OK", color: "text-emerald-400" },
  { name: "Notifications", status: "OK", color: "text-emerald-400" },
  { name: "Chat Service", status: "OK", color: "text-emerald-400" },
];

// Recent Activities Log
const recentActivities = [
  { id: "1", title: "New company registered", time: "10:30 AM", user: "by System Owner", type: "company" },
  { id: "2", title: "New customer onboarded", time: "10:15 AM", user: "by BECO Admin", type: "user" },
  { id: "3", title: "Payment processed", time: "09:58 AM", user: "Company: SomPower Electric", type: "payment" },
  { id: "4", title: "New meter reader assigned", time: "09:40 AM", user: "Company: Daha Electric", type: "meter" },
  { id: "5", title: "System backup completed", time: "02:00 AM", user: "by System", type: "system" },
];

// Registered Companies Table Data
const registeredCompanies = [
  { id: "COMP001", name: "BECO (Benaadir Electric)", email: "admin@beco.so", owner: "Abdi Hassan", customers: "28,450", meters: "30,250", status: "ACTIVE", avatar: "B" },
  { id: "COMP002", name: "Daha Electric Company", email: "info@dahaelectric.so", owner: "Mohamed Ali", customers: "22,150", meters: "23,120", status: "ACTIVE", avatar: "D" },
  { id: "COMP003", name: "SomPower Electric", email: "contact@sompower.so", owner: "Ahmed Ibrahim", customers: "18,890", meters: "19,870", status: "ACTIVE", avatar: "S" },
  { id: "COMP004", name: "Nugaal Electric", email: "admin@nugaalelectric.so", owner: "Hassan Omar", customers: "12,230", meters: "13,450", status: "ACTIVE", avatar: "N" },
  { id: "COMP005", name: "GEDO Electric", email: "info@gedoelectric.so", owner: "Yusuf Ahmed", customers: "9,420", meters: "10,250", status: "ACTIVE", avatar: "G" },
];

export default function SuperAdminEnterpriseDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("THIS YEAR");

  const filteredCompanies = registeredCompanies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-zinc-100 font-sans p-4 sm:p-6 space-y-6">
      {/* 1. TOP ENTERPRISE HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Welcome back, System Owner! Here&apos;s what&apos;s happening on your platform today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#111827] border border-[#1F2937] px-3 py-1.5 rounded-xl text-xs text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>24 Jul 2026, 00:45:55</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>

          <button
            onClick={() => alert("Enterprise report summary exported!")}
            className="flex items-center gap-2 bg-[#111827] border border-[#1F2937] hover:bg-[#1F2937] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>

          <div className="relative p-2 rounded-xl bg-[#111827] border border-[#1F2937] text-zinc-300">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </div>

          <div className="flex items-center gap-2.5 bg-[#111827] border border-[#1F2937] px-3 py-1 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              SO
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-none">System Owner</div>
              <div className="text-[10px] font-semibold text-blue-400 mt-0.5">SUPER ADMIN</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 6-CARD TOP KPI METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              + 2%
            </span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Companies</div>
          <div className="text-2xl font-black text-white">24</div>
          <div className="text-[10px] text-zinc-500">New this month</div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              + 5230%
            </span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Customers</div>
          <div className="text-2xl font-black text-white">128,560</div>
          <div className="text-[10px] text-zinc-500">This month</div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              + 12.5%
            </span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Revenue</div>
          <div className="text-2xl font-black text-white">$1,248,560</div>
          <div className="text-[10px] text-zinc-500">From last month</div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              + 8.7%
            </span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Transactions</div>
          <div className="text-2xl font-black text-white">45,632</div>
          <div className="text-[10px] text-zinc-500">From last month</div>
        </div>

        {/* Card 5 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              + 6.3%
            </span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Meters</div>
          <div className="text-2xl font-black text-white">136,890</div>
          <div className="text-[10px] text-zinc-500">From last month</div>
        </div>

        {/* Card 6 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              + 0
            </span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">System Uptime</div>
          <div className="text-2xl font-black text-white">99.9%</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Excellent</div>
        </div>
      </div>

      {/* 3. MIDDLE DATA SECTION (3 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: Revenue Overview Line Chart (6 cols) */}
        <div className="lg:col-span-6 bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-white">Revenue Overview</h3>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">ALL COMPANIES</p>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#0B0F19] border border-[#1F2937] px-3 py-1 rounded-xl text-xs text-zinc-200 font-bold"
            >
              <option value="THIS YEAR">THIS YEAR</option>
              <option value="LAST YEAR">LAST YEAR</option>
            </select>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0B0F19", borderColor: "#1F2937", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Column 2: Top Performing Companies (3 cols) */}
        <div className="lg:col-span-3 bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">Top Performing</h3>
            <button className="text-[10px] font-bold text-blue-400 hover:underline">VIEW ALL</button>
          </div>
          <div className="text-[10px] font-bold text-zinc-400 flex justify-between uppercase">
            <span># COMPANY</span>
            <span>REV GROWTH</span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {topPerforming.map((comp) => (
              <div key={comp.rank} className="flex items-center justify-between border-b border-[#1F2937]/50 pb-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-zinc-500">{comp.rank}</span>
                  <span className="font-bold text-white truncate">{comp.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-white">{comp.revenue}</div>
                  <div className="text-[10px] font-bold text-emerald-400">{comp.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: System Status (3 cols) */}
        <div className="lg:col-span-3 bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">System Status</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
            </span>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            {systemStatus.map((sys) => (
              <div key={sys.name} className="flex items-center justify-between border-b border-[#1F2937]/40 pb-2">
                <span className="text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {sys.name}
                </span>
                <span className={`font-bold text-xs ${sys.color}`}>{sys.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. LOWER DATA SECTION (3 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Column 1: Registration Trend (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-white">Registration Trend</h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">MONTHLY ONBOARDING</p>
            </div>
            <span className="px-2.5 py-1 bg-[#0B0F19] border border-[#1F2937] rounded-xl text-xs font-bold text-zinc-300">
              2025
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0B0F19", borderColor: "#1F2937", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Column 2: User Distribution Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-white">User Distribution</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase">BY ACCOUNT ROLE</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="w-40 h-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userDistribution} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-[11px] w-full">
              {userDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-zinc-400">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Recent Activities System Log (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-white">Recent Activities</h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">SYSTEM LOG</p>
            </div>
            <button className="text-[10px] font-bold text-blue-400 hover:underline">VIEW ALL</button>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start justify-between border-b border-[#1F2937]/40 pb-2.5">
                <div className="space-y-0.5">
                  <div className="font-bold text-white">{act.title}</div>
                  <div className="text-[10px] text-zinc-500">{act.user}</div>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-[#0B0F19] text-zinc-400 text-[10px] font-mono shrink-0">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. BOTTOM REGISTERED ENTITIES TABLE */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-white">Registered Companies & Entities</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase">TOP REGISTERED ENTITIES</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1F2937] text-zinc-500 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-3">ID</th>
                <th className="p-3">Company Name</th>
                <th className="p-3">Owner Name</th>
                <th className="p-3">Customers</th>
                <th className="p-3">Meters</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]/50">
              {filteredCompanies.map((c) => (
                <tr key={c.id} className="hover:bg-[#0B0F19]/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-zinc-400">{c.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black">
                        {c.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-[10px] text-zinc-500">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-zinc-300">{c.owner}</td>
                  <td className="p-3 font-bold text-white">{c.customers}</td>
                  <td className="p-3 font-bold text-white">{c.meters}</td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
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
