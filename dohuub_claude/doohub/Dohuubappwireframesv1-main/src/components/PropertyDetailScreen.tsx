import { ArrowLeft, Star, Bed, Bath, Users, Maximize, MapPin, Wifi, Car, Tv, Wind, Waves, UtensilsCrossed, Shirt, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import type { Property } from './RentalPropertiesListScreen';

interface PropertyDetailScreenProps {
  property: Property;
  onBack: () => void;
  onCheckAvailability: () => void;
  onViewHostProfile?: () => void;
}

export function PropertyDetailScreen({
  property,
  onBack,
  onCheckAvailability,
  onViewHostProfile
}: PropertyDetailScreenProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'TV': Tv,
    'AC': Wind,
    'Pool': Waves,
    'Kitchen': UtensilsCrossed,
    'Washer': Shirt,
    'Heating': Wind
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Property Details</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Photo Gallery */}
        <div className="relative">
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center relative">
            <span className="text-gray-500 text-6xl">🏠</span>
            {property.isPoweredByDoHuub && (
              <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1.5 rounded-full text-sm">
                Powered by DoHuub
              </div>
            )}
          </div>
          
          {/* Photo Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {property.photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Property Title & Rating */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-gray-900 flex-1">{property.name}</h2>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
                <span className="text-gray-900">{property.rating}</span>
                <span className="text-gray-600">({property.reviews})</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Host Info */}
          {onViewHostProfile && (
            <button 
              onClick={onViewHostProfile}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 text-xl">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 underline">
                  {property.isPoweredByDoHuub ? 'Hosted by DoHuub' : 'Hosted by Sarah Johnson'}
                </p>
                <p className="text-gray-600 text-sm">
                  {property.isPoweredByDoHuub ? 'Professional property management' : 'Superhost · 5 years hosting'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {!onViewHostProfile && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 text-xl">👤</span>
              </div>
              <div>
                <p className="text-gray-900">
                  {property.isPoweredByDoHuub ? 'Hosted by DoHuub' : 'Hosted by Sarah Johnson'}
                </p>
                <p className="text-gray-600 text-sm">
                  {property.isPoweredByDoHuub ? 'Professional property management' : 'Superhost · 5 years hosting'}
                </p>
              </div>
            </div>
          )}

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl">
              <Bed className="w-6 h-6 text-gray-700" />
              <div>
                <p className="text-gray-900">{property.bedrooms}</p>
                <p className="text-gray-600 text-sm">Bedrooms</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl">
              <Bath className="w-6 h-6 text-gray-700" />
              <div>
                <p className="text-gray-900">{property.bathrooms}</p>
                <p className="text-gray-600 text-sm">Bathrooms</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl">
              <Users className="w-6 h-6 text-gray-700" />
              <div>
                <p className="text-gray-900">{property.maxGuests}</p>
                <p className="text-gray-600 text-sm">Max Guests</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl">
              <Maximize className="w-6 h-6 text-gray-700" />
              <div>
                <p className="text-gray-900">{property.sqft} ft²</p>
                <p className="text-gray-600 text-sm">Area</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-gray-900 mb-3">Pricing</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Per Night</span>
                <span className="text-gray-900">${property.pricePerNight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Per Week</span>
                <span className="text-gray-900">${property.pricePerWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Per Month</span>
                <span className="text-gray-900">${property.pricePerMonth}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-gray-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.amenities.map(amenity => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <div key={amenity} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl">
                    <Icon className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 text-sm">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600">{property.description}</p>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-gray-900 mb-3">Location</h3>
            <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mt-2">{property.location}</p>
          </div>

          {/* House Rules */}
          <div>
            <h3 className="text-gray-900 mb-3">House Rules</h3>
            <div className="space-y-2">
              {property.houseRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-600">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Reviews</h3>
              <button className="flex items-center gap-1 text-gray-900 text-sm">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Review 1 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">John D.</span>
                  <span className="text-gray-600 text-sm">2 days ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Excellent service! Very thorough and professional. My home has never looked better.
                </p>
                <div className="flex gap-2">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">Sarah M.</span>
                  <span className="text-gray-600 text-sm">1 week ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Highly recommend! The team was punctual and did an amazing job.
                </p>
                <div className="flex gap-2">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">Michael R.</span>
                  <span className="text-gray-600 text-sm">2 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                  ))}
                  <Star className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm">
                  Good service overall. Would use again.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Spacing for Button */}
          <div className="h-20" />
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-white">
        <button
          onClick={onCheckAvailability}
          className="w-full py-3 bg-gray-900 text-white rounded-xl"
        >
          Check Availability
        </button>
      </div>
    </div>
  );
}