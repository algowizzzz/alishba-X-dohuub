import { useState, useEffect, useCallback } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { CreditCard, Lock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { api } from "../../../services/api";

interface PaymentMethod {
  type: string;
  last4: string;
  expiryDate: string;
}

export function VendorUpdatePayment() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Current payment method from API
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethod>({
    type: "Card",
    last4: "****",
    expiryDate: "N/A",
  });

  // Validation state
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
    cvv?: string;
  }>({});

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Fetch current payment method
  const fetchCurrentPaymentMethod = useCallback(async () => {
    setIsFetching(true);
    try {
      const data: any = await api.get('/subscriptions/current');
      if (data && data.paymentMethod) {
        setCurrentPaymentMethod({
          type: data.paymentMethod.brand || "Card",
          last4: data.paymentMethod.last4 || "****",
          expiryDate: data.paymentMethod.expMonth && data.paymentMethod.expYear
            ? `${String(data.paymentMethod.expMonth).padStart(2, '0')}/${String(data.paymentMethod.expYear).slice(-2)}`
            : "N/A",
        });
      }
    } catch (err) {
      console.error("Failed to fetch payment method:", err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentPaymentMethod();
  }, [fetchCurrentPaymentMethod]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: undefined });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    if (errors.expiryDate) {
      setErrors({ ...errors, expiryDate: undefined });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, "").slice(0, 4);
    setCvv(value);
    if (errors.cvv) {
      setErrors({ ...errors, cvv: undefined });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Card number validation (must be 16 digits)
    const cardDigits = cardNumber.replace(/\s/g, "");
    if (!cardDigits) {
      newErrors.cardNumber = "Card number is required";
    } else if (cardDigits.length < 15 || cardDigits.length > 16) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    // Cardholder name validation
    if (!cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }

    // Expiry date validation
    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (expiryDate.length !== 5) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    } else {
      const [month, year] = expiryDate.split("/").map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Invalid month";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // CVV validation
    if (!cvv) {
      newErrors.cvv = "CVV is required";
    } else if (cvv.length < 3) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      await api.post('/subscriptions/update-payment', {
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardName,
        expiryDate,
        cvv,
      });
      setSuccess("Payment method updated successfully!");
      // Navigate back to subscription management after a short delay
      setTimeout(() => {
        navigate("/vendor/subscription-management");
      }, 1500);
    } catch (err: any) {
      setApiError(err.response?.data?.error || "Failed to update payment method. Please try again.");
    } finally {
      setIsLoading(false);
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
        <div className="max-w-[800px] mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/vendor/subscription-management")}
              className="text-sm text-[#6B7280] hover:text-[#1F2937] mb-4 flex items-center gap-1"
            >
              ← Back to Subscription
            </button>
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Update Payment Method
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Update the payment method for your subscription
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
          {apiError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{apiError}</p>
              <button className="ml-auto text-red-500 hover:text-red-700" onClick={() => setApiError(null)}>
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {isFetching ? (
            <div className="py-20 text-center">
              <div className="inline-block w-10 h-10 border-4 border-[#E5E7EB] border-t-[#1F2937] rounded-full animate-spin mb-4" />
              <p className="text-sm text-[#6B7280]">Loading payment information...</p>
            </div>
          ) : (
          <>
          {/* Current Payment Method */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F2937] mb-1">
                  Current Payment Method
                </p>
                <p className="text-sm text-[#6B7280]">
                  {currentPaymentMethod.type} ending in {currentPaymentMethod.last4} • Expires {currentPaymentMethod.expiryDate}
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#1E40AF] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1E40AF] mb-1">
                  Secure Payment Information
                </p>
                <p className="text-sm text-[#1E40AF]">
                  Your payment information is encrypted and secure. We never store your full card details.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold text-[#1F2937] mb-6">
                New Payment Information
              </h2>

              <div className="space-y-6">
                {/* Card Number */}
                <div>
                  <Label htmlFor="cardNumber">
                    Card Number <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className={errors.cardNumber ? "border-[#DC2626]" : ""}
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                {/* Cardholder Name */}
                <div>
                  <Label htmlFor="cardName">
                    Cardholder Name <span className="text-[#DC2626]">*</span>
                  </Label>
                  <Input
                    id="cardName"
                    type="text"
                    placeholder="John Smith"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      if (errors.cardName) {
                        setErrors({ ...errors, cardName: undefined });
                      }
                    }}
                    className={errors.cardName ? "border-[#DC2626]" : ""}
                  />
                  {errors.cardName && (
                    <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.cardName}
                    </p>
                  )}
                </div>

                {/* Expiry Date and CVV */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">
                      Expiry Date <span className="text-[#DC2626]">*</span>
                    </Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className={errors.expiryDate ? "border-[#DC2626]" : ""}
                    />
                    {errors.expiryDate && (
                      <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cvv">
                      CVV <span className="text-[#DC2626]">*</span>
                    </Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      maxLength={4}
                      className={errors.cvv ? "border-[#DC2626]" : ""}
                    />
                    {errors.cvv && (
                      <p className="text-xs text-[#DC2626] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Payment Method"}
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/vendor/subscription-management")}
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
          </>
          )}
        </div>
      </main>
    </div>
  );
}