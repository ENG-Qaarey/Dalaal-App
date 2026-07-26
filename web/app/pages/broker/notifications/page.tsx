"use client";

import { useState, useEffect } from "react";
import { notificationsService } from "@/lib/api";
import { Bell, CheckCheck, Loader2, AlertCircle, BellOff, MessageSquare, Star, CreditCard, Shield, Megaphone } from "lucide-react";

const typeIcons: Record<string, any> = {
  NEW_LISTING: Star,
  PRICE_DROP: CreditCard,
  NEW_MESSAGE: MessageSquare,
  LISTING_VERIFIED: Shield,
  PAYMENT_RECEIVED: CreditCard,
  ESCROW_RELEASED: CreditCard,
  REVIEW_RECEIVED: Star,
  ACCOUNT_VERIFIED: Shield,
  WELCOME: Bell,
  SYSTEM_ANNOUNCEMENT: Megaphone,
};

const typeColors: Record<string, string> = {
  NEW_LISTING: "bg-blue-100 text-blue-600 dark:bg-blue-950/40",
  PRICE_DROP: "bg-amber-100 text-amber-600 dark:bg-amber-950/40",
  NEW_MESSAGE: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40",
  LISTING_VERIFIED: "bg-blue-100 text-blue-600 dark:bg-blue-950/40",
  PAYMENT_RECEIVED: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40",
  ESCROW_RELEASED: "bg-violet-100 text-violet-600 dark:bg-violet-950/40",
  REVIEW_RECEIVED: "bg-amber-100 text-amber-600 dark:bg-amber-950/40",
  ACCOUNT_VERIFIED: "bg-blue-100 text-blue-600 dark:bg-blue-950/40",
  WELCOME: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800",
  SYSTEM_ANNOUNCEMENT: "bg-rose-100 text-rose-600 dark:bg-rose-950/40",
};

export default function BrokerNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, countData] = await Promise.all([
        notificationsService.getAll(),
        notificationsService.getUnreadCount(),
      ]);
      setNotifications(Array.isArray(data) ? data : data?.notifications ?? []);
      setUnreadCount(countData?.count ?? countData ?? 0);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsService.markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await notificationsService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch {} finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated on your listings, messages, and account.
            {unreadCount > 0 && <span className="ml-2 text-blue-600 font-semibold">{unreadCount} unread</span>}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 px-4 py-2 rounded-[10px] border text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-50"
          >
            {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            Mark All Read
          </button>
        )}
      </div>

      <div className="bg-card border rounded-[10px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 border-b border-border animate-pulse flex items-center gap-4 px-6">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-3 w-72 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-sm font-semibold">{error}</p>
            <button onClick={fetchNotifications} className="mt-3 text-sm text-blue-600 hover:underline font-semibold">Retry</button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm font-semibold text-muted-foreground">You're all caught up.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              const colorClass = typeColors[notif.type] || "bg-zinc-100 text-zinc-600 dark:bg-zinc-800";
              return (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                  className={`flex items-start gap-4 p-4 px-6 hover:bg-muted/30 transition-colors cursor-pointer ${
                    !notif.isRead ? "bg-blue-50/50 dark:bg-blue-950/10" : ""
                  }`}
                >
                  <div className={`p-2.5 rounded-[10px] shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{notif.title}</h4>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                  {notif.actionUrl && (
                    <a href={notif.actionUrl} className="text-xs text-blue-600 hover:underline font-semibold shrink-0">
                      View
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
