import { CheckCircle, Calendar, Users, CreditCard, Gift } from 'lucide-react';
import { House as PhHouse } from '@phosphor-icons/react';
import rentalListImg1 from '../assets/rental listing/rental listing (1).png';
import type { PropertyBookingData } from './PropertyBookingScreen';
import type { Screen } from '../App';

interface PropertyConfirmationScreenProps {
  bookingData: PropertyBookingData;
  onTrackOrder: () => void;
  onHome: () => void;
  pointsRedeemed?: number;
  navigate?: (screen: Screen) => void;
}

export function PropertyConfirmationScreen({
  bookingData,
  onTrackOrder,
  onHome,
  pointsRedeemed = 0,
  navigate
}: PropertyConfirmationScreenProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const actualPointsRedeemed = pointsRedeemed || bookingData.pointsRedeemed || 0;
  const discountAmount = actualPointsRedeemed / 100;
  const finalPrice = bookingData.finalPrice || (bookingData.totalPrice - discountAmount);
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
            style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
          >
            <CheckCircle className="w-16 h-16 text-white" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Order Confirmed</h1>
        <p className="" style={{ color: 'var(--muted-foreground)' }}>
          Your rental property has been successfully booked
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 relative z-10">
        {/* Order Number */}
        <div
          className="mb-6 p-4 rounded-xl text-center shadow-card"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Order Number</p>
          <p className="font-semibold text-lg" style={{ color: 'rgb(20, 184, 166)' }}>{bookingData.referenceNumber}</p>
        </div>

        {/* Points Earned - Only for Powered by DoHuub properties */}
        {bookingData.property.isPoweredByDoHuub && (
          <div
            className="mb-6 p-6 rounded-xl text-center shadow-premium-md"
            style={{
              background: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(234, 88, 12))',
              
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Gift className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">
                +{pointsToEarn} Points!
              </span>
            </div>
            <p className="text-white/80">Added to your rewards wallet after stay completion</p>
            {navigate && (
              <button
                onClick={() => navigate('rewardsWallet')}
                className="mt-4 w-full py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90"
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
            className="p-4 rounded-xl space-y-4 shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {/* Property */}
            <div className="flex gap-3">
              <img src={rentalListImg1} alt={bookingData.property.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 shadow-premium-sm" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{bookingData.property.name}</h4>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{bookingData.property.location}</p>
                {bookingData.property.isPoweredByDoHuub && (
                  <span
                    className="inline-flex items-center gap-1 mt-1 px-2 py-1 text-white text-xs font-medium rounded-full shadow-premium-sm"
                    style={{ background: 'var(--primary-gradient)' }}
                  >
                    Powered by DoHuub
                  </span>
                )}
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-start gap-3 mb-3">
                <Calendar className="w-5 h-5 mt-0.5" style={{ color: 'rgb(20, 184, 166)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Check-in / Check-out</p>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                    {formatDate(bookingData.checkInDate)} - {formatDate(bookingData.checkOutDate)}
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(20, 184, 166)' }}>{bookingData.duration}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 mt-0.5" style={{ color: 'rgb(20, 184, 166)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Guests</p>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                    {bookingData.guests} {bookingData.guests === 1 ? 'guest' : 'guests'}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {bookingData.specialRequests && (
              <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Special Requests</p>
                <p style={{ color: 'var(--foreground)' }}>{bookingData.specialRequests}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-start gap-3 mb-4">
            <CreditCard className="w-5 h-5 mt-0.5" style={{ color: 'rgb(20, 184, 166)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Payment Method</p>
              <p className="font-medium" style={{ color: 'var(--foreground)' }}>•••• {bookingData.paymentCard.cardNumber.slice(-4)}</p>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <p style={{ color: 'var(--muted-foreground)' }}>Subtotal</p>
              <p style={{ color: 'var(--foreground)' }}>${bookingData.totalPrice}</p>
            </div>
            {actualPointsRedeemed > 0 && (
              <div className="flex items-center justify-between" style={{ color: 'rgb(34, 197, 94)' }}>
                <p>Points Redeemed ({actualPointsRedeemed.toLocaleString()} pts)</p>
                <p>-${discountAmount.toFixed(2)}</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Total Amount</p>
              <p className="text-xl font-bold" style={{ color: 'rgb(20, 184, 166)' }}>${finalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>What's Next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
              >
                1
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>Your order has been automatically accepted</span>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
              >
                2
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>Track your order status in real-time</span>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
              >
                3
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>Rate and review your experience after completion</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 py-4 space-y-3 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={onTrackOrder}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
        >
          Track Order Status
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-card hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            border: '2px solid var(--border)'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
