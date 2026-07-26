"use client";

import { useState, useEffect } from "react";
import { Search, CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react";
import { adminService, paymentsService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  type: string;
  createdAt: string;
  user: {
    email: string;
    username?: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getPayments({ limit: "100" });
      const raw = res.data ?? res;
      const list = Array.isArray(raw) ? raw : raw.payments ?? raw.data ?? [];
      setPayments(list);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setError("Failed to load payments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const userName = `${p.user.profile?.firstName || ""} ${p.user.profile?.lastName || ""}`.trim();
    const matchesSearch =
      userName.toLowerCase().includes(search.toLowerCase()) ||
      p.user.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.provider?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "FAILED":
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "PENDING":
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-zinc-500" />;
    }
  };

  const getStatusVariant = (status: string): "success" | "destructive" | "warning" | "secondary" => {
    switch (status) {
      case "COMPLETED":
      case "completed":
        return "success";
      case "FAILED":
      case "failed":
        return "destructive";
      case "PENDING":
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const normalizeStatus = (status: string) => status.toUpperCase();

  const totalAmount = payments
    .filter((p) => normalizeStatus(p.status) === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);
  const completedCount = payments.filter((p) => normalizeStatus(p.status) === "COMPLETED").length;
  const pendingCount = payments.filter((p) => normalizeStatus(p.status) === "PENDING").length;
  const failedCount = payments.filter((p) => normalizeStatus(p.status) === "FAILED").length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all payment transactions on the platform
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm">
          {error}
          <Button variant="ghost" size="sm" className="ml-2 h-auto p-0 text-destructive underline" onClick={fetchPayments}>
            Retry
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {completedCount}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {pendingCount}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {failedCount}
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
            placeholder="Search by user, email, or provider..."
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
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
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
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CreditCard className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No payments found</p>
            <p className="text-sm mt-1">
              {payments.length === 0 ? "No transactions have been recorded yet." : "No results match your search or filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 pl-0">Transaction</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => {
                  const userName =
                    `${p.user.profile?.firstName || ""} ${p.user.profile?.lastName || ""}`.trim() ||
                    p.user.username ||
                    p.user.email;
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 pl-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{p.type || "Payment"}</div>
                            <div className="text-xs text-muted-foreground">ID: {p.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{userName}</div>
                          <div className="text-xs text-muted-foreground">{p.user.email}</div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{p.provider}</td>
                      <td className="p-4 font-semibold">{p.currency} {p.amount.toLocaleString()}</td>
                      <td className="p-4 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(p.status)}
                          <Badge variant={getStatusVariant(p.status)}>
                            {normalizeStatus(p.status)}
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
