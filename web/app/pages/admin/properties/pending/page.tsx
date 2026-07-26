"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Megaphone,
  Eye,
  Loader2,
  AlertCircle,
  MapPin,
  BedDouble,
  Bath,
  Fuel,
  Settings2,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  User,
} from "lucide-react";
import { adminService, api } from "@/lib/api";

interface PendingListing {
  id: string;
  title: string;
  description?: string;
  type: string;
  listingType?: string;
  status: string;
  price: number | string;
  currency?: string;
  city: string;
  district?: string;
  address?: string;
  featuredImage?: string;
  priceNegotiable?: boolean;
  createdAt: string;
  images?: { id: string; url: string }[];
  property?: {
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    squareMeters?: number;
    furnished?: boolean;
    parking?: boolean;
    garden?: boolean;
    security?: boolean;
    water?: boolean;
    electricity?: boolean;
  };
  vehicle?: {
    vehicleType?: string;
    make?: string;
    model?: string;
    year?: number;
    fuelType?: string;
    transmission?: string;
    mileage?: number;
    color?: string;
    seats?: number;
    condition?: string;
  };
  user?: {
    id: string;
    email: string;
    username?: string;
    profile?: { firstName?: string; lastName?: string; avatar?: string; fullName?: string; phone?: string; isVerified?: boolean };
  };
}

export default function AdminPendingListings() {
  const [listings, setListings] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; listingId: string | null; reason: string }>({
    open: false,
    listingId: null,
    reason: "",
  });

  // Detail modal
  const [detailModal, setDetailModal] = useState<{ open: boolean; listing: PendingListing | null }>({
    open: false,
    listing: null,
  });
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailImages, setDetailImages] = useState<{ url: string }[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getPendingListings();
      setListings(Array.isArray(data) ? data : data?.listings ?? data?.data ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      await adminService.approveListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      alert("Failed to approve: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (id: string) => {
    setRejectModal({ open: true, listingId: id, reason: "" });
  };

  const handleReject = async () => {
    if (!rejectModal.listingId) return;
    try {
      setActionLoading(rejectModal.listingId);
      await adminService.rejectListing(rejectModal.listingId, rejectModal.reason || "No reason provided");
      setListings((prev) => prev.filter((l) => l.id !== rejectModal.listingId));
      setRejectModal({ open: false, listingId: null, reason: "" });
    } catch (err: any) {
      alert("Failed to reject: " + (err.message || "Unknown error"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = async (listing: PendingListing) => {
    setDetailModal({ open: true, listing });
    setDetailLoading(true);
    setCurrentImageIndex(0);
    try {
      const full = await api.get(`/listings/${listing.id}`);
      const allImages = full.images?.length
        ? [...full.images].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
        : full.featuredImage
          ? [{ url: full.featuredImage }]
          : [];
      setDetailImages(allImages);
      setDetailModal({ open: true, listing: { ...listing, ...full } });
    } catch {
      const fallbackImage = listing.featuredImage ? [{ url: listing.featuredImage }] : listing.images?.length ? listing.images : [];
      setDetailImages(fallbackImage);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatPrice = (price: number | string, currency?: string) => {
    return `${currency === "USD" ? "$" : currency || "$"}${Number(price).toLocaleString()}`;
  };

  const brokerName = (user?: PendingListing["user"]) =>
    user?.profile?.fullName || `${user?.profile?.firstName || ""} ${user?.profile?.lastName || ""}`.trim() || user?.username || user?.email || "Unknown";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and approve new listings before they go live.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-900 px-4 py-2 rounded-lg text-sm font-semibold">
          <Megaphone className="w-4 h-4" /> {listings.length} Pending
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
          <button onClick={fetchListings} className="ml-auto text-sm font-bold hover:underline">Retry</button>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">All caught up!</h3>
            <p className="text-sm text-muted-foreground mt-1">No pending listings to review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs font-semibold">
                  <th className="p-4 pl-0">Listing</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((l) => {
                  const image = l.featuredImage || l.images?.[0]?.url;
                  const isProperty = l.type === "PROPERTY";
                  return (
                    <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 pl-0">
                        <div className="flex items-center gap-3">
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt={l.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              {isProperty ? <BedDouble className="w-5 h-5 text-muted-foreground" /> : <Fuel className="w-5 h-5 text-muted-foreground" />}
                            </div>
                          )}
                          <div>
                            <p className="font-medium line-clamp-1 max-w-[200px]">{l.title}</p>
                            {l.address && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 line-clamp-1">
                                <MapPin className="w-3 h-3 shrink-0" /> {l.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-muted-foreground">{brokerName(l.user)}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                          isProperty ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        }`}>
                          {isProperty ? "Property" : "Vehicle"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {isProperty && l.property && (
                            <>
                              {l.property.propertyType && (
                                <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-semibold">{l.property.propertyType}</span>
                              )}
                              {l.property.bedrooms != null && (
                                <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-semibold">{l.property.bedrooms}BD</span>
                              )}
                              {l.property.bathrooms != null && (
                                <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-semibold">{l.property.bathrooms}BA</span>
                              )}
                            </>
                          )}
                          {!isProperty && l.vehicle && (
                            <>
                              {l.vehicle.make && (
                                <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-semibold">{l.vehicle.make}</span>
                              )}
                              {l.vehicle.model && (
                                <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-semibold">{l.vehicle.model}</span>
                              )}
                              {l.vehicle.year && (
                                <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-semibold">{l.vehicle.year}</span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(l.price, l.currency)}
                      </td>
                      <td className="p-4 text-muted-foreground">{l.city}</td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 pr-0 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(l)}
                            className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(l.id)}
                            disabled={actionLoading === l.id}
                            className="p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            {actionLoading === l.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openRejectModal(l.id)}
                            disabled={actionLoading === l.id}
                            className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {detailModal.open && detailModal.listing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setDetailModal({ open: false, listing: null }); }}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-4">
            {/* Close */}
            <button
              onClick={() => setDetailModal({ open: false, listing: null })}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {detailLoading ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Loading details...</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {/* Images */}
                {detailImages.length > 0 && (
                  <div className="relative bg-zinc-200 dark:bg-zinc-800">
                    <div className="aspect-video w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={detailImages[currentImageIndex]?.url} alt={detailModal.listing.title} className="w-full h-full object-cover" />
                    </div>
                    {detailImages.length > 1 && (
                      <>
                        <button onClick={() => setCurrentImageIndex((p) => (p - 1 + detailImages.length) % detailImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrentImageIndex((p) => (p + 1) % detailImages.length)} className="absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {detailImages.map((_: any, i: number) => (
                            <button key={i} onClick={() => setCurrentImageIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? "bg-white" : "bg-white/40"}`} />
                          ))}
                        </div>
                      </>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${
                        detailModal.listing.listingType === "RENT" ? "bg-amber-600" : "bg-indigo-600"
                      }`}>
                        {detailModal.listing.listingType === "RENT" ? "For Rent" : "For Sale"}
                      </span>
                      <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase text-white shadow-sm ${
                        detailModal.listing.type === "PROPERTY" ? "bg-sky-600" : "bg-emerald-600"
                      }`}>
                        {detailModal.listing.type === "PROPERTY" ? "Property" : "Vehicle"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-5">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{detailModal.listing.district ? `${detailModal.listing.district}, ` : ""}{detailModal.listing.city}</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">{detailModal.listing.title}</h2>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {formatPrice(detailModal.listing.price, detailModal.listing.currency)}
                          </span>
                          {detailModal.listing.priceNegotiable && (
                            <span className="text-sm font-semibold text-emerald-600">Negotiable</span>
                          )}
                        </div>
                      </div>

                      {detailModal.listing.description && (
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
                          <h3 className="text-sm font-bold mb-2">Description</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{detailModal.listing.description}</p>
                        </div>
                      )}

                      {/* Property Details */}
                      {detailModal.listing.type === "PROPERTY" && detailModal.listing.property && (
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
                          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                            <BedDouble className="w-4 h-4 text-sky-600" /> Property Details
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {detailModal.listing.property.propertyType && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Type</span>
                                <p className="text-xs font-bold mt-0.5">{detailModal.listing.property.propertyType}</p>
                              </div>
                            )}
                            {detailModal.listing.property.bedrooms != null && detailModal.listing.property.bedrooms > 0 && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Beds</span>
                                <p className="text-xs font-bold mt-0.5 flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-zinc-400" /> {detailModal.listing.property.bedrooms}</p>
                              </div>
                            )}
                            {detailModal.listing.property.bathrooms != null && detailModal.listing.property.bathrooms > 0 && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Baths</span>
                                <p className="text-xs font-bold mt-0.5 flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-zinc-400" /> {detailModal.listing.property.bathrooms}</p>
                              </div>
                            )}
                            {detailModal.listing.property.squareMeters && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Area</span>
                                <p className="text-xs font-bold mt-0.5">{detailModal.listing.property.squareMeters} m²</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {detailModal.listing.property.furnished && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold">Furnished</span>}
                            {detailModal.listing.property.parking && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold">Parking</span>}
                            {detailModal.listing.property.garden && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold">Garden</span>}
                            {detailModal.listing.property.security && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold">Security</span>}
                            {detailModal.listing.property.water && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold">Water</span>}
                            {detailModal.listing.property.electricity && <span className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-[10px] font-bold">Electricity</span>}
                          </div>
                        </div>
                      )}

                      {/* Vehicle Details */}
                      {detailModal.listing.type === "VEHICLE" && detailModal.listing.vehicle && (
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
                          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                            <Fuel className="w-4 h-4 text-emerald-600" /> Vehicle Details
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {detailModal.listing.vehicle.make && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Make</span>
                                <p className="text-xs font-bold mt-0.5">{detailModal.listing.vehicle.make}</p>
                              </div>
                            )}
                            {detailModal.listing.vehicle.model && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Model</span>
                                <p className="text-xs font-bold mt-0.5">{detailModal.listing.vehicle.model}</p>
                              </div>
                            )}
                            {detailModal.listing.vehicle.year && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Year</span>
                                <p className="text-xs font-bold mt-0.5 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-zinc-400" /> {detailModal.listing.vehicle.year}</p>
                              </div>
                            )}
                            {detailModal.listing.vehicle.fuelType && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Fuel</span>
                                <p className="text-xs font-bold mt-0.5 flex items-center gap-1"><Fuel className="w-3.5 h-3.5 text-zinc-400" /> {detailModal.listing.vehicle.fuelType}</p>
                              </div>
                            )}
                            {detailModal.listing.vehicle.transmission && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Gear</span>
                                <p className="text-xs font-bold mt-0.5 flex items-center gap-1"><Settings2 className="w-3.5 h-3.5 text-zinc-400" /> {detailModal.listing.vehicle.transmission}</p>
                              </div>
                            )}
                            {detailModal.listing.vehicle.mileage != null && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Mileage</span>
                                <p className="text-xs font-bold mt-0.5">{Number(detailModal.listing.vehicle.mileage).toLocaleString()} km</p>
                              </div>
                            )}
                            {detailModal.listing.vehicle.color && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Color</span>
                                <p className="text-xs font-bold mt-0.5">{detailModal.listing.vehicle.color}</p>
                              </div>
                            )}
                            {detailModal.listing.vehicle.condition && (
                              <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Condition</span>
                                <p className="text-xs font-bold mt-0.5">{detailModal.listing.vehicle.condition}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          {detailModal.listing.user?.profile?.avatar ? (
                            <img src={detailModal.listing.user.profile.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-bold">{brokerName(detailModal.listing.user)}</h4>
                            {detailModal.listing.user?.profile?.isVerified && (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            )}
                            {detailModal.listing.user?.email && (
                              <p className="text-[11px] text-muted-foreground">{detailModal.listing.user.email}</p>
                            )}
                          </div>
                        </div>

                        {detailModal.listing.user?.profile?.phone && (
                          <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5 mb-3">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Phone</span>
                            <p className="text-xs font-bold mt-0.5">{detailModal.listing.user.profile.phone}</p>
                          </div>
                        )}

                        <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5 mb-3">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Submitted</span>
                          <p className="text-xs font-bold mt-0.5">{new Date(detailModal.listing.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => { setDetailModal({ open: false, listing: null }); handleApprove(detailModal.listing!.id); }}
                            disabled={actionLoading === detailModal.listing.id}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => { setDetailModal({ open: false, listing: null }); openRejectModal(detailModal.listing!.id); }}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 text-xs font-bold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setRejectModal({ open: false, listingId: null, reason: "" }); }}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <button onClick={() => setRejectModal({ open: false, listingId: null, reason: "" })} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-2">Reject Listing</h2>
            <p className="text-sm text-muted-foreground mb-4">Provide a reason for rejection. The broker will be notified.</p>
            <textarea
              rows={4}
              value={rejectModal.reason}
              onChange={(e) => setRejectModal((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g., Missing required photos, incorrect pricing..."
              className="w-full p-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setRejectModal({ open: false, listingId: null, reason: "" })} className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectModal.listingId}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
              >
                {actionLoading === rejectModal.listingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Reject Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
