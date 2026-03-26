import { ArrowLeft, Star, DollarSign, Clock, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

interface BeautyServiceDetailScreenProps {
  service: {
    id: number;
    name: string;
    category: string;
    price: string;
    duration: string;
    rating: number;
    reviews: number;
    description?: string;
  };
  provider: {
    name: string;
    rating?: number;
    reviewCount?: string;
    isPoweredByDoHuub?: boolean;
  };
  onBack: () => void;
  onBookService: () => void;
  onViewAllReviews?: () => void;
}

const reviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah M.',
    rating: 5,
    comment: 'Absolutely amazing service! Very professional and the results were stunning. Highly recommend!',
    date: '2 days ago',
    images: ['image1', 'image2', 'image3']
  },
  {
    id: '2',
    userName: 'Emily J.',
    rating: 5,
    comment: 'Best beauty service I\'ve ever had. The attention to detail was incredible.',
    date: '1 week ago',
    images: ['image1', 'image2']
  },
  {
    id: '3',
    userName: 'Jessica B.',
    rating: 4,
    comment: 'Great service overall. Very satisfied with the results.',
    date: '2 weeks ago'
  }
];

export function BeautyServiceDetailScreen({ 
  service, 
  provider,
  onBack, 
  onBookService,
  onViewAllReviews
}: BeautyServiceDetailScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Service Details</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Service Image */}
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-6xl">💅</span>
        </div>

        {/* Service Info */}
        <div className="px-6 py-4">
          {/* Title and Rating */}
          <div className="mb-4">
            <h2 className="text-gray-900 mb-2">{service.name}</h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-gray-700 fill-gray-700" />
                <span className="text-gray-900">{service.rating}</span>
              </div>
              <span className="text-gray-600">({service.reviews} reviews)</span>
            </div>
            <p className="text-gray-600">
              {service.description || `Experience our premium ${service.name.toLowerCase()} service performed by highly trained beauty professionals. We use only the best quality products to ensure stunning results.`}
            </p>
          </div>

          {/* Provider Info */}
          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-400">👤</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">{provider.name}</p>
                  {provider.isPoweredByDoHuub && (
                    <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded">
                      Powered by DoHuub
                    </span>
                  )}
                </div>
                {provider.rating && provider.reviewCount && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-gray-700 fill-gray-700" />
                    <span className="text-gray-700 text-sm">{provider.rating} ({provider.reviewCount})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price and Duration Info */}
          <div className="mb-4 p-4 border-2 border-gray-300 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-gray-700" />
              <span className="text-gray-900">Pricing</span>
              <span className="text-gray-700 ml-auto">{service.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-700" />
              <span className="text-gray-900">Duration</span>
              <span className="text-gray-700 ml-auto">{service.duration}</span>
            </div>
          </div>

          {/* Service Details */}
          <div className="mb-4">
            <h3 className="text-gray-900 mb-3">What's Included</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-gray-700 mt-1">✓</span>
                <span className="text-gray-600">Professional consultation and assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-700 mt-1">✓</span>
                <span className="text-gray-600">Premium quality beauty products and tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-700 mt-1">✓</span>
                <span className="text-gray-600">Expert application by certified professionals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-700 mt-1">✓</span>
                <span className="text-gray-600">Aftercare advice and maintenance tips</span>
              </li>
            </ul>
          </div>

          {/* Reviews Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">Reviews</h3>
              {onViewAllReviews && (
                <button 
                  onClick={onViewAllReviews}
                  className="flex items-center gap-1 text-gray-700"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
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
                  <p className="text-gray-600 mb-2">{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {review.images.map((img, idx) => (
                        <div key={idx} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t-2 border-gray-200">
        <button
          onClick={onBookService}
          className="w-full py-4 bg-gray-900 text-white rounded-xl"
        >
          Book Service
        </button>
      </div>
    </div>
  );
}

export type { Review };
