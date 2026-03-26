import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { api } from "../../../services/api";
import {
  ArrowLeft,
  Pause,
  Play,
  Copy,
  Check,
  MapPin,
  Building2,
  Download,
  FileText,
  TrendingUp,
  Star,
  Package,
  BarChart3,
  Shield,
  CheckCircle2,
  X,
  DollarSign,
  Calendar,
  Bed,
  Bath,
  Users,
  Maximize2,
  Wifi,
  Utensils,
  Wind,
  Flame,
  Tv,
  Car,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface VendorData {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  businessType: string;
  logoUrl?: string;
  category: string;
  status: "active" | "pending" | "inactive" | "suspended" | "trial";
  joinedDate: string;
  trialDaysLeft?: number;
  stats: {
    totalRevenue: number;
    totalBookings: number;
    avgRating: number;
    reviewCount: number;
  };
  subscription: {
    plan: string;
    status: string;
    monthlyFee: number;
    nextBillingDate: string;
  };
  regions: {
    name: string;
    listingsCount: number;
    isActive: boolean;
  }[];
}

interface ServiceListing {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  basePrice: number;
  maxPrice?: number;
  pricingType: "fixed" | "hourly" | "range";
  duration?: string; // For hourly services: "1-2 hours", "2-3 hours", etc.
  thumbnail?: string;
  imageGallery: string[];
  whatsIncluded: string[];
  bookings: number;
  bookingTrend: number;
  isActive: boolean;
  regions: string[];
  rating?: number;
  reviews?: number;
  status: "published" | "draft";
  // Rental Properties specific fields
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  totalArea?: number;
  areaUnit?: string;
  amenities?: string[];
  // Ride Assistance specific fields
  vehicleTypes?: string[];
  specialFeatures?: string[];
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  const colors: Record<string, { dot: string; text: string }> = {
    active: { dot: "bg-[#10B981]", text: "text-[#10B981]" },
    pending: { dot: "bg-[#F59E0B]", text: "text-[#F59E0B]" },
    inactive: { dot: "bg-[#9CA3AF]", text: "text-[#9CA3AF]" },
    suspended: { dot: "bg-[#DC2626]", text: "text-[#DC2626]" },
    trial: { dot: "bg-[#3B82F6]", text: "text-[#3B82F6]" },
  };
  return colors[status] || colors.inactive;
};
const getStatusColor = (status: string) => {
  const colors: Record<string, { dot: string; text: string }> = {
    active: { dot: "bg-[#10B981]", text: "text-[#10B981]" },
    pending: { dot: "bg-[#F59E0B]", text: "text-[#F59E0B]" },
    inactive: { dot: "bg-[#9CA3AF]", text: "text-[#9CA3AF]" },
    suspended: { dot: "bg-[#DC2626]", text: "text-[#DC2626]" },
    trial: { dot: "bg-[#3B82F6]", text: "text-[#3B82F6]" },
  };
  return colors[status] || colors.inactive;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Active",
    pending: "Pending",
    inactive: "Inactive",
    suspended: "Suspended",
    trial: "Trial",
  };
  return labels[status] || status;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-[#10B981]" />
      ) : (
        <Copy className="w-4 h-4 text-[#6B7280]" />
      )}
    </button>
  );
}

function VendorListingCard({ listing, isProductListing, isRentalProperty, isRideAssistance, isCompanionshipSupport }: { listing: ServiceListing; isProductListing?: boolean; isRentalProperty?: boolean; isRideAssistance?: boolean; isCompanionshipSupport?: boolean }) {
  const [showDetails, setShowDetails] = useState(false);

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, JSX.Element> = {
      "WiFi": <Wifi className="w-4 h-4 text-[#1F2937]" />,
      "Kitchen": <Utensils className="w-4 h-4 text-[#1F2937]" />,
      "AC": <Wind className="w-4 h-4 text-[#1F2937]" />,
      "Air Conditioning": <Wind className="w-4 h-4 text-[#1F2937]" />,
      "Heating": <Flame className="w-4 h-4 text-[#1F2937]" />,
      "TV": <Tv className="w-4 h-4 text-[#1F2937]" />,
    };
    return iconMap[amenity] || <CheckCircle2 className="w-4 h-4 text-[#1F2937]" />;
  };

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
    <>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-5 hover:border-[#1F2937] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all">
        <div className="flex gap-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {listing.thumbnail ? (
              <img
                src={listing.thumbnail}
                alt={listing.name}
                className="w-[180px] h-[180px] rounded-lg object-cover"
              />
            ) : (
              <div className="w-[180px] h-[180px] rounded-lg bg-[#F8F9FA] flex items-center justify-center">
                <Building2 className="w-12 h-12 text-[#9CA3AF]" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-[#1F2937] mb-1.5">{listing.name}</h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {listing.shortDescription}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-[#E5E7EB]">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">💵 Price</p>
                <p className="text-sm font-semibold text-[#1F2937]">{formatPrice()}</p>
                {listing.duration && listing.pricingType === "hourly" && (
                  <p className="text-xs text-[#6B7280] mt-0.5">{listing.duration}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">📅 Bookings</p>
                <p className="text-sm font-semibold text-[#1F2937] flex items-center gap-2">
                  {listing.bookings}
                  {listing.bookingTrend !== 0 && (
                    <span className={`text-xs font-normal ${listing.bookingTrend > 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                      {listing.bookingTrend > 0 ? '+' : ''}{listing.bookingTrend}%
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Status</p>
                <p className={`text-sm font-semibold flex items-center gap-1.5 ${listing.isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                  <span className={`w-2 h-2 rounded-full ${listing.isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                  {listing.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {/* What's Included */}
            {!isProductListing && listing.whatsIncluded && listing.whatsIncluded.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-[#1F2937] mb-2">What's Included:</p>
                <div className="flex flex-wrap gap-2">
                  {listing.whatsIncluded.slice(0, 3).map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F9FA] text-[#1F2937] text-xs rounded-lg"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                      {item}
                    </span>
                  ))}
                  {listing.whatsIncluded.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-1 text-[#6B7280] text-xs">
                      +{listing.whatsIncluded.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Rental Property Details */}
            {isRentalProperty && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-3 text-xs text-[#6B7280]">
                  {listing.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5" />
                      <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5" />
                      <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {listing.maxGuests && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{listing.maxGuests} guest{listing.maxGuests !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {listing.totalArea && (
                    <div className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{listing.totalArea} {listing.areaUnit || 'sq ft'}</span>
                    </div>
                  )}
                </div>
                {listing.amenities && listing.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {listing.amenities.slice(0, 4).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#F8F9FA] text-[#1F2937] text-xs rounded-lg"
                      >
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </span>
                    ))}
                    {listing.amenities.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 text-[#6B7280] text-xs">
                        +{listing.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Ride Assistance Details */}
            {isRideAssistance && listing.vehicleTypes && listing.vehicleTypes.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-[#1F2937] mb-2">Vehicle Types:</p>
                <div className="flex flex-wrap gap-2">
                  {listing.vehicleTypes.map((vehicle, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F9FA] text-[#1F2937] text-xs rounded-lg"
                    >
                      <Car className="w-3 h-3" />
                      {vehicle}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rating & Regions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 text-xs text-[#6B7280]">
                {listing.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>{listing.rating} ({listing.reviews} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{listing.regions.length} region{listing.regions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-4 text-xs font-semibold"
                onClick={() => setShowDetails(true)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal - Abbreviated for space */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-5 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-[#1F2937]">Listing Details</h2>
              <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#1F2937] mb-2">{listing.name}</h3>
                <p className="text-[#6B7280]">{listing.longDescription || listing.shortDescription}</p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#1F2937] mb-3">Pricing</h4>
                <p className="text-2xl font-bold text-[#1F2937]">{formatPrice()}</p>
                {listing.duration && <p className="text-sm text-[#6B7280] mt-1">{listing.duration}</p>}
              </div>
              {!isProductListing && listing.whatsIncluded && listing.whatsIncluded.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#1F2937] mb-3">What's Included</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {listing.whatsIncluded.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-[#1F2937]">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {listing.regions && listing.regions.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#1F2937] mb-3">Service Regions</h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.regions.map((region, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-2 bg-[#F8F9FA] text-[#1F2937] text-sm rounded-lg">
                        <MapPin className="w-4 h-4" />
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {listing.imageGallery && listing.imageGallery.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#1F2937] mb-3">Image Gallery</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {listing.imageGallery.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img src={image} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setShowDetails(false)} className="h-11 px-6">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function VendorDetail() {
  const { id } = useParams();
  const location = useLocation();

  // Detect if this is a Michelle store based on the URL path
  const isMichelleStore = location.pathname.includes('/vendors/michelle/');

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
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch vendor details and listings from API
  useEffect(() => {
    const fetchVendorData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch vendor details
        const vendorData: any = isMichelleStore 
          ? await api.getMichelleProfileById(id)
          : await api.getVendorById(id);

        // Map API response to VendorData interface
        const mappedVendor: VendorData = {
          id: vendorData.id || id,
          businessName: vendorData.businessName || vendorData.name || "Unknown",
          ownerName: vendorData.ownerName || vendorData.owner || "Unknown",
          email: vendorData.email || "",
          phone: vendorData.phone || "",
          address: vendorData.address || vendorData.businessAddress || "",
          taxId: vendorData.taxId || "",
          businessType: vendorData.businessType || "",
          category: vendorData.category || "General",
          status: (vendorData.status?.toLowerCase() || "active") as any,
          joinedDate: vendorData.createdAt || vendorData.joinedDate || "",
          trialDaysLeft: vendorData.trialDaysLeft,
          stats: {
            totalRevenue: vendorData.stats?.totalRevenue || vendorData.totalRevenue || 0,
            totalBookings: vendorData.stats?.totalBookings || vendorData.totalBookings || 0,
            avgRating: vendorData.stats?.avgRating || vendorData.averageRating || 0,
            reviewCount: vendorData.stats?.reviewCount || vendorData.reviewCount || 0,
          },
          subscription: {
            plan: vendorData.subscription?.plan || vendorData.subscriptionPlan || "Basic",
            status: vendorData.subscription?.status || "Active",
            monthlyFee: vendorData.subscription?.monthlyFee || 0,
            nextBillingDate: vendorData.subscription?.nextBillingDate || "",
          },
          regions: vendorData.regions?.map((r: any) => ({
            name: r.name || r.regionName,
            listingsCount: r.listingsCount || 0,
            isActive: r.isActive !== false,
          })) || [],
        };

        setVendor(mappedVendor);

        // Fetch vendor listings
        const listingsData: any = isMichelleStore
          ? await api.getMichelleProfileListings(id)
          : await api.getVendorListings(id);

        const mappedListings: ServiceListing[] = (listingsData.listings || listingsData || []).map((listing: any) => ({
          id: listing.id,
          name: listing.name || listing.title,
          shortDescription: listing.shortDescription || listing.description || "",
          longDescription: listing.longDescription || listing.description || "",
          basePrice: listing.basePrice || listing.price || 0,
          maxPrice: listing.maxPrice,
          pricingType: listing.pricingType || "fixed",
          duration: listing.duration,
          thumbnail: listing.thumbnail || listing.image,
          imageGallery: listing.imageGallery || listing.images || [],
          whatsIncluded: listing.whatsIncluded || listing.features || [],
          bookings: listing.bookings || 0,
          bookingTrend: listing.bookingTrend || 0,
          isActive: listing.isActive !== false,
          regions: listing.regions || [],
          rating: listing.rating || listing.averageRating,
          reviews: listing.reviews || listing.reviewCount,
          status: listing.status || "published",
          // Rental properties specific
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          maxGuests: listing.maxGuests,
          squareFeet: listing.squareFeet,
          amenities: listing.amenities,
        }));

        setListings(mappedListings);
      } catch (err: any) {
        console.error("Failed to fetch vendor data:", err);
        setError(err.response?.data?.error || "Failed to load vendor details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [id, isMichelleStore]);

  const statusColor = getStatusColor(vendor.status);
  
  // Determine if this vendor is a handyman or beauty services category
  const isHandymanVendor = vendor.category === "Handyman Services";
  const isBeautyServicesVendor = vendor.category === "Beauty Services";
  const isBeautyProductsVendor = vendor.category === "Beauty Products";
  const isGroceryVendor = vendor.category === "Grocery";
  const isFoodVendor = vendor.category === "Food";
  const isRentalPropertiesVendor = vendor.category === "Rental Properties";
  const isRideAssistanceVendor = vendor.category === "Ride Assistance";
  const isCompanionshipSupportVendor = vendor.category === "Companionship Support";

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu={isMichelleStore ? "michelle" : "vendors"}
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
          {/* Back Navigation */}
          <Link
            to={isMichelleStore ? "/admin/michelle-profiles" : "/admin/vendors"}
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isMichelleStore ? "Back to Michelle's Stores" : "Back to All Vendors"}
            </span>
            <span className="sm:hidden">
              {isMichelleStore ? "Back to Stores" : "Back to Vendors"}
            </span>
          </Link>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937]">
              <span className="hidden sm:inline">Vendor Details: {vendor.businessName}</span>
              <span className="sm:hidden">Vendor Details</span>
            </h1>
          </div>

          {/* Header Section */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 lg:p-7 mb-6">
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
              {/* Logo */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                {vendor.logoUrl ? (
                  <img
                    src={vendor.logoUrl}
                    alt={vendor.businessName}
                    className="w-20 h-20 lg:w-[100px] lg:h-[100px] rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 lg:w-[100px] lg:h-[100px] rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center">
                    <Building2 className="w-10 h-10 lg:w-12 lg:h-12 text-[#9CA3AF]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl lg:text-[28px] font-bold text-[#1F2937] mb-2">
                      {vendor.businessName}
                    </h2>
                    {isMichelleStore && (
                      <div className="inline-flex items-center gap-1 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        Powered by DoHuub
                      </div>
                    )}
                    <p className="text-sm lg:text-base text-[#6B7280] mb-2">
                      {vendor.stats.reviewCount} reviews • {vendor.stats.avgRating} ⭐ average
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${statusColor.dot}`} />
                      <span className={`text-sm lg:text-base font-semibold ${statusColor.text}`}>
                        {getStatusLabel(vendor.status)}
                      </span>
                    </div>
                    <p className="text-sm lg:text-base text-[#6B7280] mb-1">
                      Owner: {vendor.ownerName}
                    </p>
                    <p className="text-sm lg:text-[15px] text-[#6B7280] mb-1">
                      🧹 {vendor.category}
                    </p>
                    <p className="text-xs lg:text-sm text-[#9CA3AF]">
                      Joined: {new Date(vendor.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {!isMichelleStore && (vendor.status === "active" || vendor.status === "trial" ? (
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none h-11 text-[#DC2626] border-[#FEE2E2] hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                  ) : vendor.status === "suspended" ? (
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none h-11 text-[#10B981] border-[#D1FAE5] hover:bg-[#D1FAE5] hover:text-[#10B981]"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Unsuspend
                    </Button>
                  ) : null)}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop Tabs */}
            <div className="hidden lg:block">
              <TabsList className="w-full justify-start bg-white border border-[#E5E7EB] rounded-t-xl h-[52px] p-0">
                <TabsTrigger value="overview" className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937]">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="listings" className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937]">
                  Listings
                </TabsTrigger>
                {!isMichelleStore && (
                  <TabsTrigger value="subscription" className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937]">
                    Subscription
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {/* Mobile Tab Selector */}
            <div className="lg:hidden mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="h-12 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="listings">Listings</SelectItem>
                  {!isMichelleStore && (
                    <SelectItem value="subscription">Subscription</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Tab Content Container */}
            <div className="bg-white border border-[#E5E7EB] border-t-0 rounded-b-xl lg:rounded-t-none p-5 sm:p-6 lg:p-8">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-8">
                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Total Revenue</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1F2937] mb-1">
                        ${vendor.stats.totalRevenue.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-[#10B981]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+23%</span>
                      </div>
                    </div>

                    <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Total Bookings</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1F2937] mb-1">
                        {vendor.stats.totalBookings}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-[#10B981]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+15%</span>
                      </div>
                    </div>

                    <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Average Rating</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1F2937] mb-1">
                        {vendor.stats.avgRating} ⭐
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {vendor.stats.reviewCount} reviews
                      </p>
                    </div>

                    <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Subscription</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1F2937] mb-1">
                        {vendor.subscription.status}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {vendor.subscription.plan}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-12">
                    {/* Business Name */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Business Name</label>
                      <div className="flex items-center">
                        <p className="text-base text-[#1F2937]">{vendor.businessName}</p>
                        <CopyButton text={vendor.businessName} />
                      </div>
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Owner Name</label>
                      <p className="text-base text-[#1F2937]">{vendor.ownerName}</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Email</label>
                      <div className="flex items-center">
                        <a
                          href={`mailto:${vendor.email}`}
                          className="text-base text-[#3B82F6] hover:underline"
                        >
                          {vendor.email}
                        </a>
                        <CopyButton text={vendor.email} />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Phone</label>
                      <div className="flex items-center">
                        <a
                          href={`tel:${vendor.phone}`}
                          className="text-base text-[#3B82F6] hover:underline"
                        >
                          {vendor.phone}
                        </a>
                        <CopyButton text={vendor.phone} />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Business Address</label>
                      <div className="flex items-center">
                        <p className="text-base text-[#1F2937]">{vendor.address}</p>
                        <CopyButton text={vendor.address} />
                      </div>
                    </div>

                    {/* Tax ID */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Tax ID/EIN</label>
                      <p className="text-base text-[#1F2937]">{vendor.taxId}</p>
                    </div>

                    {/* Business Type */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Business Type</label>
                      <p className="text-base text-[#1F2937]">{vendor.businessType}</p>
                    </div>
                  </div>
                </div>

                {/* Active Regions */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1F2937]">
                      Active Regions
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      Geographic areas where this vendor operates
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {vendor.regions.map((region, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg"
                      >
                        <MapPin className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-sm text-[#1F2937]">{region.name}</span>
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span className="text-xs text-[#6B7280]">
                          {region.listingsCount} listings
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Listings Tab */}
              <TabsContent value="listings" className="mt-0">
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#1F2937] mb-2">
                      {isRentalPropertiesVendor ? "Property Listings" : (isBeautyProductsVendor || isGroceryVendor || isFoodVendor) ? "Product Listings" : "Service Listings"}
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      {isRentalPropertiesVendor
                        ? "All active and inactive property listings from this vendor"
                        : (isBeautyProductsVendor || isGroceryVendor || isFoodVendor) 
                        ? "All active and inactive product offerings from this vendor" 
                        : "All active and inactive service offerings from this vendor"}
                    </p>
                  </div>
                  <div className="space-y-5">
                    {isHandymanVendor ? mockHandymanListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} />
                    )) : isBeautyServicesVendor ? mockBeautyServicesListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} />
                    )) : isBeautyProductsVendor ? mockBeautyProductsListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={true} />
                    )) : isGroceryVendor ? mockGroceryProductListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={true} />
                    )) : isFoodVendor ? mockFoodProductListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={true} />
                    )) : isRentalPropertiesVendor ? mockRentalPropertiesListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} isRentalProperty={true} />
                    )) : isRideAssistanceVendor ? mockRideAssistanceListings
                      .filter((listing) => {
                        // Filter for Michelle profiles - one listing per store
                        if (id === "25") return listing.id === "1"; // CareWheels
                        if (id === "26") return listing.id === "2"; // Senior Care Rides
                        if (id === "27") return listing.id === "3"; // SafeTransit
                        // For regular vendors (28, 29, 30), show the corresponding listing
                        if (id === "28") return listing.id === "1"; // CareWheels
                        if (id === "29") return listing.id === "2"; // Senior Care Rides
                        if (id === "30") return listing.id === "3"; // SafeTransit
                        return true;
                      })
                      .map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} isRideAssistance={true} />
                    )) : isCompanionshipSupportVendor ? mockCompanionshipSupportListings
                      .filter((listing) => {
                        // Filter for Michelle profiles - one listing per store
                        if (id === "32") return listing.id === "1"; // Caring Companions
                        if (id === "33") return listing.id === "2"; // Senior Care Network
                        if (id === "34") return listing.id === "3"; // Compassionate Care
                        // For regular vendors (35, 36, 37), show the corresponding listing
                        if (id === "35") return listing.id === "1"; // Caring Hearts
                        if (id === "36") return listing.id === "2"; // Golden Years
                        if (id === "37") return listing.id === "3"; // Friendship & Care
                        return true;
                      })
                      .map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} isCompanionshipSupport={true} />
                    )) : mockVendorListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="mt-0">
                <div className="space-y-6">
                  {/* Current Subscription */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#1F2937]">Current Subscription</h3>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-[#10B981]" />
                        <span className="text-base font-semibold text-[#10B981]">Active</span>
                      </div>
                    </div>

                    {/* Plan Details Card */}
                    <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-5 sm:p-6 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Plan</p>
                          <p className="text-lg font-bold text-[#1F2937]">Yearly Subscription</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Price</p>
                          <p className="text-lg font-bold text-[#1F2937]">$39.00/month</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Billing</p>
                          <p className="text-base text-[#1F2937]">Billed $468 annually</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Next Billing</p>
                          <p className="text-base text-[#1F2937]">
                            Feb 15, 2026 <span className="text-[#6B7280]">(in 41 days)</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Subscription Start</p>
                          <p className="text-base text-[#1F2937]">Jan 15, 2025</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Duration</p>
                          <p className="text-base text-[#1F2937]">12 months</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}