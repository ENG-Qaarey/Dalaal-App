"use client";

import React, { useState } from "react";
import {
  Building2,
  Search,
  Plus,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { mockCompanies } from "../../../data/super-admin-mock";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const filtered = mockCompanies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Utility Companies Management
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Full control over registered electricity companies across Somalia
          </p>
        </div>
        <button
          onClick={() => alert("Add Company Modal")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Utility Company
        </button>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] p-3 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-500 ml-2" />
        <input
          placeholder="Search companies by name, email, owner, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-[#111827] border border-[#1F2937] rounded-[24px] p-5 space-y-4 hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm">
                  {c.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500">{c.email}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                {c.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1F2937]/50 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-black">
                  Owner
                </span>
                <p className="font-bold text-zinc-200">{c.ownerName}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-black">
                  Monthly Rev
                </span>
                <p className="font-bold text-emerald-400">{c.revenue}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-black">
                  Customers
                </span>
                <p className="font-bold text-white">
                  {c.customers.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-black">
                  Active Meters
                </span>
                <p className="font-bold text-white">
                  {c.meters.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
