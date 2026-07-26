"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { agentsService, chatService } from "@/lib/api";
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function BrokerClients() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true);
        setError(null);
        const data = await agentsService.getLeads();
        setLeads(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to load leads");
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const handleStartConversation = async (participantId: string) => {
    try {
      await chatService.createConversation({ participantId });
      window.location.href = "/pages/broker/messages";
    } catch (err: any) {
      alert(err.message || "Failed to start conversation");
    }
  };

  const filtered = leads.filter((l) => {
    const matchesSearch =
      !search || l.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      l.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Leads & Clients
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage inquiries and prospective buyers for your listings.
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "New", "Contacted"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-colors ${
              statusFilter === status
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {status === "ALL" ? "All Leads" : status}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-[10px] p-6 shadow-sm space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-muted rounded-[10px] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-blue-600 hover:underline font-semibold"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm font-semibold text-muted-foreground">
              {leads.length === 0
                ? "No leads yet. They will appear when customers inquire about your listings."
                : "No leads match your search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs font-semibold">
                  <th className="p-4 pl-0">Client Name</th>
                  <th className="p-4">Interested In</th>
                  <th className="p-4">Lead Status</th>
                  <th className="p-4">Time</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lead, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-0">
                      <div className="font-medium text-foreground">
                        {lead.name}
                      </div>
                    </td>
                    <td className="p-4 text-blue-600 font-medium">
                      {lead.property || lead.listingTitle || "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          lead.status === "New"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {lead.time || lead.createdAt || "-"}
                    </td>
                    <td className="p-4 pr-0 text-right">
                      <button
                        onClick={() =>
                          lead.participantId &&
                          handleStartConversation(lead.participantId)
                        }
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold text-xs"
                      >
                        <MessageSquare className="w-3 h-3" /> Message
                      </button>
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
