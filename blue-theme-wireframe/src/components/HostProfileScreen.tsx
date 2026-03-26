import { ArrowLeft, Star, ChevronRight, User } from 'lucide-react';
import { UserCircle } from '@phosphor-icons/react';
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
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10 sticky top-0"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Host Profile</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-6 py-6 space-y-6">
          {/* Host Header */}
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center shadow-premium-md"
              style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))' }}
            >
              <UserCircle size={48} weight="duotone" className="text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>{hostName}</h2>
            {property.isPoweredByDoHuub && (
              <div
                className="inline-block px-3 py-1 rounded-full text-sm text-white mb-3 shadow-premium-sm"
                style={{ background: 'var(--primary-gradient)' }}
              >
                Powered by DoHuub
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
              <span className="font-medium" style={{ color: 'var(--foreground)' }}>{averageRating}</span>
            </div>
          </div>

          {/* About */}
          <div
            className="p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>About</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>
              {property.isPoweredByDoHuub
                ? 'DoHuub Properties is a professional property management company dedicated to providing exceptional rental experiences. We manage a diverse portfolio of properties and pride ourselves on hospitality, cleanliness, and guest satisfaction.'
                : 'Experienced host with a passion for hospitality. I love welcoming guests to Miami and ensuring they have a comfortable and memorable stay. With years of hosting experience, I understand what makes a great vacation rental.'
              }
            </p>
          </div>

          {/* Host Stats */}
          <div
            className="flex items-center justify-center gap-8 p-4 rounded-xl shadow-card"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>2019</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Host since</p>
            </div>
            <div className="w-px h-12" style={{ backgroundColor: 'var(--border)' }} />
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>3</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Rental properties</p>
            </div>
          </div>

          {/* Properties Hosted */}
          <div className="">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Properties Hosted</h3>
            <div className="space-y-3">
              {hostedProperties.map((prop, index) => (
                <button
                  key={prop.id}
                  onClick={() => onSelectProperty(property)}
                  className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{prop.name}</h4>
                      <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{prop.location}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{prop.rating}</span>
                        </div>
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{prop.bedrooms} bed · {prop.bathrooms} bath</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold" style={{ color: 'var(--primary)' }}>${prop.pricePerNight}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>per night</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reviews & Ratings */}
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Reviews & Ratings</h3>
              <button
                onClick={onViewAllReviews}
                className="flex items-center gap-1 text-sm transition-all duration-300 hover:opacity-70"
                style={{ color: 'var(--primary)' }}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Rating Summary */}
            <div
              className="p-4 rounded-xl mb-4 shadow-card"
              style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{averageRating}</p>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{totalReviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-3" style={{ color: 'var(--muted-foreground)' }}>{rating}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%`,
                            background: 'var(--primary-gradient)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="space-y-3">
              {/* Review 1 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-card"
                    style={{ background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))' }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>Michael T.</span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>1 week ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Excellent host! Very responsive and helpful throughout our stay. The property was exactly as described and in great condition. Highly recommend!
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Photo</span>
                  </div>
                  <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Photo</span>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-card"
                    style={{ background: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))' }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>Emma R.</span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>2 weeks ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Great communication and a wonderful property. Everything was clean and well-maintained. Would definitely book again!
                </p>
              </div>

              {/* Review 3 */}
              <div
                className="p-4 rounded-xl shadow-card"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-card"
                    style={{ background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))' }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>James L.</span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>3 weeks ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                      ))}
                      <Star className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Nice place and good host. Check-in was smooth. Only minor issue was the WiFi speed, but overall a good experience.
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Photo</span>
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
