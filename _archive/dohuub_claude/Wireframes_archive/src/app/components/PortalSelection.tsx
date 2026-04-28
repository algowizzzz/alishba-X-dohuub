import { Building2, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export function PortalSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center p-4">
      <div className="max-w-[1000px] w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F2937] mb-4">
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
            className="group bg-white border-2 border-[#E5E7EB] rounded-2xl p-8 sm:p-10 hover:border-[#1F2937] hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-6 group-hover:bg-[#1F2937] transition-colors duration-300">
              <Building2 className="w-8 h-8 text-[#1F2937] group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-3">
              Admin Portal
            </h2>
            <p className="text-[#6B7280] mb-6">
              Manage platform settings, monitor vendors, handle reports, and oversee all DoHuub operations.
            </p>
            <div className="inline-flex items-center text-[#1F2937] font-semibold group-hover:gap-2 transition-all duration-300">
              Continue to Admin Portal
              <span className="inline-block ml-2 group-hover:ml-0 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </div>
          </button>

          {/* Vendor Portal Card */}
          <button
            onClick={() => navigate("/vendor/login")}
            className="group bg-white border-2 border-[#E5E7EB] rounded-2xl p-8 sm:p-10 hover:border-[#1F2937] hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mb-6 group-hover:bg-[#1F2937] transition-colors duration-300">
              <Store className="w-8 h-8 text-[#1F2937] group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937] mb-3">
              Vendor Portal
            </h2>
            <p className="text-[#6B7280] mb-6">
              Manage your services, track orders, view earnings, and grow your business on DoHuub.
            </p>
            <div className="inline-flex items-center text-[#1F2937] font-semibold group-hover:gap-2 transition-all duration-300">
              Continue to Vendor Portal
              <span className="inline-block ml-2 group-hover:ml-0 group-hover:translate-x-1 transition-transform duration-300">
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
              className="text-[#1F2937] hover:underline font-medium"
            >
              DeepLearnHQ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}