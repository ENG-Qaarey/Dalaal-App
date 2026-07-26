"use client";

import { useState, useEffect } from "react";
import { Search, Building2, Car } from "lucide-react";
import { listingsService, adminService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Listing {
  id: string;
  title: string;
  type: string;
  category: string;
  status: string;
  price: number;
  city: string;
  createdAt: string;
  seller: {
    id: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
  };
}

export default function AdminListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, sold: 0 });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params: any = { limit: "100" };
      if (typeFilter !== "ALL") params.type = typeFilter;
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (search) params.q = search;
      const data = await adminService.getAllListings(params);
      const items = Array.isArray(data) ? data : data?.listings ?? data?.data ?? [];
      setListings(items);
      setStats({
        total: items.length,
        active: items.filter((l: any) => l.status === "ACTIVE").length,
        pending: items.filter((l: any) => l.status === "PENDING_REVIEW").length,
        sold: items.filter((l: any) => l.status === "SOLD").length,
      });
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [typeFilter, statusFilter]);

  const filtered = listings.filter((l: any) => {
    const matchesSearch = l.title?.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || l.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "PENDING":
        return "warning";
      case "SOLD":
        return "secondary";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and manage all property and vehicle listings on the platform
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.active}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sold</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.sold}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search listings by title or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="PROPERTY">Property</SelectItem>
            <SelectItem value="VEHICLE">Vehicle</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="SOLD">Sold</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings Table */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 pl-0">Listing</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((l: any) => {
                  const owner = l.seller || l.user || {};
                  const ownerName = owner.profile
                    ? `${owner.profile.firstName || ""} ${owner.profile.lastName || ""}`.trim()
                    : owner.username || owner.email || "Unknown";
                  const initials = ownerName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 pl-0">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            {l.type === "PROPERTY" ? <Building2 className="h-6 w-6" /> : <Car className="h-6 w-6" />}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{l.title}</div>
                            <div className="text-xs text-muted-foreground">{l.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={owner.profile?.avatar} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{ownerName}</div>
                            <div className="text-xs text-muted-foreground">{owner.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={l.type === "PROPERTY" ? "secondary" : "outline"}>
                          {l.type}
                        </Badge>
                      </td>
                      <td className="p-4 font-semibold">
                        ${Number(l.price).toLocaleString()}
                      </td>
                      <td className="p-4 text-muted-foreground">{l.city}</td>
                      <td className="p-4">
                        <Badge variant={getStatusColor(l.status)}>
                          {l.status?.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-4 pr-0 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          {l.status === "PENDING_REVIEW" && (
                            <>
                              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10">Approve</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Reject</Button>
                            </>
                          )}
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
    </div>
  );
}
