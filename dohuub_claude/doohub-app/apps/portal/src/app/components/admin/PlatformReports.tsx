import { useState } from "react";
import { Link } from "react-router-dom";
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

  const [dateRange, setDateRange] = useState("30days");

  // Mock KPI data
  const kpis: KPIMetric[] = [
    {
      label: "Revenue",
      value: "$45,234",
      change: 23,
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-[#10B981]",
    },
    {
      label: "Bookings",
      value: "678",
      change: 15,
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "bg-[#2E7AD9]",
    },
    {
      label: "New Users",
      value: "156",
      change: 8,
      icon: <Users className="w-6 h-6" />,
      color: "bg-[#8B5CF6]",
    },
    {
      label: "Active Vendors",
      value: "245",
      change: 12,
      icon: <Store className="w-6 h-6" />,
      color: "bg-[#F59E0B]",
    },
  ];

  const topPerformers: TopPerformer[] = [
    { label: "Top Vendor", value: "Sarah's Cleaning", metric: "$12,450 revenue" },
    { label: "Top Service", value: "Deep Cleaning", metric: "89 bookings" },
    { label: "Top Region", value: "New York, NY", metric: "234 bookings" },
    { label: "Top Customer", value: "John D.", metric: "$847 spent" },
  ];

  const healthMetrics = [
    { label: "Customer Satisfaction", value: "4.6⭐ average", status: "good" },
    { label: "Vendor Retention", value: "92%", status: "good" },
    { label: "Booking Completion Rate", value: "94%", status: "good" },
    { label: "Dispute Rate", value: "2.1%", status: "warning" },
  ];

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
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
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Reports & Analytics
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Platform-wide performance metrics and insights
            </p>
          </div>

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
                <Button variant="outline" className="w-full sm:w-auto">
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
                    className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow"
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
                    <p className="text-2xl font-bold text-[#1A1A2E]">{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                    Revenue Trend
                  </h3>
                  <div className="h-[250px] flex items-center justify-center bg-white rounded-lg border border-[rgba(46,122,217,0.25)] shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                    <p className="text-[#6B7280]">Line chart: Revenue over time</p>
                  </div>
                </div>

                {/* Booking Volume Chart */}
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                    Booking Volume by Category
                  </h3>
                  <div className="h-[250px] flex items-center justify-center bg-white rounded-lg border border-[rgba(46,122,217,0.25)] shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                    <p className="text-[#6B7280]">Bar chart: Bookings by category</p>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                  Top Performers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-[#6B7280] mb-1">{performer.label}:</p>
                        <p className="text-sm font-semibold text-[#1A1A2E] mb-0.5">
                          {performer.value}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{performer.metric}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Health */}
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
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
                        <p className="text-sm font-semibold text-[#1A1A2E]">{metric.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Export Full Report
                </Button>
                <Button variant="outline">Schedule Email Report</Button>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                  Revenue Analytics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[rgba(46,122,217,0.25)]">
                    <span className="text-sm text-[#6B7280]">Total Revenue</span>
                    <span className="text-lg font-bold text-[#1A1A2E]">$45,234</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[rgba(46,122,217,0.25)]">
                    <span className="text-sm text-[#6B7280]">Platform Commission (15%)</span>
                    <span className="text-lg font-bold text-[#10B981]">$6,785</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[rgba(46,122,217,0.25)]">
                    <span className="text-sm text-[#6B7280]">Vendor Earnings</span>
                    <span className="text-lg font-bold text-[#1A1A2E]">$38,449</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-[#6B7280]">Refunds Issued</span>
                    <span className="text-lg font-bold text-[#DC2626]">-$1,234</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                  Revenue by Category
                </h3>
                <div className="h-[300px] flex items-center justify-center bg-white rounded-lg border border-[rgba(46,122,217,0.25)] shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-[#6B7280]">Pie chart: Revenue breakdown by category</p>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-sm text-[#6B7280] mb-2">Total Registered Users</p>
                  <p className="text-3xl font-bold text-[#1A1A2E]">8,743</p>
                </div>
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-sm text-[#6B7280] mb-2">Active Users (30 days)</p>
                  <p className="text-3xl font-bold text-[#10B981]">7,892</p>
                </div>
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-sm text-[#6B7280] mb-2">New Users (30 days)</p>
                  <p className="text-3xl font-bold text-[#2E7AD9]">423</p>
                </div>
              </div>

              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                  User Acquisition Trend
                </h3>
                <div className="h-[300px] flex items-center justify-center bg-white rounded-lg border border-[rgba(46,122,217,0.25)] shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-[#6B7280]">Line chart: New users over time</p>
                </div>
              </div>
            </TabsContent>

            {/* Vendors Tab */}
            <TabsContent value="vendors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-sm text-[#6B7280] mb-2">Total Vendors</p>
                  <p className="text-3xl font-bold text-[#1A1A2E]">1,245</p>
                </div>
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-sm text-[#6B7280] mb-2">Active Vendors</p>
                  <p className="text-3xl font-bold text-[#10B981]">245</p>
                </div>
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-sm text-[#6B7280] mb-2">Vendor Retention Rate</p>
                  <p className="text-3xl font-bold text-[#2E7AD9]">92%</p>
                </div>
              </div>

              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                  Vendor Performance Distribution
                </h3>
                <div className="h-[300px] flex items-center justify-center bg-white rounded-lg border border-[rgba(46,122,217,0.25)] shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-[#6B7280]">Bar chart: Vendors by performance tier</p>
                </div>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-sm text-[#6B7280] mb-2">Total Bookings</p>
                  <p className="text-3xl font-bold text-[#1A1A2E]">12,456</p>
                </div>
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-sm text-[#6B7280] mb-2">Completion Rate</p>
                  <p className="text-3xl font-bold text-[#10B981]">94%</p>
                </div>
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-sm text-[#6B7280] mb-2">Avg. Booking Value</p>
                  <p className="text-3xl font-bold text-[#2E7AD9]">$67</p>
                </div>
              </div>

              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                  Booking Trends
                </h3>
                <div className="h-[300px] flex items-center justify-center bg-white rounded-lg border border-[rgba(46,122,217,0.25)] shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <p className="text-[#6B7280]">Line chart: Bookings over time</p>
                </div>
              </div>
            </TabsContent>

            {/* Custom Tab */}
            <TabsContent value="custom" className="space-y-6">
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                  Custom Report Builder
                </h3>
                <p className="text-sm text-[#6B7280] mb-6">
                  Create custom reports by selecting metrics, filters, and date ranges
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#1A1A2E] mb-2 block">
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
                    <label className="text-sm font-medium text-[#1A1A2E] mb-2 block">
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