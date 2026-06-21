import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../services/api";
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

// Map backend enum (ServiceCategory) → UI category label used by the switch below.
const ENUM_TO_LABEL: Record<string, string> = {
  CLEANING: "Cleaning Services",
  HANDYMAN: "Handyman Services",
  BEAUTY: "Beauty Services",
  BEAUTY_PRODUCTS: "Beauty Products",
  GROCERIES: "Groceries",
  FOOD: "Food",
  RENTALS: "Rental Properties",
  RIDE_ASSISTANCE: "Ride Assistance",
  COMPANIONSHIP: "Companionship Support",
};

// Map UI category label → backend enum (round-trip for the POST body).
const CATEGORY_TO_ENUM: Record<string, string> = {
  "Cleaning Services": "CLEANING",
  "Handyman Services": "HANDYMAN",
  "Beauty Services": "BEAUTY",
  "Beauty Products": "BEAUTY_PRODUCTS",
  "Groceries": "GROCERIES",
  "Food": "FOOD",
  "Rental Properties": "RENTALS",
  "Ride Assistance": "RIDE_ASSISTANCE",
  "Companionship Support": "COMPANIONSHIP",
};

export function VendorListingFormRouter() {
  const { storeId, listingId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!listingId;

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

  // Fetch the real store so the correct category-specific form is rendered.
  // The previous implementation hardcoded a 1–9 map and silently fell back to
  // "Cleaning Services" for any real (cuid) storeId.
  const [storeData, setStoreData] = useState<{ category: string; name: string } | null>(null);
  const [storeLoading, setStoreLoading] = useState(true);
  const [storeError, setStoreError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) {
      setStoreLoading(false);
      setStoreError("Missing store id");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ success: boolean; data: { name: string; category: string } }>(
          `/api/v1/stores/${storeId}`
        );
        if (cancelled) return;
        const label = ENUM_TO_LABEL[res.data?.category] || null;
        if (!label) {
          setStoreError(`Unknown store category: ${res.data?.category}`);
        } else {
          setStoreData({ category: label, name: res.data?.name || "Your Store" });
        }
      } catch (e: any) {
        if (cancelled) return;
        setStoreError(e?.response?.data?.error || e?.message || "Failed to load store");
      } finally {
        if (!cancelled) setStoreLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storeId]);

  const category = storeData?.category || "";
  const categoryEnumForFetch = CATEGORY_TO_ENUM[category] || null;

  // Real initial data when editing — fetched from the API. Previously this
  // was a hardcoded "Sample Service" fixture, so every edit opened with
  // pre-filled fake values that overwrote the listing on save.
  const [initialData, setInitialData] = useState<any | undefined>(undefined);
  const [listingLoading, setListingLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditing || !listingId || !categoryEnumForFetch) return;
    let cancelled = false;
    setListingLoading(true);
    api
      .get<{ success: boolean; data: any }>(
        `/api/v1/vendors/listings/${categoryEnumForFetch}/${listingId}`
      )
      .then((r) => {
        if (cancelled) return;
        const d = (r as any)?.data;
        if (!d) return;
        // Normalize back into the field shape the child forms expect.
        // Product-style tables use `name`; service-style use `title`.
        setInitialData({
          id: d.id,
          title: d.title || d.name || "",
          description: d.description || "",
          fullDescription: d.longDescription || d.description || "",
          price: d.basePrice ?? d.price ?? d.hourlyRate ?? 0,
          images: Array.isArray(d.images) ? d.images : d.image ? [d.image] : [],
          whatsIncluded: Array.isArray(d.whatsIncluded) ? d.whatsIncluded : [],
          // category-specific raw pass-through so each form can read what it needs
          ...d,
        });
      })
      .catch((e: any) => {
        toast.error(e?.response?.data?.error || e?.message || "Failed to load listing");
      })
      .finally(() => {
        if (!cancelled) setListingLoading(false);
      });
    return () => { cancelled = true; };
  }, [isEditing, listingId, categoryEnumForFetch]);

  const handleSave = async (data: any, isDraft: boolean) => {
    const categoryEnum = CATEGORY_TO_ENUM[category];
    if (!categoryEnum) {
      toast.error("Store category not loaded yet");
      return;
    }
    try {
      const payload = {
        category: categoryEnum,
        title: data.title || data.name || "",
        description: data.description || data.shortDescription || "",
        fullDescription: data.fullDescription || data.longDescription || undefined,
        price: data.price ?? data.basePrice ?? data.hourlyRate ?? 0,
        images: data.images || data.imageGallery || data.portfolio || [],
        whatsIncluded: data.whatsIncluded || [],
        status: isDraft ? "DRAFT" : "ACTIVE",
        storeId,
        // pass-through optional fields the API accepts when present
        cleaningType: data.cleaningType,
        handymanType: data.handymanType,
        beautyType: data.beautyType,
        duration: data.duration,
        services: data.services,
        portfolio: data.portfolio,
        cuisines: data.cuisines,
        portionSize: data.portionSize,
        productCategory: data.productCategory || data.subCategory,
        brand: data.brand,
        quantityAmount: data.quantityAmount,
        quantityUnit: data.quantityUnit || data.unit,
        propertyType: data.propertyType,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        maxGuests: data.maxGuests,
        amenities: data.amenities,
        pricePerNight: data.pricePerNight,
        pricePerWeek: data.pricePerWeek,
        pricePerMonth: data.pricePerMonth,
        cleaningFee: data.cleaningFee,
        rules: data.rules,
        minStay: data.minStay,
        maxStay: data.maxStay,
        hourlyRate: data.hourlyRate,
        vehicleTypes: data.vehicleTypes,
        specialFeatures: data.specialFeatures,
        coverageArea: data.coverageArea,
        totalSeats: data.totalSeats,
        yearsOfExperience: data.yearsOfExperience,
        credentialImages: data.credentialImages,
        certifications: data.certifications,
        specialties: data.specialties,
        supportTypes: data.supportTypes,
        languages: data.languages,
      };
      if (isEditing && listingId) {
        await api.put(`/api/v1/vendors/listings/${categoryEnum}/${listingId}`, payload);
        toast.success("Listing updated");
      } else {
        await api.post("/api/v1/vendors/listings", payload);
        toast.success(isDraft ? "Saved as draft" : "Listing published");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to save listing");
    }
  };

  // Render appropriate form based on category
  const renderForm = () => {
    if (storeLoading || (isEditing && listingLoading)) {
      return (
        <div className="max-w-[900px] mx-auto text-center py-12">
          <p className="text-sm text-[#6B7280]">Loading…</p>
        </div>
      );
    }
    if (storeError) {
      return (
        <div className="max-w-[900px] mx-auto text-center py-12">
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Could not load store</h2>
          <p className="text-sm text-[#6B7280]">{storeError}</p>
        </div>
      );
    }
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
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">
              Unknown Category
            </h2>
            <p className="text-sm text-[#6B7280]">Form not found</p>
          </div>
        );
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
        {renderForm()}
      </main>
    </div>
  );
}