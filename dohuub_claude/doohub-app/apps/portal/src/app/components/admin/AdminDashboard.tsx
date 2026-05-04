import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Users, Store, DollarSign, ShoppingBag, UserPlus, type LucideIcon } from "lucide-react";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import api from "../../../services/api";

type Kpi = { value: number; change: number; trend?: 'up' | 'down' };
type PlatformReport = {
  kpis: {
    revenue: Kpi;
    bookings: Kpi;
    newUsers: Kpi;
    activeVendors: Kpi;
  };
};

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
}

function MetricCard({ label, value, change, isPositive, icon: Icon }: MetricCardProps) {
  return (
    <div
      className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 h-[140px] flex flex-col justify-between hover:-translate-y-[2px] transition-all cursor-pointer relative overflow-hidden shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
      style={{ boxShadow: "0 4px 12px rgba(46,122,217,0.18)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E7AD9]" />
      <div className="flex items-start justify-between">
        <p className="text-sm text-[#6B7280]">{label}</p>
        <div className="w-10 h-10 rounded-xl bg-[#2E7AD9] flex items-center justify-center shadow-[0_4px_12px_rgba(46,122,217,0.3)]">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-[#1A1A2E] mb-1">{value}</p>
        {change && (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 text-[#10B981]" />
            ) : (
              <TrendingDown className="w-3 h-3 text-[#DC2626]" />
            )}
            <span className={`text-[13px] ${isPositive ? "text-[#10B981]" : "text-[#DC2626]"}`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const [report, setReport] = useState<PlatformReport | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; data: PlatformReport }>("/api/v1/admin/reports/platform?dateRange=30days")
      .then((r) => setReport(r.data))
      .catch(() => setReport(null));
  }, []);

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const formatChange = (n: number) => {
    if (n === 0) return "No change from last period";
    const sign = n > 0 ? "+" : "";
    return `${sign}${n}% from last period`;
  };
  const fmt = (n: number) => n.toLocaleString();
  const fmtMoney = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="dashboard"
      />

      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="w-full max-w-[1600px]">
          <h1 className="text-2xl sm:text-[32px] font-bold text-[#1A1A2E] mb-6 sm:mb-8">
            Dashboard Overview
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <MetricCard
              label="New Users"
              value={report ? fmt(report.kpis.newUsers.value) : "—"}
              change={report ? formatChange(report.kpis.newUsers.change) : undefined}
              isPositive={!report || report.kpis.newUsers.change >= 0}
              icon={Users}
            />
            <MetricCard
              label="Active Vendors"
              value={report ? fmt(report.kpis.activeVendors.value) : "—"}
              change={report ? formatChange(report.kpis.activeVendors.change) : undefined}
              isPositive={!report || report.kpis.activeVendors.change >= 0}
              icon={Store}
            />
            <MetricCard
              label="Revenue (This Month)"
              value={report ? fmtMoney(report.kpis.revenue.value) : "—"}
              change={report ? formatChange(report.kpis.revenue.change) : undefined}
              isPositive={!report || report.kpis.revenue.change >= 0}
              icon={DollarSign}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              label="Total Bookings"
              value={report ? fmt(report.kpis.bookings.value) : "—"}
              change={report ? formatChange(report.kpis.bookings.change) : undefined}
              isPositive={!report || report.kpis.bookings.change >= 0}
              icon={ShoppingBag}
            />
            <MetricCard
              label="New Vendors"
              value={report ? fmt(report.kpis.activeVendors.value) : "—"}
              icon={UserPlus}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
