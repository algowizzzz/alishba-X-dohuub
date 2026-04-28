import { AlertTriangle, Mail, Phone, XCircle } from "lucide-react";
import { useVendorSuspension } from "../../contexts/VendorSuspensionContext";
import { Button } from "../ui/button";

export function VendorSuspensionOverlay() {
  const { isSuspended, toggleSuspension } = useVendorSuspension();

  if (!isSuspended) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center p-4">
      <div className="max-w-[600px] w-full text-center">
        {/* Warning Icon */}
        <div className="w-20 h-20 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-[#DC2626]" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
          Account Suspended
        </h1>

        {/* Message */}
        <p className="text-base sm:text-lg text-[#6B7280] mb-8">
          Your vendor account has been temporarily suspended. Please contact DoHuub support to resolve this issue and restore access to your account.
        </p>

        {/* Contact Information Card */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">
            Contact DoHuub Support
          </h2>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#1F2937] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#6B7280] mb-1">Email</p>
                <a 
                  href="mailto:support@dohuub.com" 
                  className="text-sm font-semibold text-[#1F2937] hover:text-[#374151] transition-colors"
                >
                  support@dohuub.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#1F2937] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#6B7280] mb-1">Phone</p>
                <a 
                  href="tel:1-800-364-8821" 
                  className="text-sm font-semibold text-[#1F2937] hover:text-[#374151] transition-colors"
                >
                  1-800-364-8821
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <p className="text-sm text-[#9CA3AF] mb-6">
          Support Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
        </p>

        {/* Simulation Toggle (for testing only) */}
        <div className="pt-6 border-t border-[#E5E7EB]">
          <Button
            onClick={toggleSuspension}
            variant="outline"
            className="text-sm text-[#6B7280] hover:text-[#1F2937]"
          >
            <XCircle className="w-4 h-4 mr-2" />
            End Simulation
          </Button>
          <p className="text-xs text-[#9CA3AF] mt-2">
            (This button is for testing purposes only)
          </p>
        </div>
      </div>
    </div>
  );
}
