import { ArrowLeft, Star, MapPin, Clock, ChevronRight, Award, User } from 'lucide-react';

interface BeautyProvider {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  specialties: string[];
  isPoweredByDoHuub: boolean;
  yearsExperience: number;
}

interface BeautyProviderProfileScreenProps {
  provider: BeautyProvider;
  onBack: () => void;
  onViewServices: () => void;
  onViewAllReviews: () => void;
}

export function BeautyProviderProfileScreen({
  provider,
  onBack,
  onViewServices,
  onViewAllReviews
}: BeautyProviderProfileScreenProps) {
  const services = [
    { id: 1, name: 'Haircut & Styling', description: 'Professional hair cutting and styling', price: 45, duration: '60 min', rating: 4.9 },
    { id: 2, name: 'Hair Coloring', description: 'Full color treatment with premium products', price: 95, duration: '120 min', rating: 4.8 },
    { id: 3, name: 'Manicure & Pedicure', description: 'Complete nail care and polish', price: 65, duration: '90 min', rating: 4.9 }
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Provider Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Provider Header */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-600 text-4xl">💅</span>
            </div>
            <h2 className="text-gray-900 mb-2">{provider.name}</h2>
            {provider.isPoweredByDoHuub && (
              <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm mb-3">
                Powered by DoHuub
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
              <span className="text-gray-900">{provider.rating}</span>
            </div>
          </div>

          {/* About */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-gray-900 mb-3">About</h3>
            <p className="text-gray-600">
              Professional beauty specialist with over {provider.yearsExperience} years of experience. We pride ourselves on delivering exceptional beauty services with attention to detail and customer satisfaction. Our trained specialists use high-quality products and follow strict quality standards.
            </p>
          </div>

          {/* Service Information */}
          <div>
            <h3 className="text-gray-900 mb-3">Service Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-700 mt-0.5" />
                <div>
                  <p className="text-gray-900">Service Area</p>
                  <p className="text-gray-600 text-sm">Miami Beach & Surrounding Areas</p>
                </div>
              </div>
              <div className="p-3 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <p className="text-gray-900">Operating Hours</p>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tuesday - Friday</span>
                    <span className="text-gray-900">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday - Monday</span>
                    <span className="text-gray-900">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Offered */}
          <div>
            <h3 className="text-gray-900 mb-3">Services Offered</h3>
            <div className="space-y-3">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => onViewServices()}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-gray-900 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">{service.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                          <span className="text-gray-900 text-sm">{service.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-700" />
                          <span className="text-gray-600 text-sm">{service.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-gray-900">${service.price}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reviews & Ratings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Reviews & Ratings</h3>
              <button 
                onClick={onViewAllReviews}
                className="flex items-center gap-1 text-gray-900 text-sm"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Rating Summary */}
            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-gray-900 text-4xl mb-1">{provider.rating}</p>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{provider.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm w-3">{rating}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${rating === 5 ? 82 : rating === 4 ? 15 : 3}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="space-y-3">
              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Amanda R.</span>
                      <span className="text-gray-600 text-sm">1 week ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Absolutely love my haircut! Very professional and listened to exactly what I wanted. Best beauty service I've had!
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Nicole P.</span>
                      <span className="text-gray-600 text-sm">2 weeks ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Very skilled and detail-oriented. The manicure was perfect and lasted longer than expected. Highly recommend!
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Jessica M.</span>
                      <span className="text-gray-600 text-sm">3 weeks ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                      <Star className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Good service overall. A bit rushed but the results were great. Would use again.
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}