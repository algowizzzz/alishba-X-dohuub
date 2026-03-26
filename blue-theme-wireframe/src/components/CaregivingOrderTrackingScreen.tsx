import { ArrowLeft, Phone, MessageCircle, Check } from 'lucide-react';
import { Car as PhCar, User as PhUser } from '@phosphor-icons/react';

interface CaregivingOrderTrackingScreenProps {
  serviceType: 'ride' | 'companionship';
  bookingData: any;
  onBack: () => void;
}

type OrderStatus = 'Accepted' | 'In Progress' | 'Completed';

export function CaregivingOrderTrackingScreen({
  serviceType,
  bookingData,
  onBack
}: CaregivingOrderTrackingScreenProps) {
  const currentStatus: OrderStatus = 'In Progress';

  const statuses: OrderStatus[] = ['Accepted', 'In Progress', 'Completed'];
  const currentStatusIndex = statuses.indexOf(currentStatus);

  const statusDescriptions = {
    'ride': {
      'Accepted': 'Your booking has been confirmed',
      'In Progress': 'Transportation service in progress',
      'Completed': 'Ride completed successfully'
    },
    'companionship': {
      'Accepted': 'Your booking has been confirmed',
      'In Progress': 'Companion is providing care',
      'Completed': 'Service completed successfully'
    }
  };

  const gradientColor = serviceType === 'ride'
    ? 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))'
    : 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))';

  const primaryColor = serviceType === 'ride' ? 'rgb(168, 85, 247)' : 'rgb(236, 72, 153)';

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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Booking Status</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Status Timeline */}
          <div
            className="p-6 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Status</h3>
            <div className="space-y-4">
              {statuses.map((status, index) => {
                const isCompleted = index < currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isPending = index > currentStatusIndex;

                return (
                  <div key={status} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm transition-all duration-300"
                        style={{
                          background: isCompleted || isCurrent ? gradientColor : 'var(--muted)'
                        }}
                      >
                        {isCompleted ? (
                          <Check className="w-6 h-6 text-white" strokeWidth={3} />
                        ) : (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: isCurrent ? 'white' : 'var(--muted-foreground)'
                            }}
                          />
                        )}
                      </div>
                      {index < statuses.length - 1 && (
                        <div
                          className="w-0.5 h-12 transition-all duration-300"
                          style={{
                            backgroundColor: isCompleted ? primaryColor : 'var(--border)'
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p
                        className="font-medium mb-1"
                        style={{
                          color: isCompleted || isCurrent ? 'var(--foreground)' : 'var(--muted-foreground)'
                        }}
                      >
                        {status}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {statusDescriptions[serviceType][status]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Provider/Companion Info */}
          {serviceType === 'ride' ? (
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Ride Provider</h3>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-premium-sm"
                  style={{ background: gradientColor }}
                >
                  <PhCar size={24} weight="fill" color="#fff" />
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{bookingData.provider.name}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Transportation Service</p>
                </div>
              </div>
              <button
                className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: gradientColor }}
              >
                <Phone className="w-5 h-5" />
                Contact Provider
              </button>
            </div>
          ) : (
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Your Companion</h3>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm"
                  style={{ background: gradientColor }}
                >
                  <PhUser size={24} weight="fill" color="#fff" />
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{bookingData.companion.name}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{bookingData.companion.yearsExperience} years experience</p>
                </div>
              </div>
              <button
                className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: gradientColor }}
              >
                <Phone className="w-5 h-5" />
                Contact Companion
              </button>
            </div>
          )}

          {/* Service Details */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Service Details</h3>
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
                    <span style={{ color: 'var(--muted-foreground)' }}>Pickup</span>
                    <span className="text-right" style={{ color: 'var(--foreground)' }}>{bookingData.pickupAddress?.label}</span>
                  </div>
                  {bookingData.stops && bookingData.stops.length > 0 && (
                    <div className="pt-2">
                      <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>Stops</p>
                      {bookingData.stops.map((stop: any, index: number) => (
                        <div key={stop.id} className="text-sm ml-4 mb-1" style={{ color: 'var(--foreground)' }}>
                          {index + 1}. {stop.purpose}
                        </div>
                      ))}
                    </div>
                  )}
                  {bookingData.isRoundTrip && (
                    <div className="flex justify-between pt-2">
                      <span style={{ color: 'var(--muted-foreground)' }}>Round Trip</span>
                      <span style={{ color: 'var(--foreground)' }}>Yes</span>
                    </div>
                  )}
                </>
              )}
              {serviceType === 'companionship' && (
                <>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Location</span>
                    <span className="text-right" style={{ color: 'var(--foreground)' }}>{bookingData.serviceLocation?.label}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Updates / Check-in Notes (for Companionship) */}
          {serviceType === 'companionship' && currentStatusIndex >= 1 && (
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Check-in Notes</h3>
              <div className="space-y-3">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)' }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>10:30 AM</span>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Session started</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Arrived on time. Beginning activities as planned.
                  </p>
                </div>
                {currentStatusIndex >= 2 && (
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)' }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>12:15 PM</span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Session completed</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Session went well. Patient enjoyed activities and conversation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Updates (for Ride) */}
          {serviceType === 'ride' && currentStatusIndex >= 1 && (
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Updates</h3>
              <div className="space-y-3">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)' }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>9:00 AM</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Service in progress. Currently en route to first stop.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div
            className="p-4 rounded-xl shadow-premium-sm"
            style={{
              background: serviceType === 'ride'
                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))'
                : 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.1))',
              border: `1px solid ${serviceType === 'ride' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
              
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{ color: 'var(--foreground)' }}>Total Amount</span>
              <span className="text-xl font-bold" style={{ color: primaryColor }}>${bookingData.total}</span>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
