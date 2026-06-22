import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  DollarSign,
  Star,
  ArrowLeft,
  AlertTriangle,
  X,
  CheckCircle,
  Play,
  Pause,
  Flag,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
import api from "../../../services/api";

interface Listing {
  id: string;
  name: string;
  vendorId: string;
  vendorName: string;
  category: string;
  status: "active" | "inactive" | "flagged" | "draft" | "rejected";
  price: string;
  regions: string[];
  bookings: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  flagReason?: string;
  flaggedAt?: string;
}

// Mock data
const mockListings: Listing[] = [
  {
    id: "1",
    name: "Deep Cleaning Service",
    vendorId: "1",
    vendorName: "Sarah's Cleaning Co.",
    category: "Cleaning Services",
    status: "active",
    price: "$120 flat rate",
    regions: ["New York, NY", "Brooklyn, NY"],
    bookings: 89,
    rating: 4.8,
    reviewCount: 34,
    createdAt: "2024-10-15",
    updatedAt: "2026-01-03",
    views: 1234,
  },
  {
    id: "2",
    name: "Plumbing Repair Services",
    vendorId: "2",
    vendorName: "QuickFix Handyman",
    category: "Handyman Services",
    status: "active",
    price: "$85/hour",
    regions: ["Los Angeles, CA"],
    bookings: 156,
    rating: 4.9,
    reviewCount: 67,
    createdAt: "2024-09-20",
    updatedAt: "2026-01-05",
    views: 2341,
  },
  {
    id: "3",
    name: "Fresh Organic Groceries",
    vendorId: "3",
    vendorName: "Green Valley Grocers",
    category: "Grocery",
    status: "inactive",
    price: "$50-$200",
    regions: ["Seattle, WA"],
    bookings: 23,
    rating: 4.2,
    reviewCount: 12,
    createdAt: "2024-12-28",
    updatedAt: "2025-12-30",
    views: 456,
  },
  {
    id: "4",
    name: "Premium Hair Styling",
    vendorId: "4",
    vendorName: "Beauty Bliss Salon",
    category: "Beauty Services",
    status: "flagged",
    price: "$45-$150",
    regions: ["New York, NY"],
    bookings: 67,
    rating: 3.9,
    reviewCount: 28,
    createdAt: "2025-01-01",
    updatedAt: "2026-01-04",
    views: 789,
    flagReason: "Customer complaint - misleading description",
    flaggedAt: "2026-01-04",
  },
  {
    id: "5",
    name: "Smartphone Repair",
    vendorId: "5",
    vendorName: "Tech Repair Pro",
    category: "Handyman Services",
    status: "active",
    price: "$50-$150",
    regions: ["New York, NY", "Jersey City, NJ"],
    bookings: 234,
    rating: 4.6,
    reviewCount: 89,
    createdAt: "2024-08-10",
    updatedAt: "2026-01-02",
    views: 3456,
  },
  {
    id: "6",
    name: "Fresh Organic Produce Box",
    vendorId: "7",
    vendorName: "Farm Fresh Direct",
    category: "Grocery",
    status: "active",
    price: "$50-$200",
    regions: ["Portland, OR"],
    bookings: 45,
    rating: 4.7,
    reviewCount: 31,
    createdAt: "2024-09-01",
    updatedAt: "2026-01-06",
    views: 678,
  },
  {
    id: "7",
    name: "Chicken Tikka Masala",
    vendorId: "11",
    vendorName: "Golden Spoon Restaurant",
    category: "Food",
    status: "active",
    price: "$15.99",
    regions: ["New York, NY", "Brooklyn, NY"],
    bookings: 267,
    rating: 5.0,
    reviewCount: 189,
    createdAt: "2024-09-20",
    updatedAt: "2026-01-05",
    views: 2876,
  },
  {
    id: "8",
    name: "Spicy Thai Basil Chicken",
    vendorId: "12",
    vendorName: "Taste of India Kitchen",
    category: "Food",
    status: "active",
    price: "$13.99",
    regions: ["Los Angeles, CA"],
    bookings: 198,
    rating: 4.9,
    reviewCount: 145,
    createdAt: "2024-11-05",
    updatedAt: "2026-01-04",
    views: 1987,
  },
  {
    id: "9",
    name: "Vegan Buddha Bowl",
    vendorId: "13",
    vendorName: "Vegan Delights Cafe",
    category: "Food",
    status: "active",
    price: "$12.99",
    regions: ["San Francisco, CA"],
    bookings: 145,
    rating: 4.7,
    reviewCount: 98,
    createdAt: "2024-10-12",
    updatedAt: "2026-01-03",
    views: 1234,
  },
  {
    id: "10",
    name: "Luxury Downtown Apartment",
    vendorId: "6",
    vendorName: "Cozy Home Rentals",
    category: "Rental Properties",
    status: "active",
    price: "$250/night",
    regions: ["Manhattan, New York, NY"],
    bookings: 45,
    rating: 4.9,
    reviewCount: 67,
    createdAt: "2024-06-15",
    updatedAt: "2026-01-07",
    views: 3456,
  },
  {
    id: "11",
    name: "Cozy Brooklyn Brownstone",
    vendorId: "6",
    vendorName: "Cozy Home Rentals",
    category: "Rental Properties",
    status: "active",
    price: "$320/night",
    regions: ["Brooklyn, New York, NY"],
    bookings: 38,
    rating: 4.8,
    reviewCount: 52,
    createdAt: "2024-06-20",
    updatedAt: "2026-01-06",
    views: 2987,
  },
  {
    id: "12",
    name: "Modern Studio with River View",
    vendorId: "6",
    vendorName: "Cozy Home Rentals",
    category: "Rental Properties",
    status: "active",
    price: "$180/night",
    regions: ["Queens, New York, NY"],
    bookings: 62,
    rating: 4.7,
    reviewCount: 89,
    createdAt: "2024-07-01",
    updatedAt: "2026-01-05",
    views: 4321,
  },
];

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    "Cleaning Services": "🧹",
    "Handyman Services": "🔧",
    "Grocery": "🛒",
    "Beauty Services": "💄",
    "Beauty Products": "🛍️",
    "Food": "🍲",
    "Rental Properties": "🏠",
    "Caregiving Services": "👵",
    "Ride Assistance": "🚗",
    "Companionship Support": "🤝",
  };
  return icons[category] || "📋";
};

const getStatusConfig = (status: string) => {
  const configs: Record<
    string,
    { label: string; icon: string; bg: string; border: string; text: string; borderLeft: string }
  > = {
    active: {
      label: "Active",
      icon: "✅",
      bg: "bg-[#D1FAE5]",
      border: "border-[#10B981]",
      text: "text-[#10B981]",
      borderLeft: "border-l-[#10B981]",
    },
    inactive: {
      label: "Inactive",
      icon: "⏸️",
      bg: "bg-[#F0F7FF]",
      border: "border-[#9CA3AF]",
      text: "text-[#9CA3AF]",
      borderLeft: "border-l-[#9CA3AF]",
    },
    flagged: {
      label: "Flagged",
      icon: "🚩",
      bg: "bg-[#FEF3C7]",
      border: "border-[#F59E0B]",
      text: "text-[#F59E0B]",
      borderLeft: "border-l-[#F59E0B]",
    },
    draft: {
      label: "Draft",
      icon: "📝",
      bg: "bg-[#F0F7FF]",
      border: "border-[rgba(46,122,217,0.25)]",
      text: "text-[#9CA3AF]",
      borderLeft: "border-l-[rgba(46,122,217, 0.18)]",
    },
    rejected: {
      label: "Rejected",
      icon: "❌",
      bg: "bg-[#FEE2E2]",
      border: "border-[#DC2626]",
      text: "text-[#DC2626]",
      borderLeft: "border-l-[#DC2626]",
    },
  };
  return configs[status] || configs.inactive;
};

function ListingCard({
  listing,
  isSelected,
  onSelect,
  isBulkMode,
  onStatusChange,
}: {
  listing: Listing;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isBulkMode: boolean;
  onStatusChange: (id: string, category: string, next: "active" | "inactive") => Promise<void>;
}) {
  const navigate = useNavigate();
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagDetails, setFlagDetails] = useState("");
  const [busy, setBusy] = useState(false);

  const statusConfig = getStatusConfig(listing.status);

  const handleToggleStatus = async () => {
    const next = listing.status === "active" ? "inactive" : "active";
    setBusy(true);
    try { await onStatusChange(listing.id, listing.category, next); } finally { setBusy(false); }
  };

  const handleFlag = () => {
    // Flag listing logic
    console.log("Flag listing:", listing.id, flagReason, flagDetails);
    setShowFlagModal(false);
  };

  return (
    <>
      <div
        className={`bg-white border border-[rgba(46,122,217,0.25)] border-l-4 ${statusConfig.borderLeft} rounded-xl p-4 sm:p-5 lg:p-6 mb-5 hover:border-[#2E7AD9] hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-all relative`}
      >
        {/* Bulk Select Checkbox */}
        {isBulkMode && (
          <div className="absolute top-5 left-5 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(listing.id)}
              className="w-5 h-5"
            />
          </div>
        )}

        <div className={`flex flex-col lg:flex-row gap-4 ${isBulkMode ? "ml-8" : ""}`}>
          {/* Image */}
          <div className="flex-shrink-0">
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.name}
                className="w-full h-[180px] lg:w-[160px] lg:h-[120px] rounded-lg object-cover cursor-pointer"
                onClick={() => {
                  /* Open lightbox */
                }}
              />
            ) : (
              <div className="w-full h-[180px] lg:w-[160px] lg:h-[120px] rounded-lg bg-white border border-[rgba(46,122,217,0.25)] flex items-center justify-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <span className="text-4xl">{getCategoryIcon(listing.category)}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Flagged Alert Banner */}
            {listing.status === "flagged" && listing.flagReason && (
              <div className="bg-[#FEF3C7] border border-[#F59E0B] border-l-4 rounded-lg px-3 py-2.5 mb-3 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#92400E] mb-1">
                    Flagged: {listing.flagReason}
                  </p>
                  {listing.flaggedAt && (
                    <p className="text-xs text-[#92400E]">
                      Flagged on {new Date(listing.flaggedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs flex-shrink-0">
                  Review Flag
                </Button>
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <button
                onClick={() => navigate(`/admin/listings/${listing.id}`)}
                className="text-lg lg:text-xl font-bold text-[#1A1A2E] hover:text-[#2E7AD9] hover:underline text-left"
              >
                {listing.name}
              </button>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 ${statusConfig.bg} border ${statusConfig.border} rounded-full flex-shrink-0`}
              >
                <span className="text-sm">{statusConfig.icon}</span>
                <span className={`text-sm font-semibold ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>

            {/* Vendor & Category */}
            <button
              onClick={() => navigate(`/admin/vendors/${listing.vendorId}`)}
              className="text-sm text-[#6B7280] hover:text-[#2E7AD9] hover:underline mb-1 block"
            >
              by {listing.vendorName}
            </button>
            <p className="text-sm text-[#6B7280] mb-3">
              {getCategoryIcon(listing.category)} {listing.category}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <span className="font-semibold text-[#1A1A2E]">Price: </span>
                <span className="text-[#1A1A2E]">{listing.price}</span>
              </div>
              <div>
                <span className="font-semibold text-[#6B7280]">Regions: </span>
                <span className="text-[#6B7280]">
                  {listing.regions.length <= 2
                    ? listing.regions.join(", ")
                    : `${listing.regions[0]} +${listing.regions.length - 1} more`}
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#6B7280]">Performance: </span>
                <span className="text-[#6B7280]">
                  {listing.bookings} bookings | {listing.rating}⭐ ({listing.reviewCount} reviews)
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#9CA3AF]">Last Updated: </span>
                <span className="text-[#9CA3AF]">
                  {new Date(listing.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {listing.views && (
                <div className="sm:col-span-2">
                  <span className="font-semibold text-[#6B7280]">Views: </span>
                  <span className="text-[#6B7280]">
                    {listing.views.toLocaleString()} views (last 30 days)
                  </span>
                </div>
              )}
            </div>

            {/* Actions - Mobile */}
            <div className="flex flex-wrap gap-2 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => navigate(`/admin/listings/${listing.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => navigate(`/admin/listings/${listing.id}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`flex-1 sm:flex-none ${
                  listing.status === "active"
                    ? "text-[#F59E0B] border-[#FED7AA]"
                    : "text-[#10B981] border-[#D1FAE5]"
                }`}
                onClick={handleToggleStatus}
              >
                {listing.status === "active" ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[#DC2626] border-[#FECACA]"
                onClick={() => setShowFlagModal(true)}
              >
                <Flag className="w-4 h-4 mr-2" />
                {listing.status === "flagged" ? "Unflag" : "Flag"}
              </Button>
            </div>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden lg:flex flex-col gap-2 w-[140px] flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => navigate(`/admin/listings/${listing.id}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => navigate(`/admin/listings/${listing.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`w-full justify-start ${
                listing.status === "active"
                  ? "text-[#F59E0B] border-[#FED7AA]"
                  : "text-[#10B981] border-[#D1FAE5]"
              }`}
              onClick={handleToggleStatus}
            >
              {listing.status === "active" ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-[#DC2626] border-[#FECACA]"
              onClick={() => setShowFlagModal(true)}
            >
              <Flag className="w-4 h-4 mr-2" />
              {listing.status === "flagged" ? "Unflag" : "Flag"}
            </Button>
          </div>
        </div>
      </div>

      {/* Flag Modal */}
      <Dialog open={showFlagModal} onOpenChange={setShowFlagModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Flag Listing for Review</DialogTitle>
            <DialogDescription>Listing: {listing.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="flag-reason">Flag Reason *</Label>
              <Select value={flagReason} onValueChange={setFlagReason}>
                <SelectTrigger id="flag-reason" className="mt-1.5">
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="misleading">Misleading information</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                  <SelectItem value="quality">Low quality or spam</SelectItem>
                  <SelectItem value="policy">Policy violation</SelectItem>
                  <SelectItem value="pricing">Pricing issues</SelectItem>
                  <SelectItem value="other">Other (specify below)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="flag-details">Additional Details</Label>
              <Textarea
                id="flag-details"
                value={flagDetails}
                onChange={(e) => setFlagDetails(e.target.value)}
                placeholder="Provide more information about the issue..."
                className="mt-1.5 min-h-[100px]"
                maxLength={500}
              />
              <p className="text-xs text-[#9CA3AF] mt-1">{flagDetails.length} / 500</p>
            </div>

            <div className="flex items-start gap-2 p-3 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#92400E]">
                This will add the listing to the moderation queue for review.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
              onClick={handleFlag}
              disabled={!flagReason}
            >
              Flag Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AllListings() {
  const navigate = useNavigate();

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

  // State
  const [listings, setListings] = useState<Listing[]>([]);

  const toTypeUrl = (category: string) =>
    String(category || "")
      .toUpperCase()
      .replace(/^BEAUTY_PRODUCTS$/, "BEAUTY_PRODUCT")
      .replace(/^GROCERIES$/, "GROCERY")
      .replace(/^RENTALS$/, "RENTAL");

  const handleListingStatusChange = async (listingId: string, category: string, next: "active" | "inactive") => {
    const apiStatus = next === "active" ? "ACTIVE" : "PAUSED";
    try {
      await api.patch(`/api/v1/admin/listings/${toTypeUrl(category)}/${listingId}/status`, { status: apiStatus });
      setListings((prev) => prev.map((l) => (l.id === listingId ? { ...l, status: next } : l)));
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to update listing status");
    }
  };

  const [bulkBusy, setBulkBusy] = useState(false);
  const handleBulkStatusChange = async (next: "active" | "inactive") => {
    if (selectedListings.length === 0) return;
    if (next === "inactive" && !window.confirm(`Deactivate ${selectedListings.length} listing(s)?`)) return;
    setBulkBusy(true);
    const apiStatus = next === "active" ? "ACTIVE" : "PAUSED";
    const targets = listings.filter((l) => selectedListings.includes(l.id));
    const failures: string[] = [];
    await Promise.all(
      targets.map(async (l) => {
        try {
          await api.patch(`/api/v1/admin/listings/${toTypeUrl(l.category)}/${l.id}/status`, { status: apiStatus });
        } catch {
          failures.push(l.name || l.id);
        }
      })
    );
    setListings((prev) =>
      prev.map((l) =>
        selectedListings.includes(l.id) && !failures.includes(l.name || l.id)
          ? { ...l, status: next }
          : l
      )
    );
    setSelectedListings([]);
    setBulkBusy(false);
    if (failures.length > 0) {
      toast.error(`Failed to update ${failures.length} listing(s): ${failures.slice(0, 5).join(", ")}${failures.length > 5 ? "..." : ""}`);
    }
  };

  useEffect(() => {
    api.get<{ success: boolean; data: any[] }>("/api/v1/admin/listings?limit=200")
      .then((r) => {
        const mapped: Listing[] = (r.data || []).map((l: any) => ({
          id: l.id,
          name: l.title || l.name,
          vendorId: l.vendorId,
          vendorName: l.vendor?.businessName || "—",
          category: l.type || l.__type || l.category || "Other",
          status: (l.status || "ACTIVE").toLowerCase(),
          price: l.basePrice ? `$${l.basePrice}` : l.price ? `$${l.price}` : "—",
          regions: [],
          bookings: l._count?.bookings ?? 0,
          rating: l.vendor?.rating ?? 0,
          reviewCount: l.vendor?.reviewCount ?? 0,
          imageUrl: l.images?.[0] || l.image,
          createdAt: l.createdAt,
          updatedAt: l.updatedAt,
        }));
        setListings(mapped);
      })
      .catch(() => setListings([]));
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showFlaggedAlert, setShowFlaggedAlert] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Calculate stats
  const totalListings = listings.length;
  const activeListings = listings.filter((l) => l.status === "active").length;
  const inactiveListings = listings.filter((l) => l.status === "inactive").length;
  const flaggedListings = listings.filter((l) => l.status === "flagged").length;
  const avgRating =
    listings.reduce((sum, l) => sum + l.rating, 0) / listings.length || 0;

  // Filter listings
  const filteredListings = listings.filter((listing) => {
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        listing.name.toLowerCase().includes(query) ||
        listing.vendorName.toLowerCase().includes(query) ||
        listing.id.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Vendor filter
    if (vendorFilter !== "all" && listing.vendorId !== vendorFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter !== "all" && listing.category !== categoryFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && listing.status !== statusFilter) {
      return false;
    }

    // Region filter
    if (regionFilter !== "all") {
      const hasRegion = listing.regions.some((r) => r === regionFilter);
      if (!hasRegion) return false;
    }

    return true;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (sortBy === "oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    if (sortBy === "bookings") return b.bookings - a.bookings;
    if (sortBy === "rating-high") return b.rating - a.rating;
    if (sortBy === "rating-low") return a.rating - b.rating;
    if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListings = sortedListings.slice(startIndex, endIndex);

  const handleSelectListing = (id: string) => {
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
  };

  const handleDeselectAll = () => {
    setSelectedListings([]);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="listings"
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
              All Listings
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280] hidden sm:block">
              Platform-Wide Service & Product Listings
            </p>
          </div>

          {/* Listings Summary Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-6">
            <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
              <p className="text-xs uppercase text-[#6B7280] mb-2">Total</p>
              <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E]">
                {totalListings.toLocaleString()}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">All listings</p>
            </div>

            <div
              className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 sm:p-5 cursor-pointer hover:border-[#10B981] transition-colors shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
              onClick={() => setStatusFilter("active")}
            >
              <p className="text-xs uppercase text-[#6B7280] mb-2">Active</p>
              <p className="text-2xl sm:text-[28px] font-bold text-[#10B981]">
                {activeListings.toLocaleString()}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                {Math.round((activeListings / totalListings) * 100)}% of total
              </p>
            </div>

            <div
              className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 sm:p-5 cursor-pointer hover:border-[#9CA3AF] transition-colors shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
              onClick={() => setStatusFilter("inactive")}
            >
              <p className="text-xs uppercase text-[#6B7280] mb-2">Inactive</p>
              <p className="text-2xl sm:text-[28px] font-bold text-[#9CA3AF]">
                {inactiveListings.toLocaleString()}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                {Math.round((inactiveListings / totalListings) * 100)}% of total
              </p>
            </div>

            <div
              className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 sm:p-5 cursor-pointer hover:border-[#F59E0B] transition-colors shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
              onClick={() => setStatusFilter("flagged")}
            >
              <p className="text-xs uppercase text-[#6B7280] mb-2">Flagged</p>
              <p className="text-2xl sm:text-[28px] font-bold text-[#F59E0B]">
                {flaggedListings.toLocaleString()}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">Needs review</p>
            </div>

            <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 sm:p-5 col-span-2 lg:col-span-1 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
              <p className="text-xs uppercase text-[#6B7280] mb-2">Avg Rating</p>
              <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E]">
                {avgRating.toFixed(1)} ⭐
              </p>
              <p className="text-xs text-[#6B7280] mt-1">Platform average</p>
            </div>
          </div>

          {/* Flagged Listings Alert */}
          {flaggedListings > 0 && showFlaggedAlert && (
            <div className="bg-[#FEF3C7] border border-[#F59E0B] border-l-4 rounded-lg px-4 py-3 mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-[#F59E0B] flex-shrink-0" />
                <p className="text-sm sm:text-base font-semibold text-[#92400E]">
                  {flaggedListings} listing{flaggedListings > 1 ? "s" : ""} flagged for review
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white"
                  onClick={() => setStatusFilter("flagged")}
                >
                  Review Flagged →
                </Button>
                <button
                  onClick={() => setShowFlaggedAlert(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FDE68A] transition-colors"
                >
                  <X className="w-5 h-5 text-[#92400E]" />
                </button>
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="space-y-3 mb-6">
            {/* Search + Primary Filters */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  type="text"
                  placeholder="🔍 Search listings by name, vendor, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-12 pr-4 text-[15px]"
                />
              </div>

              <Select value={vendorFilter} onValueChange={setVendorFilter}>
                <SelectTrigger className="h-12 w-full lg:w-[200px]">
                  <SelectValue placeholder="Vendor: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  <SelectItem value="1">Sarah's Cleaning Co.</SelectItem>
                  <SelectItem value="2">QuickFix Handyman</SelectItem>
                  <SelectItem value="3">Green Valley Grocers</SelectItem>
                  <SelectItem value="4">Beauty Bliss Salon</SelectItem>
                  <SelectItem value="5">Tech Repair Pro</SelectItem>
                  <SelectItem value="7">Farm Fresh Direct</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 w-full lg:w-[200px]">
                  <SelectValue placeholder="Category: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Cleaning Services">🧹 Cleaning Services</SelectItem>
                  <SelectItem value="Handyman Services">🔧 Handyman Services</SelectItem>
                  <SelectItem value="Grocery">🛒 Grocery</SelectItem>
                  <SelectItem value="Beauty Services">💄 Beauty Services</SelectItem>
                  <SelectItem value="Beauty Products">🛍️ Beauty Products</SelectItem>
                  <SelectItem value="Food">🍲 Food</SelectItem>
                  <SelectItem value="Rental Properties">🏠 Rental Properties</SelectItem>
                  <SelectItem value="Ride Assistance">🚗 Ride Assistance</SelectItem>
                  <SelectItem value="Companionship Support">🤝 Companionship Support</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 w-full lg:w-[200px]">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">✅ Active</SelectItem>
                  <SelectItem value="inactive">⏸️ Inactive</SelectItem>
                  <SelectItem value="flagged">🚩 Flagged</SelectItem>
                  <SelectItem value="draft">📝 Draft</SelectItem>
                  <SelectItem value="rejected">❌ Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="h-12 w-full lg:w-[200px]">
                  <SelectValue placeholder="Region: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="New York, NY">New York, NY</SelectItem>
                  <SelectItem value="Brooklyn, NY">Brooklyn, NY</SelectItem>
                  <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                  <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                  <SelectItem value="Jersey City, NJ">Jersey City, NJ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort + Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="bookings">Most Bookings</SelectItem>
                  <SelectItem value="rating-high">Highest Rated</SelectItem>
                  <SelectItem value="rating-low">Lowest Rated</SelectItem>
                  <SelectItem value="alphabetical">Alphabetically</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={bulkMode ? "default" : "outline"}
                className={`h-12 sm:ml-auto ${bulkMode ? "bg-[#2E7AD9]" : ""}`}
                onClick={() => {
                  setBulkMode(!bulkMode);
                  if (bulkMode) setSelectedListings([]);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {bulkMode ? "Exit Bulk Mode" : "Bulk Select Mode"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bulk Actions Bar */}
            {bulkMode && selectedListings.length > 0 && (
              <div className="bg-[#E0F2FE] border border-[#2E7AD9] rounded-lg px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#1A4791]">
                  {selectedListings.length} listing{selectedListings.length > 1 ? "s" : ""} selected
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" disabled={bulkBusy} onClick={() => handleBulkStatusChange("active")} className="bg-[#10B981] hover:bg-[#059669] text-white">
                    <Play className="w-4 h-4 mr-2" />
                    {bulkBusy ? "Working..." : "Activate Selected"}
                  </Button>
                  <Button size="sm" disabled={bulkBusy} onClick={() => handleBulkStatusChange("inactive")} variant="outline" className="text-[#9CA3AF] border-[rgba(46,122,217,0.25)]">
                    <Pause className="w-4 h-4 mr-2" />
                    {bulkBusy ? "Working..." : "Deactivate Selected"}
                  </Button>
                  <Button size="sm" variant="outline" className="text-[#F59E0B] border-[#FED7AA]">
                    <Flag className="w-4 h-4 mr-2" />
                    Flag Selected
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDeselectAll}
                    className="text-[#2E7AD9]"
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Listing Cards */}
          {paginatedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center mb-6">
                <Package className="w-16 h-16 text-[#9CA3AF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">No listings found</h3>
              <p className="text-[15px] text-[#6B7280] mb-6">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setVendorFilter("all");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                  setRegionFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              {paginatedListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isSelected={selectedListings.includes(listing.id)}
                  onSelect={handleSelectListing}
                  isBulkMode={bulkMode}
                  onStatusChange={handleListingStatusChange}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                  <p className="text-sm text-[#6B7280]">
                    Showing {startIndex + 1}-{Math.min(endIndex, sortedListings.length)} of{" "}
                    {sortedListings.length} listings
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="h-10 px-3"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Prev</span>
                    </Button>

                    <div className="hidden sm:flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-10 w-10 ${
                              currentPage === pageNum ? "bg-[#2E7AD9] text-white" : ""
                            }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <span className="sm:hidden text-sm text-[#6B7280]">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="h-10 px-3"
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}