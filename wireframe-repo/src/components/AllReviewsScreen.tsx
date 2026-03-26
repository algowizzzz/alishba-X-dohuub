import { ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';

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
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h3 className="text-gray-900">Reviews ({service?.reviews || 234})</h3>
        </div>
      </div>

      <div className="px-6 py-6 border-b-2 border-gray-200">
        <div className="text-center mb-4">
          <div className="text-gray-900 mb-2">{service?.rating || 4.9}</div>
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 text-gray-700 fill-gray-700" />
            ))}
          </div>
          <p className="text-gray-600">Based on {service?.reviews || 234} reviews</p>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-gray-600 w-8">{stars} ★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-700"
                  style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : stars === 3 ? 2 : 1}%` }}
                ></div>
              </div>
              <span className="text-gray-600 w-12 text-right">{stars === 5 ? 198 : stars === 4 ? 28 : 8}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-b-2 border-gray-200">
        <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700">
          <option>Most Helpful</option>
          <option>Most Recent</option>
          <option>Highest Rated</option>
          <option>Lowest Rated</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border-2 border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <p className="text-gray-900">{review.user}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gray-700 fill-gray-700" />
                    ))}
                  </div>
                </div>
                <span className="text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-600">{review.text}</p>
              {review.imageCount > 0 && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600 text-sm">Attached Pictures</span>
                    <span className="inline-block px-2 py-0.5 bg-gray-900 text-white text-xs rounded">
                      Powered by DoHuub
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(review.imageCount)].map((_, index) => (
                      <div key={index} className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
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