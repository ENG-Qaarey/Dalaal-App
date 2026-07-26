"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  _count?: { listings?: number };
}

export default function VehicleCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await api.get("/admin/vehicles");
        const list = Array.isArray(result) ? result : result?.vehicles ?? result?.data ?? [];
        const categoryMap = new Map<string, Category>();
        list.forEach((v: any) => {
          const type = v.vehicleType || v.type || "Other";
          if (!categoryMap.has(type)) {
            categoryMap.set(type, { id: type, name: type, slug: type.toLowerCase().replace(/\s+/g, "-"), _count: { listings: 0 } });
          }
          categoryMap.get(type)!._count!.listings = (categoryMap.get(type)!._count!.listings || 0) + 1;
        });
        setCategories(Array.from(categoryMap.values()));
      } catch (err: any) {
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage the types of vehicles available on the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="rounded-xl border bg-white dark:bg-zinc-950 shadow-sm p-5 flex flex-col gap-3">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{cat.name}</p>
              {cat.slug && <p className="text-xs text-muted-foreground">/{cat.slug}</p>}
            </div>
            {cat.description && <p className="text-xs text-muted-foreground">{cat.description}</p>}
            <div className="text-sky-600 text-sm font-semibold">
              {cat._count?.listings ?? 0} listings
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
