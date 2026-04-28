import { ArrowLeft, Heart, Star, MapPin, ChevronRight, Flag, Gift } from 'lucide-react';

interface ServiceDetailsScreenProps {
  service: any;
  onBack: () => void;
  onBook: () => void;
  onReviews: () => void;
  onReport: () => void;
}

export function ServiceDetailsScreen({ service, onBack, onBook, onReviews, onReport }: ServiceDetailsScreenProps) {
  if (!service) return null;

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Hero Image */}
      <div className="relative">
        <div
          className="h-64 flex items-center justify-center text-6xl"
          style={{ background: 'linear-gradient(135deg, rgba(46, 122, 217, 0.1), rgba(76, 166, 250, 0.1))' }}
        >
          {service.image}
        </div>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center glass shadow-premium-sm transition-all duration-300 hover:shadow-premium-md"
        >
          <ArrowLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
        </button>
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center glass shadow-premium-sm transition-all duration-300 hover:shadow-premium-md">
          <Heart className="w-6 h-6" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
        </button>
        <div
          className="absolute bottom-4 right-4 px-3 py-1 rounded-full glass shadow-premium-sm"
          style={{ color: 'var(--foreground)' }}
        >
          1/5
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 relative z-10">
        {/* Powered by DoHuub Badge */}
        {service.isPowered && (
          <div
            className="mb-4 inline-flex items-center px-4 py-2 rounded-full text-white shadow-premium-sm"
            style={{ background: 'var(--primary-gradient)' }}
          >
            Powered by DoHuub
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
          {service.name}
        </h2>

        {/* Rating */}
        <button
          onClick={onReviews}
          className="flex items-center gap-2 mb-3 transition-opacity hover:opacity-70"
         
        >
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
            <span className="font-medium" style={{ color: 'var(--foreground)' }}>{service.rating}</span>
          </div>
          <span style={{ color: 'var(--muted-foreground)' }}>({service.reviews} reviews)</span>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
        </button>

        {/* Distance */}
        <div className="flex items-center gap-2 mb-6" style={{ color: 'var(--muted-foreground)' }}>
          <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <span>{service.distance} away</span>
        </div>

        {/* Points Earning Banner */}
        {service.isPowered && (
          <div
            className="p-4 rounded-xl mb-6 shadow-premium-sm"
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
                  Earn points on this booking
                </p>
                <p className="text-sm" style={{ color: 'rgb(217, 119, 6)' }}>
                  1 point per $1 spent • Redeemable on future services
                </p>
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>About</h3>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Professional cleaning services with experienced staff. We provide deep cleaning, laundry services, and office cleaning solutions. All our cleaners are background-checked and insured.
          </p>
        </div>

        {/* Pricing Section */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Pricing</h3>
          <div className="space-y-2">
            {[
              { name: 'Deep Cleaning', price: '$89/session' },
              { name: 'Laundry Service', price: '$45/load' },
              { name: 'Office Cleaning', price: '$120/session' }
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <span style={{ color: 'var(--foreground)' }}>{item.name}</span>
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Reviews</h3>
            <button
              onClick={onReviews}
              className="underline transition-opacity hover:opacity-70"
              style={{ color: 'var(--primary)' }}
            >
              See all
            </button>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-premium-sm"
                    style={{ background: 'var(--primary-gradient)' }}
                  >
                    S
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>Sarah M.</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>2 days ago</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Excellent service! Very thorough and professional. Would definitely recommend.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Button */}
        <button
          onClick={onReport}
          className="flex items-center gap-2 mt-6 transition-opacity hover:opacity-70"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Flag className="w-4 h-4" />
          <span>Report Listing</span>
        </button>
      </div>

      {/* Sticky Bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-center gap-4 glass"
        style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}
      >
        <div className="flex-1">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Starting from</p>
          <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{service.price}</p>
        </div>
        <button
          onClick={onBook}
          className="px-8 py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
