"use client";

import { useState, useEffect } from "react";
import { Star, Search, Loader2, Eye, Home, Car } from "lucide-react";
import { adminService } from "@/lib/api";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  type: string;
  status: string;
  price: number | string;
  currency?: string;
  city: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    username?: string;
    profile?: { firstName?: string; lastName?: string };
  };
}

export default function AdminFeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await adminService.getAllListings({ status: "FEATURED", limit: "100" });
        setListings(Array.isArray(data) ? data : data?.listings ?? data?.data ?? []);
      } catch (err: any) {
        console.error("Failed to fetch featured listings:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const filtered = listings.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return l.title?.toLowerCase().includes(q) || l.city?.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Featured Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage listings highlighted on the homepage.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-900 px-4 py-2 rounded-lg text-sm font-semibold">
          <Star className="w-4 h-4" /> {listings.length} Featured
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search featured listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs font-semibold">
                  <th className="p-4 pl-0">Title</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      No featured listings found
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => (
                    <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 pl-0 font-medium">{l.title}</td>
                      <td className="p-4 text-muted-foreground">{l.user?.username ?? l.user?.email ?? "-"}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          {l.type === "PROPERTY" ? <Home className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                          {l.type === "PROPERTY" ? "Property" : "Vehicle"}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{l.city ?? "-"}</td>
                      <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        {l.currency ?? "USD"} {Number(l.price).toLocaleString()}
                      </td>
                      <td className="p-4 pr-0 text-right">
                        <Link
                          href={`/pages/admin/listings/${l.id}`}
                          className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors inline-flex"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
