import { ArrowLeft, Star, DollarSign, Clock, ChevronRight, Image as ImageIcon, Gift } from 'lucide-react';
import { Wrench as PhWrench, UserCircle } from '@phosphor-icons/react';
import handymanImg from '../assets/handyman.png';
import type { HandymanService } from './HandymanVendorDetailScreen';
import type { HandymanVendor } from './HandymanVendorsListScreen';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

interface HandymanServiceDetailScreenProps {
  service: HandymanService;
  vendor: HandymanVendor;
  onBack: () => void;
  onBook: () => void;
  onViewAllReviews: () => void;
}

const reviews: Review[] = [
  {
    id: '1',
    userName: 'Robert K.',
    rating: 5,
    comment: 'Excellent work! Very professional and completed the job perfectly. The technician was on time and very thorough.',
    date: '1 day ago',
    images: ['image1', 'image2']
  },
  {
    id: '2',
    userName: 'Jennifer L.',
    rating: 5,
    comment: 'Quick and efficient service. Highly recommend! The handyman was very knowledgeable and cleaned up after the job.',
    date: '5 days ago',
    images: ['image1', 'image2', 'image3']
  },
  {
    id: '3',
    userName: 'David M.',
    rating: 4,
    comment: 'Good service overall. Arrived on time and did a great job. Would definitely hire again for future projects.',
    date: '1 week ago'
  }
];

export function HandymanServiceDetailScreen({
  service,
  vendor,
  onBack,
  onBook,
  onViewAllReviews
}: HandymanServiceDetailScreenProps) {
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
          style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.15))' }}
        >
          <img src={handymanImg} alt="Handyman Service" className="w-40 h-40 object-contain" />
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
              <span style={{ color: 'var(--muted-foreground)' }}>(187 reviews)</span>
            </div>
            <p style={{ color: 'var(--muted-foreground)' }}>{service.description}</p>
          </div>

          {/* Vendor Info */}
          <div
            className="mb-6 p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-premium-sm"
                style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))' }}
              >
                <UserCircle size={24} weight="duotone" className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.name}</p>
                  {vendor.isPoweredByDoHuub && (
                    <div
                      className="px-2 py-1 rounded-full text-xs flex items-center gap-1 text-white shadow-premium-sm"
                      style={{ background: 'var(--primary-gradient)' }}
                    >
                      Powered by DoHuub
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{vendor.rating} ({vendor.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Points Earning Banner */}
          {vendor.isPoweredByDoHuub && (
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
          <div className="mb-6 space-y-3">
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span style={{ color: 'var(--foreground)' }}>Pricing</span>
                <span className="ml-auto font-semibold" style={{ color: 'var(--primary)' }}>{service.price}</span>
              </div>
            </div>
            <div
              className="p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span style={{ color: 'var(--foreground)' }}>Duration</span>
                <span className="ml-auto" style={{ color: 'var(--muted-foreground)' }}>{service.duration}</span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>What's Included</h3>
            <ul className="space-y-2">
              {[
                'Professional tools and equipment',
                'Experienced and licensed professionals',
                'Quality workmanship guarantee',
                'Clean-up after job completion'
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
              <button
                onClick={onViewAllReviews}
                className="flex items-center gap-1 transition-all duration-300 hover:opacity-70"
                style={{ color: 'var(--primary)' }}
              >
                <span className="text-sm">View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {reviews.map((review) => (
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
          onClick={onBook}
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
