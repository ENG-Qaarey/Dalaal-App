"use client";

import { useEffect, useState } from "react";
import { Bell, Search, PlusCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminService } from "@/lib/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  user?: { email: string; username?: string; profile?: { firstName?: string; lastName?: string } };
}

export default function AdminNotifications() {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await adminService.getNotifications({ limit: "100" });
        const raw = res.data ?? res;
        const list = Array.isArray(raw) ? raw : raw.data ?? raw.notifications ?? [];
        setNotifications(list);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filtered = notifications.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform notifications.</p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Send Notification
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Bell className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">No notifications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs font-semibold">
                  <th className="p-4 pl-0">Title</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Sent At</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-0 font-medium">{n.title}</td>
                    <td className="p-4 text-muted-foreground">{n.message}</td>
                    <td className="p-4 text-muted-foreground">
                      {n.user?.profile?.firstName} {n.user?.profile?.lastName}
                      <span className="ml-1 text-xs opacity-60">({n.user?.email})</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                        {n.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${!n.isRead ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                        {!n.isRead ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {!n.isRead ? "Unread" : "Read"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-0 text-right">
                      <button className="text-blue-600 hover:underline font-semibold text-xs mr-2">View</button>
                      <button className="text-red-600 hover:underline font-semibold text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
