"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VendorCard } from "@/components/vendor/VendorCard";
import { Search, RefreshCw, Loader2, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/toaster";

interface VendorData {
  id: string;
  businessName: string;
  email: string;
  phone?: string | null;
  logo?: string | null;
  status: "ACTIVE" | "SUSPENDED";
  isActive: boolean;
  subscriptionStatus: string;
  category?: string;
  regions?: string[];
  rating: number;
  reviewCount: number;
  listingCount: number;
  totalRevenue: number;
  joinedAt: string;
  trialEndsAt?: string | null;
}

const CATEGORIES = [
  "All Categories",
  "Cleaning Services",
  "Handyman Services",
  "Grocery",
  "Beauty Services",
  "Food Services",
  "Rental Properties",
  "Ride Assistance",
  "Companionship Support",
];

const STATUSES = ["All Statuses", "Active", "Inactive", "Suspended", "Trial Period"];

const COUNTRIES = ["All Countries", "USA", "Canada"];

// Mock regions - in real app, this would be dynamic based on country
const REGIONS: Record<string, string[]> = {
  USA: ["All Regions", "California", "New York", "Texas", "Florida", "Illinois"],
  Canada: ["All Regions", "Ontario", "Quebec", "British Columbia", "Alberta"],
};

const ITEMS_PER_PAGE = 20;

export default function VendorsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/vendors/admin/summary");
      setVendors(response.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch vendors:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to load vendors",
        variant: "destructive",
      });
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, countryFilter, regionFilter]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      // Search filter
      const matchesSearch =
        vendor.businessName.toLowerCase().includes(search.toLowerCase()) ||
        vendor.email.toLowerCase().includes(search.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "All Categories" ||
        vendor.category === categoryFilter;

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "Active") matchesStatus = vendor.status === "ACTIVE";
      else if (statusFilter === "Suspended") matchesStatus = vendor.status === "SUSPENDED";
      else if (statusFilter === "Trial Period") matchesStatus = vendor.subscriptionStatus === "TRIAL";
      else if (statusFilter === "Inactive") matchesStatus = !vendor.isActive;

      // Country filter
      const matchesCountry = countryFilter === "All Countries";
      // In real app, would check vendor.country

      // Region filter
      const matchesRegion = regionFilter === "All Regions";
      // In real app, would check if vendor.regions includes selected region

      return matchesSearch && matchesCategory && matchesStatus && matchesCountry && matchesRegion;
    });
  }, [vendors, search, categoryFilter, statusFilter, countryFilter, regionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSuspend = async (vendorId: string) => {
    if (!confirm("Are you sure you want to suspend this vendor?")) return;

    setIsUpdating(vendorId);
    try {
      await api.patch(`/admin/vendors/${vendorId}/status`, { status: 'SUSPENDED' });
      toast({
        title: "Success",
        description: "Vendor suspended successfully",
      });
      fetchVendors();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to suspend vendor",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleUnsuspend = async (vendorId: string) => {
    if (!confirm("Are you sure you want to activate this vendor?")) return;

    setIsUpdating(vendorId);
    try {
      await api.patch(`/admin/vendors/${vendorId}/status`, { status: 'APPROVED' });
      toast({
        title: "Success",
        description: "Vendor activated successfully",
      });
      fetchVendors();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to activate vendor",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Statuses");
    setCountryFilter("All Countries");
    setRegionFilter("All Regions");
  };

  // Get available regions based on selected country
  const availableRegions = countryFilter !== "All Countries" && REGIONS[countryFilter]
    ? REGIONS[countryFilter]
    : ["All Regions"];

  // Stats
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "ACTIVE").length;
  const suspendedVendors = vendors.filter((v) => v.status === "SUSPENDED").length;
  const trialVendors = vendors.filter((v) => v.subscriptionStatus === "TRIAL").length;

  return (
    <PortalLayout title="All Vendors" subtitle="Platform Vendors Overview">
      <div className="space-y-6">
        {/* Quick Stats Bar */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Vendors</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{totalVendors}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Active</p>
              <p className="text-lg sm:text-xl font-bold text-green-600">{activeVendors}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Suspended</p>
              <p className="text-lg sm:text-xl font-bold text-red-600">{suspendedVendors}</p>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-gray-500 mb-1">On Trial</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{trialVendors}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by business name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <select
            className="w-full sm:w-[200px] h-12 px-4 pr-10 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="w-full sm:w-[200px] h-12 px-4 pr-10 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            className="w-full sm:w-[200px] h-12 px-4 pr-10 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setRegionFilter("All Regions");
            }}
          >
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          {/* Region Filter */}
          <select
            className="w-full sm:w-[200px] h-12 px-4 pr-10 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            {availableRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={fetchVendors}
            disabled={isLoading}
            className="h-12 px-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Vendor Cards */}
        {isLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-[120px] h-[120px] rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No vendors found</h3>
            <p className="text-base text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <>
            {/* Vendor Cards Grid */}
            <div>
              {paginatedVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onSuspend={handleSuspend}
                  onUnsuspend={handleUnsuspend}
                  isUpdating={isUpdating === vendor.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredVendors.length)} of{" "}
                  {filteredVendors.length} vendors
                </p>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-10 w-10 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page Numbers - Desktop */}
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
                          className="h-10 w-10 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Page Info - Mobile */}
                  <div className="sm:hidden text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-10 w-10 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PortalLayout>
  );
}
