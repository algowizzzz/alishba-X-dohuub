import { ArrowLeft, Star, MapPin, Clock, DollarSign, ChevronRight, Image as ImageIcon, Gift } from 'lucide-react';
import { SprayBottle, UserCircle } from '@phosphor-icons/react';
import cleanLogo1 from '../assets/cleaning/logos/cleaning logo  (1).png';
import cleanSvc3 from '../assets/cleaning/Services/cleaning services (3).png';
import type { Service } from './VendorDetailScreen';
import type { Vendor } from './VendorsListScreen';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

interface CleaningServiceDetailScreenProps {
  service: Service;
  vendor: Vendor;
  onBack: () => void;
  onBook: () => void;
  onViewAllReviews: () => void;
}

const reviews: Review[] = [
  {
    id: '1',
    userName: 'John D.',
    rating: 5,
    comment: 'Excellent service! Very thorough and professional. My home has never looked better.',
    date: '2 days ago',
    images: ['image1', 'image2', 'image3']
  },
  {
    id: '2',
    userName: 'Sarah M.',
    rating: 5,
    comment: 'Highly recommend! The team was punctual and did an amazing job.',
    date: '1 week ago',
    images: ['image1', 'image2']
  },
  {
    id: '3',
    userName: 'Michael R.',
    rating: 4,
    comment: 'Good service overall. Would use again.',
    date: '2 weeks ago'
  }
];

export function CleaningServiceDetailScreen({
  service,
  vendor,
  onBack,
  onBook,
  onViewAllReviews
}: CleaningServiceDetailScreenProps) {
  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div
        className="px-6 py-6 relative z-10 flex items-center gap-4"
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
        <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Service Details</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Service Image */}
        <div
          className="h-64 flex items-center justify-center relative"
          style={{ background: 'var(--primary-gradient)' }}
        >
          <img src={cleanSvc3} alt={service.name} className="w-full h-full object-cover" />
        </div>

        {/* Service Info */}
        <div className="px-6 py-4">
          {/* Title and Rating */}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{service.name}</h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{service.rating}</span>
              </div>
              <span style={{ color: 'var(--muted-foreground)' }}>(234 reviews)</span>
            </div>
            <p style={{ color: 'var(--muted-foreground)' }}>{service.description}</p>
          </div>

          {/* Vendor Info */}
          <div
            className="mb-4 p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex items-center gap-3">
              <img src={cleanLogo1} alt={vendor.name} className="w-12 h-12 rounded-full object-cover shadow-premium-sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.name}</p>
                  {vendor.isPoweredByDoHuub && (
                    <span
                      className="px-2 py-1 text-white text-xs rounded-full"
                      style={{ background: 'var(--primary-gradient)' }}
                    >
                      Powered by DoHuub
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{vendor.rating} ({vendor.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Points Earning Banner */}
          {vendor.isPoweredByDoHuub && (
            <div
              className="mb-4 rounded-xl p-4 shadow-card"
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
                  <p className="text-sm" style={{ color: 'rgb(180, 83, 9)' }}>
                    1 point per $1 spent • Points added after service completion
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Price Info */}
          <div
            className="mb-4 p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span className="font-medium" style={{ color: 'var(--foreground)' }}>Pricing</span>
              <span className="ml-auto font-semibold" style={{ color: 'var(--primary)' }}>{service.price}</span>
            </div>
          </div>

          {/* Service Details */}
          <div className="mb-4">
            <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>What's Included</h3>
            <div className="space-y-2">
              {[
                'Professional cleaning equipment and supplies',
                'Experienced and trained cleaning professionals',
                'Eco-friendly cleaning products available',
                'Quality guarantee and satisfaction promise'
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-xl transition-all duration-300 hover:shadow-card"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <span style={{ color: 'rgb(34, 197, 94)' }}>✓</span>
                  <span style={{ color: 'var(--muted-foreground)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>Reviews</h3>
              <button
                onClick={onViewAllReviews}
                className="flex items-center gap-1 transition-all duration-300 hover:gap-2"
                style={{ color: 'var(--primary)' }}
              >
                <span className="text-sm font-medium">View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
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
          className="w-full py-4 rounded-xl font-semibold text-white shadow-premium-md transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--primary-gradient)' }}
        >
          Book Service
        </button>
      </div>
    </div>
  );
}

export type { Review };
