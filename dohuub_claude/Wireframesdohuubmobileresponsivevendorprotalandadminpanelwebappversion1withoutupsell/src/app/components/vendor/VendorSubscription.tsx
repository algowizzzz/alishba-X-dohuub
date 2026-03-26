import { useState } from "react";
import { CreditCard, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type PlanType = "monthly" | "yearly";

export function VendorSubscription() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces every 4 digits
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    setCardDetails((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (value: string) => {
    // Format expiry date as MM/YY
    const cleaned = value.replace(/\//g, "");
    if (cleaned.length >= 2) {
      const formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
      setCardDetails((prev) => ({ ...prev, expiryDate: formatted }));
    } else {
      setCardDetails((prev) => ({ ...prev, expiryDate: cleaned }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      navigate("/vendor/profile-setup");
      setIsLoading(false);
    }, 1500);
  };

  const plans = {
    monthly: {
      name: "Monthly Plan",
      price: 49,
      billing: "per month",
      savings: null,
    },
    yearly: {
      name: "Yearly Plan",
      price: 470,
      billing: "per year",
      savings: "Save $118/year",
    },
  };

  const features = [
    "14-day free trial included",
    "Unlimited service listings",
    "Real-time order management",
    "Customer communication tools",
    "Analytics & insights dashboard",
    "Payment processing included",
    "24/7 vendor support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-[900px]">
        {/* Subscription Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-[#1F2937]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
              Choose Your Plan
            </h1>
            <p className="text-sm text-[#6B7280]">
              Start with a 14-day free trial, no commitment required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Plan Selection */}
            <div>
              <h2 className="text-base font-semibold text-[#1F2937] mb-4">
                Select Subscription Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Monthly Plan */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("monthly")}
                  className={`relative border-2 rounded-xl p-6 text-left transition-all ${
                    selectedPlan === "monthly"
                      ? "border-[#1F2937] bg-[#F9FAFB]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                  }`}
                >
                  {selectedPlan === "monthly" && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-[#1F2937] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-[#6B7280] mb-1">
                      {plans.monthly.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#1F2937]">
                        ${plans.monthly.price}
                      </span>
                      <span className="text-sm text-[#6B7280]">
                        {plans.monthly.billing}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Billed monthly • Cancel anytime
                  </p>
                </button>

                {/* Yearly Plan */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("yearly")}
                  className={`relative border-2 rounded-xl p-6 text-left transition-all ${
                    selectedPlan === "yearly"
                      ? "border-[#1F2937] bg-[#F9FAFB]"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                  }`}
                >
                  {/* Popular Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1F2937] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                  {selectedPlan === "yearly" && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-[#1F2937] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-[#6B7280] mb-1">
                      {plans.yearly.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#1F2937]">
                        ${plans.yearly.price}
                      </span>
                      <span className="text-sm text-[#6B7280]">
                        {plans.yearly.billing}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#D1FAE5] text-[#065F46] text-xs font-semibold">
                      {plans.yearly.savings}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      $39/month when billed yearly
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-[#1F2937] mb-4">
                What's Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#D1FAE5] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#065F46]" />
                    </div>
                    <span className="text-sm text-[#4B5563]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E5E7EB]"></div>

            {/* Card Details */}
            <div>
              <h2 className="text-base font-semibold text-[#1F2937] mb-4">
                Payment Information
              </h2>
              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <Label htmlFor="cardNumber" className="mb-1.5">
                    Card Number <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>

                {/* Name on Card */}
                <div>
                  <Label htmlFor="cardName" className="mb-1.5">
                    Name on Card <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="cardName"
                    type="text"
                    value={cardDetails.cardName}
                    onChange={(e) =>
                      setCardDetails((prev) => ({ ...prev, cardName: e.target.value }))
                    }
                    placeholder="John Smith"
                    required
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="mb-1.5">
                      Expiry Date <span className="text-[#DC2626]">*</span>
                    </Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      value={cardDetails.expiryDate}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="mb-1.5">
                      CVV <span className="text-[#DC2626]">*</span>
                    </Label>
                    <Input
                      id="cvv"
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails((prev) => ({
                          ...prev,
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                        }))
                      }
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trial Notice */}
            <div className="bg-[#DBEAFE] border border-[#93C5FD] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1E40AF] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E40AF] mb-1">
                    Your 14-Day Free Trial Starts Now
                  </p>
                  <p className="text-xs text-[#1E3A8A]">
                    Your card won't be charged until your trial ends. Cancel anytime during the trial period at no cost.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={
                isLoading ||
                !cardDetails.cardNumber ||
                !cardDetails.cardName ||
                !cardDetails.expiryDate ||
                !cardDetails.cvv
              }
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {/* Security Notice */}
            <p className="text-xs text-center text-[#9CA3AF]">
              🔒 Your payment information is secure and encrypted
            </p>
          </form>
        </div>

        {/* Terms Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#9CA3AF]">
            By subscribing, you agree to our{" "}
            <a href="#" className="hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="hover:underline">
              Subscription Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
