import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, ChevronDown, Lock } from "lucide-react";
import { supabase } from "../../../lib/supabase";

interface AdminTopNavProps {
  onMenuClick?: () => void;
}

export function AdminTopNav({ onMenuClick = () => {} }: AdminTopNavProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      if (!u) return;
      setEmail(u.email || "");
      const meta = u.user_metadata || {};
      const first = meta.firstName || meta.first_name || "";
      const last = meta.lastName || meta.last_name || "";
      const full = `${first} ${last}`.trim();
      setName(full || u.email?.split("@")[0] || "Admin");
    })();
  }, []);

  const initials = (name || email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join("") || "A";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-[72px] bg-white border-b border-[rgba(46,122,217,0.25)] z-50 shadow-[0_4px_16px_rgba(46,122,217,0.20)]">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
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

        <div className="flex items-center gap-2 lg:gap-4 relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-2 lg:px-4 py-2 rounded-lg hover:bg-[#F0F7FF] transition-colors"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#2E7AD9] text-white flex items-center justify-center font-semibold text-sm">
              {initials}
            </div>
            <span className="text-sm text-[#1A1A2E] hidden md:inline">{name || "Admin"}</span>
            <ChevronDown className="w-4 h-4 text-[#6B7280] hidden md:inline" />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[rgba(46,122,217,0.25)] rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[rgba(46,122,217,0.25)]">
                  <p className="text-sm font-semibold text-[#1A1A2E] truncate">{name || "Admin"}</p>
                  <p className="text-xs text-[#6B7280] truncate">{email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/admin/account/password");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F0F7FF] transition-colors text-left"
                  >
                    <Lock className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-sm text-[#1A1A2E]">Change Password</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FEE2E2] transition-colors text-left group"
                  >
                    <LogOut className="w-4 h-4 text-[#6B7280] group-hover:text-[#DC2626]" />
                    <span className="text-sm text-[#1A1A2E] group-hover:text-[#DC2626]">Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
