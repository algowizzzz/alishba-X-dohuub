import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Save, Send } from "lucide-react";
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
  productThumbnail: string | null;
  shopName: string;
  productCategory: string;
  itemName: string;
  shortDescription: string;
  quantityAmount: string;
  quantityUnit: string;
  price: string;
}

interface VendorBeautyProductFormProps {
  onSave: (data: any, isDraft: boolean) => void;
  initialData?: any;
  isEditing?: boolean;
  storeName?: string;
}

export function VendorBeautyProductForm({
  onSave,
  initialData,
  isEditing = false,
  storeName = "Beauty Products Store",
}: VendorBeautyProductFormProps) {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [formData, setFormData] = useState<FormData>({
    productThumbnail: initialData?.productThumbnail || null,
    shopName: storeName,
    productCategory: initialData?.category || "",
    itemName: initialData?.title || "",
    shortDescription: initialData?.description || "",
    quantityAmount: initialData?.quantityAmount?.toString() || "",
    quantityUnit: initialData?.quantityUnit || "ml",
    price: initialData?.price?.toString() || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    "Skincare",
    "Haircare",
    "Makeup",
    "Fragrance",
    "Body Care",
    "Tools & Accessories",
    "Personal Care",
    "Gift Sets",
    "Wellness",
    "Miscellaneous",
  ];

  const units = ["ml", "oz", "g", "kg", "lb", "Count/Pieces", "Set"];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = () => {
    alert("Image upload functionality - to be implemented");
  };

  const handleSave = async (isDraft: boolean) => {
    setIsSaving(true);

    const listingData = {
      id: isEditing ? initialData?.id : Date.now().toString(),
      title: formData.itemName,
      description: formData.shortDescription,
      category: formData.productCategory,
      price: parseFloat(formData.price) || 0,
      quantityAmount: parseFloat(formData.quantityAmount) || 0,
      quantityUnit: formData.quantityUnit,
      bookings: initialData?.bookings || 0,
      bookingTrend: initialData?.bookingTrend || 0,
      status: isDraft ? "inactive" : "active",
      rating: initialData?.rating || 0,
      reviews: initialData?.reviews || 0,
      regions: initialData?.regions || 2,
      serviceRegions: initialData?.serviceRegions || ["New York, NY", "Brooklyn, NY"],
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
          {isEditing ? "Edit Product" : "Create New Product"}
        </h1>
        <p className="text-sm sm:text-[15px] text-[#6B7280]">
          {isEditing
            ? "Update your beauty product listing details"
            : "Add a new beauty product to your store"}
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-bold text-[#1F2937] mb-6">
          Product Information
        </h2>

        <div className="space-y-6">
          {/* Product Thumbnail */}
          <div>
            <Label className="mb-1.5">
              Product Thumbnail <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-3">JPG or PNG, max 5MB</p>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#9CA3AF] transition-colors">
              <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
              <Button type="button" variant="outline" onClick={handleImageUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Thumbnail
              </Button>
              <p className="text-xs text-[#6B7280] mt-2">
                {formData.productThumbnail ? "Image uploaded" : "No image selected"}
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

          {/* Product Category */}
          <div>
            <Label htmlFor="productCategory" className="mb-1.5">
              Product Category <span className="text-[#DC2626]">*</span>
            </Label>
            <Select
              value={formData.productCategory}
              onValueChange={(value) => handleInputChange("productCategory", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Item Name */}
          <div>
            <Label htmlFor="itemName" className="mb-1.5">
              Item Name <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-2">Maximum 60 characters</p>
            <Input
              id="itemName"
              type="text"
              value={formData.itemName}
              onChange={(e) =>
                handleInputChange("itemName", e.target.value.slice(0, 60))
              }
              placeholder="e.g., Hydrating Face Serum"
              maxLength={60}
            />
            <p className="text-xs text-[#9CA3AF] mt-1 text-right">
              {formData.itemName.length}/60
            </p>
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
              placeholder="Brief description of your product"
              rows={3}
              maxLength={150}
            />
            <p className="text-xs text-[#9CA3AF] mt-1 text-right">
              {formData.shortDescription.length}/150
            </p>
          </div>

          {/* Quantity */}
          <div>
            <Label className="mb-1.5">
              Quantity <span className="text-[#DC2626]">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantityAmount" className="mb-1.5 text-xs text-[#6B7280]">
                  Amount
                </Label>
                <Input
                  id="quantityAmount"
                  type="number"
                  value={formData.quantityAmount}
                  onChange={(e) => handleInputChange("quantityAmount", e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="quantityUnit" className="mb-1.5 text-xs text-[#6B7280]">
                  Unit
                </Label>
                <Select
                  value={formData.quantityUnit}
                  onValueChange={(value) => handleInputChange("quantityUnit", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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