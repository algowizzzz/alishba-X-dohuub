import { CheckCircle, Calendar, Clock, MapPin, CreditCard, Gift } from 'lucide-react';
import { Scissors as PhScissors } from '@phosphor-icons/react';
import beautyImg from '../assets/beauty products and services.png';
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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Success Header */}
      <div className="px-6 py-8 text-center relative z-10">
        <div className="flex justify-center mb-4 animate-scale-in">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-premium-md"
            style={{ background: 'var(--primary-gradient)' }}
          >
            <CheckCircle className="w-16 h-16 text-white" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Order Confirmed</h1>
        <p className="" style={{ color: 'var(--muted-foreground)' }}>Your beauty service has been successfully booked</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 relative z-10">
        {/* Order Number */}
        <div
          className="mb-6 p-4 rounded-xl text-center shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Order Number</p>
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{bookingData.referenceNumber}</p>
        </div>

        {/* Points Earned - Only for Powered by DoHuub providers */}
        {isPoweredByDoHuub && (
          <div
            className="mb-6 p-6 rounded-xl text-center shadow-premium-md"
            style={{
              background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(245, 158, 11))',
              
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Gift className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">
                +{pointsToEarn} Points!
              </span>
            </div>
            <p className="text-white/80">Added to your rewards wallet after service completion</p>
            {navigate && (
              <button
                onClick={() => navigate('rewardsWallet')}
                className="mt-4 w-full py-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/30"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              >
                View My Rewards
              </button>
            )}
          </div>
        )}

        {/* Booking Details */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Booking Details</h3>

          <div
            className="p-4 rounded-xl shadow-card space-y-4"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {/* Service */}
            <div className="flex gap-3">
              <img src={beautyImg} alt="Beauty Service" className="w-16 h-16 object-contain flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{bookingData.service.name}</h4>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{bookingData.providerName}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-start gap-3 mb-3">
                <Calendar className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Date</p>
                  <p style={{ color: 'var(--foreground)' }}>{bookingData.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Time</p>
                  <p style={{ color: 'var(--foreground)' }}>{bookingData.time}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Service Address</p>
                  <p style={{ color: 'var(--foreground)' }}>{bookingData.address.label}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {bookingData.address.street}, {bookingData.address.city}, {bookingData.address.state} {bookingData.address.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-start gap-3 mb-4">
            <CreditCard className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Payment Method</p>
              <p style={{ color: 'var(--foreground)' }}>{getCardType(bookingData.paymentCard.cardNumber)} •••• {bookingData.paymentCard.cardNumber.replace(/\s/g, '').slice(-4)}</p>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <p style={{ color: 'var(--foreground)' }}>Price</p>
              <p style={{ color: 'var(--foreground)' }}>{bookingData.estimatedPrice}</p>
            </div>
            {actualPointsRedeemed > 0 && (
              <div className="flex items-center justify-between" style={{ color: 'rgb(34, 197, 94)' }}>
                <p>Points Redeemed ({actualPointsRedeemed.toLocaleString()} pts)</p>
                <p>-${discountAmount.toFixed(2)}</p>
              </div>
            )}
            {actualPointsRedeemed > 0 && (
              <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Total</p>
                <p className="font-semibold" style={{ color: 'var(--primary)' }}>${finalPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>What's Next?</h3>
          <ul className="space-y-3">
            {[
              'Your order has been automatically accepted',
              'Track your order status in real-time',
              'Rate and review your experience after completion'
            ].map((text, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm text-white flex-shrink-0"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  {index + 1}
                </span>
                <span style={{ color: 'var(--muted-foreground)' }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 glass relative z-10 space-y-3" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={onTrackOrder}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Track Order Status
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
          style={{
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
