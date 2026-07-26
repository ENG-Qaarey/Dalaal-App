"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search as SearchIcon,
  MapPin,
  Shield,
  CheckCircle2,
  X,
  Building2,
  Car,
  LayoutGrid,
  List,
  Eye,
  Heart,
  TrendingUp,
} from "lucide-react";
import { searchService, favoritesService } from "@/lib/api";
import ListingDetailModal from "@/components/listing-detail-modal";
import { Loader2 } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "PROPERTY" | "VEHICLE";
  listingType: string;
  price: number;
  currency?: string;
  city: string;
  district?: string;
  image: string;
  location: string;
  brokerName: string;
  brokerAvatar?: string;
  status: string;
  priceNegotiable?: boolean;
  viewCount?: number;
  favoriteCount?: number;
  inquiryCount?: number;
  property?: {
    bedrooms?: number;
    bathrooms?: number;
    squareMeters?: number;
    furnished?: boolean;
  };
  vehicle?: {
    make?: string;
    year?: number;
    fuelType?: string;
    transmission?: string;
  };
}

function mapListing(listing: any): SearchResult {
  const img = listing.featuredImage || listing.images?.[0]?.url || "/placeholder.jpg";
  const profile = listing.user?.profile;
  const brokerName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || listing.user?.email || "Dalaal Agent"
    : "Dalaal Agent";
  const location = listing.property?.address || [listing.vehicle?.make, listing.vehicle?.model].filter(Boolean).join(" ") || listing.city;

  return {
    id: listing.id,
    title: listing.title,
    type: listing.type,
    listingType: listing.listingType,
    price: Number(listing.price),
    currency: listing.currency,
    city: listing.city,
    district: listing.district,
    image: img,
    location,
    brokerName,
    brokerAvatar: profile?.avatar,
    status: listing.status,
    priceNegotiable: listing.priceNegotiable,
    viewCount: listing.viewCount,
    favoriteCount: listing.favoriteCount,
    inquiryCount: listing.inquiryCount,
    property: listing.property,
    vehicle: listing.vehicle,
  };
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  PENDING_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  DRAFT: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  PENDING_REVIEW: "Pending Review",
  DRAFT: "Draft",
  REJECTED: "Rejected",
};

const quickFilters = [
  { label: "House for Rent", q: "", type: "PROPERTY" },
  { label: "Apartments for Sale", q: "", type: "PROPERTY" },
  { label: "Used Vehicles", q: "", type: "VEHICLE" },
];

const formatPrice = (price: number, currency?: string) => {
  const sym = currency === "SOS" ? "Sh" : "$";
  return `${sym}${Number(price).toLocaleString()}`;
};

export default function CustomerSearch() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [favLoadingId, setFavLoadingId] = useState<string | null>(null);

  const doSearch = useCallback(async (q: string, c: string, type?: string) => {
    setLoading(true);
    setError("");
    setHasSearched(true);
    try {
      const params: Record<string, string> = {};
      if (q) params.q = q;
      if (c) params.city = c;
      if (type) params.type = type;
      const result = await searchService.search(params);
      const listings = Array.isArray(result) ? result : result?.data ?? [];
      setResults(listings.map(mapListing));
    } catch (err: any) {
      setError(err?.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch("", "");
  }, [doSearch]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    doSearch(query, city);
    setActiveFilter(null);
  }

  function handleQuickFilter(label: string, index: number) {
    setActiveFilter(index);
    doSearch(label, city);
  }

  async function handleToggleFavorite(e: React.MouseEvent, listingId: string) {
    e.stopPropagation();
    if (favLoadingId) return;
    setFavLoadingId(listingId);
    try {
      await favoritesService.toggle(listingId);
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        if (next.has(listingId)) next.delete(listingId);
        else next.add(listingId);
        return next;
      });
    } catch {
      // silent
    } finally {
      setFavLoadingId(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search Properties & Vehicles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find exactly what you're looking for across Somalia.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by location, property type, or keywords..."
              className="w-full h-12 pl-12 pr-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); doSearch("", city); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={city}
              onChange={(e) => { setCity(e.target.value); doSearch(query, e.target.value); }}
              className="h-12 px-4 bg-background border border-border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm font-medium"
            >
              <option value="">Any Location</option>
              <option>Mogadishu</option>
              <option>Hargeisa</option>
              <option>Garowe</option>
              <option>Kismayo</option>
              <option>Bosaso</option>
            </select>
            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-[10px] font-semibold text-sm transition-all shadow-md shadow-blue-600/20">
              <SearchIcon className="w-4 h-4" /> Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="text-sm font-semibold text-muted-foreground">Quick Filters:</span>
          {quickFilters.map((f, i) => (
            <button
              key={i}
              onClick={() => handleQuickFilter(f.label, i)}
              className={`px-3 py-1.5 rounded-[10px] border text-xs font-semibold transition-colors ${
                activeFilter === i
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-border bg-muted/50 hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {loading ? "Searching..." : `${results.length} listing${results.length !== 1 ? "s" : ""} found`}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-[10px] transition-colors ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-950/40"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-[10px] transition-colors ${
              viewMode === "table"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-950/40"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border rounded-[10px] overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                  <div className="h-6 w-1/3 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-[10px] animate-pulse" />
            ))}
          </div>
        )
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-sm text-destructive mb-3">{error}</p>
          <button onClick={() => doSearch(query, city)} className="text-sm font-bold text-blue-600 hover:underline">
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && results.length === 0 && hasSearched && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <SearchIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground">Try different keywords or adjust your filters.</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results.length > 0 && viewMode === "grid" ? (
        /* ========== GRID VIEW ========== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedListingId(item.id)}
              className="bg-card border border-border rounded-[10px] overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Listing Type Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-[10px] text-[10px] font-bold text-foreground">
                  {item.listingType === "RENT" ? "FOR RENT" : "FOR SALE"}
                </div>
                {/* Customer Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                  <button
                    onClick={(e) => handleToggleFavorite(e, item.id)}
                    disabled={favLoadingId === item.id}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-50"
                  >
                    {favLoadingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className={`w-4 h-4 ${favoritedIds.has(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                    )}
                  </button>
                  {item.status === "ACTIVE" && (
                    <span className="flex items-center gap-1 bg-emerald-500/95 text-white px-2 py-1 rounded-[10px] text-[9px] font-bold shadow-sm backdrop-blur-sm">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-indigo-600/95 text-white px-2 py-1 rounded-[10px] text-[9px] font-bold shadow-sm backdrop-blur-sm">
                    <Shield className="w-3 h-3" /> ESCROW
                  </span>
                </div>
                {/* Type Badge */}
                <span className="absolute bottom-3 right-3 px-2 py-1 rounded-[10px] bg-black/50 text-white text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
                  {item.type === "VEHICLE" ? (
                    <Car className="w-3 h-3" />
                  ) : (
                    <Building2 className="w-3 h-3" />
                  )}
                  {item.type}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}, {item.city}
                    {item.district ? `, ${item.district}` : ""}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                    {formatPrice(item.price, item.currency)}
                  </span>
                  {item.priceNegotiable && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md">
                      Negotiable
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {item.viewCount ?? 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {item.favoriteCount ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {item.inquiryCount ?? 0}
                  </span>
                </div>

                {/* Property Details */}
                {item.property && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.property.bedrooms != null && (
                      <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                        {item.property.bedrooms} Bed
                      </span>
                    )}
                    {item.property.bathrooms != null && (
                      <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                        {item.property.bathrooms} Bath
                      </span>
                    )}
                    {item.property.squareMeters != null && (
                      <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                        {item.property.squareMeters} m²
                      </span>
                    )}
                    {item.property.furnished && (
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-md text-[10px] font-semibold">
                        Furnished
                      </span>
                    )}
                  </div>
                )}

                {/* Vehicle Details */}
                {item.vehicle && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.vehicle.make && (
                      <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                        {item.vehicle.make}
                      </span>
                    )}
                    {item.vehicle.year && (
                      <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                        {item.vehicle.year}
                      </span>
                    )}
                    {item.vehicle.fuelType && (
                      <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                        {item.vehicle.fuelType}
                      </span>
                    )}
                    {item.vehicle.transmission && (
                      <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-semibold">
                        {item.vehicle.transmission}
                      </span>
                    )}
                  </div>
                )}

                {/* Broker */}
                <div className="pt-2 flex items-center justify-between text-xs font-semibold border-t border-border">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.brokerAvatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"}
                      alt={item.brokerName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-muted-foreground">{item.brokerName}</span>
                  </div>
                  <span className="text-blue-600">View Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !error && results.length > 0 ? (
        /* ========== TABLE VIEW ========== */
        <div className="bg-card border border-border rounded-[10px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground text-xs font-semibold">
                  <th className="p-4 pl-5">Listing</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Stats</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[10px] bg-muted overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate max-w-[200px]">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.city || "-"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                        {item.type === "VEHICLE" ? (
                          <Car className="w-3.5 h-3.5" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5" />
                        )}
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400 text-sm">
                      {formatPrice(item.price, item.currency)}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {item.city || "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {item.viewCount ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {item.favoriteCount ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-[10px] text-[10px] font-bold ${statusColors[item.status] || "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                    <td className="p-4 pr-5">
                      <button
                        onClick={() => setSelectedListingId(item.id)}
                        className="px-3 py-1.5 rounded-[10px] bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Listing Detail Modal */}
      {selectedListingId && (
        <ListingDetailModal
          open={!!selectedListingId}
          onClose={() => setSelectedListingId(null)}
          listingId={selectedListingId}
        />
      )}
    </div>
  );
}
