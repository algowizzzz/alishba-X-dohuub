import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import api from "../../../services/api";

interface Vendor {
  id: string;
  businessName: string;
  logoUrl?: string;
  category: string;
  status: "active" | "inactive" | "suspended" | "trial" | "pending";
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

// Mock data

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
    trial: { dot: "bg-[#2E7AD9]", text: "text-[#2E7AD9]" },
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

function VendorCard({ vendor, onStatusChange }: { vendor: Vendor; onStatusChange: (id: string, next: "APPROVED" | "SUSPENDED") => Promise<void> }) {
  const navigate = useNavigate();
  const statusColor = getStatusColor(vendor.status);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  const setVendorStatus = async (vendorId: string, newStatus: "APPROVED" | "SUSPENDED") => {
    setStatusUpdating(vendorId);
    try { await onStatusChange(vendorId, newStatus); }
    finally { setStatusUpdating(null); }
  };

  return (
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 lg:p-7 mb-5 hover:border-[#2E7AD9] hover:shadow-[0_4px_16px_rgba(46,122,217,0.20)] transition-all">
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
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg bg-white border border-[rgba(46,122,217,0.25)] flex items-center justify-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
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
              className="text-lg lg:text-xl font-bold text-[#1A1A2E] hover:text-[#2E7AD9] hover:underline text-left"
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
            <div className="flex items-center gap-2 text-sm text-[#1A1A2E]">
              <span>{getCategoryIcon(vendor.category)}</span>
              <span>{vendor.category}</span>
            </div>

            {/* Subscription */}
            <div className="flex items-center gap-2 text-sm">
              <span>💳</span>
              {vendor.status === "trial" && vendor.trialDaysLeft ? (
                <span className="text-[#2E7AD9]">
                  Trial ({vendor.trialDaysLeft} days left)
                </span>
              ) : (
                <span className="text-[#1A1A2E]">
                  {vendor.subscriptionPlan} (${vendor.subscriptionFee}/mo)
                </span>
              )}
            </div>

            {/* Regions */}
            <div className="flex items-center gap-2 text-sm text-[#1A1A2E]">
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
            <div className="flex items-center gap-2 text-sm text-[#1A1A2E]">
              <span>📋</span>
              <span>Listings: {vendor.listingsCount}</span>
            </div>

            {/* Rating */}
            {vendor.rating > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#1A1A2E]">
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
                disabled={statusUpdating === vendor.id}
                onClick={() => {
                  if (window.confirm(`Suspend ${vendor.businessName}?`)) {
                    setVendorStatus(vendor.id, "SUSPENDED");
                  }
                }}
                className="text-[#DC2626] border-[#FEE2E2] hover:bg-[#FEE2E2] hover:text-[#DC2626] flex-1 sm:flex-none"
              >
                <Pause className="w-4 h-4 mr-2" />
                {statusUpdating === vendor.id ? "Suspending..." : "Suspend"}
              </Button>
            ) : vendor.status === "suspended" ? (
              <Button
                variant="outline"
                size="sm"
                disabled={statusUpdating === vendor.id}
                onClick={() => setVendorStatus(vendor.id, "APPROVED")}
                className="text-[#10B981] border-[#D1FAE5] hover:bg-[#D1FAE5] hover:text-[#10B981] flex-1 sm:flex-none"
              >
                <Play className="w-4 h-4 mr-2" />
                {statusUpdating === vendor.id ? "Restoring..." : "Unsuspend"}
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
  const [vendorsLoading, setVendorsLoading] = useState(true);

  const handleVendorStatusChange = async (vendorId: string, newStatus: "APPROVED" | "SUSPENDED") => {
    try {
      await api.patch(`/api/v1/admin/vendors/${vendorId}/status`, { status: newStatus });
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId
            ? { ...v, status: newStatus === "SUSPENDED" ? "suspended" : "active" }
            : v
        )
      );
      toast.success(newStatus === "SUSPENDED" ? "Vendor suspended" : "Vendor approved");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to update vendor status");
      throw e;
    }
  };

  useEffect(() => {
    api.get<{ success: boolean; data: any[] }>("/api/v1/admin/vendors?limit=200")
      .then((r) => {
        const mapped: Vendor[] = (r.data || []).map((v: any) => {
          const counts = v._count || {};
          const listingsTotal = (counts.cleaningListings || 0) + (counts.handymanListings || 0) +
            (counts.beautyListings || 0) + (counts.groceryListings || 0) +
            (counts.rentalListings || 0) + (counts.foodListings || 0) +
            (counts.beautyProductListings || 0) + (counts.rideAssistanceListings || 0) +
            (counts.companionshipListings || 0);
          // Region names from stores → regions[].region.name (the canonical
          // path). Fall back to legacy serviceAreas[] for older vendors.
          const storeRegions = (v.stores || [])
            .flatMap((s: any) => (s.regions || []).map((r: any) => r.region?.name))
            .filter(Boolean);
          const legacyAreas = (v.serviceAreas || [])
            .map((s: any) => `${s.city || ""}, ${s.state || ""}`.replace(/^,\s*|,\s*$/g, ""))
            .filter(Boolean);
          const regions = Array.from(new Set([...storeRegions, ...legacyAreas]));

          return {
            id: v.id,
            businessName: v.businessName,
            logoUrl: v.logo || undefined,
            category: v.categories?.[0]?.category || "Other",
            status:
              v.status === "SUSPENDED" ? "suspended"
              : v.status === "PENDING" ? "pending"
              : v.subscriptionStatus === "TRIAL" ? "trial"
              : v.isActive ? "active" : "inactive",
            subscriptionPlan: v.subscription?.planId || (v.subscriptionStatus === "TRIAL" ? "Trial" : "—"),
            subscriptionFee: (() => {
              const planPrices: Record<string, { monthly: number; yearly: number }> = {
                basic: { monthly: 29.99, yearly: 299.99 },
                professional: { monthly: 79.99, yearly: 799.99 },
                enterprise: { monthly: 199.99, yearly: 1999.99 },
              };
              const planId = v.subscription?.planId;
              const billing = v.subscription?.billingPeriod === "yearly" ? "yearly" : "monthly";
              if (!planId || !planPrices[planId]) return 0;
              return planPrices[planId][billing];
            })(),
            regions,
            joinedDate: v.createdAt,
            listingsCount: listingsTotal,
            rating: v.rating ?? 0,
            reviewCount: v.reviewCount ?? 0,
            email: v.user?.email || v.contactEmail || "",
          };
        });
        setVendors(mapped);
      })
      .catch((e: any) => {
        toast.error(e?.response?.data?.error || e?.message || "Failed to load vendors");
        setVendors([]);
      })
      .finally(() => setVendorsLoading(false));
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Calculate stats
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "active" || v.status === "trial").length;
  const suspendedVendors = vendors.filter((v) => v.status === "suspended").length;

  // Real region data from /api/v1/regions — was previously a hardcoded
  // list of 16 cities which never matched real vendor region strings.
  const [regionRows, setRegionRows] = useState<{ id: string; name: string; countryCode: string }[]>([]);
  const [countryOptions, setCountryOptions] = useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    api
      .get<{ success: boolean; data: any[]; countries: any[] }>(
        "/api/v1/regions?isActive=true&limit=500"
      )
      .then((r) => {
        const rs = ((r as any)?.data || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          countryCode: row.countryCode,
        }));
        setRegionRows(rs);
        setCountryOptions(((r as any)?.countries || []).map((c: any) => ({ code: c.code, name: c.name })));
      })
      .catch(() => {});
  }, []);

  const getRegionsByCountry = () => {
    if (countryFilter === "all") return Array.from(new Set(regionRows.map((r) => r.name))).sort();
    return Array.from(new Set(regionRows.filter((r) => r.countryCode === countryFilter).map((r) => r.name))).sort();
  };

  const handleCountryChange = (value: string) => {
    setCountryFilter(value);
    setRegionFilter("all");
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
    <div className="min-h-screen bg-[#F0F7FF]">
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              All Vendors
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280] hidden sm:block">
              Platform Vendors Overview
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 sm:p-5 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">Total:</span>
                <span className="text-lg sm:text-xl font-bold text-[#1A1A2E]">
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
                  {countryOptions.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                  ))}
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
              <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center mb-6">
                <Building2 className="w-16 h-16 text-[#9CA3AF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">No vendors found</h3>
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
                <VendorCard key={vendor.id} vendor={vendor} onStatusChange={handleVendorStatusChange} />
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
                                ? "bg-[#2E7AD9] text-white"
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