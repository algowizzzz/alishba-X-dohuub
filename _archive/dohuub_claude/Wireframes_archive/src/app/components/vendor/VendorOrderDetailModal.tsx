import { X, User, MapPin, Clock } from "lucide-react";
import { Button } from "../ui/button";

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

interface OrderDetailModalProps {
  order: {
    id: string;
    orderNumber: string;
    storeName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    total: number;
    status: string;
    type: "service" | "delivery";
    serviceDetails?: ServiceDetails;
    deliveryDetails?: DeliveryDetails;
  } | null;
  onClose: () => void;
  onMarkInProgress: () => void;
}

export function VendorOrderDetailModal({
  order,
  onClose,
  onMarkInProgress,
}: OrderDetailModalProps) {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      ACCEPTED: {
        bg: "bg-[#FEF3C7]",
        text: "text-[#92400E]",
        label: "Accepted",
      },
      IN_PROGRESS: {
        bg: "bg-[#DBEAFE]",
        text: "text-[#1E40AF]",
        label: "In Progress",
      },
      COMPLETED: {
        bg: "bg-[#D1FAE5]",
        text: "text-[#065F46]",
        label: "Completed",
      },
    };

    const badge = badges[status] || badges.ACCEPTED;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1F2937]">Order Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Number & Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1F2937]">{order.orderNumber}</h3>
              <p className="text-sm text-[#6B7280] mt-1">{order.storeName}</p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          {/* Customer Information */}
          <div>
            <h4 className="text-sm font-semibold text-[#1F2937] mb-3">
              Customer Information
            </h4>
            <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-[#6B7280] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-[#6B7280]">{order.customerEmail}</p>
                  <p className="text-sm text-[#6B7280]">{order.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details or Delivery Details */}
          {order.type === "service" && order.serviceDetails && (
            <div>
              <h4 className="text-sm font-semibold text-[#1F2937] mb-3">
                Service Details
              </h4>
              <div className="space-y-4">
                {/* Service Name */}
                <div className="pb-4 border-b border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1">Service</p>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {order.serviceDetails.service}
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    {order.serviceDetails.category}
                  </p>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Scheduled Date</p>
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {order.serviceDetails.scheduledDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Time</p>
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {order.serviceDetails.time}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="pb-4 border-b border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1">Duration</p>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {order.serviceDetails.duration}
                  </p>
                </div>

                {/* Service Address */}
                <div className="pb-4 border-b border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1">Service Address</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#1F2937]">
                      {order.serviceDetails.serviceAddress}
                    </p>
                  </div>
                </div>

                {/* Special Instructions */}
                {order.serviceDetails.specialInstructions && (
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Special Instructions</p>
                    <p className="text-sm text-[#1F2937]">
                      {order.serviceDetails.specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {order.type === "delivery" && order.deliveryDetails && (
            <div>
              <h4 className="text-sm font-semibold text-[#1F2937] mb-3">
                Order Details
              </h4>
              <div className="space-y-4">
                {/* Items List */}
                <div className="pb-4 border-b border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-3">
                    Items ({order.deliveryDetails.items.length})
                  </p>
                  <div className="space-y-2">
                    {order.deliveryDetails.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-[#1F2937]">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-semibold text-[#1F2937]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="pb-4 border-b border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1">Delivery Address</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#1F2937]">
                      {order.deliveryDetails.deliveryAddress}
                    </p>
                  </div>
                </div>

                {/* Delivery Window */}
                <div className="pb-4 border-b border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1">Delivery Window</p>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#6B7280] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#1F2937]">
                      {order.deliveryDetails.deliveryWindow}
                    </p>
                  </div>
                </div>

                {/* Special Instructions */}
                {order.deliveryDetails.specialInstructions && (
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Special Instructions</p>
                    <p className="text-sm text-[#1F2937]">
                      {order.deliveryDetails.specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="pt-4 border-t border-[#E5E7EB]">
            <h4 className="text-sm font-semibold text-[#1F2937] mb-3">
              Order Summary
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-[#1F2937]">Total</span>
              <span className="text-base font-bold text-[#1F2937]">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {order.status === "ACCEPTED" && (
            <Button
              onClick={onMarkInProgress}
              className="w-full h-12 bg-[#1F2937] hover:bg-[#111827]"
            >
              <Clock className="w-4 h-4 mr-2" />
              Mark In Progress
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
