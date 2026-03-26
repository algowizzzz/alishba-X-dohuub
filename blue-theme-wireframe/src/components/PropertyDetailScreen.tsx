import { ArrowLeft, Star, Bed, Bath, Users, Maximize, MapPin, Wifi, Car, Tv, Wind, Waves, UtensilsCrossed, Shirt, ChevronRight, Image as ImageIcon, Gift } from 'lucide-react';
import { House as PhHouse, UserCircle } from '@phosphor-icons/react';
import { useState } from 'react';
import rentalListImg1 from '../assets/rental listing/rental listing (1).png';
import rentalListImg2 from '../assets/rental listing/rental listing (2).png';
import rentalListImg3 from '../assets/rental listing/rental listing (3).png';
import rentalListImg4 from '../assets/rental listing/rental listing (4).png';
import profilePhoto from '../assets/profile photo (2).png';

const rentalPhotos = [rentalListImg1, rentalListImg2, rentalListImg3, rentalListImg4];
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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="px-6 py-4 glass relative z-20 sticky top-0" style={{ borderBottom: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Property Details</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Photo Gallery */}
        <div className="relative">
          <div className="relative">
            <img src={rentalPhotos[currentPhotoIndex % rentalPhotos.length]} alt={property.name} className="w-full h-64 object-cover transition-all duration-300" />
            {property.isPoweredByDoHuub && (
              <div className="absolute top-4 right-4">
                <span
                  className="px-3 py-1.5 text-white text-sm font-medium rounded-full flex items-center gap-1 shadow-premium-sm"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  Powered by DoHuub
                </span>
              </div>
            )}
          </div>

          {/* Photo Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {property.photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index === currentPhotoIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  transform: index === currentPhotoIndex ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Property Title & Rating */}
          <div className="">
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-bold text-xl flex-1" style={{ color: 'var(--foreground)' }}>{property.name}</h2>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <Star className="w-5 h-5" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{property.rating}</span>
                <span style={{ color: 'var(--muted-foreground)' }}>({property.reviews})</span>
              </div>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Points Earning Banner */}
          {property.isPoweredByDoHuub && (
            <div
              className="p-4 rounded-xl shadow-premium-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.1))',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
                >
                  <Gift className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'rgb(180, 83, 9)' }}>
                    Earn points on this booking
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(217, 119, 6)' }}>
                    1 point per $1 spent • Points added after checkout
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Host Info */}
          {onViewHostProfile && (
            <button
              onClick={onViewHostProfile}
              className="w-full flex items-center gap-3 p-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99] text-left"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <img src={profilePhoto} alt="Host" className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-premium-sm" />
              <div className="flex-1">
                <p className="font-medium underline" style={{ color: 'var(--foreground)' }}>
                  {property.isPoweredByDoHuub ? 'Hosted by DoHuub' : 'Hosted by Sarah Johnson'}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {property.isPoweredByDoHuub ? 'Professional property management' : 'Superhost · 5 years hosting'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            </button>
          )}
          {!onViewHostProfile && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <img src={profilePhoto} alt="Host" className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-premium-sm" />
              <div>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {property.isPoweredByDoHuub ? 'Hosted by DoHuub' : 'Hosted by Sarah Johnson'}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {property.isPoweredByDoHuub ? 'Professional property management' : 'Superhost · 5 years hosting'}
                </p>
              </div>
            </div>
          )}

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="flex items-center gap-3 p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <Bed className="w-6 h-6" style={{ color: 'rgb(20, 184, 166)' }} />
              <div>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{property.bedrooms}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Bedrooms</p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <Bath className="w-6 h-6" style={{ color: 'rgb(20, 184, 166)' }} />
              <div>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{property.bathrooms}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Bathrooms</p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <Users className="w-6 h-6" style={{ color: 'rgb(20, 184, 166)' }} />
              <div>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{property.maxGuests}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Max Guests</p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-4 rounded-xl shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <Maximize className="w-6 h-6" style={{ color: 'rgb(20, 184, 166)' }} />
              <div>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{property.sqft} ft²</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Area</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(6, 148, 162, 0.1))',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              
            }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Pricing</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Per Night</span>
                <span className="font-semibold" style={{ color: 'rgb(20, 184, 166)' }}>${property.pricePerNight}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Per Week</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>${property.pricePerWeek}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Per Month</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>${property.pricePerMonth}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.amenities.map(amenity => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-3 rounded-xl shadow-card"
                    style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'rgb(20, 184, 166)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Description</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>{property.description}</p>
          </div>

          {/* Location */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Location</h3>
            <div
              className="w-full h-40 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <MapPin className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>{property.location}</p>
          </div>

          {/* House Rules */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>House Rules</h3>
            <div className="space-y-2">
              {property.houseRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: 'rgb(20, 184, 166)' }}
                  />
                  <p style={{ color: 'var(--muted-foreground)' }}>{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Reviews</h3>
              <button className="flex items-center gap-1 text-sm transition-all duration-300 hover:opacity-70" style={{ color: 'rgb(20, 184, 166)' }}>
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Review 1 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>John D.</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>2 days ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                  ))}
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Excellent service! Very thorough and professional. My home has never looked better.
                </p>
                <div className="flex gap-2">
                  <img src={rentalListImg2} alt="Review photo" className="w-16 h-16 rounded-lg object-cover" />
                  <img src={rentalListImg3} alt="Review photo" className="w-16 h-16 rounded-lg object-cover" />
                  <img src={rentalListImg4} alt="Review photo" className="w-16 h-16 rounded-lg object-cover" />
                </div>
              </div>

              {/* Review 2 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Sarah M.</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>1 week ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                  ))}
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Highly recommend! The team was punctual and did an amazing job.
                </p>
                <div className="flex gap-2">
                  <img src={rentalListImg1} alt="Review photo" className="w-16 h-16 rounded-lg object-cover" />
                  <img src={rentalListImg3} alt="Review photo" className="w-16 h-16 rounded-lg object-cover" />
                </div>
              </div>

              {/* Review 3 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Michael R.</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>2 weeks ago</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                  ))}
                  <Star className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
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
      <div className="px-6 py-4 glass relative z-20" style={{ borderTop: '1px solid rgba(46, 122, 217, 0.1)' }}>
        <button
          onClick={onCheckAvailability}
          className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
        >
          Check Availability
        </button>
      </div>
    </div>
  );
}
