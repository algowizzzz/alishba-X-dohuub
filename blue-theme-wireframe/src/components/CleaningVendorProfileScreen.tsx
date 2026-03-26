import { ArrowLeft, Star, MapPin, Clock, ChevronRight, User } from 'lucide-react';
import { SprayBottle } from '@phosphor-icons/react';
import { PlaceholderImage } from './icons/PlaceholderImage';
import cleanLogo1 from '../assets/cleaning/logos/cleaning logo  (1).png';
import profilePhoto from '../assets/profile photo (2).png';
import type { Vendor } from './VendorDetailScreen';

interface CleaningVendorProfileScreenProps {
  vendor: Vendor;
  onBack: () => void;
  onViewAllReviews: () => void;
  onSelectService: (service: any) => void;
}

export function CleaningVendorProfileScreen({
  vendor,
  onBack,
  onViewAllReviews,
  onSelectService
}: CleaningVendorProfileScreenProps) {
  const services = [
    {
      id: 1,
      name: 'Basic Cleaning',
      description: 'Essential cleaning for your home',
      price: 89,
      duration: '2-3 hours',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Deep Cleaning',
      description: 'Thorough cleaning of every corner',
      price: 149,
      duration: '4-5 hours',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Move In/Out Cleaning',
      description: 'Complete cleaning for moving',
      price: 199,
      duration: '5-6 hours',
      rating: 4.7
    }
  ];

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10 flex items-center gap-4 sticky top-0"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
        </button>
        <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Vendor Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Vendor Header */}
          <div className="text-center">
            <img src={cleanLogo1} alt={vendor.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-premium-lg" />
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{vendor.name}</h2>
            {vendor.isPoweredByDoHuub && (
              <div
                className="inline-block px-4 py-1 rounded-full text-sm mb-3 shadow-premium-sm"
                style={{ background: 'var(--primary-gradient)', color: 'white' }}
              >
                Powered by DoHuub
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{vendor.rating}</span>
            </div>
          </div>

          {/* About */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>About</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Professional cleaning services with over 5 years of experience. We pride ourselves on attention to detail and customer satisfaction. Our trained staff uses eco-friendly products and follows strict quality standards.
            </p>
          </div>

          {/* Service Information */}
          <div className="">
            <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Service Information</h3>
            <div className="space-y-3">
              <div
                className="flex items-start gap-3 p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Service Area</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Miami-Dade County & Surrounding Areas</p>
                </div>
              </div>
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Operating Hours</p>
                </div>
                <div className="space-y-2 text-sm pl-13">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Monday - Friday</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Saturday</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--muted-foreground)' }}>Sunday</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Offered */}
          <div className="">
            <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Services Offered</h3>
            <div className="space-y-3">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => onSelectService(service)}
                  className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01]"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{service.name}</h4>
                      <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{service.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{service.rating}</span>
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
              <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>Reviews & Ratings</h3>
              <button
                onClick={onViewAllReviews}
                className="flex items-center gap-1 text-sm transition-all duration-300 hover:gap-2"
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
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{vendor.rating}</p>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{vendor.completedJobs} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-3" style={{ color: 'var(--muted-foreground)' }}>{rating}</span>
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            background: 'var(--primary-gradient)',
                            width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%`
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
                { name: 'Sarah M.', date: '3 days ago', rating: 5, comment: 'Excellent service! The team was professional, thorough, and my home has never looked better. Highly recommend!', hasPhotos: true },
                { name: 'Michael R.', date: '1 week ago', rating: 5, comment: 'Very reliable and detail-oriented. They cleaned areas I didn\'t even think about. Great value for money.', hasPhotos: false },
                { name: 'Jennifer K.', date: '2 weeks ago', rating: 4, comment: 'Good service overall. A bit pricey but the quality is there. Would use again.', hasPhotos: true }
              ].map((review, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <img src={profilePhoto} alt={review.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-premium-sm" />
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
