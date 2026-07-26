"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { verificationService } from "@/lib/api";
import { BadgeCheck, Loader2, AlertCircle, CheckCircle, XCircle, Clock, Upload, FileText } from "lucide-react";

const documentTypes = [
  { value: "NATIONAL_ID", label: "National ID" },
  { value: "PASSPORT", label: "Passport" },
  { value: "BUSINESS_LICENSE", label: "Business License" },
  { value: "DRIVERS_LICENSE", label: "Driver's License" },
];

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  PENDING: { color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400", icon: Clock, label: "Pending Review" },
  APPROVED: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400", icon: CheckCircle, label: "Approved" },
  REJECTED: { color: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400", icon: XCircle, label: "Rejected" },
  EXPIRED: { color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400", icon: Clock, label: "Expired" },
};

export default function BrokerVerification() {
  const { user } = useAuth();
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [form, setForm] = useState({
    documentType: "NATIONAL_ID",
    documentNumber: "",
    frontImageUrl: "",
    selfieImageUrl: "",
  });

  useEffect(() => {
    async function fetchVerification() {
      try {
        setLoading(true);
        const data = await verificationService.getMy();
        setVerification(data);
      } catch (err: any) {
        if (err?.response?.status !== 404) {
          setError(err.message || "Failed to load verification status");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchVerification();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "frontImageUrl" | "selfieImageUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api"}/uploads/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        body: formData,
      });
      const data = await result.json();
      const url = data?.data?.url || data?.data?.secureUrl || data?.url || "";
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch {
      alert("Failed to upload image");
    }
  };

  const handleSubmit = async () => {
    if (!form.documentNumber.trim()) {
      setSubmitError("Document number is required");
      return;
    }
    if (!form.frontImageUrl) {
      setSubmitError("Document front image is required");
      return;
    }
    if (!form.selfieImageUrl) {
      setSubmitError("Selfie image is required");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError(null);
      await verificationService.submit({
        documentType: form.documentType,
        documentNumber: form.documentNumber.trim(),
        frontImageUrl: form.frontImageUrl,
        selfieImageUrl: form.selfieImageUrl,
      });
      setSubmitSuccess(true);
      const data = await verificationService.getMy();
      setVerification(data);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit verification");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="bg-card border rounded-[10px] p-6 shadow-sm h-64 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="font-bold text-lg">Error</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const statusInfo = verification ? statusConfig[verification.status] : null;
  const StatusIcon = statusInfo?.icon || Clock;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Identity Verification</h1>
          <p className="text-sm text-muted-foreground mt-1">Verify your identity to build trust with customers.</p>
        </div>
      </div>

      {/* Current Status */}
      {verification && (
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-[10px] ${statusInfo?.color || "bg-muted"}`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{statusInfo?.label || verification.status}</h3>
              <p className="text-sm text-muted-foreground">
                Document: {verification.documentType?.replace(/_/g, " ")} •
                Submitted: {verification.createdAt ? new Date(verification.createdAt).toLocaleDateString() : "-"}
              </p>
            </div>
          </div>
          {verification.status === "REJECTED" && verification.rejectionReason && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[10px]">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Rejection Reason</p>
              <p className="text-sm text-red-600 dark:text-red-300">{verification.rejectionReason}</p>
            </div>
          )}
        </div>
      )}

      {/* Submission Form */}
      {(!verification || verification.status === "REJECTED" || verification.status === "EXPIRED") && (
        <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-6">
          <h3 className="font-semibold text-lg border-b border-border pb-2">
            {verification?.status === "REJECTED" ? "Resubmit Verification" : "Submit Verification Documents"}
          </h3>

          {submitSuccess && verification?.status === "APPROVED" && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[10px] text-emerald-700 dark:text-emerald-400 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" />
              Your identity has been verified successfully!
            </div>
          )}

          {submitError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[10px] text-red-700 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {submitError}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Document Type *</label>
              <select
                value={form.documentType}
                onChange={(e) => setForm((prev) => ({ ...prev, documentType: e.target.value }))}
                className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {documentTypes.map((dt) => (
                  <option key={dt.value} value={dt.value}>{dt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Document Number *</label>
              <input
                type="text"
                value={form.documentNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, documentNumber: e.target.value }))}
                placeholder="Enter your document number"
                className="w-full h-10 px-4 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Document Front Image *</label>
                <label className="block border-2 border-dashed border-border rounded-[10px] p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "frontImageUrl")} />
                  {form.frontImageUrl ? (
                    <div className="space-y-2">
                      <img src={form.frontImageUrl} alt="Document" className="h-24 mx-auto rounded-[10px] object-cover" />
                      <p className="text-xs text-emerald-600 font-semibold">Uploaded</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs font-semibold">Upload front of document</p>
                      <p className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Selfie Image *</label>
                <label className="block border-2 border-dashed border-border rounded-[10px] p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "selfieImageUrl")} />
                  {form.selfieImageUrl ? (
                    <div className="space-y-2">
                      <img src={form.selfieImageUrl} alt="Selfie" className="h-24 mx-auto rounded-[10px] object-cover" />
                      <p className="text-xs text-emerald-600 font-semibold">Uploaded</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs font-semibold">Upload selfie with document</p>
                      <p className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-[10px] font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
              Submit for Review
            </button>
          </div>
        </div>
      )}

      {/* Pending state */}
      {verification?.status === "PENDING" && (
        <div className="bg-card border rounded-[10px] p-6 shadow-sm text-center py-12 space-y-4">
          <Clock className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-bold text-lg">Verification Under Review</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your identity documents have been submitted and are being reviewed by our team. This usually takes 1-2 business days.
          </p>
        </div>
      )}
    </div>
  );
}
