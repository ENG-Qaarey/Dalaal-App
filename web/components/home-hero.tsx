"use client";

import { useState } from "react";
import { Search, MapPin, Home, Car, SlidersHorizontal, Sparkles } from "lucide-react";

export default function HomeHero() {
  const [activeTab, setActiveTab] = useState<"property" | "vehicle">("property");
  
  // Search state for Property
  const [propertyType, setPropertyType] = useState("all");
  const [propertyCity, setPropertyCity] = useState("Mogadishu");
  const [propertyPrice, setPropertyPrice] = useState("all");

  // Search state for Vehicle
  const [vehicleType, setVehicleType] = useState("all");
  const [vehicleMake, setVehicleMake] = useState("all");
  const [vehiclePrice, setVehiclePrice] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching details...", {
      type: activeTab,
      filters: activeTab === "property" ? { propertyType, propertyCity, propertyPrice } : { vehicleType, vehicleMake, vehiclePrice }
    });
    alert(`Searching for ${activeTab}s with your filters!`);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl dark:bg-sky-500/10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl dark:bg-emerald-500/10 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-5xl text-center px-4">
        {/* Banner Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-200 bg-sky-50 text-xs font-semibold text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-300 mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Somalia's Premium Escrow-Secured Marketplace</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-sky-950 to-emerald-950 dark:from-white dark:via-sky-200 dark:to-emerald-200 mb-6 leading-tight">
          Find Your Next Home or Drive <br className="hidden sm:inline" />
          <span className="text-sky-600 dark:text-sky-400">With Absolute Trust</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-300 mb-10">
          Verify land title deeds, browse vehicle status checklists, interact via real-time calling, and transact safely using integrated mobile money escrow contracts.
        </p>

        {/* Main Search Glass Container */}
        <div className="w-full max-w-4xl mx-auto bg-white/70 dark:bg-zinc-900/75 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 shadow-2xl transition-all duration-300 hover:shadow-sky-500/5 dark:hover:shadow-emerald-500/5">
          {/* Tab Switchers */}
          <div className="flex gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4 mb-5">
            <button
              onClick={() => setActiveTab("property")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === "property"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Properties & Land</span>
            </button>
            <button
              onClick={() => setActiveTab("vehicle")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === "vehicle"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Vehicles & Rentals</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-left">
            {activeTab === "property" ? (
              <>
                {/* Property Type */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block px-1">Property Type</label>
                  <div className="relative">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full h-11 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    >
                      <option value="all">All Types</option>
                      <option value="villa">Villa / House</option>
                      <option value="apartment">Apartment</option>
                      <option value="land">Commercial Land</option>
                      <option value="office">Office Space</option>
                    </select>
                  </div>
                </div>

                {/* Property Location */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block px-1">City / Region</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <select
                      value={propertyCity}
                      onChange={(e) => setPropertyCity(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    >
                      <option value="Mogadishu">Mogadishu</option>
                      <option value="Hargeisa">Hargeisa</option>
                      <option value="Garowe">Garowe</option>
                      <option value="Kismayo">Kismayo</option>
                      <option value="Bosaso">Bosaso</option>
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block px-1">Budget Range (USD)</label>
                  <div className="relative">
                    <select
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(e.target.value)}
                      className="w-full h-11 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    >
                      <option value="all">Any Price</option>
                      <option value="0-500">Under $500/mo</option>
                      <option value="500-2000">$500 - $2,000/mo</option>
                      <option value="20000-50000">$20,000 - $50,000 (Buy)</option>
                      <option value="50000-150000">$50,000 - $150,000 (Buy)</option>
                      <option value="150000+">$150,000+ (Buy)</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Vehicle Type */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block px-1">Vehicle Type</label>
                  <div className="relative">
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full h-11 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="all">All Types</option>
                      <option value="suv">SUV</option>
                      <option value="sedan">Sedan</option>
                      <option value="truck">Truck / Commercial</option>
                      <option value="motorcycle">Motorcycle</option>
                    </select>
                  </div>
                </div>

                {/* Vehicle Make */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block px-1">Brand / Make</label>
                  <div className="relative">
                    <select
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      className="w-full h-11 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="all">All Brands</option>
                      <option value="toyota">Toyota</option>
                      <option value="hyundai">Hyundai</option>
                      <option value="suzuki">Suzuki</option>
                      <option value="nissan">Nissan</option>
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 block px-1">Price Range</label>
                  <div className="relative">
                    <select
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(e.target.value)}
                      className="w-full h-11 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      <option value="all">Any Budget</option>
                      <option value="0-50">Under $50/day (Rent)</option>
                      <option value="50-150">$50 - $150/day (Rent)</option>
                      <option value="5000-15000">$5,000 - $15,000 (Buy)</option>
                      <option value="15000-30000">$15,000 - $30,000 (Buy)</option>
                      <option value="30000+">$30,000+ (Buy)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              className={`w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-md ${
                activeTab === "property"
                  ? "bg-sky-600 hover:bg-sky-700 hover:shadow-sky-600/20"
                  : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-600/20"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search Listings</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
