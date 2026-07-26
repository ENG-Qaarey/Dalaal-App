"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminCategories() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const [propsResult, vehiclesResult] = await Promise.all([
          api.get("/admin/properties"),
          api.get("/admin/vehicles"),
        ]);
        const props = Array.isArray(propsResult) ? propsResult : propsResult?.properties ?? propsResult?.data ?? [];
        const vehicles = Array.isArray(vehiclesResult) ? vehiclesResult : vehiclesResult?.vehicles ?? vehiclesResult?.data ?? [];

        const catMap = new Map<string, any>();
        props.forEach((p: any) => {
          const type = p.propertyType || p.type || "Other Property";
          if (!catMap.has(`prop-${type}`)) catMap.set(`prop-${type}`, { id: `prop-${type}`, name: type, type: "Property", count: 0 });
          catMap.get(`prop-${type}`).count++;
        });
        vehicles.forEach((v: any) => {
          const type = v.vehicleType || v.type || "Other Vehicle";
          if (!catMap.has(`veh-${type}`)) catMap.set(`veh-${type}`, { id: `veh-${type}`, name: type, type: "Vehicle", count: 0 });
          catMap.get(`veh-${type}`).count++;
        });
        setCategories(Array.from(catMap.values()));
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

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Property & Vehicle Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all categories across the Dalaal platform.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-lg">Active Categories</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs font-semibold">
                <th className="p-4 pl-0">Category Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Active Listings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center text-sm text-muted-foreground">No categories found</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-0 font-medium">{c.name}</td>
                    <td className="p-4 text-muted-foreground">{c.type}</td>
                    <td className="p-4 font-medium">{c.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
