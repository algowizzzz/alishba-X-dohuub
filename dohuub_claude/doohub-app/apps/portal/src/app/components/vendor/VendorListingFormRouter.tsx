import { useState } from "react";
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

// Map UI category label → backend enum
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

  const storeData = storeDataMap[storeId || "1"];
  const category = storeData?.category || "Cleaning Services";

  // Mock initial data for editing
  const initialData = isEditing
    ? {
        id: listingId,
        title: "Sample Service",
        description: "Sample description",
        fullDescription: "Sample full description",
        price: 100,
        bookings: 25,
        bookingTrend: 10,
        rating: 4.8,
        reviews: 15,
        regions: 2,
        whatsIncluded: ["Professional equipment & supplies", "Trained professionals"],
        serviceRegions: ["New York, NY", "Brooklyn, NY"],
      }
    : undefined;

  const handleSave = async (data: any, isDraft: boolean) => {
    const categoryEnum = CATEGORY_TO_ENUM[category] || "CLEANING";
    try {
      // The child forms pass a flat object with field names like
      // { title, description, fullDescription, price, whatsIncluded, ... }
      // POST to the backend, which switches on `category`.
      await api.post("/api/v1/vendors/listings", {
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
      });
      toast.success(isDraft ? "Saved as draft" : "Listing published");
      navigate(`/vendor/services/${storeId}/listings`);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to save listing");
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