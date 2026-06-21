import { useEffect, useState } from "react";
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
  X
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "sonner";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  downloadUrl: string;
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

  // Real subscription data, loaded from /vendors/me.
  // Stripe billing isn't wired yet, so amount + paymentMethod stay placeholder
  // until Stripe Connect is configured. Trial status, end date and cancel
  // come from the real Vendor row.
  const [subscription, setSubscription] = useState<{
    plan: string;
    status: string;
    amount: number | null;
    billing: string;
    nextBillingDate: string | null;
    trialEndsDate: string | null;
    paymentMethod: { type: string; last4: string; expiryDate: string } | null;
  }>({
    plan: "Trial",
    status: "Loading…",
    amount: null,
    billing: "—",
    nextBillingDate: null,
    trialEndsDate: null,
    paymentMethod: null,
  });

  useEffect(() => {
    api
      .get<{ success: boolean; data: any }>("/api/v1/vendors/me")
      .then((r) => {
        const v = (r as any)?.data;
        if (!v) return;
        const trialEnds = v.trialEndsAt ? new Date(v.trialEndsAt) : null;
        const status = v.subscriptionStatus || "TRIAL";
        setSubscription({
          plan:
            status === "TRIAL"
              ? "Free Trial"
              : status === "ACTIVE"
              ? "Monthly Plan"
              : status === "CANCELLED"
              ? "Cancelled"
              : status === "EXPIRED"
              ? "Expired"
              : "—",
          status: status.charAt(0) + status.slice(1).toLowerCase(),
          amount: null,
          billing: status === "TRIAL" ? "trial" : "monthly",
          nextBillingDate: trialEnds
            ? trialEnds.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : null,
          trialEndsDate: trialEnds && status === "TRIAL"
            ? trialEnds.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : null,
          paymentMethod: null,
        });
      })
      .catch(() => {});
  }, []);

  const features = [
    "Unlimited service listings",
    "Real-time order management",
    "Multi-region coverage",
  ];

  // Billing history — empty until Stripe webhooks populate BillingHistory.
  const invoices: Invoice[] = [];

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

  const [isCancelling, setIsCancelling] = useState(false);
  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      await api.post("/api/v1/subscriptions/cancel", { reason: cancelReason || undefined });
      toast.success("Subscription cancelled");
      setShowCancelModal(false);
      setCancelReason("");
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to cancel subscription");
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
        <div className="max-w-[1200px] mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Subscription
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage your subscription, billing, and payment methods
            </p>
          </div>

          {/* Current Plan Overview */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#2E7AD9] flex items-center justify-center shadow-[0_4px_12px_rgba(46,122,217,0.3)]">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A2E]">
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
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_2px_8px_rgba(46,122,217,0.10)]">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Plan Type
                </p>
                <p className="text-2xl font-bold text-[#1A1A2E] mb-1">
                  {subscription.plan}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {subscription.amount != null
                    ? `$${subscription.amount}/${subscription.billing === "yearly" ? "year" : "month"}`
                    : subscription.billing === "trial"
                    ? "No charge during trial"
                    : "—"}
                </p>
              </div>

              {/* Next Billing */}
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_2px_8px_rgba(46,122,217,0.10)]">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  {subscription.trialEndsDate ? "Trial Ends" : "Next Billing Date"}
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#6B7280]" />
                  <p className="text-base font-semibold text-[#1A1A2E]">
                    {subscription.nextBillingDate || "—"}
                  </p>
                </div>
                <p className="text-sm text-[#6B7280] mt-1">
                  {subscription.trialEndsDate
                    ? "Subscription required after this date"
                    : "Auto-renews on this date"}
                </p>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_2px_8px_rgba(46,122,217,0.10)]">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Payment Method
                </p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#6B7280]" />
                  <p className="text-base font-semibold text-[#1A1A2E]">
                    {subscription.paymentMethod
                      ? `${subscription.paymentMethod.type} •••• ${subscription.paymentMethod.last4}`
                      : "Not added"}
                  </p>
                </div>
                <p className="text-sm text-[#6B7280] mt-1">
                  {subscription.paymentMethod
                    ? `Expires ${subscription.paymentMethod.expiryDate}`
                    : "Add a card before your trial ends"}
                </p>
              </div>
            </div>

            {/* Action Buttons — payments-bound actions are disabled until
                Stripe Connect is wired. Cancel always works. */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleChangePlan} variant="default" disabled title="Stripe billing not yet configured">
                Change Plan
              </Button>
              <Button onClick={handleUpdatePayment} variant="outline" disabled title="Stripe billing not yet configured">
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
            <p className="text-xs text-[#6B7280] mt-3">
              Plan changes and payment-method updates will be enabled when Stripe billing is connected.
            </p>
          </div>

          {/* Plan Features */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">
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
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A1A2E]">
                Billing History
              </h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(46,122,217,0.25)]">
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
                    <tr key={invoice.id} className="border-b border-[rgba(46,122,217,0.25)] last:border-0">
                      <td className="py-4 px-4">
                        <p className="text-sm text-[#6B7280]">{invoice.date}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-[#1A1A2E]">
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
                  className="border border-[rgba(46,122,217,0.25)] rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A2E] mb-1">
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
                    <p className="text-lg font-bold text-[#1A1A2E]">
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
        </div>
      </main>

      {/* Update Payment Method Modal */}
      {showUpdatePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1A1A2E]">Update Payment Method</h2>
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
                  className="w-full px-3 py-2 border border-[rgba(46,122,217,0.25)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7AD9]"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">Cardholder Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[rgba(46,122,217,0.25)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7AD9]"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">Expiry Date</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[rgba(46,122,217,0.25)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7AD9]"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#6B7280] mb-2">CVV</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[rgba(46,122,217,0.25)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7AD9]"
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
              <h2 className="text-xl font-bold text-[#1A1A2E]">Cancel Subscription</h2>
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
                className="w-full px-3 py-2 border border-[rgba(46,122,217,0.25)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E7AD9]"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleConfirmCancel}
                variant="outline"
                disabled={isCancelling}
                className="text-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] border-[#FEE2E2]"
              >
                {isCancelling ? "Cancelling..." : "Cancel Subscription"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}