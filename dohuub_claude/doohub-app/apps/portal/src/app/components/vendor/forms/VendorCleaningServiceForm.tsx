import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, Save, Plus, Trash2 } from "lucide-react";
import { VendorSidebar } from "../VendorSidebar";
import { VendorTopNav } from "../VendorTopNav";
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

interface IncludedItem {
  id: string;
  text: string;
}

const DEFAULT_INCLUDED_ITEMS = [
  "Professional cleaning equipment & supplies",
  "Eco-friendly cleaning products",
  "Trained cleaning professionals",
  "Quality guarantee",
  "Clean-up and disposal",
];

export function VendorCleaningServiceForm() {
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

  const [formData, setFormData] = useState({
    title: isEditing ? "Deep Home Cleaning" : "",
    serviceType: isEditing ? "Residential Cleaning" : "",
    description: isEditing
      ? "Thorough cleaning of your entire home including all rooms and surfaces."
      : "",
    priceType: isEditing ? "fixed" : "fixed",
    price: isEditing ? "150" : "",
    duration: isEditing ? "4" : "",
    areaSize: isEditing ? "1500" : "",
    frequency: isEditing ? "one-time" : "one-time",
    status: isEditing ? "active" : "active",
  });

  const [includedItems, setIncludedItems] = useState<IncludedItem[]>(
    isEditing
      ? DEFAULT_INCLUDED_ITEMS.map((text, index) => ({
          id: index.toString(),
          text,
        }))
      : []
  );

  const [newIncludedItem, setNewIncludedItem] = useState("");

  const serviceTypes = [
    "Residential Cleaning",
    "Commercial Cleaning",
    "Deep Cleaning",
    "Move-In/Move-Out Cleaning",
    "Post-Construction Cleaning",
    "Carpet & Upholstery Cleaning",
    "Window Cleaning",
    "Specialty Cleaning",
  ];

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
    setTimeout(() => {
      setIsSaving(false);
      navigate(`/vendor/services/${storeId}/listings`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
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
        <div className="max-w-[900px] mx-auto">
          <button
            onClick={() => navigate(`/vendor/services/${storeId}/listings`)}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1A1A2E] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Listings</span>
          </button>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              {isEditing ? "Edit Cleaning Service" : "Create Cleaning Service"}
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              {isEditing
                ? "Update your cleaning service details"
                : "Add a new cleaning service to your store"}
            </p>
          </div>

          {/* Basic Information */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">
              Service Details
            </h2>

            <div className="space-y-6">
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

              <div>
                <Label htmlFor="serviceType" className="mb-1.5">
                  Service Type <span className="text-[#DC2626]">*</span>
                </Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) =>
                    handleInputChange("serviceType", value)
                  }
                  required
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                  placeholder="Describe your cleaning service in detail..."
                  rows={5}
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing & Details */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">
              Pricing & Service Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <SelectItem value="sqft">Per Square Foot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <div>
                <Label htmlFor="areaSize" className="mb-1.5">
                  Typical Area Size (sq ft)
                </Label>
                <Input
                  id="areaSize"
                  type="number"
                  value={formData.areaSize}
                  onChange={(e) => handleInputChange("areaSize", e.target.value)}
                  placeholder="e.g., 1500"
                />
              </div>

              <div>
                <Label htmlFor="frequency" className="mb-1.5">
                  Service Frequency
                </Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => handleInputChange("frequency", value)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-Time Service</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">
              What's Included
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Add items that are included with this cleaning service
            </p>

            <div className="space-y-3 mb-4">
              {includedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-[#F8FAFF] rounded-xl"
                >
                  <span className="text-sm text-[#1A1A2E]">{item.text}</span>
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

            <div className="flex gap-2">
              <Input
                type="text"
                value={newIncludedItem}
                onChange={(e) => setNewIncludedItem(e.target.value)}
                placeholder="e.g., Professional cleaning equipment & supplies"
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
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">
              Service Images
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Upload images to showcase your cleaning service
            </p>

            <div className="border-2 border-dashed border-[rgba(46,122,217,0.25)] rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-sm font-semibold text-[#1A1A2E] mb-1">
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
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
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
