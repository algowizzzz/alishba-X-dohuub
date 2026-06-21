import { AlertTriangle, Mail, Phone } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useVendorSuspension } from "../../contexts/VendorSuspensionContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function VendorSuspensionOverlay() {
  const navigate = useNavigate();
  const { isSuspended, loading } = useVendorSuspension();

  if (loading || !isSuspended) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/vendor/login");
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center p-4">
      <div className="max-w-[600px] w-full text-center">
        {/* Warning Icon */}
        <div className="w-20 h-20 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-[#DC2626]" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
          Account Suspended
        </h1>

        {/* Message */}
        <p className="text-base sm:text-lg text-[#6B7280] mb-8">
          Your vendor account has been temporarily suspended. Please contact DoHuub support to resolve this issue and restore access to your account.
        </p>

        {/* Contact Information Card */}
        <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 mb-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
          <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">
            Contact DoHuub Support
          </h2>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#2E7AD9] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#6B7280] mb-1">Email</p>
                <a 
                  href="mailto:support@dohuub.com" 
                  className="text-sm font-semibold text-[#1A1A2E] hover:text-[#1A1A2E] transition-colors"
                >
                  support@dohuub.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#2E7AD9] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#6B7280] mb-1">Phone</p>
                <a 
                  href="tel:1-800-364-8821" 
                  className="text-sm font-semibold text-[#1A1A2E] hover:text-[#1A1A2E] transition-colors"
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

        <div className="pt-6 border-t border-[rgba(46,122,217,0.25)]">
          <Button onClick={handleSignOut} variant="outline" className="text-sm text-[#6B7280] hover:text-[#1A1A2E]">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
