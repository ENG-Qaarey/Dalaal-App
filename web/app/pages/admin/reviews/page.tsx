"use client";

import { useState, useEffect } from "react";
import { Star, Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { adminService } from "@/lib/api";

interface Review {
  id: string;
  overallRating: number;
  title: string;
  comment: string;
  createdAt: string;
  reviewer: { email: string; username: string };
  reviewee: { email: string; username: string };
}

export default function AdminReviews() {
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await adminService.getReviews({ limit: "100" });
        const data = res.reviews ?? res.data ?? res;
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const filtered = reviews.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewer?.username?.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewee?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-300"}`} />
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage user reviews and ratings.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No reviews found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs font-semibold">
                  <th className="p-4 pl-0">Reviewer</th>
                  <th className="p-4">Reviewee</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4 pr-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-0 font-medium">{r.reviewer?.username ?? "Unknown"}</td>
                    <td className="p-4 text-muted-foreground">{r.reviewee?.username ?? "Unknown"}</td>
                    <td className="p-4 text-muted-foreground">{r.title}</td>
                    <td className="p-4 flex items-center gap-0.5">{renderStars(r.overallRating)}</td>
                    <td className="p-4 text-muted-foreground max-w-xs truncate">{r.comment}</td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-0 text-right">
                      <button className="text-red-600 hover:underline font-semibold text-xs">Remove</button>
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
