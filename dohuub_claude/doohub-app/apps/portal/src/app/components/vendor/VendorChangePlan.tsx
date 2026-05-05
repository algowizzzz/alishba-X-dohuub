import { useState } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Check, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type PlanType = "monthly" | "yearly";

export function VendorChangePlan() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const handleConfirmChange = () => {
    // Process plan change
    console.log("Plan changed to:", selectedPlan);
    setShowConfirmModal(false);
    // Navigate back to subscription management
    navigate("/vendor/subscription-management");
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <VendorTopNav onMenuClick={handleSidebarToggle} />
      <VendorSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
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
                      ? "border-[#2E7AD9] bg-[#F8FAFF]"
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
                      ? "border-[#2E7AD9] bg-[#F8FAFF]"
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
            <div className="bg-[#F8FAFF] border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_2px_8px_rgba(46,122,217,0.10)]">
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
              Are you sure you want to change to the {plans[selectedPlan].name}?
              {selectedPlan === "yearly"
                ? " You'll be charged $470 immediately."
                : " You'll be charged $49 immediately."}
            </p>

            <div className="bg-[#F8FAFF] rounded-xl p-4 mb-6">
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
                className="flex-1"
              >
                Confirm Change
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}