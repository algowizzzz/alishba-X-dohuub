import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Building2,
  Sparkles,
  Wrench,
  ShoppingCart,
  UtensilsCrossed,
  Scissors,
  Droplets,
  Home,
  Car,
  Heart,
  TrendingUp,
  Eye,
  Edit,
  List,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface VendorStore {
  id: string;
  businessName: string;
  category: string;
  status: "ACTIVE" | "PAUSED" | "SUSPENDED";
  regions: number;
  bookings: number;
  bookingTrend: number;
  rating: number;
  reviews: number;
  revenue: number;
  revenueTrend: number;
}

function getCategoryIcon(category: string) {
  const iconClass = "w-4 h-4";
  switch (category) {
    case "Cleaning Services":
      return <Sparkles className={iconClass} />;
    case "Handyman Services":
      return <Wrench className={iconClass} />;
    case "Groceries":
      return <ShoppingCart className={iconClass} />;
    case "Food":
      return <UtensilsCrossed className={iconClass} />;
    case "Beauty Services":
      return <Scissors className={iconClass} />;
    case "Beauty Products":
      return <Droplets className={iconClass} />;
    case "Rental Properties":
      return <Home className={iconClass} />;
    case "Ride Assistance":
      return <Car className={iconClass} />;
    case "Companionship Support":
      return <Heart className={iconClass} />;
    default:
      return <Building2 className={iconClass} />;
  }
}

interface StoreCardProps {
  profile: VendorStore;
  onEdit: (id: string) => void;
  onDelete: (profile: VendorStore) => void;
  onViewDetails: (id: string) => void;
  onManageListings: (id: string) => void;
  onToggleStatus: (id: string, newStatus: boolean) => Promise<void>;
  isTogglingId?: string | null;
}

function StoreCard({
  profile,
  onEdit,
  onDelete,
  onViewDetails,
  onManageListings,
  onToggleStatus,
  isTogglingId,
}: StoreCardProps) {
  const isActive = profile.status === "ACTIVE";
  const isToggling = isTogglingId === profile.id;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Icon/Logo */}
        <div className="flex-shrink-0">
          <div className="w-full sm:w-[140px] h-[140px] rounded-xl bg-[#F8F9FA] border-2 border-dashed border-[#E5E7EB] flex items-center justify-center">
            <Building2 className="w-12 h-12 text-[#9CA3AF]" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1F2937] mb-2 break-words">
                {profile.businessName}
              </h3>
              {/* NO "Powered by DoHuub" badge for vendors - they own their branding */}
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[13px] text-[#6B7280] hidden sm:inline">
                {isToggling ? "Updating..." : (isActive ? "Active" : "Inactive")}
              </span>
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => onToggleStatus(profile.id, checked)}
                disabled={isToggling}
              />
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
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-[#10B981]" : "bg-[#9CA3AF]"
                  }`}
                />
                <span
                  className={isActive ? "text-[#10B981]" : "text-[#9CA3AF]"}
                >
                  {isActive
                    ? `Active in ${profile.regions} regions`
                    : "Inactive"}
                </span>
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">
                Bookings This Month
              </p>
              <div className="flex items-center gap-2">
                <p className="text-base text-[#1F2937] font-semibold">
                  {profile.bookings}
                </p>
                <div
                  className={`flex items-center gap-1 text-[13px] ${
                    profile.bookingTrend >= 0
                      ? "text-[#10B981]"
                      : "text-[#DC2626]"
                  }`}
                >
                  <TrendingUp
                    className={`w-3.5 h-3.5 ${
                      profile.bookingTrend < 0 ? "rotate-180" : ""
                    }`}
                  />
                  {profile.bookingTrend >= 0 ? "+" : ""}
                  {profile.bookingTrend}%
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Average Rating</p>
              <p className="text-base text-[#1F2937] font-semibold flex items-center gap-1">
                ⭐ {profile.rating}{" "}
                <span className="text-[#6B7280] font-normal">
                  ({profile.reviews} reviews)
                </span>
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">
                Revenue This Month
              </p>
              <div className="flex items-center gap-2">
                <p className="text-base text-[#1F2937] font-semibold">
                  ${profile.revenue.toLocaleString()}
                </p>
                <div
                  className={`flex items-center gap-1 text-[13px] ${
                    profile.revenueTrend >= 0
                      ? "text-[#10B981]"
                      : "text-[#DC2626]"
                  }`}
                >
                  <TrendingUp
                    className={`w-3.5 h-3.5 ${
                      profile.revenueTrend < 0 ? "rotate-180" : ""
                    }`}
                  />
                  {profile.revenueTrend >= 0 ? "+" : ""}
                  {profile.revenueTrend}%
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Active Regions</p>
              <button
                className="text-base text-[#3B82F6] font-semibold hover:underline"
                onClick={() => onViewDetails(profile.id)}
              >
                {profile.regions} regions
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="h-10 px-5 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
              onClick={() => onViewDetails(profile.id)}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">Details</span>
            </Button>
            <Button
              variant="outline"
              className="h-10 px-5 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
              onClick={() => onEdit(profile.id)}
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Store</span>
              <span className="sm:hidden">Edit</span>
            </Button>
            <Button
              variant="outline"
              className="h-10 px-5 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
              onClick={() => onManageListings(profile.id)}
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
      <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
        No Stores Yet
      </h3>
      <p className="text-[15px] text-[#6B7280] mb-6">
        Create your first store to start offering services
      </p>
      <Button
        onClick={() => navigate("/vendor/services/create")}
        className="h-11 px-6 bg-[#1F2937] hover:bg-[#111827] text-white"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create First Store
      </Button>
    </div>
  );
}

export function VendorServices() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [stores, setStores] = useState<VendorStore[]>([]);

  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<VendorStore | null>(null);

  // Fetch stores from API
  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: any = await api.getMyStores();

      // Map API response to VendorStore interface
      const mappedStores: VendorStore[] = (response.stores || response || []).map((store: any) => ({
        id: store.id,
        businessName: store.name || store.businessName,
        category: store.category,
        status: store.status || "ACTIVE",
        regions: store.regions?.length || store.regionCount || 0,
        bookings: store.bookingsThisMonth || store.bookings || 0,
        bookingTrend: store.bookingTrend || 0,
        rating: store.averageRating || store.rating || 0,
        reviews: store.reviewCount || store.reviews || 0,
        revenue: store.revenueThisMonth || store.revenue || 0,
        revenueTrend: store.revenueTrend || 0,
      }));

      setStores(mappedStores);
    } catch (err: any) {
      console.error("Failed to fetch stores:", err);
      setError(err.response?.data?.error || "Failed to load stores. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const filteredStores =
    filter === "all"
      ? stores
      : stores.filter((store) => store.category === filter);

  const handleEdit = (id: string) => {
    navigate(`/vendor/services/edit/${id}`);
  };

  const handleDelete = (profile: VendorStore) => {
    setStoreToDelete(profile);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!storeToDelete) return;

    setIsDeleting(true);

    try {
      await api.deleteStore(storeToDelete.id);

      // Remove from local state
      setStores(prev => prev.filter(s => s.id !== storeToDelete.id));
      setDeleteDialogOpen(false);
      setStoreToDelete(null);
    } catch (err: any) {
      console.error("Failed to delete store:", err);
      setError(err.response?.data?.error || "Failed to delete store. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    setIsTogglingId(id);

    try {
      if (newStatus) {
        await api.activateStore(id);
      } else {
        await api.deactivateStore(id);
      }

      // Update local state
      setStores(prev => prev.map(store =>
        store.id === id
          ? { ...store, status: newStatus ? "ACTIVE" : "PAUSED" }
          : store
      ));
    } catch (err: any) {
      console.error("Failed to toggle store status:", err);
      setError(err.response?.data?.error || "Failed to update store status.");
    } finally {
      setIsTogglingId(null);
    }
  };

  const handleViewDetails = (id: string) => {
    // Navigate to store details or show details dialog
    navigate(`/vendor/services/${id}/details`);
  };

  const handleManageListings = (id: string) => {
    navigate(`/vendor/services/${id}/listings`);
  };

  return (
    <div className="min-h-screen bg-white">
      <VendorTopNav onMenuClick={handleSidebarToggle} vendorName="John Smith" />
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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              My Services
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage your business identities across all service categories
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              onClick={() => navigate("/vendor/services/create")}
              className="h-11 px-6 bg-[#1F2937] hover:bg-[#111827] text-white w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Store
            </Button>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[220px] h-11">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Cleaning Services">
                  Cleaning Services
                </SelectItem>
                <SelectItem value="Handyman Services">
                  Handyman Services
                </SelectItem>
                <SelectItem value="Groceries">Groceries</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Beauty Services">Beauty Services</SelectItem>
                <SelectItem value="Beauty Products">Beauty Products</SelectItem>
                <SelectItem value="Rental Properties">
                  Rental Properties
                </SelectItem>
                <SelectItem value="Ride Assistance">Ride Assistance</SelectItem>
                <SelectItem value="Companionship Support">
                  Companionship Support
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Notice</p>
                <p className="text-sm text-amber-700">{error}</p>
              </div>
              <button
                className="ml-auto text-amber-500 hover:text-amber-700"
                onClick={() => setError(null)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-20 text-center">
              <div className="inline-block w-10 h-10 border-4 border-[#E5E7EB] border-t-[#1F2937] rounded-full animate-spin mb-4" />
              <p className="text-sm text-[#6B7280]">Loading your stores...</p>
            </div>
          )}

          {/* Store Cards */}
          {!isLoading && filteredStores.length === 0 ? (
            <EmptyState />
          ) : !isLoading && (
            <div className="space-y-6">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  profile={store}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                  onManageListings={handleManageListings}
                  onToggleStatus={handleToggleStatus}
                  isTogglingId={isTogglingId}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Store</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{storeToDelete?.businessName}"?
              This action cannot be undone and will remove all associated
              listings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setStoreToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Store"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}