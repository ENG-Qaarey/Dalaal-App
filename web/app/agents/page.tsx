"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Building,
  Car,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";
import { useAuth } from "@/lib/auth-context";

interface Agent {
  id: string;
  name: string;
  agency: string;
  city: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewsCount: number;
  activeListings: number;
  isVerified: boolean;
  avatar: string;
  specialty: string;
}

const mockAgents: Agent[] = [
  {
    id: "ag-1",
    name: "Abdi Rahman Mohamed",
    agency: "Banaadir Prime Properties",
    city: "Mogadishu",
    phone: "+252 61 555 0192",
    whatsapp: "+252615550192",
    rating: 4.9,
    reviewsCount: 38,
    activeListings: 14,
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    specialty: "Luxury Villas & Land",
  },
  {
    id: "ag-2",
    name: "Faisal Yusuf Farah",
    agency: "Hargeisa Real Estate Ltd",
    city: "Hargeisa",
    phone: "+252 63 444 8812",
    whatsapp: "+252634448812",
    rating: 4.8,
    reviewsCount: 29,
    activeListings: 9,
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    specialty: "Apartments & Car Rentals",
  },
  {
    id: "ag-3",
    name: "Khadra Ahmed Said",
    agency: "Garowe Commercial Brokers",
    city: "Garowe",
    phone: "+252 90 777 3321",
    whatsapp: "+252907773321",
    rating: 4.7,
    reviewsCount: 22,
    activeListings: 11,
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
    specialty: "Commercial Plots & Warehouses",
  },
  {
    id: "ag-4",
    name: "Mustafa Ali Hassan",
    agency: "Kismayo Auto & Property Exchange",
    city: "Kismayo",
    phone: "+252 61 888 4410",
    whatsapp: "+252618884410",
    rating: 4.9,
    reviewsCount: 45,
    activeListings: 18,
    isVerified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    specialty: "SUVs, Pickups & Residential Houses",
  },
];

export default function AgentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");

  const filteredAgents = mockAgents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.agency.toLowerCase().includes(search.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === "ALL" || agent.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const roleHome = user?.role
    ? user.role === "SUPER_ADMIN" || user.role === "MODERATOR"
      ? "/pages/admin"
      : user.role === "BROKER" || user.role === "PROPERTY_OWNER" || user.role === "VEHICLE_OWNER"
      ? "/pages/broker"
      : "/pages/customer"
    : "/login";

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/75 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/20">
              D
            </span>
            <span className="text-xl font-black tracking-tight text-white">
              Dalaal<span className="text-sky-600">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/properties" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Properties
            </Link>
            <Link href="/vehicles" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Vehicles
            </Link>
            <Link href="/escrow" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Escrow Guarantee
            </Link>
            <Link href="/agents" className="text-sm font-semibold text-sky-400">
              Agents
            </Link>
            <Link href="/clips" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Clips
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            {user ? (
              <Link
                href={roleHome}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white transition-all shadow-md shadow-sky-600/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 text-xs font-bold text-sky-400">
            <Users className="w-4 h-4" />
            <span>Verified Dalaals & Real Estate Brokers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Find Trusted Local Dalaals Across Somalia
          </h1>
          <p className="text-zinc-400 text-sm">
            Connect directly with identity-verified property and vehicle agents in Mogadishu, Hargeisa, Garowe, Bosaso, and Kismayo.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search agent name, agency, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-10 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Cities</option>
            <option value="Mogadishu">Mogadishu</option>
            <option value="Hargeisa">Hargeisa</option>
            <option value="Garowe">Garowe</option>
            <option value="Kismayo">Kismayo</option>
          </select>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-1">
                      {agent.name}
                      {agent.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-sky-400 inline shrink-0" />
                      )}
                    </h3>
                    <p className="text-[11px] text-zinc-400">{agent.agency}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" /> {agent.city}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {agent.rating} ({agent.reviewsCount})
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    <strong className="text-zinc-400">Specialty:</strong> {agent.specialty}
                  </p>
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    {agent.activeListings} Active Listings Available
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/60">
                <a
                  href={`tel:${agent.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </a>
                <a
                  href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
