import { ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';
import profilePhoto from '../assets/profile photo (2).png';

interface AllReviewsScreenProps {
  service: any;
  onBack: () => void;
}

const reviews = [
  {
    id: 1,
    user: 'Sarah M.',
    rating: 5,
    date: '2 days ago',
    text: 'Excellent service! Very thorough and professional. Would definitely recommend.',
    imageCount: 3
  },
  {
    id: 2,
    user: 'John D.',
    rating: 5,
    date: '1 week ago',
    text: 'Great experience from start to finish. The team was punctual and detail-oriented.',
    imageCount: 2
  },
  {
    id: 3,
    user: 'Emily R.',
    rating: 4,
    date: '2 weeks ago',
    text: 'Good service overall. Minor issue with scheduling but they resolved it quickly.',
    imageCount: 1
  },
  {
    id: 4,
    user: 'Michael B.',
    rating: 5,
    date: '3 weeks ago',
    text: 'Outstanding quality! My office has never looked better.',
    imageCount: 3
  },
  {
    id: 5,
    user: 'Lisa K.',
    rating: 5,
    date: '1 month ago',
    text: 'Highly professional and efficient. Will use again!',
    imageCount: 2
  },
];

export function AllReviewsScreen({ service, onBack }: AllReviewsScreenProps) {
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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Reviews ({service?.reviews || 234})</h3>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="px-6 py-6 relative z-10">
        <div
          className="p-6 rounded-2xl shadow-premium-md"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="text-center mb-4">
            <div className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{service?.rating || 4.9}</div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
              ))}
            </div>
            <p style={{ color: 'var(--muted-foreground)' }}>Based on {service?.reviews || 234} reviews</p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-8" style={{ color: 'var(--muted-foreground)' }}>{stars} ★</span>
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      background: 'var(--primary-gradient)',
                      width: `${stars === 5 ? 85 : stars === 4 ? 12 : stars === 3 ? 2 : 1}%`
                    }}
                  ></div>
                </div>
                <span className="w-12 text-right" style={{ color: 'var(--muted-foreground)' }}>{stars === 5 ? 198 : stars === 4 ? 28 : 8}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Filter */}
      <div className="px-6 py-2 relative z-10">
        <select
          className="w-full px-4 py-3 rounded-xl shadow-card outline-none transition-all duration-300 focus:shadow-glow"
          style={{
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)'
          }}
        >
          <option>Most Helpful</option>
          <option>Most Recent</option>
          <option>Highest Rated</option>
          <option>Lowest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm"
              style={{
                backgroundColor: 'var(--card)',
                              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={profilePhoto} alt={review.user} className="w-12 h-12 rounded-full object-cover shadow-premium-sm" />
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{review.user}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                    ))}
                  </div>
                </div>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{review.date}</span>
              </div>
              <p style={{ color: 'var(--muted-foreground)' }}>{review.text}</p>
              {review.imageCount > 0 && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Attached Pictures</span>
                    <span
                      className="inline-block px-2 py-0.5 text-xs rounded-full text-white"
                      style={{ background: 'var(--primary-gradient)' }}
                    >
                      Powered by DoHuub
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(review.imageCount)].map((_, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg flex items-center justify-center"
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
