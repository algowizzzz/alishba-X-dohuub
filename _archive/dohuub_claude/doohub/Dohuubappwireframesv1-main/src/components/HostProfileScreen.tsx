import { ArrowLeft, Star, ChevronRight, User } from 'lucide-react';
import type { Property } from './RentalPropertiesListScreen';

interface HostProfileScreenProps {
  property: Property;
  onBack: () => void;
  onViewAllReviews: () => void;
  onSelectProperty: (property: Property) => void;
}

export function HostProfileScreen({
  property,
  onBack,
  onViewAllReviews,
  onSelectProperty
}: HostProfileScreenProps) {
  // Mock properties hosted by this host
  const hostedProperties = [
    {
      id: 1,
      name: 'Cozy Downtown Apartment',
      location: 'Miami Beach, FL',
      pricePerNight: 120,
      bedrooms: 2,
      bathrooms: 1,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Luxury Waterfront Condo',
      location: 'Brickell, Miami',
      pricePerNight: 250,
      bedrooms: 3,
      bathrooms: 2,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Modern Studio',
      location: 'Wynwood, Miami',
      pricePerNight: 85,
      bedrooms: 1,
      bathrooms: 1,
      rating: 4.7
    }
  ];

  // Calculate total reviews and average rating from hosted properties
  const totalReviews = 127;
  const averageRating = 4.8;
  const hostName = property.isPoweredByDoHuub ? 'DoHuub Properties' : 'Sarah Johnson';

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Host Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Host Header */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-600 text-4xl">👤</span>
            </div>
            <h2 className="text-gray-900 mb-2">{hostName}</h2>
            {property.isPoweredByDoHuub && (
              <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm mb-3">
                Powered by DoHuub
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
              <span className="text-gray-900">{averageRating}</span>
            </div>
          </div>

          {/* About */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-gray-900 mb-3">About</h3>
            <p className="text-gray-600">
              {property.isPoweredByDoHuub 
                ? 'DoHuub Properties is a professional property management company dedicated to providing exceptional rental experiences. We manage a diverse portfolio of properties and pride ourselves on hospitality, cleanliness, and guest satisfaction.'
                : 'Experienced host with a passion for hospitality. I love welcoming guests to Miami and ensuring they have a comfortable and memorable stay. With years of hosting experience, I understand what makes a great vacation rental.'
              }
            </p>
          </div>

          {/* Host Stats */}
          <div className="flex items-center justify-center gap-8 p-4 border-2 border-gray-200 rounded-xl">
            <div className="text-center">
              <p className="text-gray-900 mb-1">2019</p>
              <p className="text-gray-600 text-sm">Host since</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-gray-900 mb-1">3</p>
              <p className="text-gray-600 text-sm">Rental properties</p>
            </div>
          </div>

          {/* Properties Hosted */}
          <div>
            <h3 className="text-gray-900 mb-3">Properties Hosted</h3>
            <div className="space-y-3">
              {hostedProperties.map(prop => (
                <button
                  key={prop.id}
                  onClick={() => onSelectProperty(property)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-gray-900 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">{prop.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{prop.location}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                          <span className="text-gray-900 text-sm">{prop.rating}</span>
                        </div>
                        <span className="text-gray-600 text-sm">{prop.bedrooms} bed · {prop.bathrooms} bath</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-gray-900">${prop.pricePerNight}</p>
                      <p className="text-gray-600 text-sm">per night</p>
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
                  <p className="text-gray-900 text-4xl mb-1">{averageRating}</p>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{totalReviews} reviews</p>
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
                      <span className="text-gray-900">Michael T.</span>
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
                  Excellent host! Very responsive and helpful throughout our stay. The property was exactly as described and in great condition. Highly recommend!
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
                      <span className="text-gray-900">Emma R.</span>
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
                  Great communication and a wonderful property. Everything was clean and well-maintained. Would definitely book again!
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">James L.</span>
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
                  Nice place and good host. Check-in was smooth. Only minor issue was the WiFi speed, but overall a good experience.
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