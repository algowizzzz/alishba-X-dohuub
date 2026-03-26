import { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import { api } from "../../../services/api";

// Order type definitions - using uppercase to match backend API
type OrderStatus = "ACCEPTED" | "PREPARING" | "COMPLETED";
type OrderCategory = "service" | "grocery" | "food" | "rental" | "product";

// Display mapping for UI
const statusDisplayMap: Record<OrderStatus, string> = {
  ACCEPTED: "Accepted",
  PREPARING: "In Progress",
  COMPLETED: "Completed",
};

// Normalize status from API (handles various formats)
const normalizeStatus = (status: string | undefined): OrderStatus => {
  if (!status) return "ACCEPTED";
  const upper = status.toUpperCase().replace(/[- ]/g, '_');
  // Map various backend status values to our three states
  if (upper === "ACCEPTED" || upper === "PENDING") return "ACCEPTED";
  if (upper === "PREPARING" || upper === "IN_PROGRESS" || upper === "READY" || upper === "OUT_FOR_DELIVERY") return "PREPARING";
  if (upper === "COMPLETED" || upper === "DELIVERED") return "COMPLETED";
  return "ACCEPTED"; // Default fallback
};

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
  category: OrderCategory;
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

interface StoreOption {
  id: string;
  name: string;
}

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

  // State
  const [activeTab, setActiveTab] = useState<OrderStatus>("ACCEPTED");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: any = await api.get('/admin/orders');
      const data = response?.data || response;
      const ordersArray = Array.isArray(data) ? data : data?.orders || [];

      // Transform API response to component format
      const transformedOrders: Order[] = ordersArray.map((o: any) => {
        const baseOrder = {
          id: o.id,
          orderNumber: o.orderNumber || o.id,
          storeId: o.storeId || o.store?.id || 'unknown',
          storeName: o.storeName || o.store?.name || 'Unknown Store',
          customerName: o.customerName || o.customer?.name || 'Unknown',
          customerEmail: o.customerEmail || o.customer?.email || '',
          customerPhone: o.customerPhone || o.customer?.phone || '',
          total: o.total || o.amount || 0,
          date: o.date || o.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          time: o.time || new Date(o.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          status: normalizeStatus(o.status),
          category: (o.category || o.type || 'service').toLowerCase() as OrderCategory,
        };

        // Add category-specific fields
        if (baseOrder.category === 'service') {
          return {
            ...baseOrder,
            category: 'service' as const,
            serviceName: o.serviceName || o.service?.name || 'Service',
            serviceType: o.serviceType || o.service?.type || 'General',
            scheduledDate: o.scheduledDate || o.date,
            scheduledTime: o.scheduledTime || o.time,
            serviceAddress: o.serviceAddress || o.address || '',
            duration: o.duration || '1 hour',
            specialInstructions: o.specialInstructions || o.notes,
          };
        } else if (baseOrder.category === 'grocery' || baseOrder.category === 'food') {
          return {
            ...baseOrder,
            category: baseOrder.category as 'grocery' | 'food',
            items: o.items || [],
            itemCount: o.itemCount || o.items?.length || 0,
            deliveryAddress: o.deliveryAddress || o.address || '',
            deliveryWindow: o.deliveryWindow || o.deliveryTime || '',
            specialInstructions: o.specialInstructions || o.notes,
          };
        } else if (baseOrder.category === 'rental') {
          return {
            ...baseOrder,
            category: 'rental' as const,
            propertyName: o.propertyName || o.property?.name || 'Property',
            propertyAddress: o.propertyAddress || o.property?.address || '',
            checkInDate: o.checkInDate || o.startDate || '',
            checkOutDate: o.checkOutDate || o.endDate || '',
            numberOfGuests: o.numberOfGuests || o.guests || 1,
            specialRequests: o.specialRequests || o.notes,
          };
        } else {
          return {
            ...baseOrder,
            category: 'product' as const,
            productName: o.productName || o.product?.name || 'Product',
            quantity: o.quantity || 1,
            shippingAddress: o.shippingAddress || o.address || '',
            estimatedDelivery: o.estimatedDelivery || 'TBD',
          };
        }
      });

      setOrders(transformedOrders);

      // Extract unique stores
      const uniqueStores: StoreOption[] = [];
      transformedOrders.forEach(order => {
        if (!uniqueStores.find(s => s.id === order.storeId)) {
          uniqueStores.push({ id: order.storeId, name: order.storeName });
        }
      });
      setStores(uniqueStores);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err?.response?.data?.error || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
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
    ACCEPTED: orders.filter((o) => o.status === "ACCEPTED").length,
    PREPARING: orders.filter((o) => o.status === "PREPARING").length,
    COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
  };

  // Handle status change
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setDetailsOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error('Failed to update order status:', err);
      // Optimistic update - still update locally even if API fails
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setDetailsOpen(false);
      setSelectedOrder(null);
    }
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
    if (currentStatus === "ACCEPTED") return "PREPARING";
    if (currentStatus === "PREPARING") return "COMPLETED";
    return null;
  };

  // Get status button text
  const getStatusButtonText = (status: OrderStatus): string => {
    if (status === "ACCEPTED") return "Mark In Progress";
    if (status === "PREPARING") return "Mark Completed";
    return "";
  };

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
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Michelle's Orders
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage orders across all Michelle's stores
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[#FEE2E2] border border-[#DC2626] text-[#991B1B] flex items-center justify-between">
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={fetchOrders}
                className="ml-4 px-3 py-1 text-sm border border-[#DC2626] rounded hover:bg-[#FEE2E2]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)} className="w-full">
            {/* Desktop Tabs */}
            <div className="hidden sm:block">
              <TabsList className="w-full justify-start bg-white border border-[#E5E7EB] rounded-t-xl h-[52px] p-0 mb-0">
                <TabsTrigger
                  value="ACCEPTED"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  Accepted
                  {statusCounts.ACCEPTED > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-[#FEF3C7] text-[#92400E] rounded-full">
                      {statusCounts.ACCEPTED}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="PREPARING"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  In Progress
                  {statusCounts.PREPARING > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-[#DBEAFE] text-[#1E40AF] rounded-full">
                      {statusCounts.PREPARING}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="COMPLETED"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  Completed
                  {statusCounts.COMPLETED > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-[#D1FAE5] text-[#065F46] rounded-full">
                      {statusCounts.COMPLETED}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Mobile Tabs */}
            <div className="sm:hidden mb-4">
              <Select value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACCEPTED">Accepted ({statusCounts.ACCEPTED})</SelectItem>
                  <SelectItem value="PREPARING">In Progress ({statusCounts.PREPARING})</SelectItem>
                  <SelectItem value="COMPLETED">Completed ({statusCounts.COMPLETED})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#F9FAFB] border-x border-b border-[#E5E7EB] rounded-b-xl p-4 sm:p-5 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="w-full sm:w-[200px] h-11">
                    <SelectValue placeholder="All Stores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-[#6B7280] animate-spin" />
                </div>
              ) : Object.keys(groupedOrders).length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
                  <p className="text-[#6B7280]">No orders found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedOrders).map(([storeId, { storeName, orders: storeOrders }]) => (
                    <div
                      key={storeId}
                      className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden"
                    >
                      {/* Store Header */}
                      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-6 py-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-[#1F2937]">
                            {storeName}
                          </h3>
                          <span className="text-sm text-[#6B7280]">
                            {storeOrders.length} {storeOrders.length === 1 ? "order" : "orders"}
                          </span>
                        </div>
                      </div>

                      {/* Orders List */}
                      <div className="divide-y divide-[#E5E7EB]">
                        {storeOrders.map((order) => (
                          <div
                            key={order.id}
                            className="p-6 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                            onClick={() => openOrderDetails(order)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* Order Info */}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-sm font-semibold text-[#1F2937]">
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
                                  {order.status === "ACCEPTED" && (
                                    <Clock className="w-4 h-4 mr-2" />
                                  )}
                                  {order.status === "PREPARING" && (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                  )}
                                  {order.status === "ACCEPTED" && (
                                    <>
                                      <span className="hidden sm:inline">Mark In Progress</span>
                                      <span className="sm:hidden">In Progress</span>
                                    </>
                                  )}
                                  {order.status === "PREPARING" && (
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
            <DialogTitle className="text-xl font-bold text-[#1F2937]">
              Order Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              View complete details and information for this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Order Header */}
              <div className="pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-[#1F2937]">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#F3F4F6] text-[#374151]">
                    {statusDisplayMap[selectedOrder.status]}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280]">{selectedOrder.storeName}</p>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                  Customer Information
                </h3>
                <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-[#6B7280] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#1F2937]">
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
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                    Service Details
                  </h3>
                  <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Service</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ServiceOrder).serviceName}
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {(selectedOrder as ServiceOrder).serviceType}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Scheduled Date</p>
                        <p className="text-sm font-medium text-[#1F2937]">
                          {new Date((selectedOrder as ServiceOrder).scheduledDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Time</p>
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as ServiceOrder).scheduledTime}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Duration</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ServiceOrder).duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Service Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as ServiceOrder).serviceAddress}
                        </p>
                      </div>
                    </div>
                    {(selectedOrder as ServiceOrder).specialInstructions && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Special Instructions</p>
                        <p className="text-sm text-[#1F2937]">
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
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                    Order Details
                  </h3>
                  <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-2">Items ({(selectedOrder as GroceryOrder).itemCount})</p>
                      <div className="space-y-2">
                        {(selectedOrder as GroceryOrder).items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-[#1F2937]">
                              {item.name} <span className="text-[#6B7280]">x{item.quantity}</span>
                            </span>
                            <span className="font-medium text-[#1F2937]">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#E5E7EB]">
                      <p className="text-xs text-[#6B7280] mb-1">Delivery Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as GroceryOrder).deliveryAddress}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Delivery Window</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as GroceryOrder).deliveryWindow}
                      </p>
                    </div>
                    {(selectedOrder as GroceryOrder).specialInstructions && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Special Instructions</p>
                        <p className="text-sm text-[#1F2937]">
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
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                    Rental Details
                  </h3>
                  <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Property</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as RentalOrder).propertyName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Property Address</p>
                      <div className="flex items-start gap-2">
                        <Home className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as RentalOrder).propertyAddress}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Check-In</p>
                        <p className="text-sm font-medium text-[#1F2937]">
                          {new Date((selectedOrder as RentalOrder).checkInDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Check-Out</p>
                        <p className="text-sm font-medium text-[#1F2937]">
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
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as RentalOrder).numberOfGuests}
                      </p>
                    </div>
                    {(selectedOrder as RentalOrder).specialRequests && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Special Requests</p>
                        <p className="text-sm text-[#1F2937]">
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
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                    Product Details
                  </h3>
                  <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Product</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ProductOrder).productName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Quantity</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ProductOrder).quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Shipping Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as ProductOrder).shippingAddress}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Estimated Delivery</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ProductOrder).estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                  Order Summary
                </h3>
                <div className="bg-[#F9FAFB] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1F2937]">Total</span>
                    <span className="text-lg font-bold text-[#1F2937]">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Change Button */}
              {getNextStatus(selectedOrder.status) && (
                <div className="pt-4 border-t border-[#E5E7EB]">
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                    }}
                    className="w-full"
                    size="lg"
                  >
                    {selectedOrder.status === "ACCEPTED" && (
                      <Clock className="w-5 h-5 mr-2" />
                    )}
                    {selectedOrder.status === "PREPARING" && (
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
