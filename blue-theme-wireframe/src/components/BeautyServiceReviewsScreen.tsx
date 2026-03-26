import { ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  imageCount?: number;
}

interface BeautyServiceReviewsScreenProps {
  serviceName: string;
  overallRating: number;
  totalReviews: number;
  onBack: () => void;
}

const allReviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah M.',
    rating: 5,
    comment: 'Absolutely amazing service! Very professional and the results were stunning. Highly recommend!',
    date: '2 days ago',
    imageCount: 3
  },
  {
    id: '2',
    userName: 'Emily J.',
    rating: 5,
    comment: 'Best beauty service I\'ve ever had. The attention to detail was incredible.',
    date: '1 week ago',
    imageCount: 2
  },
  {
    id: '3',
    userName: 'Jessica B.',
    rating: 4,
    comment: 'Great service overall. Very satisfied with the results.',
    date: '2 weeks ago'
  },
  {
    id: '4',
    userName: 'Amanda D.',
    rating: 5,
    comment: 'Outstanding work! They were so professional and the results exceeded my expectations.',
    date: '3 weeks ago',
    imageCount: 1
  },
  {
    id: '5',
    userName: 'Michelle K.',
    rating: 5,
    comment: 'Best beauty professional I have ever used. Skilled, efficient, and friendly.',
    date: '1 month ago',
    imageCount: 2
  },
  {
    id: '6',
    userName: 'Rachel T.',
    rating: 4,
    comment: 'Very satisfied with the service. The results were beautiful and long-lasting.',
    date: '1 month ago',
    imageCount: 1
  },
  {
    id: '7',
    userName: 'Jennifer W.',
    rating: 5,
    comment: 'Fantastic! They went above and beyond my expectations. Will definitely book again.',
    date: '1 month ago',
    imageCount: 3
  },
  {
    id: '8',
    userName: 'Nicole P.',
    rating: 5,
    comment: 'Incredible attention to detail. They made sure everything was perfect.',
    date: '2 months ago'
  },
  {
    id: '9',
    userName: 'Christina B.',
    rating: 4,
    comment: 'Great service. Very professional and skilled. Would recommend to friends.',
    date: '2 months ago',
    imageCount: 1
  },
  {
    id: '10',
    userName: 'Lauren H.',
    rating: 5,
    comment: 'Absolutely perfect! I have never looked better. Thank you!',
    date: '2 months ago',
    imageCount: 2
  }
];

export function BeautyServiceReviewsScreen({
  serviceName,
  overallRating,
  totalReviews,
  onBack
}: BeautyServiceReviewsScreenProps) {
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

      {/* Rating Summary */}
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
        <p className="mb-2" style={{ color: 'var(--foreground)' }}>{serviceName}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-6 h-6" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{overallRating}</span>
          </div>
          <span style={{ color: 'var(--muted-foreground)' }}>({totalReviews} reviews)</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
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
              <p style={{ color: 'var(--muted-foreground)' }}>{review.comment}</p>
              {review.imageCount && review.imageCount > 0 && (
                <div className="mt-4">
                  <div className="flex gap-2">
                    {Array.from({ length: review.imageCount }, (_, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <ImageIcon className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
