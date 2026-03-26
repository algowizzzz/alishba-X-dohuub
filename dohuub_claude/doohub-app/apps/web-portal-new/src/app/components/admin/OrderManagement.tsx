import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  AlertCircle,
  Loader2,
} from "lucide-react";
import { api } from "../../../services/api";
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
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, { label: string; bg: string; text: string }> = {
    upcoming: { label: "Upcoming", bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
    in_progress: { label: "In Progress", bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
    completed: { label: "Completed", bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
    cancelled: { label: "Cancelled", bg: "bg-[#F3F4F6]", text: "text-[#4B5563]" },
    disputed: { label: "Disputed", bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
  };
  return configs[status] || configs.upcoming;
};

function OrderCard({
  order,
  onViewDetails,
  onContactCustomer,
  onContactVendor,
  onCancel,
  onRefund,
  isActionInProgress,
}: {
  order: Order;
  onViewDetails: (orderId: string) => void;
  onContactCustomer: (email: string) => void;
  onContactVendor: (vendorId: string) => void;
  onCancel: (orderId: string) => void;
  onRefund: (orderId: string) => void;
  isActionInProgress: boolean;
}) {
  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 mb-5 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-[#1F2937]">Order #{order.orderNumber}</h3>
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
              <p className="text-sm font-semibold text-[#1F2937]">{order.customerName}</p>
              <p className="text-xs text-[#9CA3AF]">{order.customerEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Store className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-xs text-[#6B7280] mb-0.5">Vendor</p>
              <p className="text-sm font-semibold text-[#1F2937]">{order.vendorName}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-xs text-[#6B7280] mb-0.5">Service</p>
              <p className="text-sm font-semibold text-[#1F2937]">{order.serviceName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-xs text-[#6B7280] mb-0.5">Location</p>
              <p className="text-sm text-[#1F2937]">{order.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#1F2937]">
            {new Date(order.date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#1F2937]">
            {order.time} ({order.duration})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#1F2937]">{order.paymentMethod}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] mb-4">
        <span className="text-sm font-semibold text-[#6B7280]">Total:</span>
        <span className="text-lg font-bold text-[#1F2937]">${order.total.toFixed(2)}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => onViewDetails(order.id)}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button size="sm" variant="outline" onClick={() => onContactCustomer(order.customerEmail)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Customer
        </Button>
        <Button size="sm" variant="outline" onClick={() => onContactVendor(order.vendorId)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Vendor
        </Button>
        {order.status !== "cancelled" && order.status !== "completed" && (
          <Button
            size="sm"
            variant="outline"
            className="text-[#DC2626] border-[#FECACA]"
            onClick={() => onCancel(order.id)}
            disabled={isActionInProgress}
          >
            {isActionInProgress ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Cancel
          </Button>
        )}
        {order.paymentStatus === "paid" && (
          <Button
            size="sm"
            variant="outline"
            className="text-[#F59E0B] border-[#FED7AA]"
            onClick={() => onRefund(order.id)}
            disabled={isActionInProgress}
          >
            {isActionInProgress ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <DollarSign className="w-4 h-4 mr-2" />
            )}
            Refund
          </Button>
        )}
      </div>
    </div>
  );
}

export function OrderManagement() {
  const { id } = useParams();
  const navigate = useNavigate();

  // API states
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: any = await api.get('/admin/orders');

      // Map API response to Order interface
      const mappedOrders: Order[] = (response.orders || response || []).map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber || order.id,
        customerId: order.customerId || order.userId,
        customerName: order.customer?.name || order.customerName || "Unknown",
        customerEmail: order.customer?.email || order.customerEmail || "",
        vendorId: order.vendorId || order.store?.vendorId,
        vendorName: order.store?.name || order.vendorName || "Unknown",
        serviceName: order.listing?.title || order.serviceName || "Service",
        status: order.status?.toLowerCase() || "upcoming",
        date: order.scheduledDate || order.createdAt,
        time: order.scheduledTime || "TBD",
        location: order.address?.fullAddress || order.location || "TBD",
        duration: order.duration || "N/A",
        total: order.total || order.amount || 0,
        paymentMethod: order.paymentMethod || "Card",
        paymentStatus: order.paymentStatus?.toLowerCase() || "pending",
      }));

      setOrders(mappedOrders);
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err?.response?.data?.error || "Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Order action handlers
  const handleViewDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleContactCustomer = (email: string) => {
    window.location.href = `mailto:${email}?subject=Regarding Your Order`;
  };

  const handleContactVendor = (vendorId: string) => {
    navigate(`/admin/vendors/${vendorId}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setActionInProgress(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: "CANCELLED" });

      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: "cancelled" as const } : order
      ));
    } catch (err: any) {
      console.error("Failed to cancel order:", err);
      setError(err.response?.data?.error || "Failed to cancel order.");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRefundOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to refund this order?")) return;

    setActionInProgress(orderId);
    try {
      await api.post(`/admin/orders/${orderId}/refund`, {});

      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, paymentStatus: "pending" as const } : order
      ));
    } catch (err: any) {
      console.error("Failed to refund order:", err);
      setError(err.response?.data?.error || "Failed to process refund.");
    } finally {
      setActionInProgress(null);
    }
  };

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
    <div className="min-h-screen bg-white">
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
              className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1F2937] hover:underline mb-4 sm:mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Orders
            </Link>
          )}

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              {id ? `Order #${id}` : "Order Management"}
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              {id ? "Order details and actions" : "View and manage all bookings"}
            </p>
          </div>

          {/* Summary Stats */}
          {!id && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-center">
                <p className="text-sm text-[#6B7280] mb-1">Total</p>
                <p className="text-2xl font-bold text-[#1F2937]">{totalOrders}</p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-center">
                <p className="text-sm text-[#6B7280] mb-1">Active</p>
                <p className="text-2xl font-bold text-[#3B82F6]">{activeOrders}</p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-center">
                <p className="text-sm text-[#6B7280] mb-1">Completed</p>
                <p className="text-2xl font-bold text-[#10B981]">{completedOrders}</p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-center">
                <p className="text-sm text-[#6B7280] mb-1">Cancelled</p>
                <p className="text-2xl font-bold text-[#6B7280]">{cancelledOrders}</p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-center">
                <p className="text-sm text-[#6B7280] mb-1">Disputed</p>
                <p className="text-2xl font-bold text-[#DC2626]">{disputedOrders}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B] flex items-center justify-between">
              <span className="text-sm font-medium">{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                className="ml-4 border-[#DC2626] text-[#DC2626] hover:bg-[#FEE2E2]"
              >
                Try Again
              </Button>
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

          {/* Loading State */}
          {isLoading && (
            <div className="py-20 text-center">
              <Loader2 className="w-10 h-10 text-[#6B7280] animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#6B7280]">Loading orders...</p>
            </div>
          )}

          {/* Order Cards */}
          {!isLoading && sortedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-[120px] h-[120px] rounded-full bg-[#F3F4F6] flex items-center justify-center mb-6">
                <ShoppingBag className="w-16 h-16 text-[#9CA3AF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-2">No orders found</h3>
              <p className="text-[15px] text-[#6B7280]">
                {id ? "This order could not be found" : "No orders match your filters"}
              </p>
            </div>
          ) : !isLoading && (
            sortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
                onContactCustomer={handleContactCustomer}
                onContactVendor={handleContactVendor}
                onCancel={handleCancelOrder}
                onRefund={handleRefundOrder}
                isActionInProgress={actionInProgress === order.id}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
