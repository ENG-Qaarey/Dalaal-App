"use client";

import { useState, useEffect } from "react";
import { UserCheck, MessageSquare, Clock, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const result = await api.get("/admin/contact-messages");
        const list = Array.isArray(result) ? result : result?.messages ?? result?.data ?? [];
        setInquiries(list.slice(0, 20));
      } catch (err: any) {
        setError(err.message || "Failed to load inquiries");
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex flex-col items-center justify-center py-32 gap-3"><AlertCircle className="w-8 h-8 text-red-500" /><p className="text-sm text-muted-foreground">{error}</p></div>;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Inquiries Monitor</h1>
          <p className="text-sm text-muted-foreground mt-1">Oversee communications between customers and verified brokers.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-900 px-4 py-2 rounded-lg text-sm font-semibold">
          <UserCheck className="w-4 h-4" /> Quality Control Active
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">No inquiries found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inquiries.map((inq: any) => (
            <div key={inq.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 hover:border-border/80 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{inq.name || inq.user || "Anonymous"}</h3>
                    <p className="text-xs text-muted-foreground">{inq.email || ""}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${inq.status === "RESOLVED" ? "bg-emerald-100 text-emerald-700" : inq.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                  {inq.status || "New"}
                </span>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground text-xs line-clamp-3">{inq.message || inq.subject || "No message content"}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
