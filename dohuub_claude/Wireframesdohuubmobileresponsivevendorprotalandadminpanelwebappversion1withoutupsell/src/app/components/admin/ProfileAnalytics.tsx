import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ChevronDown,
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
  isCurrency?: boolean;
  isPercentage?: boolean;
}

function MetricCard({ label, value, trend, trendText, icon }: MetricCardProps) {
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
    </div>
  );
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

// Mock data
const revenueData = [
  { date: "Jan 1", revenue: 4200 },
  { date: "Jan 8", revenue: 5100 },
  { date: "Jan 15", revenue: 4800 },
  { date: "Jan 22", revenue: 6200 },
  { date: "Jan 29", revenue: 7100 },
  { date: "Feb 5", revenue: 6800 },
  { date: "Feb 12", revenue: 8200 },
  { date: "Feb 19", revenue: 9100 },
];

const categoryData = [
  { name: "Cleaning", value: 234, color: "#3B82F6" },
  { name: "Handyman", value: 156, color: "#10B981" },
  { name: "Beauty", value: 123, color: "#F59E0B" },
  { name: "Rentals", value: 89, color: "#EF4444" },
  { name: "Caregiving", value: 76, color: "#8B5CF6" },
  { name: "Transportation", value: 293, color: "#EC4899" },
];

const topServicesData = [
  { name: "Deep Cleaning", bookings: 89, category: "Cleaning" },
  { name: "Medical Appointments", bookings: 87, category: "Transportation" },
  { name: "Haircut & Styling", bookings: 67, category: "Beauty" },
  { name: "2 BR Apartment", bookings: 45, category: "Rentals" },
  { name: "Plumbing Repair", bookings: 43, category: "Handyman" },
  { name: "Companion Support", bookings: 38, category: "Caregiving" },
];

const profilesData: ProfilePerformance[] = [
  {
    id: "1",
    name: "Sparkle Clean by Michelle",
    category: "Cleaning Services",
    revenue: 12450,
    revenueTrend: 23,
    bookings: 234,
    bookingsTrend: 15,
    rating: 4.8,
    customers: 189,
    conversion: 42,
    status: "active",
    icon: "🧹",
  },
  {
    id: "2",
    name: "Fix-It Pro Services",
    category: "Handyman Services",
    revenue: 8920,
    revenueTrend: 18,
    bookings: 156,
    bookingsTrend: 12,
    rating: 4.9,
    customers: 124,
    conversion: 38,
    status: "active",
    icon: "🔧",
  },
  {
    id: "3",
    name: "Beauty by Michelle",
    category: "Beauty Services",
    revenue: 5680,
    revenueTrend: -3,
    bookings: 123,
    bookingsTrend: -5,
    rating: 4.7,
    customers: 98,
    conversion: 35,
    status: "active",
    icon: "💄",
  },
  {
    id: "4",
    name: "Michelle's Rentals",
    category: "Rental Properties",
    revenue: 11240,
    revenueTrend: 28,
    bookings: 89,
    bookingsTrend: 22,
    rating: 4.9,
    customers: 67,
    conversion: 45,
    status: "active",
    icon: "🏠",
  },
  {
    id: "5",
    name: "Caring Hands Caregiving",
    category: "Caregiving Services",
    revenue: 6944,
    revenueTrend: 15,
    bookings: 76,
    bookingsTrend: 10,
    rating: 4.8,
    customers: 52,
    conversion: 40,
    status: "active",
    icon: "👵",
  },
  {
    id: "6",
    name: "CareWheels Transportation",
    category: "Ride Assistance",
    revenue: 14720,
    revenueTrend: 25,
    bookings: 92,
    bookingsTrend: 20,
    rating: 4.9,
    customers: 78,
    conversion: 52,
    status: "active",
    icon: "🚗",
  },
  {
    id: "7",
    name: "Senior Care Rides",
    category: "Ride Assistance",
    revenue: 20100,
    revenueTrend: 32,
    bookings: 134,
    bookingsTrend: 28,
    rating: 4.8,
    customers: 102,
    conversion: 48,
    status: "active",
    icon: "🚗",
  },
  {
    id: "8",
    name: "SafeTransit Solutions",
    category: "Ride Assistance",
    revenue: 10050,
    revenueTrend: 18,
    bookings: 67,
    bookingsTrend: 15,
    rating: 4.7,
    customers: 56,
    conversion: 44,
    status: "active",
    icon: "🚗",
  },
];

export function ProfileAnalytics() {
  const navigate = useNavigate();

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

  // State
  const [dateRange, setDateRange] = useState("30");
  const [profileFilter, setProfileFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedProfiles = [...profilesData].sort((a, b) => {
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
                      <SelectItem value="1">Sparkle Clean by Michelle</SelectItem>
                      <SelectItem value="2">Fix-It Pro Services</SelectItem>
                      <SelectItem value="3">Beauty by Michelle</SelectItem>
                      <SelectItem value="4">Michelle's Rentals</SelectItem>
                      <SelectItem value="5">Caring Hands Caregiving</SelectItem>
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
                value="$45,234"
                trend={23}
                trendText="from last period"
                icon={<DollarSign />}
              />
              <MetricCard
                label="Total Bookings"
                value="678"
                trend={15}
                trendText="from last period"
                icon={<Calendar />}
              />
              <MetricCard
                label="Average Rating"
                value="4.8 ⭐"
                trend={4}
                trendText="from last period"
                icon={<Star />}
              />
              <MetricCard
                label="Active Customers"
                value="1,234"
                trend={8}
                trendText="from last period"
                icon={<Users />}
              />
              <MetricCard
                label="Repeat Customer Rate"
                value="68%"
                trend={5}
                trendText="from last period"
                icon={<Repeat />}
              />
              <MetricCard
                label="Conversion Rate"
                value="42%"
                trend={3}
                trendText="from last period"
                icon={<BarChart3 />}
              />
            </div>
          </div>

          {/* Revenue Trend Chart */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
              Revenue Trend
            </h2>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
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
            </div>
          </div>

          {/* Profile Performance Table */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
              Profile Performance
            </h2>
            
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
                        $45,234
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#1F2937]">
                        678
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#1F2937]">
                        4.8 ⭐
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#1F2937]">
                        530
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
          </div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Bookings by Category */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
                Bookings by Category
              </h2>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
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
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Services */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-4">
                Top Performing Services
              </h2>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topServicesData} layout="vertical">
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}