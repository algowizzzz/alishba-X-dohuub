import { useEffect, useState } from "react";
import api from "../../../services/api";
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

export function VendorDashboard() {
  const navigate = useNavigate();
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

  const [stats, setStats] = useState({ earnings: 0, orders: 0, listings: 0 });
  const [recentOrders, setRecentOrders] = useState<Array<{
    id: string;
    orderNumber: string;
    storeName: string;
    customerName: string;
    total: number;
    date: string;
    time: string;
    status: "accepted" | "in-progress" | "completed";
  }>>([]);

  useEffect(() => {
    Promise.all([
      api.get<{ success: boolean; data: any }>("/api/v1/vendors/me/analytics").catch(() => null),
      api.get<{ success: boolean; data: any[] }>("/api/v1/vendors/listings").catch(() => null),
      api.get<{ success: boolean; data: any[] }>("/api/v1/vendors/me/bookings?limit=5").catch(() => null),
    ]).then(([analyticsRes, listingsRes, bookingsRes]) => {
      const analytics = (analyticsRes as any)?.data;
      const listings = (listingsRes as any)?.data;
      const bookings = (bookingsRes as any)?.data;
      if (analytics) {
        setStats({
          earnings: Number(analytics.totalRevenue || 0),
          orders: Number(analytics.totalBookings || 0),
          listings: listings?.length || 0,
        });
      } else if (listings) {
        setStats((s) => ({ ...s, listings: listings.length }));
      }
      if (bookings) {
        setRecentOrders(bookings.map((b: any) => ({
          id: b.id,
          orderNumber: `BK-${b.id.slice(-6).toUpperCase()}`,
          storeName: b.vendor?.businessName || "Your Store",
          customerName: b.user?.profile ? `${b.user.profile.firstName ?? ""} ${b.user.profile.lastName ?? ""}`.trim() || b.user.email : b.user?.email || "Customer",
          total: Number(b.total || 0),
          date: b.scheduledDate || b.createdAt,
          time: b.scheduledTime || "—",
          status: ((b.status || "ACCEPTED").toLowerCase().replace("_", "-")) as any,
        })));
      }
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-[#E8F1FC] text-[#1E5DB0]";
      case "in-progress":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "completed":
        return "bg-[#D1FAE5] text-[#065F46]";
      default:
        return "bg-[#F0F7FF] text-[#6B7280]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Welcome back, John! 👋
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Here's what's happening with your business today
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Earnings */}
            <div
              className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 relative overflow-hidden hover:-translate-y-[2px] transition-all shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
              style={{ boxShadow: "0 4px 12px rgba(46,122,217,0.18)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E7AD9]" />
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#2E7AD9] flex items-center justify-center shadow-[0_4px_12px_rgba(46,122,217,0.3)]">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-semibold">+12%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-[#1A1A2E]">
                  ${stats.earnings.toLocaleString()}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1">This month</p>
              </div>
            </div>

            {/* Total Orders */}
            <div
              className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 relative overflow-hidden hover:-translate-y-[2px] transition-all shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
              style={{ boxShadow: "0 4px 12px rgba(46,122,217,0.18)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E7AD9]" />
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#2E7AD9] flex items-center justify-center shadow-[0_4px_12px_rgba(46,122,217,0.3)]">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-semibold">+8%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-[#1A1A2E]">{stats.orders}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">This month</p>
              </div>
            </div>

            {/* Active Listings */}
            <div
              className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl p-6 relative overflow-hidden hover:-translate-y-[2px] transition-all shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
              style={{ boxShadow: "0 4px 12px rgba(46,122,217,0.18)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E7AD9]" />
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#2E7AD9] flex items-center justify-center shadow-[0_4px_12px_rgba(46,122,217,0.3)]">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="w-8 h-8"></div>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Active Listings</p>
                <p className="text-2xl font-bold text-[#1A1A2E]">{stats.listings}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">Across all stores</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}