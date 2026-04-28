import { useState, useEffect, useCallback } from "react";
import { Save, Eye, EyeOff, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { api } from "../../../services/api";

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

  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing settings
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const settings: any = await api.get('/settings/vendor');
      if (settings) {
        setStripePublishableKey(settings.stripePublishableKey || "");
        setStripeSecretKey(settings.stripeSecretKey ? "••••••••••••••••" : "");
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      // Use defaults
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/settings/vendor/test-stripe', {
        stripePublishableKey,
        stripeSecretKey: stripeSecretKey.includes("••••") ? undefined : stripeSecretKey,
      });
      setSuccess("Connection successful! Your Stripe integration is working.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Connection failed. Please check your API keys.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put('/settings/vendor', {
        stripePublishableKey,
        stripeSecretKey: stripeSecretKey.includes("••••") ? undefined : stripeSecretKey,
      });
      setSuccess("Settings saved successfully!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Settings
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Configure your payment integration settings
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
              <button className="ml-auto text-green-500 hover:text-green-700" onClick={() => setSuccess(null)}>
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
              <button className="ml-auto text-red-500 hover:text-red-700" onClick={() => setError(null)}>
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-10 h-10 border-4 border-[#E5E7EB] border-t-[#1F2937] rounded-full animate-spin mb-4" />
              <p className="text-sm text-[#6B7280]">Loading settings...</p>
            </div>
          ) : (
          /* Payment Settings */
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#1F2937]" />
              </div>
              <h2 className="text-xl font-bold text-[#1F2937]">Payment Settings</h2>
            </div>

            {/* Info Alert */}
            <div className="bg-[#F0F9FF] border border-[#BFDBFE] rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <CreditCard className="w-5 h-5 text-[#1E40AF] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-[#1E40AF] mb-1">
                    Stripe Integration
                  </h3>
                  <p className="text-sm text-[#1E3A8A]">
                    Connect your Stripe account to process payments securely. Get your API
                    keys from{" "}
                    <a
                      href="https://dashboard.stripe.com/apikeys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#1E40AF]"
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
                <Button
                  onClick={handleSavePaymentSettings}
                  disabled={isSaving}
                  className="w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save API Keys"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="w-full sm:w-auto"
                >
                  {isTesting ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
