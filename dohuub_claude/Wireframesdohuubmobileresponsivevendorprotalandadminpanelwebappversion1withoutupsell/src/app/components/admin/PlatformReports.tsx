import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../services/api";
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

export function PlatformReports() {
  // Sidebar state
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

  // Export handler
  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: "DoHuub",
      metrics: {
        totalRevenue: "$284,500",
        totalOrders: "1,847",
        totalVendors: "156",
        totalCustomers: "8,234",
      },
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `platform-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Schedule email report handler
  const handleScheduleEmailReport = () => {
    window.alert("Email report scheduling feature coming soon! You will be able to receive automated reports via email.");
  };

  const [dateRange, setDateRange] = useState("30days");
  const [kpis, setKpis] = useState<KPIMetric[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch platform reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const reportsData: any = await api.get('/reports/platform', { params: { dateRange } });

        // Map KPIs
        const mappedKPIs: KPIMetric[] = [
          {
            label: "Revenue",
            value: `$${(reportsData.revenue?.total || 0).toLocaleString()}`,
            change: reportsData.revenue?.changePercent || 0,
            icon: <DollarSign className="w-6 h-6" />,
            color: "bg-[#10B981]",
          },
          {
            label: "Bookings",
            value: (reportsData.bookings?.total || 0).toLocaleString(),
            change: reportsData.bookings?.changePercent || 0,
            icon: <ShoppingBag className="w-6 h-6" />,
            color: "bg-[#3B82F6]",
          },
          {
            label: "New Users",
            value: (reportsData.users?.new || 0).toLocaleString(),
            change: reportsData.users?.changePercent || 0,
            icon: <Users className="w-6 h-6" />,
            color: "bg-[#8B5CF6]",
          },
          {
            label: "Active Vendors",
            value: (reportsData.vendors?.active || 0).toLocaleString(),
            change: reportsData.vendors?.changePercent || 0,
            icon: <Store className="w-6 h-6" />,
            color: "bg-[#F59E0B]",
          },
        ];
        setKpis(mappedKPIs);

        // Map top performers
        const mappedPerformers: TopPerformer[] = [
          { 
            label: "Top Vendor", 
            value: reportsData.topVendor?.name || "N/A", 
            metric: `$${(reportsData.topVendor?.revenue || 0).toLocaleString()} revenue` 
          },
          { 
            label: "Top Service", 
            value: reportsData.topService?.name || "N/A", 
            metric: `${reportsData.topService?.bookings || 0} bookings` 
          },
          { 
            label: "Top Region", 
            value: reportsData.topRegion?.name || "N/A", 
            metric: `${reportsData.topRegion?.bookings || 0} bookings` 
          },
          { 
            label: "Top Customer", 
            value: reportsData.topCustomer?.name || "N/A", 
            metric: `$${(reportsData.topCustomer?.spent || 0).toLocaleString()} spent` 
          },
        ];
        setTopPerformers(mappedPerformers);

        // Map health metrics
        const mappedHealth = [
          { 
            label: "Customer Satisfaction", 
            value: `${reportsData.satisfaction?.average || 0}⭐ average`, 
            status: reportsData.satisfaction?.average >= 4.5 ? "good" : "warning" 
          },
          { 
            label: "Vendor Retention", 
            value: `${reportsData.vendorRetention || 0}%`, 
            status: reportsData.vendorRetention >= 90 ? "good" : "warning" 
          },
          { 
            label: "Booking Completion Rate", 
            value: `${reportsData.completionRate || 0}%`, 
            status: reportsData.completionRate >= 90 ? "good" : "warning" 
          },
          { 
            label: "Dispute Rate", 
            value: `${reportsData.disputeRate || 0}%`, 
            status: reportsData.disputeRate <= 5 ? "good" : "warning" 
          },
        ];
        setHealthMetrics(mappedHealth);
      } catch (err: any) {
        console.error("Failed to fetch platform reports:", err);
        setError(err.response?.data?.error || "Failed to load reports. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [dateRange]);

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

          {isLoading && (
            <div className="text-center py-12">
              <p className="text-[#6B7280]">Loading reports...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, index) => (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {topPerformers.map((performer, index) => (
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
              </div>

              {/* Platform Health */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">
                  Platform Health
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {metric.status === "good" ? (
                        <Star className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm text-[#6B7280] mb-1">{metric.label}:</p>
                        <p className="text-sm font-semibold text-[#1F2937]">{metric.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                    <span className="text-sm text-[#6B7280]">Total Revenue</span>
                    <span className="text-lg font-bold text-[#1F2937]">$45,234</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                    <span className="text-sm text-[#6B7280]">Platform Commission (15%)</span>
                    <span className="text-lg font-bold text-[#10B981]">$6,785</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                    <span className="text-sm text-[#6B7280]">Vendor Earnings</span>
                    <span className="text-lg font-bold text-[#1F2937]">$38,449</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-[#6B7280]">Refunds Issued</span>
                    <span className="text-lg font-bold text-[#DC2626]">-$1,234</span>
                  </div>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm text-[#6B7280] mb-2">Total Registered Users</p>
                  <p className="text-3xl font-bold text-[#1F2937]">8,743</p>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm text-[#6B7280] mb-2">Active Users (30 days)</p>
                  <p className="text-3xl font-bold text-[#10B981]">7,892</p>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm text-[#6B7280] mb-2">New Users (30 days)</p>
                  <p className="text-3xl font-bold text-[#3B82F6]">423</p>
                </div>
              </div>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm text-[#6B7280] mb-2">Total Vendors</p>
                  <p className="text-3xl font-bold text-[#1F2937]">1,245</p>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm text-[#6B7280] mb-2">Active Vendors</p>
                  <p className="text-3xl font-bold text-[#10B981]">245</p>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm text-[#6B7280] mb-2">Vendor Retention Rate</p>
                  <p className="text-3xl font-bold text-[#3B82F6]">92%</p>
                </div>
              </div>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm text-[#6B7280] mb-2">Total Bookings</p>
                  <p className="text-3xl font-bold text-[#1F2937]">12,456</p>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm text-[#6B7280] mb-2">Completion Rate</p>
                  <p className="text-3xl font-bold text-[#10B981]">94%</p>
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <p className="text-sm text-[#6B7280] mb-2">Avg. Booking Value</p>
                  <p className="text-3xl font-bold text-[#3B82F6]">$67</p>
                </div>
              </div>

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
          </>
          )}
      </main>
    </div>
  );
}