import { Menu, User, ChevronDown, AlertTriangle, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useVendorSuspension } from "../../contexts/VendorSuspensionContext";
import api from "../../../services/api";

interface VendorTopNavProps {
  onMenuClick: () => void;
  vendorName?: string; // legacy prop, ignored
}

export function VendorTopNav({ onMenuClick }: VendorTopNavProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isSuspended, toggleSuspension } = useVendorSuspension();
  const [displayName, setDisplayName] = useState<string>("Vendor");

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ success: boolean; data: any }>("/api/v1/vendors/me")
      .then((r) => {
        if (cancelled) return;
        const v = (r as any)?.data;
        if (!v) return;
        const profile = v?.user?.profile;
        const first = profile?.firstName?.trim() || "";
        const last = profile?.lastName?.trim() || "";
        const fullName = `${first} ${last}`.trim();
        if (fullName) {
          setDisplayName(fullName);
        } else if (v?.businessName) {
          setDisplayName(v.businessName);
        } else if (v?.user?.email) {
          setDisplayName(v.user.email);
        } else if (v?.contactEmail) {
          setDisplayName(v.contactEmail);
        }
      })
      .catch(() => {
        // ignore — keep default
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-[rgba(46,122,217,0.25)] z-50">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-[#F0F7FF] transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-[#1A1A2E]" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/dohuub-logo.png"
              alt="DoHuub"
              className="w-10 h-10 rounded-lg shadow-[0_4px_12px_rgba(46,122,217,0.25)]"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-[#1A1A2E]">DoHuub</h1>
              <p className="text-xs text-[#6B7280]">Vendor Portal</p>
            </div>
          </div>
        </div>

        {/* Right Section - Vendor Info with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-white rounded-lg p-2 transition-colors"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-[#1A1A2E]">{displayName}</p>
              <p className="text-xs text-[#6B7280]">Vendor</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F0F7FF] flex items-center justify-center">
              <User className="w-5 h-5 text-[#6B7280]" />
            </div>
            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[rgba(46,122,217,0.25)] rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-2">
                  <button
                    onClick={() => {
                      toggleSuspension();
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white transition-colors text-left"
                  >
                    <AlertTriangle className={`w-4 h-4 ${isSuspended ? 'text-[#10B981]' : 'text-[#DC2626]'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {isSuspended ? 'End Suspension' : 'Simulate Suspension'}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {isSuspended ? 'Restore account access' : 'Test suspension mode'}
                      </p>
                    </div>
                  </button>
                </div>

                <div className="border-t border-[rgba(46,122,217,0.25)] p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white transition-colors text-left">
                    <Settings className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-sm text-[#1A1A2E]">Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FEE2E2] transition-colors text-left group">
                    <LogOut className="w-4 h-4 text-[#6B7280] group-hover:text-[#DC2626]" />
                    <span className="text-sm text-[#1A1A2E] group-hover:text-[#DC2626]">Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
