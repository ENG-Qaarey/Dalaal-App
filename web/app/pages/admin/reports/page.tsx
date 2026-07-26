"use client";

import { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle2, XCircle, Clock, Loader2, Download, BarChart2, MessageSquareWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/lib/api";

interface Report {
  id: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  reporter: {
    email: string;
    username: string;
  };
  listing?: {
    id: string;
    title: string;
  };
}

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("SYSTEM"); // "SYSTEM" | "DISPUTES"

  // Disputes state
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // System Stats state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getReports({ limit: "100" });
      const data = res.reports ?? res.data ?? res;
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load reports. Please try again.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchDashboardStats();
  }, []);

  const downloadCSV = () => {
    if (!dashboardData) return;
    const { users = {}, listings = {}, payments = {}, escrow = {} } = dashboardData;
    
    const rows = [
      ["Metric", "Value"],
      ["--- Users ---", ""],
      ["Total Brokers", users.brokers || 0],
      ["Total Property Owners", users.propertyOwners || 0],
      ["Total Vehicle Owners", users.vehicleOwners || 0],
      ["Total Customers", users.customers || 0],
      ["Total Admins", users.superAdmins || 0],
      ["Total Users", (users.brokers || 0) + (users.propertyOwners || 0) + (users.vehicleOwners || 0) + (users.customers || 0) + (users.superAdmins || 0)],
      ["--- Listings ---", ""],
      ["Active Listings", listings.active || 0],
      ["Pending Listings", listings.pending || 0],
      ["Featured Listings", listings.featured || 0],
      ["Total Listings", (listings.active || 0) + (listings.pending || 0) + (listings.featured || 0)],
      ["--- Financials ---", ""],
      ["Total Volume", payments.totalVolume || 0],
      ["Revenue", payments.revenue || 0],
      ["Active Escrow", escrow.activeAmount || 0],
      ["Total Escrow Transactions", escrow.totalTransactions || 0],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dalaal_system_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateReportStatus = async (id: string, status: string, resolution?: string) => {
    try {
      setUpdatingId(id);
      await adminService.updateReportStatus(id, status, resolution);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Failed to update report status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getReporterName = (reporter: any) => {
    if (!reporter) return "Unknown User";
    if (reporter.profile?.firstName) {
      return `${reporter.profile.firstName} ${reporter.profile.lastName || ""}`.trim();
    }
    return reporter.username || reporter.email?.split("@")[0] || "User";
  };

  const filtered = reports.filter((r) => {
    const reporterName = getReporterName(r.reporter);
    const matchesSearch =
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      reporterName.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter.email.toLowerCase().includes(search.toLowerCase()) ||
      r.listing?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesType = typeFilter === "ALL" || r.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "DISMISSED":
      case "CLOSED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "INVESTIGATING":
      case "IN_PROGRESS":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "success";
      case "DISMISSED":
      case "CLOSED":
        return "destructive";
      case "INVESTIGATING":
      case "IN_PROGRESS":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Download system reports and resolve user disputes
          </p>
        </div>
        {activeTab === "SYSTEM" && (
          <Button onClick={downloadCSV} disabled={loadingStats || !dashboardData}>
            <Download className="w-4 h-4 mr-2" />
            Export System Report (CSV)
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("SYSTEM")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "SYSTEM"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          <BarChart2 className="w-4 h-4" /> System Reports
        </button>
        <button
          onClick={() => setActiveTab("DISPUTES")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "DISPUTES"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          <MessageSquareWarning className="w-4 h-4" /> User Disputes
        </button>
      </div>

      {activeTab === "SYSTEM" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {loadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Brokers</span>
                      <span className="font-bold">{dashboardData?.users?.brokers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Customers</span>
                      <span className="font-bold">{dashboardData?.users?.customers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Property Owners</span>
                      <span className="font-bold">{dashboardData?.users?.propertyOwners || 0}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Vehicle Owners</span>
                      <span className="font-bold">{dashboardData?.users?.vehicleOwners || 0}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-semibold">Total Users</span>
                      <span className="font-black text-blue-600">
                        {(dashboardData?.users?.brokers || 0) + (dashboardData?.users?.customers || 0) + (dashboardData?.users?.propertyOwners || 0) + (dashboardData?.users?.vehicleOwners || 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Listing Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Active Listings</span>
                      <span className="font-bold text-emerald-600">{dashboardData?.listings?.active || 0}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Pending Review</span>
                      <span className="font-bold text-amber-600">{dashboardData?.listings?.pending || 0}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Featured</span>
                      <span className="font-bold text-blue-600">{dashboardData?.listings?.featured || 0}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-semibold">Total Listings</span>
                      <span className="font-black">
                        {(dashboardData?.listings?.active || 0) + (dashboardData?.listings?.pending || 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Total Volume</span>
                      <span className="font-bold">${dashboardData?.payments?.totalVolume?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-bold text-emerald-600">${dashboardData?.payments?.revenue?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-muted-foreground">Active Escrow</span>
                      <span className="font-bold text-blue-600">${dashboardData?.escrow?.activeAmount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-muted-foreground">Escrow Transactions</span>
                      <span className="font-bold">{dashboardData?.escrow?.totalTransactions || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{reports.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {reports.filter(r => r.status === "SUBMITTED" || r.status === "OPEN" || r.status === "PENDING").length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Investigating</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {reports.filter(r => r.status === "INVESTIGATING" || r.status === "IN_PROGRESS").length}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {reports.filter(r => r.status === "RESOLVED").length}
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
            placeholder="Search reports..."
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
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="INVESTIGATING">Investigating</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="DISMISSED">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="LISTING">Listing</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="PAYMENT">Payment</SelectItem>
            <SelectItem value="ESCROW">Escrow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Table */}
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
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={fetchReports}>
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No reports found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                  <th className="p-4 pl-0">Report</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{r.description}</div>
                          {r.listing && (
                            <div className="text-xs text-muted-foreground">Listing: {r.listing.title}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{getReporterName(r.reporter)}</div>
                        <div className="text-xs text-muted-foreground">{r.reporter.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{r.type}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(r.status)}
                        <Badge variant={getStatusVariant(r.status)}>
                          {r.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4 pr-0 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(r.status === "SUBMITTED" || r.status === "OPEN" || r.status === "PENDING") && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={updatingId === r.id}
                              onClick={() => updateReportStatus(r.id, "INVESTIGATING")}
                            >
                              {updatingId === r.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Investigate"
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald-600 hover:text-emerald-700 font-semibold"
                              disabled={updatingId === r.id}
                              onClick={() => updateReportStatus(r.id, "RESOLVED")}
                            >
                              Resolve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive font-semibold"
                              disabled={updatingId === r.id}
                              onClick={() => updateReportStatus(r.id, "DISMISSED")}
                            >
                              Dismiss
                            </Button>
                          </>
                        )}
                        {(r.status === "INVESTIGATING" || r.status === "IN_PROGRESS") && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald-600 hover:text-emerald-700 font-semibold"
                              disabled={updatingId === r.id}
                              onClick={() => updateReportStatus(r.id, "RESOLVED")}
                            >
                              Resolve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive font-semibold"
                              disabled={updatingId === r.id}
                              onClick={() => updateReportStatus(r.id, "DISMISSED")}
                            >
                              Dismiss
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
}
