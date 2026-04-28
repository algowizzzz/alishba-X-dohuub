import { CheckCircle, Calendar, Clock, MapPin, CreditCard, Gift } from 'lucide-react';
import type { BeautyBookingData } from './BeautyServiceBookingScreen';
import type { Screen } from '../App';

interface BeautyServiceConfirmationScreenProps {
  bookingData: BeautyBookingData;
  isPoweredByDoHuub?: boolean;
  pointsRedeemed?: number;
  onTrackOrder: () => void;
  onHome: () => void;
  navigate?: (screen: Screen) => void;
}

export function BeautyServiceConfirmationScreen({
  bookingData,
  isPoweredByDoHuub,
  pointsRedeemed = 0,
  onTrackOrder,
  onHome,
  navigate
}: BeautyServiceConfirmationScreenProps) {
  // Helper function to get card type from card number
  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'Amex';
    return 'Card';
  };

  const actualPointsRedeemed = pointsRedeemed || bookingData.pointsRedeemed || 0;
  const discountAmount = actualPointsRedeemed / 100;
  const originalPrice = parseFloat(bookingData.estimatedPrice.replace('$', '').replace(',', ''));
  const finalPrice = originalPrice - discountAmount;
  const pointsToEarn = Math.floor(finalPrice);

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
        <p className="text-gray-600">Your beauty service has been successfully booked</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Order Number */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600 mb-1">Order Number</p>
          <p className="text-gray-900">{bookingData.referenceNumber}</p>
        </div>

        {/* Points Earned - Only for Powered by DoHuub providers */}
        {isPoweredByDoHuub && (
          <div className="mb-6 p-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Gift className="w-8 h-8 text-black" />
              <span className="text-2xl font-bold text-black">
                +{pointsToEarn} Points!
              </span>
            </div>
            <p className="text-black/70">Added to your rewards wallet after service completion</p>
            {navigate && (
              <button
                onClick={() => navigate('rewardsWallet')}
                className="mt-4 w-full py-2 bg-white/20 rounded-lg text-black font-medium hover:bg-white/30 transition-colors"
              >
                View My Rewards
              </button>
            )}
          </div>
        )}

        {/* Booking Details */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3">Booking Details</h3>
          
          <div className="p-4 border-2 border-gray-200 rounded-xl space-y-4">
            {/* Service */}
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-2xl">💅</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-gray-900 mb-1">{bookingData.service.name}</h4>
                <p className="text-gray-600 text-sm">{bookingData.providerName}</p>
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
                  <p className="text-gray-900">{bookingData.address.label}</p>
                  <p className="text-gray-600 text-sm">
                    {bookingData.address.street}, {bookingData.address.city}, {bookingData.address.state} {bookingData.address.zipCode}
                  </p>
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
              <p className="text-gray-900">{getCardType(bookingData.paymentCard.cardNumber)} •••• {bookingData.paymentCard.cardNumber.replace(/\s/g, '').slice(-4)}</p>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 border-t-2 border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-gray-900">Price</p>
              <p className="text-gray-900">{bookingData.estimatedPrice}</p>
            </div>
            {actualPointsRedeemed > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <p>Points Redeemed ({actualPointsRedeemed.toLocaleString()} pts)</p>
                <p>-${discountAmount.toFixed(2)}</p>
              </div>
            )}
            {actualPointsRedeemed > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <p className="text-gray-900 font-semibold">Total</p>
                <p className="text-gray-900 font-semibold">${finalPrice.toFixed(2)}</p>
              </div>
            )}
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

      {/* Bottom Actions */}
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