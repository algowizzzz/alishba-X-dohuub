import { ArrowLeft, Star, X, Image as ImageIcon } from 'lucide-react';
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

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Rate Your Experience</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Service Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-400 text-2xl">
                {bookingData.providerName ? '💅' : '🧹'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 mb-1">
                {typeof bookingData.service === 'string' ? bookingData.service : bookingData.service?.name || 'Service'}
              </h3>
              <p className="text-gray-600 text-sm">
                {bookingData.date} at {bookingData.time}
              </p>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-3">Rate Your Experience *</label>
          <div className="flex items-center justify-center gap-2 p-6 bg-gray-50 rounded-xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer transition-all"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating) 
                      ? 'text-gray-900 fill-gray-900' 
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-gray-600 mt-2">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-2">Write Your Review *</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this service..."
            className="w-full p-4 border-2 border-gray-300 rounded-xl"
            rows={6}
          />
          <p className="text-gray-500 text-sm mt-2">
            {reviewText.length} characters
          </p>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-900 mb-2">Add Photos (Optional)</label>
          <div className="flex items-center gap-2 flex-wrap">
            {images.map((image, index) => (
              <div key={index} className="relative w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button
                onClick={handleAddImage}
                className="w-20 h-20 bg-gray-100 text-gray-900 rounded-lg flex flex-col items-center justify-center border-2 border-gray-300 border-dashed"
              >
                <ImageIcon className="w-6 h-6 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Add</span>
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-2">You can add up to 5 photos</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 border-t-2 border-gray-200 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl ${
            isValid
              ? 'bg-gray-900 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit Review
        </button>
        <button
          onClick={onReviewLater}
          className="w-full py-4 border-2 border-gray-300 text-gray-900 rounded-xl"
        >
          Review Later
        </button>
      </div>
    </div>
  );
}