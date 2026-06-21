import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Building2, Plus, Edit, List, Star, Eye, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../ui/dialog";
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
  rating: number;
  reviews: number;
  logoUrl?: string;
}


function VendorProfileCard({
  profile,
  onToggleActive,
  onDelete,
  busy,
}: {
  profile: VendorProfile;
  onToggleActive: (id: string, next: boolean) => Promise<void>;
  onDelete: (profile: VendorProfile) => void;
  busy: boolean;
}) {
  const navigate = useNavigate();
  const isActive = profile.status === "active";
  const handleToggle = async (next: boolean) => {
    if (busy) return;
    await onToggleActive(profile.id, next);
  };

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
            <div className="w-full sm:w-[140px] h-[140px] rounded-xl bg-white border-2 border-dashed border-[rgba(46,122,217,0.25)] flex items-center justify-center">
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
              <Switch checked={isActive} disabled={busy} onCheckedChange={handleToggle} />
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
                  {isActive ? `Active in ${profile.regions} ${profile.regions === 1 ? 'region' : 'regions'}` : "Inactive"}
                </span>
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Total Bookings</p>
              <p className="text-base text-[#1A1A2E] font-semibold">{profile.bookings}</p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Average Rating</p>
              <p className="text-base text-[#1A1A2E] font-semibold flex items-center gap-1">
                ⭐ {profile.rating.toFixed(1)} <span className="text-[#6B7280] font-normal">({profile.reviews} reviews)</span>
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Active Regions</p>
              <button
                onClick={() => navigate(`/admin/michelle-profiles/regions`)}
                className="text-base text-[#2E7AD9] font-semibold hover:underline"
              >
                {profile.regions} {profile.regions === 1 ? 'region' : 'regions'}
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
            <Button
              variant="outline"
              disabled={busy}
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
  const [profiles, setProfiles] = useState<VendorProfile[]>([]);

  const ENUM_TO_CATEGORY: Record<string, string> = {
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

  useEffect(() => {
    api.get<{ success: boolean; data: any[] }>("/api/v1/admin/michelle-profiles?limit=200")
      .then((r) => {
        const arr = (r as any)?.data || [];
        const mapped: VendorProfile[] = arr.map((v: any) => {
          const rawCategory = v.categories?.[0]?.category;
          return {
            id: v.id,
            businessName: v.businessName || "Unnamed Store",
            category: rawCategory ? (ENUM_TO_CATEGORY[rawCategory] || rawCategory) : "Other",
            status: v.isActive ? "active" : "inactive",
            regions: v._count?.serviceAreas ?? v.serviceAreas?.length ?? v._count?.stores ?? 0,
            bookings: v._count?.bookings ?? 0,
            rating: v.rating ?? 0,
            reviews: v.reviewCount ?? 0,
            logoUrl: v.logo || undefined,
          };
        });
        setProfiles(mapped);
      })
      .catch(() => setProfiles([]));
  }, []);

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

  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [deleteTarget, setDeleteTarget] = useState<VendorProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleToggleActive = async (profileId: string, nextActive: boolean) => {
    setPending((p) => ({ ...p, [profileId]: true }));
    const prev = profiles.find((p) => p.id === profileId)?.status;
    setProfiles((arr) =>
      arr.map((p) => (p.id === profileId ? { ...p, status: nextActive ? "active" : "inactive" } : p))
    );
    try {
      await api.put(`/api/v1/admin/michelle-profiles/${profileId}`, {
        status: nextActive ? "APPROVED" : "SUSPENDED",
      });
      toast.success(nextActive ? "Profile activated" : "Profile paused");
    } catch (e: any) {
      setProfiles((arr) =>
        arr.map((p) => (p.id === profileId ? { ...p, status: prev || p.status } : p))
      );
      toast.error(e?.response?.data?.error || e?.message || "Failed to update status");
    } finally {
      setPending((p) => ({ ...p, [profileId]: false }));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/v1/admin/michelle-profiles/${deleteTarget.id}`);
      setProfiles((arr) => arr.filter((p) => p.id !== deleteTarget.id));
      toast.success("Profile deleted (suspended)");
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to delete profile");
    } finally {
      setDeleting(false);
    }
  };

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
                <VendorProfileCard
                  key={profile.id}
                  profile={profile}
                  onToggleActive={handleToggleActive}
                  onDelete={(p) => setDeleteTarget(p)}
                  busy={!!pending[profile.id]}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Michelle Profile</DialogTitle>
            <DialogDescription>
              Suspend "{deleteTarget?.businessName}"? All its listings will be paused and
              hidden from customers. You can restore the profile by re-activating it later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting} className="bg-[#DC2626] hover:bg-[#B91C1C]">
              {deleting ? "Deleting..." : "Delete Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}