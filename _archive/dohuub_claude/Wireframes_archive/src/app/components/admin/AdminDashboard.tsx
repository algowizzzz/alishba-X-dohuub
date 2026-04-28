import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import { api } from "../../../services/api";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function MetricCard({ label, value, change, isPositive }: MetricCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 h-[140px] flex flex-col justify-between hover:translate-y-[-2px] transition-transform cursor-pointer">
      <p className="text-sm text-[#6B7280] mb-2">{label}</p>
      <div>
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
      </div>
    </div>
  );
}

interface DashboardStats {
  users?: {
    total?: number;
    newThisMonth?: number;
    active?: number;
    newToday?: number;
    newThisWeek?: number;
  };
  vendors?: {
    total?: number;
    approved?: number;
    newThisMonth?: number;
  };
  revenue?: {
    thisMonth?: number;
    lastMonth?: number;
    growth?: string | null;
  };
  orders?: {
    today?: number;
  };
}

export function AdminDashboard() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? false : true
  );
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
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
        const data: any = await api.getAdminDashboardStats();
        setStats(data?.data || data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err);
        setError(err.response?.data?.error || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
              {/* Primary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <MetricCard
                  label="Total Users"
                  value={stats.users?.total?.toLocaleString() || "0"}
                  change={
                    stats.users?.newThisMonth
                      ? `+${stats.users.newThisMonth} from last month`
                      : "No change"
                  }
                  isPositive={!!stats.users?.newThisMonth}
                />
                <MetricCard
                  label="Active Vendors"
                  value={stats.vendors?.approved?.toLocaleString() || "0"}
                  change={
                    stats.vendors?.newThisMonth
                      ? `+${stats.vendors.newThisMonth} from last month`
                      : "No change"
                  }
                  isPositive={!!stats.vendors?.newThisMonth}
                />
                <MetricCard
                  label="Revenue (This Month)"
                  value={`$${stats.revenue?.thisMonth?.toLocaleString() || "0"}`}
                  change={
                    stats.revenue?.growth
                      ? `${stats.revenue.growth > 0 ? '+' : ''}${stats.revenue.growth}% from last month`
                      : "No change"
                  }
                  isPositive={!stats.revenue?.growth || parseFloat(stats.revenue.growth) > 0}
                />
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 h-[120px]">
                  <p className="text-sm text-[#6B7280] mb-2">Active Orders Today</p>
                  <p className="text-2xl font-bold text-[#1F2937]">
                    {stats.orders?.today?.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 h-[120px]">
                  <p className="text-sm text-[#6B7280] mb-2">New Vendors This Week</p>
                  <p className="text-2xl font-bold text-[#1F2937]">
                    {stats.vendors?.newThisMonth?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}