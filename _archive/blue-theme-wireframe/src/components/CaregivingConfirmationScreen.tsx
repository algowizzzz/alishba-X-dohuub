import { Check, Phone, Gift } from 'lucide-react';
import { HeartHalf, User as PhUser } from '@phosphor-icons/react';
import type { Screen } from '../App';

interface CaregivingConfirmationScreenProps {
  serviceType: 'ride' | 'companionship';
  bookingData: any;
  onViewTracking: () => void;
  onBackToHome: () => void;
  navigate?: (screen: Screen) => void;
}

export function CaregivingConfirmationScreen({
  serviceType,
  bookingData,
  onViewTracking,
  onBackToHome,
  navigate
}: CaregivingConfirmationScreenProps) {
  const referenceNumber = `CG${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  // Points redemption calculation
  const pointsRedeemed = bookingData.pointsRedeemed || 0;
  const discountAmount = pointsRedeemed / 100;
  const totalBeforeDiscount = bookingData.totalBeforeDiscount || bookingData.total;
  const finalPrice = bookingData.total;
  const pointsToEarn = Math.floor(finalPrice);

  const gradientColor = serviceType === 'ride'
    ? 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))'
    : 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))';

  const primaryColor = serviceType === 'ride' ? 'rgb(168, 85, 247)' : 'rgb(236, 72, 153)';

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Success Header */}
      <div className="px-6 py-8 text-center relative z-10">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-premium-md animate-scale-in"
          style={{ background: gradientColor }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h1 className="font-bold text-xl mb-2" style={{ color: 'var(--foreground)' }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>
          {serviceType === 'ride'
            ? 'Your ride service has been booked successfully'
            : 'Your companionship service has been booked successfully'
          }
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 pb-6 space-y-6">
          {/* Reference Number */}
          <div
            className="p-4 rounded-xl text-center shadow-card"
            style={{
              background: serviceType === 'ride'
                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))'
                : 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.1))',
              border: `1px solid ${serviceType === 'ride' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`
            }}
          >
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>Reference Number</p>
            <p className="text-2xl tracking-wide font-bold" style={{ color: primaryColor }}>{referenceNumber}</p>
          </div>

          {/* Points Earned - Only for Powered by DoHuub providers/companions */}
          {((serviceType === 'ride' && bookingData.provider?.isPoweredByDoHuub) ||
            (serviceType === 'companionship' && bookingData.companion?.isPoweredByDoHuub)) && (
            <div
              className="p-6 rounded-xl text-center shadow-premium-md"
              style={{
                background: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(249, 115, 22))',
                
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

          {/* Provider/Companion Info */}
          {serviceType === 'ride' ? (
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Ride Provider</h3>
              <p className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>{bookingData.provider.name}</p>
              <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                Provider will contact you shortly to confirm driver assignment
              </p>
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}
              >
                <Phone className="w-5 h-5" style={{ color: primaryColor }} />
                <span style={{ color: 'var(--foreground)' }}>(555) 123-4567</span>
              </div>
            </div>
          ) : (
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Your Companion</h3>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm"
                  style={{ background: gradientColor }}
                >
                  <PhUser size={24} weight="fill" color="#fff" />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{bookingData.companion.name}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{bookingData.companion.yearsExperience} years experience</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)' }}
              >
                <Phone className="w-5 h-5" style={{ color: primaryColor }} />
                <span style={{ color: 'var(--foreground)' }}>(555) 987-6543</span>
              </div>
            </div>
          )}

          {/* Booking Details */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Booking Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Date</span>
                <span style={{ color: 'var(--foreground)' }}>{bookingData.date}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Time</span>
                <span style={{ color: 'var(--foreground)' }}>{bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Duration</span>
                <span style={{ color: 'var(--foreground)' }}>{bookingData.duration} hours</span>
              </div>
              {serviceType === 'ride' && (
                <>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Pickup Location</span>
                    <span className="text-right" style={{ color: 'var(--foreground)' }}>{bookingData.pickupAddress?.label}</span>
                  </div>
                  {bookingData.stops && bookingData.stops.length > 0 && (
                    <div className="pt-2">
                      <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>Stops ({bookingData.stops.length})</p>
                      {bookingData.stops.map((stop: any, index: number) => (
                        <div key={stop.id} className="text-sm ml-4 mb-1" style={{ color: 'var(--foreground)' }}>
                          {index + 1}. {stop.purpose} - {stop.address}
                        </div>
                      ))}
                    </div>
                  )}
                  {bookingData.isRoundTrip && (
                    <div className="flex justify-between pt-2">
                      <span style={{ color: 'var(--muted-foreground)' }}>Round Trip</span>
                      <span style={{ color: 'var(--foreground)' }}>Yes (Return: {bookingData.returnTime})</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Vehicle Type</span>
                    <span style={{ color: 'var(--foreground)' }}>{bookingData.vehicleType}</span>
                  </div>
                </>
              )}
              {serviceType === 'companionship' && (
                <>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Location</span>
                    <span className="text-right" style={{ color: 'var(--foreground)' }}>{bookingData.serviceLocation?.label}</span>
                  </div>
                  {bookingData.supportTypes && bookingData.supportTypes.length > 0 && (
                    <div className="pt-2">
                      <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>Support Services</p>
                      {bookingData.supportTypes.map((type: string, index: number) => (
                        <div key={index} className="text-sm ml-4 mb-1" style={{ color: 'var(--foreground)' }}>
                          • {type}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Payment</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Payment Method</span>
                <span style={{ color: 'var(--foreground)' }}>{bookingData.paymentMethod?.type} •••• {bookingData.paymentMethod?.last4}</span>
              </div>
              {pointsRedeemed > 0 && (
                <>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
                    <span style={{ color: 'var(--foreground)' }}>${totalBeforeDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'rgb(34, 197, 94)' }}>
                    <span>Points Redeemed ({pointsRedeemed.toLocaleString()} pts)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="my-2" style={{ height: '1px', backgroundColor: 'var(--border)' }} />
              <div className="flex justify-between">
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Total Paid</span>
                <span className="text-xl font-bold" style={{ color: primaryColor }}>${typeof finalPrice === 'number' ? finalPrice.toFixed(2) : finalPrice}</span>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 glass relative z-10 space-y-3" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={onViewTracking}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: gradientColor }}
        >
          View Booking Status
        </button>
        <button
          onClick={onBackToHome}
          className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
          style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
