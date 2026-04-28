import { useState, useEffect, useCallback } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import {
  CreditCard,
  Calendar,
  Download,
  Edit,
  Check,
  ArrowRight,
  AlertCircle,
  X,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  downloadUrl: string;
}

interface Subscription {
  plan: string;
  status: string;
  amount: number;
  billing: string;
  nextBillingDate: string;
  trialEndsDate: string | null;
  paymentMethod: {
    type: string;
    last4: string;
    expiryDate: string;
  };
  features: string[];
}

export function VendorSubscriptionManagement() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Subscription data from API
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Fetch subscription data from API
  const fetchSubscription = useCallback(async () => {
    try {
      const data: any = await api.get('/subscriptions/current');
      setSubscription({
        plan: data.plan?.name || "No Plan",
        status: data.status || "Inactive",
        amount: data.plan?.price || 0,
        billing: data.plan?.interval || "monthly",
        nextBillingDate: data.currentPeriodEnd
          ? new Date(data.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : "N/A",
        trialEndsDate: data.trialEnd
          ? new Date(data.trialEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : null,
        paymentMethod: {
          type: data.paymentMethod?.brand || "Card",
          last4: data.paymentMethod?.last4 || "****",
          expiryDate: data.paymentMethod?.expMonth && data.paymentMethod?.expYear
            ? `${String(data.paymentMethod.expMonth).padStart(2, '0')}/${String(data.paymentMethod.expYear).slice(-2)}`
            : "N/A",
        },
        features: data.plan?.features || [
          "Unlimited service listings",
          "Real-time order management",
          "Payment processing included",
        ],
      });
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
      // Use fallback data
      setSubscription({
        plan: "No Active Plan",
        status: "Inactive",
        amount: 0,
        billing: "monthly",
        nextBillingDate: "N/A",
        trialEndsDate: null,
        paymentMethod: {
          type: "Card",
          last4: "****",
          expiryDate: "N/A",
        },
        features: [
          "Unlimited service listings",
          "Real-time order management",
          "Payment processing included",
        ],
      });
    }
  }, []);

  // Fetch invoices from API
  const fetchInvoices = useCallback(async () => {
    try {
      const data: any = await api.get('/subscriptions/invoices');
      const formattedInvoices: Invoice[] = (data.invoices || []).map((inv: any) => ({
        id: inv.id || inv.invoiceNumber,
        date: inv.createdAt
          ? new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : "N/A",
        amount: inv.amount || inv.total || 0,
        status: inv.status === 'paid' ? 'Paid' : inv.status === 'pending' ? 'Pending' : 'Failed',
        downloadUrl: inv.invoicePdf || inv.downloadUrl || "#",
      }));
      setInvoices(formattedInvoices);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setInvoices([]);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchSubscription(), fetchInvoices()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchSubscription, fetchInvoices]);

  const features = subscription?.features || [
    "Unlimited service listings",
    "Real-time order management",
    "Payment processing included",
  ];

  const handleChangePlan = () => {
    // Navigate to change plan page
    navigate("/vendor/change-plan");
  };

  const handleUpdatePayment = () => {
    // Navigate to update payment page
    navigate("/vendor/update-payment");
  };

  const handleCancelSubscription = () => {
    // Show cancel confirmation modal
    setShowCancelModal(true);
  };

  const handleSubmitPaymentUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment update
    console.log("Payment method updated:", {
      cardNumber,
      cardName,
      expiryDate,
      cvv,
    });
    setShowUpdatePaymentModal(false);
    // Reset form
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
    setCvv("");
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setError(null);

    try {
      await api.post('/subscriptions/cancel', { reason: cancelReason });
      setSuccess("Your subscription has been cancelled. You will retain access until the end of your billing period.");
      setShowCancelModal(false);
      setCancelReason("");
      // Refresh subscription data
      await fetchSubscription();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to cancel subscription. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

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
        <div className="max-w-[1200px] mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Subscription
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage your subscription, billing, and payment methods
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
              <p className="text-sm text-[#6B7280]">Loading subscription...</p>
            </div>
          ) : !subscription ? (
            <div className="py-20 text-center">
              <p className="text-sm text-[#6B7280]">No subscription found</p>
              <Button onClick={() => navigate("/vendor/subscription")} className="mt-4">
                Subscribe Now
              </Button>
            </div>
          ) : (
          <>
          {/* Current Plan Overview */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#1F2937]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937]">
                    Current Plan
                  </h2>
                  <p className="text-sm text-[#6B7280]">
                    Your subscription details and billing information
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D1FAE5] rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="text-sm font-semibold text-[#065F46]">
                  {subscription.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Plan Details */}
              <div className="bg-[#F9FAFB] rounded-xl p-6">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Plan Type
                </p>
                <p className="text-2xl font-bold text-[#1F2937] mb-1">
                  {subscription.plan}
                </p>
                <p className="text-sm text-[#6B7280]">
                  ${subscription.amount}/{subscription.billing === "yearly" ? "year" : "month"}
                </p>
              </div>

              {/* Next Billing */}
              <div className="bg-[#F9FAFB] rounded-xl p-6">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Next Billing Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#6B7280]" />
                  <p className="text-base font-semibold text-[#1F2937]">
                    {subscription.nextBillingDate}
                  </p>
                </div>
                <p className="text-sm text-[#6B7280] mt-1">
                  Auto-renews on this date
                </p>
              </div>

              {/* Payment Method */}
              <div className="bg-[#F9FAFB] rounded-xl p-6">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Payment Method
                </p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#6B7280]" />
                  <p className="text-base font-semibold text-[#1F2937]">
                    {subscription.paymentMethod.type} •••• {subscription.paymentMethod.last4}
                  </p>
                </div>
                <p className="text-sm text-[#6B7280] mt-1">
                  Expires {subscription.paymentMethod.expiryDate}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleChangePlan} variant="default">
                Change Plan
              </Button>
              <Button onClick={handleUpdatePayment} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button
                onClick={handleCancelSubscription}
                variant="outline"
                className="text-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] border-[#FEE2E2]"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>

          {/* Plan Features */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">
              What's Included in Your Plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Billing History */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1F2937]">
                Billing History
              </h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[#E5E7EB] last:border-0">
                      <td className="py-4 px-4">
                        <p className="text-sm text-[#6B7280]">{invoice.date}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-[#1F2937]">
                          ${invoice.amount.toFixed(2)}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === "Paid"
                              ? "bg-[#D1FAE5] text-[#065F46]"
                              : invoice.status === "Pending"
                              ? "bg-[#FEF3C7] text-[#92400E]"
                              : "bg-[#FEE2E2] text-[#991B1B]"
                          }`}
                        >
                          {invoice.status === "Paid" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                          )}
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border border-[#E5E7EB] rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1F2937] mb-1">
                        {invoice.id}
                      </p>
                      <p className="text-xs text-[#6B7280]">{invoice.date}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === "Paid"
                          ? "bg-[#D1FAE5] text-[#065F46]"
                          : invoice.status === "Pending"
                          ? "bg-[#FEF3C7] text-[#92400E]"
                          : "bg-[#FEE2E2] text-[#991B1B]"
                      }`}
                    >
                      {invoice.status === "Paid" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                      )}
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-[#1F2937]">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(invoice.downloadUrl, "_blank")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>
          )}
        </div>
      </main>

      {/* Update Payment Method Modal */}
      {showUpdatePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Update Payment Method</h2>
              <button
                className="text-[#6B7280] hover:text-[#DC2626]"
                onClick={() => setShowUpdatePaymentModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitPaymentUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">Card Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">Cardholder Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">Expiry Date</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">CVV</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="default">
                  Update Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Cancel Subscription</h2>
              <button
                className="text-[#6B7280] hover:text-[#DC2626]"
                onClick={() => setShowCancelModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#6B7280] mb-2">Reason for Cancellation</label>
              <textarea
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="outline"
                disabled={isCancelling}
              >
                Keep Subscription
              </Button>
              <Button
                onClick={handleConfirmCancel}
                variant="outline"
                disabled={isCancelling}
                className="text-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] border-[#FEE2E2]"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}