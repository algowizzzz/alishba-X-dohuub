import { useState } from "react";
import { CreditCard, ArrowRight, ShieldCheck, Landmark, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";

/**
 * Vendor Settings.
 *
 * Per the DoHuub proposal, vendors do NOT enter their own Stripe API keys.
 * Stripe billing is handled centrally by the platform:
 *   - Subscription billing → Subscription page (Change Plan / Update Payment via
 *     Stripe Customer Portal / Cancel).
 *   - Payouts (US vendors only) → Stripe Connect onboarding page.
 *
 * This page just orients the vendor and links out to those two flows.
 */
export function VendorSettings() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <VendorTopNav onMenuClick={handleSidebarToggle} />
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
        activeMenu="settings"
      />

      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[900px] mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Settings
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage billing, payouts, and account preferences
            </p>
          </div>

          {/* Billing (Subscription) */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2E7AD9] flex items-center justify-center shadow-[0_4px_12px_rgba(46,122,217,0.3)] shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#1A1A2E] mb-1">
                  Subscription & Billing
                </h2>
                <p className="text-sm text-[#4B5563] mb-4">
                  Your plan, next billing date, and payment history. Payment
                  cards are managed by Stripe through their secure hosted
                  Customer Portal.
                </p>
                <Button
                  onClick={() => navigate("/vendor/subscription-management")}
                  variant="default"
                >
                  Manage subscription
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Payouts (Stripe Connect) */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981] flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3)] shrink-0">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#1A1A2E] mb-1">
                  Payouts (Bank connection)
                </h2>
                <p className="text-sm text-[#4B5563] mb-4">
                  Connect your bank account to receive payouts from bookings.
                  US-based vendors use Stripe's hosted onboarding — no card or
                  bank data ever touches DoHuub.
                </p>
                <Button
                  onClick={() => navigate("/vendor/stripe-connect")}
                  variant="outline"
                >
                  Set up payouts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications preview / placeholder */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B] flex items-center justify-center shadow-[0_4px_12px_rgba(245,158,11,0.3)] shrink-0">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#1A1A2E] mb-1">
                  Notifications
                </h2>
                <p className="text-sm text-[#4B5563]">
                  Order alerts and subscription reminders are enabled by default.
                  You'll receive an email 3 days before your trial ends.
                </p>
              </div>
            </div>
          </div>

          {/* Security / compliance blurb */}
          <div className="bg-[#F0F7FF] border border-[#C7DDF7] rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1E5DB0] mt-0.5 shrink-0" />
              <p className="text-sm text-[#1E5DB0]">
                All payments are processed through Stripe under DoHuub's
                platform account. Card data is PCI-DSS compliant and never
                stored on DoHuub servers.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
