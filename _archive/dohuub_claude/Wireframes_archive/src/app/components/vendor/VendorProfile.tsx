import { useState } from "react";
import { Save, User as UserIcon, Building, Mail, Phone, MapPin, FileText, Briefcase, Lock } from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
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

export function VendorProfile() {
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

  const [formData, setFormData] = useState({
    businessName: "John's Services",
    ownerName: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    businessAddress: "123 Main Street, San Francisco, CA 94102",
    taxId: "12-3456789",
    businessType: "llc",
    bankAccount: "****5678",
    payoutSchedule: "weekly",
    minimumPayout: "100",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
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
        activeMenu="profile"
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Profile
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage your business information and account settings
            </p>
          </div>

          {/* Business Information */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                <Building className="w-6 h-6 text-[#1F2937]" />
              </div>
              <h2 className="text-xl font-bold text-[#1F2937]">
                Business Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div>
                <Label htmlFor="businessName" className="mb-1.5">
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="John's Services"
                />
              </div>

              {/* Owner Name */}
              <div>
                <Label htmlFor="ownerName" className="mb-1.5">
                  Owner Name
                </Label>
                <Input
                  id="ownerName"
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange("ownerName", e.target.value)}
                  placeholder="John Smith"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-1.5">
                  Email Address
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-[#6B7280] font-normal">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="pl-10 bg-[#F9FAFB] cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-[#6B7280] mt-1.5">
                  Contact support to update your email address
                </p>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="mb-1.5">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Business Address */}
              <div className="md:col-span-2">
                <Label htmlFor="businessAddress" className="mb-1.5">
                  Business Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    id="businessAddress"
                    type="text"
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                    placeholder="123 Main Street, City, State, ZIP"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tax ID */}
              <div>
                <Label htmlFor="taxId" className="mb-1.5">
                  Tax ID / EIN
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    id="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                    placeholder="12-3456789"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Business Type */}
              <div>
                <Label htmlFor="businessType" className="mb-1.5">
                  Business Type
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] z-10" />
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleInputChange("businessType", value)}
                  >
                    <SelectTrigger id="businessType" className="pl-10">
                      <SelectValue />
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
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-[#1F2937]" />
              </div>
              <h2 className="text-xl font-bold text-[#1F2937]">Account Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="mb-1.5">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="mb-1.5">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="mb-1.5">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>

              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}