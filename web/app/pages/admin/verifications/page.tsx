"use client";

import { useState, useEffect } from "react";
import { Search, ShieldCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { adminService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Verification {
  id: string;
  type: string;
  status: string;
  submittedAt: string;
  user: {
    id: string;
    email: string;
    role: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
      phoneNumber?: string;
    };
  };
  documents?: string[];
}

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getPendingVerifications();
      const items: Verification[] = Array.isArray(response)
        ? response
        : Array.isArray(response?.verifications)
          ? response.verifications
          : Array.isArray(response?.data)
            ? response.data
            : [];

      setVerifications(items);
      setStats({
        total: items.length,
        pending: items.filter((v) => v.status === "PENDING").length,
        approved: items.filter((v) => v.status === "APPROVED").length,
        rejected: items.filter((v) => v.status === "REJECTED").length,
      });
    } catch (err) {
      console.error("Failed to fetch verifications:", err);
      setError("Failed to load verifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminService.updateVerificationStatus(id, "APPROVED");
      setVerifications((prev) => {
        const next = prev.filter((v) => v.id !== id);
        setStats({
          total: next.length,
          pending: next.filter((v) => v.status === "PENDING").length,
          approved: next.filter((v) => v.status === "APPROVED").length,
          rejected: next.filter((v) => v.status === "REJECTED").length,
        });
        return next;
      });
    } catch (err) {
      console.error("Failed to approve verification:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.updateVerificationStatus(id, "REJECTED");
      setVerifications((prev) => {
        const next = prev.filter((v) => v.id !== id);
        setStats({
          total: next.length,
          pending: next.filter((v) => v.status === "PENDING").length,
          approved: next.filter((v) => v.status === "APPROVED").length,
          rejected: next.filter((v) => v.status === "REJECTED").length,
        });
        return next;
      });
    } catch (err) {
      console.error("Failed to reject verification:", err);
    }
  };

  const filtered = verifications.filter((v) => {
    const userName = `${v.user.profile?.firstName || ""} ${v.user.profile?.lastName || ""}`.trim();
    const matchesSearch = userName.toLowerCase().includes(search.toLowerCase()) || v.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || v.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-zinc-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "destructive";
      case "PENDING":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Identity Verifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and approve user identity verification requests
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm">
          {error}
          <Button variant="ghost" size="sm" className="ml-2" onClick={fetchVerifications}>
            Retry
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.approved}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user name or email..."
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
            <SelectItem value="IDENTITY">Identity</SelectItem>
            <SelectItem value="ADDRESS">Address</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Verifications Table */}
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
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ShieldCheck className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No verifications found</p>
            <p className="text-xs mt-1">
              {search || typeFilter !== "ALL" || statusFilter !== "ALL"
                ? "Try adjusting your filters"
                : "All verification requests have been processed"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 pl-0">User</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((v) => {
                  const userName = `${v.user.profile?.firstName || ""} ${v.user.profile?.lastName || ""}`.trim() || "Unknown User";
                  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                  return (
                    <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 pl-0">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={v.user.profile?.avatar} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-foreground">{userName}</div>
                            <div className="text-xs text-muted-foreground">{v.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{v.type}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{new Date(v.submittedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(v.status)}
                          <Badge variant={getStatusVariant(v.status)}>
                            {v.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 pr-0 text-right">
                        <div className="flex justify-end gap-2">
                          {v.status === "PENDING" && (
                            <>
                              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-600 hover:bg-emerald-500/10" onClick={() => handleApprove(v.id)}>
                                Approve
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleReject(v.id)}>
                                Reject
                              </Button>
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
