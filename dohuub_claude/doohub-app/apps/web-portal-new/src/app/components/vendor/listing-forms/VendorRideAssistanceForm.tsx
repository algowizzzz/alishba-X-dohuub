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
  serviceThumbnail: string | null;
  shopName: string;
  hourlyRate: string;
  shortDescription: string;
  longDescription: string;
  vehicleTypes: string[];
  specialFeatures: string;
  coverageArea: string;
  totalSeats: string;
  vehicleImages: string[];
}

interface VendorRideAssistanceFormProps {
  onSave: (data: any, isDraft: boolean) => void;
  initialData?: any;
  isEditing?: boolean;
  storeName?: string;
}

export function VendorRideAssistanceForm({
  onSave,
  initialData,
  isEditing = false,
  storeName = "Ride Assistance Store",
}: VendorRideAssistanceFormProps) {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [formData, setFormData] = useState<FormData>({
    serviceThumbnail: initialData?.serviceThumbnail || null,
    shopName: storeName,
    hourlyRate: initialData?.price?.toString() || "",
    shortDescription: initialData?.description || "",
    longDescription: initialData?.fullDescription || "",
    vehicleTypes: initialData?.vehicleTypes || [],
    specialFeatures: initialData?.specialFeatures || "",
    coverageArea: initialData?.coverageArea || "",
    totalSeats: initialData?.totalSeats?.toString() || "",
    vehicleImages: initialData?.vehicleImages || [],
  });

  const [isSaving, setIsSaving] = useState(false);

  const coverageAreas = ["New York NY", "Brooklyn NY", "Queens NY", "Manhattan NY"];
  const vehicleTypeOptions = ["Standard Vehicle", "Wheelchair Accessible Vehicle"];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVehicleTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((t) => t !== type)
        : [...prev.vehicleTypes, type],
    }));
  };

  const handleImageUpload = () => {
    alert("Image upload functionality - to be implemented");
  };

  const handleGalleryImageAdd = () => {
    if (formData.vehicleImages.length < 5) {
      alert("Gallery image upload functionality - to be implemented");
    } else {
      alert("Maximum 5 images allowed");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      vehicleImages: prev.vehicleImages.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (isDraft: boolean) => {
    setIsSaving(true);

    const listingData = {
      id: isEditing ? initialData?.id : Date.now().toString(),
      title: `Ride Assistance Service - ${formData.coverageArea}`,
      description: formData.shortDescription,
      fullDescription: formData.longDescription,
      price: parseFloat(formData.hourlyRate) || 0,
      vehicleTypes: formData.vehicleTypes,
      specialFeatures: formData.specialFeatures,
      coverageArea: formData.coverageArea,
      totalSeats: parseInt(formData.totalSeats) || 0,
      bookings: initialData?.bookings || 0,
      bookingTrend: initialData?.bookingTrend || 0,
      status: isDraft ? "inactive" : "active",
      rating: initialData?.rating || 0,
      reviews: initialData?.reviews || 0,
      regions: 1,
      serviceRegions: [formData.coverageArea],
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
          {isEditing ? "Edit Service" : "Create New Service"}
        </h1>
        <p className="text-sm sm:text-[15px] text-[#6B7280]">
          {isEditing
            ? "Update your ride assistance service details"
            : "Add a new ride assistance service to your store"}
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-bold text-[#1F2937] mb-6">
          Service Information
        </h2>

        <div className="space-y-6">
          {/* Service Thumbnail */}
          <div>
            <Label className="mb-1.5">
              Service Thumbnail <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-3">JPG or PNG, max 5MB</p>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#9CA3AF] transition-colors">
              <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
              <Button type="button" variant="outline" onClick={handleImageUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Thumbnail
              </Button>
              <p className="text-xs text-[#6B7280] mt-2">
                {formData.serviceThumbnail ? "Image uploaded" : "No image selected"}
              </p>
            </div>
          </div>

          {/* Shop Name - Read Only */}
          <div>
            <Label className="mb-1.5">Shop Name</Label>
            <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
              <span className="text-sm text-[#6B7280]">{formData.shopName}</span>
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <Label htmlFor="hourlyRate" className="mb-1.5">
              Hourly Rate <span className="text-[#DC2626]">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                $
              </span>
              <Input
                id="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                placeholder="0.00"
                className="pl-7 pr-16"
                min="0"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                /hour
              </span>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="shortDescription" className="mb-1.5">
              Short Description <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-2">Maximum 150 characters</p>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value.slice(0, 150))
              }
              placeholder="Brief description of your service"
              rows={3}
              maxLength={150}
            />
            <p className="text-xs text-[#9CA3AF] mt-1 text-right">
              {formData.shortDescription.length}/150
            </p>
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
              placeholder="Detailed description of your service"
              rows={6}
            />
          </div>

          {/* Available Vehicle Types */}
          <div>
            <Label className="mb-1.5">
              Available Vehicle Types <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-3">
              Select all that apply
            </p>
            <div className="space-y-3">
              {vehicleTypeOptions.map((type) => (
                <div key={type} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`vehicle-${type}`}
                    checked={formData.vehicleTypes.includes(type)}
                    onChange={() => handleVehicleTypeToggle(type)}
                    className="mt-1 w-4 h-4 rounded border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
                  />
                  <Label
                    htmlFor={`vehicle-${type}`}
                    className="font-normal cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Special Features */}
          <div>
            <Label htmlFor="specialFeatures" className="mb-1.5">
              Special Features
            </Label>
            <p className="text-xs text-[#6B7280] mb-2">
              Comma-separated list
            </p>
            <Textarea
              id="specialFeatures"
              value={formData.specialFeatures}
              onChange={(e) => handleInputChange("specialFeatures", e.target.value)}
              placeholder="e.g., GPS tracking, Child safety seats, Pet-friendly"
              rows={3}
            />
          </div>

          {/* Coverage Area */}
          <div>
            <Label htmlFor="coverageArea" className="mb-1.5">
              Coverage Area <span className="text-[#DC2626]">*</span>
            </Label>
            <Select
              value={formData.coverageArea}
              onValueChange={(value) => handleInputChange("coverageArea", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coverage area" />
              </SelectTrigger>
              <SelectContent>
                {coverageAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Total Number of Seats */}
          <div>
            <Label htmlFor="totalSeats" className="mb-1.5">
              Total Number of Seats <span className="text-[#DC2626]">*</span>
            </Label>
            <Input
              id="totalSeats"
              type="number"
              value={formData.totalSeats}
              onChange={(e) => handleInputChange("totalSeats", e.target.value)}
              placeholder="1"
              min="1"
              max="15"
            />
          </div>

          {/* Vehicle Images */}
          <div>
            <Label className="mb-1.5">
              Vehicle Images <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-3">
              Up to 5 images (JPG/PNG, max 5MB each, drag to reorder)
            </p>
            <div className="space-y-3">
              {formData.vehicleImages.map((image, index) => (
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
              {formData.vehicleImages.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGalleryImageAdd}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image ({formData.vehicleImages.length}/5)
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
