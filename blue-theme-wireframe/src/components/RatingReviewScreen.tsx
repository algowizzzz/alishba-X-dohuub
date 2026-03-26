import { ArrowLeft, Star, Camera } from 'lucide-react';
import { useState } from 'react';

interface RatingReviewScreenProps {
  booking: any;
  onBack: () => void;
  onSubmit: () => void;
}

export function RatingReviewScreen({ booking, onBack, onSubmit }: RatingReviewScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const ratingLabels = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent!'];

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit();
    }
  };

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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Rate Your Experience</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 relative z-10">
        {/* Booking Info */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{booking?.service}</p>
          <p style={{ color: 'var(--muted-foreground)' }}>{booking?.date}</p>
        </div>

        {/* Rating Stars */}
        <div className="mb-8 text-center">
          <p className="mb-4 font-medium" style={{ color: 'var(--foreground)' }}>How was your experience?</p>
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all duration-300 hover:scale-125"
              >
                <Star
                  className="w-12 h-12 transition-all duration-300"
                  style={{
                    color: star <= (hoveredRating || rating) ? 'rgb(250, 204, 21)' : 'var(--muted)',
                    fill: star <= (hoveredRating || rating) ? 'rgb(250, 204, 21)' : 'transparent'
                  }}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p
              className="font-medium"
              style={{ color: 'var(--primary)' }}
            >
              {ratingLabels[rating - 1]}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Share more details (optional)</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            onFocus={() => setFocusedField('review')}
            onBlur={() => setFocusedField(null)}
            placeholder="Tell us about your experience..."
            rows={5}
            maxLength={500}
            className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 resize-none ${
              focusedField === 'review' ? 'shadow-glow' : 'shadow-card'
            }`}
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)'
            }}
          />
          <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>{review.length}/500</p>
        </div>

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Add Photos (optional)</label>
          <button
            className="w-full p-8 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-card"
            style={{
              backgroundColor: 'var(--card)',
              border: '2px dashed var(--border)'
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-premium-sm"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <Camera className="w-7 h-7" style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <span style={{ color: 'var(--foreground)' }}>Tap to add photos</span>
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Max 5 photos</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 glass px-6 py-4 space-y-3" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: rating > 0 ? 'var(--primary-gradient)' : 'var(--muted)',
            color: rating > 0 ? 'white' : 'var(--muted-foreground)'
          }}
        >
          Submit Review
        </button>
        <button
          onClick={onBack}
          className="w-full py-2 transition-all duration-300"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
