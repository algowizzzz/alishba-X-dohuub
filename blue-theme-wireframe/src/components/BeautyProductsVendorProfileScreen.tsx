import { ArrowLeft, Star, MapPin, Clock, ChevronRight, ShoppingCart, User } from 'lucide-react';
import { PlaceholderImage } from './icons/PlaceholderImage';

interface BeautyProductsVendor {
  id: number;
  name: string;
  rating: number;
  reviews?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  isPoweredByDoHuub?: boolean;
  storeType?: string;
  categories?: string[];
  address?: string;
}

interface BeautyProductsVendorProfileScreenProps {
  vendor: BeautyProductsVendor;
  onBack: () => void;
  onViewStore: () => void;
  onViewAllReviews: () => void;
}

export function BeautyProductsVendorProfileScreen({
  vendor,
  onBack,
  onViewStore,
  onViewAllReviews
}: BeautyProductsVendorProfileScreenProps) {
  // Provide defaults for optional properties
  const reviews = vendor.reviews || 180;
  const deliveryFee = vendor.deliveryFee || 3.99;
  const deliveryTime = vendor.deliveryTime || '30-45 min';
  const address = vendor.address || '456 Market Street';

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
        <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Store Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Store Header */}
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-premium-lg"
              style={{ background: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(244, 114, 182))' }}
            >
              <ShoppingCart className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{vendor.name}</h2>
            {vendor.isPoweredByDoHuub && (
              <div
                className="inline-block px-4 py-1 rounded-full text-sm mb-3 text-white shadow-premium-sm"
                style={{ background: 'var(--primary-gradient)' }}
              >
                Powered by DoHuub
              </div>
            )}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{vendor.rating}</span>
              </div>
              <span style={{ color: 'var(--muted-foreground)' }}>({reviews} reviews)</span>
            </div>
            <p style={{ color: 'var(--muted-foreground)' }}>{deliveryTime} • ${deliveryFee} delivery</p>
          </div>

          {/* About */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>About</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Your trusted beauty products destination offering premium, authentic products at competitive prices. We carefully select each item to ensure you get the best quality and value for your beauty routine.
            </p>
          </div>

          {/* Store Info */}
          <div className="">
            <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Store Information</h3>
            <div className="space-y-3">
              <div
                className="flex items-center gap-3 p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{address}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Miami, FL 33101</p>
                </div>
              </div>
              <div
                className="flex items-start gap-3 p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Delivery Hours</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>9:00 AM - 9:00 PM Daily</p>
                </div>
              </div>
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
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            background: 'var(--primary-gradient)',
                            width: `${rating === 5 ? 78 : rating === 4 ? 18 : 4}%`
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
                { name: 'Lisa M.', date: '2 days ago', rating: 5, comment: 'Always authentic products and great selection of beauty brands. My go-to beauty store!', hasPhotos: true },
                { name: 'Sophia T.', date: '5 days ago', rating: 5, comment: 'Fast delivery and everything was packaged perfectly. Products arrived in great condition.', hasPhotos: false },
                { name: 'Megan D.', date: '1 week ago', rating: 4, comment: 'Good products but sometimes items are out of stock. Otherwise excellent selection!', hasPhotos: true }
              ].map((review, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-premium-sm"
                      style={{ background: 'var(--primary-gradient)' }}
                    >
                      <span className="text-white font-semibold">{review.name.charAt(0)}</span>
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
