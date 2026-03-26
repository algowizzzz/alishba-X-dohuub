import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Plus,
  Eye,
  User,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";

interface VendorDashboardStats {
  earnings?: {
    total?: number;
    thisMonth?: number;
    trend?: number;
  };
  orders?: {
    total?: number;
    thisMonth?: number;
  };
  listings?: {
    total?: number;
    active?: number;
  };
  recentActivity?: {
    orders?: any[];
  };
}

export function VendorDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [stats, setStats] = useState<VendorDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: any = await api.getVendorDashboardStats();
        setStats(data?.data || data);
      } catch (err: any) {
        console.error('Failed to fetch vendor dashboard stats:', err);
        setError(err.response?.data?.error || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-[#DBEAFE] text-[#1E40AF]";
      case "IN_PROGRESS":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "COMPLETED":
        return "bg-[#D1FAE5] text-[#065F46]";
      default:
        return "bg-[#F3F4F6] text-[#6B7280]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "Accepted";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <VendorTopNav onMenuClick={handleSidebarToggle} vendorName="John Smith" />
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
        activeMenu="overview"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Here's what's happening with your business today
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-[#6B7280]">Loading dashboard statistics...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {!loading && !error && stats && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Earnings */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-[#065F46]" />
                    </div>
                    {stats.earnings?.trend && (
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                        stats.earnings.trend > 0 
                          ? 'text-[#059669] bg-[#D1FAE5]' 
                          : 'text-[#DC2626] bg-[#FEE2E2]'
                      }`}>
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-semibold">
                          {stats.earnings.trend > 0 ? '+' : ''}{stats.earnings.trend}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-[#1F2937]">
                      ${(stats.earnings?.total || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-1">This month</p>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-[#1E40AF]" />
                    </div>
                    <div className="w-8 h-8"></div>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-[#1F2937]">
                      {stats.orders?.total || 0}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-1">This month</p>
                  </div>
                </div>

                {/* Active Listings */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                      <Package className="w-6 h-6 text-[#92400E]" />
                    </div>
                    <div className="w-8 h-8"></div>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Active Listings</p>
                    <p className="text-2xl font-bold text-[#1F2937]">
                      {stats.listings?.active || 0}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Across all stores</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}