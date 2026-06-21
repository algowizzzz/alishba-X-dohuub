import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Star, Search, Eye, Trash2, CheckCircle, Loader2,
} from "lucide-react";
import api from "../../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "../ui/dialog";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface Review {
  id: string;
  rating: number;
  customerName: string;
  customerId: string;
  verified: boolean;
  vendorName: string;
  vendorId: string;
  bookingId: string;
  bookingDate: string;
  reviewText: string;
  vendorResponse?: { text: string; respondedAt: string };
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[rgba(46,122,217,0.12)]"}`}
        />
      ))}
      <span className="ml-1 text-sm font-semibold text-[#1A1A2E]">{rating}.0 Stars</span>
    </div>
  );
}

function ReviewCard({ review, onDelete, busy }: { review: Review; onDelete: (r: Review) => void; busy: boolean }) {
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <>
      <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 mb-5 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1"><StarRating rating={review.rating} /></div>
          <span className="text-sm text-[#6B7280]">{new Date(review.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-[#1A1A2E]">Customer: {review.customerName}</span>
          {review.verified && (
            <span title="Verified Purchase" className="inline-flex">
              <CheckCircle className="w-4 h-4 text-[#10B981]" />
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
          <div>
            <span className="text-[#6B7280]">Vendor: </span>
            <button onClick={() => navigate(`/admin/vendors/${review.vendorId}`)} className="text-[#2E7AD9] hover:underline">
              {review.vendorName}
            </button>
          </div>
          <div>
            <span className="text-[#6B7280]">Booking: </span>
            <button onClick={() => navigate(`/admin/orders/${review.bookingId}`)} className="text-[#2E7AD9] hover:underline">
              {review.bookingId.slice(-8).toUpperCase()}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-1">Review:</p>
          <div className="bg-white border-l-4 border-[#2E7AD9] px-4 py-3 rounded">
            <p className="text-sm text-[#4B5563] italic">"{review.reviewText}"</p>
          </div>
        </div>

        {review.vendorResponse && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-2">Vendor Response ({review.vendorName}):</p>
            <div className="bg-[#E8F1FC] border-l-4 border-[#2E7AD9] px-4 py-3 rounded">
              <p className="text-sm text-[#1A1A2E] italic">"{review.vendorResponse.text}"</p>
              <p className="text-xs text-[#6B7280] mt-2">Responded: {new Date(review.vendorResponse.respondedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t border-[rgba(46,122,217,0.25)]">
          <Button size="sm" onClick={() => setShowDetailModal(true)}>
            <Eye className="w-4 h-4 mr-2" />View Full Details
          </Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => onDelete(review)} className="text-[#DC2626] border-[#FECACA]">
            <Trash2 className="w-4 h-4 mr-2" />Remove
          </Button>
        </div>
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Review by {review.customerName} — {review.rating}★</DialogTitle>
            <DialogDescription>Posted: {new Date(review.createdAt).toLocaleString()}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div>
              <p className="text-sm font-semibold mb-1">Vendor & Booking:</p>
              <p className="text-sm text-[#6B7280]">
                Vendor: {review.vendorName}<br />
                Booking: {review.bookingId.slice(-8).toUpperCase()} ({new Date(review.bookingDate).toLocaleDateString()})
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Review:</p>
              <div className="bg-white p-4 rounded-lg"><p className="text-sm text-[#4B5563]">{review.reviewText}</p></div>
            </div>
            {review.vendorResponse && (
              <div>
                <p className="text-sm font-semibold mb-2">Vendor Response:</p>
                <div className="bg-[#E8F1FC] p-4 rounded-lg">
                  <p className="text-sm text-[#1A1A2E] mb-2">{review.vendorResponse.text}</p>
                  <p className="text-xs text-[#6B7280]">Responded: {new Date(review.vendorResponse.respondedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function downloadCSV(reviews: Review[]) {
  const header = ["id", "rating", "customer", "vendor", "createdAt", "comment"];
  const rows = reviews.map((r) =>
    [r.id, r.rating, r.customerName, r.vendorName, r.createdAt, r.reviewText]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reviews-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AllReviews() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) setSidebarCollapsed(!sidebarCollapsed);
    else setSidebarOpen(!sidebarOpen);
  };

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api
      .get<{ success: boolean; data: any[] }>("/api/v1/admin/reviews?limit=200")
      .then((r) => {
        const data = (r as any)?.data || [];
        const mapped: Review[] = data.map((rv: any) => ({
          id: rv.id,
          rating: rv.rating || 0,
          customerName: rv.user?.profile?.firstName
            ? `${rv.user.profile.firstName} ${rv.user.profile.lastName?.[0] || ""}.`
            : rv.user?.email?.split("@")[0] || "Customer",
          customerId: rv.userId || rv.user?.id || "",
          verified: true,
          vendorName: rv.vendor?.businessName || "Vendor",
          vendorId: rv.vendorId || "",
          bookingId: rv.bookingId || rv.orderId || rv.id,
          bookingDate: rv.createdAt,
          reviewText: rv.comment || rv.text || "",
          vendorResponse: rv.vendorResponse
            ? { text: rv.vendorResponse, respondedAt: rv.vendorResponseAt || rv.updatedAt }
            : undefined,
          createdAt: rv.createdAt,
        }));
        setReviews(mapped);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const handleDelete = async (r: Review) => {
    if (!window.confirm(`Permanently delete this review?`)) return;
    setPending((p) => ({ ...p, [r.id]: true }));
    try {
      await api.delete(`/api/v1/admin/reviews/${r.id}`);
      setReviews((prev) => prev.filter((x) => x.id !== r.id));
      toast.success("Review removed");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to remove review");
    } finally {
      setPending((p) => ({ ...p, [r.id]: false }));
    }
  };

  // Real stats from loaded reviews — no more hardcoded 2847/4.6.
  const total = reviews.length;
  const fives = reviews.filter((r) => r.rating === 5).length;
  const fours = reviews.filter((r) => r.rating === 4).length;
  const threes = reviews.filter((r) => r.rating === 3).length;
  const twos = reviews.filter((r) => r.rating === 2).length;
  const ones = reviews.filter((r) => r.rating === 1).length;
  const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  const filteredReviews = reviews.filter((review) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !review.reviewText.toLowerCase().includes(q) &&
        !review.customerName.toLowerCase().includes(q) &&
        !review.vendorName.toLowerCase().includes(q)
      ) return false;
    }
    if (ratingFilter !== "all" && review.rating !== parseInt(ratingFilter)) return false;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="reviews"
      />
      <main className={`mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">All Platform Reviews</h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">Monitor and remove inappropriate reviews</p>
          </div>

          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Reviews Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-4">
              <div className="text-center"><p className="text-sm text-[#6B7280] mb-1">Total</p><p className="text-2xl font-bold text-[#1A1A2E]">{total}</p><p className="text-xs text-[#9CA3AF]">100%</p></div>
              <div className="text-center"><p className="text-sm text-[#6B7280] mb-1">5 Star</p><p className="text-2xl font-bold text-[#10B981]">{fives}</p><p className="text-xs text-[#9CA3AF]">{pct(fives)}%</p></div>
              <div className="text-center"><p className="text-sm text-[#6B7280] mb-1">4 Star</p><p className="text-2xl font-bold text-[#2E7AD9]">{fours}</p><p className="text-xs text-[#9CA3AF]">{pct(fours)}%</p></div>
              <div className="text-center"><p className="text-sm text-[#6B7280] mb-1">3 Star</p><p className="text-2xl font-bold text-[#F59E0B]">{threes}</p><p className="text-xs text-[#9CA3AF]">{pct(threes)}%</p></div>
              <div className="text-center"><p className="text-sm text-[#6B7280] mb-1">2 Star</p><p className="text-2xl font-bold text-[#DC2626]">{twos}</p><p className="text-xs text-[#9CA3AF]">{pct(twos)}%</p></div>
              <div className="text-center"><p className="text-sm text-[#6B7280] mb-1">1 Star</p><p className="text-2xl font-bold text-[#991B1B]">{ones}</p><p className="text-xs text-[#9CA3AF]">{pct(ones)}%</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[rgba(46,122,217,0.25)]">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">Average Rating:</span>
                <span className="text-lg font-bold text-[#1A1A2E]">{avg.toFixed(1)}</span>
                <Star className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <Input type="text" placeholder="Search reviews..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12" />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="h-12 w-full sm:w-[150px]"><SelectValue placeholder="Rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5★</SelectItem>
                <SelectItem value="4">4★</SelectItem>
                <SelectItem value="3">3★</SelectItem>
                <SelectItem value="2">2★</SelectItem>
                <SelectItem value="1">1★</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 w-full sm:w-[200px]"><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-12" onClick={() => downloadCSV(sortedReviews)}>
              Export
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#2E7AD9] animate-spin" /></div>
          ) : sortedReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-[120px] h-[120px] rounded-full bg-[#F0F7FF] flex items-center justify-center mb-6"><Star className="w-16 h-16 text-[#9CA3AF]" /></div>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">No reviews found</h3>
              <p className="text-[15px] text-[#6B7280]">No reviews match your search filters</p>
            </div>
          ) : (
            sortedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} onDelete={handleDelete} busy={!!pending[review.id]} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
