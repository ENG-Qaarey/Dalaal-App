"use client";

import { Calendar, Clock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

interface Conversation {
  id: string;
  title?: string;
  createdAt: string;
  lastMessageAt?: string;
  participants: {
    user: { id: string; profile?: { firstName?: string; lastName?: string; fullName?: string } };
  }[];
  listing?: { id: string; title: string; type: string; city: string };
}

export default function CustomerBookings() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/chat/conversations");
      setConversations(Array.isArray(data) ? data : data?.conversations ?? data?.data ?? []);
    } catch (err: any) {
      setError(err?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Viewing Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your scheduled property and vehicle viewings.</p>
        </div>
      </div>

      {loading && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="border border-border rounded-lg p-5 animate-pulse">
              <div className="h-5 bg-muted rounded w-1/3 mb-3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={fetchConversations} className="mt-3 text-sm text-blue-600 hover:underline font-semibold">Retry</button>
        </div>
      )}

      {!loading && !error && conversations.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 shadow-sm text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground mb-1">No Appointments Yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Start a conversation with a broker from any listing to schedule a property or vehicle viewing appointment.
          </p>
          <Link
            href="/pages/customer/search"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      )}

      {!loading && !error && conversations.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            {conversations.map((conv) => {
              const broker = conv.participants?.find((p) => p.user.id !== user?.id)?.user;
              const brokerName = broker?.profile?.fullName || `${broker?.profile?.firstName || ""} ${broker?.profile?.lastName || ""}`.trim() || "Broker";

              return (
                <div key={conv.id} className="border border-border rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-border/80 transition-colors">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{conv.listing?.title || conv.title || "Conversation"}</h3>
                    <p className="text-sm text-muted-foreground">Broker: {brokerName}</p>
                    <div className="flex items-center gap-4 text-xs font-semibold pt-2 text-foreground">
                      <span className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(conv.createdAt).toLocaleDateString()}
                      </span>
                      {conv.lastMessageAt && (
                        <span className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5" /> Last active {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/pages/customer/messages`}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Open Chat
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
