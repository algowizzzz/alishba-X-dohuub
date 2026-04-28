import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Building2,
  ClipboardList,
  Flag,
  Users,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Edit,
  List,
  TrendingUp,
  Star,
  Eye,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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

interface VendorProfile {
  id: string;
  businessName: string;
  category: string;
  status: "active" | "inactive";
  regions: number;
  bookings: number;
  bookingTrend: number;
  rating: number;
  reviews: number;
  revenue: number;
  revenueTrend: number;
  logoUrl?: string;
}

const mockProfiles: VendorProfile[] = [
  // CLEANING SERVICES
  {
    id: "1",
    businessName: "Sparkle Clean by Michelle",
    category: "Cleaning Services",
    status: "active",
    regions: 3,
    bookings: 156,
    bookingTrend: 12,
    rating: 4.8,
    reviews: 245,
    revenue: 12450,
    revenueTrend: 18,
  },
  {
    id: "2",
    businessName: "Michelle's Deep Clean Express",
    category: "Cleaning Services",
    status: "active",
    regions: 2,
    bookings: 98,
    bookingTrend: 15,
    rating: 4.9,
    reviews: 156,
    revenue: 9800,
    revenueTrend: 22,
  },
  {
    id: "3",
    businessName: "Green & Clean by Michelle",
    category: "Cleaning Services",
    status: "active",
    regions: 4,
    bookings: 203,
    bookingTrend: 8,
    rating: 4.7,
    reviews: 312,
    revenue: 15680,
    revenueTrend: 10,
  },

  // HANDYMAN SERVICES
  {
    id: "4",
    businessName: "Fix-It Pro by Michelle",
    category: "Handyman Services",
    status: "active",
    regions: 2,
    bookings: 89,
    bookingTrend: 8,
    rating: 4.9,
    reviews: 187,
    revenue: 8920,
    revenueTrend: 15,
  },
  {
    id: "5",
    businessName: "Michelle's Home Repair Hub",
    category: "Handyman Services",
    status: "active",
    regions: 3,
    bookings: 124,
    bookingTrend: 18,
    rating: 4.8,
    reviews: 201,
    revenue: 11450,
    revenueTrend: 20,
  },
  {
    id: "6",
    businessName: "Handyman Express Solutions",
    category: "Handyman Services",
    status: "active",
    regions: 1,
    bookings: 56,
    bookingTrend: 5,
    rating: 4.6,
    reviews: 98,
    revenue: 5670,
    revenueTrend: 8,
  },

  // GROCERY
  {
    id: "7",
    businessName: "Fresh Harvest by Michelle",
    category: "Grocery",
    status: "active",
    regions: 2,
    bookings: 178,
    bookingTrend: 25,
    rating: 4.7,
    reviews: 289,
    revenue: 18920,
    revenueTrend: 30,
  },
  {
    id: "8",
    businessName: "Organic Essentials Delivery",
    category: "Grocery",
    status: "active",
    regions: 3,
    bookings: 245,
    bookingTrend: 32,
    rating: 4.9,
    reviews: 412,
    revenue: 24560,
    revenueTrend: 35,
  },
  {
    id: "9",
    businessName: "Michelle's Meal Prep & Groceries",
    category: "Grocery",
    status: "active",
    regions: 1,
    bookings: 67,
    bookingTrend: 12,
    rating: 4.5,
    reviews: 134,
    revenue: 6780,
    revenueTrend: 15,
  },

  // BEAUTY SERVICES
  {
    id: "10",
    businessName: "Beauty by Michelle",
    category: "Beauty Services",
    status: "active",
    regions: 1,
    bookings: 67,
    bookingTrend: -5,
    rating: 4.7,
    reviews: 142,
    revenue: 5680,
    revenueTrend: -3,
  },
  {
    id: "11",
    businessName: "Glam Studio Mobile",
    category: "Beauty Services",
    status: "active",
    regions: 2,
    bookings: 134,
    bookingTrend: 20,
    rating: 4.9,
    reviews: 267,
    revenue: 13450,
    revenueTrend: 25,
  },
  {
    id: "12",
    businessName: "Michelle's Spa On-The-Go",
    category: "Beauty Services",
    status: "active",
    regions: 3,
    bookings: 189,
    bookingTrend: 28,
    rating: 4.8,
    reviews: 356,
    revenue: 18920,
    revenueTrend: 30,
  },

  // BEAUTY PRODUCTS
  {
    id: "13",
    businessName: "Glam Cosmetics Shop",
    category: "Beauty Products",
    status: "active",
    regions: 2,
    bookings: 234,
    bookingTrend: 35,
    rating: 4.8,
    reviews: 412,
    revenue: 23450,
    revenueTrend: 40,
  },
  {
    id: "14",
    businessName: "Pure Skincare Boutique",
    category: "Beauty Products",
    status: "active",
    regions: 3,
    bookings: 189,
    bookingTrend: 28,
    rating: 4.9,
    reviews: 356,
    revenue: 18920,
    revenueTrend: 32,
  },
  {
    id: "15",
    businessName: "Beauty Essentials by Michelle",
    category: "Beauty Products",
    status: "active",
    regions: 1,
    bookings: 145,
    bookingTrend: 22,
    rating: 4.7,
    reviews: 267,
    revenue: 14500,
    revenueTrend: 25,
  },

  // CAREGIVING SERVICES
  {
    id: "16",
    businessName: "Michelle's Caring Companions",
    category: "Caregiving Services",
    status: "active",
    regions: 2,
    bookings: 89,
    bookingTrend: 12,
    rating: 4.9,
    reviews: 156,
    revenue: 12340,
    revenueTrend: 15,
  },
  {
    id: "17",
    businessName: "Senior Care Plus",
    category: "Caregiving Services",
    status: "active",
    regions: 3,
    bookings: 134,
    bookingTrend: 18,
    rating: 4.8,
    reviews: 223,
    revenue: 18920,
    revenueTrend: 22,
  },
  {
    id: "18",
    businessName: "Home Health Helpers",
    category: "Caregiving Services",
    status: "active",
    regions: 1,
    bookings: 56,
    bookingTrend: 8,
    rating: 4.7,
    reviews: 98,
    revenue: 8900,
    revenueTrend: 10,
  },

  // FOOD
  {
    id: "19",
    businessName: "Mama's Kitchen",
    category: "Food",
    status: "active",
    regions: 2,
    bookings: 312,
    bookingTrend: 42,
    rating: 4.9,
    reviews: 567,
    revenue: 31200,
    revenueTrend: 48,
  },
  {
    id: "20",
    businessName: "Chef's Table by Michelle",
    category: "Food",
    status: "active",
    regions: 3,
    bookings: 289,
    bookingTrend: 38,
    rating: 4.8,
    reviews: 478,
    revenue: 28900,
    revenueTrend: 42,
  },
  {
    id: "21",
    businessName: "Homestyle Meals",
    category: "Food",
    status: "active",
    regions: 1,
    bookings: 198,
    bookingTrend: 29,
    rating: 4.7,
    reviews: 334,
    revenue: 19800,
    revenueTrend: 32,
  },

  // RENTAL PROPERTIES
  {
    id: "22",
    businessName: "Michelle's Properties",
    category: "Rental Properties",
    status: "active",
    regions: 3,
    bookings: 87,
    bookingTrend: 24,
    rating: 4.9,
    reviews: 123,
    revenue: 21750,
    revenueTrend: 28,
  },
  {
    id: "23",
    businessName: "Urban Stays by Michelle",
    category: "Rental Properties",
    status: "active",
    regions: 2,
    bookings: 64,
    bookingTrend: 18,
    rating: 4.8,
    reviews: 89,
    revenue: 16000,
    revenueTrend: 22,
  },
  {
    id: "24",
    businessName: "Cozy Rentals",
    category: "Rental Properties",
    status: "active",
    regions: 1,
    bookings: 45,
    bookingTrend: 12,
    rating: 4.7,
    reviews: 67,
    revenue: 11250,
    revenueTrend: 15,
  },

  // RIDE ASSISTANCE
  {
    id: "25",
    businessName: "CareWheels Transportation",
    category: "Ride Assistance",
    status: "active",
    regions: 2,
    bookings: 92,
    bookingTrend: 20,
    rating: 4.9,
    reviews: 156,
    revenue: 14720,
    revenueTrend: 25,
  },
  {
    id: "26",
    businessName: "Senior Care Rides",
    category: "Ride Assistance",
    status: "active",
    regions: 3,
    bookings: 134,
    bookingTrend: 28,
    rating: 4.8,
    reviews: 223,
    revenue: 20100,
    revenueTrend: 32,
  },
  {
    id: "27",
    businessName: "SafeTransit Solutions",
    category: "Ride Assistance",
    status: "active",
    regions: 1,
    bookings: 67,
    bookingTrend: 15,
    rating: 4.7,
    reviews: 98,
    revenue: 10050,
    revenueTrend: 18,
  },

  // COMPANIONSHIP SUPPORT
  {
    id: "32",
    businessName: "Caring Companions by Michelle",
    category: "Companionship Support",
    status: "active",
    regions: 2,
    bookings: 156,
    bookingTrend: 24,
    rating: 4.9,
    reviews: 87,
    revenue: 12800,
    revenueTrend: 28,
  },
  {
    id: "33",
    businessName: "Michelle's Senior Care Network",
    category: "Companionship Support",
    status: "active",
    regions: 2,
    bookings: 234,
    bookingTrend: 35,
    rating: 4.8,
    reviews: 145,
    revenue: 18600,
    revenueTrend: 42,
  },
  {
    id: "34",
    businessName: "Compassionate Care Services",
    category: "Companionship Support",
    status: "active",
    regions: 2,
    bookings: 178,
    bookingTrend: 30,
    rating: 4.9,
    reviews: 112,
    revenue: 14200,
    revenueTrend: 35,
  },
];

function VendorProfileCard({ profile }: { profile: VendorProfile }) {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(profile.status === "active");

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Cleaning Services": "🧹",
      "Handyman Services": "🔧",
      "Grocery": "🛒",
      "Beauty Services": "💄",
      "Beauty Products": "🛍️",
      "Rental Properties": "🏠",
      "Caregiving Services": "👵",
      "Food": "🍲",
      "Ride Assistance": "🚗",
      "Companionship Support": "🤝",
    };
    return icons[category] || "📋";
  };

  return (
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 sm:p-6 lg:p-8 mb-6 hover:border-[#2E7AD9] hover:shadow-[0_4px_16px_rgba(46,122,217,0.20)] transition-all">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Logo Area */}
        <div className="flex-shrink-0">
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={profile.businessName}
              className="w-full sm:w-[140px] h-[140px] rounded-xl object-cover"
            />
          ) : (
            <div className="w-full sm:w-[140px] h-[140px] rounded-xl bg-[#F8FAFF] border-2 border-dashed border-[rgba(46,122,217,0.25)] flex items-center justify-center">
              <Building2 className="w-12 h-12 text-[#9CA3AF]" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-2 break-words">
                {profile.businessName}
              </h3>
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-white" />
                Powered by DoHuub
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[13px] text-[#6B7280] hidden sm:inline">
                {isActive ? "Active" : "Inactive"}
              </span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          {/* Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Category</p>
              <p className="text-base text-[#1A1A2E] font-semibold flex items-center gap-2">
                <span>{getCategoryIcon(profile.category)}</span>
                {profile.category}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Status</p>
              <p className="text-base font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                <span className={isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'}>
                  {isActive ? `Active in ${profile.regions} regions` : "Inactive"}
                </span>
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Bookings This Month</p>
              <div className="flex items-center gap-2">
                <p className="text-base text-[#1A1A2E] font-semibold">{profile.bookings}</p>
                <div className={`flex items-center gap-1 text-[13px] ${profile.bookingTrend >= 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${profile.bookingTrend < 0 ? 'rotate-180' : ''}`} />
                  {profile.bookingTrend >= 0 ? '+' : ''}{profile.bookingTrend}%
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Average Rating</p>
              <p className="text-base text-[#1A1A2E] font-semibold flex items-center gap-1">
                ⭐ {profile.rating} <span className="text-[#6B7280] font-normal">({profile.reviews} reviews)</span>
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Revenue This Month</p>
              <div className="flex items-center gap-2">
                <p className="text-base text-[#1A1A2E] font-semibold">${profile.revenue.toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-[13px] ${profile.revenueTrend >= 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${profile.revenueTrend < 0 ? 'rotate-180' : ''}`} />
                  {profile.revenueTrend >= 0 ? '+' : ''}{profile.revenueTrend}%
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Active Regions</p>
              <button className="text-base text-[#2E7AD9] font-semibold hover:underline">
                {profile.regions} regions
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="h-10 px-5 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
              onClick={() => navigate(`/admin/vendors/michelle/${profile.id}`)}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">Details</span>
            </Button>
            <Button
              variant="outline"
              className="h-10 px-5 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
              onClick={() => navigate(`/admin/michelle-profiles/edit/${profile.id}`)}
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Store</span>
              <span className="sm:hidden">Edit</span>
            </Button>
            <Button
              variant="outline"
              className="h-10 px-5 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
              onClick={() => navigate(`/admin/michelle-profiles/${profile.id}/listings`)}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Manage Listings</span>
              <span className="sm:hidden">Listings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-[120px] h-[120px] rounded-full bg-[#F8FAFF] flex items-center justify-center mb-6">
        <Building2 className="w-16 h-16 text-[#9CA3AF]" />
      </div>
      <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">No Vendor Profiles Yet</h3>
      <p className="text-[15px] text-[#6B7280] mb-6">
        Create your first business identity to start offering services
      </p>
      <Button
        onClick={() => navigate("/admin/michelle-profiles/create")}
        className="h-11 px-6 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create First Profile
      </Button>
    </div>
  );
}

export function MichelleProfiles() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [profiles] = useState(mockProfiles);

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

  const filteredProfiles = profiles.filter(profile => {
    if (filter === "all") return true;
    if (filter === "active") return profile.status === "active";
    if (filter === "inactive") return profile.status === "inactive";
    return profile.category === filter;
  });

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
          {/* Page Header */}
          <div className="mb-2">
            <h1 className="text-[32px] font-bold text-[#1A1A2E]">Michelle's Stores</h1>
          </div>
          <p className="text-[15px] text-[#6B7280] mb-8">
            Manage your business identities across all service categories
          </p>

          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between mb-8">
            <Button
              onClick={() => navigate("/admin/michelle-profiles/create")}
              className="flex-1 sm:flex-none h-11 px-6 font-semibold bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white"
            >
              <Plus className="w-[18px] h-[18px] mr-2" />
              Create New Store
            </Button>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[220px] h-11">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Cleaning Services">Cleaning Services</SelectItem>
                <SelectItem value="Handyman Services">Handyman Services</SelectItem>
                <SelectItem value="Grocery">Grocery</SelectItem>
                <SelectItem value="Beauty Services">Beauty Services</SelectItem>
                <SelectItem value="Beauty Products">Beauty Products</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Rental Properties">Rental Properties</SelectItem>
                <SelectItem value="Ride Assistance">Ride Assistance</SelectItem>
                <SelectItem value="Companionship Support">Companionship Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Profile Cards or Empty State */}
          {filteredProfiles.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {filteredProfiles.map((profile) => (
                <VendorProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}