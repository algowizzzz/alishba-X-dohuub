import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Search,
  Download,
  Eye,
  MessageSquare,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  Loader2,
} from "lucide-react";
import { api } from "../../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  verified: boolean;
  joinedDate: string;
  status: "active" | "inactive" | "suspended";
  bookingsCount: number;
  totalSpent: number;
  avgOrderValue: number;
  reviewsWritten: number;
  avgRatingGiven: number;
  lastActive: string;
  paymentMethod?: string;
}

function CustomerCard({ customer, onStatusChange }: { customer: Customer; onStatusChange: (id: string, newStatus: 'ACTIVE' | 'SUSPENDED') => void }) {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async () => {
    const newStatus = customer.status === 'active' ? 'SUSPENDED' : 'ACTIVE';
    setIsUpdating(true);
    await onStatusChange(customer.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 mb-5 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-[#0369A1]">
            {customer.name.charAt(0)}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-[#1F2937]">{customer.name}</h3>
            {customer.verified && (
              <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" title="Verified" />
            )}
            {customer.status === "suspended" && (
              <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold rounded-full">
                Suspended
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-[#6B7280]">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              <span>{customer.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-[#E5E7EB] mb-4">
        <div>
          <p className="text-xs text-[#6B7280] mb-1">Joined</p>
          <p className="text-sm font-semibold text-[#1F2937]">
            {new Date(customer.joinedDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#6B7280] mb-1">Bookings</p>
          <p className="text-sm font-semibold text-[#1F2937]">{customer.bookingsCount}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
        {customer.status === "active" ? (
          <Button
            size="sm"
            variant="outline"
            className="text-[#DC2626] border-[#FECACA]"
            onClick={handleStatusChange}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Ban className="w-4 h-4 mr-2" />}
            {isUpdating ? 'Suspending...' : 'Suspend'}
          </Button>
        ) : customer.status === "suspended" ? (
          <Button
            size="sm"
            variant="outline"
            className="text-[#10B981] border-[#D1FAE5]"
            onClick={handleStatusChange}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            {isUpdating ? 'Activating...' : 'Activate'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function CustomerManagement() {
  const { id } = useParams();
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

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: any = await api.get('/admin/customers');
      const customersData = Array.isArray(response) ? response : response?.data || [];
      setCustomers(customersData.map((c: any) => {
        // Build name from various possible sources
        const profile = c.profile || {};
        const firstName = c.firstName || profile.firstName || '';
        const lastName = c.lastName || profile.lastName || '';
        const fullName = firstName && lastName
          ? `${firstName} ${lastName}`.trim()
          : firstName || lastName || c.name || c.email?.split('@')[0] || 'Unknown';

        return {
        id: c.id,
        name: fullName,
        email: c.email || '',
        phone: c.phone || '',
        avatar: c.avatar || c.profileImage,
        verified: c.verified || c.emailVerified || false,
        joinedDate: c.createdAt || c.joinedDate || new Date().toISOString(),
        status: (c.status || 'active').toLowerCase() as Customer['status'],
        bookingsCount: c.bookingsCount || c.ordersCount || 0,
        totalSpent: c.totalSpent || 0,
        avgOrderValue: c.avgOrderValue || 0,
        reviewsWritten: c.reviewsWritten || c.reviewCount || 0,
        avgRatingGiven: c.avgRatingGiven || 0,
        lastActive: c.lastActive || c.lastLoginAt || 'Unknown',
        paymentMethod: c.paymentMethod,
      };
      }));
    } catch (err: any) {
      console.error('Failed to fetch customers:', err);
      setError(err?.response?.data?.error || 'Failed to load customers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle customer status change (suspend/activate)
  const handleCustomerStatusChange = async (customerId: string, newStatus: 'ACTIVE' | 'SUSPENDED') => {
    try {
      await api.updateCustomerStatus(customerId, newStatus);
      // Update local state
      setCustomers(prev => prev.map(c =>
        c.id === customerId
          ? { ...c, status: newStatus.toLowerCase() as Customer['status'] }
          : c
      ));
    } catch (err: any) {
      console.error('Failed to update customer status:', err);
      setError(err?.response?.data?.error || 'Failed to update customer status');
    }
  };

  // If viewing specific customer
  if (id) {
    const customer = customers.find((c) => c.id === id);

    if (!customer) {
      return (
        <div className="min-h-screen bg-white">
          <AdminTopNav onMenuClick={handleSidebarToggle} />
          <AdminSidebarRetractable
            isOpen={sidebarOpen}
            isCollapsed={sidebarCollapsed}
            onClose={() => setSidebarOpen(false)}
            activeMenu="customers"
          />
          <main
            className={`
              mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
              transition-all duration-300
              ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
            `}
          >
            <div className="max-w-[1400px] mx-auto">
              <Link
                to="/admin/customers"
                className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Customers
              </Link>
              <div className="flex flex-col items-center justify-center py-20">
                <h3 className="text-2xl font-bold text-[#1F2937] mb-2">Customer not found</h3>
                <p className="text-[15px] text-[#6B7280]">This customer could not be found</p>
              </div>
            </div>
          </main>
        </div>
      );
    }

    // Customer Detail View
    return (
      <div className="min-h-screen bg-white">
        <AdminTopNav onMenuClick={handleSidebarToggle} />
        <AdminSidebarRetractable
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          activeMenu="customers"
        />
        <main
          className={`
            mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
            transition-all duration-300
            ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
          `}
        >
          <div className="max-w-[1400px] mx-auto">
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Customers
            </Link>

            <div className="mb-6">
              <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
                Customer Profile: {customer.name}
              </h1>
              <p className="text-sm sm:text-[15px] text-[#6B7280]">
                Complete customer information and activity
              </p>
            </div>

            {/* Profile Header */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-bold text-[#0369A1]">
                    {customer.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-[#1F2937]">{customer.name}</h2>
                    {customer.verified && (
                      <CheckCircle className="w-6 h-6 text-[#10B981]" title="Verified" />
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  {customer.status === "active" ? (
                    <Button size="sm" variant="outline" className="text-[#DC2626]">
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-[#10B981]">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  )}
                </div>
              </div>

              {/* Account Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E5E7EB]">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Joined</p>
                  <p className="text-lg font-bold text-[#1F2937]">
                    {new Date(customer.joinedDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {Math.floor(
                      (Date.now() - new Date(customer.joinedDate).getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                    )}{" "}
                    months ago
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Total Bookings</p>
                  <p className="text-lg font-bold text-[#1F2937]">{customer.bookingsCount}</p>
                </div>

                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Total Spent</p>
                  <p className="text-lg font-bold text-[#10B981]">
                    ${customer.totalSpent.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Avg Order Value</p>
                  <p className="text-lg font-bold text-[#1F2937]">${customer.avgOrderValue}</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Status:</span>
                    <span
                      className={`text-sm font-semibold ${
                        customer.status === "active" ? "text-[#10B981]" : "text-[#DC2626]"
                      }`}
                    >
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Last Active:</span>
                    <span className="text-sm font-medium text-[#1F2937]">
                      {customer.lastActive}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Reviews Written:</span>
                    <span className="text-sm font-medium text-[#1F2937]">
                      {customer.reviewsWritten}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Avg Rating Given:</span>
                    <span className="text-sm font-medium text-[#1F2937]">
                      {customer.avgRatingGiven}⭐
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Payment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Payment Method:</span>
                    <span className="text-sm font-medium text-[#1F2937]">
                      {customer.paymentMethod || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Email Verified:</span>
                    <span className="text-sm font-medium text-[#10B981]">✓ Yes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#6B7280]">Phone Verified:</span>
                    <span className="text-sm font-medium text-[#10B981]">✓ Yes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2 border-b border-[#E5E7EB]">
                  <ShoppingBag className="w-4 h-4 text-[#6B7280]" />
                  <span className="text-sm text-[#1F2937]">
                    Booked "Deep Cleaning" - $120
                  </span>
                  <span className="text-xs text-[#9CA3AF] ml-auto">Jan 3, 2026</span>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-[#E5E7EB]">
                  <Star className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-sm text-[#1F2937]">Left 5-star review for CleanCo</span>
                  <span className="text-xs text-[#9CA3AF] ml-auto">Jan 2, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !customer.name.toLowerCase().includes(query) &&
        !customer.email.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (statusFilter !== "all" && customer.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Calculate stats
  const totalCustomers = customers.length;
  const newCustomers = customers.filter((c) => {
    const joinedDate = new Date(c.joinedDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return joinedDate > thirtyDaysAgo;
  }).length;
  const customersWithIssues = 0; // Mock

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="customers"
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
              Customer Management
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              View and manage all customers
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-center">
              <p className="text-sm text-[#6B7280] mb-1">Total</p>
              <p className="text-2xl font-bold text-[#1F2937]">{totalCustomers.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-center">
              <p className="text-sm text-[#6B7280] mb-1">New (30d)</p>
              <p className="text-2xl font-bold text-[#3B82F6]">{newCustomers}</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <Input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 w-full sm:w-[200px]">
                <SelectValue placeholder="Filter: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B] flex items-center justify-between">
              <span className="text-sm font-medium">{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchCustomers}
                className="ml-4 border-[#DC2626] text-[#DC2626] hover:bg-[#FEE2E2]"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Customer Cards */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#6B7280] animate-spin mb-4" />
              <p className="text-[15px] text-[#6B7280]">Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-[120px] h-[120px] rounded-full bg-[#F3F4F6] flex items-center justify-center mb-6">
                <Users className="w-16 h-16 text-[#9CA3AF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-2">No customers found</h3>
              <p className="text-[15px] text-[#6B7280]">No customers match your search filters</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => <CustomerCard key={customer.id} customer={customer} onStatusChange={handleCustomerStatusChange} />)
          )}
        </div>
      </main>
    </div>
  );
}