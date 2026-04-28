import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  User,
  Store,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Eye,
  MessageSquare,
  XCircle,
  DollarSign,
  Gift,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  vendorId: string;
  vendorName: string;
  serviceName: string;
  status: "upcoming" | "in_progress" | "completed" | "cancelled" | "disputed";
  date: string;
  time: string;
  location: string;
  duration: string;
  total: number;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "failed";
  // Rewards
  pointsEarned?: number;
  pointsRedeemed?: number;
  pointsDiscount?: number;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: "BK-12789",
    orderNumber: "BK-12789",
    customerId: "C123",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    vendorId: "V001",
    vendorName: "CleanCo Services",
    serviceName: "Deep Cleaning Service",
    status: "upcoming",
    date: "2026-01-06",
    time: "10:00 AM",
    location: "123 Main St, New York, NY",
    duration: "3 hours",
    total: 120,
    paymentMethod: "Visa ****1234",
    paymentStatus: "paid",
    pointsEarned: 120,
    pointsRedeemed: 500,
    pointsDiscount: 5.00,
  },
  {
    id: "BK-12345",
    orderNumber: "BK-12345",
    customerId: "C456",
    customerName: "John D.",
    customerEmail: "john.d@email.com",
    vendorId: "V001",
    vendorName: "CleanCo Services",
    serviceName: "Deep Cleaning Service",
    status: "completed",
    date: "2024-12-30",
    time: "2:00 PM",
    location: "456 Oak Ave, Brooklyn, NY",
    duration: "3 hours",
    total: 120,
    paymentMethod: "Visa ****5678",
    paymentStatus: "paid",
    pointsEarned: 120,
  },
  {
    id: "BK-12500",
    orderNumber: "BK-12500",
    customerId: "C789",
    customerName: "Maria S.",
    customerEmail: "maria.s@email.com",
    vendorId: "V002",
    vendorName: "Beauty by Michelle",
    serviceName: "Hair & Makeup Package",
    status: "in_progress",
    date: "2026-01-07",
    time: "2:00 PM",
    location: "789 Broadway, Manhattan, NY",
    duration: "2 hours",
    total: 150,
    paymentMethod: "Mastercard ****9012",
    paymentStatus: "paid",
    pointsEarned: 150,
    pointsRedeemed: 200,
    pointsDiscount: 2.00,
  },
  {
    id: "BK-12501",
    orderNumber: "BK-12501",
    customerId: "C123",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    vendorId: "V003",
    vendorName: "HandyPro Services",
    serviceName: "Bathroom Fixture Installation",
    status: "upcoming",
    date: "2026-01-10",
    time: "9:00 AM",
    location: "123 Main St, New York, NY",
    duration: "4 hours",
    total: 275,
    paymentMethod: "Visa ****1234",
    paymentStatus: "paid",
    pointsEarned: 275,
  },
];

const getStatusConfig = (status: string) => {
  const configs: Record<string, { label: string; bg: string; text: string }> = {
    upcoming: { label: "Upcoming", bg: "bg-[#E8F1FC]", text: "text-[#1E5DB0]" },
    in_progress: { label: "In Progress", bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
    completed: { label: "Completed", bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
    cancelled: { label: "Cancelled", bg: "bg-[#F0F7FF]", text: "text-[#4B5563]" },
    disputed: { label: "Disputed", bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
  };
  return configs[status] || configs.upcoming;
};

function OrderCard({ order }: { order: Order }) {
  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 mb-5 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-[rgba(46,122,217,0.25)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-[#1A1A2E]">Order #{order.orderNumber}</h3>
            <span
              className={`px-3 py-1 ${statusConfig.bg} ${statusConfig.text} text-xs font-semibold rounded-full`}
            >
              {statusConfig.label}
            </span>
          </div>
          <p className="text-sm text-[#6B7280]">{new Date(order.date).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-start gap-2 mb-3">
            <User className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-xs text-[#6B7280] mb-0.5">Customer</p>
              <p className="text-sm font-semibold text-[#1A1A2E]">{order.customerName}</p>
              <p className="text-xs text-[#9CA3AF]">{order.customerEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Store className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-xs text-[#6B7280] mb-0.5">Vendor</p>
              <p className="text-sm font-semibold text-[#1A1A2E]">{order.vendorName}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-xs text-[#6B7280] mb-0.5">Service</p>
              <p className="text-sm font-semibold text-[#1A1A2E]">{order.serviceName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-xs text-[#6B7280] mb-0.5">Location</p>
              <p className="text-sm text-[#1A1A2E]">{order.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-t border-[rgba(46,122,217,0.25)]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#1A1A2E]">
            {new Date(order.date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#1A1A2E]">
            {order.time} ({order.duration})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#1A1A2E]">{order.paymentMethod}</span>
        </div>
      </div>

      {/* Rewards Impact */}
      {(order.pointsEarned || order.pointsRedeemed) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Rewards Impact</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {order.pointsEarned && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                +{order.pointsEarned} pts earned
              </span>
            )}
            {order.pointsRedeemed && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                -{order.pointsRedeemed} pts redeemed
                {order.pointsDiscount && (
                  <span className="text-green-600">(${order.pointsDiscount.toFixed(2)} off)</span>
                )}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t border-[rgba(46,122,217,0.25)] mb-4">
        <span className="text-sm font-semibold text-[#6B7280]">Total:</span>
        <div className="text-right">
          <span className="text-lg font-bold text-[#1A1A2E]">${order.total.toFixed(2)}</span>
          {order.pointsDiscount && (
            <p className="text-xs text-green-600">Includes ${order.pointsDiscount.toFixed(2)} points discount</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button size="sm" variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Customer
        </Button>
        <Button size="sm" variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Vendor
        </Button>
        {order.status !== "cancelled" && order.status !== "completed" && (
          <Button size="sm" variant="outline" className="text-[#DC2626] border-[#FECACA]">
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
        {order.paymentStatus === "paid" && (
          <Button size="sm" variant="outline" className="text-[#F59E0B] border-[#FED7AA]">
            <DollarSign className="w-4 h-4 mr-2" />
            Refund
          </Button>
        )}
      </div>
    </div>
  );
}

export function OrderManagement() {
  const { id } = useParams();

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

  const [orders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // If specific order ID, show just that one
  const displayOrders = id ? orders.filter((o) => o.id === id) : orders;

  // Filter orders
  const filteredOrders = displayOrders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return 0;
  });

  // Calculate stats
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status === "upcoming" || o.status === "in_progress")
    .length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const disputedOrders = orders.filter((o) => o.status === "disputed").length;

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="orders"
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
          {/* Back Navigation (if viewing specific order) */}
          {id && (
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] hover:underline mb-4 sm:mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Orders
            </Link>
          )}

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              {id ? `Order #${id}` : "Order Management"}
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              {id ? "Order details and actions" : "View and manage all bookings"}
            </p>
          </div>

          {/* Summary Stats */}
          {!id && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
              <div className="bg-[#F8FAFF] border border-[rgba(46,122,217,0.25)] rounded-lg p-4 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-sm text-[#6B7280] mb-1">Total</p>
                <p className="text-2xl font-bold text-[#1A1A2E]">{totalOrders}</p>
              </div>
              <div className="bg-[#F8FAFF] border border-[rgba(46,122,217,0.25)] rounded-lg p-4 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-sm text-[#6B7280] mb-1">Active</p>
                <p className="text-2xl font-bold text-[#2E7AD9]">{activeOrders}</p>
              </div>
              <div className="bg-[#F8FAFF] border border-[rgba(46,122,217,0.25)] rounded-lg p-4 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-sm text-[#6B7280] mb-1">Completed</p>
                <p className="text-2xl font-bold text-[#10B981]">{completedOrders}</p>
              </div>
              <div className="bg-[#F8FAFF] border border-[rgba(46,122,217,0.25)] rounded-lg p-4 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-sm text-[#6B7280] mb-1">Cancelled</p>
                <p className="text-2xl font-bold text-[#6B7280]">{cancelledOrders}</p>
              </div>
              <div className="bg-[#F8FAFF] border border-[rgba(46,122,217,0.25)] rounded-lg p-4 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                <p className="text-sm text-[#6B7280] mb-1">Disputed</p>
                <p className="text-2xl font-bold text-[#DC2626]">{disputedOrders}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          {!id && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 w-full sm:w-[200px]">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Order Cards */}
          {sortedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-[120px] h-[120px] rounded-full bg-[#F0F7FF] flex items-center justify-center mb-6">
                <ShoppingBag className="w-16 h-16 text-[#9CA3AF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">No orders found</h3>
              <p className="text-[15px] text-[#6B7280]">
                {id ? "This order could not be found" : "No orders match your filters"}
              </p>
            </div>
          ) : (
            sortedOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </main>
    </div>
  );
}
