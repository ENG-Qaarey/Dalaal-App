"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Shield,
  CheckCircle2,
  ArrowLeft,
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
import ThemeToggle from "@/components/theme-toggle";
import LanguageToggle from "@/components/language-toggle";
import { api, chatService, favoritesService } from "@/lib/api";

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  listingType: string;
  price: number;
  currency: string;
  featuredImage?: string;
  priceNegotiable: boolean;
  city: string;
  district: string;
  address: string;
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
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
    propertyStatus?: string;
    depositMonths?: number;
    minLeaseMonths?: number;
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
    vehicleStatus?: string;
    minRentalDays?: number;
    depositRequired: boolean;
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  async function fetchListing() {
    setLoading(true);
    setError("");
    try {
      const result = await api.get(`/listings/${id}`);
      setListing(result);
    } catch (err: any) {
      setError(err?.message || "Listing not found");
    } finally {
      setLoading(false);
    }
  }

  function nextImage() {
    if (!listing) return;
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  }

  function prevImage() {
    if (!listing) return;
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  }

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

  function formatPrice(price: number, currency: string, listingType: string): string {
    const formatted = `${currency === "USD" ? "$" : currency}${Number(price).toLocaleString()}`;
    return listingType === "RENT" ? `${formatted}/month` : formatted;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-32" />
            <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Listing Not Found</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">{error || "This listing may have been removed."}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isProperty = listing.type === "PROPERTY";
  const allImages = listing.images?.length > 0
    ? listing.images.sort((a, b) => a.order - b.order)
    : listing.featuredImage
      ? [{ url: listing.featuredImage }]
      : [{ url: isProperty ? "/placeholder-property.jpg" : "/placeholder-vehicle.jpg" }];

  const brokerProfile = listing.user?.profile;
  const brokerName = brokerProfile
    ? [brokerProfile.firstName, brokerProfile.lastName].filter(Boolean).join(" ") || listing.user?.email || "Dalaal Agent"
    : "Dalaal Agent";
  const brokerAvatar = brokerProfile?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-950 dark:text-zinc-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/75 backdrop-blur-md dark:border-zinc-850/50 dark:bg-zinc-950/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-600/20">D</span>
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Dalaal<span className="text-sky-600">.</span></span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/properties" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Properties</Link>
              <Link href="/vehicles" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Vehicles</Link>
              <Link href="/clips" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Clips</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login" className="text-xs font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white transition-all shadow-md shadow-sky-600/20">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href={isProperty ? "/properties" : "/vehicles"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {isProperty ? "Properties" : "Vehicles"}
        </Link>

        {/* Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 mb-8">
          <div className="aspect-video w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[currentImageIndex]?.url}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase text-white shadow-sm ${
              listing.listingType === "RENT" ? "bg-sky-600" : "bg-amber-600"
            }`}>
              {listing.listingType === "RENT" ? "For Rent" : "For Sale"}
            </span>
            {listing.isVerified && (
              <span className="flex items-center gap-1 bg-emerald-500/95 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wider shadow-sm backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
              </span>
            )}
            {listing.isFeatured && (
              <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase text-white bg-indigo-600/95 shadow-sm backdrop-blur-sm">
                Featured
              </span>
            )}
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-50"
            >
              {favLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />}
            </button>
            <button className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm mb-2">
                <MapPin className="w-4 h-4" />
                <span>{listing.address || listing.district || ""}{listing.city ? `, ${listing.city}` : ""}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white mb-3">
                {listing.title}
              </h1>
              <span className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
                {formatPrice(listing.price, listing.currency, listing.listingType)}
              </span>
              {listing.priceNegotiable && (
                <span className="ml-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Negotiable</span>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Description</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Property Details */}
            {isProperty && listing.property && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-sky-600" /> Property Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {listing.property.propertyType && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Type</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{listing.property.propertyType}</p>
                    </div>
                  )}
                  {listing.property.bedrooms != null && listing.property.bedrooms > 0 && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Bedrooms</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1 flex items-center gap-1"><BedDouble className="w-4 h-4 text-zinc-400" /> {listing.property.bedrooms}</p>
                    </div>
                  )}
                  {listing.property.bathrooms != null && listing.property.bathrooms > 0 && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Bathrooms</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1 flex items-center gap-1"><Bath className="w-4 h-4 text-zinc-400" /> {listing.property.bathrooms}</p>
                    </div>
                  )}
                  {listing.property.squareMeters && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Area</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1 flex items-center gap-1"><Maximize2 className="w-4 h-4 text-zinc-400" /> {listing.property.squareMeters} m²</p>
                    </div>
                  )}
                  {listing.property.yearBuilt && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Year Built</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{listing.property.yearBuilt}</p>
                    </div>
                  )}
                  {listing.property.furnished && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Furnished</span>
                      <p className="text-sm font-bold text-emerald-600 mt-1">Yes</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {listing.property.parking && <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300">Parking</span>}
                  {listing.property.garden && <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300">Garden</span>}
                  {listing.property.security && <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300">Security</span>}
                  {listing.property.water && <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300">Water</span>}
                  {listing.property.electricity && <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-300">Electricity</span>}
                </div>
              </div>
            )}

            {/* Vehicle Details */}
            {!isProperty && listing.vehicle && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-emerald-600" /> Vehicle Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Make</span>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{listing.vehicle.make}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Model</span>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{listing.vehicle.model}</p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Year</span>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1 flex items-center gap-1"><Calendar className="w-4 h-4 text-zinc-400" /> {listing.vehicle.year}</p>
                  </div>
                  {listing.vehicle.vehicleType && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Type</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{listing.vehicle.vehicleType}</p>
                    </div>
                  )}
                  {listing.vehicle.fuelType && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Fuel</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1 flex items-center gap-1"><Fuel className="w-4 h-4 text-zinc-400" /> {listing.vehicle.fuelType}</p>
                    </div>
                  )}
                  {listing.vehicle.transmission && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Transmission</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1 flex items-center gap-1"><Settings2 className="w-4 h-4 text-zinc-400" /> {listing.vehicle.transmission}</p>
                    </div>
                  )}
                  {listing.vehicle.mileage != null && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Mileage</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{Number(listing.vehicle.mileage).toLocaleString()} km</p>
                    </div>
                  )}
                  {listing.vehicle.color && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Color</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{listing.vehicle.color}</p>
                    </div>
                  )}
                  {listing.vehicle.seats != null && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Seats</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{listing.vehicle.seats}</p>
                    </div>
                  )}
                  {listing.vehicle.condition && (
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Condition</span>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white mt-1">{listing.vehicle.condition}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              <span>{listing.viewCount} views</span>
              <span>{listing.favoriteCount} favorites</span>
              <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Sidebar - Broker Card */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brokerAvatar} alt={brokerName} className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800" />
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">{brokerName}</h3>
                  {listing.user?.profile?.isVerified && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Agent
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Price</span>
                  <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">
                    {formatPrice(listing.price, listing.currency, listing.listingType)}
                  </span>
                </div>
                {listing.isVerified && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Escrow Protected</span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleContactBroker}
                  disabled={contacting}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors shadow-md shadow-sky-600/20 disabled:opacity-50"
                >
                  {contacting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                  Chat with {brokerName.split(" ")[0]}
                </button>
                {listing.user?.profile?.phone && (
                  <a
                    href={`tel:${listing.user.profile.phone}`}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-bold transition-colors"
                  >
                    Call {listing.user.profile.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-10 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          © {new Date().getFullYear()} Dalaal Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
