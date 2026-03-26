import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import { api } from "../../../services/api";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  isLoading?: boolean;
}

interface DashboardStats {
  totalUsers: number;
  userGrowth: number;
  activeVendors: number;
  vendorGrowth: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  activeOrdersToday: number;
  newVendorsThisWeek: number;
}

function MetricCard({ label, value, change, isPositive, isLoading }: MetricCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 h-[140px] flex flex-col justify-between hover:translate-y-[-2px] transition-transform cursor-pointer">
      <p className="text-sm text-[#6B7280] mb-2">{label}</p>
      <div>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" />
            <span className="text-[#6B7280]">Loading...</span>
          </div>
        ) : (
          <>
            <p className="text-4xl font-bold text-[#1F2937] mb-1">{value}</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-3 h-3 text-[#10B981]" />
              ) : (
                <TrendingDown className="w-3 h-3 text-[#DC2626]" />
              )}
              <span className={`text-[13px] ${isPositive ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                {change}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? false : true
  );

  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: any = await api.get('/stats/admin/dashboard');
      const data = response?.data || response;
      setStats({
        totalUsers: data.totalUsers || data.users?.total || 0,
        userGrowth: data.userGrowth || data.users?.growth || 0,
        activeVendors: data.activeVendors || data.vendors?.active || 0,
        vendorGrowth: data.vendorGrowth || data.vendors?.growth || 0,
        monthlyRevenue: data.monthlyRevenue || data.revenue?.monthly || 0,
        revenueGrowth: data.revenueGrowth || data.revenue?.growth || 0,
        activeOrdersToday: data.activeOrdersToday || data.orders?.today || 0,
        newVendorsThisWeek: data.newVendorsThisWeek || data.vendors?.newThisWeek || 0,
      });
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats:', err);
      setError(err?.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString()}`;
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth}% from last month`;
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="dashboard"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
        `}
      >
        <div className="w-full max-w-[1600px]">
          <h1 className="text-2xl sm:text-[32px] font-bold text-[#1F2937] mb-6 sm:mb-8">Dashboard Overview</h1>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B] flex items-center justify-between">
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={fetchDashboardStats}
                className="ml-4 px-3 py-1 text-sm border border-[#DC2626] rounded hover:bg-[#FEE2E2]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Primary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <MetricCard
              label="Total Users"
              value={stats ? formatNumber(stats.totalUsers) : '—'}
              change={stats ? formatGrowth(stats.userGrowth) : '—'}
              isPositive={stats ? stats.userGrowth >= 0 : true}
              isLoading={isLoading}
            />
            <MetricCard
              label="Active Vendors"
              value={stats ? formatNumber(stats.activeVendors) : '—'}
              change={stats ? formatGrowth(stats.vendorGrowth) : '—'}
              isPositive={stats ? stats.vendorGrowth >= 0 : true}
              isLoading={isLoading}
            />
            <MetricCard
              label="Revenue (This Month)"
              value={stats ? formatCurrency(stats.monthlyRevenue) : '—'}
              change={stats ? formatGrowth(stats.revenueGrowth) : '—'}
              isPositive={stats ? stats.revenueGrowth >= 0 : true}
              isLoading={isLoading}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 h-[120px]">
              <p className="text-sm text-[#6B7280] mb-2">Active Orders Today</p>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#6B7280] animate-spin" />
                  <span className="text-[#6B7280]">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-[#1F2937]">
                  {stats ? formatNumber(stats.activeOrdersToday) : '—'}
                </p>
              )}
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 h-[120px]">
              <p className="text-sm text-[#6B7280] mb-2">New Vendors This Week</p>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#6B7280] animate-spin" />
                  <span className="text-[#6B7280]">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-[#1F2937]">
                  {stats ? formatNumber(stats.newVendorsThisWeek) : '—'}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
