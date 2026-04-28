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
  restaurantName: string;
  cuisines: string[];
  category: string;
  itemName: string;
  shortDescription: string;
  portionSize: string;
  quantityAmount: string;
  quantityUnit: string;
  price: string;
}

interface VendorFoodFormProps {
  onSave: (data: any, isDraft: boolean) => void;
  initialData?: any;
  isEditing?: boolean;
  storeName?: string;
}

export function VendorFoodForm({
  onSave,
  initialData,
  isEditing = false,
  storeName = "Restaurant/Kitchen",
}: VendorFoodFormProps) {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [formData, setFormData] = useState<FormData>({
    productThumbnail: initialData?.productThumbnail || null,
    restaurantName: storeName,
    cuisines: initialData?.cuisines || [],
    category: initialData?.category || "",
    itemName: initialData?.title || "",
    shortDescription: initialData?.description || "",
    portionSize: initialData?.portionSize || "",
    quantityAmount: initialData?.quantityAmount?.toString() || "",
    quantityUnit: initialData?.quantityUnit || "lb",
    price: initialData?.price?.toString() || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const cuisines = [
    "American", "Italian", "Mexican", "Chinese", "Indian", "Pakistani", "Middle Eastern",
    "Mediterranean", "Japanese", "Korean", "Thai", "Vietnamese", "French", "Spanish",
    "Greek", "Turkish", "Lebanese", "Moroccan", "Ethiopian", "Caribbean", "Brazilian",
    "Peruvian", "Argentinian", "German", "British", "Irish", "Russian", "Polish",
    "Filipino", "Indonesian", "Malaysian", "Singaporean", "Nepalese", "Bangladeshi",
    "Sri Lankan", "African", "Cajun", "Creole", "Fusion", "Vegan", "Vegetarian",
    "Gluten-Free", "Organic", "Farm-to-Table"
  ];

  const categories = [
    "Appetizers", "Main Courses", "Desserts", "Beverages", "Snacks", "Salads", "Soups",
    "Pasta", "Grilled", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb",
    "High-Protein", "Healthy", "Comfort Food", "International", "Specialty", "Miscellaneous"
  ];

  const portionSizes = ["Small", "Regular", "Large"];

  const units = ["lb", "kg", "g", "oz", "Count/Pieces", "Bunch", "Pack", "Bag", "Box", "Bottle", "Can", "Jar", "L", "ml"];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCuisineToggle = (cuisine: string) => {
    setFormData((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
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
      cuisines: formData.cuisines,
      category: formData.category,
      portionSize: formData.portionSize,
      price: parseFloat(formData.price) || 0,
      quantityAmount: formData.quantityAmount ? parseFloat(formData.quantityAmount) : null,
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
          {isEditing ? "Edit Food Item" : "Create New Food Item"}
        </h1>
        <p className="text-sm sm:text-[15px] text-[#6B7280]">
          {isEditing
            ? "Update your food item listing details"
            : "Add a new food item to your store"}
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

          {/* Restaurant/Kitchen Name - Read Only */}
          <div>
            <Label className="mb-1.5">Restaurant/Kitchen Name</Label>
            <div className="px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
              <span className="text-sm text-[#6B7280]">{formData.restaurantName}</span>
            </div>
          </div>

          {/* Cuisines */}
          <div>
            <Label className="mb-1.5">
              Cuisines <span className="text-[#DC2626]">*</span>
            </Label>
            <p className="text-xs text-[#6B7280] mb-3">
              Select all that apply ({formData.cuisines.length} selected)
            </p>
            <div className="border border-[#E5E7EB] rounded-lg p-4 max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cuisines.map((cuisine) => (
                  <div key={cuisine} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id={`cuisine-${cuisine}`}
                      checked={formData.cuisines.includes(cuisine)}
                      onChange={() => handleCuisineToggle(cuisine)}
                      className="mt-0.5 w-4 h-4 rounded border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
                    />
                    <Label
                      htmlFor={`cuisine-${cuisine}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {cuisine}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="mb-1.5">
              Category <span className="text-[#DC2626]">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
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
              placeholder="e.g., Chicken Tikka Masala"
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
              placeholder="Brief description of your food item"
              rows={3}
              maxLength={150}
            />
            <p className="text-xs text-[#9CA3AF] mt-1 text-right">
              {formData.shortDescription.length}/150
            </p>
          </div>

          {/* Portion Size */}
          <div>
            <Label htmlFor="portionSize" className="mb-1.5">
              Portion Size
            </Label>
            <p className="text-xs text-[#6B7280] mb-2">Optional</p>
            <Select
              value={formData.portionSize}
              onValueChange={(value) => handleInputChange("portionSize", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select portion size" />
              </SelectTrigger>
              <SelectContent>
                {portionSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <Label className="mb-1.5">Quantity</Label>
            <p className="text-xs text-[#6B7280] mb-2">Optional</p>
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