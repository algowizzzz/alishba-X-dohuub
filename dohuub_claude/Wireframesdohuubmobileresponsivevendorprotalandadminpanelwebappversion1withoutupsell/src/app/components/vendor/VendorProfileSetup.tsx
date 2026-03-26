import { useState } from "react";
import { Store, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function VendorProfileSetup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "vendor@example.com", // Pre-filled from signup
    phone: "",
    businessAddress: "",
    taxId: "",
    businessType: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      navigate("/vendor/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-[600px]">
        {/* Setup Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-[#1F2937]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
              Set Up Your Business Profile
            </h1>
            <p className="text-sm text-[#6B7280]">
              Tell us about your business to get started
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-[#6B7280] mb-2">
              <span>Step 1 of 1</span>
              <span>Business Information</span>
            </div>
            <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div className="h-full bg-[#1F2937] rounded-full w-full"></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name - Required */}
            <div>
              <Label htmlFor="businessName" className="mb-1.5">
                Business Name <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="John's Cleaning Services"
                required
              />
            </div>

            {/* Owner Name - Required */}
            <div>
              <Label htmlFor="ownerName" className="mb-1.5">
                Owner Name <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="ownerName"
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>

            {/* Email - Pre-filled, Required */}
            <div>
              <Label htmlFor="email" className="mb-1.5">
                Email Address <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-[#F9FAFB]"
              />
            </div>

            {/* Phone - Required */}
            <div>
              <Label htmlFor="phone" className="mb-1.5">
                Phone Number <span className="text-[#DC2626]">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>

            {/* Divider */}
            <div className="border-t border-[#E5E7EB] my-6"></div>

            {/* Optional Fields Header */}
            <div>
              <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                Optional Information
              </h3>
              <p className="text-xs text-[#6B7280]">
                You can skip these and add them later in your profile settings
              </p>
            </div>

            {/* Business Address - Optional */}
            <div>
              <Label htmlFor="businessAddress" className="mb-1.5">
                Business Address
              </Label>
              <Input
                id="businessAddress"
                type="text"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                placeholder="123 Main Street, City, State, ZIP"
              />
            </div>

            {/* Tax ID - Optional */}
            <div>
              <Label htmlFor="taxId" className="mb-1.5">
                Tax ID / EIN
              </Label>
              <Input
                id="taxId"
                type="text"
                value={formData.taxId}
                onChange={(e) => handleInputChange("taxId", e.target.value)}
                placeholder="12-3456789"
              />
            </div>

            {/* Business Type - Optional */}
            <div>
              <Label htmlFor="businessType" className="mb-1.5">
                Business Type
              </Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleInputChange("businessType", value)}
              >
                <SelectTrigger id="businessType">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                  <SelectItem value="llc">LLC</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                !formData.businessName ||
                !formData.ownerName ||
                !formData.phone
              }
            >
              {isLoading ? (
                "Creating Profile..."
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}