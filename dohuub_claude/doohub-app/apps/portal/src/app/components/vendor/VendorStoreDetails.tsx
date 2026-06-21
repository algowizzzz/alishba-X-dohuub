import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Copy,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import api from "../../../services/api";

const ENUM_TO_LABEL: Record<string, string> = {
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

interface StoreApiData {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  logo: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  createdAt: string;
  regions: Array<{ region: { id: string; name: string; zipcodes?: string[] | null } }>;
  _count?: {
    foodListings?: number;
    beautyProductListings?: number;
    rideAssistanceListings?: number;
    companionshipListings?: number;
  };
}

interface VendorApiData {
  id: string;
  businessName: string | null;
  description: string | null;
  subscriptionStatus: string | null;
  rating: number | null;
  reviewCount: number | null;
  createdAt: string;
  user?: {
    email: string | null;
    phone: string | null;
    profile?: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  };
}

export function VendorStoreDetails() {
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

  const [emailCopied, setEmailCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [nameCopied, setNameCopied] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  const [store, setStore] = useState<StoreApiData | null>(null);
  const [vendor, setVendor] = useState<VendorApiData | null>(null);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [revenueTotal, setRevenueTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.all([
      api.get<any>(`/api/v1/stores/${storeId}`),
      api.get<any>(`/api/v1/vendors/me`),
      api
        .get<any>(`/api/v1/vendors/me/analytics`)
        .catch(() => ({ data: { data: null } } as any)),
    ])
      .then(([storeRes, vendorRes, analyticsRes]) => {
        if (!alive) return;
        const storeData = (storeRes as any)?.data?.data || (storeRes as any)?.data;
        const vendorData = (vendorRes as any)?.data?.data || (vendorRes as any)?.data;
        setStore(storeData);
        setVendor(vendorData);
        const a = (analyticsRes as any)?.data?.data || (analyticsRes as any)?.data || {};
        setBookingsCount(a.totalBookings ?? a.bookings ?? 0);
        setRevenueTotal(a.totalRevenue ?? a.revenue ?? 0);
      })
      .catch((e) => {
        if (!alive) return;
        const msg =
          e?.response?.data?.error || e?.message || "Failed to load store";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [storeId]);

  const ownerName = (() => {
    const p = vendor?.user?.profile;
    if (!p) return "—";
    const f = p.firstName || "";
    const l = p.lastName || "";
    const full = `${f} ${l}`.trim();
    return full || "—";
  })();

  const businessName = vendor?.businessName || store?.name || "—";
  const businessDescription = vendor?.description || store?.description || "—";
  const subscription = vendor?.subscriptionStatus || "TRIAL";
  const joined = vendor?.createdAt
    ? new Date(vendor.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";
  const rating = vendor?.rating ?? 0;
  const reviews = vendor?.reviewCount ?? 0;
  const storeName = store?.name || "Store";
  const categoryLabel = store?.category
    ? ENUM_TO_LABEL[store.category] || store.category
    : "—";
  const email = store?.email || vendor?.user?.email || "—";
  const phone = store?.phone || vendor?.user?.phone || "—";
  const status = (store?.status || "ACTIVE").toUpperCase();
  const isActive = status === "ACTIVE";
  const regions =
    store?.regions?.map((r) => ({
      name: r.region?.name || "—",
      zipcodes: r.region?.zipcodes?.length || 0,
    })) || [];

  const copyAndFlash = (
    text: string,
    setter: (v: boolean) => void
  ) => {
    if (!text || text === "—") return;
    navigator.clipboard.writeText(text);
    setter(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setter(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2E7AD9] animate-spin" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-8">
        <p className="text-[#1A1A2E] font-semibold mb-2">
          Could not load store
        </p>
        <p className="text-sm text-[#6B7280] mb-4">
          {error || "Store not found"}
        </p>
        <button
          onClick={() => navigate("/vendor/services")}
          className="px-4 py-2 bg-[#2E7AD9] text-white rounded-lg hover:bg-[#1E5BB8]"
        >
          Back to My Services
        </button>
      </div>
    );
  }

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
            <span className="text-sm font-medium">Back to My Services</span>
          </button>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Store Details: {storeName}
            </h1>
          </div>

          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="w-full sm:w-[100px] h-[100px] rounded-xl bg-white border border-[rgba(46,122,217,0.25)] flex items-center justify-center shadow-[0_4px_16px_rgba(46,122,217,0.18)] overflow-hidden">
                  {store.logo ? (
                    <img
                      src={store.logo}
                      alt={storeName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-[#9CA3AF]" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-3 break-words">
                  {storeName}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-1">
                      {reviews} reviews
                    </p>
                    <p className="text-base text-[#1A1A2E] font-semibold">
                      ⭐ {rating.toFixed(1)} average
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
                        className={isActive ? "text-[#10B981]" : "text-[#6B7280]"}
                      >
                        {status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-1">Owner</p>
                    <p className="text-base text-[#1A1A2E] font-semibold">
                      {ownerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-1">Category</p>
                    <p className="text-base text-[#1A1A2E] font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {categoryLabel}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-1">Joined</p>
                    <p className="text-base text-[#1A1A2E] font-semibold">
                      {joined}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-[13px] text-[#6B7280] mb-1">
                  TOTAL REVENUE
                </p>
                <p className="text-2xl font-bold text-[#1A1A2E]">
                  ${revenueTotal.toLocaleString()}
                </p>
              </div>
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-[13px] text-[#6B7280] mb-1">
                  TOTAL BOOKINGS
                </p>
                <p className="text-2xl font-bold text-[#1A1A2E]">
                  {bookingsCount}
                </p>
              </div>
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-[13px] text-[#6B7280] mb-1">
                  AVERAGE RATING
                </p>
                <p className="text-2xl font-bold text-[#1A1A2E] flex items-center gap-1">
                  ⭐ {rating.toFixed(1)}
                  <span className="text-base font-normal text-[#6B7280]">
                    ({reviews} reviews)
                  </span>
                </p>
              </div>
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-[13px] text-[#6B7280] mb-1">
                  SUBSCRIPTION
                </p>
                <p className="text-2xl font-bold text-[#10B981]">
                  {subscription}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-6">
              Business Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[13px] text-[#6B7280] mb-1.5">
                  Business Name
                </p>
                <p className="text-base text-[#1A1A2E] font-medium flex items-center gap-2">
                  {businessName}
                  <button
                    onClick={() => copyAndFlash(businessName, setNameCopied)}
                    className="text-[#6B7280] hover:text-[#1A1A2E]"
                    aria-label="Copy business name"
                  >
                    {nameCopied ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </p>
              </div>

              <div>
                <p className="text-[13px] text-[#6B7280] mb-1.5">Owner Name</p>
                <p className="text-base text-[#1A1A2E] font-medium">
                  {ownerName}
                </p>
              </div>

              <div>
                <p className="text-[13px] text-[#6B7280] mb-1.5">Email</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${email}`}
                    className="text-base text-[#2E7AD9] font-medium hover:underline"
                  >
                    {email}
                  </a>
                  <button
                    onClick={() => copyAndFlash(email, setEmailCopied)}
                    className="text-[#6B7280] hover:text-[#1A1A2E]"
                    aria-label="Copy email"
                  >
                    {emailCopied ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[13px] text-[#6B7280] mb-1.5">Phone</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${phone}`}
                    className="text-base text-[#2E7AD9] font-medium hover:underline"
                  >
                    {phone}
                  </a>
                  <button
                    onClick={() => copyAndFlash(phone, setPhoneCopied)}
                    className="text-[#6B7280] hover:text-[#1A1A2E]"
                    aria-label="Copy phone"
                  >
                    {phoneCopied ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-[13px] text-[#6B7280] mb-1.5">
                  Business Description
                </p>
                <p className="text-base text-[#1A1A2E] font-medium flex items-start gap-2">
                  <span className="whitespace-pre-wrap">{businessDescription}</span>
                  <button
                    onClick={() =>
                      copyAndFlash(businessDescription, setAddressCopied)
                    }
                    className="text-[#6B7280] hover:text-[#1A1A2E] mt-1"
                    aria-label="Copy description"
                  >
                    {addressCopied ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
              Active Regions
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              Geographic areas where this store offers services
            </p>

            {regions.length === 0 ? (
              <p className="text-sm text-[#6B7280] italic">
                No active regions yet. Add regions from store settings.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {regions.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                  >
                    <span className="text-sm font-medium text-[#1A1A2E]">
                      📍 {region.name}
                    </span>
                    {region.zipcodes > 0 && (
                      <span className="text-xs text-[#6B7280]">
                        · {region.zipcodes} zipcodes
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
