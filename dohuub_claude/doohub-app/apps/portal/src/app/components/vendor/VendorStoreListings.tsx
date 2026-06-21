import { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  Star,
  TrendingUp,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface Listing {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
  status: "active" | "inactive";
  rating: number;
  reviews: number;
  whatsIncluded: string[];
  thumbnail?: string | null;
}

const CATEGORY_LABEL: Record<string, string> = {
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

const PRODUCT_CATEGORIES = new Set(["GROCERIES", "FOOD", "BEAUTY_PRODUCTS"]);

function isProductCategoryEnum(cat: string) {
  return PRODUCT_CATEGORIES.has(cat);
}

function getCreateButtonText(catEnum: string | undefined) {
  if (!catEnum) return "Create New Listing";
  return isProductCategoryEnum(catEnum) ? "Create New Product" : "Create New Service";
}

function normalizeListing(raw: any): Listing {
  const category = String(raw.category || "").toUpperCase();
  const isProduct = isProductCategoryEnum(category);
  const title = raw.title || raw.name || "Untitled";
  const price = Number(
    raw.basePrice ?? raw.price ?? raw.pricePerNight ?? raw.hourlyRate ?? 0
  );
  const whatsIncluded = Array.isArray(raw.whatsIncluded)
    ? raw.whatsIncluded
    : Array.isArray(raw.includes)
      ? raw.includes
      : Array.isArray(raw.amenities)
        ? raw.amenities
        : [];
  const thumbnail =
    raw.image ||
    (Array.isArray(raw.images) && raw.images[0]) ||
    (Array.isArray(raw.portfolio) && raw.portfolio[0]) ||
    (Array.isArray(raw.credentialImages) && raw.credentialImages[0]) ||
    null;
  return {
    id: raw.id,
    category,
    title,
    description: raw.description || raw.fullDescription || "",
    price,
    status: raw.status === "ACTIVE" ? "active" : "inactive",
    rating: Number(raw.rating || 0),
    reviews: Number(raw.reviewCount || raw.totalReviews || 0),
    whatsIncluded,
    thumbnail,
  };
}

interface ListingCardProps {
  listing: Listing;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  busy: boolean;
}

function ListingCard({
  listing,
  onEdit,
  onToggleActive,
  onDelete,
  busy,
}: ListingCardProps) {
  const isActive = listing.status === "active";
  return (
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-4 sm:p-6 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex-shrink-0">
          <div className="w-full sm:w-[100px] h-[100px] rounded-xl bg-white border border-[rgba(46,122,217,0.25)] flex items-center justify-center shadow-[0_4px_16px_rgba(46,122,217,0.18)] overflow-hidden">
            {listing.thumbnail ? (
              <img
                src={listing.thumbnail}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <FileText className="w-10 h-10 text-[#9CA3AF]" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] mb-2 break-words">
            {listing.title}
          </h3>
          {listing.description && (
            <p className="text-sm text-[#6B7280] mb-4">{listing.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Price</p>
              <p className="text-base font-semibold text-[#1A1A2E]">
                ${listing.price.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Category</p>
              <p className="text-base font-semibold text-[#1A1A2E]">
                {CATEGORY_LABEL[listing.category] || listing.category}
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
                <span className={isActive ? "text-[#10B981]" : "text-[#6B7280]"}>
                  {isActive ? "ACTIVE" : "PAUSED"}
                </span>
              </p>
            </div>
          </div>

          {!isProductCategoryEnum(listing.category) &&
            listing.whatsIncluded.length > 0 && (
              <div className="mb-4">
                <p className="text-[13px] font-semibold text-[#1A1A2E] mb-2">
                  What's Included:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {listing.whatsIncluded.slice(0, 6).map((item, index) => (
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

          {(listing.rating > 0 || listing.reviews > 0) && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm mb-4 sm:mb-0">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="font-semibold text-[#1A1A2E]">
                  {listing.rating.toFixed(1)}
                </span>
                <span className="text-[#6B7280]">
                  ({listing.reviews} reviews)
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="h-10 px-5 text-sm flex-1 sm:flex-none"
            onClick={onEdit}
            disabled={busy}
          >
            <span className="hidden sm:inline">Edit</span>
            <span className="sm:hidden">Edit</span>
          </Button>
          <Button
            variant="outline"
            className="h-10 px-5 text-sm flex-1 sm:flex-none"
            onClick={onToggleActive}
            disabled={busy}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="outline"
            className="h-10 px-5 text-sm border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] flex-1 sm:flex-none"
            onClick={onDelete}
            disabled={busy}
          >
            <Trash2 className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

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
  const [listings, setListings] = useState<Listing[]>([]);
  const [storeName, setStoreName] = useState<string>("Store");
  const [storeCategory, setStoreCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);

  useEffect(() => {
    if (!storeId) return;
    let alive = true;
    setLoading(true);

    Promise.all([
      api.get(`/api/v1/stores/${storeId}`).catch(() => null),
      api.get<{ success: boolean; data: any[] }>(`/api/v1/vendors/listings`),
    ])
      .then(([storeRes, listingsRes]) => {
        if (!alive) return;
        const store = (storeRes as any)?.data?.data || (storeRes as any)?.data;
        if (store) {
          setStoreName(store.name || "Store");
          setStoreCategory(String(store.category || "").toUpperCase());
        }
        const all = (listingsRes as any)?.data || [];
        const mapped = all.map(normalizeListing);
        const cat = String(store?.category || "").toUpperCase();
        const filtered = cat ? mapped.filter((l: Listing) => l.category === cat) : mapped;
        setListings(filtered);
      })
      .catch(() => {
        if (alive) setListings([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [storeId]);

  const activeListings = listings.filter((l) => l.status === "active").length;
  const filteredListings =
    statusFilter === "all"
      ? listings
      : listings.filter((l) =>
          statusFilter === "active" ? l.status === "active" : l.status === "inactive"
        );

  const handleToggleActive = async (listing: Listing) => {
    if (pending[listing.id]) return;
    setPending((p) => ({ ...p, [listing.id]: true }));
    const nextStatus = listing.status === "active" ? "PAUSED" : "ACTIVE";
    const prev = listing.status;
    setListings((arr) =>
      arr.map((l) =>
        l.id === listing.id
          ? { ...l, status: nextStatus === "ACTIVE" ? "active" : "inactive" }
          : l
      )
    );
    try {
      await api.patch(
        `/api/v1/vendors/listings/${listing.category}/${listing.id}/status`,
        { status: nextStatus }
      );
      toast.success(
        nextStatus === "ACTIVE" ? "Listing activated" : "Listing paused"
      );
    } catch (e: any) {
      setListings((arr) =>
        arr.map((l) => (l.id === listing.id ? { ...l, status: prev } : l))
      );
      toast.error(
        e?.response?.data?.error || e?.message || "Failed to update listing"
      );
    } finally {
      setPending((p) => ({ ...p, [listing.id]: false }));
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setPending((p) => ({ ...p, [target.id]: true }));
    try {
      await api.delete(`/api/v1/vendors/listings/${target.category}/${target.id}`);
      setListings((arr) => arr.filter((l) => l.id !== target.id));
      toast.success("Listing deleted");
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.error || e?.message || "Failed to delete listing"
      );
    } finally {
      setPending((p) => ({ ...p, [target.id]: false }));
    }
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
          <button
            onClick={() => navigate("/vendor/services")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A2E] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Services</span>
          </button>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-3">
              Manage Listings: {storeName}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B7280] mb-6">
              <span>
                <span className="font-medium">Category:</span>{" "}
                {CATEGORY_LABEL[storeCategory] || storeCategory || "—"}
              </span>
              <span>•</span>
              <span>
                <span className="font-medium">{listings.length}</span> listings
              </span>
              <span>•</span>
              <span>
                <span className="font-medium">{activeListings}</span> active
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() =>
                  navigate(`/vendor/services/${storeId}/listings/create`)
                }
                className="h-11 px-6 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white w-full sm:w-auto"
              >
                {getCreateButtonText(storeCategory)}
              </Button>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-11">
                  <SelectValue placeholder="All Listings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Paused Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#2E7AD9] animate-spin" />
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">
                Listings ({filteredListings.length})
              </h2>

              <div className="space-y-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={`${listing.category}-${listing.id}`}
                    listing={listing}
                    busy={!!pending[listing.id]}
                    onEdit={() =>
                      navigate(
                        `/vendor/services/${storeId}/listings/edit/${listing.id}?type=${listing.category}`
                      )
                    }
                    onToggleActive={() => handleToggleActive(listing)}
                    onDelete={() => setDeleteTarget(listing)}
                  />
                ))}
              </div>

              {filteredListings.length === 0 && (
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-12 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <FileText className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-sm text-[#6B7280]">
                    No listings yet. Click "{getCreateButtonText(storeCategory)}"
                    to add your first one.
                  </p>
                </div>
              )}
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
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={!!(deleteTarget && pending[deleteTarget.id])}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              {deleteTarget && pending[deleteTarget.id]
                ? "Deleting..."
                : "Delete Listing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
