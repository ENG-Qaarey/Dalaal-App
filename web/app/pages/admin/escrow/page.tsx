"use client";

import { useState, useEffect } from "react";
import { Search, Shield, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { adminService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Escrow {
  id: string;
  amount: number;
  currency: string;
  status: string;
  listing: {
    id: string;
    title: string;
  };
  buyer: {
    id: string;
    email: string;
    profile?: { firstName?: string; lastName?: string };
  };
  seller: {
    id: string;
    email: string;
    profile?: { firstName?: string; lastName?: string };
  };
  createdAt: string;
  releasedAt?: string;
}

export default function AdminEscrow() {
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchEscrows = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getEscrow({ limit: "100" });
      const raw = res as any;
      const data: Escrow[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.escrows)
          ? raw.escrows
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
      setEscrows(data);
    } catch (err) {
      console.error("Failed to fetch escrows:", err);
      setError("Failed to load escrow transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrows();
  }, []);

  const filtered = escrows.filter((e) => {
    const matchesSearch = e.listing.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RELEASED":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "DISPUTED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "HELD":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-zinc-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "RELEASED":
        return "success";
      case "DISPUTED":
        return "destructive";
      case "HELD":
        return "warning";
      default:
        return "secondary";
    }
  };

  const totalHeld = escrows.filter(e => e.status === "HELD").reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Escrow Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all escrow transactions on the platform
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Held</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${totalHeld.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Held</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {escrows.filter(e => e.status === "HELD").length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Released</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {escrows.filter(e => e.status === "RELEASED").length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disputed</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {escrows.filter(e => e.status === "DISPUTED").length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by listing title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="HELD">Held</SelectItem>
            <SelectItem value="RELEASED">Released</SelectItem>
            <SelectItem value="DISPUTED">Disputed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Escrows Table */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchEscrows} className="mt-2">
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">
              {escrows.length === 0 ? "No escrow transactions found." : "No results match your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 pl-0">Transaction</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((e) => {
                  const buyerName = `${e.buyer.profile?.firstName || ""} ${e.buyer.profile?.lastName || ""}`.trim() || "Unknown";
                  const sellerName = `${e.seller.profile?.firstName || ""} ${e.seller.profile?.lastName || ""}`.trim() || "Unknown";
                  return (
                    <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 pl-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Shield className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{e.listing.title}</div>
                            <div className="text-xs text-muted-foreground">ID: {e.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{buyerName}</div>
                          <div className="text-xs text-muted-foreground">{e.buyer.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{sellerName}</div>
                          <div className="text-xs text-muted-foreground">{e.seller.email}</div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">{e.currency} {e.amount.toLocaleString()}</td>
                      <td className="p-4 text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(e.status)}
                          <Badge variant={getStatusVariant(e.status)}>
                            {e.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 pr-0 text-right">
                        <Button variant="ghost" size="sm">View</Button>
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
