import { useEffect, useState } from "react";
import api from "../../../services/api";
import {
  Search,
  ChevronRight,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Package,
  Home,
  X,
  Wrench,
  ShoppingCart,
  UtensilsCrossed,
  Gift,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { DateRangePicker } from "../ui/date-range-picker";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

// Order type definitions
type OrderStatus = "accepted" | "in-progress" | "completed";
type OrderCategory = "service" | "grocery" | "food" | "rental" | "product";

interface BaseOrder {
  id: string;
  orderNumber: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  date: string;
  time: string;
  status: OrderStatus;
  rawStatus?: string; // raw backend status for badges (e.g. CANCELLED, OUT_FOR_DELIVERY)
  category: OrderCategory;
  // Rewards
  pointsEarned?: number;
  pointsRedeemed?: number;
  pointsDiscount?: number;
}

interface ServiceOrder extends BaseOrder {
  category: "service";
  serviceName: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  duration: string;
  specialInstructions?: string;
}

interface GroceryOrder extends BaseOrder {
  category: "grocery" | "food";
  items: Array<{ name: string; quantity: number; price: number }>;
  itemCount: number;
  deliveryAddress: string;
  deliveryWindow: string;
  specialInstructions?: string;
}

interface RentalOrder extends BaseOrder {
  category: "rental";
  propertyName: string;
  propertyAddress: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

interface ProductOrder extends BaseOrder {
  category: "product";
  productName: string;
  quantity: number;
  shippingAddress: string;
  estimatedDelivery: string;
}

type Order = ServiceOrder | GroceryOrder | RentalOrder | ProductOrder;

export function MichelleOrders() {
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

  // Orders state
  const [activeTab, setActiveTab] = useState<OrderStatus>("accepted");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Default to "last 12 months" so seeded bookings/orders are visible.
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const to = new Date();
    const from = new Date();
    from.setFullYear(from.getFullYear() - 1);
    return { from, to };
  });

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Pull both bookings (services) + orders (e-commerce) and merge into the
    // unified Order shape this screen expects.
    Promise.all([
      api.get<{ success: boolean; data: any[] }>("/api/v1/admin/bookings?limit=200").catch(() => ({ data: [] })),
      api.get<{ success: boolean; data: any[] }>("/api/v1/admin/orders?limit=200").catch(() => ({ data: [] })),
    ]).then(([bookingsRes, ordersRes]) => {
      const mapBackendStatus = (s: string | undefined): "accepted" | "in-progress" | "completed" => {
        const v = String(s || "").toUpperCase();
        if (v === "IN_PROGRESS" || v === "OUT_FOR_DELIVERY") return "in-progress";
        if (v === "COMPLETED" || v === "CANCELLED" || v === "DECLINED") return "completed";
        return "accepted"; // PENDING + ACCEPTED + anything else
      };
      const bookings: Order[] = ((bookingsRes as any).data || []).map((b: any) => ({
        id: b.id,
        orderNumber: `BK-${b.id.slice(-6).toUpperCase()}`,
        storeId: b.vendorId,
        storeName: b.vendor?.businessName || "Unknown",
        customerName: b.user?.profile ? `${b.user.profile.firstName ?? ""} ${b.user.profile.lastName ?? ""}`.trim() || b.user.email : b.user?.email || "Customer",
        customerEmail: b.user?.email || "",
        customerPhone: b.user?.phone || "",
        total: Number(b.total || 0),
        date: b.scheduledDate || b.createdAt,
        time: b.scheduledTime || "—",
        status: mapBackendStatus(b.status),
        rawStatus: b.status,
        category: "service",
        serviceName: b.beautyListing?.title || b.cleaningListing?.title || b.handymanListing?.title || b.category,
        serviceType: b.category,
        scheduledDate: b.scheduledDate || b.createdAt,
        scheduledTime: b.scheduledTime || "—",
        serviceAddress: b.address ? `${b.address.street}, ${b.address.city}, ${b.address.state}` : "—",
        duration: b.duration ? `${b.duration} min` : "—",
        specialInstructions: b.specialInstructions,
        pointsEarned: b.pointsEarned,
      }));
      const orders: Order[] = ((ordersRes as any).data || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber || `OR-${o.id.slice(-6).toUpperCase()}`,
        storeId: o.vendorId,
        storeName: o.vendor?.businessName || "Unknown",
        customerName: o.user?.profile ? `${o.user.profile.firstName ?? ""} ${o.user.profile.lastName ?? ""}`.trim() || o.user.email : o.user?.email || "Customer",
        customerEmail: o.user?.email || "",
        customerPhone: o.user?.phone || "",
        total: Number(o.total || 0),
        date: o.createdAt,
        time: "—",
        status: mapBackendStatus(o.status),
        rawStatus: o.status,
        category: "grocery",
        items: (o.items || []).map((i: any) => ({ name: i.name || "Item", quantity: i.quantity, price: Number(i.price || 0) })),
        itemCount: o.items?.length ?? 0,
        deliveryAddress: o.address ? `${o.address.street}, ${o.address.city}, ${o.address.state}` : "—",
        deliveryWindow: "—",
      }));
      setOrders([...bookings, ...orders]);
    });
  }, []);

  // Get unique stores for filter with category
  const storesMap = new Map<string, { id: string; name: string; category: OrderCategory }>();
  orders.filter((order) => order.storeId !== "petcare-plus").forEach((order) => {
    if (!storesMap.has(order.storeId)) {
      storesMap.set(order.storeId, {
        id: order.storeId,
        name: order.storeName,
        category: order.category,
      });
    }
  });
  const stores = Array.from(storesMap.values());

  // Get category icon (emoji)
  const getStoreEmoji = (storeId: string) => {
    const emojiMap: Record<string, string> = {
      "cleanco": "🧹",
      "beauty-michelle": "💄",
      "fresh-market": "🛒",
      "homestyle-rentals": "🏠",
      "handypro": "🔧",
      "gourmet-kitchen": "🍔",
      "caring-hands": "💛",
      "glam-products": "💅",
    };
    return emojiMap[storeId] || "🔧";
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Exclude PetCare Plus orders
    if (order.storeId === "petcare-plus") return false;
    
    const matchesStatus = order.status === activeTab;
    const matchesStore = selectedStore === "all" || order.storeId === selectedStore;
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

  // Group orders by store
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.storeId]) {
      acc[order.storeId] = {
        storeName: order.storeName,
        orders: [],
      };
    }
    acc[order.storeId].orders.push(order);
    return acc;
  }, {} as Record<string, { storeName: string; orders: Order[] }>);

  // Count orders by status
  const statusCounts = {
    accepted: orders.filter((o) => o.status === "accepted").length,
    "in-progress": orders.filter((o) => o.status === "in-progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  // Open order details
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get next status
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    if (currentStatus === "accepted") return "in-progress";
    if (currentStatus === "in-progress") return "completed";
    return null;
  };

  // Get status button text
  const getStatusButtonText = (status: OrderStatus): string => {
    if (status === "accepted") return "Mark In Progress";
    if (status === "in-progress") return "Mark Completed";
    return "";
  };

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
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">
              Michelle's Orders
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage orders across all Michelle's stores
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)} className="w-full">
            {/* Desktop Tabs — mobile-style pill segment control */}
            <div className="hidden sm:block">
              <TabsList className="w-full bg-white border border-[rgba(46,122,217,0.25)] rounded-2xl shadow-[0_4px_16px_rgba(46,122,217,0.18)] p-3 gap-2 h-auto mb-6">
                <TabsTrigger
                  value="accepted"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-semibold transition-all bg-[rgba(46,122,217,0.08)] text-[#1A1A2E] hover:bg-[rgba(46,122,217,0.15)] hover:text-[#2E7AD9] data-[state=active]:bg-[#2E7AD9] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_12px_rgba(46,122,217,0.3)]"
                >
                  Accepted
                  {statusCounts.accepted > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold bg-[#2E7AD9] text-white data-[state=active]:bg-white/25">
                      {statusCounts.accepted}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-semibold transition-all bg-[rgba(46,122,217,0.08)] text-[#1A1A2E] hover:bg-[rgba(46,122,217,0.15)] hover:text-[#2E7AD9] data-[state=active]:bg-[#2E7AD9] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_12px_rgba(46,122,217,0.3)]"
                >
                  In Progress
                  {statusCounts["in-progress"] > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold bg-[#2E7AD9] text-white">
                      {statusCounts["in-progress"]}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="flex-1 flex items-center justify-center py-3 px-4 rounded-full text-sm font-semibold transition-all bg-[rgba(46,122,217,0.08)] text-[#1A1A2E] hover:bg-[rgba(46,122,217,0.15)] hover:text-[#2E7AD9] data-[state=active]:bg-[#2E7AD9] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_12px_rgba(46,122,217,0.3)]"
                >
                  Completed
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Mobile Tab Selector */}
            <div className="sm:hidden mb-4">
              <Select value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)}>
                <SelectTrigger className="h-12 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accepted">
                    Accepted {statusCounts.accepted > 0 && `(${statusCounts.accepted})`}
                  </SelectItem>
                  <SelectItem value="in-progress">
                    In Progress {statusCounts["in-progress"] > 0 && `(${statusCounts["in-progress"]})`}
                  </SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filters */}
            <div className="bg-white border border-[rgba(46,122,217,0.30)] rounded-xl shadow-[0_4px_16px_rgba(46,122,217,0.10)] p-4 sm:p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="store-filter" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                    Filter by Store
                  </Label>
                  <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger id="store-filter" className="h-10">
                      <SelectValue placeholder="All Stores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      {stores.map((store) => {
                        const emoji = getStoreEmoji(store.id);
                        return (
                          <SelectItem key={store.id} value={store.id}>
                            <div className="flex items-center gap-2">
                              <span>{emoji}</span>
                              <span>-</span>
                              <span>{store.name}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="search" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                    Search Orders
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by order # or customer name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="date-filter" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                    Filter by Date
                  </Label>
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                  />
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent value={activeTab} className="mt-0">
              {Object.keys(groupedOrders).length === 0 ? (
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-12 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <Package className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {searchQuery || selectedStore !== "all"
                      ? "Try adjusting your filters"
                      : `No ${activeTab} orders at this time`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedOrders).map(([storeId, { storeName, orders: storeOrders }]) => (
                    <div key={storeId} className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      {/* Store Header */}
                      <div className="bg-white border-b border-[rgba(46,122,217,0.25)] px-6 py-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-[#1A1A2E]">
                            {storeName}
                          </h3>
                          <span className="text-sm text-[#6B7280]">
                            {storeOrders.length} {storeOrders.length === 1 ? "order" : "orders"}
                          </span>
                        </div>
                      </div>

                      {/* Orders List */}
                      <div className="divide-y divide-[rgba(46,122,217, 0.12)]">
                        {storeOrders.map((order) => (
                          <div
                            key={order.id}
                            className="p-6 hover:bg-white transition-colors cursor-pointer"
                            onClick={() => openOrderDetails(order)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* Order Info */}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-sm font-semibold text-[#1A1A2E]">
                                    {order.orderNumber}
                                  </span>
                                  <span className="text-sm text-[#6B7280]">•</span>
                                  <span className="text-sm text-[#6B7280]">
                                    {order.category === "service" && (order as ServiceOrder).serviceName}
                                    {order.category === "grocery" && "Grocery Delivery"}
                                    {order.category === "food" && "Food Delivery"}
                                    {order.category === "rental" && (order as RentalOrder).propertyName}
                                    {order.category === "product" && (order as ProductOrder).productName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap text-sm text-[#6B7280]">
                                  <div className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {order.customerName}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(order.date).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}, {order.time}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4" />
                                    {formatCurrency(order.total)}
                                  </div>
                                  {(order.category === "grocery" || order.category === "food") && (
                                    <div className="flex items-center gap-1.5">
                                      <Package className="w-4 h-4" />
                                      {(order as GroceryOrder).itemCount} items
                                    </div>
                                  )}
                                  {order.pointsEarned && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-xs font-medium">
                                      <Gift className="w-3 h-3" />
                                      +{order.pointsEarned} pts
                                    </span>
                                  )}
                                  {order.pointsRedeemed && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                      -{order.pointsRedeemed} pts used
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Button */}
                              {getNextStatus(order.status) ? (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(order.id, getNextStatus(order.status)!);
                                  }}
                                  className="w-full sm:w-auto text-sm"
                                >
                                  {order.status === "accepted" && (
                                    <Clock className="w-4 h-4 mr-2" />
                                  )}
                                  {order.status === "in-progress" && (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                  )}
                                  {order.status === "accepted" && (
                                    <>
                                      <span className="hidden sm:inline">Mark In Progress</span>
                                      <span className="sm:hidden">In Progress</span>
                                    </>
                                  )}
                                  {order.status === "in-progress" && (
                                    <>
                                      <span className="hidden sm:inline">Mark Completed</span>
                                      <span className="sm:hidden">Complete</span>
                                    </>
                                  )}
                                  <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openOrderDetails(order);
                                  }}
                                  className="w-full sm:w-auto"
                                >
                                  View Details
                                  <ChevronRight className="w-4 h-4 ml-2" />
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
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Order Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1A1A2E]">
              Order Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              View complete details and information for this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Order Header */}
              <div className="pb-4 border-b border-[rgba(46,122,217,0.25)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-[#1A1A2E]">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full capitalize bg-[#F0F7FF] text-[#1A1A2E]">
                    {selectedOrder.status.replace("-", " ")}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280]">{selectedOrder.storeName}</p>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">
                  Customer Information
                </h3>
                <div className="bg-white rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-[#6B7280] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {selectedOrder.customerName}
                      </p>
                      <p className="text-sm text-[#6B7280]">{selectedOrder.customerEmail}</p>
                      <p className="text-sm text-[#6B7280]">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service-Specific Details */}
              {selectedOrder.category === "service" && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">
                    Service Details
                  </h3>
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Service</p>
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {(selectedOrder as ServiceOrder).serviceName}
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {(selectedOrder as ServiceOrder).serviceType}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Scheduled Date</p>
                        <p className="text-sm font-medium text-[#1A1A2E]">
                          {new Date((selectedOrder as ServiceOrder).scheduledDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Time</p>
                        <p className="text-sm font-medium text-[#1A1A2E]">
                          {(selectedOrder as ServiceOrder).scheduledTime}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Duration</p>
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {(selectedOrder as ServiceOrder).duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Service Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1A1A2E]">
                          {(selectedOrder as ServiceOrder).serviceAddress}
                        </p>
                      </div>
                    </div>
                    {(selectedOrder as ServiceOrder).specialInstructions && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Special Instructions</p>
                        <p className="text-sm text-[#1A1A2E]">
                          {(selectedOrder as ServiceOrder).specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Grocery/Food-Specific Details */}
              {(selectedOrder.category === "grocery" || selectedOrder.category === "food") && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">
                    Order Details
                  </h3>
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-2">Items ({(selectedOrder as GroceryOrder).itemCount})</p>
                      <div className="space-y-2">
                        {(selectedOrder as GroceryOrder).items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-[#1A1A2E]">
                              {item.name} <span className="text-[#6B7280]">x{item.quantity}</span>
                            </span>
                            <span className="font-medium text-[#1A1A2E]">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[rgba(46,122,217,0.25)]">
                      <p className="text-xs text-[#6B7280] mb-1">Delivery Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1A1A2E]">
                          {(selectedOrder as GroceryOrder).deliveryAddress}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Delivery Window</p>
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {(selectedOrder as GroceryOrder).deliveryWindow}
                      </p>
                    </div>
                    {(selectedOrder as GroceryOrder).specialInstructions && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Special Instructions</p>
                        <p className="text-sm text-[#1A1A2E]">
                          {(selectedOrder as GroceryOrder).specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rental-Specific Details */}
              {selectedOrder.category === "rental" && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">
                    Rental Details
                  </h3>
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Property</p>
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {(selectedOrder as RentalOrder).propertyName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Property Address</p>
                      <div className="flex items-start gap-2">
                        <Home className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1A1A2E]">
                          {(selectedOrder as RentalOrder).propertyAddress}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Check-In</p>
                        <p className="text-sm font-medium text-[#1A1A2E]">
                          {new Date((selectedOrder as RentalOrder).checkInDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Check-Out</p>
                        <p className="text-sm font-medium text-[#1A1A2E]">
                          {new Date((selectedOrder as RentalOrder).checkOutDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Number of Guests</p>
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {(selectedOrder as RentalOrder).numberOfGuests}
                      </p>
                    </div>
                    {(selectedOrder as RentalOrder).specialRequests && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Special Requests</p>
                        <p className="text-sm text-[#1A1A2E]">
                          {(selectedOrder as RentalOrder).specialRequests}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Product-Specific Details */}
              {selectedOrder.category === "product" && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">
                    Product Details
                  </h3>
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Product</p>
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {(selectedOrder as ProductOrder).productName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Quantity</p>
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {(selectedOrder as ProductOrder).quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Shipping Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1A1A2E]">
                          {(selectedOrder as ProductOrder).shippingAddress}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Estimated Delivery</p>
                      <p className="text-sm font-medium text-[#1A1A2E]">
                        {(selectedOrder as ProductOrder).estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">
                  Order Summary
                </h3>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1A1A2E]">Total</span>
                    <span className="text-lg font-bold text-[#1A1A2E]">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rewards Impact */}
              {(selectedOrder.pointsEarned || selectedOrder.pointsRedeemed) && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-500" />
                    Rewards Impact
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                    {selectedOrder.pointsEarned && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-amber-800">Points Earned</span>
                        <span className="text-sm font-bold text-amber-600">
                          +{selectedOrder.pointsEarned} pts
                        </span>
                      </div>
                    )}
                    {selectedOrder.pointsRedeemed && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-800">Points Redeemed</span>
                        <span className="text-sm font-bold text-green-600">
                          -{selectedOrder.pointsRedeemed} pts
                          {selectedOrder.pointsDiscount && (
                            <span className="text-green-500 ml-1">
                              ({formatCurrency(selectedOrder.pointsDiscount)} discount)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Change Button */}
              {getNextStatus(selectedOrder.status) && (
                <div className="pt-4 border-t border-[rgba(46,122,217,0.25)]">
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                    }}
                    className="w-full"
                    size="lg"
                  >
                    {selectedOrder.status === "accepted" && (
                      <Clock className="w-5 h-5 mr-2" />
                    )}
                    {selectedOrder.status === "in-progress" && (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    )}
                    {getStatusButtonText(selectedOrder.status)}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}