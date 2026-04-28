import { ArrowLeft, Star, MapPin, Clock, ChevronRight, User, Award } from 'lucide-react';
import { ForkKnife } from '@phosphor-icons/react';
import { PlaceholderImage } from './icons/PlaceholderImage';
import type { FoodVendor } from './FoodVendorsListScreen';

interface FoodVendorProfileScreenProps {
  vendor: FoodVendor;
  onBack: () => void;
  onViewMenu: () => void;
  onViewAllReviews: () => void;
}

export function FoodVendorProfileScreen({
  vendor,
  onBack,
  onViewMenu,
  onViewAllReviews
}: FoodVendorProfileScreenProps) {
  // Provide defaults for optional properties
  const reviews = vendor.reviews || 250;
  const cuisineTypes = vendor.cuisineTypes || vendor.cuisine?.split(', ') || ['Multi-Cuisine'];
  const deliveryFee = vendor.deliveryFee || 2.99;
  const address = vendor.address || '123 Main Street';

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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Restaurant Profile</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Restaurant Header */}
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-premium-md"
              style={{ background: 'linear-gradient(135deg, rgb(249, 115, 22), rgb(234, 88, 12))' }}
            >
              <ForkKnife size={48} weight="duotone" className="text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{vendor.name}</h2>
            {vendor.isPoweredByDoHuub && (
              <div
                className="inline-flex items-center px-3 py-1 rounded-full text-sm text-white mb-3 shadow-premium-sm"
                style={{ background: 'var(--primary-gradient)' }}
              >
                Powered by DoHuub
              </div>
            )}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.rating}</span>
              </div>
              <span style={{ color: 'var(--muted-foreground)' }}>({reviews} reviews)</span>
            </div>
            <p style={{ color: 'var(--muted-foreground)' }}>{vendor.deliveryTime} • ${deliveryFee} delivery</p>
          </div>

          {/* About */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>About</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Welcome to {vendor.name}! We serve delicious, high-quality {cuisineTypes[0]} cuisine made with fresh, locally-sourced ingredients. Our chefs bring years of culinary expertise to create memorable dining experiences.
            </p>
          </div>

          {/* Restaurant Info */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Restaurant Information</h3>
            <div className="space-y-3">
              <div
                className="flex items-center gap-3 p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{address}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Miami, FL 33101</p>
                </div>
              </div>
              <div
                className="flex items-start gap-3 p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <Clock className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Delivery Hours</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>11:00 AM - 10:00 PM Daily</p>
                </div>
              </div>
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
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{reviews} reviews</p>
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
                            width: `${rating === 5 ? 80 : rating === 4 ? 15 : 5}%`
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
                { name: 'Emma L.', date: '1 day ago', rating: 5, comment: 'Amazing food! The burger was cooked perfectly and arrived hot. Will definitely order again.', ordered: 'Signature Burger, Fries', hasPhotos: true },
                { name: 'James K.', date: '3 days ago', rating: 5, comment: 'Great service and delicious pizza. Delivery was quick and the driver was friendly.', ordered: 'Margherita Pizza', hasPhotos: false },
                { name: 'Maria S.', date: '1 week ago', rating: 4, comment: 'Good food but took longer than estimated. Still tasty though.', ordered: 'Caesar Salad, Soup', hasPhotos: true }
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
                  <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                    {review.comment}
                  </p>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>Ordered: {review.ordered}</p>
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
