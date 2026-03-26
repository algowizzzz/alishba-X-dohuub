import { ArrowLeft, Package, MapPin, CreditCard, Star, RefreshCcw, Check, Loader2 } from 'lucide-react';

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

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">Order Status</h1>
            <p className="text-sm text-gray-600">Order #{order.id}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Order Timeline */}
        <div>
          <h3 className="text-gray-900 mb-4">Order Timeline</h3>
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
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        isCompleted ? 'border-gray-900 bg-gray-900' :
                        isCurrent ? 'border-gray-900 bg-white' :
                        'border-gray-300 bg-white'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-5 h-5 text-white" strokeWidth={3} />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 text-gray-900" strokeWidth={3} />
                        ) : null}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <h4 className={`mb-1 ${
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </h4>
                      <p className={`text-sm mb-1 ${
                        isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                      {step.timestamp && (isCompleted || isCurrent) && (
                        <p className="text-xs text-gray-500">{step.timestamp}</p>
                      )}
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {!isLast && (
                    <div className="flex items-start gap-4 -mt-6">
                      <div className="w-8 flex justify-center">
                        <div className={`w-0.5 h-6 ${
                          isCompleted ? 'bg-gray-900' : 'bg-gray-300'
                        }`} />
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
          <h3 className="text-gray-900">Vendor</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-900">{order.vendor}</p>
            <p className="text-sm text-gray-600 mt-1">
              {order.type === 'food' ? 'Restaurant' : order.type === 'grocery' ? 'Grocery Store' : 'Beauty Store'}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Order Items</h3>
          <div className="bg-gray-50 rounded-xl divide-y divide-gray-200">
            {order.items?.map((item, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="bg-gray-900 text-white rounded-xl p-4 flex items-center justify-between">
            <span>Total</span>
            <span className="text-lg">{order.price}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Delivery Address</h3>
          <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <p className="text-gray-900 flex-1">{order.address}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Payment Method</h3>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">{order.paymentMethod || 'Credit Card •••• 1234'}</p>
          </div>
        </div>

        {/* Order Date & Time */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Order Date & Time</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-900">{order.date}</p>
            <p className="text-sm text-gray-600 mt-1">{order.time}</p>
          </div>
        </div>

        {/* Actions for Completed Orders */}
        {order.status === 'completed' && (
          <div className="space-y-3 pt-2">
            <button
              onClick={onReorder}
              className="w-full py-4 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800"
            >
              <RefreshCcw className="w-5 h-5" />
              Re-order
            </button>

            {!order.hasReview && (
              <button
                onClick={onReview}
                className="w-full py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:border-gray-800"
              >
                <Star className="w-5 h-5" />
                Leave a Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}