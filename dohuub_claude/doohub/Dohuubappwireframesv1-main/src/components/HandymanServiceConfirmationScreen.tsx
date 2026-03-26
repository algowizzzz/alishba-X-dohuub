import { CheckCircle, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';
import type { HandymanBookingData } from './HandymanServiceBookingFormScreen';

interface HandymanServiceConfirmationScreenProps {
  bookingData: HandymanBookingData;
  onTrackOrder: () => void;
  onHome: () => void;
}

export function HandymanServiceConfirmationScreen({
  bookingData,
  onTrackOrder,
  onHome
}: HandymanServiceConfirmationScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Success Header */}
      <div className="px-6 py-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-gray-900 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-gray-900" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-gray-900 mb-2">Order Confirmed</h1>
        <p className="text-gray-600">Your handyman service has been successfully booked</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Order Number */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600 mb-1">Order Number</p>
          <p className="text-gray-900">{bookingData.referenceNumber}</p>
        </div>

        {/* Booking Details */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3">Booking Details</h3>
          
          <div className="p-4 border-2 border-gray-200 rounded-xl space-y-4">
            {/* Service */}
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🔧</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-gray-900 mb-1">{bookingData.service.name}</h4>
                <p className="text-gray-600 text-sm">{bookingData.vendor.name}</p>
                {bookingData.vendor.isPoweredByDoHuub && (
                  <span className="inline-block mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                    Powered by DoHuub
                  </span>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="pt-4 border-t-2 border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <Calendar className="w-5 h-5 text-gray-700 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p className="text-gray-900">{bookingData.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-700 mt-0.5" />
                <div>
                  <p className="text-gray-600 text-sm">Time</p>
                  <p className="text-gray-900">{bookingData.time}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-4 border-t-2 border-gray-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-700 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-sm">Service Address</p>
                  <p className="text-gray-900">{bookingData.address.type}</p>
                  <p className="text-gray-600 text-sm">{bookingData.address.street}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl">
          <div className="flex items-start gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-gray-700 mt-0.5" />
            <div>
              <p className="text-gray-600 text-sm">Payment Method</p>
              <p className="text-gray-900">••••</p>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-gray-900">Price</p>
              <p className="text-gray-900">{bookingData.estimatedPrice}</p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-4">What's Next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-gray-900">1.</span>
              <span className="text-gray-600">Your order has been automatically accepted</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-900">2.</span>
              <span className="text-gray-600">Track your order status in real-time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-900">3.</span>
              <span className="text-gray-600">Rate and review your experience after completion</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="p-6 border-t-2 border-gray-200 space-y-3">
        <button
          onClick={onTrackOrder}
          className="w-full py-4 bg-gray-900 text-white rounded-xl"
        >
          Track Order Status
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 border-2 border-gray-300 text-gray-900 rounded-xl"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}