import { useState, useEffect, useCallback } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Check, ArrowRight, AlertCircle, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { api } from "../../../services/api";

type PlanType = "monthly" | "yearly";

interface Plan {
  id: string;
  name: string;
  price: number;
  billing: string;
  savings: string | null;
  total: string;
  interval: string;
}

interface CurrentPlan {
  type: string;
  name: string;
  price: number;
  daysRemaining: number;
}

export function VendorChangePlan() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan>({
    type: "trial",
    name: "Trial Plan",
    price: 0,
    daysRemaining: 0,
  });

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Fetch current subscription
  const fetchCurrentPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: any = await api.get('/subscriptions/current');
      if (data && data.plan) {
        setCurrentPlan({
          type: data.plan.interval || "trial",
          name: data.plan.name || "Trial Plan",
          price: data.plan.price || 0,
          daysRemaining: data.trialDaysRemaining || 0,
        });
        // Pre-select the current plan interval if not trial
        if (data.plan.interval === 'monthly' || data.plan.interval === 'yearly') {
          setSelectedPlan(data.plan.interval as PlanType);
        }
      }
    } catch (err) {
      console.error("Failed to fetch current plan:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentPlan();
  }, [fetchCurrentPlan]);

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

  const handleConfirmChange = async () => {
    setIsChanging(true);
    setError(null);

    try {
      await api.post('/subscriptions/change-plan', {
        planInterval: selectedPlan,
      });
      setSuccess("Your plan has been changed successfully!");
      setShowConfirmModal(false);
      // Navigate back to subscription management after a short delay
      setTimeout(() => {
        navigate("/vendor/subscription-management");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to change plan. Please try again.");
      setShowConfirmModal(false);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <VendorTopNav onMenuClick={handleSidebarToggle} vendorName="John Smith" />
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
              className="text-sm text-[#6B7280] hover:text-[#1F2937] mb-4 flex items-center gap-1"
            >
              ← Back to Subscription
            </button>
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Change Your Plan
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Select a new subscription plan for your vendor account
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
              <p className="text-sm text-[#6B7280]">Loading plans...</p>
            </div>
          ) : (
          <>
          {/* Current Plan Info */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#1E40AF] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1E40AF] mb-1">
                  Trial Plan Utilized
                </p>
                <p className="text-sm text-[#1E40AF]">
                  Your 14-day free trial has been completed. Select a paid plan below to continue using DoHuub's vendor services.
                </p>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-6">
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
                      ? "border-[#1F2937] bg-[#F9FAFB]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                  }
                `}
              >
                {selectedPlan === "monthly" && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[#1F2937] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                  {plans.monthly.name}
                </h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-[#1F2937]">
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
                      ? "border-[#1F2937] bg-[#F9FAFB]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
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
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[#1F2937] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                  {plans.yearly.name}
                </h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-[#1F2937]">
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
            <div className="bg-[#F9FAFB] rounded-xl p-6">
              <h3 className="text-base font-semibold text-[#1F2937] mb-4">
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
          </>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-[500px]">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">
              Confirm Plan Change
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Are you sure you want to change to the {plans[selectedPlan].name}?
              {selectedPlan === "yearly"
                ? " You'll be charged $470 immediately."
                : " You'll be charged $49 immediately."}
            </p>

            <div className="bg-[#F9FAFB] rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">Current Plan:</span>
                <span className="text-sm font-semibold text-[#1F2937]">
                  {currentPlan.name}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6B7280]">New Plan:</span>
                <span className="text-sm font-semibold text-[#1F2937]">
                  {plans[selectedPlan].name}
                </span>
              </div>
              <div className="h-px bg-[#E5E7EB] my-3"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1F2937]">
                  Amount Due Today:
                </span>
                <span className="text-lg font-bold text-[#1F2937]">
                  ${selectedPlan === "yearly" ? "470.00" : "49.00"}
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                onClick={() => setShowConfirmModal(false)}
                variant="outline"
                className="flex-1"
                disabled={isChanging}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmChange}
                variant="default"
                className="flex-1"
                disabled={isChanging}
              >
                {isChanging ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Change"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}