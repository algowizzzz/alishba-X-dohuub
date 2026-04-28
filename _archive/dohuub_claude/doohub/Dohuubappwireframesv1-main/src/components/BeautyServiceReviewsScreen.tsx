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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Reviews</h1>
      </div>

      {/* Rating Summary */}
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <p className="text-gray-700 mb-2">{serviceName}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-6 h-6 text-gray-700 fill-gray-700" />
            <span className="text-gray-900 text-2xl">{overallRating}</span>
          </div>
          <span className="text-gray-600">({totalReviews} reviews)</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
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
              <p className="text-gray-600">{review.comment}</p>
              {review.imageCount && review.imageCount > 0 && (
                <div className="mt-4">
                  <div className="flex gap-2">
                    {Array.from({ length: review.imageCount }, (_, index) => (
                      <div key={index} className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
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
