import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
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
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6 lg:p-8 mb-6 hover:border-[#1F2937] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all">
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
            <div className="w-full sm:w-[140px] h-[140px] rounded-xl bg-[#F8F9FA] border-2 border-dashed border-[#E5E7EB] flex items-center justify-center">
              <Building2 className="w-12 h-12 text-[#9CA3AF]" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1F2937] mb-2 break-words">
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
              <p className="text-base text-[#1F2937] font-semibold flex items-center gap-2">
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
                <p className="text-base text-[#1F2937] font-semibold">{profile.bookings}</p>
                <div className={`flex items-center gap-1 text-[13px] ${profile.bookingTrend >= 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${profile.bookingTrend < 0 ? 'rotate-180' : ''}`} />
                  {profile.bookingTrend >= 0 ? '+' : ''}{profile.bookingTrend}%
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Average Rating</p>
              <p className="text-base text-[#1F2937] font-semibold flex items-center gap-1">
                ⭐ {profile.rating} <span className="text-[#6B7280] font-normal">({profile.reviews} reviews)</span>
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Revenue This Month</p>
              <div className="flex items-center gap-2">
                <p className="text-base text-[#1F2937] font-semibold">${profile.revenue.toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-[13px] ${profile.revenueTrend >= 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${profile.revenueTrend < 0 ? 'rotate-180' : ''}`} />
                  {profile.revenueTrend >= 0 ? '+' : ''}{profile.revenueTrend}%
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Active Regions</p>
              <button className="text-base text-[#3B82F6] font-semibold hover:underline">
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
      <div className="w-[120px] h-[120px] rounded-full bg-[#F8F9FA] flex items-center justify-center mb-6">
        <Building2 className="w-16 h-16 text-[#9CA3AF]" />
      </div>
      <h3 className="text-2xl font-bold text-[#1F2937] mb-2">No Vendor Profiles Yet</h3>
      <p className="text-[15px] text-[#6B7280] mb-6">
        Create your first business identity to start offering services
      </p>
      <Button
        onClick={() => navigate("/admin/michelle-profiles/create")}
        className="h-11 px-6 bg-[#1F2937] hover:bg-[#111827] text-white"
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
  const [profiles, setProfiles] = useState<VendorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Michelle profiles from API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response: any = await api.getMichelleProfiles(filter !== "all" ? { category: filter } : undefined);
        const mappedProfiles: VendorProfile[] = (response.profiles || response || []).map((profile: any) => ({
          id: profile.id,
          businessName: profile.name || profile.businessName,
          category: profile.category,
          status: (profile.status || "active").toLowerCase() as "active" | "inactive",
          regions: profile.regions?.length || 0,
          bookings: profile.bookings || profile.bookingCount || 0,
          bookingTrend: profile.bookingTrend || 0,
          rating: profile.rating || profile.averageRating || 0,
          reviews: profile.reviews || profile.reviewCount || 0,
          revenue: profile.revenue || 0,
          revenueTrend: profile.revenueTrend || 0,
          logoUrl: profile.logo || profile.logoUrl,
        }));
        setProfiles(mappedProfiles);
      } catch (err: any) {
        console.error("Failed to fetch Michelle profiles:", err);
        setError(err.response?.data?.error || "Failed to load profiles. Please try again later.");
        setProfiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [filter]);

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
          {/* Page Header */}
          <div className="mb-2">
            <h1 className="text-[32px] font-bold text-[#1F2937]">Michelle's Stores</h1>
          </div>
          <p className="text-[15px] text-[#6B7280] mb-8">
            Manage your business identities across all service categories
          </p>

          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between mb-8">
            <Button
              onClick={() => navigate("/admin/michelle-profiles/create")}
              className="flex-1 sm:flex-none h-11 px-6 font-semibold bg-[#1F2937] hover:bg-[#374151] text-white"
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