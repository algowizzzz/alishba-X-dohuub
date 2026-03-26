import { ArrowLeft, Star, MapPin, ChevronRight, Wrench, Clock, User } from 'lucide-react';
import type { HandymanVendor } from './HandymanVendorDetailScreen';

interface HandymanVendorProfileScreenProps {
  vendor: HandymanVendor;
  onBack: () => void;
  onViewAllReviews: () => void;
  onSelectService: (service: any) => void;
}

export function HandymanVendorProfileScreen({
  vendor,
  onBack,
  onViewAllReviews,
  onSelectService
}: HandymanVendorProfileScreenProps) {
  const servicesOffered = [
    {
      id: 1,
      name: 'Outlet Installation',
      description: 'Professional electrical outlet installation and repair',
      price: 75,
      duration: '1-2 hours',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Light Fixture Repair',
      description: 'Fix and install light fixtures and ceiling fans',
      price: 85,
      duration: '1-2 hours',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Faucet Repair',
      description: 'Repair leaky faucets and install new fixtures',
      price: 90,
      duration: '1-2 hours',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Furniture Assembly',
      description: 'Expert assembly of all types of furniture',
      price: 60,
      duration: '1-3 hours',
      rating: 4.7
    },
    {
      id: 5,
      name: 'Door Installation',
      description: 'Install and repair interior and exterior doors',
      price: 120,
      duration: '2-3 hours',
      rating: 4.8
    },
    {
      id: 6,
      name: 'Interior Painting',
      description: 'Professional interior painting and touch-ups',
      price: 150,
      duration: '3-5 hours',
      rating: 4.9
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
              <Wrench className="w-12 h-12 text-gray-600" />
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
              Expert handyman services for all your home repair and improvement needs. With years of experience and a commitment to quality workmanship, we handle everything from minor repairs to major installations.
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
                  <p className="text-gray-600 text-sm">Greater Miami Area - 20 mile radius</p>
                </div>
              </div>
              <div className="p-3 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <p className="text-gray-900">Availability</p>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-900">7:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900">8:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Offered */}
          <div>
            <h3 className="text-gray-900 mb-3">Services Offered</h3>
            <div className="space-y-3">
              {servicesOffered.map(service => (
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
                          style={{ width: `${rating === 5 ? 70 : rating === 4 ? 25 : 5}%` }}
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
                      <span className="text-gray-900">David T.</span>
                      <span className="text-gray-600 text-sm">2 days ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Fixed my electrical outlet quickly and professionally. Very knowledgeable and fair pricing!
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
                      <span className="text-gray-900">Lisa P.</span>
                      <span className="text-gray-600 text-sm">5 days ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Excellent work on furniture assembly and door installation. Highly recommend!
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Robert M.</span>
                      <span className="text-gray-600 text-sm">1 week ago</span>
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
                  Good service, though took a bit longer than expected. Quality work though.
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