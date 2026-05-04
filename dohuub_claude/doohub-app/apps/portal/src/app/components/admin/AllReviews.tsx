import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Search,
  Download,
  Eye,
  Flag,
  EyeOff,
  Trash2,
  CheckCircle,
  Image as ImageIcon,
  ThumbsUp,
} from "lucide-react";
import api from "../../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface Review {
  id: string;
  rating: number;
  customerName: string;
  customerId: string;
  verified: boolean;
  serviceName: string;
  vendorName: string;
  vendorId: string;
  bookingId: string;
  bookingDate: string;
  reviewText: string;
  photos?: string[];
  vendorResponse?: {
    text: string;
    respondedAt: string;
  };
  helpfulCount: number;
  flagged: boolean;
  flagReason?: string;
  flaggedBy?: string;
  status: "published" | "pending_response" | "flagged" | "hidden" | "removed";
  createdAt: string;
}

// Mock data
const mockReviews: Review[] = [
  {
    id: "REV001",
    rating: 5,
    customerName: "Sarah J.",
    customerId: "C123",
    verified: true,
    serviceName: "Deep Cleaning Service",
    vendorName: "CleanCo Services",
    vendorId: "V001",
    bookingId: "BK-12789",
    bookingDate: "2026-01-03",
    reviewText:
      "Excellent service! The team was professional and thorough. My apartment has never been cleaner. Highly recommend for anyone looking for quality cleaning.",
    photos: ["photo1.jpg", "photo2.jpg"],
    vendorResponse: {
      text: "Thank you Sarah! We're thrilled you're happy with our service. Looking forward to serving you again!",
      respondedAt: "2026-01-04",
    },
    helpfulCount: 12,
    flagged: false,
    status: "published",
    createdAt: "2026-01-04",
  },
  {
    id: "REV002",
    rating: 2,
    customerName: "John D.",
    customerId: "C456",
    verified: true,
    serviceName: "Premium House Cleaning",
    vendorName: "CleanCo Services",
    vendorId: "V001",
    bookingId: "BK-12745",
    bookingDate: "2026-01-02",
    reviewText:
      "Service was rushed. They left after 90 minutes when 3 hours was promised. Several areas were not cleaned properly. Disappointed with the quality.",
    photos: ["uncleaned.jpg"],
    helpfulCount: 3,
    flagged: true,
    flagReason: "Dispute - Vendor claims different details",
    flaggedBy: "Vendor (CleanCo Services)",
    status: "flagged",
    createdAt: "2026-01-03",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[rgba(46, 122, 217, 0.12)]"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-semibold text-[#1A1A2E]">{rating}.0 Stars</span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <>
      <div
        className={`bg-white border rounded-xl p-5 sm:p-6 mb-5 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow ${
          review.flagged ? "border-[#DC2626]" : "border-[rgba(46,122,217,0.25)]"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <StarRating rating={review.rating} />
          </div>
          <div className="flex items-center gap-2">
            {review.flagged && (
              <span className="px-2 py-1 bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold rounded-full flex items-center gap-1">
                <Flag className="w-3 h-3" />
                Flagged
              </span>
            )}
            <span className="text-sm text-[#6B7280]">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1A1A2E]">
              Customer: {review.customerName}
            </span>
            {review.verified && (
              <CheckCircle className="w-4 h-4 text-[#10B981]" title="Verified Purchase" />
            )}
          </div>
        </div>

        {/* Service & Vendor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
          <div>
            <span className="text-[#6B7280]">Service: </span>
            <button
              onClick={() => navigate(`/admin/listings/${review.vendorId}`)}
              className="text-[#2E7AD9] hover:underline"
            >
              {review.serviceName}
            </button>
          </div>
          <div>
            <span className="text-[#6B7280]">Vendor: </span>
            <button
              onClick={() => navigate(`/admin/vendors/${review.vendorId}`)}
              className="text-[#2E7AD9] hover:underline"
            >
              {review.vendorName}
            </button>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[#6B7280]">Booking: </span>
            <button
              onClick={() => navigate(`/admin/orders/${review.bookingId}`)}
              className="text-[#2E7AD9] hover:underline"
            >
              {review.bookingId}
            </button>
            <span className="text-[#9CA3AF] ml-2">
              (Completed {new Date(review.bookingDate).toLocaleDateString()})
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-3">
          <p className="text-sm font-semibold text-[#1A1A2E] mb-1">Review:</p>
          <div className="bg-[#F8FAFF] border-l-4 border-[#2E7AD9] px-4 py-3 rounded">
            <p className="text-sm text-[#4B5563] italic">"{review.reviewText}"</p>
          </div>
        </div>

        {/* Photos */}
        {review.photos && review.photos.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-2">Photos:</p>
            <div className="flex gap-2">
              {review.photos.map((photo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-[#F0F7FF] border border-[rgba(46,122,217,0.25)] rounded-lg text-sm"
                >
                  <ImageIcon className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-[#1A1A2E]">Image {index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vendor Response */}
        {review.vendorResponse ? (
          <div className="mb-3">
            <p className="text-sm font-semibold text-[#1A1A2E] mb-2">
              Vendor Response ({review.vendorName}):
            </p>
            <div className="bg-[#E8F1FC] border-l-4 border-[#2E7AD9] px-4 py-3 rounded">
              <p className="text-sm text-[#1A1A2E] italic">"{review.vendorResponse.text}"</p>
              <p className="text-xs text-[#6B7280] mt-2">
                Responded: {new Date(review.vendorResponse.respondedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <p className="text-sm text-[#6B7280] italic">Vendor Response: Pending</p>
          </div>
        )}

        {/* Flag Info */}
        {review.flagged && review.flagReason && (
          <div className="bg-[#FEE2E2] border-l-4 border-[#DC2626] px-4 py-3 rounded mb-3">
            <p className="text-sm font-semibold text-[#991B1B] mb-1">Flag Reason:</p>
            <p className="text-sm text-[#7F1D1D]">{review.flagReason}</p>
            <p className="text-xs text-[#991B1B] mt-1">Flagged by: {review.flaggedBy}</p>
          </div>
        )}

        {/* Helpful Count */}
        <div className="flex items-center gap-1 text-sm text-[#6B7280] mb-4">
          <ThumbsUp className="w-4 h-4" />
          <span>
            Helpful: {review.helpfulCount} customer{review.helpfulCount !== 1 ? "s" : ""} found
            this helpful
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[rgba(46,122,217,0.25)]">
          <Button size="sm" onClick={() => setShowDetailModal(true)}>
            <Eye className="w-4 h-4 mr-2" />
            View Full Details
          </Button>
          {!review.flagged && (
            <Button size="sm" variant="outline" className="text-[#F59E0B] border-[#FED7AA]">
              <Flag className="w-4 h-4 mr-2" />
              Flag Review
            </Button>
          )}
          {review.status === "published" && (
            <Button size="sm" variant="outline" className="text-[#6B7280]">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Review
            </Button>
          )}
          <Button size="sm" variant="outline" className="text-[#DC2626] border-[#FECACA]">
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Review by {review.customerName} - <StarRating rating={review.rating} />
            </DialogTitle>
            <DialogDescription>
              Posted: {new Date(review.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div>
              <p className="text-sm font-semibold mb-1">Service & Booking:</p>
              <p className="text-sm text-[#6B7280]">
                Service: {review.serviceName}
                <br />
                Vendor: {review.vendorName}
                <br />
                Booking: {review.bookingId} (Completed{" "}
                {new Date(review.bookingDate).toLocaleDateString()})
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Review Content:</p>
              <div className="bg-[#F8FAFF] p-4 rounded-lg">
                <p className="text-sm text-[#4B5563]">{review.reviewText}</p>
              </div>
            </div>

            {review.vendorResponse && (
              <div>
                <p className="text-sm font-semibold mb-2">Vendor Response:</p>
                <div className="bg-[#E8F1FC] p-4 rounded-lg">
                  <p className="text-sm text-[#1A1A2E] mb-2">{review.vendorResponse.text}</p>
                  <p className="text-xs text-[#6B7280]">
                    Responded: {new Date(review.vendorResponse.respondedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold mb-2">Engagement:</p>
              <p className="text-sm text-[#6B7280]">
                Helpful Votes: {review.helpfulCount} people found this helpful
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
            <Button className="bg-[#F59E0B] hover:bg-[#D97706]">
              <Flag className="w-4 h-4 mr-2" />
              Flag for Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AllReviews() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ success: boolean; data: any[] }>("/api/v1/admin/reviews?limit=100")
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
          serviceName: rv.serviceName || "Service",
          vendorName: rv.vendor?.businessName || "Vendor",
          vendorId: rv.vendorId || "",
          bookingId: rv.bookingId || rv.orderId || rv.id,
          bookingDate: rv.createdAt,
          reviewText: rv.comment || rv.text || "",
          photos: Array.isArray(rv.photos) ? rv.photos : [],
          vendorResponse: rv.vendorResponse
            ? { text: rv.vendorResponse, respondedAt: rv.vendorResponseAt || rv.updatedAt }
            : undefined,
          helpfulCount: rv.helpfulCount || 0,
          flagged: !!rv.flagged,
          flagReason: rv.flagReason || undefined,
          flaggedBy: rv.flaggedBy || undefined,
          status: rv.flagged ? "flagged" : "published",
          createdAt: rv.createdAt,
        }));
        setReviews(mapped);
      })
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Calculate stats
  const totalReviews = 2847;
  const fiveStarCount = 1823;
  const fourStarCount = 645;
  const threeStarCount = 245;
  const twoStarCount = 98;
  const oneStarCount = 36;
  const avgRating = 4.6;
  const reviewRate = 68;

  const fiveStarPercent = Math.round((fiveStarCount / totalReviews) * 100);
  const fourStarPercent = Math.round((fourStarCount / totalReviews) * 100);
  const threeStarPercent = Math.round((threeStarCount / totalReviews) * 100);
  const twoStarPercent = Math.round((twoStarCount / totalReviews) * 100);
  const oneStarPercent = Math.round((oneStarCount / totalReviews) * 100);

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !review.reviewText.toLowerCase().includes(query) &&
        !review.customerName.toLowerCase().includes(query) &&
        !review.vendorName.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (ratingFilter !== "all" && review.rating !== parseInt(ratingFilter)) {
      return false;
    }

    if (statusFilter !== "all" && review.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "highest") {
      return b.rating - a.rating;
    }
    if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    if (sortBy === "helpful") {
      return b.helpfulCount - a.helpfulCount;
    }
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

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              All Platform Reviews
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Monitor and manage customer reviews across the platform
            </p>
          </div>

          {/* Reviews Summary */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Reviews Summary</h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-4">
              <div className="text-center">
                <p className="text-sm text-[#6B7280] mb-1">Total</p>
                <p className="text-2xl font-bold text-[#1A1A2E]">{totalReviews.toLocaleString()}</p>
                <p className="text-xs text-[#9CA3AF]">100%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#6B7280] mb-1">5 Star</p>
                <p className="text-2xl font-bold text-[#10B981]">{fiveStarCount.toLocaleString()}</p>
                <p className="text-xs text-[#9CA3AF]">{fiveStarPercent}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#6B7280] mb-1">4 Star</p>
                <p className="text-2xl font-bold text-[#2E7AD9]">{fourStarCount}</p>
                <p className="text-xs text-[#9CA3AF]">{fourStarPercent}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#6B7280] mb-1">3 Star</p>
                <p className="text-2xl font-bold text-[#F59E0B]">{threeStarCount}</p>
                <p className="text-xs text-[#9CA3AF]">{threeStarPercent}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#6B7280] mb-1">2 Star</p>
                <p className="text-2xl font-bold text-[#DC2626]">{twoStarCount}</p>
                <p className="text-xs text-[#9CA3AF]">{twoStarPercent}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#6B7280] mb-1">1 Star</p>
                <p className="text-2xl font-bold text-[#991B1B]">{oneStarCount}</p>
                <p className="text-xs text-[#9CA3AF]">{oneStarPercent}%</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[rgba(46,122,217,0.25)]">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">Average Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-[#1A1A2E]">{avgRating}</span>
                  <Star className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">Review Rate:</span>
                <span className="text-lg font-bold text-[#1A1A2E]">{reviewRate}%</span>
                <span className="text-xs text-[#9CA3AF]">of bookings</span>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <Input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="h-12 w-full sm:w-[150px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5★</SelectItem>
                <SelectItem value="4">4★</SelectItem>
                <SelectItem value="3">3★</SelectItem>
                <SelectItem value="2">2★</SelectItem>
                <SelectItem value="1">1★</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 w-full sm:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="pending_response">Pending Response</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 w-full sm:w-[200px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-12">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Review Cards */}
          {sortedReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-[120px] h-[120px] rounded-full bg-[#F0F7FF] flex items-center justify-center mb-6">
                <Star className="w-16 h-16 text-[#9CA3AF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">No reviews found</h3>
              <p className="text-[15px] text-[#6B7280]">No reviews match your search filters</p>
            </div>
          ) : (
            sortedReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </div>
      </main>
    </div>
  );
}