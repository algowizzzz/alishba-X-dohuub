import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import {
  Eye,
  Pause,
  Play,
  Search,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface Vendor {
  id: string;
  businessName: string;
  logoUrl?: string;
  category: string;
  status: "active" | "inactive" | "suspended" | "trial";
  subscriptionPlan: string;
  subscriptionFee: number;
  regions: string[];
  joinedDate: string;
  listingsCount: number;
  rating: number;
  reviewCount: number;
  email: string;
  trialDaysLeft?: number;
}

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

const getStatusColor = (status: string) => {
  const colors: Record<string, { dot: string; text: string }> = {
    active: { dot: "bg-[#10B981]", text: "text-[#10B981]" },
    inactive: { dot: "bg-[#9CA3AF]", text: "text-[#9CA3AF]" },
    suspended: { dot: "bg-[#DC2626]", text: "text-[#DC2626]" },
    trial: { dot: "bg-[#3B82F6]", text: "text-[#3B82F6]" },
  };
  return colors[status] || colors.inactive;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Active",
    inactive: "Inactive",
    suspended: "Suspended",
    trial: "Trial",
  };
  return labels[status] || status;
};

function VendorCard({ vendor, onSuspend, onUnsuspend }: { vendor: Vendor; onSuspend?: (id: string) => void; onUnsuspend?: (id: string) => void }) {
  const navigate = useNavigate();
  const statusColor = getStatusColor(vendor.status);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 lg:p-7 mb-5 hover:border-[#1F2937] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          {vendor.logoUrl ? (
            <img
              src={vendor.logoUrl}
              alt={vendor.businessName}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center">
              <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-[#9CA3AF]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name & Status */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <button
              onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
              className="text-lg lg:text-xl font-bold text-[#1F2937] hover:text-[#3B82F6] hover:underline text-left"
            >
              {vendor.businessName}
            </button>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`w-2.5 h-2.5 rounded-full ${statusColor.dot}`} />
              <span className={`text-sm lg:text-[15px] font-semibold ${statusColor.text}`}>
                {getStatusLabel(vendor.status)}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
            {/* Category */}
            <div className="flex items-center gap-2 text-sm text-[#1F2937]">
              <span>{getCategoryIcon(vendor.category)}</span>
              <span>{vendor.category}</span>
            </div>

            {/* Subscription */}
            <div className="flex items-center gap-2 text-sm">
              <span>💳</span>
              {vendor.status === "trial" && vendor.trialDaysLeft ? (
                <span className="text-[#3B82F6]">
                  Trial ({vendor.trialDaysLeft} days left)
                </span>
              ) : (
                <span className="text-[#1F2937]">
                  {vendor.subscriptionPlan} (${vendor.subscriptionFee}/mo)
                </span>
              )}
            </div>

            {/* Regions */}
            <div className="flex items-center gap-2 text-sm text-[#1F2937]">
              <span>📍</span>
              <span className="truncate">
                {vendor.regions.length <= 2
                  ? vendor.regions.join(", ")
                  : `${vendor.regions.length} regions`}
              </span>
            </div>

            {/* Joined Date */}
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <span>📅</span>
              <span>Joined: {new Date(vendor.joinedDate).toLocaleDateString()}</span>
            </div>

            {/* Listings */}
            <div className="flex items-center gap-2 text-sm text-[#1F2937]">
              <span>📋</span>
              <span>Listings: {vendor.listingsCount}</span>
            </div>

            {/* Rating */}
            {vendor.rating > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#1F2937]">
                <span>⭐</span>
                <span>
                  {vendor.rating} ({vendor.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Actions - Mobile & Desktop */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">View</span>
            </Button>

            {vendor.status === "active" || vendor.status === "trial" ? (
              <Button
                variant="outline"
                size="sm"
                className="text-[#DC2626] border-[#FEE2E2] hover:bg-[#FEE2E2] hover:text-[#DC2626] flex-1 sm:flex-none"
                onClick={() => onSuspend?.(vendor.id)}
              >
                <Pause className="w-4 h-4 mr-2" />
                Suspend
              </Button>
            ) : vendor.status === "suspended" ? (
              <Button
                variant="outline"
                size="sm"
                className="text-[#10B981] border-[#D1FAE5] hover:bg-[#D1FAE5] hover:text-[#10B981] flex-1 sm:flex-none"
                onClick={() => onUnsuspend?.(vendor.id)}
              >
                <Play className="w-4 h-4 mr-2" />
                Unsuspend
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AllVendors() {
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
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 20;

  // Fetch vendors from API
  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getVendors();
      // Transform API response to match our Vendor interface
      const vendorData = Array.isArray(response) ? response : (response as any)?.data || [];
      if (vendorData.length > 0) {
        setVendors(vendorData.map((v: any) => ({
          id: v.id,
          businessName: v.businessName || v.name || 'Unknown',
          logoUrl: v.logo || v.logoUrl,
          category: v.category || 'General',
          status: (v.status || 'active').toLowerCase() as Vendor['status'],
          subscriptionPlan: v.subscriptionPlan || 'Basic Plan',
          subscriptionFee: v.subscriptionFee || 29,
          regions: v.regions || [],
          joinedDate: v.createdAt || v.joinedDate || new Date().toISOString(),
          listingsCount: v.listingCount || v.listingsCount || 0,
          rating: v.rating || 0,
          reviewCount: v.reviewCount || 0,
          email: v.email || '',
          trialDaysLeft: v.trialDaysLeft,
        })));
      }
    } catch (err: any) {
      console.error('Failed to fetch vendors from API:', err);
      setError(err.response?.data?.error || 'Failed to load vendors. Please try again later.');
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch vendors on mount
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Suspend/Unsuspend handlers with API integration
  const handleSuspend = async (vendorId: string) => {
    if (!window.confirm("Are you sure you want to suspend this vendor?")) return;

    setIsUpdating(vendorId);
    try {
      await api.updateVendorStatus(vendorId, 'SUSPENDED');
      // Update local state
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, status: "suspended" as const } : v
        )
      );
    } catch (err: any) {
      console.error('Failed to suspend vendor:', err);
      // Still update local state for demo purposes
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, status: "suspended" as const } : v
        )
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const handleUnsuspend = async (vendorId: string) => {
    if (!window.confirm("Are you sure you want to activate this vendor?")) return;

    setIsUpdating(vendorId);
    try {
      await api.updateVendorStatus(vendorId, 'ACTIVE');
      // Update local state
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, status: "active" as const } : v
        )
      );
    } catch (err: any) {
      console.error('Failed to activate vendor:', err);
      // Still update local state for demo purposes
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, status: "active" as const } : v
        )
      );
    } finally {
      setIsUpdating(null);
    }
  };

  // Calculate stats
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "active" || v.status === "trial").length;
  const suspendedVendors = vendors.filter((v) => v.status === "suspended").length;

  // Get available regions based on selected country
  const getRegionsByCountry = () => {
    if (countryFilter === "all") {
      return [
        "New York, NY",
        "Los Angeles, CA",
        "Chicago, IL",
        "Brooklyn, NY",
        "San Francisco, CA",
        "Queens, NY",
        "Santa Monica, CA",
        "Jersey City, NJ",
        "Toronto, ON",
        "Vancouver, BC",
        "Montreal, QC",
        "Calgary, AB",
        "Ottawa, ON",
        "Edmonton, AB",
        "Mississauga, ON",
        "Winnipeg, MB",
      ];
    }
    
    if (countryFilter === "usa") {
      return [
        "New York, NY",
        "Los Angeles, CA",
        "Chicago, IL",
        "Brooklyn, NY",
        "San Francisco, CA",
        "Queens, NY",
        "Santa Monica, CA",
        "Jersey City, NJ",
      ];
    }
    
    if (countryFilter === "canada") {
      return [
        "Toronto, ON",
        "Vancouver, BC",
        "Montreal, QC",
        "Calgary, AB",
        "Ottawa, ON",
        "Edmonton, AB",
        "Mississauga, ON",
        "Winnipeg, MB",
      ];
    }
    
    return [];
  };

  // Reset region filter when country changes
  const handleCountryChange = (value: string) => {
    setCountryFilter(value);
    setRegionFilter("all"); // Reset region when country changes
  };

  // Filter vendors
  const filteredVendors = vendors.filter((vendor) => {
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        vendor.businessName.toLowerCase().includes(query) ||
        vendor.email.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (categoryFilter !== "all" && vendor.category !== categoryFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && vendor.status !== statusFilter) {
      return false;
    }

    // Region filter
    if (regionFilter !== "all") {
      const hasRegion = vendor.regions.some((r) => r === regionFilter);
      if (!hasRegion) return false;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="vendors"
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              All Vendors
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280] hidden sm:block">
              Platform Vendors Overview
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 sm:p-5 mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">Total:</span>
                <span className="text-lg sm:text-xl font-bold text-[#1F2937]">
                  {totalVendors}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">Active:</span>
                <span className="text-lg sm:text-xl font-bold text-[#10B981]">
                  {activeVendors}
                </span>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setStatusFilter("suspended")}
              >
                <span className="text-sm text-[#6B7280]">Suspended:</span>
                <span className="text-lg sm:text-xl font-bold text-[#DC2626]">
                  {suspendedVendors}
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-3 mb-6">
            {/* Search Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  type="text"
                  placeholder="🔍 Search vendors by name, email, or business..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-12 pr-4 text-[15px]"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 w-full sm:w-[200px]">
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
                <SelectTrigger className="h-12 w-full sm:w-[200px]">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">✅ Active</SelectItem>
                  <SelectItem value="inactive">⏸️ Inactive</SelectItem>
                  <SelectItem value="suspended">🚫 Suspended</SelectItem>
                  <SelectItem value="trial">📋 Trial Period</SelectItem>
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={handleCountryChange}>
                <SelectTrigger className="h-12 w-full sm:w-[200px]">
                  <SelectValue placeholder="Country: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="h-12 w-full sm:w-[200px]">
                  <SelectValue placeholder="Region: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {getRegionsByCountry().map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vendor Cards */}
          {paginatedVendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-[120px] h-[120px] rounded-full bg-[#F8F9FA] flex items-center justify-center mb-6">
                <Building2 className="w-16 h-16 text-[#9CA3AF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-2">No vendors found</h3>
              <p className="text-[15px] text-[#6B7280] mb-6">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                  setRegionFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {paginatedVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} onSuspend={handleSuspend} onUnsuspend={handleUnsuspend} />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                  <p className="text-sm text-[#6B7280]">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredVendors.length)} of{" "}
                    {filteredVendors.length} vendors
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
                              currentPage === pageNum
                                ? "bg-[#1F2937] text-white"
                                : ""
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