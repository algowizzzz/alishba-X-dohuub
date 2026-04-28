import { ArrowLeft, Star, Gift } from 'lucide-react';
import { Scissors as PhScissors } from '@phosphor-icons/react';
import { IconContainer } from './icons/IconContainer';
import beautyImg from '../assets/beauty products and services.png';

interface BeautyServiceProvider {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  services: string[];
  isPoweredByDoHuub?: boolean;
}

interface BeautyServicesVendorsListProps {
  onBack: () => void;
  onSelectProvider: (provider: BeautyServiceProvider) => void;
  onViewProfile?: (provider: BeautyServiceProvider) => void;
}

export function BeautyServicesVendorsList({
  onBack,
  onSelectProvider,
  onViewProfile
}: BeautyServicesVendorsListProps) {
  const providers: BeautyServiceProvider[] = [
    {
      id: 1,
      name: 'Beauty on DE Run',
      rating: 4.9,
      reviews: 1250,
      services: ['Makeup', 'Hairstyling', 'Skincare', 'Nail Art', 'Spa Services'],
      isPoweredByDoHuub: true
    },
    {
      id: 2,
      name: 'Glam Studio',
      rating: 4.8,
      reviews: 892,
      services: ['Bridal Makeup', 'Hair Coloring', 'Extensions', 'Styling']
    },
    {
      id: 3,
      name: 'Beauty Lounge',
      rating: 4.7,
      reviews: 654,
      services: ['Facials', 'Waxing', 'Threading', 'Pedicure', 'Manicure']
    },
    {
      id: 4,
      name: 'Elite Salon & Spa',
      rating: 4.6,
      reviews: 523,
      services: ['Hair Treatments', 'Massage', 'Body Treatments', 'Makeup']
    },
    {
      id: 5,
      name: 'Radiance Beauty Center',
      rating: 4.5,
      reviews: 431,
      services: ['Skin Care', 'Anti-Aging', 'Laser Treatments', 'Botox']
    },
    {
      id: 6,
      name: 'Nail Art Studio',
      rating: 4.7,
      reviews: 389,
      services: ['Nail Extensions', 'Gel Polish', 'Nail Art', 'Pedicure']
    }
  ];

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

      {/* Header */}
      <div
        className="px-6 py-6 relative z-10"
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
          <div className="flex-1">
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Beauty Services</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Select a service provider</p>
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-4">
          {providers.map((provider, index) => (
            <div
              key={provider.id}
              className="w-full rounded-xl p-4 shadow-card transition-all duration-300 hover:shadow-premium-sm"
              style={{
                backgroundColor: 'var(--card)',
                              }}
            >
              <div className="flex items-start gap-4 mb-3">
                {/* Provider Image Placeholder */}
                <img src={beautyImg} alt="Beauty Services" className="w-12 h-12 object-contain flex-shrink-0" />

                {/* Provider Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>{provider.name}</h3>
                    {provider.isPoweredByDoHuub && (
                      <div
                        className="px-2 py-1 rounded-full text-xs whitespace-nowrap flex items-center gap-1 text-white shadow-premium-sm flex-shrink-0"
                        style={{ background: 'var(--primary-gradient)' }}
                      >
                        Powered by DoHuub
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{provider.rating}</span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>({provider.reviews} reviews)</span>
                  </div>

                  <p className="text-sm line-clamp-1" style={{ color: 'var(--muted-foreground)' }}>
                    {provider.services.join(' • ')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectProvider(provider)}
                  className="flex-1 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  View Services
                </button>
                {onViewProfile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfile(provider);
                    }}
                    className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
                    style={{
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    View Profile
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
