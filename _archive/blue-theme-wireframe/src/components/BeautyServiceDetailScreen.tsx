import { ArrowLeft, Star, DollarSign, Clock, ChevronRight, Image as ImageIcon, Gift } from 'lucide-react';
import { Scissors as PhScissors, UserCircle } from '@phosphor-icons/react';
import beautyImg from '../assets/beauty products and services.png';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

interface BeautyServiceDetailScreenProps {
  service: {
    id: number;
    name: string;
    category: string;
    price: string;
    duration: string;
    rating: number;
    reviews: number;
    description?: string;
  };
  provider: {
    name: string;
    rating?: number;
    reviewCount?: string;
    isPoweredByDoHuub?: boolean;
  };
  onBack: () => void;
  onBookService: () => void;
  onViewAllReviews?: () => void;
}

const reviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah M.',
    rating: 5,
    comment: 'Absolutely amazing service! Very professional and the results were stunning. Highly recommend!',
    date: '2 days ago',
    images: ['image1', 'image2', 'image3']
  },
  {
    id: '2',
    userName: 'Emily J.',
    rating: 5,
    comment: 'Best beauty service I\'ve ever had. The attention to detail was incredible.',
    date: '1 week ago',
    images: ['image1', 'image2']
  },
  {
    id: '3',
    userName: 'Jessica B.',
    rating: 4,
    comment: 'Great service overall. Very satisfied with the results.',
    date: '2 weeks ago'
  }
];

export function BeautyServiceDetailScreen({
  service,
  provider,
  onBack,
  onBookService,
  onViewAllReviews
}: BeautyServiceDetailScreenProps) {
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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Service Details</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Service Image */}
        <div
          className="h-64 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(244, 114, 182, 0.15))' }}
        >
          <img src={beautyImg} alt="Beauty Service" className="w-40 h-40 object-contain" />
        </div>

        {/* Service Info */}
        <div className="px-6 py-6">
          {/* Title and Rating */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{service.name}</h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{service.rating}</span>
              </div>
              <span style={{ color: 'var(--muted-foreground)' }}>({service.reviews} reviews)</span>
            </div>
            <p style={{ color: 'var(--muted-foreground)' }}>
              {service.description || `Experience our premium ${service.name.toLowerCase()} service performed by highly trained beauty professionals. We use only the best quality products to ensure stunning results.`}
            </p>
          </div>

          {/* Provider Info */}
          <div
            className="mb-6 p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-premium-sm"
                style={{ background: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(244, 114, 182))' }}
              >
                <UserCircle size={24} weight="duotone" className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{provider.name}</p>
                  {provider.isPoweredByDoHuub && (
                    <div
                      className="px-2 py-1 rounded-full text-xs flex items-center gap-1 text-white shadow-premium-sm"
                      style={{ background: 'var(--primary-gradient)' }}
                    >
                      Powered by DoHuub
                    </div>
                  )}
                </div>
                {provider.rating && provider.reviewCount && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{provider.rating} ({provider.reviewCount})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Points Earning Banner */}
          {provider.isPoweredByDoHuub && (
            <div
              className="mb-6 rounded-xl p-4 shadow-premium-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
                >
                  <Gift className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'rgb(180, 83, 9)' }}>
                    Earn points on this service
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(217, 119, 6)' }}>
                    1 point per $1 spent • Points added after service completion
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Price and Duration Info */}
          <div
            className="mb-6 p-4 rounded-xl shadow-card"
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--foreground)' }}>Pricing</span>
              <span className="ml-auto font-semibold" style={{ color: 'var(--primary)' }}>{service.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--foreground)' }}>Duration</span>
              <span className="ml-auto" style={{ color: 'var(--muted-foreground)' }}>{service.duration}</span>
            </div>
          </div>

          {/* Service Details */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>What's Included</h3>
            <ul className="space-y-2">
              {[
                'Professional consultation and assessment',
                'Premium quality beauty products and tools',
                'Expert application by certified professionals',
                'Aftercare advice and maintenance tips'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span style={{ color: 'var(--primary)' }} className="mt-1">✓</span>
                  <span style={{ color: 'var(--muted-foreground)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Reviews</h3>
              {onViewAllReviews && (
                <button
                  onClick={onViewAllReviews}
                  className="flex items-center gap-1 transition-all duration-300 hover:opacity-70"
                  style={{ color: 'var(--primary)' }}
                >
                  <span className="text-sm">View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="p-4 rounded-xl shadow-card"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>{review.userName}</span>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        style={{
                          color: i < review.rating ? 'rgb(250, 204, 21)' : 'var(--muted)',
                          fill: i < review.rating ? 'rgb(250, 204, 21)' : 'transparent'
                        }}
                      />
                    ))}
                  </div>
                  <p className="mb-2" style={{ color: 'var(--muted-foreground)' }}>{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {review.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-16 h-16 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'var(--muted)' }}
                        >
                          <ImageIcon className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 glass relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={onBookService}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Book Service
        </button>
      </div>
    </div>
  );
}

export type { Review };
