import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, FileText, Star, TrendingUp, Check, AlertCircle, Loader2 } from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { getCreateButtonText, isProductCategory } from "../../data/vendorBusinessData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../../services/api";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  bookings: number;
  bookingTrend: number;
  status: "ACTIVE" | "PAUSED" | "SUSPENDED";
  rating: number;
  reviews: number;
  regions: number;
  whatsIncluded: string[];
}

interface StoreData {
  name: string;
  category: string;
  listings: Listing[];
}


export function VendorStoreListings() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { user } = useAuth();

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

  const [statusFilter, setStatusFilter] = useState("all");

  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeData, setStoreData] = useState<{ name: string; category: string; businessName: string }>({
    name: "Loading...",
    category: "",
    businessName: ""
  });
  const [listings, setListings] = useState<Listing[]>([]);

  // Get vendor name
  const vendorName = user?.profile?.firstName || user?.name?.split(" ")[0] || "Vendor";

  // Fetch store and listings from API
  const fetchStoreData = useCallback(async () => {
    if (!storeId) {
      setError("No store ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const storeResponse: any = await api.getStoreById(storeId);

      if (storeResponse.success && storeResponse.data) {
        const store = storeResponse.data;

        setStoreData({
          name: store.name,
          category: store.category,
          businessName: store.vendor?.businessName || store.name,
        });

        // Map listings from store response
        const allListings: Listing[] = [];

        const listingTypes = [
          { data: store.foodListings },
          { data: store.beautyProductListings },
          { data: store.rideAssistanceListings },
          { data: store.companionshipListings },
        ];

        for (const { data } of listingTypes) {
          if (data && Array.isArray(data)) {
            for (const listing of data) {
              allListings.push({
                id: listing.id,
                title: listing.title || listing.name,
                description: listing.description || "",
                price: Number(listing.price || listing.basePrice || 0),
                bookings: listing.bookingsThisMonth || 0,
                bookingTrend: listing.bookingTrend || 0,
                status: listing.status || "ACTIVE",
                rating: listing.averageRating || 0,
                reviews: listing.reviewCount || 0,
                regions: listing.regions?.length || 0,
                whatsIncluded: listing.features || listing.whatsIncluded || [],
              });
            }
          }
        }

        setListings(allListings);
      } else {
        setError("Failed to load store data");
      }
    } catch (err: any) {
      console.error("Failed to fetch store data:", err);
      setError(err.response?.data?.error || "Failed to load store data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  // Calculate stats
  const activeListings = listings.filter((l) => l.status === "ACTIVE").length;
  const totalBookings = listings.reduce((sum, l) => sum + l.bookings, 0);

  // Filter listings
  const filteredListings =
    statusFilter === "all"
      ? listings.filter((l) => l.status === "ACTIVE")
      : listings;

  const handleDeactivate = (listingId: string) => {
    setListings(
      listings.map((listing) =>
        listing.id === listingId
          ? { ...listing, status: "PAUSED" as const }
          : listing
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <VendorTopNav onMenuClick={handleSidebarToggle} vendorName={vendorName} />
      <VendorSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => {
          if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setSidebarCollapsed(!sidebarCollapsed);
          } else {
            setSidebarOpen(false);
          }
        }}
        activeMenu="services"
      />

      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => setError(null)}
              >
                ✕
              </button>
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate("/vendor/services")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F2937] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Services</span>
          </button>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-3">
              Manage Listings: {storeData.name}
            </h1>

            {/* Profile Info Line */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B7280] mb-6">
              <span className="hidden sm:inline">
                <span className="font-medium">Business:</span> {storeData.businessName}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>
                <span className="font-medium">Category:</span>{" "}
                {storeData.category}
              </span>
              <span>•</span>
              <span>
                <span className="font-medium">{listings.length}</span> listings
              </span>
              <span>•</span>
              <span>
                <span className="font-medium">{activeListings}</span> active
              </span>
              <span>•</span>
              <span>
                <span className="font-medium">{totalBookings}</span> bookings
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() =>
                  navigate(`/vendor/services/${storeId}/listings/create`)
                }
                className="h-11 px-6 bg-[#1F2937] hover:bg-[#111827] text-white w-full sm:w-auto"
              >
                {getCreateButtonText(storeData.category)}
              </Button>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-11">
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Listings Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">
              Active Listings ({activeListings})
            </h2>

            <div className="space-y-6">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  category={storeData.category}
                  onEdit={() =>
                    navigate(
                      `/vendor/services/${storeId}/listings/edit/${listing.id}`
                    )
                  }
                  onDeactivate={() => handleDeactivate(listing.id)}
                />
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-12 text-center">
                <FileText className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
                <p className="text-sm text-[#6B7280]">No active listings</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface ListingCardProps {
  listing: Listing;
  category: string;
  onEdit: () => void;
  onDeactivate: () => void;
}

function ListingCard({ listing, category, onEdit, onDeactivate }: ListingCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-full sm:w-[100px] h-[100px] rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center">
            <FileText className="w-10 h-10 text-[#9CA3AF]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Description */}
          <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-2 break-words">
            {listing.title}
          </h3>
          <p className="text-sm text-[#6B7280] mb-4">{listing.description}</p>

          {/* Metrics */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Price</p>
              <p className="text-base font-semibold text-[#1F2937]">
                ${listing.price}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Bookings</p>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-[#1F2937]">
                  {listing.bookings}
                </p>
                <div
                  className={`flex items-center gap-1 text-[13px] ${
                    listing.bookingTrend >= 0
                      ? "text-[#10B981]"
                      : "text-[#DC2626]"
                  }`}
                >
                  <TrendingUp
                    className={`w-3.5 h-3.5 ${
                      listing.bookingTrend < 0 ? "rotate-180" : ""
                    }`}
                  />
                  {listing.bookingTrend >= 0 ? "+" : ""}
                  {listing.bookingTrend}%
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Status</p>
              <p className="text-base font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[#10B981]">ACTIVE</span>
              </p>
            </div>
          </div>

          {/* What's Included - Only show for service categories */}
          {!isProductCategory(category) && (
            <div className="mb-4">
              <p className="text-[13px] font-semibold text-[#1F2937] mb-2">
                What's Included:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {listing.whatsIncluded.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs text-[#6B7280]"
                  >
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating & Regions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm mb-4 sm:mb-0">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="font-semibold text-[#1F2937]">
                {listing.rating}
              </span>
              <span className="text-[#6B7280]">({listing.reviews} reviews)</span>
            </div>
            <span className="text-[#6B7280] hidden sm:inline">•</span>
            <span className="font-semibold text-[#1F2937]">
              {listing.regions} regions
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="h-10 px-5 text-sm flex-1 sm:flex-none"
            onClick={onEdit}
          >
            <span className="hidden sm:inline">Edit Service</span>
            <span className="sm:hidden">Edit</span>
          </Button>
          <Button
            variant="outline"
            className="h-10 px-5 text-sm border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] flex-1 sm:flex-none"
            onClick={onDeactivate}
          >
            Deactivate
          </Button>
        </div>
      </div>
    </div>
  );
}