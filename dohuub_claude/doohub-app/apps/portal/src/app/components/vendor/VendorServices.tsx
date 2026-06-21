import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../services/api";
import {
  Plus,
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
} from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
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
  status: "active" | "inactive";
  regions: number;
  bookings: number;
  bookingTrend: number;
  rating: number;
  reviews: number;
  revenue: number;
  revenueTrend: number;
  logoUrl?: string | null;
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
  onManageRegions: (id: string) => void;
  onToggleStatus: (id: string, nextActive: boolean) => Promise<void>;
}

function StoreCard({
  profile,
  onEdit,
  onDelete,
  onViewDetails,
  onManageListings,
  onManageRegions,
  onToggleStatus,
}: StoreCardProps) {
  const isActive = profile.status === "active";
  const [toggling, setToggling] = useState(false);

  const handleSwitch = async (next: boolean) => {
    if (toggling) return;
    setToggling(true);
    try {
      await onToggleStatus(profile.id, next);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Icon/Logo */}
        <div className="flex-shrink-0">
          <div className="w-full sm:w-[140px] h-[140px] rounded-xl bg-white border-2 border-dashed border-[rgba(46,122,217,0.25)] flex items-center justify-center overflow-hidden">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt={profile.businessName} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-12 h-12 text-[#9CA3AF]" />
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-2 break-words">
                {profile.businessName}
              </h3>
              {/* NO "Powered by DoHuub" badge for vendors - they own their branding */}
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[13px] text-[#6B7280] hidden sm:inline">
                {isActive ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={isActive}
                disabled={toggling}
                onCheckedChange={handleSwitch}
              />
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
                <p className="text-base text-[#1A1A2E] font-semibold">
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
              <p className="text-base text-[#1A1A2E] font-semibold flex items-center gap-1">
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
                <p className="text-base text-[#1A1A2E] font-semibold">
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
                onClick={() => onManageRegions(profile.id)}
                className="text-base text-[#2E7AD9] font-semibold hover:underline"
              >
                {profile.regions} {profile.regions === 1 ? "region" : "regions"}
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
            <Button
              variant="outline"
              className="h-10 px-5 flex items-center justify-center gap-2 text-sm w-full sm:w-auto text-[#DC2626] border-[#FCA5A5] hover:bg-[#FEF2F2]"
              onClick={() => onDelete(profile)}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
              <span className="sm:hidden">Delete</span>
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
      <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center mb-6">
        <Building2 className="w-16 h-16 text-[#9CA3AF]" />
      </div>
      <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">
        No Stores Yet
      </h3>
      <p className="text-[15px] text-[#6B7280] mb-6">
        Create your first store to start offering services
      </p>
      <Button
        onClick={() => navigate("/vendor/services/create")}
        className="h-11 px-6 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white"
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

  useEffect(() => {
    const ENUM_TO_LABEL: Record<string, string> = {
      CLEANING: "Cleaning Services",
      HANDYMAN: "Handyman Services",
      GROCERIES: "Grocery",
      BEAUTY: "Beauty Services",
      BEAUTY_PRODUCTS: "Beauty Products",
      FOOD: "Food",
      RENTALS: "Rental Properties",
      RIDE_ASSISTANCE: "Ride Assistance",
      COMPANIONSHIP: "Companionship Support",
    };
    api.get<{ success: boolean; data: any[] }>("/api/v1/stores?limit=200")
      .then((r) => {
        const arr = (r as any)?.data || [];
        const mapped: VendorStore[] = arr.map((s: any) => {
          const counts = s._count || {};
          const listingsTotal = Object.values(counts).reduce(
            (acc: number, n) => acc + (typeof n === "number" ? n : 0),
            0
          ) as number;
          return {
            id: s.id,
            businessName: s.name || "Untitled Store",
            category: ENUM_TO_LABEL[s.category] || s.category || "Other",
            status: (s.status === "ACTIVE" ? "active" : "inactive") as "active" | "inactive",
            regions: Array.isArray(s.regions) ? s.regions.filter((r: any) => r.isActive).length : 0,
            bookings: listingsTotal,
            bookingTrend: 0,
            rating: 0,
            reviews: 0,
            revenue: 0,
            revenueTrend: 0,
            logoUrl: s.logo || null,
          };
        });
        setStores(mapped);
      })
      .catch(() => setStores([]));
  }, []);

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

  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!storeToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/v1/stores/${storeToDelete.id}`);
      setStores((prev) => prev.filter((s) => s.id !== storeToDelete.id));
      toast.success("Store deleted");
      setDeleteDialogOpen(false);
      setStoreToDelete(null);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.error || e?.message || "Failed to delete store"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, nextActive: boolean) => {
    const nextStatus = nextActive ? "ACTIVE" : "PAUSED";
    const prevStatus = stores.find((s) => s.id === id)?.status;
    setStores((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: nextActive ? "active" : "inactive" } : s
      )
    );
    try {
      await api.patch(`/api/v1/stores/${id}/status`, { status: nextStatus });
      toast.success(nextActive ? "Store activated" : "Store paused");
    } catch (e: any) {
      setStores((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: prevStatus || s.status } : s))
      );
      toast.error(
        e?.response?.data?.error || e?.message || "Failed to update status"
      );
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/vendor/services/${id}/details`);
  };

  const handleManageListings = (id: string) => {
    navigate(`/vendor/services/${id}/listings`);
  };

  const handleManageRegions = (id: string) => {
    navigate(`/vendor/services/${id}/regions`);
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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
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
              className="h-11 px-6 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white w-full sm:w-auto"
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

          {/* Store Cards */}
          {filteredStores.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  profile={store}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                  onManageListings={handleManageListings}
                  onManageRegions={handleManageRegions}
                  onToggleStatus={handleToggleStatus}
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
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              {deleting ? "Deleting..." : "Delete Store"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}