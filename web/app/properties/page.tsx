"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Shield,
  CheckCircle2,
  BedDouble,
  Bath,
  Maximize2,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Home,
  Building2,
  LandPlot,
  Warehouse,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";

interface Property {
  id: string;
  title: string;
  category: string;
  status: "FOR_SALE" | "FOR_RENT";
  price: string;
  location: string;
  city: string;
  isVerified: boolean;
  isEscrowSecured: boolean;
  avatar: string;
  brokerName: string;
  image: string;
  beds: number;
  baths: number;
  size: string;
  featured: boolean;
}

const properties: Property[] = [
  {
    id: "prop-1",
    title: "Luxury Diaspora Villa",
    category: "Villa",
    status: "FOR_SALE",
    price: "$245,000",
    location: "Hodan, Mogadishu",
    city: "Mogadishu",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    brokerName: "Abdi Rahman",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    beds: 5,
    baths: 4,
    size: "380 m²",
    featured: true,
  },
  {
    id: "prop-2",
    title: "Modern 3-Bedroom Apartment",
    category: "Apartment",
    status: "FOR_RENT",
    price: "$750/month",
    location: "Jigjiga Yar, Hargeisa",
    city: "Hargeisa",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    brokerName: "Faisal Yusuf",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    beds: 3,
    baths: 2,
    size: "150 m²",
    featured: false,
  },
  {
    id: "prop-3",
    title: "Commercial Building Space",
    category: "Commercial",
    status: "FOR_SALE",
    price: "$450,000",
    location: "Waberi, Mogadishu",
    city: "Mogadishu",
    isVerified: false,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80",
    brokerName: "Khadra Ahmed",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    beds: 0,
    baths: 6,
    size: "750 m²",
    featured: false,
  },
  {
    id: "prop-4",
    title: "Beachfront Family Villa",
    category: "Villa",
    status: "FOR_SALE",
    price: "$320,000",
    location: "Lido Beach, Mogadishu",
    city: "Mogadishu",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    brokerName: "Sahal Properties",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    beds: 4,
    baths: 3,
    size: "320 m²",
    featured: true,
  },
  {
    id: "prop-5",
    title: "Furnished Studio Apartment",
    category: "Apartment",
    status: "FOR_RENT",
    price: "$400/month",
    location: "Hodan, Mogadishu",
    city: "Mogadishu",
    isVerified: true,
    isEscrowSecured: false,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    brokerName: "Mustafa Ali",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    beds: 1,
    baths: 1,
    size: "55 m²",
    featured: false,
  },
  {
    id: "prop-6",
    title: "Large Plot Near Airport Road",
    category: "Land",
    status: "FOR_SALE",
    price: "$180,000",
    location: "Waberi, Mogadishu",
    city: "Mogadishu",
    isVerified: false,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    brokerName: "Sahal Lands",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    beds: 0,
    baths: 0,
    size: "1200 m²",
    featured: false,
  },
  {
    id: "prop-7",
    title: "Executive Penthouse Suite",
    category: "Apartment",
    status: "FOR_RENT",
    price: "$1,200/month",
    location: "KM4, Mogadishu",
    city: "Mogadishu",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    brokerName: "Amina Dalaal",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    beds: 3,
    baths: 2,
    size: "200 m²",
    featured: true,
  },
  {
    id: "prop-8",
    title: "Residential Plot in Township",
    category: "Land",
    status: "FOR_SALE",
    price: "$95,000",
    location: "Arta, Djibouti",
    city: "Djibouti",
    isVerified: true,
    isEscrowSecured: false,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80",
    brokerName: "Djibouti Estates",
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80",
    beds: 0,
    baths: 0,
    size: "800 m²",
    featured: false,
  },
  {
    id: "prop-9",
    title: "Warehouse & Storage Facility",
    category: "Commercial",
    status: "FOR_RENT",
    price: "$2,500/month",
    location: "Industrial Zone, Garowe",
    city: "Garowe",
    isVerified: false,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    brokerName: "Puntland Holdings",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    beds: 0,
    baths: 2,
    size: "1500 m²",
    featured: false,
  },
];

const categories = [
  { label: "All", value: "all", icon: Home },
  { label: "Villa", value: "Villa", icon: Home },
  { label: "Apartment", value: "Apartment", icon: Building2 },
  { label: "Land", value: "Land", icon: LandPlot },
  { label: "Commercial", value: "Commercial", icon: Warehouse },
];

const cities = ["All Cities", "Mogadishu", "Hargeisa", "Garowe", "Djibouti"];

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "FOR_SALE" | "FOR_RENT">("ALL");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "newest">("default");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = properties.filter((p) => {
      const matchSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchStatus = selectedStatus === "ALL" || p.status === selectedStatus;
      const matchCity = selectedCity === "All Cities" || p.city === selectedCity;
      return matchSearch && matchCategory && matchStatus && matchCity;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => {
        const pa = parseFloat(a.price.replace(/[^0-9.]/g, ""));
        const pb = parseFloat(b.price.replace(/[^0-9.]/g, ""));
        return pa - pb;
      });
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => {
        const pa = parseFloat(a.price.replace(/[^0-9.]/g, ""));
        const pb = parseFloat(b.price.replace(/[^0-9.]/g, ""));
        return pb - pa;
      });
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedStatus, selectedCity, sortBy]);

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedStatus !== "ALL" ? 1 : 0) +
    (selectedCity !== "All Cities" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("ALL");
    setSelectedCity("All Cities");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/75 backdrop-blur-md dark:border-zinc-850/50 dark:bg-zinc-950/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/20">
                D
              </span>
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                Dalaal<span className="text-sky-600">.</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/properties" className="text-sm font-semibold text-sky-600 dark:text-sky-400 transition-colors">
                Properties
              </Link>
              <Link href="/vehicles" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                Vehicles
              </Link>
              <Link href="/clips" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                Clips
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login" className="text-xs font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white transition-all shadow-md shadow-sky-600/20">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Home className="w-4 h-4" />
            <span>Properties Marketplace</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white mb-3">
            Find Your Perfect Property
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-2xl">
            Browse verified properties across Somalia. Every listing is backed by Dalaal escrow protection for safe transactions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, or neighborhood..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.value
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-sky-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Status Filter */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
            {(["ALL", "FOR_SALE", "FOR_RENT"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStatus === status
                    ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {status === "ALL" ? "Buy & Rent" : status === "FOR_SALE" ? "For Sale" : "For Rent"}
              </button>
            ))}
          </div>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-9 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            <option value="default">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <X className="w-3 h-3" />
              Clear ({activeFilterCount})
            </button>
          )}

          <span className="ml-auto text-xs font-semibold text-zinc-400 dark:text-zinc-500">
            {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
          </span>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <Search className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No properties found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Try adjusting your filters or search query.</p>
            <button onClick={clearFilters} className="text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-zinc-900 rounded-[5px] border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className={`absolute left-3.5 top-3.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${
                    item.status === "FOR_SALE" ? "bg-amber-600" : "bg-sky-600"
                  }`}>
                    {item.status === "FOR_SALE" ? "For Sale" : "For Rent"}
                  </span>
                  <div className="absolute right-3.5 top-3.5 flex flex-col gap-1.5 items-end">
                    {item.isVerified && (
                      <span className="flex items-center gap-1 bg-emerald-500/95 text-white px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider shadow-sm backdrop-blur-sm">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                    {item.isEscrowSecured && (
                      <span className="flex items-center gap-1 bg-indigo-600/95 text-white px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider shadow-sm backdrop-blur-sm">
                        <Shield className="w-3 h-3" /> ESCROW
                      </span>
                    )}
                  </div>
                  {item.featured && (
                    <span className="absolute left-3.5 bottom-3.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase text-white bg-sky-600/95 shadow-sm backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs mb-2.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="font-extrabold text-sky-600 dark:text-sky-400 shrink-0">
                      {item.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 py-3 border-t border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs mb-4">
                    {item.beds > 0 && (
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 text-zinc-400" />
                        <span>{item.beds} Beds</span>
                      </span>
                    )}
                    {item.baths > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-zinc-400" />
                        <span>{item.baths} Baths</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-zinc-400" />
                      <span>{item.size}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.avatar}
                        alt={item.brokerName}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
                      />
                      <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        {item.brokerName}
                      </span>
                    </div>
                    <button className="flex items-center gap-0.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors">
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-16 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/20">D</span>
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Dalaal</span>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Somalia&apos;s premier real estate and vehicle marketplace. Secure transactions, verified agents, and live video tours.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest mb-4">Properties</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <li><Link href="/properties" className="hover:text-sky-600 transition-colors">All Properties</Link></li>
              <li><Link href="/properties" className="hover:text-sky-600 transition-colors">Villas & Houses</Link></li>
              <li><Link href="/properties" className="hover:text-sky-600 transition-colors">Apartments</Link></li>
              <li><Link href="/properties" className="hover:text-sky-600 transition-colors">Commercial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest mb-4">Vehicles</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <li><Link href="/vehicles" className="hover:text-emerald-600 transition-colors">All Vehicles</Link></li>
              <li><Link href="/vehicles" className="hover:text-emerald-600 transition-colors">SUVs & Pickups</Link></li>
              <li><Link href="/vehicles" className="hover:text-emerald-600 transition-colors">Sedans</Link></li>
              <li><Link href="/vehicles" className="hover:text-emerald-600 transition-colors">Daily Rentals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest mb-4">Trust & Operations</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <li><Link href="/clips" className="hover:text-indigo-600 transition-colors">Clips Walkthroughs</Link></li>
              <li><Link href="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-indigo-600 transition-colors">Create Account</Link></li>
              <li><Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 mt-12 border-t border-zinc-200/50 dark:border-zinc-900 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          © {new Date().getFullYear()} Dalaal Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
