import { ArrowLeft, Star, Car, MapPin, ChevronRight } from 'lucide-react';
import type { RideProvider } from './RideProvidersListScreen';

interface RideProviderDetailScreenProps {
  provider: RideProvider;
  onBack: () => void;
  onBookRide: () => void;
  onViewAllReviews?: () => void;
}

export function RideProviderDetailScreen({
  provider,
  onBack,
  onBookRide,
  onViewAllReviews
}: RideProviderDetailScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Provider Details</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Provider Info */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <Car className="w-10 h-10 text-gray-600" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900 mb-1">{provider.name}</h2>
              {provider.isPoweredByDoHuub && (
                <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm mb-2">
                  Powered by DoHuub
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
                  <span className="text-gray-900">{provider.rating}</span>
                </div>
                <span className="text-gray-600">({provider.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Hourly Rate</span>
              <span className="text-gray-900 text-2xl">${provider.hourlyRate}/hour</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-gray-900 mb-3">About</h3>
            <p className="text-gray-600">{provider.description}</p>
          </div>

          {/* Vehicle Types */}
          <div>
            <h3 className="text-gray-900 mb-3">Available Vehicle Types</h3>
            <div className="space-y-3">
              {provider.vehicleTypes.map(type => (
                <div key={type} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Car className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-900">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          {provider.wheelchairAccessible && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-gray-700" />
                <div>
                  <p className="text-gray-900">Wheelchair Accessible</p>
                  <p className="text-gray-600 text-sm">Vehicles equipped for wheelchair access</p>
                </div>
              </div>
            </div>
          )}

          {/* Special Features */}
          <div>
            <h3 className="text-gray-900 mb-3">Special Features</h3>
            <div className="space-y-2">
              {provider.specialFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage Area */}
          <div>
            <h3 className="text-gray-900 mb-3">Coverage Area</h3>
            <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-700" />
              <span className="text-gray-900">{provider.coverageArea}</span>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Reviews</h3>
              <button
                className="flex items-center gap-1 text-gray-900 text-sm"
                onClick={onViewAllReviews}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Review 1 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">Margaret T.</span>
                  <span className="text-gray-600 text-sm">1 week ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">
                  Excellent service! The driver was very patient and helpful with my appointments.
                </p>
              </div>

              {/* Review 2 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">Robert K.</span>
                  <span className="text-gray-600 text-sm">2 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">
                  Very reliable and professional. Highly recommend for medical appointments.
                </p>
              </div>

              {/* Review 3 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">Linda P.</span>
                  <span className="text-gray-600 text-sm">3 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                  ))}
                  <Star className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm">
                  Good service overall. Could improve on punctuality.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-20" />
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-white">
        <button
          onClick={onBookRide}
          className="w-full py-3 bg-gray-900 text-white rounded-xl"
        >
          Book Ride Service
        </button>
      </div>
    </div>
  );
}