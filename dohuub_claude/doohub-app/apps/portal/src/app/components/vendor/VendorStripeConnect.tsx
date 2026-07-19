import { useEffect, useState } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import api from "../../../services/api";
import { toast } from "sonner";

interface ConnectStatus {
  country: string;
  eligible: boolean;
  accountId: string | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  onboardingComplete: boolean;
}

/**
 * Stripe Connect onboarding page for US vendors.
 *
 * US vendors go through Stripe's hosted onboarding so their payouts on US
 * customer bookings are automated. Caribbean vendors don't see this — their
 * payouts are settled manually and this page tells them so.
 */
export function VendorStripeConnect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [startingOnboarding, setStartingOnboarding] = useState(false);

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await api.get<{ success: boolean; data?: ConnectStatus; error?: string }>(
        "/api/v1/vendor/stripe-connect/status"
      );
      if (res?.data) setStatus(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to load Stripe status");
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Coming back from Stripe onboarding — refresh a few seconds later so
    // Stripe's own webhook has a chance to update the account state.
    if (searchParams.get("done")) {
      const t = setTimeout(fetchStatus, 3000);
      return () => clearTimeout(t);
    }
  }, [searchParams.get("done")]);

  const handleStartOnboarding = async () => {
    setStartingOnboarding(true);
    try {
      const res = await api.post<{
        success: boolean;
        data?: { url: string };
        error?: string;
      }>("/api/v1/vendor/stripe-connect/onboard");
      if (!res?.data?.url) throw new Error(res?.error || "No onboarding URL returned");
      window.location.href = res.data.url;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to start Stripe onboarding"
      );
      setStartingOnboarding(false);
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
        <div className="max-w-[800px] mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate("/vendor/settings")}
              className="text-sm text-[#6B7280] hover:text-[#1A1A2E] mb-4 flex items-center gap-1"
            >
              ← Back to Settings
            </button>
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Payouts
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              How you get paid for the bookings and orders customers place with you
            </p>
          </div>

          {loadingStatus ? (
            <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-12 flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 text-[#2E7AD9] animate-spin" />
              <span className="text-sm text-[#6B7280]">Checking your account…</span>
            </div>
          ) : !status?.eligible ? (
            /* Caribbean vendor — manual payout notice */
            <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
              <div className="flex items-start gap-3 mb-4">
                <Banknote className="w-6 h-6 text-[#2E7AD9] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A2E] mb-2">
                    You're paid manually
                  </h2>
                  <p className="text-sm text-[#4B5563]">
                    Because your business is registered in {status?.country || "the Caribbean"}, your
                    payouts don't run through Stripe. DoHuub settles what you're owed by direct
                    bank transfer on a regular schedule.
                  </p>
                </div>
              </div>
              <div className="bg-[#F0F7FF] border border-[#C7DDF7] rounded-xl p-4">
                <p className="text-sm text-[#1E5DB0]">
                  If you'd like to change the payout account we send to, contact support.
                </p>
              </div>
            </div>
          ) : status.onboardingComplete ? (
            /* US vendor, onboarding complete — automated payouts active */
            <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
              <div className="flex items-start gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A2E] mb-2">
                    Automated payouts active
                  </h2>
                  <p className="text-sm text-[#4B5563]">
                    Your Stripe account is set up and receiving payouts. When a customer pays for
                    one of your services with a card, your share lands in your bank account on
                    Stripe's standard payout schedule.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#065F46] mb-1">Charges</p>
                  <p className="text-sm text-[#065F46]">
                    {status.chargesEnabled ? "Enabled" : "Not yet enabled"}
                  </p>
                </div>
                <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#065F46] mb-1">Payouts</p>
                  <p className="text-sm text-[#065F46]">
                    {status.payoutsEnabled ? "Enabled" : "Not yet enabled"}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleStartOnboarding}
                variant="outline"
                disabled={startingOnboarding}
              >
                {startingOnboarding ? "Opening Stripe…" : "Manage payout details on Stripe"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            /* US vendor, onboarding pending — needs to complete */
            <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
              <div className="flex items-start gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A2E] mb-2">
                    {status.detailsSubmitted
                      ? "Almost there — Stripe still needs a few details"
                      : "Connect a payout account to get paid automatically"}
                  </h2>
                  <p className="text-sm text-[#4B5563]">
                    We use Stripe to send your payouts. You'll complete Stripe's short onboarding
                    (business details, bank account, ID verification) on Stripe's own secure page.
                    We don't see any of your bank or card details.
                  </p>
                </div>
              </div>

              <div className="bg-[#F0F7FF] border border-[#C7DDF7] rounded-xl p-4 mb-6 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1E5DB0] shrink-0 mt-0.5" />
                <div className="text-sm text-[#1E5DB0]">
                  Until this is complete, DoHuub still charges customers for your services and
                  holds the funds — we just can't pay you out until Stripe finishes the checks.
                </div>
              </div>

              <Button
                onClick={handleStartOnboarding}
                variant="default"
                disabled={startingOnboarding}
              >
                {startingOnboarding
                  ? "Opening Stripe…"
                  : status.detailsSubmitted
                    ? "Continue Stripe onboarding"
                    : "Start Stripe onboarding"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
