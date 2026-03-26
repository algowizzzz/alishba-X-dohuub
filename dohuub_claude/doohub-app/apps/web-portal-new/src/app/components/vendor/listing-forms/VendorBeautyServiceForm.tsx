import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Save, Send } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

interface IncludedItem {
  id: string;
  text: string;
  checked: boolean;
}

interface FormData {
  thumbnailImage: string | null;
  serviceTitle: string;
  shortDescription: string;
  imageGallery: string[];
  longDescription: string;
  price: string;
  duration: string;
  whatsIncluded: IncludedItem[];
  customIncludedItems: string[];
}

interface VendorBeautyServiceFormProps {
  onSave: (data: any, isDraft: boolean) => void;
  initialData?: any;
  isEditing?: boolean;
}

export function VendorBeautyServiceForm({
  onSave,
  initialData,
  isEditing = false,
}: VendorBeautyServiceFormProps) {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [formData, setFormData] = useState<FormData>({
    thumbnailImage: initialData?.thumbnailImage || null,
    serviceTitle: initialData?.title || "",
    shortDescription: initialData?.description || "",
    imageGallery: initialData?.imageGallery || [],
    longDescription: initialData?.fullDescription || "",
    price: initialData?.price?.toString() || "",
    duration: initialData?.duration?.toString() || "",
    whatsIncluded: [
      {
        id: "1",
        text: "Professional beauty products",
        checked:
          initialData?.whatsIncluded?.includes("Professional beauty products") ||
          false,
      },
      {
        id: "2",
        text: "Certified beauty specialist",
        checked:
          initialData?.whatsIncluded?.includes("Certified beauty specialist") ||
          false,
      },
      {
        id: "3",
        text: "Clean & hygienic setup",
        checked:
          initialData?.whatsIncluded?.includes("Clean & hygienic setup") ||
          false,
      },
    ],
    customIncludedItems: [],
  });

  const [newCustomItem, setNewCustomItem] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      whatsIncluded: prev.whatsIncluded.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const handleAddCustomItem = () => {
    if (newCustomItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        customIncludedItems: [...prev.customIncludedItems, newCustomItem.trim()],
      }));
      setNewCustomItem("");
    }
  };

  const handleRemoveCustomItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customIncludedItems: prev.customIncludedItems.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleImageUpload = () => {
    alert("Image upload functionality - to be implemented");
  };

  const handleGalleryImageAdd = () => {
    if (formData.imageGallery.length < 5) {
      alert("Gallery image upload functionality - to be implemented");
    } else {
      alert("Maximum 5 images allowed");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (isDraft: boolean) => {
    setIsSaving(true);

    const allIncludedItems = [
      ...formData.whatsIncluded
        .filter((item) => item.checked)
        .map((item) => item.text),
      ...formData.customIncludedItems,
    ];

    const listingData = {
      id: isEditing ? initialData?.id : Date.now().toString(),
      title: formData.serviceTitle,
      description: formData.shortDescription,
      fullDescription: formData.longDescription,
      price: parseFloat(formData.price) || 0,
      duration: parseInt(formData.duration) || 0,
      bookings: initialData?.bookings || 0,
      bookingTrend: initialData?.bookingTrend || 0,
      status: isDraft ? "inactive" : "active",
      rating: initialData?.rating || 0,
      reviews: initialData?.reviews || 0,
      regions: initialData?.regions || 2,
      whatsIncluded: allIncludedItems,
      serviceRegions: initialData?.serviceRegions || [
        "New York, NY",
        "Brooklyn, NY",
      ],
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
            ? "Update your beauty service listing details"
            : "Add a new beauty service to your store"}
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-bold text-[#1F2937] mb-6">
          Basic Information
        </h2>

        <div className="space-y-6">
          {/* Thumbnail Image */}
          <div>
            <Label className="mb-1.5">
              Thumbnail Image <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-3">JPG or PNG, max 5MB</p>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#9CA3AF] transition-colors">
              <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
              <Button
                type="button"
                variant="outline"
                onClick={handleImageUpload}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Thumbnail
              </Button>
              <p className="text-xs text-[#6B7280] mt-2">
                {formData.thumbnailImage
                  ? "Image uploaded"
                  : "No image selected"}
              </p>
            </div>
          </div>

          {/* Service Title */}
          <div>
            <Label htmlFor="serviceTitle" className="mb-1.5">
              Service Title <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-2">
              Maximum 60 characters
            </p>
            <Input
              id="serviceTitle"
              type="text"
              value={formData.serviceTitle}
              onChange={(e) =>
                handleInputChange("serviceTitle", e.target.value.slice(0, 60))
              }
              placeholder="e.g., Signature Facial Treatment"
              maxLength={60}
            />
            <p className="text-xs text-[#9CA3AF] mt-1 text-right">
              {formData.serviceTitle.length}/60
            </p>
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="shortDescription" className="mb-1.5">
              Short Description <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-2">
              Maximum 150 characters
            </p>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                handleInputChange(
                  "shortDescription",
                  e.target.value.slice(0, 150)
                )
              }
              placeholder="Brief description of your service"
              rows={3}
              maxLength={150}
            />
            <p className="text-xs text-[#9CA3AF] mt-1 text-right">
              {formData.shortDescription.length}/150
            </p>
          </div>

          {/* Image Gallery */}
          <div>
            <Label className="mb-1.5">Image Gallery</Label>
            <p className="text-xs text-[#6B7280] mb-3">
              Up to 5 images (JPG/PNG, max 5MB each, drag to reorder)
            </p>
            <div className="space-y-3">
              {formData.imageGallery.map((image, index) => (
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
              {formData.imageGallery.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGalleryImageAdd}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image ({formData.imageGallery.length}/5)
                </Button>
              )}
            </div>
          </div>

          {/* Long Description */}
          <div>
            <Label htmlFor="longDescription" className="mb-1.5">
              Long Description <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-2">
              Maximum 500 characters
            </p>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) =>
                handleInputChange(
                  "longDescription",
                  e.target.value.slice(0, 500)
                )
              }
              placeholder="Detailed description of your service"
              rows={6}
              maxLength={500}
            />
            <p className="text-xs text-[#9CA3AF] mt-1 text-right">
              {formData.longDescription.length}/500
            </p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-bold text-[#1F2937] mb-6">Pricing</h2>

        <div className="space-y-6">
          {/* Pricing Type - Read Only */}
          <div>
            <Label className="mb-1.5">Pricing Type</Label>
            <div className="flex items-center gap-2 px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
              <span className="text-sm font-medium text-[#1F2937]">
                Hourly Rate
              </span>
              <span className="text-xs text-[#6B7280]">
                (Locked for Beauty Services)
              </span>
            </div>
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" className="mb-1.5">
              Price <span className="text-[#DC2626]">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                $
              </span>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                className="pl-7"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="mb-1.5">
              Duration <span className="text-[#DC2626]">*</span>
            </Label>
            <div className="relative">
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="60"
                className="pr-20"
                min="0"
                step="15"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-bold text-[#1F2937] mb-6">
          What's Included
        </h2>

        <div className="space-y-4">
          {formData.whatsIncluded.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                id={`included-${item.id}`}
                checked={item.checked}
                onChange={() => handleCheckboxChange(item.id)}
                className="mt-1 w-4 h-4 rounded border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
              />
              <Label
                htmlFor={`included-${item.id}`}
                className="font-normal cursor-pointer"
              >
                {item.text}
              </Label>
            </div>
          ))}

          {formData.customIncludedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg"
            >
              <span className="flex-1 text-sm text-[#1F2937]">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCustomItem(index)}
              >
                <X className="w-4 h-4 text-[#DC2626]" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <Input
              type="text"
              value={newCustomItem}
              onChange={(e) => setNewCustomItem(e.target.value)}
              placeholder="Add custom item"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomItem();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCustomItem}
            >
              <Plus className="w-4 h-4" />
            </Button>
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
