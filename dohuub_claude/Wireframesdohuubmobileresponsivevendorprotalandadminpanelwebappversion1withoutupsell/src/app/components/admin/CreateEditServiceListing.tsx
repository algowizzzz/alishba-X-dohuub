import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Check,
  ChevronDown,
  MapPin,
} from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface ServiceImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface RegionPrice {
  id: string;
  name: string;
  isEnabled: boolean;
  price: number;
}

const SERVICE_TYPES_BY_CATEGORY: Record<string, string[]> = {
  "Cleaning Services": [
    "Deep Cleaning",
    "Regular Cleaning (Weekly/Bi-weekly)",
    "Move-Out Cleaning",
    "Office Cleaning",
    "Post-Construction Cleaning",
    "Carpet Cleaning",
    "Window Cleaning",
    "Custom Service",
  ],
  "Handyman Services": [
    "Plumbing Repair",
    "Electrical Work",
    "Carpentry",
    "Painting",
    "Appliance Installation",
    "Furniture Assembly",
    "Drywall Repair",
    "Custom Service",
  ],
  "Beauty on DE Run": [
    "Haircut & Styling",
    "Hair Coloring",
    "Makeup Application",
    "Manicure/Pedicure",
    "Facial Treatment",
    "Massage Therapy",
    "Waxing Services",
    "Custom Service",
  ],
  "Caregiving Services": [
    "Senior Companionship",
    "Child Care",
    "Medical Appointment Transport",
    "Medication Reminders",
    "Personal Care Assistance",
    "Respite Care",
    "Custom Service",
  ],
  "Grocery": [
    "Grocery Delivery",
    "Meal Preparation",
  ],
  "Rental Properties": [
    "Short-term Rental (Daily)",
    "Medium-term Rental (Weekly/Monthly)",
    "Long-term Rental (6+ months)",
    "Vacation Rental",
    "Custom Listing",
  ],
};

export function CreateEditServiceListing() {
  const navigate = useNavigate();
  const { profileId, listingId } = useParams();
  const isEditing = !!listingId;

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock profile data
  const profileName = "Sparkle Clean by Michelle";
  const profileCategory = "Cleaning Services";

  // Form state
  const [serviceName, setServiceName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [basePrice, setBasePrice] = useState("");
  const [duration, setDuration] = useState("");
  const [priceType, setPriceType] = useState("fixed");
  const [regions, setRegions] = useState<RegionPrice[]>([
    { id: "1", name: "New York, NY", isEnabled: true, price: 120 },
    { id: "2", name: "Los Angeles, CA", isEnabled: true, price: 135 },
    { id: "3", name: "Chicago, IL", isEnabled: true, price: 120 },
    { id: "4", name: "Houston, TX", isEnabled: false, price: 120 },
  ]);
  const [bookingSettingsExpanded, setBookingSettingsExpanded] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && images.length < 5) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: ServiceImage = {
          id: Date.now().toString(),
          url: reader.result as string,
          isPrimary: images.length === 0,
        };
        setImages([...images, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSave = (activate: boolean) => {
    // Save logic here
    navigate(`/admin/michelle-profiles/${profileId}/listings`);
  };

  const serviceTypes = SERVICE_TYPES_BY_CATEGORY[profileCategory] || [];

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav />

      <div className="flex">
        <AdminSidebarRetractable
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          activeMenu="michelle"
        />

        {/* Main Content */}
        <main className="ml-[280px] mt-[72px] p-8 flex-1">
          <div className="max-w-[900px] mx-auto">
            {/* Back Navigation */}
            <Link
              to={`/admin/michelle-profiles/${profileId}/listings`}
              className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Listings
            </Link>

            {/* Page Header */}
            <h1 className="text-[32px] font-bold text-[#1F2937] mb-2">
              {isEditing ? "Edit Service Listing" : "Create Service Listing"}
            </h1>

            {/* Profile Context */}
            <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-5 py-4 mb-8 flex items-center gap-6">
              <div>
                <span className="text-sm text-[#6B7280]">Profile: </span>
                <span className="text-sm font-bold text-[#1F2937]">{profileName}</span>
              </div>
              <div className="h-4 w-px bg-[#E5E7EB]" />
              <div>
                <span className="text-sm text-[#6B7280]">Category: </span>
                <span className="text-sm font-bold text-[#1F2937]">🧹 {profileCategory}</span>
              </div>
            </div>

            {/* Section 1: Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1F2937] mb-4">Basic Information</h2>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 space-y-6">
                <div>
                  <Label htmlFor="serviceName" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                    Service Name <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="serviceName"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g., Deep Cleaning Service"
                    className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px]"
                    maxLength={100}
                  />
                  <p className="text-[13px] text-[#6B7280] mt-2">
                    Clear, descriptive name customers will see
                  </p>
                </div>

                <div>
                  <Label htmlFor="serviceType" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                    Service Type <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px]">
                      <SelectValue placeholder="Select service type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                    Description <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what's included in this service, what makes it special, and any important details customers should know..."
                    className="min-h-[180px] text-base border-2 border-[#E5E7EB] rounded-[10px] resize-none"
                    maxLength={1000}
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-[13px] text-[#6B7280]">
                      Be detailed and specific about what customers can expect
                    </p>
                    <p className="text-[13px] text-[#9CA3AF]">
                      {description.length} / 1000 characters
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                    Service Images
                  </Label>
                  <p className="text-[13px] text-[#6B7280] mb-3">
                    Up to 5 images • Recommended: 1200x800px • Max 5MB each • JPG or PNG
                  </p>
                  
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative flex-shrink-0 group">
                        <img
                          src={image.url}
                          alt={`Service ${index + 1}`}
                          className="w-[160px] h-[120px] rounded-[10px] object-cover"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-[#DC2626] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        {image.isPrimary && (
                          <div className="absolute top-2 left-2 bg-[#1F2937] text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}

                    {images.length < 5 && (
                      <label className="w-[160px] h-[120px] border-2 border-dashed border-[#E5E7EB] rounded-[10px] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] transition-colors flex-shrink-0">
                        <Upload className="w-8 h-8 text-[#9CA3AF] mb-1" />
                        <span className="text-sm text-[#6B7280]">
                          {images.length === 0 ? "Upload" : "+ Add Image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Duration */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1F2937] mb-4">Pricing & Duration</h2>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="basePrice" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                      Base Price <span className="text-[#DC2626]">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#6B7280]">$</span>
                      <Input
                        id="basePrice"
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="120"
                        className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px] pl-8"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <p className="text-[13px] text-[#6B7280] mt-2">Starting price in USD</p>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                      Duration <span className="text-[#DC2626]">*</span>
                    </Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px]">
                        <SelectValue placeholder="Select duration..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="1hr">1 hour</SelectItem>
                        <SelectItem value="1-2hr">1-2 hours</SelectItem>
                        <SelectItem value="2-3hr">2-3 hours</SelectItem>
                        <SelectItem value="3-4hr">3-4 hours</SelectItem>
                        <SelectItem value="4-6hr">4-6 hours</SelectItem>
                        <SelectItem value="fullday">Full day (8+ hours)</SelectItem>
                        <SelectItem value="multiday">Multiple days</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-[15px] font-semibold text-[#1F2937] mb-3 block">
                    Price Type
                  </Label>
                  <RadioGroup value={priceType} onValueChange={setPriceType}>
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${priceType === 'fixed' ? 'border-[#1F2937] bg-[#F8F9FA]' : 'border-[#E5E7EB] hover:border-[#1F2937]'}`}>
                        <RadioGroupItem value="fixed" id="fixed" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="fixed" className="text-base font-bold text-[#1F2937] cursor-pointer block mb-1">
                            Fixed Price
                          </Label>
                          <p className="text-[13px] text-[#6B7280]">One-time service fee</p>
                        </div>
                      </div>

                      <div className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${priceType === 'hourly' ? 'border-[#1F2937] bg-[#F8F9FA]' : 'border-[#E5E7EB] hover:border-[#1F2937]'}`}>
                        <RadioGroupItem value="hourly" id="hourly" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="hourly" className="text-base font-bold text-[#1F2937] cursor-pointer block mb-1">
                            Hourly Rate
                          </Label>
                          <p className="text-[13px] text-[#6B7280]">Price per hour of service</p>
                        </div>
                      </div>

                      <div className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${priceType === 'custom' ? 'border-[#1F2937] bg-[#F8F9FA]' : 'border-[#E5E7EB] hover:border-[#1F2937]'}`}>
                        <RadioGroupItem value="custom" id="custom" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="custom" className="text-base font-bold text-[#1F2937] cursor-pointer block mb-1">
                            Custom Quote
                          </Label>
                          <p className="text-[13px] text-[#6B7280]">Provide estimate after consultation</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Section 3: Regional Availability */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1F2937] mb-4">Regional Availability</h2>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-8">
                <p className="text-sm text-[#6B7280] mb-5">
                  Select which regions this service is available in. You can adjust pricing for specific regions.
                </p>

                <div className="flex justify-end gap-3 mb-4 text-sm">
                  <button
                    onClick={() => setRegions(regions.map(r => ({ ...r, isEnabled: true })))}
                    className="text-[#3B82F6] hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-[#E5E7EB]">|</span>
                  <button
                    onClick={() => setRegions(regions.map(r => ({ ...r, isEnabled: false })))}
                    className="text-[#3B82F6] hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-0">
                  {regions.map((region, index) => (
                    <div
                      key={region.id}
                      className={`grid grid-cols-3 gap-6 items-center py-4 ${
                        index < regions.length - 1 ? 'border-b border-[#F3F4F6]' : ''
                      }`}
                    >
                      {/* Column 1: Checkbox + Name */}
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`region-${region.id}`}
                          checked={region.isEnabled}
                          onCheckedChange={(checked) => {
                            setRegions(regions.map(r =>
                              r.id === region.id ? { ...r, isEnabled: checked as boolean } : r
                            ));
                          }}
                          className="w-5 h-5"
                        />
                        <Label htmlFor={`region-${region.id}`} className="text-base text-[#1F2937] cursor-pointer flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#6B7280]" />
                          {region.name}
                        </Label>
                      </div>

                      {/* Column 2: Price */}
                      <div>
                        {region.isEnabled && (
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] text-[#6B7280]">Base:</span>
                            <div className="relative w-[120px]">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B7280]">$</span>
                              <Input
                                type="number"
                                value={region.price}
                                onChange={(e) => {
                                  const newPrice = parseFloat(e.target.value) || 0;
                                  setRegions(regions.map(r =>
                                    r.id === region.id ? { ...r, price: newPrice } : r
                                  ));
                                }}
                                className="h-10 text-sm border border-[#E5E7EB] rounded-lg pl-7"
                                step="0.01"
                                min="0"
                              />
                            </div>
                            {basePrice && region.price !== parseFloat(basePrice) && (
                              <span className="text-xs text-[#10B981]">(adjusted)</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Column 3: Status */}
                      <div className="text-right">
                        {region.isEnabled ? (
                          <span className="inline-flex items-center gap-1.5 text-sm text-[#10B981]">
                            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                            Available
                          </span>
                        ) : (
                          <span className="text-sm text-[#9CA3AF]">Not available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Booking Settings (Collapsible) */}
            <div className="mb-8">
              <button
                onClick={() => setBookingSettingsExpanded(!bookingSettingsExpanded)}
                className="flex items-center justify-between w-full mb-4"
              >
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937] text-left">Booking Settings</h2>
                  <p className="text-sm text-[#6B7280] text-left">Optional - Configure booking rules and requirements</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#6B7280] transition-transform ${
                    bookingSettingsExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {bookingSettingsExpanded && (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                        Minimum Advance Notice
                      </Label>
                      <Select>
                        <SelectTrigger className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px]">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same">Same day</SelectItem>
                          <SelectItem value="4hr">4 hours</SelectItem>
                          <SelectItem value="8hr">8 hours</SelectItem>
                          <SelectItem value="12hr">12 hours</SelectItem>
                          <SelectItem value="24hr">24 hours</SelectItem>
                          <SelectItem value="48hr">48 hours</SelectItem>
                          <SelectItem value="3days">3 days</SelectItem>
                          <SelectItem value="1week">1 week</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[13px] text-[#6B7280] mt-2">
                        How far in advance customers must book
                      </p>
                    </div>

                    <div>
                      <Label className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                        Cancellation Policy
                      </Label>
                      <Select>
                        <SelectTrigger className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px]">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flexible">Flexible (24 hours)</SelectItem>
                          <SelectItem value="moderate">Moderate (48 hours)</SelectItem>
                          <SelectItem value="strict">Strict (7 days)</SelectItem>
                          <SelectItem value="nonrefund">Non-refundable</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                      Special Requirements or Notes
                    </Label>
                    <Textarea
                      placeholder="e.g., Customer must provide parking, access to water..."
                      className="min-h-[120px] text-base border-2 border-[#E5E7EB] rounded-[10px] resize-none"
                      maxLength={500}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-[#E5E7EB] mb-8">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/michelle-profiles/${profileId}/listings`)}
                className="h-11 px-6"
              >
                Cancel
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  className="h-11 px-8"
                >
                  Save Listing
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  className="h-11 px-8 bg-[#1F2937] hover:bg-[#111827] text-white font-semibold"
                >
                  <Check className="w-[18px] h-[18px] mr-2" />
                  Save & Activate
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}