import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Download,
  Calendar,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import { api } from "../../../services/api";

interface KPIMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface TopPerformer {
  label: string;
  value: string;
  metric: string;
}

interface HealthMetric {
  label: string;
  value: string;
  status: "good" | "warning" | "critical";
}

interface RevenueData {
  totalRevenue: number;
  platformCommission: number;
  vendorEarnings: number;
  refundsIssued: number;
}

interface UsersData {
  totalRegistered: number;
  activeUsers: number;
  newUsers: number;
}

interface VendorsData {
  totalVendors: number;
  activeVendors: number;
  retentionRate: number;
}

interface BookingsData {
  totalBookings: number;
  completionRate: number;
  avgBookingValue: number;
}

interface PlatformReportsData {
  kpis: KPIMetric[];
  topPerformers: TopPerformer[];
  healthMetrics: HealthMetric[];
  revenue: RevenueData;
  users: UsersData;
  vendors: VendorsData;
  bookings: BookingsData;
}

export function PlatformReports() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );

  // Data state
  const [reportData, setReportData] = useState<PlatformReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("30days");

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Fetch report data
  const fetchReportData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const days = dateRange === "7days" ? 7 : dateRange === "30days" ? 30 : dateRange === "90days" ? 90 : 365;
      const response: any = await api.get(`/admin/reports/platform?days=${days}`);
      const data = response?.data || response;

      // Transform API response
      const kpis: KPIMetric[] = [
        {
          label: "Revenue",
          value: `$${(data.revenue?.total || data.kpis?.revenue || 0).toLocaleString()}`,
          change: data.revenue?.change || data.kpis?.revenueChange || 0,
          icon: <DollarSign className="w-6 h-6" />,
          color: "bg-[#10B981]",
        },
        {
          label: "Bookings",
          value: (data.bookings?.total || data.kpis?.bookings || 0).toLocaleString(),
          change: data.bookings?.change || data.kpis?.bookingsChange || 0,
          icon: <ShoppingBag className="w-6 h-6" />,
          color: "bg-[#3B82F6]",
        },
        {
          label: "New Users",
          value: (data.users?.new || data.kpis?.newUsers || 0).toLocaleString(),
          change: data.users?.change || data.kpis?.usersChange || 0,
          icon: <Users className="w-6 h-6" />,
          color: "bg-[#8B5CF6]",
        },
        {
          label: "Active Vendors",
          value: (data.vendors?.active || data.kpis?.activeVendors || 0).toLocaleString(),
          change: data.vendors?.change || data.kpis?.vendorsChange || 0,
          icon: <Store className="w-6 h-6" />,
          color: "bg-[#F59E0B]",
        },
      ];

      const topPerformers: TopPerformer[] = (data.topPerformers || []).map((p: any) => ({
        label: p.label || p.type,
        value: p.value || p.name,
        metric: p.metric || `${p.metricValue} ${p.metricLabel}`,
      }));

      const healthMetrics: HealthMetric[] = (data.healthMetrics || data.health || []).map((h: any) => ({
        label: h.label || h.name,
        value: h.value,
        status: h.status || "good",
      }));

      setReportData({
        kpis,
        topPerformers: topPerformers.length > 0 ? topPerformers : [
          { label: "Top Vendor", value: "—", metric: "No data" },
          { label: "Top Service", value: "—", metric: "No data" },
          { label: "Top Region", value: "—", metric: "No data" },
          { label: "Top Customer", value: "—", metric: "No data" },
        ],
        healthMetrics: healthMetrics.length > 0 ? healthMetrics : [
          { label: "Customer Satisfaction", value: "—", status: "good" as const },
          { label: "Vendor Retention", value: "—", status: "good" as const },
          { label: "Booking Completion Rate", value: "—", status: "good" as const },
          { label: "Dispute Rate", value: "—", status: "good" as const },
        ],
        revenue: {
          totalRevenue: data.revenue?.total || 0,
          platformCommission: data.revenue?.commission || 0,
          vendorEarnings: data.revenue?.vendorEarnings || 0,
          refundsIssued: data.revenue?.refunds || 0,
        },
        users: {
          totalRegistered: data.users?.total || 0,
          activeUsers: data.users?.active || 0,
          newUsers: data.users?.new || 0,
        },
        vendors: {
          totalVendors: data.vendors?.total || 0,
          activeVendors: data.vendors?.active || 0,
          retentionRate: data.vendors?.retentionRate || 0,
        },
        bookings: {
          totalBookings: data.bookings?.total || 0,
          completionRate: data.bookings?.completionRate || 0,
          avgBookingValue: data.bookings?.avgValue || 0,
        },
      });
    } catch (err: any) {
      console.error('Failed to fetch report data:', err);
      setError(err?.response?.data?.error || 'Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Export handler
  const handleExportReport = async () => {
    try {
      const response: any = await api.get('/admin/reports/platform/export');
      const blob = new Blob([JSON.stringify(response?.data || response, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `platform-report-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback to current data
      if (reportData) {
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `platform-report-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  // Schedule email report handler
  const handleScheduleEmailReport = () => {
    window.alert("Email report scheduling feature coming soon! You will be able to receive automated reports via email.");
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="reports"
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
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Reports & Analytics
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Platform-wide performance metrics and insights
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B] flex items-center justify-between">
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={fetchReportData}
                className="ml-4 px-3 py-1 text-sm border border-[#DC2626] rounded hover:bg-[#FEE2E2]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 overflow-x-auto w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Date Range Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <Calendar className="w-5 h-5 text-[#6B7280] hidden sm:block" />
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  <span className="sm:inline">Export Full Report</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </div>

              {/* KPI Cards */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {reportData?.kpis.map((kpi, index) => (
                    <div
                      key={index}
                      className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`${kpi.color} text-white p-2.5 rounded-lg`}>
                          {kpi.icon}
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            kpi.change >= 0
                              ? "bg-[#D1FAE5] text-[#065F46]"
                              : "bg-[#FEE2E2] text-[#991B1B]"
                          }`}
                        >
                          {kpi.change >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {Math.abs(kpi.change)}%
                        </div>
                      </div>
                      <p className="text-sm text-[#6B7280] mb-1">{kpi.label}</p>
                      <p className="text-2xl font-bold text-[#1F2937]">{kpi.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                    Revenue Trend
                  </h3>
                  <div className="h-[250px] flex items-center justify-center bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                    <p className="text-[#6B7280]">Line chart: Revenue over time</p>
                  </div>
                </div>

                {/* Booking Volume Chart */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                    Booking Volume by Category
                  </h3>
                  <div className="h-[250px] flex items-center justify-center bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                    <p className="text-[#6B7280]">Bar chart: Bookings by category</p>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Top Performers
                </h3>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reportData?.topPerformers.map((performer, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">{performer.label}:</p>
                          <p className="text-sm font-semibold text-[#1F2937] mb-0.5">
                            {performer.value}
                          </p>
                          <p className="text-xs text-[#9CA3AF]">{performer.metric}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform Health */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Platform Health
                </h3>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reportData?.healthMetrics.map((metric, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {metric.status === "good" ? (
                          <Star className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        ) : metric.status === "warning" ? (
                          <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">{metric.label}:</p>
                          <p className="text-sm font-semibold text-[#1F2937]">{metric.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleExportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Full Report
                </Button>
                <Button variant="outline" onClick={handleScheduleEmailReport}>Schedule Email Report</Button>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Revenue Analytics
                </h3>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#6B7280] animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-sm text-[#6B7280]">Total Revenue</span>
                      <span className="text-lg font-bold text-[#1F2937]">
                        ${reportData?.revenue.totalRevenue.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-sm text-[#6B7280]">Platform Commission (15%)</span>
                      <span className="text-lg font-bold text-[#10B981]">
                        ${reportData?.revenue.platformCommission.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-sm text-[#6B7280]">Vendor Earnings</span>
                      <span className="text-lg font-bold text-[#1F2937]">
                        ${reportData?.revenue.vendorEarnings.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-[#6B7280]">Refunds Issued</span>
                      <span className="text-lg font-bold text-[#DC2626]">
                        -${reportData?.revenue.refundsIssued.toLocaleString() || "0"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Revenue by Category
                </h3>
                <div className="h-[300px] flex items-center justify-center bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                  <p className="text-[#6B7280]">Pie chart: Revenue breakdown by category</p>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <p className="text-sm text-[#6B7280] mb-2">Total Registered Users</p>
                    <p className="text-3xl font-bold text-[#1F2937]">
                      {reportData?.users.totalRegistered.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <p className="text-sm text-[#6B7280] mb-2">Active Users (30 days)</p>
                    <p className="text-3xl font-bold text-[#10B981]">
                      {reportData?.users.activeUsers.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <p className="text-sm text-[#6B7280] mb-2">New Users (30 days)</p>
                    <p className="text-3xl font-bold text-[#3B82F6]">
                      {reportData?.users.newUsers.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  User Acquisition Trend
                </h3>
                <div className="h-[300px] flex items-center justify-center bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                  <p className="text-[#6B7280]">Line chart: New users over time</p>
                </div>
              </div>
            </TabsContent>

            {/* Vendors Tab */}
            <TabsContent value="vendors" className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <p className="text-sm text-[#6B7280] mb-2">Total Vendors</p>
                    <p className="text-3xl font-bold text-[#1F2937]">
                      {reportData?.vendors.totalVendors.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <p className="text-sm text-[#6B7280] mb-2">Active Vendors</p>
                    <p className="text-3xl font-bold text-[#10B981]">
                      {reportData?.vendors.activeVendors.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <p className="text-sm text-[#6B7280] mb-2">Vendor Retention Rate</p>
                    <p className="text-3xl font-bold text-[#3B82F6]">
                      {reportData?.vendors.retentionRate || 0}%
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Vendor Performance Distribution
                </h3>
                <div className="h-[300px] flex items-center justify-center bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                  <p className="text-[#6B7280]">Bar chart: Vendors by performance tier</p>
                </div>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <p className="text-sm text-[#6B7280] mb-2">Total Bookings</p>
                    <p className="text-3xl font-bold text-[#1F2937]">
                      {reportData?.bookings.totalBookings.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <p className="text-sm text-[#6B7280] mb-2">Completion Rate</p>
                    <p className="text-3xl font-bold text-[#10B981]">
                      {reportData?.bookings.completionRate || 0}%
                    </p>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <p className="text-sm text-[#6B7280] mb-2">Avg. Booking Value</p>
                    <p className="text-3xl font-bold text-[#3B82F6]">
                      ${reportData?.bookings.avgBookingValue || 0}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Booking Trends
                </h3>
                <div className="h-[300px] flex items-center justify-center bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
                  <p className="text-[#6B7280]">Line chart: Bookings over time</p>
                </div>
              </div>
            </TabsContent>

            {/* Custom Tab */}
            <TabsContent value="custom" className="space-y-6">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Custom Report Builder
                </h3>
                <p className="text-sm text-[#6B7280] mb-6">
                  Create custom reports by selecting metrics, filters, and date ranges
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#1F2937] mb-2 block">
                      Select Metrics
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        Revenue
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        Bookings
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        New Users
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        Active Vendors
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#1F2937] mb-2 block">
                      Date Range
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button>Generate Report</Button>
                    <Button variant="outline">Save Template</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
