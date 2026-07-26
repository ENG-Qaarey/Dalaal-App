"use client";

import { useState, useEffect } from "react";
import { Search, Activity, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/lib/api";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  userEmail: string;
  userName?: string;
  changes?: string;
  ipAddress?: string;
  createdAt: string;
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAuditLogs({ limit: "100" });
      const data = response.data ?? response;
      const logsData = Array.isArray(data) ? data : data.logs ?? data.data ?? [];
      setLogs(logsData);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setError("Failed to load audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      (l.userEmail || "").toLowerCase().includes(searchText) ||
      (l.userName || "").toLowerCase().includes(searchText) ||
      (l.action || "").toLowerCase().includes(searchText) ||
      (l.entity || "").toLowerCase().includes(searchText) ||
      (l.changes || "").toLowerCase().includes(searchText);
    const matchesAction = actionFilter === "ALL" || l.action === actionFilter;
    const matchesEntity = entityFilter === "ALL" || l.entity === entityFilter;
    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionVariant = (action: string) => {
    switch (action) {
      case "CREATE":
        return "success";
      case "UPDATE":
        return "warning";
      case "DELETE":
        return "destructive";
      case "LOGIN":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View all system activity and changes
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            <SelectItem value="CREATE">Create</SelectItem>
            <SelectItem value="UPDATE">Update</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
            <SelectItem value="LOGIN">Login</SelectItem>
          </SelectContent>
        </Select>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Entities</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="LISTING">Listing</SelectItem>
            <SelectItem value="PAYMENT">Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-destructive">
          <p>{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={fetchLogs}>
            Retry
          </Button>
        </div>
      )}

      {/* Logs List */}
      {!error && (
        <div className="space-y-3">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No audit logs found</p>
              <p className="text-sm mt-1">
                {logs.length === 0
                  ? "There are no audit logs yet."
                  : "No logs match your current filters."}
              </p>
            </div>
          ) : (
            filtered.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
                          <Badge variant="outline">{log.entity}</Badge>
                          <span className="text-sm font-medium">{log.userName || log.userEmail}</span>
                        </div>
                        {log.changes && <p className="text-sm text-muted-foreground">{log.changes}</p>}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                          {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
