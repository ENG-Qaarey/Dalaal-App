"use client";

import React, { useState } from "react";
import { Users, Search, Plus, ShieldCheck, Mail, Phone } from "lucide-react";

const mockUsersList = [
  { id: "u-1", name: "System Owner", email: "superadmin@sea.com", role: "SUPER_ADMIN", company: "Platform HQ", status: "ACTIVE" },
  { id: "u-2", name: "Abdi Hassan", email: "admin@beco.so", role: "COMPANY_OWNER", company: "BECO Electric", status: "ACTIVE" },
  { id: "u-3", name: "Mohamed Ali", email: "info@dahaelectric.so", role: "COMPANY_OWNER", company: "Daha Electric", status: "ACTIVE" },
  { id: "u-4", name: "Ahmed Ibrahim", email: "contact@sompower.so", role: "COMPANY_OWNER", company: "SomPower Electric", status: "ACTIVE" },
  { id: "u-5", name: "Farah Said", email: "farah.reader@beco.so", role: "METER_READER", company: "BECO Electric", status: "ACTIVE" },
];

export default function UsersManagementPage() {
  const [search, setSearch] = useState("");
  const filtered = mockUsersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">System Users Management</h2>
          <p className="text-xs text-zinc-400 mt-1">Manage global user credentials, company assignments, and account statuses</p>
        </div>
        <button
          onClick={() => alert("Create System User")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Create User
        </button>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] p-3 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-500 ml-2" />
        <input
          placeholder="Search users by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white focus:outline-none"
        />
      </div>

      <div className="bg-[#111827] border border-[#1F2937] rounded-[24px] p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1F2937] text-zinc-400 uppercase text-[10px] font-black tracking-widest">
                <th className="p-3.5">User ID</th>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Assigned Entity</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]/50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#0B0F19]/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-zinc-400">{u.id}</td>
                  <td className="p-3.5 font-bold text-white">{u.name}</td>
                  <td className="p-3.5 text-zinc-400 font-mono">{u.email}</td>
                  <td className="p-3.5 font-semibold text-blue-400">{u.company}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-black">
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                      {u.status}
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
