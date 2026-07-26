"use client";

import { useState, useEffect } from "react";
import { Activity, Clock3, Filter, Search, ShieldCheck, Loader2 } from "lucide-react";
import { adminService } from "@/lib/api";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userEmail: string;
  userName?: string;
  changes?: string;
  createdAt: string;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
}

function getActionLabel(action: string) {
  switch (action) {
    case "CREATE":
      return "Created";
    case "UPDATE":
      return "Updated";
    case "DELETE":
      return "Deleted";
    case "LOGIN":
      return "Login";
    case "VERIFY":
      return "Verified";
    default:
      return action;
  }
}

function getActionColor(action: string) {
  switch (action) {
    case "CREATE":
      return "text-emerald-600";
    case "UPDATE":
      return "text-blue-600";
    case "DELETE":
      return "text-red-600";
    case "LOGIN":
      return "text-amber-600";
    default:
      return "text-muted-foreground";
  }
}

export default function AdminActivityPage() {
  const [activity, setActivity] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAuditLogs({ limit: "20" });
      const data = response.data ?? response;
      const logsData = Array.isArray(data) ? data : data.logs ?? data.data ?? [];
      setActivity(logsData);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
      setError("Failed to load activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Activity</h1>
          <p className="text-sm text-muted-foreground">
            Track actions, alerts, and recent moderation events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            Search activity
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filter
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <Activity className="h-4 w-4" />
            Live Operations
          </div>
          <p className="mt-3 text-3xl font-bold">{activity.length}</p>
          <p className="text-sm text-muted-foreground">
            events tracked
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
            <ShieldCheck className="h-4 w-4" />
            Unique Users
          </div>
          <p className="mt-3 text-3xl font-bold">
            {new Set(activity.map((a) => a.userEmail)).size}
          </p>
          <p className="text-sm text-muted-foreground">active in logs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-600">
            <Clock3 className="h-4 w-4" />
            Last Event
          </div>
          <p className="mt-3 text-3xl font-bold">
            {activity.length > 0 ? formatDate(activity[0].createdAt) : "N/A"}
          </p>
          <p className="text-sm text-muted-foreground">system heartbeat</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3 text-sm font-semibold">
          Recent activity
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              <p className="text-sm">Loading activity...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <button
                onClick={fetchActivity}
                className="text-sm text-primary underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 opacity-50 mb-3" />
              <p className="text-sm font-medium">No activity yet</p>
              <p className="text-xs mt-1">
                System events will appear here once they are recorded.
              </p>
            </div>
          ) : (
            activity.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 px-4 py-4"
              >
                <div>
                  <p className="font-semibold">
                    {getActionLabel(item.action)} {item.entity}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.userName || item.userEmail}
                    {item.changes ? ` — ${item.changes}` : ""}
                  </p>
                </div>
                <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                  <div className={getActionColor(item.action)}>
                    {item.action}
                  </div>
                  <div>{formatDate(item.createdAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
