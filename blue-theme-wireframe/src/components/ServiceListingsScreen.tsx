import { ArrowLeft, SlidersHorizontal, Star, MapPin, ChevronRight, Gift } from 'lucide-react';
import { House as PhHouse, Sparkle, Broom } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

interface ServiceListingsScreenProps {
  category: string;
  location: string;
  onBack: () => void;
  onServiceSelect: (service: any) => void;
}

const mockServices: Array<{
  id: number;
  name: string;
  isPowered: boolean;
  rating: number;
  reviews: number;
  distance: string;
  price: string;
  image: ReactNode;
}> = [
  {
    id: 1,
    name: 'DoHuub Premium Cleaning',
    isPowered: true,
    rating: 4.9,
    reviews: 456,
    distance: '1.2 km',
    price: 'From $89',
    image: <PhHouse size={28} weight="duotone" style={{ color: 'var(--primary)' }} />,
  },
  {
    id: 2,
    name: 'Sparkle & Shine Services',
    isPowered: false,
    rating: 4.7,
    reviews: 234,
    distance: '2.3 km',
    price: 'From $75',
    image: <Sparkle size={28} weight="duotone" style={{ color: 'var(--primary)' }} />,
  },
  {
    id: 3,
    name: 'Fresh Start Cleaning Co.',
    isPowered: false,
    rating: 4.8,
    reviews: 189,
    distance: '3.1 km',
    price: 'From $79',
    image: <Broom size={28} weight="duotone" style={{ color: 'var(--primary)' }} />,
  },
  {
    id: 4,
    name: 'Elite Home Care',
    isPowered: false,
    rating: 4.6,
    reviews: 167,
    distance: '4.5 km',
    price: 'From $85',
    image: <PhHouse size={28} weight="duotone" style={{ color: 'var(--primary)' }} />,
  },
];

export function ServiceListingsScreen({ category, location, onBack, onServiceSelect }: ServiceListingsScreenProps) {
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
            </button>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{category}</h3>
          </div>
          <button
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <SlidersHorizontal className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
        </div>

        {/* Sort Dropdown */}
        <select
          className="w-full px-4 py-3 rounded-xl outline-none shadow-card transition-all duration-300 focus:shadow-premium-sm"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)'
          }}
        >
          <option>Recommended</option>
          <option>Highest Rated</option>
          <option>Lowest Price</option>
          <option>Nearest</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
        <div className="space-y-4">
          {mockServices.map((service, index) => (
            <button
              key={service.id}
              onClick={() => onServiceSelect(service)}
              className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: 'var(--card)',
                border: service.isPowered ? '2px solid var(--primary)' : '1px solid var(--border)',
                              }}
            >
              {/* Powered by DoHuub Badge */}
              {service.isPowered && (
                <div className="mb-3">
                  <div
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm text-white shadow-premium-sm"
                    style={{ background: 'var(--primary-gradient)' }}
                  >
                    <Gift className="w-3 h-3" />
                    Powered by DoHuub
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {/* Image */}
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-card"
                  style={{ background: 'linear-gradient(135deg, rgba(46, 122, 217, 0.1), rgba(76, 166, 250, 0.1))' }}
                >
                  {service.image}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{service.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{service.rating}</span>
                    </div>
                    <span style={{ color: 'var(--muted-foreground)' }}>({service.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                      <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      <span>{service.distance}</span>
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--primary)' }}>{service.price}</span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 flex-shrink-0 self-center" style={{ color: 'var(--muted-foreground)' }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
