import { useState } from "react";
import { Save, Eye, EyeOff, CreditCard } from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function VendorSettings() {
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

  const [stripePublishableKey, setStripePublishableKey] = useState(
    "pk_test_51234567890abcdef..."
  );
  const [stripeSecretKey, setStripeSecretKey] = useState(
    "sk_test_51234567890abcdef..."
  );
  const [showSecretKey, setShowSecretKey] = useState(false);

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
        activeMenu="settings"
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Settings
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Configure your payment integration settings
            </p>
          </div>

          {/* Payment Settings */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg px-4 py-2 mb-4 text-xs text-[#92400E]">
              Demo data &mdash; vendor payment-settings endpoint pending
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#2E7AD9] flex items-center justify-center shadow-[0_4px_12px_rgba(46,122,217,0.3)]">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1A1A2E]">Payment Settings</h2>
            </div>

            {/* Info Alert */}
            <div className="bg-[#F0F9FF] border border-[#C7DDF7] rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <CreditCard className="w-5 h-5 text-[#1E5DB0] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[#1E5DB0] mb-1">
                    Stripe Integration
                  </h3>
                  <p className="text-sm text-[#1A4791]">
                    Connect your Stripe account to process payments securely. Get your API
                    keys from{" "}
                    <a
                      href="https://dashboard.stripe.com/apikeys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#1E5DB0]"
                    >
                      Stripe Dashboard
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Stripe Publishable Key */}
              <div>
                <Label htmlFor="stripe-publishable-key" className="mb-1.5">
                  Stripe Publishable Key
                </Label>
                <Input
                  id="stripe-publishable-key"
                  value={stripePublishableKey}
                  onChange={(e) => setStripePublishableKey(e.target.value)}
                  placeholder="pk_test_51234567890abcdef..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-[#6B7280] mt-1">
                  This key is public and safe to use in your frontend code
                </p>
              </div>

              {/* Stripe Secret Key */}
              <div>
                <Label htmlFor="stripe-secret-key" className="mb-1.5">
                  Stripe Secret Key
                </Label>
                <div className="relative">
                  <Input
                    id="stripe-secret-key"
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                    placeholder="sk_test_51234567890abcdef..."
                    type={showSecretKey ? "text" : "password"}
                    className="font-mono text-sm pr-12"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showSecretKey ? (
                      <EyeOff className="w-4 h-4 text-[#6B7280]" />
                    ) : (
                      <Eye className="w-4 h-4 text-[#6B7280]" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-[#DC2626] mt-1">
                  ⚠️ Keep this key secure and never share it publicly
                </p>
              </div>

              <div className="flex gap-3">
                <Button disabled className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save (coming soon)
                </Button>
                <Button variant="outline" disabled className="w-full sm:w-auto">
                  Test Connection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
