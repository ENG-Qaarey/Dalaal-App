"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Shield,
  CheckCircle2,
  Fuel,
  Settings2,
  ArrowUpRight,
  Search,
  Car,
  Truck,
  Bus,
  Bike,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";

interface Vehicle {
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
  make: string;
  model: string;
  year: number;
  fuel: string;
  transmission: string;
  mileage: string;
  featured: boolean;
}

const vehicles: Vehicle[] = [
  {
    id: "veh-1",
    title: "Toyota Land Cruiser Prado TXL",
    category: "SUV",
    status: "FOR_SALE",
    price: "$48,500",
    location: "Garowe, Puntland",
    city: "Garowe",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    brokerName: "Mustafa Ali",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    make: "Toyota",
    model: "Prado TXL",
    year: 2022,
    fuel: "Diesel",
    transmission: "Automatic",
    mileage: "32,000 km",
    featured: true,
  },
  {
    id: "veh-2",
    title: "Hyundai Elantra Limited",
    category: "Sedan",
    status: "FOR_RENT",
    price: "$45/day",
    location: "Hodan, Mogadishu",
    city: "Mogadishu",
    isVerified: true,
    isEscrowSecured: false,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    brokerName: "Khadra Ahmed",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
    make: "Hyundai",
    model: "Elantra",
    year: 2021,
    fuel: "Petrol",
    transmission: "Automatic",
    mileage: "28,500 km",
    featured: false,
  },
  {
    id: "veh-3",
    title: "Suzuki Alto (Fuel Saver)",
    category: "Compact",
    status: "FOR_RENT",
    price: "$25/day",
    location: "Kismayo, Jubaland",
    city: "Kismayo",
    isVerified: false,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    brokerName: "Faisal Yusuf",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80",
    make: "Suzuki",
    model: "Alto",
    year: 2019,
    fuel: "Petrol",
    transmission: "Manual",
    mileage: "45,000 km",
    featured: false,
  },
  {
    id: "veh-4",
    title: "Toyota Hilux 4x4 Double Cabin",
    category: "Pickup",
    status: "FOR_SALE",
    price: "$35,000",
    location: "Hargeisa, Woqooyi",
    city: "Hargeisa",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    brokerName: "Hargeisa Motors",
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80",
    make: "Toyota",
    model: "Hilux",
    year: 2020,
    fuel: "Diesel",
    transmission: "Manual",
    mileage: "68,000 km",
    featured: true,
  },
  {
    id: "veh-5",
    title: "Nissan Patrol Super Safari",
    category: "SUV",
    status: "FOR_SALE",
    price: "$52,000",
    location: "KM4, Mogadishu",
    city: "Mogadishu",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80",
    brokerName: "Amina Dalaal",
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27c5?auto=format&fit=crop&w=800&q=80",
    make: "Nissan",
    model: "Patrol",
    year: 2021,
    fuel: "Diesel",
    transmission: "Automatic",
    mileage: "22,000 km",
    featured: true,
  },
  {
    id: "veh-6",
    title: "Honda CR-V EX-L",
    category: "SUV",
    status: "FOR_RENT",
    price: "$60/day",
    location: "Waberi, Mogadishu",
    city: "Mogadishu",
    isVerified: false,
    isEscrowSecured: false,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    brokerName: "Sahal Rentals",
    image: "https://images.unsplash.com/photo-1568844293986-8d0400f4745b?auto=format&fit=crop&w=800&q=80",
    make: "Honda",
    model: "CR-V",
    year: 2023,
    fuel: "Petrol",
    transmission: "Automatic",
    mileage: "8,200 km",
    featured: false,
  },
  {
    id: "veh-7",
    title: "Mitsubishi L200 Triton",
    category: "Pickup",
    status: "FOR_SALE",
    price: "$29,500",
    location: "Bosaso, Puntland",
    city: "Garowe",
    isVerified: true,
    isEscrowSecured: false,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    brokerName: "Puntland Trucks",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
    make: "Mitsubishi",
    model: "L200",
    year: 2019,
    fuel: "Diesel",
    transmission: "Manual",
    mileage: "92,000 km",
    featured: false,
  },
  {
    id: "veh-8",
    title: "Kia Sportage GT-Line",
    category: "SUV",
    status: "FOR_RENT",
    price: "$55/day",
    location: "Jigjiga Yar, Hargeisa",
    city: "Hargeisa",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    brokerName: "Faisal Yusuf",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
    make: "Kia",
    model: "Sportage",
    year: 2024,
    fuel: "Petrol",
    transmission: "Automatic",
    mileage: "3,100 km",
    featured: true,
  },
  {
    id: "veh-9",
    title: "Isuzu NPR Box Truck",
    category: "Truck",
    status: "FOR_SALE",
    price: "$42,000",
    location: "Industrial Zone, Garowe",
    city: "Garowe",
    isVerified: false,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    brokerName: "Commercial Motors",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    make: "Isuzu",
    model: "NPR",
    year: 2020,
    fuel: "Diesel",
    transmission: "Manual",
    mileage: "115,000 km",
    featured: false,
  },
];

const categories = [
  { label: "All", value: "all", icon: Car },
  { label: "SUV", value: "SUV", icon: Car },
  { label: "Sedan", value: "Sedan", icon: Car },
  { label: "Pickup", value: "Pickup", icon: Truck },
  { label: "Compact", value: "Compact", icon: Car },
  { label: "Truck", value: "Truck", icon: Truck },
];

const cities = ["All Cities", "Mogadishu", "Hargeisa", "Garowe", "Kismayo"];

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "FOR_SALE" | "FOR_RENT">("ALL");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "newest">("default");

  const filtered = useMemo(() => {
    let result = vehicles.filter((v) => {
      const matchSearch =
        searchQuery === "" ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === "all" || v.category === selectedCategory;
      const matchStatus = selectedStatus === "ALL" || v.status === selectedStatus;
      const matchCity = selectedCity === "All Cities" || v.city === selectedCity;
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
      result = [...result].sort((a, b) => b.year - a.year);
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
              <Link href="/properties" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                Properties
              </Link>
              <Link href="/vehicles" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-colors">
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
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Car className="w-4 h-4" />
            <span>Vehicles Marketplace</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white mb-3">
            Browse Vehicles for Sale & Rent
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-2xl">
            From daily rentals to premium purchases. Every vehicle listing is verified and escrow-secured for your peace of mind.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by make, model, or location..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
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
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700"
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

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-9 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="default">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Year</option>
          </select>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <X className="w-3 h-3" />
              Clear ({activeFilterCount})
            </button>
          )}

          <span className="ml-auto text-xs font-semibold text-zinc-400 dark:text-zinc-500">
            {filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"} found
          </span>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
              <Car className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No vehicles found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Try adjusting your filters or search query.</p>
            <button onClick={clearFilters} className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
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
                    item.status === "FOR_SALE" ? "bg-amber-600" : "bg-emerald-600"
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
                    <span className="absolute left-3.5 bottom-3.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase text-white bg-emerald-600/95 shadow-sm backdrop-blur-sm">
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
                    <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                      {item.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 py-3 border-t border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs mb-4">
                    <span className="flex items-center gap-1.5">
                      <Fuel className="w-4 h-4 text-zinc-400" />
                      <span>{item.fuel}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Settings2 className="w-4 h-4 text-zinc-400" />
                      <span>{item.transmission}</span>
                    </span>
                    <span className="text-zinc-500 font-semibold">{item.year}</span>
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
                    <button className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
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
