import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

interface AdminTopNavProps {
  onMenuClick: () => void;
}

export function AdminTopNav({ onMenuClick }: AdminTopNavProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-[rgba(46,122,217,0.25)] z-50 shadow-[0_4px_16px_rgba(46,122,217,0.20)]">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Left Section: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F0F7FF] transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-[#6B7280]" />
          </button>
          <Link to="/admin/dashboard" className="flex items-center gap-2 lg:gap-3">
            <img
              src="/dohuub-logo.png"
              alt="DoHuub"
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl shadow-[0_4px_12px_rgba(46,122,217,0.25)]"
            />
            <span className="text-base lg:text-lg font-semibold text-[#1A1A2E] hidden sm:inline">
              DoHuub Admin
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Profile Display */}
          <div className="flex items-center gap-2 px-2 lg:px-4 py-2">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#2E7AD9] text-white flex items-center justify-center font-semibold text-sm">
              MW
            </div>
            <span className="text-sm text-[#1A1A2E] hidden md:inline">Michelle W.</span>
          </div>
        </div>
      </div>
    </div>
  );
}