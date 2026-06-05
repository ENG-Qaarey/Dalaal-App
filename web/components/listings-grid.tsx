"use client";

import { useState } from "react";
import { MapPin, Shield, CheckCircle2, SlidersHorizontal, ArrowUpRight, BedDouble, Bath, Maximize2, Fuel, Settings2 } from "lucide-react";

interface ListingItem {
  id: string;
  title: string;
  type: "property" | "vehicle";
  status: "FOR_SALE" | "FOR_RENT";
  price: string;
  location: string;
  isVerified: boolean;
  isEscrowSecured: boolean;
  avatar: string;
  brokerName: string;
  image: string;
  specs: {
    beds?: number;
    baths?: number;
    size?: string;
    make?: string;
    model?: string;
    year?: number;
    fuel?: string;
    transmission?: string;
  };
}

const mockListings: ListingItem[] = [
  // Properties
  {
    id: "prop-1",
    title: "Luxury Diaspora Villa",
    type: "property",
    status: "FOR_SALE",
    price: "$245,000",
    location: "Hodan, Mogadishu",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    brokerName: "Abdi Rahman (Dalaal)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    specs: { beds: 5, baths: 4, size: "380 m²" }
  },
  {
    id: "prop-2",
    title: "Modern 3-Bedroom Apartment",
    type: "property",
    status: "FOR_RENT",
    price: "$750/month",
    location: "Jigjiga Yar, Hargeisa",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    brokerName: "Faisal Yusuf",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    specs: { beds: 3, baths: 2, size: "150 m²" }
  },
  {
    id: "prop-3",
    title: "Commercial Building Space",
    type: "property",
    status: "FOR_SALE",
    price: "$450,000",
    location: "Waberi, Mogadishu",
    isVerified: false,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80",
    brokerName: "Khadra Ahmed",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    specs: { beds: 0, baths: 6, size: "750 m²" }
  },
  // Vehicles
  {
    id: "veh-1",
    title: "Toyota Land Cruiser Prado TXL",
    type: "vehicle",
    status: "FOR_SALE",
    price: "$48,500",
    location: "Garowe, Puntland",
    isVerified: true,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    brokerName: "Mustafa Ali",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    specs: { make: "Toyota", model: "Prado", year: 2022, fuel: "Diesel", transmission: "Automatic" }
  },
  {
    id: "veh-2",
    title: "Hyundai Elantra Limited",
    type: "vehicle",
    status: "FOR_RENT",
    price: "$45/day",
    location: "Hodan, Mogadishu",
    isVerified: true,
    isEscrowSecured: false,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    brokerName: "Khadra Ahmed",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
    specs: { make: "Hyundai", model: "Elantra", year: 2021, fuel: "Petrol", transmission: "Automatic" }
  },
  {
    id: "veh-3",
    title: "Suzuki Alto (Fuel Saver)",
    type: "vehicle",
    status: "FOR_RENT",
    price: "$25/day",
    location: "Kismayo, Jubaland",
    isVerified: false,
    isEscrowSecured: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    brokerName: "Faisal Yusuf",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80",
    specs: { make: "Suzuki", model: "Alto", year: 2019, fuel: "Petrol", transmission: "Manual" }
  }
];

export default function ListingsGrid() {
  const [filterType, setFilterType] = useState<"all" | "property" | "vehicle">("all");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "FOR_SALE" | "FOR_RENT">("ALL");

  const filtered = mockListings.filter((item) => {
    const typeMatch = filterType === "all" || item.type === filterType;
    const statusMatch = filterStatus === "ALL" || item.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <section className="py-20 border-t border-zinc-100 dark:border-zinc-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Explore Handpicked Deals
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Verified items matching secure escrow integrations in Somalia.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2.5">
          {/* Category Filter */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "all"
                  ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterType("property")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "property"
                  ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setFilterType("vehicle")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "vehicle"
                  ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              Vehicles
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === "ALL"
                  ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              Buy & Rent
            </button>
            <button
              onClick={() => setFilterStatus("FOR_SALE")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === "FOR_SALE"
                  ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setFilterStatus("FOR_RENT")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === "FOR_RENT"
                  ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              For Rent
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            {/* Listing Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Status Badge */}
              <span className={`absolute left-3.5 top-3.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${
                item.status === "FOR_SALE" ? "bg-amber-600" : "bg-sky-600"
              }`}>
                {item.status === "FOR_SALE" ? "For Sale" : "For Rent"}
              </span>

              {/* Verification and Escrow Badges */}
              <div className="absolute right-3.5 top-3.5 flex flex-col gap-1.5 items-end">
                {item.isVerified && (
                  <span className="flex items-center gap-1 bg-emerald-500/95 text-white px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider shadow-sm backdrop-blur-sm">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                )}
                {item.isEscrowSecured && (
                  <span className="flex items-center gap-1 bg-indigo-600/95 text-white px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider shadow-sm backdrop-blur-sm">
                    <Shield className="w-3 h-3" /> ESCROW SECURED
                  </span>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5">
              {/* Location */}
              <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs mb-2.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{item.location}</span>
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <span className="font-extrabold text-sky-600 dark:text-sky-400 shrink-0">
                  {item.price}
                </span>
              </div>

              {/* Specs */}
              <div className="flex items-center gap-4 py-3 border-t border-b border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs mb-4">
                {item.type === "property" ? (
                  <>
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-zinc-400" />
                      <span>{item.specs.beds} Beds</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-zinc-400" />
                      <span>{item.specs.baths} Baths</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-zinc-400" />
                      <span>{item.specs.size}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5">
                      <Fuel className="w-4 h-4 text-zinc-400" />
                      <span>{item.specs.fuel}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Settings2 className="w-4 h-4 text-zinc-400" />
                      <span>{item.specs.transmission}</span>
                    </span>
                    <span className="text-zinc-500 font-semibold">{item.specs.year}</span>
                  </>
                )}
              </div>

              {/* Broker Profile */}
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
    </section>
  );
}
