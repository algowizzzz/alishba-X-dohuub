import { useEffect, useState } from "react";
import { Store, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import api from "../../../services/api";
import { supabase } from "../../../lib/supabase";

function splitName(full: string) {
  const trimmed = (full || "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  const firstName = parts.shift() || "";
  const lastName = parts.join(" ");
  return { firstName, lastName };
}

export function VendorProfileSetup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasVendor, setHasVendor] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    description: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const email = user?.email || "";
        setFormData((p) => ({ ...p, email }));

        const [vendorRes, userRes] = await Promise.all([
          api
            .get<{ success: boolean; data: any }>("/api/v1/vendors/me")
            .catch(() => null),
          api
            .get<{ success: boolean; data: any }>("/api/v1/users/me")
            .catch(() => null),
        ]);
        const vendor = (vendorRes as any)?.data?.data || (vendorRes as any)?.data;
        const userData = (userRes as any)?.data?.data || (userRes as any)?.data;
        if (vendor) {
          setHasVendor(true);
          setFormData((p) => ({
            ...p,
            businessName: vendor.businessName || "",
            phone: vendor.contactPhone || userData?.phone || p.phone,
            description: vendor.description || "",
          }));
        }
        if (userData?.profile) {
          const f = userData.profile.firstName || "";
          const l = userData.profile.lastName || "";
          const full = `${f} ${l}`.trim();
          if (full) {
            setFormData((p) => ({ ...p, ownerName: p.ownerName || full }));
          }
        }
      } catch (e) {
        // Non-fatal — falls back to create mode.
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim() || !formData.ownerName.trim() || !formData.phone.trim()) {
      toast.error("Business name, owner name, and phone are required");
      return;
    }
    setIsLoading(true);
    try {
      const { firstName, lastName } = splitName(formData.ownerName);

      // Persist owner name + phone on the user profile.
      await api.put("/api/v1/users/me", {
        firstName,
        lastName,
        phone: formData.phone,
      });

      // Persist the vendor record itself.
      if (hasVendor) {
        await api.put("/api/v1/vendors/me", {
          businessName: formData.businessName,
          contactPhone: formData.phone,
          description: formData.description,
        });
        toast.success("Profile updated");
      } else {
        await api.post("/api/v1/vendors", {
          businessName: formData.businessName,
          contactPhone: formData.phone,
          description: formData.description,
          categories: [],
        });
        toast.success("Vendor profile created");
      }
      navigate("/vendor/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFF] to-[#F0F7FF] flex items-center justify-center p-4">
      <div className="w-full max-w-[600px]">
        <div className="bg-white rounded-2xl border border-[rgba(46,122,217,0.25)] p-8 shadow-[0_4px_16px_rgba(46,122,217,0.20)]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#F0F7FF] flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-[#1A1A2E]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">
              {hasVendor ? "Edit Your Business Profile" : "Set Up Your Business Profile"}
            </h1>
            <p className="text-sm text-[#6B7280]">
              Tell us about your business to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <Label htmlFor="email" className="mb-1.5">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-white"
              />
            </div>

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

            <div className="border-t border-[rgba(46,122,217,0.25)] my-6"></div>

            <div>
              <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1">
                Optional Information
              </h3>
              <p className="text-xs text-[#6B7280]">
                You can skip this and add it later in your profile settings
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="mb-1.5">
                Business Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Tell customers about your business, services, address, and what makes you stand out"
                rows={4}
              />
            </div>

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
                hasVendor ? "Saving..." : "Creating Profile..."
              ) : (
                <>
                  {hasVendor ? "Save Changes" : "Complete Setup"}
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
