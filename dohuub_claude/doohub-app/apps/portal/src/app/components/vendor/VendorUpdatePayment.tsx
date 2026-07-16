import { useState } from "react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import api from "../../../services/api";
import { toast } from "sonner";

/**
 * Update Payment — opens Stripe's hosted Customer Portal so vendors can
 * manage saved cards, view invoices, and update billing details without
 * DoHuub ever handling card data (PCI compliance).
 *
 * If the API returns 503 (Stripe not configured), we degrade to the
 * previous behavior: point the vendor to Change Plan, where WiPay /
 * PowerTranz collect card info on their hosted page each cycle.
 */
export function VendorUpdatePayment() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const openStripePortal = async () => {
    setIsOpeningPortal(true);
    try {
      const res = await api.post<{
        success: boolean;
        data?: { url: string };
        error?: string;
      }>("/api/v1/subscriptions/customer-portal", {
        returnUrl:
          window.location.origin + "/vendor/subscription-management",
      });
      if (!res?.data?.url) {
        throw new Error(res?.error || "Could not open Stripe portal");
      }
      window.location.href = res.data.url;
    } catch (e: any) {
      const msg =
        e?.response?.data?.error || e?.message || "Failed to open Stripe portal";
      toast.error(msg);
      setIsOpeningPortal(false);
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
              onClick={() => navigate("/vendor/subscription-management")}
              className="text-sm text-[#6B7280] hover:text-[#1A1A2E] mb-4 flex items-center gap-1"
            >
              ← Back to Subscription
            </button>
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Payment Method
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage your saved card and billing details on Stripe's secure
              hosted portal
            </p>
          </div>

          {/* Primary — Stripe Customer Portal */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#2E7AD9] flex items-center justify-center shadow-[0_4px_12px_rgba(46,122,217,0.3)] shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1A1A2E] mb-2">
                  Manage on Stripe
                </h2>
                <p className="text-sm text-[#4B5563]">
                  You'll be redirected to Stripe's Customer Portal where you can
                  add or replace your card, download past invoices, and update
                  your billing address. Return to DoHuub when you're done.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                "Add or replace card",
                "Download invoices",
                "Update billing address",
              ].map((f) => (
                <div
                  key={f}
                  className="bg-[#F0F7FF] border border-[#C7DDF7] rounded-xl p-3 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#1E5DB0] shrink-0" />
                  <p className="text-xs font-semibold text-[#1A4791]">{f}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={openStripePortal}
                disabled={isOpeningPortal}
                variant="default"
              >
                {isOpeningPortal ? "Opening Stripe…" : "Open Stripe Portal"}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => navigate("/vendor/subscription-management")}
                variant="outline"
              >
                Back to Subscription
              </Button>
            </div>
          </div>

          {/* Fallback — WiPay / PowerTranz */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F0F7FF] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-[#1E5DB0]" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-[#1A1A2E] mb-1">
                  Paying with WiPay or PowerTranz?
                </h2>
                <p className="text-sm text-[#4B5563]">
                  These Caribbean gateways don't save cards. Card details are
                  entered on the gateway's hosted page each cycle when you
                  Change Plan or renew.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/vendor/change-plan")}
              variant="outline"
            >
              Go to Change Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Security notice */}
          <div className="bg-[#F0F7FF] border border-[#C7DDF7] rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#1E5DB0] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1E5DB0] mb-1">
                  Your card never touches DoHuub
                </p>
                <p className="text-sm text-[#1E5DB0]">
                  Stripe holds all card data and handles PCI-DSS compliance.
                  DoHuub only stores a customer id and receipt URLs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
