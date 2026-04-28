import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Save, Send } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface FormData {
  propertyThumbnail: string | null;
  propertyTitle: string;
  region: string;
  propertyType: string;
  shortDescription: string;
  bedrooms: string;
  bathrooms: string;
  maxGuests: string;
  totalArea: string;
  areaUnit: string;
  pricePerNight: string;
  amenities: string[];
  longDescription: string;
  latitude: string;
  longitude: string;
  houseRules: string;
  cleaningFee: string;
  serviceFee: string;
  unavailableDates: string[];
  propertyImages: string[];
}

interface VendorRentalPropertyFormProps {
  onSave: (data: any, isDraft: boolean) => void;
  initialData?: any;
  isEditing?: boolean;
}

export function VendorRentalPropertyForm({
  onSave,
  initialData,
  isEditing = false,
}: VendorRentalPropertyFormProps) {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [formData, setFormData] = useState<FormData>({
    propertyThumbnail: initialData?.propertyThumbnail || null,
    propertyTitle: initialData?.title || "",
    region: initialData?.region || "",
    propertyType: initialData?.propertyType || "",
    shortDescription: initialData?.description || "",
    bedrooms: initialData?.bedrooms?.toString() || "",
    bathrooms: initialData?.bathrooms?.toString() || "",
    maxGuests: initialData?.maxGuests?.toString() || "",
    totalArea: initialData?.totalArea?.toString() || "",
    areaUnit: initialData?.areaUnit || "ft²",
    pricePerNight: initialData?.price?.toString() || "",
    amenities: initialData?.amenities || [],
    longDescription: initialData?.fullDescription || "",
    latitude: initialData?.latitude?.toString() || "",
    longitude: initialData?.longitude?.toString() || "",
    houseRules: initialData?.houseRules || "",
    cleaningFee: initialData?.cleaningFee?.toString() || "",
    serviceFee: initialData?.serviceFee?.toString() || "",
    unavailableDates: initialData?.unavailableDates || [],
    propertyImages: initialData?.propertyImages || [],
  });

  const [isSaving, setIsSaving] = useState(false);

  const regions = ["Manhattan NY", "Brooklyn NY", "Queens NY", "Bronx NY", "Jersey City NJ"];
  const propertyTypes = ["Apartment", "House", "Condo", "Studio", "Loft", "Townhouse", "Villa", "Penthouse"];
  const areaUnits = ["ft² (Square feet)", "m² (Square meters)"];

  const amenitiesData = {
    "Essential Amenities": [
      "WiFi", "Kitchen", "Air Conditioning", "Heating", "TV", "Washer",
      "Dryer", "Hot Water", "Essentials", "Hair Dryer", "Iron"
    ],
    "Kitchen & Dining": [
      "Refrigerator", "Microwave", "Oven", "Stove", "Dishwasher",
      "Coffee Maker", "Cooking Basics", "Dishes & Silverware", "Dining Table"
    ],
    "Property Features": [
      "Private Entrance", "Lockbox/Smart Lock", "Free Parking", "Paid Parking",
      "Elevator", "Balcony/Patio", "Outdoor Furniture", "Garden/Backyard",
      "Pool", "Hot Tub", "Gym", "Fireplace", "BBQ Grill"
    ],
    "Safety & Security": [
      "Smoke Alarm", "Carbon Monoxide Alarm", "Fire Extinguisher", "First Aid Kit",
      "Security Cameras (Exterior)", "Doorman"
    ],
    "Accessibility & Extras": [
      "Wheelchair Accessible", "Step-Free Access", "Single-Level Home",
      "Family/Kid Friendly", "Crib", "High Chair", "Extra Pillows & Blankets",
      "Closet/Wardrobe", "Hangers", "Luggage Dropoff Allowed",
      "Long-Term Stays Allowed", "Self Check-in", "Cleaning Before Checkout",
      "Pet Friendly", "Smoking Allowed"
    ],
    "Location & Views": [
      "Beach Access", "Lake Access", "Waterfront", "City View", "Mountain View"
    ]
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = () => {
    alert("Image upload functionality - to be implemented");
  };

  const handleGalleryImageAdd = () => {
    if (formData.propertyImages.length < 5) {
      alert("Gallery image upload functionality - to be implemented");
    } else {
      alert("Maximum 5 images allowed");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      propertyImages: prev.propertyImages.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (isDraft: boolean) => {
    setIsSaving(true);

    const listingData = {
      id: isEditing ? initialData?.id : Date.now().toString(),
      title: formData.propertyTitle,
      description: formData.shortDescription,
      fullDescription: formData.longDescription,
      region: formData.region,
      propertyType: formData.propertyType,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseFloat(formData.bathrooms) || 0,
      maxGuests: parseInt(formData.maxGuests) || 0,
      totalArea: parseFloat(formData.totalArea) || 0,
      areaUnit: formData.areaUnit,
      price: parseFloat(formData.pricePerNight) || 0,
      amenities: formData.amenities,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      houseRules: formData.houseRules,
      cleaningFee: parseFloat(formData.cleaningFee) || 0,
      serviceFee: parseFloat(formData.serviceFee) || 0,
      unavailableDates: formData.unavailableDates,
      bookings: initialData?.bookings || 0,
      bookingTrend: initialData?.bookingTrend || 0,
      status: isDraft ? "inactive" : "active",
      rating: initialData?.rating || 0,
      reviews: initialData?.reviews || 0,
      regions: 1,
      serviceRegions: [formData.region],
    };

    setTimeout(() => {
      setIsSaving(false);
      onSave(listingData, isDraft);
      navigate(`/vendor/services/${storeId}/listings`);
    }, 500);
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <button
        onClick={() => navigate(`/vendor/services/${storeId}/listings`)}
        className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F2937] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Listings</span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
          {isEditing ? "Edit Property" : "Create New Property"}
        </h1>
        <p className="text-sm sm:text-[15px] text-[#6B7280]">
          {isEditing
            ? "Update your rental property listing details"
            : "Add a new rental property to your store"}
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-bold text-[#1F2937] mb-6">
          Property Information
        </h2>

        <div className="space-y-6">
          {/* Property Thumbnail */}
          <div>
            <Label className="mb-1.5">
              Property Thumbnail <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-3">JPG or PNG, max 5MB</p>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#9CA3AF] transition-colors">
              <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
              <Button type="button" variant="outline" onClick={handleImageUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Thumbnail
              </Button>
              <p className="text-xs text-[#6B7280] mt-2">
                {formData.propertyThumbnail ? "Image uploaded" : "No image selected"}
              </p>
            </div>
          </div>

          {/* Property Title */}
          <div>
            <Label htmlFor="propertyTitle" className="mb-1.5">
              Property Title <span className="text-[#DC2626]">*</span>
            </Label>
            <Input
              id="propertyTitle"
              type="text"
              value={formData.propertyTitle}
              onChange={(e) => handleInputChange("propertyTitle", e.target.value)}
              placeholder="e.g., Modern 2BR Apartment in Manhattan"
            />
          </div>

          {/* Region */}
          <div>
            <Label htmlFor="region" className="mb-1.5">
              Region <span className="text-[#DC2626]">*</span>
            </Label>
            <Select
              value={formData.region}
              onValueChange={(value) => handleInputChange("region", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div>
            <Label htmlFor="propertyType" className="mb-1.5">
              Property Type <span className="text-[#DC2626]">*</span>
            </Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) => handleInputChange("propertyType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="shortDescription" className="mb-1.5">
              Short Description <span className="text-[#DC2626]">*</span>
            </Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => handleInputChange("shortDescription", e.target.value)}
              placeholder="Brief description of your property"
              rows={3}
            />
          </div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bedrooms" className="mb-1.5">
                Bedrooms <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms" className="mb-1.5">
                Bathrooms <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <Label htmlFor="maxGuests" className="mb-1.5">
                Max Guests <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="maxGuests"
                type="number"
                value={formData.maxGuests}
                onChange={(e) => handleInputChange("maxGuests", e.target.value)}
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          {/* Total Area */}
          <div>
            <Label className="mb-1.5">
              Total Area <span className="text-[#DC2626]">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                value={formData.totalArea}
                onChange={(e) => handleInputChange("totalArea", e.target.value)}
                placeholder="0"
                min="0"
              />
              <Select
                value={formData.areaUnit}
                onValueChange={(value) => handleInputChange("areaUnit", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {areaUnits.map((unit) => (
                    <SelectItem key={unit} value={unit.split(" ")[0]}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Per Night */}
          <div>
            <Label htmlFor="pricePerNight" className="mb-1.5">
              Price Per Night <span className="text-[#DC2626]">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                $
              </span>
              <Input
                id="pricePerNight"
                type="number"
                value={formData.pricePerNight}
                onChange={(e) => handleInputChange("pricePerNight", e.target.value)}
                placeholder="0.00"
                className="pl-7"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="mb-1.5">Amenities</Label>
            <p className="text-xs text-[#6B7280] mb-3">
              Select all that apply ({formData.amenities.length} selected)
            </p>
            <div className="border border-[#E5E7EB] rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-6">
              {Object.entries(amenitiesData).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-3">{category}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {items.map((amenity) => (
                      <div key={amenity} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="mt-0.5 w-4 h-4 rounded border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
                        />
                        <Label
                          htmlFor={`amenity-${amenity}`}
                          className="text-xs font-normal cursor-pointer"
                        >
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Long Description */}
          <div>
            <Label htmlFor="longDescription" className="mb-1.5">
              Long Description <span className="text-[#DC2626]">*</span>
            </Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => handleInputChange("longDescription", e.target.value)}
              placeholder="Detailed description of your property"
              rows={6}
            />
          </div>

          {/* Location Coordinates */}
          <div>
            <Label className="mb-1.5">Location Coordinates (Optional)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="mb-1.5 text-xs text-[#6B7280]">
                  Latitude (N)
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange("latitude", e.target.value)}
                  placeholder="40.7128"
                  step="0.000001"
                />
              </div>
              <div>
                <Label htmlFor="longitude" className="mb-1.5 text-xs text-[#6B7280]">
                  Longitude (W)
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange("longitude", e.target.value)}
                  placeholder="-74.0060"
                  step="0.000001"
                />
              </div>
            </div>
          </div>

          {/* House Rules */}
          <div>
            <Label htmlFor="houseRules" className="mb-1.5">
              House Rules
            </Label>
            <Textarea
              id="houseRules"
              value={formData.houseRules}
              onChange={(e) => handleInputChange("houseRules", e.target.value)}
              placeholder="List your house rules here..."
              rows={4}
            />
          </div>

          {/* Additional Fees */}
          <div>
            <Label className="mb-1.5">Additional Fees</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cleaningFee" className="mb-1.5 text-xs text-[#6B7280]">
                  Cleaning Fee
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                    $
                  </span>
                  <Input
                    id="cleaningFee"
                    type="number"
                    value={formData.cleaningFee}
                    onChange={(e) => handleInputChange("cleaningFee", e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="serviceFee" className="mb-1.5 text-xs text-[#6B7280]">
                  Service Fee
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                    $
                  </span>
                  <Input
                    id="serviceFee"
                    type="number"
                    value={formData.serviceFee}
                    onChange={(e) => handleInputChange("serviceFee", e.target.value)}
                    placeholder="0.00"
                    className="pl-7"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Image Gallery */}
          <div>
            <Label className="mb-1.5">
              Property Image Gallery <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-3">
              Up to 5 images (JPG/PNG, max 5MB each, drag to reorder)
            </p>
            <div className="space-y-3">
              {formData.propertyImages.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-lg"
                >
                  <div className="w-12 h-12 bg-[#F3F4F6] rounded flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#9CA3AF]" />
                  </div>
                  <span className="flex-1 text-sm text-[#6B7280]">
                    Image {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveGalleryImage(index)}
                  >
                    <X className="w-4 h-4 text-[#DC2626]" />
                  </Button>
                </div>
              ))}
              {formData.propertyImages.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGalleryImageAdd}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image ({formData.propertyImages.length}/5)
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pb-8">
        <Button
          variant="outline"
          onClick={() => handleSave(true)}
          disabled={isSaving}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button
          onClick={() => handleSave(false)}
          disabled={isSaving}
          className="flex-1 bg-[#1F2937] hover:bg-[#111827]"
        >
          <Send className="w-4 h-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
}
