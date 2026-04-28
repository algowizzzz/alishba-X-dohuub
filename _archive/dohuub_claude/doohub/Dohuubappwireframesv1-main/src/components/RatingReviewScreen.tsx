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

  const ratingLabels = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent!'];

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit();
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Rate Your Experience</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-900 mb-1">{booking?.service}</p>
          <p className="text-gray-600">{booking?.date}</p>
        </div>

        <div className="mb-8 text-center">
          <p className="text-gray-900 mb-4">How was your experience?</p>
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoveredRating || rating)
                      ? 'text-gray-700 fill-gray-700'
                      : 'text-gray-300'
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-gray-700">{ratingLabels[rating - 1]}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 mb-2">Share more details (optional)</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={5}
            maxLength={500}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg resize-none"
          />
          <p className="text-gray-500 mt-2">{review.length}/500</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 mb-2">Add Photos (optional)</label>
          <button className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center gap-2">
            <Camera className="w-8 h-8 text-gray-400" />
            <span className="text-gray-600">Tap to add photos</span>
            <span className="text-gray-500">Max 5 photos</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`w-full py-4 rounded-lg border-2 ${
            rating > 0
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-gray-200 text-gray-400 border-gray-200'
          }`}
        >
          Submit Review
        </button>
        <button onClick={onBack} className="w-full text-gray-600">
          Skip for now
        </button>
      </div>
    </div>
  );
}