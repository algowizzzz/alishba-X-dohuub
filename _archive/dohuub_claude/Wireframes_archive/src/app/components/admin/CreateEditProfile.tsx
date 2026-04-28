import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Check,
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
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import { CountryRegionModal } from "./CountryRegionModal";

interface RegionWithCountry {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  isActive: boolean;
}

export function CreateEditProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [regions, setRegions] = useState<RegionWithCountry[]>([
    { id: "1", name: "New York, NY", countryCode: "US", countryName: "United States", countryFlag: "🇺🇸", isActive: true },
    { id: "2", name: "Los Angeles, CA", countryCode: "US", countryName: "United States", countryFlag: "🇺🇸", isActive: true },
    { id: "3", name: "Chicago, IL", countryCode: "US", countryName: "United States", countryFlag: "🇺🇸", isActive: false },
  ]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showBadge, setShowBadge] = useState(true);
  const [activateNow, setActivateNow] = useState("active");
  const [showRegionModal, setShowRegionModal] = useState(false);

  const progress = (currentStep / 4) * 100;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRegions = (newRegions: { countryCode: string; countryName: string; countryFlag: string; regionId: string; regionName: string }[]) => {
    const regionsToAdd = newRegions.map(r => ({
      id: r.regionId,
      name: r.regionName,
      countryCode: r.countryCode,
      countryName: r.countryName,
      countryFlag: r.countryFlag,
      isActive: true,
    }));
    setRegions([...regions, ...regionsToAdd]);
  };

  const handleRemoveRegion = (regionId: string) => {
    setRegions(regions.filter(r => r.id !== regionId));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // Save logic here
    navigate("/admin/michelle-profiles");
  };

  const getStepTitle = () => {
    const titles = [
      "Basic Information",
      "Geographic Coverage",
      "Contact & Settings",
      "Review & Activate",
    ];
    return titles[currentStep - 1];
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = {
      "Cleaning Services": "🧹",
      "Handyman Services": "🔧",
      "Grocery": "🛒",
      "Beauty Services": "💄",
      "Beauty Products": "🛍️",
      "Food": "🍲",
      "Rental Properties": "🏠",
      "Ride Assistance": "🚗",
      "Companionship Support": "🤝",
    };
    return icons[cat] || "📋";
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="michelle"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
        `}
      >
        <div className="max-w-[800px] mx-auto">
          {/* Back Navigation */}
          <Link
            to="/admin/michelle-profiles"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stores
          </Link>

          {/* Page Header */}
          <h1 className="text-[32px] font-bold text-[#1F2937] mb-2">
            {isEditing ? "Edit Store" : "Create New Store"}
          </h1>

          {/* Step Indicator */}
          <p className="text-base text-[#6B7280] mb-2">
            Step {currentStep} of 4: {getStepTitle()}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full mb-8">
            <div
              className="h-full bg-[#1F2937] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Form Container */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-10">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="businessName" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                    Business Name <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Sparkle Clean by Michelle"
                    className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px]"
                  />
                  <p className="text-[13px] text-[#6B7280] mt-2">
                    This name will be visible to customers
                  </p>
                </div>

                <div>
                  <Label htmlFor="category" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                    Service Category <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px]">
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cleaning Services">🧹 Cleaning Services</SelectItem>
                      <SelectItem value="Handyman Services">🔧 Handyman Services</SelectItem>
                      <SelectItem value="Grocery">🛒 Grocery</SelectItem>
                      <SelectItem value="Beauty Services">💄 Beauty Services</SelectItem>
                      <SelectItem value="Beauty Products">🛍️ Beauty Products</SelectItem>
                      <SelectItem value="Food">🍲 Food</SelectItem>
                      <SelectItem value="Rental Properties">🏠 Rental Properties</SelectItem>
                      <SelectItem value="Ride Assistance">🚗 Ride Assistance</SelectItem>
                      <SelectItem value="Companionship Support">🤝 Companionship Support</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[13px] text-[#6B7280] mt-2">
                    Choose the primary service category for this profile
                  </p>
                </div>

                <div>
                  <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
                    Business Logo
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="relative w-full sm:w-auto">
                      {logoPreview ? (
                        <div className="w-full sm:w-[200px] h-[200px] rounded-xl overflow-hidden border-2 border-[#E5E7EB]">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <label className="w-full sm:w-[200px] h-[200px] border-2 border-dashed border-[#E5E7EB] rounded-xl bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:border-[#1F2937] transition-colors">
                          <Upload className="w-12 h-12 text-[#9CA3AF] mb-2" />
                          <span className="text-sm text-[#6B7280]">Drag & Drop</span>
                          <span className="text-xs text-[#9CA3AF] mt-1">or click to browse</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <label>
                        <Button variant="outline" className="h-10" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {logoPreview && (
                        <Button
                          variant="ghost"
                          className="h-10 text-[#DC2626] hover:text-[#DC2626]"
                          onClick={() => setLogoPreview("")}
                        >
                          Remove
                        </Button>
                      )}
                      <p className="text-xs text-[#6B7280] mt-2">
                        Recommended: 512x512px<br />Max 5MB, JPG or PNG
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                    Business Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your services, specialties, and what makes your business unique..."
                    className="min-h-[140px] text-base border-2 border-[#E5E7EB] rounded-[10px] resize-none"
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-[13px] text-[#6B7280]">
                      Help customers understand what makes this business special
                    </p>
                    <p className="text-[13px] text-[#9CA3AF]">
                      {description.length} / 500 characters
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Geographic Coverage */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                    Active Regions <span className="text-[#DC2626]">*</span>
                  </Label>

                  <Button
                    variant="outline"
                    className="w-full h-[52px] border-2 border-dashed border-[#E5E7EB] text-[#6B7280] hover:border-[#1F2937] hover:bg-[#F8F9FA] mb-4"
                    onClick={() => setShowRegionModal(true)}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Region
                  </Button>

                  <p className="text-sm font-semibold text-[#1F2937] mb-4">
                    Selected Regions ({regions.length}):
                  </p>

                  <div className="space-y-4">
                    {regions.map((region) => (
                      <div
                        key={region.id}
                        className="flex items-center justify-between p-5 border border-[#E5E7EB] rounded-[10px]"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-[#6B7280]" />
                          <div>
                            <p className="text-base font-bold text-[#1F2937]">{region.name}</p>
                            <p className={`text-sm flex items-center gap-1.5 ${region.isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                              <span className={`w-2 h-2 rounded-full ${region.isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                              {region.isActive ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={region.isActive}
                            onCheckedChange={(checked) => {
                              setRegions(regions.map(r =>
                                r.id === region.id ? { ...r, isActive: checked } : r
                              ));
                            }}
                          />
                          <button
                            className="text-sm text-[#DC2626] hover:underline"
                            onClick={() => handleRemoveRegion(region.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[13px] text-[#6B7280] mt-4">
                    Customers in these regions will see this profile when searching for services.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-4">Contact Information</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                        Phone Number <span className="text-[#DC2626]">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(555) 123-4567"
                          className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px] pl-12"
                        />
                      </div>
                      <p className="text-[13px] text-[#6B7280] mt-2">
                        For internal use only. Not visible to customers.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                        Email Address <span className="text-[#DC2626]">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contact@yourbusiness.com"
                          className="h-[52px] text-base border-2 border-[#E5E7EB] rounded-[10px] pl-12"
                        />
                      </div>
                      <p className="text-[13px] text-[#6B7280] mt-2">
                        For internal use only. Not visible to customers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E5E7EB] pt-6">
                  <h3 className="text-lg font-bold text-[#1F2937] mb-2">"Powered by DoHuub" Badge</h3>
                  <p className="text-sm text-[#6B7280] mb-4">Show customers this is a verified DoHuub service</p>

                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-[15px] font-semibold text-[#1F2937]">
                      Display Badge
                    </Label>
                    <Switch checked={showBadge} onCheckedChange={setShowBadge} />
                  </div>

                  <div className="bg-[#F8F9FA] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] mb-3">Badge Preview:</p>
                    <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${showBadge ? 'bg-gradient-to-r from-[#F59E0B] to-[#F97316]' : 'bg-[#D1D5DB]'}`}>
                      <Star className={`w-3.5 h-3.5 ${showBadge ? 'fill-white text-white' : 'fill-[#6B7280] text-[#6B7280]'}`} />
                      <span className={`text-xs font-bold ${showBadge ? 'text-white' : 'text-[#6B7280]'}`}>
                        Powered by DoHuub
                      </span>
                    </div>
                    {!showBadge && (
                      <p className="text-xs text-[#9CA3AF] mt-2">Badge Hidden</p>
                    )}
                  </div>
                  <p className="text-[13px] text-[#6B7280] mt-3">
                    Recommended: Helps build trust with customers
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Review & Activate */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-4">Profile Preview</h3>

                  <div className="bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-xl p-8 mb-6">
                    <div className="flex gap-6 mb-6">
                      {logoPreview && (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h4 className="text-2xl font-bold text-[#1F2937] mb-2">{businessName || "Business Name"}</h4>
                        {showBadge && (
                          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                            <Star className="w-3.5 h-3.5 fill-white" />
                            Powered by DoHuub
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <p className="flex items-center gap-2">
                        <span>{getCategoryIcon(category)}</span>
                        {category || "Category"}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        Active in {regions.filter(r => r.isActive).length} regions
                      </p>
                      {phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#6B7280]" />
                          {phone}
                        </p>
                      )}
                      {email && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#6B7280]" />
                          {email}
                        </p>
                      )}
                      {description && (
                        <p className="text-[#6B7280] mt-3">{description.substring(0, 150)}...</p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-[#6B7280] mb-6">
                    This is how customers will see your profile in search results.
                  </p>
                </div>

                <div className="border-t border-[#E5E7EB] pt-6">
                  <h3 className="text-lg font-bold text-[#1F2937] mb-4">Activation Status</h3>

                  <RadioGroup value={activateNow} onValueChange={setActivateNow}>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="active" id="active" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="active" className="text-base font-bold text-[#1F2937] cursor-pointer">
                            Set as Active immediately
                          </Label>
                          <p className="text-sm text-[#6B7280]">
                            Recommended: Profile will appear in customer searches
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="inactive" id="inactive" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="inactive" className="text-base font-bold text-[#1F2937] cursor-pointer">
                            Save as Inactive
                          </Label>
                          <p className="text-sm text-[#6B7280]">
                            You can activate later from the profiles page
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-8 border-t border-[#E5E7EB]">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="h-11 px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="h-11 px-6 bg-[#1F2937] hover:bg-[#111827] text-white font-semibold"
                >
                  Save & Continue
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  {activateNow === "inactive" && (
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      className="h-11 px-6"
                    >
                      Save Profile
                    </Button>
                  )}
                  <Button
                    onClick={handleSave}
                    className="h-11 px-6 bg-[#1F2937] hover:bg-[#111827] text-white font-semibold"
                  >
                    {activateNow === "active" ? "Save & Activate" : "Save Profile"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Region Modal */}
      <CountryRegionModal
        open={showRegionModal}
        onClose={() => setShowRegionModal(false)}
        onAddRegions={handleAddRegions}
      />
    </div>
  );
}