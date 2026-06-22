import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import api from "../../../services/api";
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


const getStatusColor = (status: string) => {
  const colors: Record<string, { dot: string; text: string }> = {
    active: { dot: "bg-[#10B981]", text: "text-[#10B981]" },
    pending: { dot: "bg-[#F59E0B]", text: "text-[#F59E0B]" },
    inactive: { dot: "bg-[#9CA3AF]", text: "text-[#9CA3AF]" },
    suspended: { dot: "bg-[#DC2626]", text: "text-[#DC2626]" },
    trial: { dot: "bg-[#2E7AD9]", text: "text-[#2E7AD9]" },
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
      className="ml-2 p-1.5 rounded-lg hover:bg-[#F0F7FF] transition-colors"
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
      "WiFi": <Wifi className="w-4 h-4 text-[#1A1A2E]" />,
      "Kitchen": <Utensils className="w-4 h-4 text-[#1A1A2E]" />,
      "AC": <Wind className="w-4 h-4 text-[#1A1A2E]" />,
      "Air Conditioning": <Wind className="w-4 h-4 text-[#1A1A2E]" />,
      "Heating": <Flame className="w-4 h-4 text-[#1A1A2E]" />,
      "TV": <Tv className="w-4 h-4 text-[#1A1A2E]" />,
    };
    return iconMap[amenity] || <CheckCircle2 className="w-4 h-4 text-[#1A1A2E]" />;
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
      <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 mb-5 hover:border-[#2E7AD9] hover:shadow-[0_4px_16px_rgba(46,122,217,0.20)] transition-all">
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
              <div className="w-[180px] h-[180px] rounded-lg bg-white flex items-center justify-center">
                <Building2 className="w-12 h-12 text-[#9CA3AF]" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-[#1A1A2E] mb-1.5">{listing.name}</h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {listing.shortDescription}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-[rgba(46,122,217,0.25)]">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">💵 Price</p>
                <p className="text-sm font-semibold text-[#1A1A2E]">{formatPrice()}</p>
                {listing.duration && listing.pricingType === "hourly" && (
                  <p className="text-xs text-[#6B7280] mt-0.5">{listing.duration}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">📅 Bookings</p>
                <p className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-2">
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

            {/* What's Included - Only show for services, not products */}
            {!isProductListing && listing.whatsIncluded && listing.whatsIncluded.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-[#1A1A2E] mb-2">What's Included:</p>
                <div className="flex flex-wrap gap-2">
                  {listing.whatsIncluded.slice(0, 3).map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#1A1A2E] text-xs rounded-lg"
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
              
              {/* View Details Button */}
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

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[rgba(46,122,217,0.25)] px-6 py-5 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Listing Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-[#F0F7FF] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Thumbnail */}
              {listing.thumbnail ? (
                <div className="w-full h-[300px] rounded-xl overflow-hidden">
                  <img
                    src={listing.thumbnail}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-[300px] rounded-xl bg-white flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-[#9CA3AF]" />
                </div>
              )}

              {/* Service Name & Status */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-[#1A1A2E]">{listing.name}</h3>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${listing.isActive ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#F0F7FF] text-[#6B7280]'}`}>
                    <span className={`w-2 h-2 rounded-full ${listing.isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                    {listing.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
                <p className="text-[15px] text-[#6B7280] leading-relaxed">{listing.shortDescription}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Price</span>
                  </div>
                  <p className="text-xl font-bold text-[#1A1A2E]">{formatPrice()}</p>
                  <p className="text-xs text-[#6B7280] mt-1 capitalize">{listing.pricingType} pricing</p>
                  {listing.duration && listing.pricingType === "hourly" && (
                    <p className="text-xs text-[#1A1A2E] font-semibold mt-1">Est: {listing.duration}</p>
                  )}
                </div>
                
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Bookings</span>
                  </div>
                  <p className="text-xl font-bold text-[#1A1A2E]">{listing.bookings}</p>
                  {listing.bookingTrend !== 0 && (
                    <p className={`text-xs mt-1 font-semibold ${listing.bookingTrend > 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                      {listing.bookingTrend > 0 ? '↗' : '↘'} {listing.bookingTrend > 0 ? '+' : ''}{listing.bookingTrend}% this month
                    </p>
                  )}
                </div>

                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
                    <Star className="w-4 h-4" />
                    <span>Rating</span>
                  </div>
                  {listing.rating ? (
                    <>
                      <p className="text-xl font-bold text-[#1A1A2E]">{listing.rating} ⭐</p>
                      <p className="text-xs text-[#6B7280] mt-1">{listing.reviews} reviews</p>
                    </>
                  ) : (
                    <p className="text-sm text-[#9CA3AF]">No ratings yet</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-bold text-[#1A1A2E] mb-3">Full Description</h4>
                <p className="text-[15px] text-[#6B7280] leading-relaxed">{listing.longDescription}</p>
              </div>

              {/* Property Details - Only for Rental Properties */}
              {isRentalProperty && (listing.bedrooms !== undefined || listing.bathrooms !== undefined || listing.maxGuests !== undefined || listing.totalArea !== undefined) && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-4">Property Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {listing.bedrooms !== undefined && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                        <Bed className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                        <div>
                          <p className="text-lg font-bold text-[#1A1A2E]">{listing.bedrooms}</p>
                          <p className="text-xs text-[#6B7280]">Bedrooms</p>
                        </div>
                      </div>
                    )}
                    
                    {listing.bathrooms !== undefined && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                        <Bath className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                        <div>
                          <p className="text-lg font-bold text-[#1A1A2E]">{listing.bathrooms}</p>
                          <p className="text-xs text-[#6B7280]">Bathrooms</p>
                        </div>
                      </div>
                    )}
                    
                    {listing.maxGuests !== undefined && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                        <Users className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                        <div>
                          <p className="text-lg font-bold text-[#1A1A2E]">{listing.maxGuests}</p>
                          <p className="text-xs text-[#6B7280]">Max Guests</p>
                        </div>
                      </div>
                    )}
                    
                    {listing.totalArea !== undefined && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                        <Maximize2 className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                        <div>
                          <p className="text-lg font-bold text-[#1A1A2E]">{listing.totalArea} {listing.areaUnit || 'ft²'}</p>
                          <p className="text-xs text-[#6B7280]">Area</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities - Only for Rental Properties */}
              {isRentalProperty && listing.amenities && listing.amenities.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-4">Amenities</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {listing.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="text-sm text-[#1A1A2E]">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included - Special format for Ride Assistance */}
              {!isProductListing && isRideAssistance && listing.vehicleTypes && listing.specialFeatures && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-4">What's Included</h4>
                  
                  {/* Available Vehicle Types */}
                  <div className="mb-6">
                    <h5 className="text-[15px] font-semibold text-[#1A1A2E] mb-3">Available Vehicle Types</h5>
                    <div className="space-y-2">
                      {listing.vehicleTypes.map((vehicleType, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                        >
                          <Car className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                          <span className="text-[15px] text-[#1A1A2E]">{vehicleType}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Features */}
                  <div>
                    <h5 className="text-[15px] font-semibold text-[#1A1A2E] mb-3">Special Features</h5>
                    <ul className="space-y-2">
                      {listing.specialFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-[15px] text-[#1A1A2E]">
                          <span className="mt-1.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* What's Included - Standard format for other services */}
              {!isProductListing && !isRideAssistance && listing.whatsIncluded && listing.whatsIncluded.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-3">What's Included</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {listing.whatsIncluded.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                        <span className="text-sm text-[#1A1A2E]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Regions */}
              <div>
                <h4 className="text-lg font-bold text-[#1A1A2E] mb-3">Service Regions</h4>
                <div className="flex flex-wrap gap-2">
                  {listing.regions.map((region, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                    >
                      <MapPin className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-sm text-[#1A1A2E]">{region}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Gallery */}
              {listing.imageGallery && listing.imageGallery.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-3">Image Gallery</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {listing.imageGallery.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[rgba(46,122,217,0.25)] px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
                className="h-11 px-6"
              >
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

  const emptyVendor: VendorData = {
    id: id || "",
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    taxId: "",
    businessType: "",
    category: "",
    status: "inactive",
    joinedDate: "",
    stats: { totalRevenue: 0, totalBookings: 0, avgRating: 0, reviewCount: 0 },
    subscription: { plan: "—", status: "—", monthlyFee: 0, nextBillingDate: "" },
    regions: [],
  };

  // State
  const [vendor, setVendor] = useState<VendorData>(emptyVendor);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingVendor, setLoadingVendor] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [vendorListings, setVendorListings] = useState<ServiceListing[]>([]);

  const ENUM_TO_LABEL: Record<string, string> = {
    CLEANING: "Cleaning Services",
    HANDYMAN: "Handyman Services",
    BEAUTY: "Beauty Services",
    BEAUTY_PRODUCTS: "Beauty Products",
    GROCERIES: "Grocery",
    FOOD: "Food",
    RENTALS: "Rental Properties",
    RIDE_ASSISTANCE: "Ride Assistance",
    COMPANIONSHIP: "Companionship Support",
  };

  useEffect(() => {
    if (!id) return;
    setLoadingVendor(true);
    setLoadError(null);
    api
      .get<{ success: boolean; data: any }>(`/api/v1/admin/vendors/${id}`)
      .then((r) => {
        const v = (r as any)?.data;
        if (!v) {
          setLoadError("Vendor not found");
          return;
        }
        const profile = v.user?.profile;
        const ownerName = profile
          ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
          : v.user?.email?.split("@")[0] || "";
        const status =
          v.status === "SUSPENDED" ? "suspended"
          : v.subscriptionStatus === "TRIAL" ? "trial"
          : v.status === "PENDING" ? "pending"
          : v.isActive ? "active" : "inactive";
        const totalListings =
          (v._count?.cleaningListings || 0) +
          (v._count?.handymanListings || 0) +
          (v._count?.beautyListings || 0) +
          (v._count?.groceryListings || 0) +
          (v._count?.rentalListings || 0) +
          (v._count?.foodListings || 0) +
          (v._count?.beautyProductListings || 0) +
          (v._count?.rideAssistanceListings || 0) +
          (v._count?.companionshipListings || 0);

        const categoryEnum = v.categories?.[0]?.category;
        const sub = v.subscription || null;
        setVendor({
          id: v.id,
          businessName: v.businessName || "",
          ownerName: ownerName || "—",
          email: v.user?.email || v.contactEmail || "—",
          phone: v.user?.phone || v.contactPhone || "—",
          address: v.description || "—",
          taxId: "—",
          businessType: "—",
          category: categoryEnum ? (ENUM_TO_LABEL[categoryEnum] || categoryEnum) : "—",
          status: status as any,
          joinedDate: v.createdAt || "",
          logoUrl: v.logo || undefined,
          stats: {
            totalRevenue: 0,
            totalBookings: v._count?.bookings || 0,
            avgRating: v.rating || 0,
            reviewCount: v._count?.reviews || 0,
          },
          subscription: {
            plan: sub?.planId || (v.subscriptionStatus === "TRIAL" ? "Trial" : "—"),
            status: sub?.status || v.subscriptionStatus || "—",
            monthlyFee: 0,
            nextBillingDate: sub?.currentPeriodEnd || "",
          },
          regions: Array.isArray(v.stores)
            ? v.stores.flatMap((s: any) =>
                (s.regions || []).map((sr: any) => ({
                  name: sr.region
                    ? `${sr.region.city || sr.region.name}${sr.region.state ? `, ${sr.region.state}` : ""}`
                    : "",
                  listingsCount: totalListings,
                  isActive: sr.isActive ?? true,
                }))
              )
            : [],
        });
      })
      .catch((e: any) => {
        const msg = e?.response?.data?.error || e?.message || "Failed to load vendor";
        setLoadError(msg);
      })
      .finally(() => setLoadingVendor(false));
  }, [id]);

  // Fetch this vendor's actual listings (was using mock arrays per category)
  useEffect(() => {
    if (!id || !vendor.category) return;
    api
      .get<{ success: boolean; data: any[] }>(`/api/v1/admin/michelle-profiles/${id}/listings`)
      .then((r) => {
        const arr = ((r as any)?.data || []).map((row: any): ServiceListing => ({
          id: row.id,
          name: row.title || row.name || "Untitled",
          shortDescription: row.description || "",
          longDescription: row.longDescription || row.fullDescription || row.description || "",
          basePrice: Number(row.basePrice ?? row.price ?? row.hourlyRate ?? 0),
          pricingType: "fixed",
          thumbnail:
            row.image || (Array.isArray(row.images) ? row.images[0] : undefined),
          imageGallery: Array.isArray(row.images) ? row.images : [],
          whatsIncluded: Array.isArray(row.whatsIncluded) ? row.whatsIncluded : [],
          bookings: 0,
          bookingTrend: 0,
          isActive: row.status === "ACTIVE",
          regions: [],
          rating: row.rating || 0,
          reviews: row.reviewCount || 0,
          status: row.status === "DRAFT" ? "draft" : "published",
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
          maxGuests: row.maxGuests,
          amenities: row.amenities,
          vehicleTypes: row.vehicleTypes,
        }));
        setVendorListings(arr);
      })
      .catch(() => setVendorListings([]));
  }, [id, vendor.category]);

  const statusColor = getStatusColor(vendor.status);

  const [statusBusy, setStatusBusy] = useState(false);
  const handleStatusChange = async (next: "active" | "suspended") => {
    if (!id) return;
    if (next === "suspended" && !window.confirm(`Suspend ${vendor.businessName}?`)) return;
    const apiStatus = next === "suspended" ? "SUSPENDED" : "APPROVED";
    setStatusBusy(true);
    try {
      await api.patch(`/api/v1/admin/vendors/${id}/status`, { status: apiStatus });
      setVendor((prev) => ({ ...prev, status: next }));
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to update vendor status");
    } finally {
      setStatusBusy(false);
    }
  };

  // Determine if this vendor is a handyman or beauty services category
  const isHandymanVendor = vendor.category === "Handyman Services";
  const isBeautyServicesVendor = vendor.category === "Beauty Services";
  const isBeautyProductsVendor = vendor.category === "Beauty Products";
  const isGroceryVendor = vendor.category === "Grocery";
  const isFoodVendor = vendor.category === "Food";
  const isRentalPropertiesVendor = vendor.category === "Rental Properties";
  const isRideAssistanceVendor = vendor.category === "Ride Assistance";
  const isCompanionshipSupportVendor = vendor.category === "Companionship Support";

  if (loadingVendor) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Loading vendor…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-8">
        <p className="text-[#1A1A2E] font-semibold mb-2">Could not load vendor</p>
        <p className="text-sm text-[#6B7280] mb-4">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
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
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] hover:underline mb-4 sm:mb-6"
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E]">
              <span className="hidden sm:inline">Vendor Details: {vendor.businessName}</span>
              <span className="sm:hidden">Vendor Details</span>
            </h1>
          </div>

          {/* Header Section */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 lg:p-7 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
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
                  <div className="w-20 h-20 lg:w-[100px] lg:h-[100px] rounded-xl bg-white border border-[rgba(46,122,217,0.25)] flex items-center justify-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                    <Building2 className="w-10 h-10 lg:w-12 lg:h-12 text-[#9CA3AF]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl lg:text-[28px] font-bold text-[#1A1A2E] mb-2">
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
                      disabled={statusBusy}
                      onClick={() => handleStatusChange("suspended")}
                      className="flex-1 sm:flex-none h-11 text-[#DC2626] border-[#FEE2E2] hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      {statusBusy ? "Suspending..." : "Suspend"}
                    </Button>
                  ) : vendor.status === "suspended" ? (
                    <Button
                      variant="outline"
                      disabled={statusBusy}
                      onClick={() => handleStatusChange("active")}
                      className="flex-1 sm:flex-none h-11 text-[#10B981] border-[#D1FAE5] hover:bg-[#D1FAE5] hover:text-[#10B981]"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {statusBusy ? "Restoring..." : "Unsuspend"}
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
              <TabsList className="w-full justify-start bg-white border border-[rgba(46,122,217,0.25)] rounded-t-xl h-[52px] p-0">
                <TabsTrigger value="overview" className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#2E7AD9] data-[state=active]:text-[#2E7AD9]">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="listings" className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#2E7AD9] data-[state=active]:text-[#2E7AD9]">
                  Listings
                </TabsTrigger>
                {!isMichelleStore && (
                  <TabsTrigger value="subscription" className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#2E7AD9] data-[state=active]:text-[#2E7AD9]">
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
            <div className="bg-white border border-[rgba(46,122,217,0.25)] border-t-0 rounded-b-xl lg:rounded-t-none p-5 sm:p-6 lg:p-8">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-8">
                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] mb-4">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 sm:p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Total Revenue</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] mb-1">
                        ${vendor.stats.totalRevenue.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-[#10B981]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+23%</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 sm:p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Total Bookings</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] mb-1">
                        {vendor.stats.totalBookings}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-[#10B981]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+15%</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 sm:p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Average Rating</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] mb-1">
                        {vendor.stats.avgRating} ⭐
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {vendor.stats.reviewCount} reviews
                      </p>
                    </div>

                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 sm:p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Subscription</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] mb-1">
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
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] mb-4">
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-12">
                    {/* Business Name */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Business Name</label>
                      <div className="flex items-center">
                        <p className="text-base text-[#1A1A2E]">{vendor.businessName}</p>
                        <CopyButton text={vendor.businessName} />
                      </div>
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Owner Name</label>
                      <p className="text-base text-[#1A1A2E]">{vendor.ownerName}</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Email</label>
                      <div className="flex items-center">
                        <a
                          href={`mailto:${vendor.email}`}
                          className="text-base text-[#2E7AD9] hover:underline"
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
                          className="text-base text-[#2E7AD9] hover:underline"
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
                        <p className="text-base text-[#1A1A2E]">{vendor.address}</p>
                        <CopyButton text={vendor.address} />
                      </div>
                    </div>

                    {/* Tax ID */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Tax ID/EIN</label>
                      <p className="text-base text-[#1A1A2E]">{vendor.taxId}</p>
                    </div>

                    {/* Business Type */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Business Type</label>
                      <p className="text-base text-[#1A1A2E]">{vendor.businessType}</p>
                    </div>
                  </div>
                </div>

                {/* Active Regions */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E]">
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
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                      >
                        <MapPin className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-sm text-[#1A1A2E]">{region.name}</span>
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
                    <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
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
                    {vendorListings.length === 0 ? (
                      <div className="text-center py-12 text-sm text-[#6B7280] bg-white border border-[rgba(46,122,217,0.25)] rounded-xl">
                        No listings yet.
                      </div>
                    ) : vendorListings.map((listing) => (
                      <VendorListingCard
                        key={listing.id}
                        listing={listing}
                        isProductListing={isBeautyProductsVendor || isGroceryVendor || isFoodVendor}
                        isRentalProperty={isRentalPropertiesVendor}
                        isRideAssistance={isRideAssistanceVendor}
                        isCompanionshipSupport={isCompanionshipSupportVendor}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#1A1A2E]">Current Subscription</h3>
                      <div className="flex items-center gap-2">
                        <Check className={`w-5 h-5 ${vendor.subscription.status === "ACTIVE" || vendor.subscription.status === "Active" ? "text-[#10B981]" : "text-[#6B7280]"}`} />
                        <span className={`text-base font-semibold ${vendor.subscription.status === "ACTIVE" || vendor.subscription.status === "Active" ? "text-[#10B981]" : "text-[#6B7280]"}`}>
                          {vendor.subscription.status || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 mb-4 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Plan</p>
                          <p className="text-lg font-bold text-[#1A1A2E]">{vendor.subscription.plan || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Status</p>
                          <p className="text-base text-[#1A1A2E]">{vendor.subscription.status || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Next Billing</p>
                          <p className="text-base text-[#1A1A2E]">
                            {vendor.subscription.nextBillingDate
                              ? new Date(vendor.subscription.nextBillingDate).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Joined</p>
                          <p className="text-base text-[#1A1A2E]">
                            {vendor.joinedDate ? new Date(vendor.joinedDate).toLocaleDateString() : "—"}
                          </p>
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