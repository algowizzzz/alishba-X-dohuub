import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import {
  ArrowLeft,
  Plus,
  Edit,
  MapPin,
  Star,
  Building2,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
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

function ServiceListingCard({ listing }: { listing: ServiceListing }) {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [isActive, setIsActive] = useState(listing.isActive);
  const isRentalProperty = profileId === "22" || profileId === "23" || profileId === "24";

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
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 sm:p-6 lg:p-7 mb-6 hover:border-[#2E7AD9] hover:shadow-[0_4px_16px_rgba(46,122,217,0.20)] transition-all">
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
            <div className="w-full sm:w-[200px] h-[200px] rounded-lg bg-white flex items-center justify-center">
              <Building2 className="w-12 h-12 text-[#9CA3AF]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] mb-1.5 break-words">{listing.name}</h3>
              <p className="text-sm sm:text-[15px] text-[#6B7280] mb-4 leading-relaxed">
                {listing.shortDescription}
              </p>
            </div>
          </div>

          {/* Pricing & Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-[rgba(46,122,217,0.25)]">
            {/* Price */}
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">💵 Price</p>
              <p className="text-base font-semibold text-[#1A1A2E]">
                {formatPrice()}
              </p>
              {listing.duration && listing.pricingType === "hourly" && (
                <p className="text-xs text-[#6B7280] mt-0.5">Est: {listing.duration}</p>
              )}
            </div>

            {/* Bookings */}
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">📅 Bookings</p>
              <p className="text-base font-semibold text-[#1A1A2E] flex items-center gap-2">
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
              <p className="text-sm font-semibold text-[#1A1A2E] mb-2">What's Included:</p>
              <div className="flex flex-wrap gap-2">
                {listing.whatsIncluded.slice(0, 4).map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#1A1A2E] text-xs rounded-lg"
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

function EmptyState() {
  const navigate = useNavigate();
  const { profileId } = useParams();
  
  // Check if this is a Beauty Products or Grocery profile
  const isBeautyProductsProfile = profileId === "13" || profileId === "14" || profileId === "15";
  const isGroceryProfile = profileId === "7" || profileId === "8" || profileId === "9";
  const isFoodProfile = profileId === "19" || profileId === "20" || profileId === "21";
  const isRentalPropertiesProfile = profileId === "22" || profileId === "23" || profileId === "24";
  const isRideAssistanceProfile = profileId === "25" || profileId === "26" || profileId === "27";
  const isCompanionshipSupportProfile = profileId === "32" || profileId === "33" || profileId === "34";
  const isProductProfile = isBeautyProductsProfile || isGroceryProfile || isFoodProfile;

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center mb-6">
        <Building2 className="w-16 h-16 text-[rgba(46,122,217, 0.18)]" />
      </div>
      <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">
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
        className="h-11 px-6 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white"
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

  // Determine which listings and profile data to show based on profileId
  // Profile IDs: "1", "2", "3" are Cleaning Services
  // Profile IDs: "4", "5", "6" are Handyman Services
  // Profile IDs: "10", "11", "12" are Beauty Services
  // Profile IDs: "13", "14", "15" are Beauty Products
  // Profile IDs: "7", "8", "9" are Grocery
  // Profile IDs: "19", "20", "21" are Food
  // Profile IDs: "22", "23", "24" are Rental Properties
  // Profile IDs: "25", "26", "27" are Ride Assistance
  const isCleaningProfile = profileId === "1" || profileId === "2" || profileId === "3";
  const isHandymanProfile = profileId === "4" || profileId === "5" || profileId === "6";
  const isBeautyServicesProfile = profileId === "10" || profileId === "11" || profileId === "12";
  const isBeautyProductsProfile = profileId === "13" || profileId === "14" || profileId === "15";
  const isGroceryProfile = profileId === "7" || profileId === "8" || profileId === "9";
  const isFoodProfile = profileId === "19" || profileId === "20" || profileId === "21";
  const isRentalPropertiesProfile = profileId === "22" || profileId === "23" || profileId === "24";
  const isRideAssistanceProfile = profileId === "25" || profileId === "26" || profileId === "27";
  const isCompanionshipSupportProfile = profileId === "32" || profileId === "33" || profileId === "34";
  
  // Mock-fallback removed — empty state is shown when API returns 0 rows.
  const fallbackListings: ServiceListing[] = [];

  const [apiListings, setApiListings] = useState<ServiceListing[] | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    api
      .get<{ success: boolean; data: any[] }>(`/api/v1/admin/michelle-profiles/${profileId}/listings?limit=100`)
      .then((r) => {
        const data = (r as any)?.data || [];
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ServiceListing[] = data.map((l: any) => ({
            id: l.id,
            name: l.title || l.name || "Untitled",
            shortDescription: l.shortDescription || l.description?.slice(0, 100) || "",
            longDescription: l.description || "",
            basePrice: Number(l.basePrice ?? l.price ?? 0),
            pricingType: (l.pricingType as any) || "fixed",
            thumbnail: Array.isArray(l.images) ? l.images[0] : undefined,
            imageGallery: Array.isArray(l.images) ? l.images : [],
            whatsIncluded: Array.isArray(l.includes) ? l.includes : [],
            bookings: l._count?.bookings || 0,
            bookingTrend: 0,
            isActive: l.status === "ACTIVE",
            regions: [],
            rating: l.rating || undefined,
            reviews: l.reviewCount || undefined,
            status: l.status === "DRAFT" ? "draft" : "published",
          }));
          setApiListings(mapped);
          setUsingDemoData(false);
        } else {
          setApiListings(null);
          setUsingDemoData(true);
        }
      })
      .catch(() => {
        setApiListings(null);
        setUsingDemoData(true);
      });
  }, [profileId]);

  const currentListings = apiListings ?? fallbackListings;
  
  // Mock profile data
  const getProfileInfo = () => {
    if (profileId === "1") return { name: "Sparkle Clean by Michelle", category: "🧹 Cleaning Services" };
    if (profileId === "2") return { name: "Michelle's Deep Clean Express", category: "🧹 Cleaning Services" };
    if (profileId === "3") return { name: "Green & Clean by Michelle", category: "🧹 Cleaning Services" };
    if (profileId === "4") return { name: "Fix-It Pro by Michelle", category: "🔧 Handyman Services" };
    if (profileId === "5") return { name: "Michelle's Home Repair Hub", category: "🔧 Handyman Services" };
    if (profileId === "6") return { name: "Handyman Express Solutions", category: "🔧 Handyman Services" };
    if (profileId === "7") return { name: "Fresh Harvest by Michelle", category: "🛒 Grocery" };
    if (profileId === "8") return { name: "Organic Essentials Delivery", category: "🛒 Grocery" };
    if (profileId === "9") return { name: "Michelle's Meal Prep & Groceries", category: "🛒 Grocery" };
    if (profileId === "10") return { name: "Beauty by Michelle", category: "💄 Beauty Services" };
    if (profileId === "11") return { name: "Glam Studio Mobile", category: "💄 Beauty Services" };
    if (profileId === "12") return { name: "Michelle's Spa On-The-Go", category: "💄 Beauty Services" };
    if (profileId === "13") return { name: "Glam Cosmetics Shop", category: "🛍️ Beauty Products" };
    if (profileId === "14") return { name: "Pure Skincare Boutique", category: "🛍️ Beauty Products" };
    if (profileId === "15") return { name: "Beauty Essentials by Michelle", category: "🛍️ Beauty Products" };
    if (profileId === "19") return { name: "Mama's Kitchen", category: "🍲 Food" };
    if (profileId === "20") return { name: "Chef's Table by Michelle", category: "🍲 Food" };
    if (profileId === "21") return { name: "Homestyle Meals", category: "🍲 Food" };
    if (profileId === "22") return { name: "Michelle's Properties", category: "🏠 Rental Properties" };
    if (profileId === "23") return { name: "Urban Stays by Michelle", category: "🏠 Rental Properties" };
    if (profileId === "24") return { name: "Cozy Rentals", category: "🏠 Rental Properties" };
    if (profileId === "25") return { name: "CareWheels Transportation", category: "🚗 Ride Assistance" };
    if (profileId === "26") return { name: "Senior Care Rides", category: "🚗 Ride Assistance" };
    if (profileId === "27") return { name: "SafeTransit Solutions", category: "🚗 Ride Assistance" };
    if (profileId === "32") return { name: "Caring Companions by Michelle", category: "🤝 Companionship Support" };
    if (profileId === "33") return { name: "Michelle's Senior Care Network", category: "🤝 Companionship Support" };
    if (profileId === "34") return { name: "Compassionate Care Services", category: "🤝 Companionship Support" };
    return { name: "Sparkle Clean by Michelle", category: "🧹 Cleaning Services" };
  };
  
  const { name: profileName, category: profileCategory } = getProfileInfo();
  
  const activeListings = currentListings.filter(l => l.isActive);
  const inactiveListings = currentListings.filter(l => !l.isActive);
  const totalBookings = currentListings.reduce((sum, l) => sum + l.bookings, 0);

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
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
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profiles
          </Link>

          {/* Page Header */}
          <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-4">
            Manage Listings: {profileName}
          </h1>

          {/* Profile Context */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg px-4 sm:px-5 py-4 mb-6 sm:mb-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm sm:text-base font-semibold text-[#1A1A2E] mb-1">
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
                className="h-11 px-6 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white font-semibold w-full sm:w-auto"
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

          {/* Listings */}
          {currentListings.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Active Listings */}
              {activeListings.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#1A1A2E] mb-5">
                    Active Listings ({activeListings.length})
                  </h2>
                  {activeListings.map((listing) => (
                    <ServiceListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}

              {/* Inactive Listings */}
              {inactiveListings.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowInactive(!showInactive)}
                    className="flex items-center gap-2 text-xl font-bold text-[#1A1A2E] mb-5 hover:text-[#1A1A2E] transition-colors"
                  >
                    <span>Inactive Listings ({inactiveListings.length})</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${showInactive ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showInactive && (
                    <div>
                      {inactiveListings.map((listing) => (
                        <ServiceListingCard key={listing.id} listing={listing} />
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