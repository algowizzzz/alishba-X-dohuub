import { ArrowLeft, Star, Car, MapPin, ChevronRight, Gift } from 'lucide-react';
import type { RideProvider } from './RideProvidersListScreen';

interface RideProviderDetailScreenProps {
  provider: RideProvider;
  onBack: () => void;
  onBookRide: () => void;
  onViewAllReviews?: () => void;
}

export function RideProviderDetailScreen({
  provider,
  onBack,
  onBookRide,
  onViewAllReviews
}: RideProviderDetailScreenProps) {
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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Provider Details</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Provider Info */}
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-premium-md"
              style={{ background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))' }}
            >
              <Car className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-xl mb-1" style={{ color: 'var(--foreground)' }}>{provider.name}</h2>
              {provider.isPoweredByDoHuub && (
                <div
                  className="inline-block px-3 py-1 rounded-full text-sm mb-2 text-white shadow-premium-sm"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  Powered by DoHuub
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>{provider.rating}</span>
                </div>
                <span style={{ color: 'var(--muted-foreground)' }}>({provider.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Points Earning Banner */}
          {provider.isPoweredByDoHuub && (
            <div
              className="p-4 rounded-xl shadow-premium-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-premium-sm"
                  style={{ background: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(249, 115, 22))' }}
                >
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'rgb(180, 83, 9)' }}>
                    Earn ~{provider.hourlyRate}+ points per ride
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(217, 119, 6)' }}>
                    1 point per $1 spent • Points added after ride completion
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--muted-foreground)' }}>Hourly Rate</span>
              <span className="text-2xl font-bold" style={{ color: 'rgb(168, 85, 247)' }}>${provider.hourlyRate}/hour</span>
            </div>
          </div>

          {/* Description */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>About</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>{provider.description}</p>
          </div>

          {/* Vehicle Types */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Available Vehicle Types</h3>
            <div className="space-y-3">
              {provider.vehicleTypes.map(type => (
                <div
                  key={type}
                  className="flex items-center gap-3 p-3 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <Car className="w-5 h-5" style={{ color: 'rgb(168, 85, 247)' }} />
                  <span style={{ color: 'var(--foreground)' }}>{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          {provider.wheelchairAccessible && (
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6" style={{ color: 'rgb(168, 85, 247)' }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Wheelchair Accessible</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vehicles equipped for wheelchair access</p>
                </div>
              </div>
            </div>
          )}

          {/* Special Features */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Special Features</h3>
            <div className="space-y-2">
              {provider.specialFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'rgb(168, 85, 247)' }} />
                  <span style={{ color: 'var(--muted-foreground)' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage Area */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Coverage Area</h3>
            <div
              className="flex items-center gap-3 p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <MapPin className="w-5 h-5" style={{ color: 'rgb(168, 85, 247)' }} />
              <span style={{ color: 'var(--foreground)' }}>{provider.coverageArea}</span>
            </div>
          </div>

          {/* Reviews */}
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Reviews</h3>
              <button
                className="flex items-center gap-1 text-sm transition-all duration-300 hover:opacity-70"
                onClick={onViewAllReviews}
                style={{ color: 'rgb(168, 85, 247)' }}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Review 1 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Margaret T.</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>1 week ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Excellent service! The driver was very patient and helpful with my appointments.
                </p>
              </div>

              {/* Review 2 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Robert K.</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>2 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Very reliable and professional. Highly recommend for medical appointments.
                </p>
              </div>

              {/* Review 3 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Linda P.</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>3 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                  ))}
                  <Star className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Good service overall. Could improve on punctuality.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-20" />
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={onBookRide}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))' }}
        >
          Book Ride Service
        </button>
      </div>
    </div>
  );
}
