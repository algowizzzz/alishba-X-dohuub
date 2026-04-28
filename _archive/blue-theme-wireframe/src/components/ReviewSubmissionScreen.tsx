import { ArrowLeft, Star, X, Image as ImageIcon } from 'lucide-react';
import { Scissors as PhScissors, Broom } from '@phosphor-icons/react';
import { useState } from 'react';

interface ReviewSubmissionScreenProps {
  bookingData: any;
  onBack: () => void;
  onSubmit: (reviewData: { rating: number; comment: string; images: string[] }) => void;
  onReviewLater: () => void;
}

export function ReviewSubmissionScreen({
  bookingData,
  onBack,
  onSubmit,
  onReviewLater
}: ReviewSubmissionScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleAddImage = () => {
    if (images.length < 5) {
      setImages([...images, `image-${images.length + 1}`]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0 || reviewText.trim() === '') {
      return;
    }
    onSubmit({ rating, comment: reviewText, images });
  };

  const isValid = rating > 0 && reviewText.trim().length > 0;

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

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
        <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Rate Your Experience</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        {/* Service Info */}
        <div
          className="mb-6 p-4 rounded-xl shadow-card"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="flex gap-3">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-premium-sm"
              style={{ background: 'var(--primary-gradient)' }}
            >
              {bookingData.providerName ? (
                <PhScissors size={24} weight="duotone" className="text-white" />
              ) : (
                <Broom size={24} weight="duotone" className="text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                {typeof bookingData.service === 'string' ? bookingData.service : bookingData.service?.name || 'Service'}
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {bookingData.date} at {bookingData.time}
              </p>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block mb-3 font-medium" style={{ color: 'var(--foreground)' }}>Rate Your Experience *</label>
          <div
            className="flex items-center justify-center gap-2 p-6 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer transition-all duration-300 hover:scale-125"
              >
                <Star
                  className="w-10 h-10 transition-all duration-300"
                  style={{
                    color: star <= (hoverRating || rating) ? 'rgb(250, 204, 21)' : 'var(--muted)',
                    fill: star <= (hoverRating || rating) ? 'rgb(250, 204, 21)' : 'transparent'
                  }}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center mt-2 font-medium" style={{ color: 'var(--primary)' }}>
              {getRatingLabel(rating)}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Write Your Review *</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            onFocus={() => setFocusedField('review')}
            onBlur={() => setFocusedField(null)}
            placeholder="Share your experience with this service..."
            className={`w-full p-4 rounded-xl outline-none transition-all duration-300 resize-none ${
              focusedField === 'review' ? 'shadow-glow' : 'shadow-card'
            }`}
            style={{
              backgroundColor: 'var(--input-background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)'
            }}
            rows={6}
          />
          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            {reviewText.length} characters
          </p>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium" style={{ color: 'var(--foreground)' }}>Add Photos (Optional)</label>
          <div className="flex items-center gap-2 flex-wrap">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-20 h-20 rounded-xl flex items-center justify-center shadow-card"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <ImageIcon className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-premium-sm"
                  style={{ backgroundColor: 'var(--destructive)', color: 'white' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button
                onClick={handleAddImage}
                className="w-20 h-20 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-card"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '2px dashed var(--border)'
                }}
              >
                <ImageIcon className="w-6 h-6 mb-1" style={{ color: 'var(--muted-foreground)' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Add</span>
              </button>
            )}
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>You can add up to 5 photos</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 glass space-y-3 relative z-10" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: isValid ? 'var(--primary-gradient)' : 'var(--muted)',
            color: isValid ? 'white' : 'var(--muted-foreground)'
          }}
        >
          Submit Review
        </button>
        <button
          onClick={onReviewLater}
          className="w-full py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
          style={{
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)'
          }}
        >
          Review Later
        </button>
      </div>
    </div>
  );
}
