import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Plus,
  Eye,
  User,
  TrendingUp,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../../services/api";

interface DashboardStats {
  earnings: number;
  orders: number;
  listings: number;
  earningsGrowth: number | null;
  ordersGrowth: number;
}

interface RecentBooking {
  id: string;
  orderNumber: string;
  storeName: string;
  customerName: string;
  total: number;
  date: string;
  time: string;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export function VendorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );

  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentBooking[]>([]);

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Fetch dashboard data from API
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: any = await api.getVendorDashboardStats();

      if (response.success && response.data) {
        const data = response.data;

        // Map API response to stats
        setStats({
          earnings: data.revenue?.thisMonth || 0,
          orders: (data.bookings?.thisMonth || 0) + (data.orders?.thisMonth || 0),
          listings: data.listings?.active || 0,
          earningsGrowth: data.revenue?.growth ? parseFloat(data.revenue.growth) : null,
          ordersGrowth: 0, // Could be calculated from comparison data
        });

        // Map recent activity to recent orders
        const recentActivity = [
          ...(data.recentActivity?.bookings || []),
          ...(data.recentActivity?.orders || []),
        ];

        const mappedOrders: RecentBooking[] = recentActivity.slice(0, 5).map((item: any) => ({
          id: item.id,
          orderNumber: `ORD-${item.id.slice(-6).toUpperCase()}`,
          storeName: item.category || "Service",
          customerName: item.user?.profile?.firstName
            ? `${item.user.profile.firstName} ${item.user.profile.lastName || ""}`.trim()
            : item.user?.email?.split("@")[0] || "Customer",
          total: Number(item.total) || 0,
          date: new Date(item.createdAt).toISOString().split("T")[0],
          time: new Date(item.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          status: item.status || "PENDING",
        }));

        setRecentOrders(mappedOrders);
      }
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-[#DBEAFE] text-[#1E40AF]";
      case "IN_PROGRESS":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "COMPLETED":
        return "bg-[#D1FAE5] text-[#065F46]";
      case "PENDING":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "CANCELLED":
        return "bg-[#FEE2E2] text-[#991B1B]";
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
      case "PENDING":
        return "Pending";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  // Get vendor name from auth context
  const vendorName = user?.profile?.firstName || user?.name?.split(" ")[0] || "Vendor";

  return (
    <div className="min-h-screen bg-white">
      <VendorTopNav onMenuClick={handleSidebarToggle} vendorName={vendorName} />
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
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Notice</p>
                <p className="text-sm text-amber-700">{error}</p>
              </div>
              <button
                className="text-amber-500 hover:text-amber-700"
                onClick={() => setError(null)}
              >
                ✕
              </button>
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Welcome back, {vendorName}!
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Here's what's happening with your business today
            </p>
          </div>

          {/* Stats Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F3F4F6]" />
                    <div className="w-16 h-6 rounded-lg bg-[#F3F4F6]" />
                  </div>
                  <div>
                    <div className="w-24 h-4 bg-[#F3F4F6] rounded mb-2" />
                    <div className="w-32 h-8 bg-[#F3F4F6] rounded mb-2" />
                    <div className="w-20 h-3 bg-[#F3F4F6] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error && !stats ? (
            <div className="text-center py-12 bg-white border border-[#E5E7EB] rounded-2xl mb-8">
              <AlertCircle className="w-12 h-12 text-[#DC2626] mx-auto mb-3" />
              <p className="text-[#6B7280]">Failed to load dashboard data</p>
              <Button onClick={fetchDashboardData} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Earnings */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#065F46]" />
                  </div>
                  {stats.earningsGrowth !== null && (
                    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                      stats.earningsGrowth >= 0
                        ? "text-[#059669] bg-[#D1FAE5]"
                        : "text-[#DC2626] bg-[#FEE2E2]"
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${stats.earningsGrowth < 0 ? "rotate-180" : ""}`} />
                      <span className="font-semibold">
                        {stats.earningsGrowth >= 0 ? "+" : ""}{stats.earningsGrowth}%
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-[#1F2937]">
                    ${stats.earnings.toLocaleString()}
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
                  {stats.ordersGrowth !== 0 && (
                    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                      stats.ordersGrowth >= 0
                        ? "text-[#1E40AF] bg-[#DBEAFE]"
                        : "text-[#DC2626] bg-[#FEE2E2]"
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${stats.ordersGrowth < 0 ? "rotate-180" : ""}`} />
                      <span className="font-semibold">
                        {stats.ordersGrowth >= 0 ? "+" : ""}{stats.ordersGrowth}%
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-[#1F2937]">{stats.orders}</p>
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
                  <p className="text-2xl font-bold text-[#1F2937]">{stats.listings}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">Across all stores</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}