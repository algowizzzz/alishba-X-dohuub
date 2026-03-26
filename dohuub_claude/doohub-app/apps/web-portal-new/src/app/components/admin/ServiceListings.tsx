import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  MapPin,
  Star,
  Building2,
  ChevronDown,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { api } from "../../../services/api";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface ServiceListing {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  basePrice: number;
  maxPrice?: number;
  pricingType: "fixed" | "hourly" | "range";
  duration?: string; // For hourly services
  thumbnail?: string;
  imageGallery: string[];
  whatsIncluded: string[];
  vehicleTypes?: string[]; // For Ride Assistance category
  specialFeatures?: string[]; // For Ride Assistance category
  bookings: number;
  bookingTrend: number;
  isActive: boolean;
  regions: string[];
  rating?: number;
  reviews?: number;
  status: "published" | "draft";
}


function ServiceListingCard({ listing, profileCategory }: { listing: ServiceListing; profileCategory: string }) {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [isActive, setIsActive] = useState(listing.isActive);
  const isRentalProperty = profileCategory === "Rental Properties";

  const formatPrice = () => {
    if (listing.pricingType === "range" && listing.maxPrice) {
      return `$${listing.basePrice} - $${listing.maxPrice}${isRentalProperty ? "/night" : ""}`;
    } else if (listing.pricingType === "hourly") {
      return `$${listing.basePrice}/hour`;
    } else {
      return `$${listing.basePrice}${isRentalProperty ? "/night" : ""}`;
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6 lg:p-7 mb-6 hover:border-[#1F2937] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-7">
        {/* Thumbnail Image */}
        <div className="flex-shrink-0">
          {listing.thumbnail ? (
            <img
              src={listing.thumbnail}
              alt={listing.name}
              className="w-full sm:w-[200px] h-[200px] rounded-lg object-cover"
            />
          ) : (
            <div className="w-full sm:w-[200px] h-[200px] rounded-lg bg-[#F8F9FA] flex items-center justify-center">
              <Building2 className="w-12 h-12 text-[#9CA3AF]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-1.5 break-words">{listing.name}</h3>
              <p className="text-sm sm:text-[15px] text-[#6B7280] mb-4 leading-relaxed">
                {listing.shortDescription}
              </p>
            </div>
          </div>

          {/* Pricing & Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-[#E5E7EB]">
            {/* Price */}
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">💵 Price</p>
              <p className="text-base font-semibold text-[#1F2937]">
                {formatPrice()}
              </p>
              {listing.duration && listing.pricingType === "hourly" && (
                <p className="text-xs text-[#6B7280] mt-0.5">Est: {listing.duration}</p>
              )}
            </div>

            {/* Bookings */}
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">📅 Bookings</p>
              <p className="text-base font-semibold text-[#1F2937] flex items-center gap-2">
                {listing.bookings}
                {listing.bookingTrend !== 0 && (
                  <span className={`text-[13px] font-normal ${listing.bookingTrend > 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                    {listing.bookingTrend > 0 ? '+' : ''}{listing.bookingTrend}%
                  </span>
                )}
              </p>
            </div>

            {/* Active Status */}
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Status</p>
              <p className={`text-base font-semibold flex items-center gap-1.5 ${isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                {isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          {/* What's Included */}
          {listing.whatsIncluded && listing.whatsIncluded.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#1F2937] mb-2">What's Included:</p>
              <div className="flex flex-wrap gap-2">
                {listing.whatsIncluded.slice(0, 4).map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] text-[#1F2937] text-xs rounded-lg"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    {item}
                  </span>
                ))}
                {listing.whatsIncluded.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1.5 text-[#6B7280] text-xs">
                    +{listing.whatsIncluded.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rating & Regions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-[#6B7280] mb-4 sm:mb-0">
            {listing.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{listing.rating} ({listing.reviews} reviews)</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>
                {listing.regions.length} region{listing.regions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-[140px]">
          <Button
            variant="outline"
            size="sm"
            className="h-10 justify-center sm:justify-start text-sm flex-1 sm:flex-none"
            onClick={() => navigate(`/admin/michelle-profiles/${profileId}/listings/edit/${listing.id}`)}
          >
            <Edit className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit Service</span>
            <span className="sm:hidden">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`h-10 justify-center sm:justify-start text-sm flex-1 sm:flex-none ${isActive ? 'text-[#DC2626] border-[#DC2626] hover:bg-[#FEE2E2]' : 'text-[#10B981] border-[#10B981] hover:bg-[#D1FAE5]'}`}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ profileCategory }: { profileCategory: string }) {
  const navigate = useNavigate();
  const { profileId } = useParams();

  // Determine profile type based on category from API
  const isBeautyProductsProfile = profileCategory === "Beauty Products";
  const isGroceryProfile = profileCategory === "Grocery";
  const isFoodProfile = profileCategory === "Food";
  const isRentalPropertiesProfile = profileCategory === "Rental Properties";
  const isRideAssistanceProfile = profileCategory === "Ride Assistance";
  const isCompanionshipSupportProfile = profileCategory === "Companionship Support";
  const isProductProfile = isBeautyProductsProfile || isGroceryProfile || isFoodProfile;

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-[120px] h-[120px] rounded-full bg-[#F8F9FA] flex items-center justify-center mb-6">
        <Building2 className="w-16 h-16 text-[#D1D5DB]" />
      </div>
      <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
        {isRentalPropertiesProfile ? "No Properties Added Yet" : isProductProfile ? "No Products Added Yet" : "No Services Added Yet"}
      </h3>
      <p className="text-[15px] text-[#6B7280] mb-6 text-center max-w-md">
        {isRentalPropertiesProfile
          ? "Add your first rental property to start accepting bookings"
          : isFoodProfile
          ? "Create your first food item for this kitchen to start selling"
          : isProductProfile 
          ? "Create your first product listing for this shop to start selling"
          : "Create your first service offering for this profile to start accepting bookings"
        }
      </p>
      <Button
        onClick={() => navigate(`/admin/michelle-profiles/${profileId}/listings/create`)}
        className="h-11 px-6 bg-[#1F2937] hover:bg-[#111827] text-white"
      >
        <Plus className="w-5 h-5 mr-2" />
        {isRentalPropertiesProfile ? "Add First Property" : isRideAssistanceProfile ? "Add First Service" : isFoodProfile ? "Add First Food Item" : isProductProfile ? "Create First Product" : "Create First Service"}
      </Button>
    </div>
  );
}

export function ServiceListings() {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [filter, setFilter] = useState("all");
  const [showInactive, setShowInactive] = useState(false);
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileInfo, setProfileInfo] = useState<{ name: string; category: string }>({ name: "Loading...", category: "" });

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Fetch listings from API
  const fetchListings = useCallback(async () => {
    if (!profileId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response: any = await api.get(`/admin/profiles/${profileId}/listings`);
      const listingsData = Array.isArray(response) ? response : response?.data || [];
      setListings(listingsData.map((l: any) => ({
        id: l.id,
        name: l.name || l.title || 'Unknown',
        shortDescription: l.shortDescription || l.description?.substring(0, 100) || '',
        longDescription: l.longDescription || l.description || '',
        basePrice: l.basePrice || l.price || 0,
        maxPrice: l.maxPrice,
        pricingType: l.pricingType || 'fixed',
        duration: l.duration,
        thumbnail: l.thumbnail || l.imageUrl || l.images?.[0],
        imageGallery: l.imageGallery || l.images || [],
        whatsIncluded: l.whatsIncluded || l.features || [],
        vehicleTypes: l.vehicleTypes,
        specialFeatures: l.specialFeatures,
        bookings: l.bookings || 0,
        bookingTrend: l.bookingTrend || 0,
        isActive: l.isActive ?? l.status === 'ACTIVE',
        regions: l.regions || [],
        rating: l.rating || 0,
        reviews: l.reviews || l.reviewCount || 0,
        status: l.status === 'draft' ? 'draft' : 'published',
      })));

      // Fetch profile info
      if (response?.profile) {
        setProfileInfo({
          name: response.profile.name || response.profile.businessName || 'Unknown Profile',
          category: response.profile.category || 'General',
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch listings:', err);
      setError(err?.response?.data?.error || 'Failed to load listings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const currentListings = listings;

  const { name: profileName, category: profileCategory } = profileInfo;
  
  const activeListings = currentListings.filter(l => l.isActive);
  const inactiveListings = currentListings.filter(l => !l.isActive);
  const totalBookings = currentListings.reduce((sum, l) => sum + l.bookings, 0);

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="michelle"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
        `}
      >
        <div className="max-w-[1400px]">
          {/* Back Navigation */}
          <Link
            to="/admin/michelle-profiles"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profiles
          </Link>

          {/* Page Header */}
          <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-4">
            Manage Listings: {profileName}
          </h1>

          {/* Profile Context */}
          <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-4 sm:px-5 py-4 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm sm:text-base font-semibold text-[#1F2937] mb-1">
                  Profile: {profileName}
                </p>
                <p className="text-sm sm:text-[15px] text-[#6B7280]">
                  Category: {profileCategory}
                </p>
              </div>
              <div className="text-xs sm:text-sm text-[#6B7280] flex flex-wrap gap-2">
                <span>{currentListings.length} listings</span>
                <span className="hidden sm:inline">•</span>
                <span>{activeListings.length} active</span>
                <span className="hidden sm:inline">•</span>
                <span>{totalBookings} bookings</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          {currentListings.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 sm:mb-8">
              <Button
                onClick={() => navigate(`/admin/michelle-profiles/${profileId}/listings/create`)}
                className="h-11 px-6 bg-[#1F2937] hover:bg-[#111827] text-white font-semibold w-full sm:w-auto"
              >
                <Plus className="w-[18px] h-[18px] mr-2" />
                {isRentalPropertiesProfile ? "Add New Property" : isFoodProfile ? "Add New Food Item" : (isBeautyProductsProfile || isGroceryProfile) ? "Create New Product" : "Create New Service"}
              </Button>

              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-11">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRentalPropertiesProfile ? "All Properties" : isFoodProfile ? "All Food Items" : (isBeautyProductsProfile || isGroceryProfile) ? "All Products" : "All Services"}</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B] flex items-center justify-between">
              <span className="text-sm font-medium">{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchListings}
                className="ml-4 border-[#DC2626] text-[#DC2626] hover:bg-[#FEE2E2]"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Listings */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#6B7280] animate-spin mb-4" />
              <p className="text-[15px] text-[#6B7280]">Loading listings...</p>
            </div>
          ) : currentListings.length === 0 ? (
            <EmptyState profileCategory={profileCategory} />
          ) : (
            <>
              {/* Active Listings */}
              {activeListings.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#1F2937] mb-5">
                    Active Listings ({activeListings.length})
                  </h2>
                  {activeListings.map((listing) => (
                    <ServiceListingCard key={listing.id} listing={listing} profileCategory={profileCategory} />
                  ))}
                </div>
              )}

              {/* Inactive Listings */}
              {inactiveListings.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowInactive(!showInactive)}
                    className="flex items-center gap-2 text-xl font-bold text-[#1F2937] mb-5 hover:text-[#111827] transition-colors"
                  >
                    <span>Inactive Listings ({inactiveListings.length})</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${showInactive ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showInactive && (
                    <div>
                      {inactiveListings.map((listing) => (
                        <ServiceListingCard key={listing.id} listing={listing} profileCategory={profileCategory} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}