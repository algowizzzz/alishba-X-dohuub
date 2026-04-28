import { ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';
import profilePhoto from '../assets/profile photo (2).png';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  imageCount?: number;
}

interface VendorReviewsScreenProps {
  vendorName: string;
  overallRating: number;
  totalReviews: number;
  onBack: () => void;
}

const allReviews: Review[] = [
  {
    id: '1',
    userName: 'John D.',
    rating: 5,
    comment: 'Excellent service! Very thorough and professional. My home has never looked better.',
    date: '2 days ago',
    imageCount: 2
  },
  {
    id: '2',
    userName: 'Sarah M.',
    rating: 5,
    comment: 'Highly recommend! The team was punctual and did an amazing job.',
    date: '1 week ago',
    imageCount: 1
  },
  {
    id: '3',
    userName: 'Michael R.',
    rating: 4,
    comment: 'Good service overall. Would use again.',
    date: '2 weeks ago'
  },
  {
    id: '4',
    userName: 'Emily K.',
    rating: 5,
    comment: 'Outstanding work! They paid attention to every detail and were very respectful.',
    date: '3 weeks ago',
    imageCount: 3
  },
  {
    id: '5',
    userName: 'David L.',
    rating: 5,
    comment: 'Best service I have ever used. Professional, efficient, and friendly.',
    date: '1 month ago'
  },
  {
    id: '6',
    userName: 'Jessica T.',
    rating: 4,
    comment: 'Very satisfied with the service. The only minor issue was they arrived 15 minutes late, but the quality of work made up for it.',
    date: '1 month ago',
    imageCount: 1
  },
  {
    id: '7',
    userName: 'Robert W.',
    rating: 5,
    comment: 'Fantastic! They went above and beyond my expectations. Will definitely use again.',
    date: '1 month ago',
    imageCount: 2
  },
  {
    id: '8',
    userName: 'Amanda P.',
    rating: 5,
    comment: 'Incredible attention to detail. Exceeded all my expectations.',
    date: '2 months ago'
  },
  {
    id: '9',
    userName: 'Christopher B.',
    rating: 4,
    comment: 'Great service. Very professional and thorough. Would recommend to friends.',
    date: '2 months ago'
  },
  {
    id: '10',
    userName: 'Lisa H.',
    rating: 5,
    comment: 'Absolutely perfect! Could not be happier with the results. Thank you!',
    date: '2 months ago',
    imageCount: 1
  }
];

export function VendorReviewsScreen({
  vendorName,
  overallRating,
  totalReviews,
  onBack
}: VendorReviewsScreenProps) {
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  allReviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });

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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Reviews</h1>
        </div>
      </div>

      {/* Vendor Info & Rating Summary */}
      <div
        className="px-6 py-6 glass relative z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(46, 122, 217, 0.05), rgba(46, 122, 217, 0.1))',
          borderBottom: '1px solid rgba(46, 122, 217, 0.1)'
        }}
      >
        <p className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>{vendorName}</p>
        <div className="flex items-start gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{overallRating}</div>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4"
                  style={{
                    color: star <= Math.floor(overallRating) ? 'rgb(250, 204, 21)' : 'var(--muted)',
                    fill: star <= Math.floor(overallRating) ? 'rgb(250, 204, 21)' : 'transparent'
                  }}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating - 1];
              const percentage = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-2 mb-2">
                  <span className="text-sm w-8" style={{ color: 'var(--muted-foreground)' }}>{rating}</span>
                  <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        background: 'var(--primary-gradient)',
                        width: `${percentage}%`
                      }}
                    />
                  </div>
                  <span className="text-sm w-8" style={{ color: 'var(--muted-foreground)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-4">
          {allReviews.map((review, index) => (
            <div
              key={review.id}
              className="p-4 rounded-xl shadow-card"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img src={profilePhoto} alt={review.userName} className="w-10 h-10 rounded-full object-cover shadow-card" />
                  <div>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>{review.userName}</span>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
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
              </div>
              <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>{review.comment}</p>
              {review.imageCount && review.imageCount > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: review.imageCount }, (_, index) => (
                    <div
                      key={index}
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
  );
}
