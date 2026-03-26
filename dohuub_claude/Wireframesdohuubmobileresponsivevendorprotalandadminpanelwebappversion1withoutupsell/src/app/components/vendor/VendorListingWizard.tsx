import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface IncludedItem {
  id: string;
  text: string;
}

export function VendorListingWizard() {
  const navigate = useNavigate();
  const { storeId, listingId } = useParams();
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

  const [isSaving, setIsSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: isEditing ? "Deep Home Cleaning" : "",
    category: isEditing ? "Residential Cleaning" : "",
    description: isEditing
      ? "Thorough cleaning of your entire home including kitchen, bathrooms, bedrooms, and living areas."
      : "",
    priceType: isEditing ? "fixed" : "fixed",
    price: isEditing ? "150" : "",
    duration: isEditing ? "4" : "",
    status: isEditing ? "active" : "active",
  });

  const [includedItems, setIncludedItems] = useState<IncludedItem[]>(
    isEditing
      ? [
          { id: "1", text: "Professional cleaning equipment & supplies" },
          { id: "2", text: "Eco-friendly cleaning products" },
          { id: "3", text: "Quality guarantee" },
        ]
      : []
  );

  const [newIncludedItem, setNewIncludedItem] = useState("");

  // Categories based on store type
  const categories = {
    "Cleaning Services": [
      "Residential Cleaning",
      "Commercial Cleaning",
      "Specialty Cleaning",
      "Deep Cleaning",
      "Move-In/Move-Out Cleaning",
    ],
    "Handyman Services": [
      "Plumbing",
      "Electrical",
      "Carpentry",
      "Painting",
      "General Repairs",
    ],
    "Beauty Services": [
      "Hair Styling",
      "Nail Care",
      "Makeup",
      "Skincare",
      "Spa Services",
    ],
    "Groceries": [
      "Fresh Produce",
      "Dairy & Eggs",
      "Meat & Seafood",
      "Bakery",
      "Pantry Staples",
    ],
    "Food": [
      "Restaurant Meals",
      "Catering",
      "Meal Prep",
      "Baked Goods",
      "Specialty Foods",
    ],
    "Beauty Products": [
      "Skincare Products",
      "Makeup Products",
      "Hair Care Products",
      "Fragrances",
      "Beauty Tools",
    ],
    "Rental Properties": [
      "Apartments",
      "Houses",
      "Condos",
      "Vacation Rentals",
      "Commercial Spaces",
    ],
    "Ride Assistance": [
      "Local Rides",
      "Airport Transportation",
      "Medical Appointments",
      "Grocery Assistance",
      "Event Transportation",
    ],
    "Companionship Support": [
      "Social Visits",
      "Activity Companion",
      "Errands Assistance",
      "Meal Companionship",
      "General Support",
    ],
  };

  const storeCategory = "Cleaning Services"; // This should come from store data

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddIncludedItem = () => {
    if (newIncludedItem.trim()) {
      setIncludedItems([
        ...includedItems,
        {
          id: Date.now().toString(),
          text: newIncludedItem.trim(),
        },
      ]);
      setNewIncludedItem("");
    }
  };

  const handleRemoveIncludedItem = (id: string) => {
    setIncludedItems(includedItems.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      navigate(`/vendor/services/${storeId}/listings`);
    }, 1000);
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

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[900px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/vendor/services/${storeId}/listings`)}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F2937] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Listings</span>
          </button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              {isEditing ? "Edit Listing" : "Create New Listing"}
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              {isEditing
                ? "Update your service listing details"
                : "Add a new service to your store"}
            </p>
          </div>

          {/* Basic Information */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Service Title */}
              <div>
                <Label htmlFor="title" className="mb-1.5">
                  Service Title <span className="text-[#DC2626]">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Deep Home Cleaning"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="mb-1.5">
                  Category <span className="text-[#DC2626]">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[storeCategory as keyof typeof categories]?.map(
                      (cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="mb-1.5">
                  Description <span className="text-[#DC2626]">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your service in detail..."
                  rows={5}
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-6">
              Pricing & Duration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Type */}
              <div>
                <Label htmlFor="priceType" className="mb-1.5">
                  Price Type <span className="text-[#DC2626]">*</span>
                </Label>
                <Select
                  value={formData.priceType}
                  onValueChange={(value) => handleInputChange("priceType", value)}
                  required
                >
                  <SelectTrigger id="priceType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                    <SelectItem value="daily">Daily Rate</SelectItem>
                  </SelectContent>
                </Select>
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
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration" className="mb-1.5">
                  Estimated Duration (hours)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  placeholder="e.g., 4"
                />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status" className="mb-1.5">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">
              What's Included
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Add items that are included with this service
            </p>

            {/* Included Items List */}
            <div className="space-y-3 mb-4">
              {includedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-xl"
                >
                  <span className="text-sm text-[#1F2937]">{item.text}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveIncludedItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-[#DC2626]" />
                  </Button>
                </div>
              ))}

              {includedItems.length === 0 && (
                <div className="text-center py-8 text-sm text-[#6B7280]">
                  No items added yet. Add your first included item below.
                </div>
              )}
            </div>

            {/* Add New Item */}
            <div className="flex gap-2">
              <Input
                type="text"
                value={newIncludedItem}
                onChange={(e) => setNewIncludedItem(e.target.value)}
                placeholder="e.g., Professional equipment & supplies"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIncludedItem();
                  }
                }}
              />
              <Button onClick={handleAddIncludedItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">
              Service Images
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Upload images to showcase your service
            </p>

            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-sm font-semibold text-[#1F2937] mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-[#6B7280]">
                PNG, JPG or WEBP (max. 5MB each)
              </p>
              <Button variant="outline" className="mt-4">
                Choose Files
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {isSaving
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Listing"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/vendor/services/${storeId}/listings`)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
