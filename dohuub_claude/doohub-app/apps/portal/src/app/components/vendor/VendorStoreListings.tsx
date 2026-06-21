import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Star, TrendingUp, Check } from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { getCreateButtonText, isProductCategory, vendorBusinessInfo, storeDataMap as categoryDataMap } from "../../data/vendorBusinessData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  bookings: number;
  bookingTrend: number;
  status: "active" | "inactive";
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

// Mock data for each store category
const storeDataMap: Record<string, StoreData> = {
  "1": {
    // Cleaning Services
    name: "Sparkle Clean Co.",
    category: "Cleaning Services",
    listings: [
      {
        id: "1",
        title: "Deep Cleaning Service",
        description: "Complete top-to-bottom home cleaning for a spotless living space",
        price: 150,
        bookings: 48,
        bookingTrend: 10,
        status: "active",
        rating: 4.8,
        reviews: 23,
        regions: 3,
        whatsIncluded: [
          "Professional equipment & supplies",
          "Trained professionals",
          "Eco-friendly products available",
          "Quality guarantee",
        ],
      },
      {
        id: "2",
        title: "Regular Cleaning (Weekly)",
        description: "Weekly maintenance cleaning to keep your space fresh and tidy",
        price: 80,
        bookings: 67,
        bookingTrend: 8,
        status: "active",
        rating: 4.9,
        reviews: 43,
        regions: 4,
        whatsIncluded: [
          "Professional equipment & supplies",
          "Trained professionals",
          "Eco-friendly products available",
          "Living rooms and bedrooms",
          "+2 more",
        ],
      },
      {
        id: "3",
        title: "Move-Out Cleaning",
        description: "Complete cleaning for moving out, includes appliances and deep cleaning of all areas",
        price: 200,
        bookings: 18,
        bookingTrend: -5,
        status: "active",
        rating: 5.0,
        reviews: 12,
        regions: 2,
        whatsIncluded: [
          "Professional equipment & supplies",
          "Trained professionals",
          "All appliances cleaned",
          "Deep cleaning of areas",
        ],
      },
      {
        id: "4",
        title: "Office Cleaning",
        description: "Professional office cleaning for small to medium-sized businesses",
        price: 120,
        bookings: 32,
        bookingTrend: 15,
        status: "active",
        rating: 4.7,
        reviews: 28,
        regions: 3,
        whatsIncluded: [
          "Professional equipment & supplies",
          "Trained professionals",
          "Eco-friendly products available",
          "After-hours available",
        ],
      },
    ],
  },
  "2": {
    // Handyman Services
    name: "Fix-It Pro Services",
    category: "Handyman Services",
    listings: [
      {
        id: "1",
        title: "General Repairs",
        description: "Fix common household issues including minor plumbing, electrical, and carpentry",
        price: 75,
        bookings: 56,
        bookingTrend: 12,
        status: "active",
        rating: 4.9,
        reviews: 34,
        regions: 2,
        whatsIncluded: [
          "Licensed & insured",
          "All tools provided",
          "Same-day service available",
          "Quality guarantee",
        ],
      },
      {
        id: "2",
        title: "Furniture Assembly",
        description: "Expert assembly of furniture from any retailer",
        price: 60,
        bookings: 42,
        bookingTrend: 8,
        status: "active",
        rating: 4.8,
        reviews: 29,
        regions: 2,
        whatsIncluded: [
          "All tools provided",
          "Fast service",
          "Cleanup included",
          "Quality guarantee",
        ],
      },
      {
        id: "3",
        title: "Painting Services",
        description: "Interior and exterior painting for homes and offices",
        price: 200,
        bookingTrend: 15,
        bookings: 28,
        status: "active",
        rating: 4.7,
        reviews: 18,
        regions: 3,
        whatsIncluded: [
          "Licensed & insured",
          "Premium paint supplies",
          "Color consultation",
          "Cleanup included",
        ],
      },
    ],
  },
  "3": {
    // Groceries
    name: "Fresh Harvest Groceries",
    category: "Groceries",
    listings: [
      {
        id: "1",
        title: "Organic Whole Milk",
        description: "Fresh organic whole milk from local dairy farms, 1 gallon",
        price: 6,
        bookings: 156,
        bookingTrend: 20,
        status: "active",
        rating: 4.9,
        reviews: 143,
        regions: 4,
        whatsIncluded: [
          "100% organic",
          "Locally sourced",
          "No hormones or antibiotics",
          "Glass bottle deposit",
        ],
      },
      {
        id: "2",
        title: "Fresh Eggs (Dozen)",
        description: "Farm-fresh organic eggs from free-range chickens",
        price: 8,
        bookings: 189,
        bookingTrend: 25,
        status: "active",
        rating: 5.0,
        reviews: 167,
        regions: 4,
        whatsIncluded: [
          "Free-range chickens",
          "Organic feed",
          "Local farms",
          "Grade AA",
        ],
      },
      {
        id: "3",
        title: "Artisan Sourdough Bread",
        description: "Fresh-baked artisan sourdough bread, 24oz loaf",
        price: 7,
        bookings: 132,
        bookingTrend: 18,
        status: "active",
        rating: 4.8,
        reviews: 98,
        regions: 3,
        whatsIncluded: [
          "Freshly baked daily",
          "Natural ingredients",
          "No preservatives",
          "Traditional recipe",
        ],
      },
      {
        id: "4",
        title: "Organic Bananas (2 lbs)",
        description: "Fresh organic bananas, perfect ripeness",
        price: 3,
        bookings: 203,
        bookingTrend: 15,
        status: "active",
        rating: 4.7,
        reviews: 156,
        regions: 4,
        whatsIncluded: [
          "Certified organic",
          "Fair trade",
          "Hand-selected",
          "Peak ripeness",
        ],
      },
    ],
  },
  "4": {
    // Food
    name: "Mama's Kitchen",
    category: "Food",
    listings: [
      {
        id: "1",
        title: "Chicken Tikka Masala",
        description: "Traditional Indian curry with tender chicken in creamy tomato sauce, served with basmati rice",
        price: 16,
        bookings: 267,
        bookingTrend: 28,
        status: "active",
        rating: 5.0,
        reviews: 189,
        regions: 3,
        whatsIncluded: [
          "Basmati rice included",
          "Homemade naan bread",
          "Fresh ingredients",
          "Medium spice level",
        ],
      },
      {
        id: "2",
        title: "Beef Burger Deluxe",
        description: "Classic beef burger with lettuce, tomato, cheese, and special sauce on brioche bun",
        price: 13,
        bookings: 198,
        bookingTrend: 22,
        status: "active",
        rating: 4.9,
        reviews: 145,
        regions: 2,
        whatsIncluded: [
          "Fresh ground beef",
          "Crispy fries included",
          "Homemade sauce",
          "Premium toppings",
        ],
      },
      {
        id: "3",
        title: "Vegan Buddha Bowl",
        description: "Nutritious bowl with quinoa, roasted vegetables, chickpeas, avocado, and tahini dressing",
        price: 14,
        bookings: 145,
        bookingTrend: 35,
        status: "active",
        rating: 4.8,
        reviews: 102,
        regions: 3,
        whatsIncluded: [
          "100% plant-based",
          "Gluten-free option",
          "Fresh vegetables",
          "Protein-rich",
        ],
      },
      {
        id: "4",
        title: "Margherita Pizza (12\")",
        description: "Wood-fired pizza with fresh mozzarella, basil, and San Marzano tomatoes",
        price: 18,
        bookings: 223,
        bookingTrend: 30,
        status: "active",
        rating: 4.9,
        reviews: 178,
        regions: 2,
        whatsIncluded: [
          "Wood-fired oven",
          "Fresh dough daily",
          "Imported ingredients",
          "Traditional recipe",
        ],
      },
    ],
  },
  "5": {
    // Beauty Services
    name: "Glam Beauty Studio",
    category: "Beauty Services",
    listings: [
      {
        id: "1",
        title: "Signature Facial Treatment",
        description: "Rejuvenating facial with customized skincare treatment",
        price: 85,
        bookings: 67,
        bookingTrend: 15,
        status: "active",
        rating: 4.8,
        reviews: 56,
        regions: 3,
        whatsIncluded: [
          "Licensed estheticians",
          "Premium products",
          "Personalized treatment",
          "Relaxing environment",
        ],
      },
      {
        id: "2",
        title: "Hair Styling & Color",
        description: "Professional hair cutting, styling, and coloring services",
        price: 120,
        bookings: 89,
        bookingTrend: 22,
        status: "active",
        rating: 4.9,
        reviews: 73,
        regions: 3,
        whatsIncluded: [
          "Expert stylists",
          "Premium hair products",
          "Color consultation",
          "Complimentary styling",
        ],
      },
    ],
  },
  "6": {
    // Beauty Products
    name: "Pure Skincare Boutique",
    category: "Beauty Products",
    listings: [
      {
        id: "1",
        title: "Hydrating Face Moisturizer",
        description: "Lightweight daily moisturizer with hyaluronic acid and vitamin E, 50ml",
        price: 42,
        bookings: 187,
        bookingTrend: 32,
        status: "active",
        rating: 4.9,
        reviews: 156,
        regions: 3,
        whatsIncluded: [
          "All-natural ingredients",
          "Cruelty-free",
          "Dermatologist tested",
          "Free shipping",
        ],
      },
      {
        id: "2",
        title: "Anti-Aging Serum",
        description: "Premium anti-aging serum with retinol and hyaluronic acid, 30ml",
        price: 65,
        bookings: 143,
        bookingTrend: 28,
        status: "active",
        rating: 4.8,
        reviews: 128,
        regions: 3,
        whatsIncluded: [
          "Clinical strength formula",
          "All-natural ingredients",
          "Dermatologist tested",
          "Money-back guarantee",
        ],
      },
      {
        id: "3",
        title: "Matte Lipstick - Ruby Red",
        description: "Long-lasting matte lipstick in classic ruby red shade, 4g",
        price: 24,
        bookings: 234,
        bookingTrend: 40,
        status: "active",
        rating: 4.9,
        reviews: 203,
        regions: 2,
        whatsIncluded: [
          "16-hour wear",
          "Vegan formula",
          "Moisturizing",
          "Cruelty-free",
        ],
      },
      {
        id: "4",
        title: "Vitamin C Facial Cleanser",
        description: "Brightening facial cleanser with vitamin C and gentle exfoliants, 150ml",
        price: 28,
        bookings: 198,
        bookingTrend: 25,
        status: "active",
        rating: 4.7,
        reviews: 167,
        regions: 3,
        whatsIncluded: [
          "pH balanced",
          "Sulfate-free",
          "All skin types",
          "Natural ingredients",
        ],
      },
    ],
  },
  "7": {
    // Rental Properties
    name: "Urban Stays Properties",
    category: "Rental Properties",
    listings: [
      {
        id: "1",
        title: "Downtown Studio Apartment",
        description: "Modern studio in the heart of downtown, fully furnished",
        price: 1500,
        bookings: 12,
        bookingTrend: 8,
        status: "active",
        rating: 4.9,
        reviews: 23,
        regions: 1,
        whatsIncluded: [
          "Fully furnished",
          "Utilities included",
          "Pet-friendly",
          "Gym access",
        ],
      },
      {
        id: "2",
        title: "2-Bedroom Family Home",
        description: "Spacious family home in quiet neighborhood with backyard",
        price: 2200,
        bookings: 8,
        bookingTrend: 5,
        status: "active",
        rating: 4.8,
        reviews: 15,
        regions: 1,
        whatsIncluded: [
          "2 bed / 2 bath",
          "Private backyard",
          "Pet-friendly",
          "Washer/dryer included",
        ],
      },
    ],
  },
  "8": {
    // Ride Assistance
    name: "CareWheels Transportation",
    category: "Ride Assistance",
    listings: [
      {
        id: "1",
        title: "Medical Appointment Transport",
        description: "Safe and reliable transportation to medical appointments",
        price: 35,
        bookings: 67,
        bookingTrend: 12,
        status: "active",
        rating: 4.9,
        reviews: 78,
        regions: 3,
        whatsIncluded: [
          "Door-to-door service",
          "Wheelchair accessible",
          "Patient & professional",
          "Insurance accepted",
        ],
      },
      {
        id: "2",
        title: "Airport Transportation",
        description: "Comfortable rides to and from the airport",
        price: 55,
        bookings: 45,
        bookingTrend: 8,
        status: "active",
        rating: 4.8,
        reviews: 52,
        regions: 3,
        whatsIncluded: [
          "Luggage assistance",
          "Flight tracking",
          "Professional drivers",
          "Clean vehicles",
        ],
      },
    ],
  },
  "9": {
    // Companionship Support
    name: "Caring Companions",
    category: "Companionship Support",
    listings: [
      {
        id: "1",
        title: "Daily Companion Care",
        description: "Professional companionship and light assistance for seniors",
        price: 25,
        bookings: 34,
        bookingTrend: 6,
        status: "active",
        rating: 4.9,
        reviews: 45,
        regions: 2,
        whatsIncluded: [
          "Background checked",
          "Certified caregivers",
          "Flexible scheduling",
          "Light housekeeping",
        ],
      },
      {
        id: "2",
        title: "Overnight Care",
        description: "Overnight companionship and supervision for peace of mind",
        price: 180,
        bookings: 23,
        bookingTrend: 10,
        status: "active",
        rating: 5.0,
        reviews: 28,
        regions: 2,
        whatsIncluded: [
          "Background checked",
          "Certified caregivers",
          "24/7 supervision",
          "Emergency response",
        ],
      },
    ],
  },
};

export function VendorStoreListings() {
  const navigate = useNavigate();
  const { storeId } = useParams();

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

  // Get store data — the storeDataMap is a 1..9 demo-only fixture. A real
  // store id (cuid) won't match, so default to an empty shape instead of
  // crashing on `undefined.listings`. Live listings load from the API below.
  const storeData = (storeDataMap[storeId || ""] as { listings: Listing[]; name?: string; category?: string } | undefined) || {
    listings: [] as Listing[],
    name: "Your Store",
    category: "Cleaning Services",
  };
  const [listings, setListings] = useState<Listing[]>(storeData.listings);
  const [usingDemoData, setUsingDemoData] = useState(true);

  // Load listings from API; fall back to localStorage / mock if empty
  useEffect(() => {
    api
      .get<{ success: boolean; data: any[] }>("/api/v1/vendors/listings")
      .then((r) => {
        const data = (r as any)?.data || [];
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Listing[] = data.map((l: any) => ({
            id: l.id,
            title: l.title || l.name || "Untitled",
            description: l.description || "",
            price: Number(l.basePrice ?? l.price ?? 0),
            bookings: l._count?.bookings || 0,
            bookingTrend: 0,
            status: l.status === "ACTIVE" ? "active" : "inactive",
            rating: l.rating || 0,
            reviews: l.reviewCount || 0,
            regions: 0,
            whatsIncluded: Array.isArray(l.includes) ? l.includes : [],
          }));
          setListings(mapped);
          setUsingDemoData(false);
          return;
        }

        // Fallback to localStorage / mock
        const savedListings = localStorage.getItem(`store-${storeId}-listings`);
        if (savedListings) {
          try {
            const parsedListings = JSON.parse(savedListings);
            const mockListings = storeData.listings;
            const mergedListings = [...parsedListings, ...mockListings.filter(
              (mock) => !parsedListings.find((saved: Listing) => saved.id === mock.id)
            )];
            setListings(mergedListings);
          } catch {
            setListings(storeData.listings);
          }
        } else {
          setListings(storeData.listings);
        }
        setUsingDemoData(true);
      })
      .catch(() => {
        setListings(storeData.listings);
        setUsingDemoData(true);
      });
  }, [storeId]);

  // Calculate stats
  const activeListings = listings.filter((l) => l.status === "active").length;
  const totalBookings = listings.reduce((sum, l) => sum + l.bookings, 0);

  // Filter listings
  const filteredListings =
    statusFilter === "all"
      ? listings.filter((l) => l.status === "active")
      : listings;

  const handleDeactivate = (listingId: string) => {
    setListings(
      listings.map((listing) =>
        listing.id === listingId
          ? { ...listing, status: "inactive" as const }
          : listing
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <VendorTopNav onMenuClick={handleSidebarToggle} />
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
          {/* Back Button */}
          <button
            onClick={() => navigate("/vendor/services")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A2E] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Services</span>
          </button>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-3">
              Manage Listings: {storeData.name}
            </h1>

            {/* Profile Info Line */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B7280] mb-6">
              <span className="hidden sm:inline">
                <span className="font-medium">Business:</span> {vendorBusinessInfo.businessName}
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
                className="h-11 px-6 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white w-full sm:w-auto"
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
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">
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
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-12 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
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
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-4 sm:p-6 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-full sm:w-[100px] h-[100px] rounded-xl bg-white border border-[rgba(46,122,217,0.25)] flex items-center justify-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <FileText className="w-10 h-10 text-[#9CA3AF]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Description */}
          <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] mb-2 break-words">
            {listing.title}
          </h3>
          <p className="text-sm text-[#6B7280] mb-4">{listing.description}</p>

          {/* Metrics */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Price</p>
              <p className="text-base font-semibold text-[#1A1A2E]">
                ${listing.price}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Bookings</p>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-[#1A1A2E]">
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
              <p className="text-[13px] font-semibold text-[#1A1A2E] mb-2">
                What's Included:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {listing.whatsIncluded.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg text-xs text-[#6B7280] shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
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
              <span className="font-semibold text-[#1A1A2E]">
                {listing.rating}
              </span>
              <span className="text-[#6B7280]">({listing.reviews} reviews)</span>
            </div>
            <span className="text-[#6B7280] hidden sm:inline">•</span>
            <span className="font-semibold text-[#1A1A2E]">
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