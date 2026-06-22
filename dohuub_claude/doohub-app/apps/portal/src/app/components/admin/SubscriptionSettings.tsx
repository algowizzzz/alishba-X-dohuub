import { useEffect, useState } from "react";
import { ArrowLeft, Trophy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import api from "../../../services/api";

interface TrialSettings {
  enabled: boolean;
  duration: number;
  durationUnit: "days" | "weeks";
  afterTrialAction: "auto-convert" | "manual-upgrade";
  notifications: {
    reminderBeforeEnd: boolean;
    requirePaymentMethod: boolean;
    sendWelcomeEmail: boolean;
  };
  onExpiration: {
    deactivateListings: boolean;
    blockNewListings: boolean;
    sendNotification: boolean;
    suspendAccount: boolean;
  };
  gracePeriodDays: number;
}

const defaultTrialSettings: TrialSettings = {
  enabled: true,
  duration: 30,
  durationUnit: "days",
  afterTrialAction: "manual-upgrade",
  notifications: {
    reminderBeforeEnd: true,
    requirePaymentMethod: true,
    sendWelcomeEmail: true,
  },
  onExpiration: {
    deactivateListings: true,
    blockNewListings: true,
    sendNotification: true,
    suspendAccount: false,
  },
  gracePeriodDays: 3,
};

export function SubscriptionSettings() {
  const navigate = useNavigate();

  // Sidebar state
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

  const [trialSettings, setTrialSettings] = useState<TrialSettings>(defaultTrialSettings);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<{ success: boolean; data: any }>("/api/v1/admin/settings"),
      api.get<{ success: boolean; data: any[] }>("/api/v1/admin/subscription-plans"),
    ])
      .then(([sRes, pRes]) => {
        const s: any = (sRes as any)?.data;
        if (s) {
          setTrialSettings({
            enabled: true,
            duration: s.trialDurationDays ?? 30,
            durationUnit: "days",
            afterTrialAction: s.trialAfterExpiry === "AUTO_CONVERT" ? "auto-convert" : "manual-upgrade",
            notifications: {
              reminderBeforeEnd: s.trialOnExpirySendNotification ?? true,
              requirePaymentMethod: s.trialRequirePaymentMethod ?? false,
              sendWelcomeEmail: s.trialSendWelcomeEmail ?? true,
            },
            onExpiration: {
              deactivateListings: s.trialOnExpiryDeactivateListings ?? true,
              blockNewListings: s.trialOnExpiryBlockNewListings ?? true,
              sendNotification: s.trialOnExpirySendNotification ?? true,
              suspendAccount: s.trialOnExpirySuspendAccount ?? false,
            },
            gracePeriodDays: s.trialGracePeriodDays ?? 7,
          });
        }
        setPlans((pRes as any)?.data || []);
      })
      .catch(() => {});
  }, []);

  const handleSaveSettings = async () => {
    setSaveStatus("saving");
    try {
      await api.put("/api/v1/admin/settings", {
        trialDurationDays: trialSettings.duration,
        trialGracePeriodDays: trialSettings.gracePeriodDays,
        trialReminderDaysBefore: 3,
        trialRequirePaymentMethod: trialSettings.notifications.requirePaymentMethod,
        trialSendWelcomeEmail: trialSettings.notifications.sendWelcomeEmail,
        trialAfterExpiry: trialSettings.afterTrialAction === "auto-convert" ? "AUTO_CONVERT" : "PAUSE",
        trialOnExpiryDeactivateListings: trialSettings.onExpiration.deactivateListings,
        trialOnExpiryBlockNewListings: trialSettings.onExpiration.blockNewListings,
        trialOnExpirySendNotification: trialSettings.onExpiration.sendNotification,
        trialOnExpirySuspendAccount: trialSettings.onExpiration.suspendAccount,
      });
      setSaveStatus("saved");
      toast.success("Subscription settings saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (e: any) {
      setSaveStatus("idle");
      toast.error(e?.response?.data?.error || e?.message || "Failed to save settings");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
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
        <div className="max-w-[1200px] mx-auto">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate("/admin/settings")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Subscription Plans & Trial Configuration
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage trial settings for vendor subscriptions
            </p>
          </div>

          {/* Available Plans — from SubscriptionPlan table */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">Available Plans</h2>
            <p className="text-sm text-[#6B7280] mb-6">Edit these via the database — vendor portal reads them from the same table.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">Trial (Free)</h3>
                <ul className="space-y-2 text-sm text-[#4B5563]">
                  <li>• Duration: {trialSettings.duration} {trialSettings.durationUnit}</li>
                  <li>• Price: $0</li>
                  <li>• Full access to all features</li>
                  <li>• {trialSettings.notifications.requirePaymentMethod ? "Payment method required" : "No payment method needed"}</li>
                </ul>
              </div>

              {plans.length === 0 ? (
                <div className="col-span-2 bg-[#F0F7FF] border border-[rgba(46,122,217,0.25)] rounded-xl p-5 text-sm text-[#6B7280]">
                  No subscription plans configured yet. Seed via /admin/subscription-plans API.
                </div>
              ) : plans.map((plan: any) => {
                const isYearly = plan.billingPeriod === "YEARLY";
                const monthly = isYearly ? plan.priceCents / 12 / 100 : plan.priceCents / 100;
                return (
                  <div key={plan.id} className={`rounded-xl p-5 relative ${isYearly ? "bg-[#F0FDF4] border-2 border-[#10B981]" : "bg-white border border-[rgba(46,122,217,0.25)] shadow-[0_4px_16px_rgba(46,122,217,0.18)]"}`}>
                    {isYearly && (
                      <div className="absolute -top-3 right-4 bg-[#10B981] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {plan.savingsLabel || "BEST VALUE"}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">{plan.name}</h3>
                    <ul className="space-y-2 text-sm text-[#4B5563]">
                      <li>• Price: ${monthly.toFixed(2)}/month</li>
                      <li>• Billed {isYearly ? `$${(plan.priceCents / 100).toFixed(0)} annually` : "monthly"}</li>
                      {Array.isArray(plan.features) && plan.features.slice(0, 2).map((f: string, i: number) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* All Plans Include */}
            <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
              <h3 className="text-base font-bold text-[#1A1A2E] mb-3">All Plans Include:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Unlimited listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Analytics dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Verified badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Featured placement eligibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>API access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trial Period Configuration */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 sm:p-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">
              Trial Period Configuration
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">Free Trial Settings</p>

            <div className="space-y-6">
              {/* Enable Trial Toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(46,122,217,0.25)]">
                <Label htmlFor="enable-trial" className="text-base font-semibold text-[#1A1A2E]">
                  Enable free trial
                </Label>
                <button
                  id="enable-trial"
                  onClick={() =>
                    setTrialSettings({ ...trialSettings, enabled: !trialSettings.enabled })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    trialSettings.enabled ? "bg-[#10B981]" : "bg-[rgba(46,122,217, 0.12)]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      trialSettings.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Trial Duration */}
              <div>
                <Label className="text-base font-semibold text-[#1A1A2E] mb-2 block">
                  Trial duration
                </Label>
                <div className="flex gap-3 items-start">
                  <Input
                    type="number"
                    min="1"
                    value={trialSettings.duration}
                    onChange={(e) =>
                      setTrialSettings({
                        ...trialSettings,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-12 w-24"
                  />
                  <Select
                    value={trialSettings.durationUnit}
                    onValueChange={(value: "days" | "weeks") =>
                      setTrialSettings({ ...trialSettings, durationUnit: value })
                    }
                  >
                    <SelectTrigger className="h-12 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">days</SelectItem>
                      <SelectItem value="weeks">weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-[#6B7280] mt-2">Recommended: 14-30 days</p>
              </div>

              {/* After Trial Ends */}
              <div>
                <Label className="text-base font-semibold text-[#1A1A2E] mb-3 block">
                  After trial ends:
                </Label>
                <RadioGroup
                  value={trialSettings.afterTrialAction}
                  onValueChange={(value: "auto-convert" | "manual-upgrade") =>
                    setTrialSettings({ ...trialSettings, afterTrialAction: value })
                  }
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="auto-convert" id="auto-convert" className="mt-1" />
                    <div>
                      <Label htmlFor="auto-convert" className="font-semibold text-[#1A1A2E]">
                        Auto-convert to paid subscription
                      </Label>
                      <p className="text-sm text-[#6B7280]">
                        Automatically charge after trial
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="manual-upgrade" id="manual-upgrade" className="mt-1" />
                    <div>
                      <Label htmlFor="manual-upgrade" className="font-semibold text-[#1A1A2E]">
                        Require manual upgrade
                      </Label>
                      <p className="text-sm text-[#6B7280]">
                        Vendor must manually select plan
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Trial Notifications */}
              <div>
                <Label className="text-base font-semibold text-[#1A1A2E] mb-3 block">
                  Trial notifications:
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="reminder-3-days"
                      checked={trialSettings.notifications.reminderBeforeEnd}
                      onCheckedChange={(checked) =>
                        setTrialSettings({
                          ...trialSettings,
                          notifications: {
                            ...trialSettings.notifications,
                            reminderBeforeEnd: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="reminder-3-days" className="text-sm text-[#1A1A2E]">
                      Send reminder 3 days before trial ends
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="require-payment"
                      checked={trialSettings.notifications.requirePaymentMethod}
                      onCheckedChange={(checked) =>
                        setTrialSettings({
                          ...trialSettings,
                          notifications: {
                            ...trialSettings.notifications,
                            requirePaymentMethod: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="require-payment" className="text-sm text-[#1A1A2E]">
                      Require payment method before trial starts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="welcome-email"
                      checked={trialSettings.notifications.sendWelcomeEmail}
                      onCheckedChange={(checked) =>
                        setTrialSettings({
                          ...trialSettings,
                          notifications: {
                            ...trialSettings.notifications,
                            sendWelcomeEmail: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="welcome-email" className="text-sm text-[#1A1A2E]">
                      Send trial welcome email
                    </Label>
                  </div>
                </div>
              </div>

              {/* When Trial Expires */}
              <div>
                <Label className="text-base font-semibold text-[#1A1A2E] mb-3 block">
                  When trial expires (if no upgrade):
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="deactivate-listings"
                      checked={trialSettings.onExpiration.deactivateListings}
                      onCheckedChange={(checked) =>
                        setTrialSettings({
                          ...trialSettings,
                          onExpiration: {
                            ...trialSettings.onExpiration,
                            deactivateListings: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="deactivate-listings" className="text-sm text-[#1A1A2E]">
                      Deactivate all listings
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="block-new-listings"
                      checked={trialSettings.onExpiration.blockNewListings}
                      onCheckedChange={(checked) =>
                        setTrialSettings({
                          ...trialSettings,
                          onExpiration: {
                            ...trialSettings.onExpiration,
                            blockNewListings: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="block-new-listings" className="text-sm text-[#1A1A2E]">
                      Block new listing creation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="send-expiration"
                      checked={trialSettings.onExpiration.sendNotification}
                      onCheckedChange={(checked) =>
                        setTrialSettings({
                          ...trialSettings,
                          onExpiration: {
                            ...trialSettings.onExpiration,
                            sendNotification: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="send-expiration" className="text-sm text-[#1A1A2E]">
                      Send expiration notification
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="suspend-account"
                      checked={trialSettings.onExpiration.suspendAccount}
                      onCheckedChange={(checked) =>
                        setTrialSettings({
                          ...trialSettings,
                          onExpiration: {
                            ...trialSettings.onExpiration,
                            suspendAccount: checked as boolean,
                          },
                        })
                      }
                    />
                    <Label htmlFor="suspend-account" className="text-sm text-[#1A1A2E]">
                      Suspend vendor account
                    </Label>
                  </div>
                </div>
              </div>

              {/* Grace Period */}
              <div>
                <Label className="text-base font-semibold text-[#1A1A2E] mb-2 block">
                  Grace period
                </Label>
                <div className="flex gap-3 items-center">
                  <Input
                    type="number"
                    min="0"
                    value={trialSettings.gracePeriodDays}
                    onChange={(e) =>
                      setTrialSettings({
                        ...trialSettings,
                        gracePeriodDays: parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-12 w-24"
                  />
                  <span className="text-sm text-[#6B7280]">days after trial expiration</span>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-[rgba(46,122,217,0.25)]">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saveStatus === "saving"}
                  className="h-12 px-8 bg-[#2E7AD9] hover:bg-[#1E5DB0]"
                >
                  {saveStatus === "saving" && "Saving..."}
                  {saveStatus === "saved" && "✓ Saved"}
                  {saveStatus === "idle" && "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
