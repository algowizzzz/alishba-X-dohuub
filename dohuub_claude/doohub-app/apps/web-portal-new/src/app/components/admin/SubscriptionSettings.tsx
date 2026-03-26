import { useState } from "react";
import { ArrowLeft, Trophy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  const handleSaveSettings = () => {
    setSaveStatus("saving");
    // Simulate API call
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Subscription Plans & Trial Configuration
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage trial settings for vendor subscriptions
            </p>
          </div>

          {/* Available Plans (Read-Only) */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-[#1F2937] mb-6">
              Available Plans (Read-Only)
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Platform Subscription Plans
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {/* Trial Plan */}
              <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-lg font-bold text-[#1F2937] mb-3">Trial (Free)</h3>
                <ul className="space-y-2 text-sm text-[#4B5563]">
                  <li>• Duration: Configurable (see settings below)</li>
                  <li>• Price: $0</li>
                  <li>• Full access to all features</li>
                  <li>• Payment method required</li>
                </ul>
              </div>

              {/* Monthly Plan */}
              <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-lg font-bold text-[#1F2937] mb-3">
                  Monthly Subscription
                </h3>
                <ul className="space-y-2 text-sm text-[#4B5563]">
                  <li>• Price: $49.00/month</li>
                  <li>• Billed monthly</li>
                  <li>• All features included</li>
                  <li>• Cancel anytime</li>
                </ul>
              </div>

              {/* Yearly Plan */}
              <div className="bg-[#F0FDF4] border-2 border-[#10B981] rounded-xl p-5 relative">
                <div className="absolute -top-3 right-4 bg-[#10B981] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  RECOMMENDED
                </div>
                <h3 className="text-lg font-bold text-[#1F2937] mb-3">
                  Yearly Subscription
                </h3>
                <ul className="space-y-2 text-sm text-[#4B5563]">
                  <li>• Price: $39.00/month</li>
                  <li>• Billed $468 annually</li>
                  <li>• Save $120 (20%) compared to monthly</li>
                  <li>• All features included</li>
                </ul>
              </div>
            </div>

            {/* All Plans Include */}
            <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-5">
              <h3 className="text-base font-bold text-[#1F2937] mb-3">All Plans Include:</h3>
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
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1F2937] mb-6">
              Trial Period Configuration
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">Free Trial Settings</p>

            <div className="space-y-6">
              {/* Enable Trial Toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <Label htmlFor="enable-trial" className="text-base font-semibold text-[#1F2937]">
                  Enable free trial
                </Label>
                <button
                  id="enable-trial"
                  onClick={() =>
                    setTrialSettings({ ...trialSettings, enabled: !trialSettings.enabled })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    trialSettings.enabled ? "bg-[#10B981]" : "bg-[#E5E7EB]"
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
                <Label className="text-base font-semibold text-[#1F2937] mb-2 block">
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
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
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
                      <Label htmlFor="auto-convert" className="font-semibold text-[#1F2937]">
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
                      <Label htmlFor="manual-upgrade" className="font-semibold text-[#1F2937]">
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
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
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
                    <Label htmlFor="reminder-3-days" className="text-sm text-[#1F2937]">
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
                    <Label htmlFor="require-payment" className="text-sm text-[#1F2937]">
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
                    <Label htmlFor="welcome-email" className="text-sm text-[#1F2937]">
                      Send trial welcome email
                    </Label>
                  </div>
                </div>
              </div>

              {/* When Trial Expires */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-3 block">
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
                    <Label htmlFor="deactivate-listings" className="text-sm text-[#1F2937]">
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
                    <Label htmlFor="block-new-listings" className="text-sm text-[#1F2937]">
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
                    <Label htmlFor="send-expiration" className="text-sm text-[#1F2937]">
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
                    <Label htmlFor="suspend-account" className="text-sm text-[#1F2937]">
                      Suspend vendor account
                    </Label>
                  </div>
                </div>
              </div>

              {/* Grace Period */}
              <div>
                <Label className="text-base font-semibold text-[#1F2937] mb-2 block">
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
              <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saveStatus === "saving"}
                  className="h-12 px-8 bg-[#1F2937] hover:bg-[#111827]"
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
