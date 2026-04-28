import { ArrowLeft, Star, MapPin, Clock, ChevronRight, User } from 'lucide-react';
import type { Vendor } from './VendorDetailScreen';

interface CleaningVendorProfileScreenProps {
  vendor: Vendor;
  onBack: () => void;
  onViewAllReviews: () => void;
  onSelectService: (service: any) => void;
}

export function CleaningVendorProfileScreen({
  vendor,
  onBack,
  onViewAllReviews,
  onSelectService
}: CleaningVendorProfileScreenProps) {
  const services = [
    {
      id: 1,
      name: 'Basic Cleaning',
      description: 'Essential cleaning for your home',
      price: 89,
      duration: '2-3 hours',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Deep Cleaning',
      description: 'Thorough cleaning of every corner',
      price: 149,
      duration: '4-5 hours',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Move In/Out Cleaning',
      description: 'Complete cleaning for moving',
      price: 199,
      duration: '5-6 hours',
      rating: 4.7
    }
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Vendor Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Vendor Header */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-600 text-4xl">🏢</span>
            </div>
            <h2 className="text-gray-900 mb-2">{vendor.name}</h2>
            {vendor.isPoweredByDoHuub && (
              <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm mb-3">
                Powered by DoHuub
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
              <span className="text-gray-900">{vendor.rating}</span>
            </div>
          </div>

          {/* About */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-gray-900 mb-3">About</h3>
            <p className="text-gray-600">
              Professional cleaning services with over 5 years of experience. We pride ourselves on attention to detail and customer satisfaction. Our trained staff uses eco-friendly products and follows strict quality standards.
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
                  <p className="text-gray-600 text-sm">Miami-Dade County & Surrounding Areas</p>
                </div>
              </div>
              <div className="p-3 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <p className="text-gray-900">Operating Hours</p>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-900">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-900">10:00 AM - 4:00 PM</span>
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
                  onClick={() => onSelectService(service)}
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
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <p className="text-gray-900 text-4xl mb-1">{vendor.rating}</p>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{vendor.completedJobs} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm w-3">{rating}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%` }}
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
                      <span className="text-gray-900">Sarah M.</span>
                      <span className="text-gray-600 text-sm">3 days ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Excellent service! The team was professional, thorough, and my home has never looked better. Highly recommend!
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
                      <span className="text-gray-900">Michael R.</span>
                      <span className="text-gray-600 text-sm">1 week ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Very reliable and detail-oriented. They cleaned areas I didn't even think about. Great value for money.
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Jennifer K.</span>
                      <span className="text-gray-600 text-sm">2 weeks ago</span>
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
                  Good service overall. A bit pricey but the quality is there. Would use again.
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