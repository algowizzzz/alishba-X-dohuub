import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../../services/api";
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
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { CountryRegionModal } from "../admin/CountryRegionModal";

interface RegionWithCountry {
  id: string;
  name: string;
  countryCode: string;
  countryName: string;
  countryFlag: string;
  isActive: boolean;
}

export function VendorStoreForm() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const isEditing = !!storeId;

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

  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null); // Stored URL from API
  const [regions, setRegions] = useState<RegionWithCountry[]>([]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [activateNow, setActivateNow] = useState("active");
  const [showRegionModal, setShowRegionModal] = useState(false);

  // Load existing store data when editing
  const fetchStoreData = useCallback(async () => {
    if (!storeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const store: any = await api.getStoreById(storeId);

      // Populate form fields
      setBusinessName(store.name || "");
      setCategory(store.category || "");
      setDescription(store.description || "");
      setPhone(store.phone || "");
      setEmail(store.email || "");
      setActivateNow(store.status === "ACTIVE" ? "active" : "inactive");

      // Set logo if exists
      if (store.logo) {
        setLogoPreview(store.logo);
        setLogoUrl(store.logo);
      }

      // Set regions if exists
      if (store.regions && Array.isArray(store.regions)) {
        setRegions(store.regions.map((r: any) => ({
          id: r.id,
          name: r.name,
          countryCode: r.countryCode || "US",
          countryName: r.countryName || "United States",
          countryFlag: r.countryFlag || "🇺🇸",
          isActive: r.isActive !== false,
        })));
      }
    } catch (err: any) {
      console.error("Failed to load store:", err);
      setError(err.response?.data?.error || "Failed to load store data. Using empty form.");
      // Don't block the form - allow user to continue with empty form
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    if (isEditing) {
      fetchStoreData();
    }
  }, [isEditing, fetchStoreData]);

  const progress = (currentStep / 4) * 100;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Store file for upload on save
      setLogoFile(file);

      // Optionally upload immediately
      setIsUploading(true);
      try {
        const result: any = await api.uploadImage(file, 'store-logos');
        if (result.url) {
          setLogoUrl(result.url);
        }
      } catch (err: any) {
        console.error("Failed to upload logo:", err);
        // Don't block - file will be uploaded with form submission
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview("");
    setLogoFile(null);
    setLogoUrl(null);
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

  const handleSave = async () => {
    // Validate required fields
    if (!businessName.trim()) {
      setError("Business name is required");
      setCurrentStep(1);
      return;
    }
    if (!category) {
      setError("Service category is required");
      setCurrentStep(1);
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required");
      setCurrentStep(3);
      return;
    }
    if (!email.trim()) {
      setError("Email address is required");
      setCurrentStep(3);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Prepare store data
      const storeData = {
        name: businessName.trim(),
        category,
        description: description.trim(),
        phone: phone.trim(),
        email: email.trim(),
        status: activateNow === "active" ? "ACTIVE" : "INACTIVE",
        logo: logoUrl || undefined,
        regions: regions.map(r => ({
          id: r.id,
          name: r.name,
          countryCode: r.countryCode,
          isActive: r.isActive,
        })),
      };

      let result: any;

      if (isEditing && storeId) {
        // Update existing store
        result = await api.updateStore(storeId, storeData);
        setSuccessMessage("Store updated successfully!");
      } else {
        // Create new store
        result = await api.createStore(storeData);
        setSuccessMessage("Store created successfully!");
      }

      // Assign regions separately if needed
      if (result?.id && regions.length > 0) {
        const activeRegionIds = regions.filter(r => r.isActive).map(r => r.id);
        if (activeRegionIds.length > 0) {
          await api.assignStoreRegions(result.id, activeRegionIds).catch(err => {
            console.warn("Failed to assign regions:", err);
            // Don't block navigation - regions can be assigned later
          });
        }
      }

      // Navigate after short delay to show success message
      setTimeout(() => {
        navigate("/vendor/services");
      }, 1000);

    } catch (err: any) {
      console.error("Failed to save store:", err);
      setError(err.response?.data?.error || "Failed to save store. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
      <VendorTopNav onMenuClick={handleSidebarToggle} vendorName="John Smith" />
      <VendorSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="services"
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
            to="/vendor/services"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Services
          </Link>

          {/* Page Header */}
          <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
            {isEditing ? "Edit Store" : "Create New Store"}
          </h1>

          {/* Step Indicator */}
          <p className="text-sm sm:text-base text-[#6B7280] mb-2">
            Step {currentStep} of 4: {getStepTitle()}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full mb-6 sm:mb-8">
            <div
              className="h-full bg-[#1F2937] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                className="ml-auto text-red-500 hover:text-red-700"
                onClick={() => setError(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Success</p>
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mb-4 p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#E5E7EB] border-t-[#1F2937] rounded-full animate-spin mb-4" />
              <p className="text-sm text-[#6B7280]">Loading store data...</p>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6 lg:p-10">
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
                  <Label className="text-[15px] font-semibold text-[#1F2937] mb-2 block">
                    Business Logo
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
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
                        <Button variant="outline" className="h-10 w-full sm:w-auto" asChild>
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
                          className="h-10 text-[#DC2626] hover:text-[#DC2626] w-full sm:w-auto"
                          onClick={handleRemoveLogo}
                          disabled={isUploading}
                        >
                          Remove
                        </Button>
                      )}
                      {isUploading && (
                        <p className="text-xs text-[#6B7280]">Uploading...</p>
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
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 border border-[#E5E7EB] rounded-[10px]"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <MapPin className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm sm:text-base font-bold text-[#1F2937] break-words">{region.name}</p>
                            <p className={`text-xs sm:text-sm flex items-center gap-1.5 ${region.isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                              <span className={`w-2 h-2 rounded-full ${region.isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                              {region.isActive ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-4">
                          <Switch
                            checked={region.isActive}
                            onCheckedChange={(checked) => {
                              setRegions(regions.map(r =>
                                r.id === region.id ? { ...r, isActive: checked } : r
                              ));
                            }}
                          />
                          <button
                            className="text-sm text-[#DC2626] hover:underline flex-shrink-0"
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
                            You can activate later from the services page
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
                  disabled={isLoading}
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
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                  )}
                  <Button
                    onClick={handleSave}
                    className="h-11 px-6 bg-[#1F2937] hover:bg-[#111827] text-white font-semibold"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      activateNow === "active" ? "Save & Activate" : "Save Profile"
                    )}
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