import { useCallback, useEffect, useState } from "react";
import { Search, User, Calendar, DollarSign, Package, Clock, Check, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import api from "../../../services/api";
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

type OrderStatus = "pending" | "accepted" | "in-progress" | "completed" | "declined" | "cancelled";

// Map server enum (BookingStatus / OrderStatus) → UI tab key
const toUiStatus = (server: string | undefined): OrderStatus => {
  const s = (server || "").toUpperCase();
  if (s === "PENDING") return "pending";
  if (s === "ACCEPTED") return "accepted";
  if (s === "IN_PROGRESS") return "in-progress";
  if (s === "COMPLETED") return "completed";
  if (s === "DECLINED") return "declined";
  if (s === "CANCELLED") return "cancelled";
  return "pending";
};

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
  // Discriminator — bookings use PUT /bookings/:id/status, orders use PATCH /orders/:id/status.
  kind: "booking" | "order";
}

export function VendorOrders() {
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

  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [actingId, setActingId] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = useCallback(async () => {
    const [bookingsRes, ordersRes] = await Promise.all([
      api.get<{ success: boolean; data: any[] }>("/api/v1/vendors/me/bookings?limit=200").catch(() => null),
      api.get<{ success: boolean; data: any[] }>("/api/v1/vendors/me/orders?limit=200").catch(() => null),
    ]);
    const fromBookings = ((bookingsRes as any)?.data || []).map((b: any) => ({
      kind: "booking" as const,
      id: b.id,
      orderNumber: `BK-${b.id.slice(-6).toUpperCase()}`,
      storeName: b.vendor?.businessName || "Your Store",
      customerName: b.user?.profile ? `${b.user.profile.firstName ?? ""} ${b.user.profile.lastName ?? ""}`.trim() || b.user.email : b.user?.email || "Customer",
      customerEmail: b.user?.email || "",
      customerPhone: b.user?.phone || "",
      total: Number(b.total || 0),
      date: b.scheduledDate || b.createdAt,
      time: b.scheduledTime || "—",
      status: toUiStatus(b.status),
      serviceName: b.beautyListing?.title || b.cleaningListing?.title || b.handymanListing?.title || b.category,
      type: "service" as const,
      serviceDetails: {
        service: b.beautyListing?.title || b.cleaningListing?.title || b.handymanListing?.title || b.category,
        category: b.category,
        scheduledDate: b.scheduledDate || b.createdAt,
        time: b.scheduledTime || "—",
        duration: b.duration ? `${b.duration} min` : "—",
        serviceAddress: b.address ? `${b.address.street}, ${b.address.city}, ${b.address.state}` : "—",
        specialInstructions: b.specialInstructions || "",
      },
    }));
    const fromOrders = ((ordersRes as any)?.data || []).map((o: any) => ({
      kind: "order" as const,
      id: o.id,
      orderNumber: `OR-${o.id.slice(-6).toUpperCase()}`,
      storeName: o.vendor?.businessName || "Your Store",
      customerName: o.user?.email || "Customer",
      customerEmail: o.user?.email || "",
      customerPhone: o.user?.phone || "",
      total: Number(o.total || 0),
      date: o.createdAt,
      time: "—",
      status: toUiStatus(o.status),
      serviceName: "Order",
      itemCount: o.items?.length ?? 0,
      type: "delivery" as const,
      deliveryDetails: {
        items: (o.items || []).map((i: any) => ({ name: i.name || "Item", quantity: i.quantity, price: Number(i.price || 0) })),
        deliveryAddress: o.address ? `${o.address.street}, ${o.address.city}, ${o.address.state}` : "—",
        deliveryWindow: "—",
        specialInstructions: "",
      },
    }));
    setOrders([...fromBookings, ...fromOrders]);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const transition = useCallback(
    async (row: Order, nextStatus: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED") => {
      if (actingId) return;
      setActingId(row.id);
      try {
        if (row.kind === "booking") {
          await api.put(`/api/v1/bookings/${row.id}/status`, { status: nextStatus });
        } else {
          await api.patch(`/api/v1/orders/${row.id}/status`, { status: nextStatus });
        }
        toast.success(`Order ${nextStatus.toLowerCase().replace("_", " ")}`);
        setSelectedOrder(null);
        await loadOrders();
      } catch (e: any) {
        toast.error(e?.response?.data?.error || e?.message || "Failed to update status");
      } finally {
        setActingId(null);
      }
    },
    [actingId, loadOrders]
  );

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
    return {
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      "in-progress": orders.filter((o) => o.status === "in-progress").length,
      completed: orders.filter((o) => o.status === "completed").length,
      declined: orders.filter((o) => o.status === "declined").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  };

  const counts = getCountsByStatus();

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <VendorTopNav onMenuClick={handleSidebarToggle} />
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
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              My Orders
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage orders across all your stores
            </p>
          </div>

          {/* Tab Navigation — mobile-style pill segment control */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl shadow-[0_4px_16px_rgba(46,122,217,0.18)] overflow-hidden">
            <div className="flex gap-2 p-3 overflow-x-auto">
              {(["pending", "accepted", "in-progress", "completed"] as const).map((tab) => {
                const isActive = activeTab === tab;
                const label =
                  tab === "pending"
                    ? "Pending"
                    : tab === "accepted"
                    ? "Accepted"
                    : tab === "in-progress"
                    ? "In Progress"
                    : "Completed";
                const count = counts[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#2E7AD9] text-white shadow-[0_4px_12px_rgba(46,122,217,0.3)]"
                        : "bg-[rgba(46,122,217,0.08)] text-[#1A1A2E] hover:bg-[rgba(46,122,217,0.15)] hover:text-[#2E7AD9]"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold ${
                        isActive ? "bg-white/25 text-white" : "bg-[#2E7AD9] text-white"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filters */}
            <div className="p-6 pb-4 border-b border-[rgba(46,122,217,0.25)] flex flex-col sm:flex-row gap-4">
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
                        <h3 className="text-base font-bold text-[#1A1A2E]">
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
                            className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 hover:border-[#9CA3AF] transition-colors cursor-pointer shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                              {/* Order Info */}
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Order Number & Service */}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-[#1A1A2E]">
                                      {order.orderNumber}
                                    </p>
                                    <span className="text-[rgba(46, 122, 217, 0.18)]">•</span>
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
                                      <span className="font-semibold text-[#1A1A2E]">
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

                              {/* Action Buttons */}
                              {activeTab === "pending" && (
                                <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                                  <Button
                                    onClick={(e) => { e.stopPropagation(); transition(order, "ACCEPTED"); }}
                                    disabled={actingId === order.id}
                                    className="flex-1 sm:flex-none bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white h-10 px-4 text-sm"
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={(e) => { e.stopPropagation(); transition(order, "DECLINED"); }}
                                    disabled={actingId === order.id}
                                    variant="outline"
                                    className="flex-1 sm:flex-none h-10 px-4 text-sm border-[#DC2626] text-[#DC2626] hover:bg-[#FEE2E2]"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Decline
                                  </Button>
                                </div>
                              )}
                              {activeTab === "accepted" && (
                                <Button
                                  onClick={(e) => { e.stopPropagation(); transition(order, "IN_PROGRESS"); }}
                                  disabled={actingId === order.id}
                                  className="bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white h-10 px-4 shrink-0 w-full sm:w-auto text-sm"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  <span className="hidden sm:inline">Mark In Progress</span>
                                  <span className="sm:hidden">In Progress</span>
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              )}
                              {activeTab === "in-progress" && (
                                <Button
                                  onClick={(e) => { e.stopPropagation(); transition(order, "COMPLETED"); }}
                                  disabled={actingId === order.id}
                                  className="bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white h-10 px-4 shrink-0 w-full sm:w-auto text-sm"
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
          if (!selectedOrder) return;
          // From modal we advance the most likely next state for the current status.
          const next: "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" =
            selectedOrder.status === "pending"
              ? "ACCEPTED"
              : selectedOrder.status === "accepted"
              ? "IN_PROGRESS"
              : "COMPLETED";
          transition(selectedOrder, next);
        }}
      />
    </div>
  );
}