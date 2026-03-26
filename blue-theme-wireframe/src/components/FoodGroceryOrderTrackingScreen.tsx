import { ArrowLeft, Package, MapPin, CreditCard, Star, RefreshCcw, Check, Loader2 } from 'lucide-react';
import foodImg from '../assets/food.png';
import groceryImg from '../assets/grocery.png';
import beautyImg from '../assets/beauty products and services.png';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface FoodGroceryOrderTrackingScreenProps {
  order: {
    id: number;
    type: 'food' | 'grocery' | 'beauty-products';
    vendor: string;
    date: string;
    time: string;
    address: string;
    status: 'accepted' | 'in-progress' | 'completed' | 'cancelled';
    price: string;
    items: OrderItem[];
    hasReview?: boolean;
    paymentMethod?: string;
  };
  onBack: () => void;
  onReorder: () => void;
  onReview: () => void;
}

export function FoodGroceryOrderTrackingScreen({
  order,
  onBack,
  onReorder,
  onReview
}: FoodGroceryOrderTrackingScreenProps) {
  // Get timeline steps
  const getTimelineSteps = () => {
    const steps = [
      {
        label: 'Accepted',
        description: 'Your order has been confirmed',
        timestamp: 'Just now',
        status: 'accepted'
      },
      {
        label: 'In Progress',
        description: 'Order is being prepared',
        timestamp: '',
        status: 'in-progress'
      },
      {
        label: 'Completed',
        description: 'Order has been completed',
        timestamp: '',
        status: 'completed'
      }
    ];

    return steps;
  };

  const timelineSteps = getTimelineSteps();
  const currentStatusIndex = timelineSteps.findIndex(s => s.status === order.status);

  // Get gradient based on order type
  const getTypeGradient = () => {
    switch (order.type) {
      case 'food':
        return 'linear-gradient(135deg, rgb(249, 115, 22), rgb(234, 88, 12))';
      case 'grocery':
        return 'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))';
      case 'beauty-products':
        return 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))';
      default:
        return 'var(--primary-gradient)';
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Order Status</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Order #{order.id}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 relative z-10">
        {/* Order Timeline */}
        <div className="">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Order Timeline</h3>
          <div className="space-y-1">
            {timelineSteps.map((step, index) => {
              const isCompleted = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isPending = index > currentStatusIndex;
              const isLast = index === timelineSteps.length - 1;

              return (
                <div key={index}>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-card transition-all duration-300"
                        style={{
                          borderColor: isCompleted || isCurrent ? 'var(--primary)' : 'var(--border)',
                          background: isCompleted ? 'var(--primary-gradient)' : 'var(--card)'
                        }}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 text-white" strokeWidth={3} />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--primary)' }} strokeWidth={3} />
                        ) : null}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <h4
                        className="mb-1 font-medium"
                        style={{ color: isCompleted || isCurrent ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                      >
                        {step.label}
                      </h4>
                      <p
                        className="text-sm mb-1"
                        style={{ color: isCompleted || isCurrent ? 'var(--muted-foreground)' : 'var(--muted)' }}
                      >
                        {step.description}
                      </p>
                      {step.timestamp && (isCompleted || isCurrent) && (
                        <p className="text-xs" style={{ color: 'var(--primary)' }}>{step.timestamp}</p>
                      )}
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {!isLast && (
                    <div className="flex items-start gap-4 -mt-6">
                      <div className="w-8 flex justify-center">
                        <div
                          className="w-0.5 h-6 transition-all duration-300"
                          style={{ backgroundColor: isCompleted ? 'var(--primary)' : 'var(--border)' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Vendor Information */}
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Vendor</h3>
          <div
            className="rounded-xl p-4 shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <img src={order.type === 'food' ? foodImg : order.type === 'grocery' ? groceryImg : beautyImg} alt={order.type === 'food' ? 'Food' : order.type === 'grocery' ? 'Grocery' : 'Beauty'} className="w-12 h-12 object-contain" />
              <div>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{order.vendor}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {order.type === 'food' ? 'Restaurant' : order.type === 'grocery' ? 'Grocery Store' : 'Beauty Store'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Order Items</h3>
          <div
            className="rounded-xl overflow-hidden shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="p-4 flex items-center justify-between"
                style={{ borderBottom: index < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{item.name}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Qty: {item.quantity}</p>
                </div>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="rounded-xl p-4 flex items-center justify-between shadow-premium-sm"
            style={{ background: 'var(--primary-gradient)' }}
          >
            <span className="text-white font-medium">Total</span>
            <span className="text-white text-lg font-bold">{order.price}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Delivery Address</h3>
          <div
            className="rounded-xl p-4 flex items-start gap-3 shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
            <p className="flex-1" style={{ color: 'var(--foreground)' }}>{order.address}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Payment Method</h3>
          <div
            className="rounded-xl p-4 flex items-center gap-3 shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-premium-sm"
              style={{ background: 'var(--primary-gradient)' }}
            >
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{order.paymentMethod || 'Credit Card •••• 1234'}</p>
          </div>
        </div>

        {/* Order Date & Time */}
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Order Date & Time</h3>
          <div
            className="rounded-xl p-4 shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{order.date}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{order.time}</p>
          </div>
        </div>

        {/* Actions for Completed Orders */}
        {order.status === 'completed' && (
          <div className="space-y-3 pt-2">
            <button
              onClick={onReorder}
              className="w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'var(--primary-gradient)' }}
            >
              <RefreshCcw className="w-5 h-5" />
              Re-order
            </button>

            {!order.hasReview && (
              <button
                onClick={onReview}
                className="w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-card hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '2px solid var(--border)'
                }}
              >
                <Star className="w-5 h-5" style={{ color: 'rgb(250, 204, 21)' }} />
                Leave a Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
