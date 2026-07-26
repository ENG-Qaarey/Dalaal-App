"use client";

import { useState, useEffect } from "react";
import { reportsService } from "@/lib/api";
import { FileText, Loader2, AlertCircle, Plus, Clock, CheckCircle, Search } from "lucide-react";

const reportTypes = [
  { value: "FRAUD", label: "Fraud" },
  { value: "SPAM", label: "Spam" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
  { value: "MISLEADING_LISTING", label: "Misleading Listing" },
  { value: "HARASSMENT", label: "Harassment" },
  { value: "OTHER", label: "Other" },
];

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  SUBMITTED: { color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400", icon: Clock, label: "Submitted" },
  INVESTIGATING: { color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400", icon: Search, label: "Investigating" },
  RESOLVED: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400", icon: CheckCircle, label: "Resolved" },
  DISMISSED: { color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400", icon: Clock, label: "Dismissed" },
};

export default function BrokerReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form, setForm] = useState({
    type: "FRAUD",
    description: "",
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportsService.getMine();
      setReports(Array.isArray(data) ? data : data?.reports ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async () => {
    if (!form.description.trim()) {
      setSubmitError("Description is required");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError(null);
      await reportsService.submit({
        type: form.type,
        description: form.description.trim(),
      });
      setShowForm(false);
      setForm({ type: "FRAUD", description: "" });
      fetchReports();
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and submit reports for suspicious activity.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-[10px] font-semibold text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Submit Report
        </button>
      </div>

      {/* Submit Report Form */}
      {showForm && (
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg border-b border-border pb-2">New Report</h3>
          {submitError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[10px] text-red-700 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {submitError}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Report Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {reportTypes.map((rt) => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Description *</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the issue in detail..."
                className="w-full p-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-[10px] border text-sm font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Report
            </button>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-card border rounded-[10px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
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
            <button onClick={fetchReports} className="mt-3 text-sm text-blue-600 hover:underline font-semibold">Retry</button>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm font-semibold text-muted-foreground">No reports submitted yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reports.map((report) => {
              const statusInfo = statusConfig[report.status] || statusConfig.SUBMITTED;
              const StatusIcon = statusInfo.icon;
              return (
                <div key={report.id} className="p-4 px-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{report.type?.replace(/_/g, " ")}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Submitted: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "-"}
                      </p>
                    </div>
                  </div>
                  {report.resolution && (
                    <div className="mt-3 p-3 rounded-[10px] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Resolution</p>
                      <p className="text-sm">{report.resolution}</p>
                    </div>
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
