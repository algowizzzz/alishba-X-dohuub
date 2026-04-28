import { ArrowLeft, Star, MapPin, ChevronRight, Wrench, Clock, User, Award } from 'lucide-react';
import { PlaceholderImage } from './icons/PlaceholderImage';
import type { HandymanVendor } from './HandymanVendorDetailScreen';

interface HandymanVendorProfileScreenProps {
  vendor: HandymanVendor;
  onBack: () => void;
  onViewAllReviews: () => void;
  onSelectService: (service: any) => void;
}

export function HandymanVendorProfileScreen({
  vendor,
  onBack,
  onViewAllReviews,
  onSelectService
}: HandymanVendorProfileScreenProps) {
  const servicesOffered = [
    {
      id: 1,
      name: 'Outlet Installation',
      description: 'Professional electrical outlet installation and repair',
      price: 75,
      duration: '1-2 hours',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Light Fixture Repair',
      description: 'Fix and install light fixtures and ceiling fans',
      price: 85,
      duration: '1-2 hours',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Faucet Repair',
      description: 'Repair leaky faucets and install new fixtures',
      price: 90,
      duration: '1-2 hours',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Furniture Assembly',
      description: 'Expert assembly of all types of furniture',
      price: 60,
      duration: '1-3 hours',
      rating: 4.7
    },
    {
      id: 5,
      name: 'Door Installation',
      description: 'Install and repair interior and exterior doors',
      price: 120,
      duration: '2-3 hours',
      rating: 4.8
    },
    {
      id: 6,
      name: 'Interior Painting',
      description: 'Professional interior painting and touch-ups',
      price: 150,
      duration: '3-5 hours',
      rating: 4.9
    }
  ];

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10 sticky top-0"
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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Vendor Profile</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Vendor Header */}
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-premium-md"
              style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))' }}
            >
              <Wrench className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{vendor.name}</h2>
            {vendor.isPoweredByDoHuub && (
              <div
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm text-white mb-3 shadow-premium-sm"
                style={{ background: 'var(--primary-gradient)' }}
              >
                <Award className="w-4 h-4" />
                Powered by DoHuub
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
              <span className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.rating}</span>
            </div>
          </div>

          {/* About */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>About</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Expert handyman services for all your home repair and improvement needs. With years of experience and a commitment to quality workmanship, we handle everything from minor repairs to major installations.
            </p>
          </div>

          {/* Service Information */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Service Information</h3>
            <div className="space-y-3">
              <div
                className="flex items-start gap-3 p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <MapPin className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Service Area</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Greater Miami Area - 20 mile radius</p>
                </div>
              </div>
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Availability</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Monday - Friday</span>
                    <span style={{ color: 'var(--foreground)' }}>7:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Saturday</span>
                    <span style={{ color: 'var(--foreground)' }}>8:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Offered */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Services Offered</h3>
            <div className="space-y-3">
              {servicesOffered.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => onSelectService(service)}
                  className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{service.name}</h4>
                      <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{service.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                          <span className="text-sm" style={{ color: 'var(--foreground)' }}>{service.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{service.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold" style={{ color: 'var(--primary)' }}>${service.price}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reviews & Ratings */}
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Reviews & Ratings</h3>
              <button
                onClick={onViewAllReviews}
                className="flex items-center gap-1 text-sm transition-all duration-300 hover:opacity-70"
                style={{ color: 'var(--primary)' }}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Rating Summary */}
            <div
              className="p-4 rounded-xl shadow-card mb-4"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{vendor.rating}</p>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{vendor.completedJobs || vendor.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-3" style={{ color: 'var(--muted-foreground)' }}>{rating}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            background: 'var(--primary-gradient)',
                            width: `${rating === 5 ? 70 : rating === 4 ? 25 : 5}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="space-y-3">
              {[
                { name: 'David T.', date: '2 days ago', rating: 5, comment: 'Fixed my electrical outlet quickly and professionally. Very knowledgeable and fair pricing!', hasPhotos: true },
                { name: 'Lisa P.', date: '5 days ago', rating: 5, comment: 'Excellent work on furniture assembly and door installation. Highly recommend!', hasPhotos: false },
                { name: 'Robert M.', date: '1 week ago', rating: 4, comment: 'Good service, though took a bit longer than expected. Quality work though.', hasPhotos: true }
              ].map((review, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl shadow-card"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      <User className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium" style={{ color: 'var(--foreground)' }}>{review.name}</span>
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4"
                            style={{
                              color: star <= review.rating ? 'rgb(250, 204, 21)' : 'var(--muted)',
                              fill: star <= review.rating ? 'rgb(250, 204, 21)' : 'transparent'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                    {review.comment}
                  </p>
                  {review.hasPhotos && (
                    <div className="flex gap-2">
                      {[1, 2].map((photo) => (
                        <PlaceholderImage key={photo} variant="review-photo" className="w-20 h-20 rounded-lg" iconSize={16} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
