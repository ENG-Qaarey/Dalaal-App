"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { reviewsService } from "@/lib/api";
import {
  Star,
  Loader2,
  AlertCircle,
  User,
  MessageSquare,
  Home,
  ChevronLeft,
  ChevronRight,
  Send,
  ExternalLink,
} from "lucide-react";
import ListingDetailModal from "@/components/listing-detail-modal";

interface Review {
  id: string;
  overallRating: number;
  communicationRating?: number;
  accuracyRating?: number;
  valueRating?: number;
  title?: string;
  comment?: string;
  response?: string;
  respondedAt?: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  reviewer: {
    id: string;
    profile?: { firstName?: string; lastName?: string; avatar?: string };
  };
  listing?: {
    id: string;
    title: string;
    type: string;
    city?: string;
    featuredImage?: string;
  };
}

interface ReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function BrokerReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [respondModal, setRespondModal] = useState<{ open: boolean; review: Review | null }>({ open: false, review: null });
  const [responseText, setResponseText] = useState("");
  const [responding, setResponding] = useState(false);

  const [detailModal, setDetailModal] = useState<{ open: boolean; listingId: string }>({ open: false, listingId: "" });

  const fetchReviews = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const result: ReviewsResponse = await reviewsService.getForUser(user.id, { page, limit: 10 });
      if (result && Array.isArray(result.data)) {
        setReviews(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } else if (Array.isArray(result)) {
        setReviews(result);
        setTotal(result.length);
        setTotalPages(1);
      } else {
        setReviews([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [user?.id, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleRespond() {
    if (!respondModal.review || !responseText.trim() || responding) return;
    setResponding(true);
    try {
      await reviewsService.respond(respondModal.review.id, responseText.trim());
      setReviews((prev) =>
        prev.map((r) =>
          r.id === respondModal.review!.id
            ? { ...r, response: responseText.trim(), respondedAt: new Date().toISOString() }
            : r
        )
      );
      setRespondModal({ open: false, review: null });
      setResponseText("");
    } catch (err: any) {
      alert(err.message || "Failed to send response");
    } finally {
      setResponding(false);
    }
  }

  const avgOverall = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) / reviews.length : 0;
  const avgCommunication = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.communicationRating || 0), 0) / reviews.length : 0;
  const avgAccuracy = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.accuracyRating || 0), 0) / reviews.length : 0;
  const avgValue = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.valueRating || 0), 0) / reviews.length : 0;

  const renderStars = (rating: number, size = "w-4 h-4") => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${size} ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews & Feedback</h1>
          <p className="text-sm text-muted-foreground mt-1">See what customers are saying about your services.</p>
        </div>
        <div className="text-sm text-muted-foreground font-medium">{total} review{total !== 1 ? "s" : ""} total</div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border rounded-[10px] p-5 shadow-sm h-28 animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-[10px] animate-pulse" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-sm text-blue-600 hover:underline font-semibold">Retry</button>
        </div>
      ) : (
        <>
          {/* Rating Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card border rounded-[10px] p-5 shadow-sm text-center space-y-2">
              <div className="text-3xl font-black">{avgOverall.toFixed(1)}</div>
              {renderStars(avgOverall)}
              <div className="text-xs text-muted-foreground">Overall ({reviews.length} on this page)</div>
            </div>
            <div className="bg-card border rounded-[10px] p-5 shadow-sm text-center space-y-2">
              <div className="text-3xl font-black">{avgCommunication.toFixed(1)}</div>
              {renderStars(avgCommunication)}
              <div className="text-xs text-muted-foreground">Communication</div>
            </div>
            <div className="bg-card border rounded-[10px] p-5 shadow-sm text-center space-y-2">
              <div className="text-3xl font-black">{avgAccuracy.toFixed(1)}</div>
              {renderStars(avgAccuracy)}
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="bg-card border rounded-[10px] p-5 shadow-sm text-center space-y-2">
              <div className="text-3xl font-black">{avgValue.toFixed(1)}</div>
              {renderStars(avgValue)}
              <div className="text-xs text-muted-foreground">Value</div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-card border rounded-[10px] p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base">All Reviews</h3>
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm font-semibold text-muted-foreground">No reviews yet</p>
                <p className="text-xs text-muted-foreground mt-1">Reviews from customers will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const reviewerName = review.reviewer?.profile
                    ? [review.reviewer.profile.firstName, review.reviewer.profile.lastName].filter(Boolean).join(" ") || "Customer"
                    : "Customer";

                  return (
                    <div key={review.id} className="p-4 rounded-[10px] border border-border bg-muted/20 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{reviewerName}</div>
                            <div className="text-xs text-muted-foreground">
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                            </div>
                          </div>
                        </div>
                        {renderStars(review.overallRating)}
                      </div>

                      {/* Listing context */}
                      {review.listing && (
                        <button
                          onClick={() => setDetailModal({ open: true, listingId: review.listing!.id })}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-950/40 transition-colors text-left w-full group"
                        >
                          {review.listing.featuredImage ? (
                            <img src={review.listing.featuredImage} alt="" className="w-10 h-10 rounded-md object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-sky-100 dark:bg-sky-900 flex items-center justify-center shrink-0">
                              <Home className="w-5 h-5 text-sky-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-sky-700 dark:text-sky-400 truncate">{review.listing.title}</div>
                            <div className="text-[10px] text-sky-600/70 dark:text-sky-500/70">
                              {review.listing.type} {review.listing.city ? `· ${review.listing.city}` : ""}
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </button>
                      )}

                      {/* Rating breakdown */}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {review.communicationRating && (
                          <span>Communication: <span className="font-semibold text-foreground">{review.communicationRating}/5</span></span>
                        )}
                        {review.accuracyRating && (
                          <span>Accuracy: <span className="font-semibold text-foreground">{review.accuracyRating}/5</span></span>
                        )}
                        {review.valueRating && (
                          <span>Value: <span className="font-semibold text-foreground">{review.valueRating}/5</span></span>
                        )}
                      </div>

                      {/* Review content */}
                      {review.title && <h4 className="font-bold text-sm">{review.title}</h4>}
                      {review.comment && <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>}

                      {/* Verified badge */}
                      {review.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified Review
                        </span>
                      )}

                      {/* Broker response */}
                      {review.response ? (
                        <div className="p-3 rounded-[10px] bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Your Response
                            {review.respondedAt && (
                              <span className="font-normal text-blue-500 dark:text-blue-500 ml-1">
                                · {new Date(review.respondedAt).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                          <p className="text-sm">{review.response}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setRespondModal({ open: true, review });
                            setResponseText("");
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors text-xs font-semibold text-blue-700 dark:text-blue-400"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Respond to this review
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Respond Modal */}
      {respondModal.open && respondModal.review && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) { setRespondModal({ open: false, review: null }); setResponseText(""); } }}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-bold">Respond to Review</h3>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-1">
                {renderStars(respondModal.review.overallRating, "w-3.5 h-3.5")}
                <span className="text-xs text-muted-foreground">
                  by {respondModal.review.reviewer?.profile
                    ? [respondModal.review.reviewer.profile.firstName, respondModal.review.reviewer.profile.lastName].filter(Boolean).join(" ") || "Customer"
                    : "Customer"}
                </span>
              </div>
              {respondModal.review.comment && (
                <p className="text-sm text-muted-foreground mt-1">&ldquo;{respondModal.review.comment}&rdquo;</p>
              )}
            </div>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response..."
              rows={4}
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRespondModal({ open: false, review: null }); setResponseText(""); }}
                className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRespond}
                disabled={!responseText.trim() || responding}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {responding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing Detail Modal */}
      <ListingDetailModal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, listingId: "" })}
        listingId={detailModal.listingId}
      />
    </div>
  );
}
