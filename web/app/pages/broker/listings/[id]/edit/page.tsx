"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { listingsService, uploadsService } from "@/lib/api";
import { Save, Loader2, AlertCircle, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

const propertyTypes = ["HOUSE", "APARTMENT", "LAND", "COMMERCIAL", "VILLA", "TOWNHOUSE", "OFFICE"];
const vehicleTypes = ["CAR", "TRUCK", "MOTORCYCLE", "BUS", "VAN", "SUV", "PICKUP"];
const fuelTypes = ["PETROL", "DIESEL", "ELECTRIC", "HYBRID"];
const transmissions = ["MANUAL", "AUTOMATIC"];
const cities = ["Mogadishu", "Hargeisa", "Garowe", "Kismayo", "Bosaso", "Beledweyne", "Baidoa", "Merca"];

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [listingType, setListingType] = useState<"PROPERTY" | "VEHICLE">("PROPERTY");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    priceNegotiable: false,
    currency: "USD",
    city: "",
    district: "",
    address: "",
    featuredImage: "",
    images: [] as string[],
    videoUrl: "",
    propertyType: "HOUSE",
    bedrooms: "",
    bathrooms: "",
    squareMeters: "",
    furnished: false,
    parking: false,
    garden: false,
    security: false,
    water: false,
    electricity: false,
    vehicleType: "CAR",
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "GOOD",
    fuelType: "PETROL",
    transmission: "MANUAL",
    color: "",
    seats: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true);
        const data = await listingsService.getById(id);
        const listing = data?.listing || data;

        setForm({
          title: listing.title || "",
          description: listing.description || "",
          price: String(listing.price || ""),
          priceNegotiable: listing.priceNegotiable || false,
          currency: listing.currency || "USD",
          city: listing.city || "",
          district: listing.district || "",
          address: listing.address || "",
          featuredImage: listing.featuredImage || "",
          images: (listing.images || []).map((img: any) => img.url || img),
          videoUrl: listing.videoUrl || "",
          propertyType: listing.property?.propertyType || "HOUSE",
          bedrooms: listing.property?.bedrooms != null ? String(listing.property.bedrooms) : "",
          bathrooms: listing.property?.bathrooms != null ? String(listing.property.bathrooms) : "",
          squareMeters: listing.property?.squareMeters != null ? String(listing.property.squareMeters) : "",
          furnished: listing.property?.furnished || false,
          parking: listing.property?.parking || false,
          garden: listing.property?.garden || false,
          security: listing.property?.security || false,
          water: listing.property?.water || false,
          electricity: listing.property?.electricity || false,
          vehicleType: listing.vehicle?.vehicleType || "CAR",
          make: listing.vehicle?.make || "",
          model: listing.vehicle?.model || "",
          year: listing.vehicle?.year != null ? String(listing.vehicle.year) : "",
          mileage: listing.vehicle?.mileage != null ? String(listing.vehicle.mileage) : "",
          condition: listing.vehicle?.condition || "GOOD",
          fuelType: listing.vehicle?.fuelType || "PETROL",
          transmission: listing.vehicle?.transmission || "MANUAL",
          color: listing.vehicle?.color || "",
          seats: listing.vehicle?.seats != null ? String(listing.vehicle.seats) : "",
        });

        setListingType(listing.type || "PROPERTY");
      } catch (err: any) {
        setError(err.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  const update = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || Number(form.price) < 0) e.price = "Valid price is required";
    if (!form.city) e.city = "City is required";
    if (listingType === "VEHICLE") {
      if (!form.make.trim()) e.make = "Make is required";
      if (!form.model.trim()) e.model = "Model is required";
      if (!form.year || Number(form.year) < 1900) e.year = "Valid year is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const uploadedUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`"${file.name}" is too large. Max 10MB.`);
        continue;
      }
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api"}/uploads/image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          body: formData,
        });
        const data = await result.json();
        const url = data?.data?.url || data?.data?.secureUrl || data?.url || "";
        if (url) {
          uploadedUrls.push(url);
        }
      } catch {
        alert(`Failed to upload "${file.name}"`);
      }
    }
    setUploading(false);
    if (uploadedUrls.length > 0) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        featuredImage: prev.featuredImage || uploadedUrls[0],
      }));
    }
    e.target.value = "";
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert("Video must be under 50MB");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api"}/uploads/video`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        body: formData,
      });
      const data = await result.json();
      const url = data?.data?.url || data?.data?.secureUrl || data?.url || "";
      if (url) {
        update("videoUrl", url);
      }
    } catch {
      alert("Failed to upload video");
    } finally {
      setUploading(false);
    }
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    update("images", newImages);
    if (form.featuredImage === form.images[idx]) {
      update("featuredImage", newImages[0] || "");
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      setError(null);

      await listingsService.update(id, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        priceNegotiable: form.priceNegotiable,
        currency: form.currency,
        city: form.city,
        district: form.district.trim() || undefined,
        address: form.address.trim() || undefined,
        featuredImage: form.featuredImage || undefined,
        videoUrl: form.videoUrl || undefined,
      });

      // Update property/vehicle details
      if (listingType === "PROPERTY") {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api"}/properties/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          body: JSON.stringify({
            propertyType: form.propertyType,
            bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
            bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
            squareMeters: form.squareMeters ? Number(form.squareMeters) : undefined,
            furnished: form.furnished,
            parking: form.parking,
            garden: form.garden,
            security: form.security,
            water: form.water,
            electricity: form.electricity,
          }),
        }).catch(() => {});
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api"}/vehicles/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          body: JSON.stringify({
            vehicleType: form.vehicleType,
            make: form.make.trim(),
            model: form.model.trim(),
            year: Number(form.year),
            mileage: form.mileage ? Number(form.mileage) : undefined,
            condition: form.condition,
            fuelType: form.fuelType,
            transmission: form.transmission,
            color: form.color.trim() || undefined,
            seats: form.seats ? Number(form.seats) : undefined,
          }),
        }).catch(() => {});
      }

      router.push("/pages/broker/listings");
    } catch (err: any) {
      setError(err.message || "Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded-[10px] animate-pulse" />
        <div className="h-64 bg-muted rounded-[10px] animate-pulse" />
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="font-bold text-lg">Failed to load listing</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link href="/pages/broker/listings" className="text-sm text-blue-600 hover:underline font-semibold">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Link href="/pages/broker/listings" className="p-2 rounded-[10px] hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Listing</h1>
            <p className="text-sm text-muted-foreground mt-1">Update your listing details.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[10px] text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Status Banner */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-[10px]">
        <div className="text-sm">
          <span className="font-semibold">Status:</span>{" "}
          <span className={`px-2 py-0.5 rounded-[10px] text-xs font-bold ${
            form.title ? "bg-muted" : ""
          }`}>
            Editing
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg border-b border-border pb-2">Listing Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={`w-full h-10 px-4 bg-background border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${errors.title ? "border-red-500" : "border-border"}`}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Price ({form.currency}) *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    className={`w-full h-10 px-4 bg-background border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${errors.price ? "border-red-500" : "border-border"}`}
                  />
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">City *</label>
                  <select
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={`w-full h-10 px-4 bg-background border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${errors.city ? "border-red-500" : "border-border"}`}
                  >
                    <option value="">Select city</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">District</label>
                  <input type="text" value={form.district} onChange={(e) => update("district", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Address</label>
                  <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Description</label>
                <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full p-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={form.priceNegotiable} onChange={(e) => update("priceNegotiable", e.target.checked)} className="rounded border-border" />
                Price is negotiable
              </label>
            </div>
          </div>

          {/* Property Fields */}
          {listingType === "PROPERTY" && (
            <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-lg border-b border-border pb-2">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Property Type</label>
                  <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all">
                    {propertyTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Square Meters</label>
                  <input type="number" min="0" value={form.squareMeters} onChange={(e) => update("squareMeters", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Bedrooms</label>
                  <input type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Bathrooms</label>
                  <input type="number" min="0" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {[
                  { key: "furnished", label: "Furnished" },
                  { key: "parking", label: "Parking" },
                  { key: "garden", label: "Garden" },
                  { key: "security", label: "Security" },
                  { key: "water", label: "Water" },
                  { key: "electricity", label: "Electricity" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={!!form[key as keyof typeof form]} onChange={(e) => update(key, e.target.checked)} className="rounded border-border" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Fields */}
          {listingType === "VEHICLE" && (
            <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-lg border-b border-border pb-2">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Vehicle Type</label>
                  <select value={form.vehicleType} onChange={(e) => update("vehicleType", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all">
                    {vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Make *</label>
                  <input type="text" value={form.make} onChange={(e) => update("make", e.target.value)} className={`w-full h-10 px-4 bg-background border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${errors.make ? "border-red-500" : "border-border"}`} />
                  {errors.make && <p className="text-xs text-red-500">{errors.make}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Model *</label>
                  <input type="text" value={form.model} onChange={(e) => update("model", e.target.value)} className={`w-full h-10 px-4 bg-background border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${errors.model ? "border-red-500" : "border-border"}`} />
                  {errors.model && <p className="text-xs text-red-500">{errors.model}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Year *</label>
                  <input type="number" min="1900" max={new Date().getFullYear() + 1} value={form.year} onChange={(e) => update("year", e.target.value)} className={`w-full h-10 px-4 bg-background border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${errors.year ? "border-red-500" : "border-border"}`} />
                  {errors.year && <p className="text-xs text-red-500">{errors.year}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Mileage (km)</label>
                  <input type="number" min="0" value={form.mileage} onChange={(e) => update("mileage", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Condition</label>
                  <select value={form.condition} onChange={(e) => update("condition", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all">
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Fuel Type</label>
                  <select value={form.fuelType} onChange={(e) => update("fuelType", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all">
                    {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Transmission</label>
                  <select value={form.transmission} onChange={(e) => update("transmission", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all">
                    {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Color</label>
                  <input type="text" value={form.color} onChange={(e) => update("color", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Seats</label>
                  <input type="number" min="1" max="50" value={form.seats} onChange={(e) => update("seats", e.target.value)} className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Media */}
          <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg border-b border-border pb-2">Media & Photos</h3>
            <label className="border-2 border-dashed border-border rounded-[10px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
              {uploading ? (
                <Loader2 className="w-8 h-8 text-muted-foreground mb-2 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              )}
              <p className="text-sm font-semibold">{uploading ? "Uploading..." : "Click to upload photos"}</p>
              <p className="text-xs text-muted-foreground">Select multiple images - PNG, JPG up to 10MB each</p>
            </label>
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {form.images.map((url, idx) => (
                  <div key={idx} className="relative group rounded-[10px] overflow-hidden border border-border">
                    <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-20 object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {url === form.featuredImage && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-md">Primary</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Video Upload */}
            <div className="space-y-3 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Video (Optional - 1 only)
              </p>
              {!form.videoUrl ? (
                <label className="border-2 border-dashed border-border rounded-[10px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={handleVideoUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-muted-foreground mb-2 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  )}
                  <p className="text-sm font-semibold">
                    {uploading ? "Uploading..." : "Click to upload a video"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, WebM, MOV up to 50MB
                  </p>
                </label>
              ) : (
                <div className="relative rounded-[10px] overflow-hidden border border-border">
                  <video
                    src={form.videoUrl}
                    controls
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={() => update("videoUrl", "")}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-[10px] font-semibold text-sm transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
            <Link
              href="/pages/broker/listings"
              className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-3 rounded-[10px] font-semibold text-sm transition-colors border border-border"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
