import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, ShoppingBag, User, Store, MapPin, Calendar, Clock,
  CreditCard, MessageSquare, XCircle, CheckCircle2, Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";
import api from "../../../services/api";

interface AdminOrder {
  id: string;
  kind: "booking" | "order";
  number: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  vendorId: string;
  vendorName: string;
  title: string;
  status: string;
  date: string;
  time: string;
  location: string;
  total: number;
  paymentMethod?: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: "Pending", bg: "bg-[#FEF9C3]", text: "text-[#854D0E]" },
  ACCEPTED: { label: "Accepted", bg: "bg-[#E8F1FC]", text: "text-[#1E5DB0]" },
  IN_PROGRESS: { label: "In Progress", bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
  COMPLETED: { label: "Completed", bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
  CANCELLED: { label: "Cancelled", bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
  DECLINED: { label: "Declined", bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
};

function getStatus(s: string) {
  return STATUS_CONFIG[s] || STATUS_CONFIG.PENDING;
}

function bookingTitle(b: any): string {
  return (
    b.cleaningListing?.title ||
    b.handymanListing?.title ||
    b.beautyListing?.title ||
    b.rentalListing?.title ||
    b.rideAssistanceListing?.title ||
    b.companionshipListing?.title ||
    b.category ||
    "Service"
  );
}

function orderTitle(o: any): string {
  if (!o.items?.length) return "Order";
  const first = o.items[0];
  const name =
    first.groceryListing?.name ||
    first.foodListing?.name ||
    first.beautyProductListing?.name ||
    "Item";
  return o.items.length > 1 ? `${name} +${o.items.length - 1} more` : name;
}

function OrderCard({
  order,
  onCancel,
  onAdvance,
  busy,
}: {
  order: AdminOrder;
  onCancel: (o: AdminOrder) => Promise<void>;
  onAdvance: (o: AdminOrder, next: string) => Promise<void>;
  busy: boolean;
}) {
  const status = getStatus(order.status);
  const isTerminal = order.status === "COMPLETED" || order.status === "CANCELLED" || order.status === "DECLINED";

  const nextStatus = (() => {
    if (order.status === "PENDING") return "ACCEPTED";
    if (order.status === "ACCEPTED") return "IN_PROGRESS";
    if (order.status === "IN_PROGRESS") return "COMPLETED";
    if (order.kind === "order" && order.status === "ACCEPTED") return "OUT_FOR_DELIVERY";
    return null;
  })();

  return (
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 mb-5 hover:shadow-[0_8px_24px_rgba(46,122,217,0.25)] transition-shadow">
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-[rgba(46,122,217,0.25)]">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-lg font-bold text-[#1A1A2E]">{order.number}</h3>
            <span className={`px-3 py-1 ${status.bg} ${status.text} text-xs font-semibold rounded-full`}>
              {status.label}
            </span>
            <span className="text-xs text-[#6B7280] uppercase">{order.kind}</span>
          </div>
          <p className="text-sm text-[#6B7280]">{new Date(order.date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-start gap-2 mb-3"><User className="w-4 h-4 text-[#6B7280] mt-0.5" /><div><p className="text-xs text-[#6B7280]">Customer</p><p className="text-sm font-semibold text-[#1A1A2E]">{order.customerName}</p><p className="text-xs text-[#6B7280]">{order.customerEmail}</p></div></div>
          <div className="flex items-start gap-2"><Store className="w-4 h-4 text-[#6B7280] mt-0.5" /><div><p className="text-xs text-[#6B7280]">Vendor</p><p className="text-sm font-semibold text-[#1A1A2E]">{order.vendorName}</p></div></div>
        </div>
        <div>
          <div className="flex items-start gap-2 mb-3"><Calendar className="w-4 h-4 text-[#6B7280] mt-0.5" /><div><p className="text-xs text-[#6B7280]">When</p><p className="text-sm font-semibold text-[#1A1A2E]">{new Date(order.date).toLocaleDateString()}{order.time ? ` · ${order.time}` : ""}</p></div></div>
          <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#6B7280] mt-0.5" /><div><p className="text-xs text-[#6B7280]">Where</p><p className="text-sm text-[#1A1A2E] break-words">{order.location || "—"}</p></div></div>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-[rgba(46,122,217,0.25)]">
        <p className="text-xs text-[#6B7280] mb-1">Service / Items</p>
        <p className="text-sm font-semibold text-[#1A1A2E]">{order.title}</p>
      </div>

      <div className="flex items-center justify-between pt-2 mb-4">
        <span className="text-sm font-semibold text-[#6B7280] flex items-center gap-1"><CreditCard className="w-4 h-4" />{order.paymentMethod || "—"}</span>
        <span className="text-lg font-bold text-[#1A1A2E]">${order.total.toFixed(2)}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link to={`/admin/customers/${order.customerId}`}><MessageSquare className="w-4 h-4 mr-2" />Customer</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to={`/admin/vendors/${order.vendorId}`}><MessageSquare className="w-4 h-4 mr-2" />Vendor</Link>
        </Button>
        {nextStatus && !isTerminal && (
          <Button size="sm" disabled={busy} onClick={() => onAdvance(order, nextStatus)} className="bg-[#2E7AD9] hover:bg-[#1E5DB0]">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {nextStatus === "ACCEPTED" ? "Accept" : nextStatus === "IN_PROGRESS" ? "Mark In Progress" : nextStatus === "COMPLETED" ? "Mark Complete" : "Advance"}
          </Button>
        )}
        {!isTerminal && (
          <Button size="sm" variant="outline" disabled={busy} className="text-[#DC2626] border-[#FECACA]" onClick={() => onCancel(order)}>
            <XCircle className="w-4 h-4 mr-2" />Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

export function OrderManagement() {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );
  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) setSidebarCollapsed(!sidebarCollapsed);
    else setSidebarOpen(!sidebarOpen);
  };

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, oRes] = await Promise.all([
        api.get<any>("/api/v1/admin/bookings?limit=200"),
        api.get<any>("/api/v1/admin/orders?limit=200"),
      ]);
      const bookings = ((bRes as any)?.data || []).map((b: any): AdminOrder => ({
        id: b.id,
        kind: "booking",
        number: `BK-${b.id.slice(-6).toUpperCase()}`,
        customerId: b.userId,
        customerName: b.user?.profile ? `${b.user.profile.firstName ?? ""} ${b.user.profile.lastName ?? ""}`.trim() || b.user.email : (b.user?.email || "—"),
        customerEmail: b.user?.email || "",
        vendorId: b.vendorId,
        vendorName: b.vendor?.businessName || "—",
        title: bookingTitle(b),
        status: b.status,
        date: b.scheduledDate || b.createdAt,
        time: b.scheduledTime || "",
        location: b.address ? `${b.address.street}, ${b.address.city} ${b.address.state}`.trim() : "",
        total: Number(b.total || 0),
        paymentMethod: null,
      }));
      const eOrders = ((oRes as any)?.data || []).map((o: any): AdminOrder => ({
        id: o.id,
        kind: "order",
        number: `OR-${o.id.slice(-6).toUpperCase()}`,
        customerId: o.userId,
        customerName: o.user?.profile ? `${o.user.profile.firstName ?? ""} ${o.user.profile.lastName ?? ""}`.trim() || o.user.email : (o.user?.email || "—"),
        customerEmail: o.user?.email || "",
        vendorId: o.vendorId,
        vendorName: o.vendor?.businessName || "—",
        title: orderTitle(o),
        status: o.status,
        date: o.createdAt,
        time: "",
        location: o.address ? `${o.address.street}, ${o.address.city} ${o.address.state}`.trim() : "",
        total: Number(o.total || 0),
        paymentMethod: null,
      }));
      setOrders([...bookings, ...eOrders]);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (o: AdminOrder) => {
    if (!window.confirm(`Cancel ${o.number}?`)) return;
    setPending((p) => ({ ...p, [o.id]: true }));
    try {
      const path = o.kind === "booking"
        ? `/api/v1/admin/bookings/${o.id}/status`
        : `/api/v1/admin/orders/${o.id}/status`;
      await api.patch(path, { status: "CANCELLED" });
      setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: "CANCELLED" } : x)));
      toast.success(`${o.number} cancelled`);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to cancel");
    } finally {
      setPending((p) => ({ ...p, [o.id]: false }));
    }
  };

  const handleAdvance = async (o: AdminOrder, next: string) => {
    setPending((p) => ({ ...p, [o.id]: true }));
    try {
      const path = o.kind === "booking"
        ? `/api/v1/admin/bookings/${o.id}/status`
        : `/api/v1/admin/orders/${o.id}/status`;
      await api.patch(path, { status: next });
      setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: next } : x)));
      toast.success(`${o.number} → ${getStatus(next).label}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to update status");
    } finally {
      setPending((p) => ({ ...p, [o.id]: false }));
    }
  };

  const displayOrders = id ? orders.filter((o) => o.id === id) : orders;
  const filteredOrders = displayOrders.filter((order) => statusFilter === "all" || order.status === statusFilter);
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    return 0;
  });

  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status === "PENDING" || o.status === "ACCEPTED" || o.status === "IN_PROGRESS" || o.status === "OUT_FOR_DELIVERY").length;
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED" || o.status === "DECLINED").length;

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="orders"
      />
      <main className={`mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}`}>
        <div className="max-w-[1400px] mx-auto">
          {id && (
            <Link to="/admin/orders" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] hover:underline mb-4 sm:mb-6">
              <ArrowLeft className="w-4 h-4" />Back to All Orders
            </Link>
          )}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-2">{id ? `Order ${id}` : "Order Management"}</h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">{id ? "Order details and actions" : "View and manage all bookings + orders"}</p>
          </div>

          {!id && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]"><p className="text-sm text-[#6B7280] mb-1">Total</p><p className="text-2xl font-bold text-[#1A1A2E]">{totalOrders}</p></div>
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]"><p className="text-sm text-[#6B7280] mb-1">Active</p><p className="text-2xl font-bold text-[#2E7AD9]">{activeOrders}</p></div>
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]"><p className="text-sm text-[#6B7280] mb-1">Completed</p><p className="text-2xl font-bold text-[#10B981]">{completedOrders}</p></div>
              <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 text-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]"><p className="text-sm text-[#6B7280] mb-1">Cancelled</p><p className="text-2xl font-bold text-[#DC2626]">{cancelledOrders}</p></div>
            </div>
          )}

          {!id && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 w-full sm:w-[220px]"><SelectValue placeholder="Status: All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 w-full sm:w-[200px]"><SelectValue placeholder="Sort..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#2E7AD9] animate-spin" /></div>
          ) : sortedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-[120px] h-[120px] rounded-full bg-[#F0F7FF] flex items-center justify-center mb-6"><ShoppingBag className="w-16 h-16 text-[#9CA3AF]" /></div>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">No orders found</h3>
              <p className="text-[15px] text-[#6B7280]">{id ? "This order could not be found" : "No orders match your filters"}</p>
            </div>
          ) : (
            sortedOrders.map((order) => (
              <OrderCard key={`${order.kind}-${order.id}`} order={order} onCancel={handleCancel} onAdvance={handleAdvance} busy={!!pending[order.id]} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
