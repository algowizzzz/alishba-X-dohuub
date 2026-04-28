import { Building2, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PortalSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4">
      <div className="max-w-[1000px] w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="/dohuub-logo.png"
            alt="DoHuub"
            className="w-20 h-20 rounded-3xl mb-6 shadow-[0_8px_24px_rgba(46,122,217,0.3)] mx-auto"
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A2E] mb-3">
            Welcome to DoHuub
          </h1>
          <p className="text-lg text-[#6B7280]">
            Select your portal to continue
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Admin Portal Card */}
          <button
            onClick={() => navigate("/admin/login")}
            className="group bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-8 sm:p-10 hover:border-[#2E7AD9] hover:shadow-[0_12px_32px_rgba(46,122,217,0.18)] transition-all duration-300 text-left"
          >
            <div className="w-16 h-16 rounded-2xl bg-[rgba(46,122,217,0.1)] flex items-center justify-center mb-6 group-hover:bg-[#2E7AD9] transition-colors duration-300">
              <Building2 className="w-8 h-8 text-[#2E7AD9] group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">
              Admin Portal
            </h2>
            <p className="text-[#6B7280] mb-6">
              Manage platform settings, monitor vendors, handle reports, and oversee all DoHuub operations.
            </p>
            <div className="inline-flex items-center text-[#2E7AD9] font-semibold transition-all duration-300">
              Continue to Admin Portal
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </div>
          </button>

          {/* Vendor Portal Card */}
          <button
            onClick={() => navigate("/vendor/login")}
            className="group bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-8 sm:p-10 hover:border-[#2E7AD9] hover:shadow-[0_12px_32px_rgba(46,122,217,0.18)] transition-all duration-300 text-left"
          >
            <div className="w-16 h-16 rounded-2xl bg-[rgba(46,122,217,0.1)] flex items-center justify-center mb-6 group-hover:bg-[#2E7AD9] transition-colors duration-300">
              <Store className="w-8 h-8 text-[#2E7AD9] group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">
              Vendor Portal
            </h2>
            <p className="text-[#6B7280] mb-6">
              Manage your services, track orders, view earnings, and grow your business on DoHuub.
            </p>
            <div className="inline-flex items-center text-[#2E7AD9] font-semibold transition-all duration-300">
              Continue to Vendor Portal
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-[#9CA3AF]">
            Made by{" "}
            <a
              href="https://deeplearnhq.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2E7AD9] hover:underline font-medium"
            >
              DeepLearnHQ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
