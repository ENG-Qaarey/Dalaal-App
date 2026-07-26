"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  MapPin,
  Shield,
  CheckCircle2,
  BedDouble,
  Bath,
  Maximize2,
  Fuel,
  Settings2,
  Calendar,
  Home,
  Car,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { api, chatService, favoritesService } from "@/lib/api";

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  listingType: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  address: string;
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  featuredImage?: string;
  priceNegotiable: boolean;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  images: { id: string; url: string; thumbnail?: string; order: number; isPrimary: boolean }[];
  user: { id: string; email: string; profile?: { firstName?: string; lastName?: string; avatar?: string; phone?: string; isVerified?: boolean } };
  property?: {
    id: string;
    propertyType: string;
    bedrooms?: number;
    bathrooms?: number;
    squareMeters?: number;
    yearBuilt?: number;
    furnished: boolean;
    parking: boolean;
    garden: boolean;
    security: boolean;
    water: boolean;
    electricity: boolean;
  };
  vehicle?: {
    id: string;
    vehicleType: string;
    make: string;
    model: string;
    year: number;
    mileage?: number;
    condition?: string;
    fuelType?: string;
    transmission?: string;
    color?: string;
    seats?: number;
  };
}

interface ListingDetailModalProps {
  open: boolean;
  onClose: () => void;
  listingId: string;
}

function formatPrice(price: number, currency: string, listingType: string): string {
  const symbol = currency === "USD" ? "$" : currency;
  const formatted = `${symbol}${Number(price).toLocaleString()}`;
  return listingType === "RENT" ? `${formatted}/month` : formatted;
}

export default function ListingDetailModal({ open, onClose, listingId }: ListingDetailModalProps) {
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [contacting, setContacting] = useState(false);

  const fetchListing = useCallback(async () => {
    if (!listingId || !open) return;
    setLoading(true);
    setError("");
    try {
      const result = await api.get(`/listings/${listingId}`);
      setListing(result);
      setCurrentImageIndex(0);
      setIsFavorited(false);
    } catch (err: any) {
      setError(err?.message || "Failed to load listing");
    } finally {
      setLoading(false);
    }
  }, [listingId, open]);

  useEffect(() => {
    if (open) {
      fetchListing();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, fetchListing]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  async function handleToggleFavorite() {
    if (!listing || favLoading) return;
    setFavLoading(true);
    try {
      await favoritesService.toggle(listing.id);
      setIsFavorited((prev) => !prev);
    } catch {
      // silent
    } finally {
      setFavLoading(false);
    }
  }

  async function handleContactBroker() {
    if (!listing?.user?.id || contacting) return;
    setContacting(true);
    try {
      await chatService.createConversation({
        participantId: listing.user.id,
        listingId: listing.id,
        title: listing.title,
      });
      window.location.href = "/pages/customer/messages";
    } catch (err: any) {
      alert(err?.message || "Failed to start conversation");
    } finally {
      setContacting(false);
    }
  }

  if (!open) return null;

  const isProperty = listing?.type === "PROPERTY";
  const allImages = listing?.images?.length
    ? [...listing.images].sort((a, b) => a.order - b.order)
    : listing?.featuredImage
      ? [{ url: listing.featuredImage }]
      : [];

  const brokerProfile = listing?.user?.profile;
  const brokerName = brokerProfile
    ? [brokerProfile.firstName, brokerProfile.lastName].filter(Boolean).join(" ") || listing?.user?.email || "Dalaal Agent"
    : "Dalaal Agent";
  const brokerAvatar = brokerProfile?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80";

  function nextImage() {
    if (!allImages.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  }

  function prevImage() {
    if (!allImages.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading && (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-zinc-500">Loading listing...</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-sm text-red-500 mb-3">{error}</p>
              <button onClick={onClose} className="text-sm font-bold text-sky-600 hover:underline">Close</button>
            </div>
          </div>
        )}

        {!loading && !error && listing && (
          <div className="flex-1 overflow-y-auto">
            {allImages.length > 0 && (
              <div className="relative bg-zinc-200 dark:bg-zinc-800">
                <div className="aspect-[16/9] w-full">
                  <img src={allImages[currentImageIndex]?.url} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                {allImages.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {allImages.map((_, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }} className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? "bg-white" : "bg-white/40"}`} />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${listing.listingType === "RENT" ? "bg-sky-600" : "bg-amber-600"}`}>
                    {listing.listingType === "RENT" ? "For Rent" : "For Sale"}
                  </span>
                  {listing.isVerified && (
                    <span className="flex items-center gap-1 bg-emerald-500/95 text-white px-2 py-1.5 rounded-lg text-[10px] font-bold tracking-wider shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-14 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(); }}
                    className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    {favLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />}
                  </button>
                  <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{listing.address || listing.district || ""}{listing.city ? `, ${listing.city}` : ""}</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white mb-2">{listing.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">{formatPrice(listing.price, listing.currency, listing.listingType)}</span>
                      {listing.priceNegotiable && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Negotiable</span>}
                    </div>
                  </div>

                  {listing.description && (
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Description</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                    </div>
                  )}

                  {isProperty && listing.property && (
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2"><Home className="w-4 h-4 text-sky-600" /> Property Details</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {listing.property.propertyType && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Type</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">{listing.property.propertyType}</p></div>}
                        {listing.property.bedrooms != null && listing.property.bedrooms > 0 && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Beds</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-zinc-400" /> {listing.property.bedrooms}</p></div>}
                        {listing.property.bathrooms != null && listing.property.bathrooms > 0 && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Baths</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-zinc-400" /> {listing.property.bathrooms}</p></div>}
                        {listing.property.squareMeters && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Area</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-zinc-400" /> {listing.property.squareMeters} m²</p></div>}
                        {listing.property.yearBuilt && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Year</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">{listing.property.yearBuilt}</p></div>}
                        {listing.property.furnished && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Furnished</span><p className="text-xs font-bold text-emerald-600 mt-0.5">Yes</p></div>}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {listing.property.parking && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-300">Parking</span>}
                        {listing.property.garden && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-300">Garden</span>}
                        {listing.property.security && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-300">Security</span>}
                        {listing.property.water && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-300">Water</span>}
                        {listing.property.electricity && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-300">Electricity</span>}
                      </div>
                    </div>
                  )}

                  {!isProperty && listing.vehicle && (
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2"><Car className="w-4 h-4 text-emerald-600" /> Vehicle Details</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Make</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">{listing.vehicle.make}</p></div>
                        <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Model</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">{listing.vehicle.model}</p></div>
                        <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Year</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-zinc-400" /> {listing.vehicle.year}</p></div>
                        {listing.vehicle.fuelType && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Fuel</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-1"><Fuel className="w-3.5 h-3.5 text-zinc-400" /> {listing.vehicle.fuelType}</p></div>}
                        {listing.vehicle.transmission && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Gear</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5 flex items-center gap-1"><Settings2 className="w-3.5 h-3.5 text-zinc-400" /> {listing.vehicle.transmission}</p></div>}
                        {listing.vehicle.mileage != null && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Mileage</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">{Number(listing.vehicle.mileage).toLocaleString()} km</p></div>}
                        {listing.vehicle.color && <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5"><span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Color</span><p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">{listing.vehicle.color}</p></div>}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                    <span>{listing.viewCount} views</span>
                    <span>{listing.favoriteCount} favorites</span>
                    <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={brokerAvatar} alt={brokerName} className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800" />
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{brokerName}</h4>
                        {listing.user?.profile?.isVerified && (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified Agent</span>
                        )}
                      </div>
                    </div>

                    {listing.isVerified && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-2.5 flex items-center gap-2 mb-4">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Escrow Protected</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <button
                        onClick={handleContactBroker}
                        disabled={contacting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors shadow-md shadow-sky-600/20 disabled:opacity-50"
                      >
                        {contacting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                        Chat with {brokerName.split(" ")[0]}
                      </button>
                      {listing.user?.profile?.phone && (
                        <a
                          href={`tel:${listing.user.profile.phone}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-bold transition-colors border border-zinc-200 dark:border-zinc-700"
                        >
                          Call {listing.user.profile.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
