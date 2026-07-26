"use client";

import { useState, useEffect } from "react";
import { Heart, MapPin, Trash2, Loader2, AlertCircle, BedDouble, Bath, Building2, Car, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { favoritesService } from "@/lib/api";
import ListingDetailModal from "@/components/listing-detail-modal";

interface FavoriteListing {
  id: string;
  listingId: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
    city: string;
    district: string;
    listingType: string;
    type: string;
    featuredImage?: string;
    images: { url: string }[];
    property?: { bedrooms?: number; bathrooms?: number; squareMeters?: number };
    vehicle?: { make: string; model: string; year: number };
    user?: { profile?: { firstName?: string; lastName?: string } };
  } | null;
}

export default function CustomerFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    setLoading(true);
    setError(null);
    try {
      const data = await favoritesService.getMy();
      setFavorites(Array.isArray(data) ? data : data?.favorites ?? data?.data ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(listingId: string) {
    setRemovingId(listingId);
    try {
      await favoritesService.toggle(listingId);
      setFavorites((prev) => prev.filter((f) => f.listingId !== listingId));
    } catch (err: any) {
      // silent
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Saved Favorites</h1>
          <p className="text-sm text-muted-foreground mt-1">Properties and vehicles you have saved for later.</p>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={fetchFavorites} className="mt-3 text-sm text-blue-600 hover:underline font-semibold">Retry</button>
        </div>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-foreground mb-1">No favorites yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start saving listings you love from the marketplace.</p>
          <Link href="/pages/customer/search" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            Browse Listings
          </Link>
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {favorites.map((fav) => {
            const listing = fav.listing;
            if (!listing) return null;
            const image = listing.featuredImage || listing.images?.[0]?.url || (listing.type === "VEHICLE" ? "/placeholder-vehicle.jpg" : "/placeholder-property.jpg");
            const price = `${listing.currency === "USD" ? "$" : listing.currency === "SOS" ? "Sh" : ""}${Number(listing.price).toLocaleString()}${listing.listingType === "RENT" ? "/mo" : ""}`;
            const brokerName = listing.user?.profile
              ? [listing.user.profile.firstName, listing.user.profile.lastName].filter(Boolean).join(" ")
              : "";

            return (
              <div key={fav.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:border-border/80 transition-all group">
                <div className="h-48 bg-muted flex items-center justify-center relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={() => handleRemoveFavorite(fav.listingId)}
                    disabled={removingId === fav.listingId}
                    className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                  >
                    {removingId === fav.listingId ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    )}
                  </button>
                  <span className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold text-foreground bg-background/90 backdrop-blur-sm`}>
                    {listing.listingType === "RENT" ? "FOR RENT" : "FOR SALE"}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">{listing.title}</h3>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {listing.district || ""}{listing.city ? `, ${listing.city}` : ""}
                  </p>
                  {listing.property && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {listing.property.bedrooms != null && (
                        <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {listing.property.bedrooms} Beds</span>
                      )}
                      {listing.property.bathrooms != null && (
                        <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {listing.property.bathrooms} Baths</span>
                      )}
                    </div>
                  )}
                  {listing.vehicle && (
                    <p className="text-xs text-muted-foreground">{listing.vehicle.make} {listing.vehicle.model} • {listing.vehicle.year}</p>
                  )}
                  <div className="pt-2 flex items-center justify-between text-xs font-semibold border-t border-border mt-2">
                    <span className="text-muted-foreground">Saved {new Date(fav.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => setSelectedListingId(listing.id)}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
