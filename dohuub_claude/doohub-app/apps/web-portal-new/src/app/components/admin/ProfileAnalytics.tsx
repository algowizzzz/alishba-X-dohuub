import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Star,
  Users,
  Repeat,
  BarChart3,
  Eye,
  Settings,
  Edit,
  ArrowUpDown,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import { api } from "../../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface MetricCardProps {
  label: string;
  value: string;
  trend: number;
  trendText: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

interface ProfilePerformance {
  id: string;
  name: string;
  category: string;
  revenue: number;
  revenueTrend: number;
  bookings: number;
  bookingsTrend: number;
  rating: number;
  customers: number;
  conversion: number;
  status: "active" | "inactive";
  icon: string;
}

interface RevenueDataPoint {
  date: string;
  revenue: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

interface TopServiceDataPoint {
  name: string;
  bookings: number;
  category: string;
}

interface AnalyticsData {
  keyMetrics: {
    totalRevenue: number;
    revenueTrend: number;
    totalBookings: number;
    bookingsTrend: number;
    averageRating: number;
    ratingTrend: number;
    activeCustomers: number;
    customersTrend: number;
    repeatCustomerRate: number;
    repeatTrend: number;
    conversionRate: number;
    conversionTrend: number;
  };
  revenueData: RevenueDataPoint[];
  categoryData: CategoryDataPoint[];
  topServicesData: TopServiceDataPoint[];
  profilesData: ProfilePerformance[];
}

interface ProfileOption {
  id: string;
  name: string;
}

function MetricCard({ label, value, trend, trendText, icon, isLoading }: MetricCardProps) {
  const isPositive = trend >= 0;
  const isNeutral = trend === 0;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs sm:text-[13px] text-[#6B7280] uppercase tracking-wide">
          {label}
        </p>
        {icon && <span className="text-xl sm:text-2xl opacity-50">{icon}</span>}
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 py-4">
          <Loader2 className="w-5 h-5 text-[#6B7280] animate-spin" />
          <span className="text-[#6B7280]">Loading...</span>
        </div>
      ) : (
        <>
          <p className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-2">
            {value}
          </p>
          <div className="flex items-center gap-1.5">
            {!isNeutral && (
              <>
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-[#DC2626]" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositive ? "text-[#10B981]" : "text-[#DC2626]"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {trend}%
                </span>
              </>
            )}
            <span className="text-xs sm:text-[13px] text-[#9CA3AF]">{trendText}</span>
          </div>
        </>
      )}
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "Cleaning": "#3B82F6",
  "Cleaning Services": "#3B82F6",
  "Handyman": "#10B981",
  "Handyman Services": "#10B981",
  "Beauty": "#F59E0B",
  "Beauty Services": "#F59E0B",
  "Rentals": "#EF4444",
  "Rental Properties": "#EF4444",
  "Caregiving": "#8B5CF6",
  "Caregiving Services": "#8B5CF6",
  "Transportation": "#EC4899",
  "Ride Assistance": "#EC4899",
  "Food": "#06B6D4",
  "Grocery": "#84CC16",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Cleaning Services": "🧹",
  "Handyman Services": "🔧",
  "Beauty Services": "💄",
  "Rental Properties": "🏠",
  "Caregiving Services": "👵",
  "Ride Assistance": "🚗",
  "Food": "🍲",
  "Grocery": "🛒",
};

export function ProfileAnalytics() {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );

  // Data state
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [profileOptions, setProfileOptions] = useState<ProfileOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [dateRange, setDateRange] = useState("30");
  const [profileFilter, setProfileFilter] = useState(profileId || "all");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Fetch profile options for the filter dropdown
  const fetchProfileOptions = useCallback(async () => {
    try {
      const response: any = await api.get('/admin/michelle-profiles');
      const profiles = Array.isArray(response) ? response : response?.data || [];
      setProfileOptions(profiles.map((p: any) => ({
        id: p.id,
        name: p.businessName || p.name || 'Unknown',
      })));
    } catch (err) {
      console.error('Failed to fetch profile options:', err);
    }
  }, []);

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = profileFilter === "all"
        ? `/admin/michelle-profiles/analytics?days=${dateRange}`
        : `/admin/michelle-profiles/${profileFilter}/analytics?days=${dateRange}`;

      const response: any = await api.get(endpoint);
      const data = response?.data || response;

      // Transform API response to component format
      setAnalyticsData({
        keyMetrics: {
          totalRevenue: data.totalRevenue || data.keyMetrics?.totalRevenue || 0,
          revenueTrend: data.revenueTrend || data.keyMetrics?.revenueTrend || 0,
          totalBookings: data.totalBookings || data.keyMetrics?.totalBookings || 0,
          bookingsTrend: data.bookingsTrend || data.keyMetrics?.bookingsTrend || 0,
          averageRating: data.averageRating || data.keyMetrics?.averageRating || 0,
          ratingTrend: data.ratingTrend || data.keyMetrics?.ratingTrend || 0,
          activeCustomers: data.activeCustomers || data.keyMetrics?.activeCustomers || 0,
          customersTrend: data.customersTrend || data.keyMetrics?.customersTrend || 0,
          repeatCustomerRate: data.repeatCustomerRate || data.keyMetrics?.repeatCustomerRate || 0,
          repeatTrend: data.repeatTrend || data.keyMetrics?.repeatTrend || 0,
          conversionRate: data.conversionRate || data.keyMetrics?.conversionRate || 0,
          conversionTrend: data.conversionTrend || data.keyMetrics?.conversionTrend || 0,
        },
        revenueData: (data.revenueData || data.revenueTrend || []).map((d: any) => ({
          date: d.date || d.label,
          revenue: d.revenue || d.value || 0,
        })),
        categoryData: (data.categoryData || data.bookingsByCategory || []).map((d: any) => ({
          name: d.name || d.category,
          value: d.value || d.count || d.bookings || 0,
          color: d.color || CATEGORY_COLORS[d.name || d.category] || "#6B7280",
        })),
        topServicesData: (data.topServicesData || data.topServices || []).map((d: any) => ({
          name: d.name || d.serviceName,
          bookings: d.bookings || d.count || 0,
          category: d.category || "",
        })),
        profilesData: (data.profilesData || data.profiles || []).map((p: any) => ({
          id: p.id,
          name: p.name || p.businessName || "Unknown",
          category: p.category || "General",
          revenue: p.revenue || 0,
          revenueTrend: p.revenueTrend || 0,
          bookings: p.bookings || 0,
          bookingsTrend: p.bookingsTrend || 0,
          rating: p.rating || 0,
          customers: p.customers || 0,
          conversion: p.conversion || 0,
          status: (p.status || "active").toLowerCase() as "active" | "inactive",
          icon: p.icon || CATEGORY_ICONS[p.category] || "📋",
        })),
      });
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
      setError(err?.response?.data?.error || 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [profileFilter, dateRange]);

  useEffect(() => {
    fetchProfileOptions();
  }, [fetchProfileOptions]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedProfiles = [...(analyticsData?.profilesData || [])].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal: any = a[sortColumn as keyof ProfilePerformance];
    let bVal: any = b[sortColumn as keyof ProfilePerformance];

    if (sortColumn === "name") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const metrics = analyticsData?.keyMetrics;
  const totals = analyticsData?.profilesData?.reduce(
    (acc, p) => ({
      revenue: acc.revenue + p.revenue,
      bookings: acc.bookings + p.bookings,
      customers: acc.customers + p.customers,
      ratingSum: acc.ratingSum + p.rating,
      count: acc.count + 1,
    }),
    { revenue: 0, bookings: 0, customers: 0, ratingSum: 0, count: 0 }
  ) || { revenue: 0, bookings: 0, customers: 0, ratingSum: 0, count: 0 };

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="michelle"
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
          {/* Back Navigation */}
          <Link
            to="/admin/michelle-profiles"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Stores</span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Analytics: Michelle's Stores
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280] hidden sm:block">
              Performance overview across all your business profiles
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B] flex items-center justify-between">
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={fetchAnalyticsData}
                className="ml-4 px-3 py-1 text-sm border border-[#DC2626] rounded hover:bg-[#FEE2E2]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Filter & Control Bar */}
          <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4 sm:p-5 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="flex-1 sm:flex-none">
                  <label className="block text-xs sm:text-sm text-[#6B7280] mb-1.5 sm:mb-0 sm:hidden">
                    Date Range
                  </label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="h-12 w-full sm:w-[200px] bg-white">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 Days</SelectItem>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 90 Days</SelectItem>
                      <SelectItem value="180">Last 6 Months</SelectItem>
                      <SelectItem value="365">Last Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 sm:flex-none">
                  <label className="block text-xs sm:text-sm text-[#6B7280] mb-1.5 sm:mb-0 sm:hidden">
                    Profile
                  </label>
                  <Select value={profileFilter} onValueChange={setProfileFilter}>
                    <SelectTrigger className="h-12 w-full sm:w-[240px] bg-white">
                      <SelectValue placeholder="Select profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Profiles</SelectItem>
                      {profileOptions.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 w-full sm:w-auto bg-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Email Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4 sm:mb-5">
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <MetricCard
                label="Total Revenue"
                value={metrics ? `$${metrics.totalRevenue.toLocaleString()}` : "—"}
                trend={metrics?.revenueTrend || 0}
                trendText="from last period"
                icon={<DollarSign />}
                isLoading={isLoading}
              />
              <MetricCard
                label="Total Bookings"
                value={metrics ? metrics.totalBookings.toLocaleString() : "—"}
                trend={metrics?.bookingsTrend || 0}
                trendText="from last period"
                icon={<Calendar />}
                isLoading={isLoading}
              />
              <MetricCard
                label="Average Rating"
                value={metrics ? `${metrics.averageRating.toFixed(1)} ⭐` : "—"}
                trend={metrics?.ratingTrend || 0}
                trendText="from last period"
                icon={<Star />}
                isLoading={isLoading}
              />
              <MetricCard
                label="Active Customers"
                value={metrics ? metrics.activeCustomers.toLocaleString() : "—"}
                trend={metrics?.customersTrend || 0}
                trendText="from last period"
                icon={<Users />}
                isLoading={isLoading}
              />
              <MetricCard
                label="Repeat Customer Rate"
                value={metrics ? `${metrics.repeatCustomerRate}%` : "—"}
                trend={metrics?.repeatTrend || 0}
                trendText="from last period"
                icon={<Repeat />}
                isLoading={isLoading}
              />
              <MetricCard
                label="Conversion Rate"
                value={metrics ? `${metrics.conversionRate}%` : "—"}
                trend={metrics?.conversionTrend || 0}
                trendText="from last period"
                icon={<BarChart3 />}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Revenue Trend Chart */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
              Revenue Trend
            </h2>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                </div>
              ) : analyticsData?.revenueData?.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis
                      dataKey="date"
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                      formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1F2937"
                      strokeWidth={3}
                      dot={{ fill: "#1F2937", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-[#6B7280]">
                  No revenue data available
                </div>
              )}
            </div>
          </div>

          {/* Profile Performance Table */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
              Profile Performance
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
              </div>
            ) : sortedProfiles.length === 0 ? (
              <div className="text-center py-12 text-[#6B7280]">
                No profile data available
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                        <tr>
                          <th
                            className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider cursor-pointer hover:bg-[#F3F4F6]"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center gap-2">
                              Profile Name
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider cursor-pointer hover:bg-[#F3F4F6]"
                            onClick={() => handleSort("revenue")}
                          >
                            <div className="flex items-center gap-2">
                              Revenue
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider cursor-pointer hover:bg-[#F3F4F6]"
                            onClick={() => handleSort("bookings")}
                          >
                            <div className="flex items-center gap-2">
                              Bookings
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider cursor-pointer hover:bg-[#F3F4F6]"
                            onClick={() => handleSort("rating")}
                          >
                            <div className="flex items-center gap-2">
                              Rating
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider cursor-pointer hover:bg-[#F3F4F6]"
                            onClick={() => handleSort("customers")}
                          >
                            <div className="flex items-center gap-2">
                              Customers
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th
                            className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider cursor-pointer hover:bg-[#F3F4F6]"
                            onClick={() => handleSort("conversion")}
                          >
                            <div className="flex items-center gap-2">
                              Conversion
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F3F4F6]">
                        {sortedProfiles.map((profile) => (
                          <tr
                            key={profile.id}
                            className="hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{profile.icon}</span>
                                <div>
                                  <p className="text-sm font-semibold text-[#1F2937]">
                                    {profile.name}
                                  </p>
                                  <p className="text-xs text-[#6B7280]">{profile.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-semibold text-[#1F2937]">
                                  ${profile.revenue.toLocaleString()}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {profile.revenueTrend >= 0 ? (
                                    <TrendingUp className="w-3 h-3 text-[#10B981]" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3 text-[#DC2626]" />
                                  )}
                                  <span
                                    className={`text-xs ${
                                      profile.revenueTrend >= 0
                                        ? "text-[#10B981]"
                                        : "text-[#DC2626]"
                                    }`}
                                  >
                                    {profile.revenueTrend >= 0 ? "+" : ""}
                                    {profile.revenueTrend}%
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-semibold text-[#1F2937]">
                                  {profile.bookings}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {profile.bookingsTrend >= 0 ? (
                                    <TrendingUp className="w-3 h-3 text-[#10B981]" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3 text-[#DC2626]" />
                                  )}
                                  <span
                                    className={`text-xs ${
                                      profile.bookingsTrend >= 0
                                        ? "text-[#10B981]"
                                        : "text-[#DC2626]"
                                    }`}
                                  >
                                    {profile.bookingsTrend >= 0 ? "+" : ""}
                                    {profile.bookingsTrend}%
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-[#1F2937]">
                                {profile.rating} ⭐
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-[#1F2937]">
                                {profile.customers}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-[#1F2937]">
                                {profile.conversion}%
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    profile.status === "active"
                                      ? "bg-[#10B981]"
                                      : "bg-[#9CA3AF]"
                                  }`}
                                />
                                <span
                                  className={`text-sm font-medium ${
                                    profile.status === "active"
                                      ? "text-[#10B981]"
                                      : "text-[#9CA3AF]"
                                  }`}
                                >
                                  {profile.status === "active" ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/admin/michelle-profiles/${profile.id}/listings`)
                                  }
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/admin/michelle-profiles/edit/${profile.id}`)
                                  }
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[#F8F9FA] border-t border-[#E5E7EB]">
                        <tr>
                          <td className="px-6 py-4 text-sm font-semibold text-[#1F2937]">
                            Totals
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#1F2937]">
                            ${totals.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#1F2937]">
                            {totals.bookings}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#1F2937]">
                            {totals.count > 0 ? (totals.ratingSum / totals.count).toFixed(1) : "—"} ⭐
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#1F2937]">
                            {totals.customers}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#1F2937]">
                            -
                          </td>
                          <td className="px-6 py-4"></td>
                          <td className="px-6 py-4"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {sortedProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="bg-white border border-[#E5E7EB] rounded-xl p-5"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <span className="text-3xl">{profile.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-[#1F2937] mb-1">
                            {profile.name}
                          </h3>
                          <p className="text-sm text-[#6B7280]">{profile.category}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              profile.status === "active"
                                ? "bg-[#10B981]"
                                : "bg-[#9CA3AF]"
                            }`}
                          />
                          <span
                            className={`text-xs font-medium ${
                              profile.status === "active"
                                ? "text-[#10B981]"
                                : "text-[#9CA3AF]"
                            }`}
                          >
                            {profile.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Revenue</p>
                          <p className="text-base font-bold text-[#1F2937]">
                            ${profile.revenue.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {profile.revenueTrend >= 0 ? (
                              <TrendingUp className="w-3 h-3 text-[#10B981]" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-[#DC2626]" />
                            )}
                            <span
                              className={`text-xs ${
                                profile.revenueTrend >= 0
                                  ? "text-[#10B981]"
                                  : "text-[#DC2626]"
                              }`}
                            >
                              {profile.revenueTrend >= 0 ? "+" : ""}
                              {profile.revenueTrend}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Bookings</p>
                          <p className="text-base font-bold text-[#1F2937]">
                            {profile.bookings}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {profile.bookingsTrend >= 0 ? (
                              <TrendingUp className="w-3 h-3 text-[#10B981]" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-[#DC2626]" />
                            )}
                            <span
                              className={`text-xs ${
                                profile.bookingsTrend >= 0
                                  ? "text-[#10B981]"
                                  : "text-[#DC2626]"
                              }`}
                            >
                              {profile.bookingsTrend >= 0 ? "+" : ""}
                              {profile.bookingsTrend}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Rating</p>
                          <p className="text-base font-bold text-[#1F2937]">
                            {profile.rating} ⭐
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Customers</p>
                          <p className="text-base font-bold text-[#1F2937]">
                            {profile.customers}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-[#E5E7EB]">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            navigate(`/admin/michelle-profiles/${profile.id}/listings`)
                          }
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Bookings by Category */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
                Bookings by Category
              </h2>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                  </div>
                ) : analyticsData?.categoryData?.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-[#6B7280]">
                    No category data available
                  </div>
                )}
              </div>
            </div>

            {/* Top Services */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
                Top Performing Services
              </h2>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                  </div>
                ) : analyticsData?.topServicesData?.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.topServicesData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis type="number" stroke="#6B7280" fontSize={12} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#6B7280"
                        fontSize={12}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Bar dataKey="bookings" fill="#1F2937" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-[#6B7280]">
                    No services data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
