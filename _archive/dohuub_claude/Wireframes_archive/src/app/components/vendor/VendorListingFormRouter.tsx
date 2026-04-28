import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { VendorCleaningServiceForm } from "./listing-forms/VendorCleaningServiceForm";
import { VendorHandymanServiceForm } from "./listing-forms/VendorHandymanServiceForm";
import { VendorBeautyServiceForm } from "./listing-forms/VendorBeautyServiceForm";
import { VendorBeautyProductForm } from "./listing-forms/VendorBeautyProductForm";
import { VendorGroceryForm } from "./listing-forms/VendorGroceryForm";
import { VendorFoodForm } from "./listing-forms/VendorFoodForm";
import { VendorRentalPropertyForm } from "./listing-forms/VendorRentalPropertyForm";
import { VendorRideAssistanceForm } from "./listing-forms/VendorRideAssistanceForm";
import { VendorCompanionshipSupportForm } from "./listing-forms/VendorCompanionshipSupportForm";
import { api } from "../../../services/api";

// Store category mapping
const storeDataMap: Record<string, { category: string; name: string }> = {
  "1": { category: "Cleaning Services", name: "Sparkle Clean Co." },
  "2": { category: "Handyman Services", name: "Fix-It Pro Services" },
  "3": { category: "Groceries", name: "Fresh Harvest Groceries" },
  "4": { category: "Food", name: "Mama's Kitchen" },
  "5": { category: "Beauty Services", name: "Glam Beauty Studio" },
  "6": { category: "Beauty Products", name: "Pure Skincare Boutique" },
  "7": { category: "Rental Properties", name: "Urban Stays Properties" },
  "8": { category: "Ride Assistance", name: "CareWheels Transportation" },
  "9": { category: "Companionship Support", name: "Caring Companions" },
};

// Map category to API endpoint type
const categoryToApiType: Record<string, string> = {
  "Cleaning Services": "cleaning",
  "Handyman Services": "handyman",
  "Beauty Services": "beauty",
  "Beauty Products": "beauty-products",
  "Groceries": "groceries",
  "Food": "food",
  "Rental Properties": "rentals",
  "Ride Assistance": "ride-assistance",
  "Companionship Support": "companionship",
};

export function VendorListingFormRouter() {
  const { storeId, listingId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!listingId;

  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storeData, setStoreData] = useState<{ category: string; name: string } | null>(null);
  const [initialData, setInitialData] = useState<any>(undefined);

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

  // Fetch store data to get category
  const fetchStoreData = useCallback(async () => {
    if (!storeId) return;

    try {
      const store: any = await api.getStoreById(storeId);
      setStoreData({
        category: store.category || "Cleaning Services",
        name: store.name || "Store",
      });
    } catch (err) {
      console.error("Failed to fetch store:", err);
      // Fallback to mock data
      const fallback = storeDataMap[storeId] || { category: "Cleaning Services", name: "Store" };
      setStoreData(fallback);
    }
  }, [storeId]);

  // Fetch listing data when editing
  const fetchListingData = useCallback(async () => {
    if (!isEditing || !listingId || !storeData) return;

    try {
      const apiType = categoryToApiType[storeData.category] || "cleaning";
      const listing: any = await api.get(`/${apiType}/${listingId}`);

      setInitialData({
        id: listing.id,
        title: listing.title || listing.name,
        description: listing.description,
        fullDescription: listing.fullDescription || listing.description,
        price: listing.price || listing.basePrice,
        bookings: listing.bookingsThisMonth || 0,
        bookingTrend: listing.bookingTrend || 0,
        rating: listing.averageRating || 0,
        reviews: listing.reviewCount || 0,
        regions: listing.regions?.length || 0,
        whatsIncluded: listing.whatsIncluded || listing.features || [],
        serviceRegions: listing.regions?.map((r: any) => r.name) || [],
        images: listing.images || [],
        ...listing, // Include all other fields
      });
    } catch (err) {
      console.error("Failed to fetch listing:", err);
      setError("Failed to load listing data.");
    }
  }, [isEditing, listingId, storeData]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchStoreData();
      setIsLoading(false);
    };
    loadData();
  }, [fetchStoreData]);

  useEffect(() => {
    if (storeData && isEditing) {
      fetchListingData();
    }
  }, [storeData, isEditing, fetchListingData]);

  const category = storeData?.category || "Cleaning Services";

  const handleSave = async (data: any, isDraft: boolean) => {
    if (!storeId) return;

    setIsSaving(true);
    setError(null);

    try {
      const apiType = categoryToApiType[category] || "cleaning";

      // Prepare listing data
      const listingData = {
        ...data,
        storeId,
        status: isDraft ? "DRAFT" : "ACTIVE",
      };

      if (isEditing && listingId) {
        // Update existing listing
        await api.put(`/${apiType}/${listingId}`, listingData);
      } else {
        // Create new listing
        await api.post(`/${apiType}`, listingData);
      }

      // Navigate back to store listings
      navigate(`/vendor/services/${storeId}/listings`);
    } catch (err: any) {
      console.error("Failed to save listing:", err);
      setError(err.response?.data?.error || "Failed to save listing. Please try again.");
      setIsSaving(false);
    }
  };

  // Render appropriate form based on category
  const renderForm = () => {
    switch (category) {
      case "Cleaning Services":
        return (
          <VendorCleaningServiceForm
            onSave={handleSave}
            initialData={initialData}
            isEditing={isEditing}
          />
        );
      case "Handyman Services":
        return (
          <VendorHandymanServiceForm
            onSave={handleSave}
            initialData={initialData}
            isEditing={isEditing}
          />
        );
      case "Beauty Services":
        return (
          <VendorBeautyServiceForm
            onSave={handleSave}
            initialData={initialData}
            isEditing={isEditing}
          />
        );
      case "Beauty Products":
        return (
          <VendorBeautyProductForm
            onSave={handleSave}
            initialData={initialData}
            isEditing={isEditing}
            storeName={storeData?.name}
          />
        );
      case "Groceries":
        return (
          <VendorGroceryForm
            onSave={handleSave}
            initialData={initialData}
            isEditing={isEditing}
            storeName={storeData?.name}
          />
        );
      case "Food":
        return (
          <VendorFoodForm
            onSave={handleSave}
            initialData={initialData}
            isEditing={isEditing}
            storeName={storeData?.name}
          />
        );
      case "Rental Properties":
        return (
          <VendorRentalPropertyForm
            onSave={handleSave}
            initialData={initialData}
            isEditing={isEditing}
          />
        );
      case "Ride Assistance":
        return (
          <VendorRideAssistanceForm
            onSave={handleSave}
            initialData={initialData}
            isEditing={isEditing}
            storeName={storeData?.name}
          />
        );
      case "Companionship Support":
        return (
          <VendorCompanionshipSupportForm
            onSave={handleSave}
            initialData={initialData}
            isEditing={isEditing}
          />
        );
      default:
        return (
          <div className="max-w-[900px] mx-auto text-center py-12">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">
              Unknown Category
            </h2>
            <p className="text-sm text-[#6B7280]">Form not found</p>
          </div>
        );
    }
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
        {/* Error Message */}
        {error && (
          <div className="max-w-[900px] mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              className="ml-auto text-red-500 hover:text-red-700"
              onClick={() => setError(null)}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="max-w-[900px] mx-auto py-20 text-center">
            <div className="inline-block w-10 h-10 border-4 border-[#E5E7EB] border-t-[#1F2937] rounded-full animate-spin mb-4" />
            <p className="text-sm text-[#6B7280]">Loading...</p>
          </div>
        ) : (
          renderForm()
        )}

        {/* Saving Overlay */}
        {isSaving && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-[#E5E7EB] border-t-[#1F2937] rounded-full animate-spin" />
              <p className="text-sm font-medium text-[#1F2937]">Saving listing...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}