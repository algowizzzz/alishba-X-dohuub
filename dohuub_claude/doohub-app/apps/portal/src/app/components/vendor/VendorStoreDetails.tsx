import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { vendorBusinessInfo, storeDataMap } from "../../data/vendorBusinessData";

interface StoreDetails {
  id: string;
  businessName: string;
  storeName: string;
  category: string;
  status: "active" | "inactive";
  owner: string;
  email: string;
  phone: string;
  taxId: string;
  businessAddress: string;
  businessType: string;
  regions: Array<{ name: string; zipcodes: number }>;
  rating: number;
  reviews: number;
  totalRevenue: number;
  totalBookings: number;
  subscription: string;
  joined: string;
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

  const store = storeDataMap[storeId || "1"] || storeDataMap["1"];

  // Construct store details combining shared business info with store-specific data
  const storeDetails = {
    id: storeId || "1",
    businessName: vendorBusinessInfo.businessName,
    storeName: store.name,
    category: store.category,
    status: "active" as const,
    owner: vendorBusinessInfo.owner,
    email: vendorBusinessInfo.email,
    phone: vendorBusinessInfo.phone,
    taxId: vendorBusinessInfo.taxId,
    businessAddress: vendorBusinessInfo.businessAddress,
    businessType: vendorBusinessInfo.businessType,
    regions: [
      { name: "New York, NY", zipcodes: 45 },
      { name: "Brooklyn, NY", zipcodes: 38 },
    ],
    rating: 4.8,
    reviews: 156,
    totalRevenue: 45200,
    totalBookings: 312,
    subscription: vendorBusinessInfo.subscription,
    joined: vendorBusinessInfo.joined,
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(storeDetails.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(storeDetails.phone);
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2000);
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
          {/* Back Button */}
          <button
            onClick={() => navigate("/vendor/services")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A2E] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to My Services</span>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Store Details: {storeDetails.storeName}
            </h1>
          </div>

          {/* Store Summary Card */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-full sm:w-[100px] h-[100px] rounded-xl bg-[#F8FAFF] border border-[rgba(46,122,217,0.25)] flex items-center justify-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <Building2 className="w-10 h-10 text-[#9CA3AF]" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-3 break-words">
                  {storeDetails.storeName}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-1">
                      {storeDetails.reviews} reviews
                    </p>
                    <p className="text-base text-[#1A1A2E] font-semibold">
                      ⭐ {storeDetails.rating} average
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-1">Status</p>
                    <p className="text-base font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-[#10B981]">ACTIVE</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-1">Owner</p>
                    <p className="text-base text-[#1A1A2E] font-semibold">
                      {storeDetails.owner}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-1">Category</p>
                    <p className="text-base text-[#1A1A2E] font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {storeDetails.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-1">Joined</p>
                    <p className="text-base text-[#1A1A2E] font-semibold">
                      {storeDetails.joined}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
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
                  ${storeDetails.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-[13px] text-[#6B7280] mb-1">
                  TOTAL BOOKINGS
                </p>
                <p className="text-2xl font-bold text-[#1A1A2E]">
                  {storeDetails.totalBookings}
                </p>
              </div>
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-[13px] text-[#6B7280] mb-1">
                  AVERAGE RATING
                </p>
                <p className="text-2xl font-bold text-[#1A1A2E] flex items-center gap-1">
                  ⭐ {storeDetails.rating}
                  <span className="text-base font-normal text-[#6B7280]">
                    ({storeDetails.reviews} reviews)
                  </span>
                </p>
              </div>
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-[13px] text-[#6B7280] mb-1">
                  SUBSCRIPTION
                </p>
                <p className="text-2xl font-bold text-[#10B981]">
                  {storeDetails.subscription}
                </p>
              </div>
            </div>
          </div>

          {/* Business Information */}
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
                  {storeDetails.businessName}
                  <button className="text-[#6B7280] hover:text-[#1A1A2E]">
                    <Copy className="w-4 h-4" />
                  </button>
                </p>
              </div>

              <div>
                <p className="text-[13px] text-[#6B7280] mb-1.5">
                  Owner Name
                </p>
                <p className="text-base text-[#1A1A2E] font-medium">
                  {storeDetails.owner}
                </p>
              </div>

              <div>
                <p className="text-[13px] text-[#6B7280] mb-1.5">Email</p>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${storeDetails.email}`}
                    className="text-base text-[#2E7AD9] font-medium hover:underline"
                  >
                    {storeDetails.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="text-[#6B7280] hover:text-[#1A1A2E]"
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
                    href={`tel:${storeDetails.phone}`}
                    className="text-base text-[#2E7AD9] font-medium hover:underline"
                  >
                    {storeDetails.phone}
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    className="text-[#6B7280] hover:text-[#1A1A2E]"
                  >
                    {phoneCopied ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[13px] text-[#6B7280] mb-1.5">
                  Business Address
                </p>
                <p className="text-base text-[#1A1A2E] font-medium flex items-center gap-2">
                  {storeDetails.businessAddress}
                  <button className="text-[#6B7280] hover:text-[#1A1A2E]">
                    <Copy className="w-4 h-4" />
                  </button>
                </p>
              </div>

              <div>
                <p className="text-[13px] text-[#6B7280] mb-1.5">
                  Business Type
                </p>
                <p className="text-base text-[#1A1A2E] font-medium">
                  {storeDetails.businessType}
                </p>
              </div>

              <div>
                <p className="text-[13px] text-[#6B7280] mb-1.5">Tax ID/EIN</p>
                <p className="text-base text-[#1A1A2E] font-medium">
                  {storeDetails.taxId}
                </p>
              </div>
            </div>
          </div>

          {/* Active Regions */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
              Active Regions
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              Geographic areas where this store offers services
            </p>

            <div className="flex flex-wrap gap-3">
              {storeDetails.regions.map((region, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFF] border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                >
                  <span className="text-sm font-medium text-[#1A1A2E]">
                    📍 {region.name}
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    · {region.zipcodes} zipcodes
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}