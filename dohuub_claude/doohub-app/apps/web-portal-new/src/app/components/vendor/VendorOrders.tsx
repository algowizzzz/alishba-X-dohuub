import { useState, useEffect, useCallback } from "react";
import { Search, User, Calendar, DollarSign, Package, Clock, Check, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { parseISO, isWithinInterval } from "date-fns";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { VendorOrderDetailModal } from "./VendorOrderDetailModal";
import { DateRangePicker, DateRange } from "../ui/date-range-picker";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../../services/api";

type OrderStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DECLINED";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ServiceDetails {
  service: string;
  category: string;
  scheduledDate: string;
  time: string;
  duration: string;
  serviceAddress: string;
  specialInstructions: string;
}

interface DeliveryDetails {
  items: OrderItem[];
  deliveryAddress: string;
  deliveryWindow: string;
  specialInstructions: string;
}

interface Order {
  id: string;
  orderNumber: string;
  storeName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  date: string;
  time: string;
  status: OrderStatus;
  serviceName: string;
  itemCount?: number;
  type: "service" | "delivery";
  serviceDetails?: ServiceDetails;
  deliveryDetails?: DeliveryDetails;
}

export function VendorOrders() {
  const { user } = useAuth();
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

  const [activeTab, setActiveTab] = useState<OrderStatus>("ACCEPTED");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Get vendor name
  const vendorName = user?.profile?.firstName || user?.name?.split(" ")[0] || "Vendor";

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: any = await api.getVendorBookings();

      if (response.success && response.data) {
        // Map API response to Order interface
        const mappedOrders: Order[] = response.data.map((booking: any) => {
          const customerProfile = booking.user?.profile || {};
          const customerName = customerProfile.firstName
            ? `${customerProfile.firstName} ${customerProfile.lastName || ""}`.trim()
            : booking.user?.email?.split("@")[0] || "Customer";

          // Get listing info based on category
          const listing =
            booking.cleaningListing ||
            booking.handymanListing ||
            booking.beautyListing ||
            booking.rentalListing ||
            booking.caregivingListing ||
            {};

          return {
            id: booking.id,
            orderNumber: `ORD-${booking.id.slice(-6).toUpperCase()}`,
            storeName: booking.category || "Service",
            customerName,
            customerEmail: booking.user?.email || "",
            customerPhone: booking.user?.phone || customerProfile.phone || "",
            total: Number(booking.total) || 0,
            date: new Date(booking.scheduledDate || booking.createdAt).toISOString().split("T")[0],
            time: booking.scheduledTime || new Date(booking.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            status: booking.status,
            serviceName: listing.title || listing.name || booking.category || "Service",
            type: "service" as const,
            serviceDetails: {
              service: listing.title || listing.name || "Service",
              category: booking.category || "Service",
              scheduledDate: new Date(booking.scheduledDate || booking.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              time: booking.scheduledTime || "TBD",
              duration: booking.duration ? `${booking.duration} minutes` : "TBD",
              serviceAddress: booking.address
                ? `${booking.address.street}, ${booking.address.city}, ${booking.address.state} ${booking.address.zipCode}`
                : "Address not provided",
              specialInstructions: booking.specialInstructions || "None",
            },
          };
        });

        setOrders(mappedOrders);

        // Set status counts from API response
        if (response.counts) {
          setStatusCounts(response.counts);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.error || "Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: "IN_PROGRESS" | "COMPLETED") => {
    setIsUpdatingStatus(orderId);

    try {
      await api.updateBookingStatus(orderId, newStatus);

      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Close modal if open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setError(err.response?.data?.error || "Failed to update order status.");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Get unique stores
  const stores = Array.from(new Set(orders.map((order) => order.storeName)));

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = order.status === activeTab;
    const matchesStore =
      selectedStore === "all" || order.storeName === selectedStore;
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range filtering
    let matchesDateRange = true;
    if (dateRange?.from) {
      const orderDate = parseISO(order.date);
      if (dateRange.to) {
        matchesDateRange = isWithinInterval(orderDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      } else {
        // Only start date selected
        matchesDateRange = orderDate >= dateRange.from;
      }
    }

    return matchesStatus && matchesStore && matchesSearch && matchesDateRange;
  });

  // Group orders by store name
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.storeName]) {
      acc[order.storeName] = [];
    }
    acc[order.storeName].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const getCountsByStatus = () => {
    // Use API counts if available, otherwise calculate from local orders
    if (Object.keys(statusCounts).length > 0) {
      return {
        ACCEPTED: statusCounts.ACCEPTED || 0,
        IN_PROGRESS: statusCounts.IN_PROGRESS || 0,
        COMPLETED: statusCounts.COMPLETED || 0,
        PENDING: statusCounts.PENDING || 0,
      };
    }
    return {
      ACCEPTED: orders.filter((o) => o.status === "ACCEPTED").length,
      IN_PROGRESS: orders.filter((o) => o.status === "IN_PROGRESS").length,
      COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
      PENDING: orders.filter((o) => o.status === "PENDING").length,
    };
  };

  const counts = getCountsByStatus();

  const handleMarkInProgress = (orderId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Determine the new status based on current status
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newStatus = order.status === "ACCEPTED" ? "IN_PROGRESS" : "COMPLETED";
    handleStatusUpdate(orderId, newStatus);
  };

  return (
    <div className="min-h-screen bg-white">
      <VendorTopNav onMenuClick={handleSidebarToggle} vendorName={vendorName} />
      <VendorSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => {
          if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setSidebarCollapsed(!sidebarCollapsed);
          } else {
            setSidebarOpen(false);
          }
        }}
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
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Notice</p>
                <p className="text-sm text-amber-700">{error}</p>
              </div>
              <button
                className="text-amber-500 hover:text-amber-700"
                onClick={() => setError(null)}
              >
                ✕
              </button>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              My Orders
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage orders across all your stores
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-[#E5E7EB] rounded-t-2xl">
            <div className="flex border-b border-[#E5E7EB]">
              <button
                onClick={() => setActiveTab("ACCEPTED")}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === "ACCEPTED"
                    ? "text-[#1F2937] border-b-2 border-[#1F2937] -mb-[1px]"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <span className="flex items-center gap-2">
                  Accepted
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                      activeTab === "ACCEPTED"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {counts.ACCEPTED}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("IN_PROGRESS")}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === "IN_PROGRESS"
                    ? "text-[#1F2937] border-b-2 border-[#1F2937] -mb-[1px]"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <span className="flex items-center gap-2">
                  In Progress
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                      activeTab === "IN_PROGRESS"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {counts.IN_PROGRESS}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("COMPLETED")}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === "COMPLETED"
                    ? "text-[#1F2937] border-b-2 border-[#1F2937] -mb-[1px]"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <span className="flex items-center gap-2">
                  Completed
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                      activeTab === "COMPLETED"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {counts.COMPLETED}
                  </span>
                </span>
              </button>
            </div>

            {/* Filters */}
            <div className="p-6 pb-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row gap-4">
              {/* Store Filter */}
              <div className="w-full sm:w-[240px]">
                <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                  Filter by Store
                </label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores.map((store) => (
                      <SelectItem key={store} value={store}>
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                  Search Orders
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    type="text"
                    placeholder="Search by order # or customer name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="w-full sm:w-[240px]">
                <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                  Filter by Date
                </label>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>
            </div>

            {/* Orders Content */}
            <div className="p-6">
              {Object.keys(groupedOrders).length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-[#6B7280]">No orders found</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedOrders).map(([storeName, storeOrders]) => (
                    <div key={storeName}>
                      {/* Store Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-[#1F2937]">
                          {storeName}
                        </h3>
                        <span className="text-sm text-[#6B7280]">
                          {storeOrders.length} {storeOrders.length === 1 ? "order" : "orders"}
                        </span>
                      </div>

                      {/* Orders List */}
                      <div className="space-y-3">
                        {storeOrders.map((order) => (
                          <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#9CA3AF] transition-colors cursor-pointer"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                              {/* Order Info */}
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Order Number & Service */}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-[#1F2937]">
                                      {order.orderNumber}
                                    </p>
                                    <span className="text-[#D1D5DB]">•</span>
                                    <p className="text-sm text-[#6B7280] truncate">
                                      {order.serviceName}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-[#6B7280] flex-wrap">
                                    {/* Customer */}
                                    <div className="flex items-center gap-1.5">
                                      <User className="w-4 h-4" />
                                      <span>{order.customerName}</span>
                                    </div>
                                    {/* Date & Time */}
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        {new Date(order.date).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}, {order.time}
                                      </span>
                                    </div>
                                    {/* Price */}
                                    <div className="flex items-center gap-1.5">
                                      <DollarSign className="w-4 h-4" />
                                      <span className="font-semibold text-[#1F2937]">
                                        ${order.total.toFixed(2)}
                                      </span>
                                    </div>
                                    {/* Item Count (if applicable) */}
                                    {order.itemCount && (
                                      <div className="flex items-center gap-1.5">
                                        <Package className="w-4 h-4" />
                                        <span>{order.itemCount} items</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              {activeTab === "ACCEPTED" && (
                                <Button
                                  onClick={(e) => handleMarkInProgress(order.id, e)}
                                  className="bg-[#1F2937] hover:bg-[#111827] text-white h-10 px-4 shrink-0 w-full sm:w-auto text-sm"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  <span className="hidden sm:inline">Mark In Progress</span>
                                  <span className="sm:hidden">In Progress</span>
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              )}
                              {activeTab === "IN_PROGRESS" && (
                                <Button
                                  onClick={(e) => handleMarkInProgress(order.id, e)}
                                  className="bg-[#1F2937] hover:bg-[#111827] text-white h-10 px-4 shrink-0 w-full sm:w-auto text-sm"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  <span className="hidden sm:inline">Mark as Complete</span>
                                  <span className="sm:hidden">Complete</span>
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Order Detail Modal */}
      <VendorOrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onMarkInProgress={() => {
          if (selectedOrder) {
            handleMarkInProgress(selectedOrder.id);
            setSelectedOrder(null);
          }
        }}
      />
    </div>
  );
}