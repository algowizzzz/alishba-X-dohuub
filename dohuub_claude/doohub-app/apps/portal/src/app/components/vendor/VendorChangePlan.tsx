import { useEffect, useState } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Check, ArrowRight, AlertCircle, CreditCard, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import api from "../../../services/api";
import { toast } from "sonner";

type PlanType = "monthly" | "yearly";
type Provider = "STRIPE" | "WIPAY" | "POWERTRANZ";

const PROVIDER_META: Record<
  Provider,
  { label: string; tagline: string; Icon: typeof CreditCard }
> = {
  STRIPE: {
    label: "Card (Stripe)",
    tagline: "Visa / Mastercard / Amex — best for US vendors",
    Icon: Zap,
  },
  WIPAY: {
    label: "WiPay",
    tagline: "Cards & bank — used across the Caribbean",
    Icon: CreditCard,
  },
  POWERTRANZ: {
    label: "PowerTranz",
    tagline: "Visa / Mastercard via First Atlantic Commerce",
    Icon: ShieldCheck,
  },
};

export function VendorChangePlan() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [recommendedProvider, setRecommendedProvider] = useState<Provider>("STRIPE");
  const [availableProviders, setAvailableProviders] = useState<Provider[]>([
    "STRIPE",
    "WIPAY",
    "POWERTRANZ",
  ]);
  const [selectedProvider, setSelectedProvider] = useState<Provider>("STRIPE");
  const [showOtherProviders, setShowOtherProviders] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{
          success: boolean;
          data?: {
            country: string;
            recommended: Provider;
            available: { id: Provider; enabled: boolean }[];
          };
        }>("/api/v1/subscriptions/providers");
        if (!res?.data) return;
        const enabled = res.data.available.filter((p) => p.enabled).map((p) => p.id);
        const rec = enabled.includes(res.data.recommended)
          ? res.data.recommended
          : enabled[0] || "STRIPE";
        setRecommendedProvider(rec);
        setAvailableProviders(enabled.length ? enabled : ["STRIPE", "WIPAY", "POWERTRANZ"]);
        setSelectedProvider(rec);
      } catch {
        // Non-fatal — fall back to defaults.
      }
    })();
  }, []);

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Current subscription data
  const currentPlan = {
    type: "trial",
    name: "Trial Plan",
    price: 0,
    daysRemaining: 0,
  };

  const plans = {
    monthly: {
      name: "Monthly Plan",
      price: 49,
      billing: "per month",
      savings: null,
      total: "$49/month",
    },
    yearly: {
      name: "Yearly Plan",
      price: 470,
      billing: "per year",
      savings: "Save $118/year",
      total: "$470/year ($39.17/month)",
    },
  };

  const features = [
    "Unlimited service listings",
    "Real-time order management",
    "Payment processing included",
  ];

  const handlePlanChange = () => {
    if (selectedPlan === currentPlan.type) {
      // No change needed
      return;
    }
    setShowConfirmModal(true);
  };

  const [isChanging, setIsChanging] = useState(false);
  const handleConfirmChange = async () => {
    // UI is a monthly-vs-yearly toggle for the Professional plan today.
    // Change here if the change-plan page adds a plan tier selector.
    const planId = "professional";
    const billingPeriod = selectedPlan === "monthly" ? "monthly" : "yearly";
    setIsChanging(true);
    try {
      // Stage the plan selection first — this doesn't activate anything until
      // payment succeeds via the hosted checkout below.
      await api.put("/api/v1/subscriptions/change-plan", { planId, billingPeriod });

      // Ask the API for a WiPay/PowerTranz hosted-checkout URL and redirect.
      // The gateway webhook flips the subscription to ACTIVE after payment.
      const res = await api.post<{
        success: boolean;
        data?: { url: string };
        error?: string;
      }>("/api/v1/subscriptions/checkout-session", {
        provider: selectedProvider,
        planId,
        billingPeriod,
        returnUrl: window.location.origin + "/vendor/subscription-management?checkout=return",
      });

      if (!res?.data?.url) {
        throw new Error(res?.error || "Could not start checkout");
      }

      // Full-page redirect — some gateways refuse to load inside an iframe,
      // and a redirect gives us a clean back-navigation into the portal.
      window.location.href = res.data.url;
    } catch (e: any) {
      toast.error(
        e?.response?.data?.error || e?.message || "Failed to start checkout"
      );
    } finally {
      setIsChanging(false);
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
        activeMenu="subscription"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1000px] mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/vendor/subscription-management")}
              className="text-sm text-[#6B7280] hover:text-[#1A1A2E] mb-4 flex items-center gap-1"
            >
              ← Back to Subscription
            </button>
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Change Your Plan
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Select a new subscription plan for your vendor account
            </p>
          </div>

          {/* Current Plan Info */}
          <div className="bg-[#F0F7FF] border border-[#C7DDF7] rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#1E5DB0] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1E5DB0] mb-1">
                  Trial Plan Utilized
                </p>
                <p className="text-sm text-[#1E5DB0]">
                  Your 14-day free trial has been completed. Select a paid plan below to continue using DoHuub's vendor services.
                </p>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">
              Select New Plan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Monthly Plan */}
              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={`
                  relative border-2 rounded-2xl p-6 text-left transition-all
                  ${
                    selectedPlan === "monthly"
                      ? "border-[#2E7AD9] bg-white"
                      : "border-[rgba(46,122,217,0.25)] hover:border-[rgba(46,122,217,0.25)]"
                  }
                `}
              >
                {selectedPlan === "monthly" && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[#2E7AD9] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
                  {plans.monthly.name}
                </h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    ${plans.monthly.price}
                  </span>
                  <span className="text-sm text-[#6B7280] ml-2">
                    {plans.monthly.billing}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Billed monthly with flexible cancellation
                </p>
              </button>

              {/* Yearly Plan */}
              <button
                type="button"
                onClick={() => setSelectedPlan("yearly")}
                className={`
                  relative border-2 rounded-2xl p-6 text-left transition-all
                  ${
                    selectedPlan === "yearly"
                      ? "border-[#2E7AD9] bg-white"
                      : "border-[rgba(46,122,217,0.25)] hover:border-[rgba(46,122,217,0.25)]"
                  }
                `}
              >
                {plans.yearly.savings && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#D1FAE5] rounded-full">
                    <span className="text-xs font-semibold text-[#065F46]">
                      {plans.yearly.savings}
                    </span>
                  </div>
                )}
                {selectedPlan === "yearly" && !plans.yearly.savings && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[#2E7AD9] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
                  {plans.yearly.name}
                </h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    ${plans.yearly.price}
                  </span>
                  <span className="text-sm text-[#6B7280] ml-2">
                    {plans.yearly.billing}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Best value - pay annually and save
                </p>
              </button>
            </div>

            {/* Plan Comparison */}
            <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_2px_8px_rgba(46,122,217,0.10)]">
              <h3 className="text-base font-semibold text-[#1A1A2E] mb-4">
                All Plans Include
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D1FAE5] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#065F46]" />
                    </div>
                    <span className="text-sm text-[#4B5563]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment provider picker — filtered by vendor country */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">
              Payment Method
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              We'll pick the best option for your region — you can pay a
              different way if you'd like.
            </p>

            {(() => {
              const ProviderButton = ({
                id,
                isRecommended,
              }: {
                id: Provider;
                isRecommended: boolean;
              }) => {
                const meta = PROVIDER_META[id];
                const Icon = meta.Icon;
                const isSelected = selectedProvider === id;
                return (
                  <button
                    type="button"
                    onClick={() => setSelectedProvider(id)}
                    className={`
                      relative w-full border-2 rounded-2xl p-6 text-left transition-all flex items-start gap-4 mb-3
                      ${
                        isSelected
                          ? "border-[#2E7AD9] bg-white"
                          : "border-[rgba(46,122,217,0.25)] hover:border-[rgba(46,122,217,0.4)]"
                      }
                    `}
                  >
                    <Icon className="w-6 h-6 text-[#2E7AD9] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-bold text-[#1A1A2E]">
                          {meta.label}
                        </h3>
                        {isRecommended && (
                          <span className="text-[10px] font-semibold text-[#1E5DB0] bg-[rgba(46,122,217,0.12)] px-2 py-0.5 rounded-full">
                            Recommended for your region
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#6B7280]">{meta.tagline}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-[#2E7AD9] rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              };

              const others = availableProviders.filter(
                (p) => p !== recommendedProvider
              );

              return (
                <>
                  <ProviderButton id={recommendedProvider} isRecommended={true} />
                  {others.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowOtherProviders((v) => !v)}
                        className="text-sm text-[#6B7280] hover:text-[#1A1A2E] font-medium flex items-center gap-1 mt-2 mb-2"
                      >
                        {showOtherProviders
                          ? "Hide other payment methods"
                          : "Other payment methods"}
                        <ArrowRight
                          className={`w-4 h-4 transition-transform ${
                            showOtherProviders ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                      {showOtherProviders &&
                        others.map((id) => (
                          <ProviderButton key={id} id={id} isRecommended={false} />
                        ))}
                    </>
                  )}
                </>
              );
            })()}
          </div>

          {/* Billing Info */}
          {selectedPlan !== currentPlan.type && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-6 mb-6">
              <h3 className="text-base font-semibold text-[#92400E] mb-2">
                Billing Changes
              </h3>
              <p className="text-sm text-[#92400E] mb-3">
                {selectedPlan === "yearly"
                  ? "You'll be charged $470 today and billed annually going forward."
                  : "You'll be charged $49 today and billed monthly going forward."}
              </p>
              <p className="text-sm text-[#92400E]">
                Your new plan will take effect immediately.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handlePlanChange}
              variant="default"
              disabled={selectedPlan === currentPlan.type}
            >
              {selectedPlan === currentPlan.type
                ? "Currently Active"
                : "Change to " + plans[selectedPlan].name}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/vendor/subscription-management")}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-[500px]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">
              Confirm Plan Change
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              You'll be redirected to {PROVIDER_META[selectedProvider].label} to
              complete payment on their secure hosted page. Your{" "}
              {plans[selectedPlan].name} activates as soon as the charge clears.
            </p>

            <div className="bg-white rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Current Plan:</span>
                <span className="text-sm font-semibold text-[#1A1A2E]">
                  {currentPlan.name}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">New Plan:</span>
                <span className="text-sm font-semibold text-[#1A1A2E]">
                  {plans[selectedPlan].name}
                </span>
              </div>
              <div className="h-px bg-[rgba(46, 122, 217, 0.12)] my-3"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1A1A2E]">
                  Amount Due Today:
                </span>
                <span className="text-lg font-bold text-[#1A1A2E]">
                  ${selectedPlan === "yearly" ? "470.00" : "49.00"}
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                onClick={() => setShowConfirmModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmChange}
                variant="default"
                disabled={isChanging}
                className="flex-1"
              >
                {isChanging
                  ? "Starting checkout..."
                  : `Continue to ${PROVIDER_META[selectedProvider].label}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}