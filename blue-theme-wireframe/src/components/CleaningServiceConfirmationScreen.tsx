import { CheckCircle, Calendar, Clock, MapPin, CreditCard, User, Gift } from 'lucide-react';
import { SprayBottle } from '@phosphor-icons/react';
import cleanLogo1 from '../assets/cleaning/logos/cleaning logo  (1).png';
import type { BookingData } from './CleaningServiceBookingFormScreen';
import type { Screen } from '../App';

interface CleaningServiceConfirmationScreenProps {
  bookingData: BookingData;
  onTrackOrder: () => void;
  onHome: () => void;
  pointsEarned?: number;
  pointsRedeemed?: number;
  navigate?: (screen: Screen) => void;
}

export function CleaningServiceConfirmationScreen({
  bookingData,
  onTrackOrder,
  onHome,
  pointsEarned = 0,
  pointsRedeemed = 0,
  navigate
}: CleaningServiceConfirmationScreenProps) {
  const isPoweredByDoHuub = bookingData.vendor?.isPoweredByDoHuub || false;
  const estimatedPoints = pointsEarned > 0 ? pointsEarned : (isPoweredByDoHuub ? Math.floor(parseFloat(bookingData.estimatedPrice?.replace('$', '') || '0')) : 0);

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Success Header */}
      <div className="px-6 py-8 text-center relative z-10">
        <div className="flex justify-center mb-4">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center shadow-premium-lg animate-scale-in"
            style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' }}
          >
            <CheckCircle className="w-16 h-16" style={{ color: 'rgb(34, 197, 94)' }} strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Order Confirmed
        </h1>
        <p className="" style={{ color: 'var(--muted-foreground)' }}>
          Your cleaning service has been successfully booked
        </p>
      </div>

      {/* Points Earned Celebration - Only for Powered by DoHuub */}
      {isPoweredByDoHuub && estimatedPoints > 0 && (
        <div
          className="mx-6 mb-6 rounded-2xl p-6 shadow-premium-lg relative z-10"
          style={{
            background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(245, 158, 11))',
            
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gift className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">+{estimatedPoints} Points!</span>
          </div>
          <p className="text-center text-white/90">
            Added to your rewards wallet after service completion
          </p>
          {navigate && (
            <button
              onClick={() => navigate('rewardsWallet')}
              className="mt-4 w-full py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/30"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              View My Rewards
            </button>
          )}
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 relative z-10">
        {/* Order Number */}
        <div
          className="mb-6 p-4 rounded-xl text-center shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Order Number</p>
          <p className="font-semibold" style={{ color: 'var(--primary)' }}>{bookingData.referenceNumber}</p>
        </div>

        {/* Booking Details */}
        <div className="mb-6">
          <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Booking Details</h3>

          <div
            className="p-4 rounded-xl shadow-card space-y-4"
            style={{ backgroundColor: 'var(--card)' }}
          >
            {/* Service */}
            <div className="flex gap-3">
              <img src={cleanLogo1} alt={bookingData.service.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-premium-sm" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{bookingData.service.name}</h4>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{bookingData.vendor.name}</p>
                {bookingData.vendor.isPoweredByDoHuub && (
                  <span
                    className="inline-block mt-1 px-3 py-1 text-white text-xs rounded-full shadow-premium-sm"
                    style={{ background: 'var(--primary-gradient)' }}
                  >
                    Powered by DoHuub
                  </span>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Date</p>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{bookingData.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Time</p>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{bookingData.time}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Service Address</p>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{bookingData.address.label}</p>
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
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <CreditCard className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Payment Method</p>
              <p className="font-medium" style={{ color: 'var(--foreground)' }}>••••</p>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <p style={{ color: 'var(--muted-foreground)' }}>Price</p>
              <p className="font-medium" style={{ color: 'var(--foreground)' }}>{bookingData.estimatedPrice}</p>
            </div>
            {pointsRedeemed > 0 && (
              <div className="flex items-center justify-between" style={{ color: 'rgb(34, 197, 94)' }}>
                <p>Points Redeemed ({pointsRedeemed} pts)</p>
                <p>-${(pointsRedeemed * 0.01).toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="mb-6">
          <h3 className="font-medium mb-4" style={{ color: 'var(--foreground)' }}>What's Next?</h3>
          <div className="space-y-3">
            {[
              { num: '1', text: 'Your order has been automatically accepted' },
              { num: '2', text: 'Track your order status in real-time' },
              { num: '3', text: 'Rate and review your experience after completion' }
            ].map((item, index) => (
              <div
                key={item.num}
                className="flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  <span className="text-white font-semibold text-sm">{item.num}</span>
                </div>
                <span style={{ color: 'var(--muted-foreground)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 glass space-y-3 relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={onTrackOrder}
          className="w-full py-4 rounded-xl font-semibold text-white shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98]"
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
