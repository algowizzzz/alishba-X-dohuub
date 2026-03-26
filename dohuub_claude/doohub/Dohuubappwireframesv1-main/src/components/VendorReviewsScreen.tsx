import { ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';

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
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Reviews</h1>
      </div>

      {/* Vendor Info */}
      <div className="px-6 py-4">
        <p className="text-gray-700 mb-2">{vendorName}</p>
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-gray-700 fill-gray-700" />
          <span className="text-gray-900 text-xl">{overallRating}</span>
          <span className="text-gray-600">({totalReviews} reviews)</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-4">
          {allReviews.map((review) => (
            <div key={review.id} className="p-4 border-2 border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-900">{review.userName}</span>
                <span className="text-gray-500 text-sm">{review.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-gray-700 fill-gray-700' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-3">{review.comment}</p>
              {review.imageCount && review.imageCount > 0 && (
                <div className="flex gap-2">
                  {Array.from({ length: review.imageCount }, (_, index) => (
                    <div key={index} className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
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
