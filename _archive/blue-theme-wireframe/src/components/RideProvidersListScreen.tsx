import { ArrowLeft, Star, SlidersHorizontal, X, Gift } from 'lucide-react';
import { Car as PhCar } from '@phosphor-icons/react';
import { IconContainer } from './icons/IconContainer';
import caregivingImg from '../assets/caregiving.png';
import { useState } from 'react';

export interface RideProvider {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  vehicleTypes: string[];
  wheelchairAccessible: boolean;
  isPoweredByDoHuub: boolean;
  description: string;
  coverageArea: string;
  specialFeatures: string[];
}

interface RideProvidersListScreenProps {
  onBack: () => void;
  onSelectProvider: (provider: RideProvider) => void;
}

const mockProviders: RideProvider[] = [
  {
    id: '1',
    name: 'DoHuub Care Transport',
    rating: 4.9,
    reviews: 234,
    hourlyRate: 45,
    vehicleTypes: ['Standard', 'Wheelchair Accessible', 'Pet-Friendly'],
    wheelchairAccessible: true,
    isPoweredByDoHuub: true,
    description: 'Professional medical and daily living transportation services with trained drivers',
    coverageArea: 'All Miami-Dade County',
    specialFeatures: ['Medical equipment transport', 'Door-to-door assistance', 'Medication pickup']
  },
  {
    id: '2',
    name: 'SafeRide Seniors',
    rating: 4.8,
    reviews: 189,
    hourlyRate: 40,
    vehicleTypes: ['Standard', 'Wheelchair Accessible'],
    wheelchairAccessible: true,
    isPoweredByDoHuub: true,
    description: 'Specialized senior transportation with compassionate care',
    coverageArea: 'Miami Beach & Surrounding Areas',
    specialFeatures: ['Senior specialists', 'Memory care trained', 'Mobility assistance']
  },
  {
    id: '3',
    name: 'CareWheels Transportation',
    rating: 4.7,
    reviews: 156,
    hourlyRate: 38,
    vehicleTypes: ['Standard', 'Pet-Friendly'],
    wheelchairAccessible: false,
    isPoweredByDoHuub: false,
    description: 'Reliable transportation for appointments and errands',
    coverageArea: 'South Florida',
    specialFeatures: ['Same-day booking', 'Multiple stops included', 'Pet-friendly options']
  },
  {
    id: '4',
    name: 'Comfort Rides',
    rating: 4.6,
    reviews: 142,
    hourlyRate: 42,
    vehicleTypes: ['Standard', 'Wheelchair Accessible'],
    wheelchairAccessible: true,
    isPoweredByDoHuub: false,
    description: 'Comfortable and safe rides for all your needs',
    coverageArea: 'Greater Miami Area',
    specialFeatures: ['24/7 availability', 'Trained assistants', 'Flexible scheduling']
  }
];

export function RideProvidersListScreen({
  onBack,
  onSelectProvider
}: RideProvidersListScreenProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string[]>([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const filteredProviders = mockProviders.filter(provider => {
    if (selectedVehicleType.length > 0) {
      const hasVehicleType = selectedVehicleType.some(type => provider.vehicleTypes.includes(type));
      if (!hasVehicleType) return false;
    }
    if (selectedAccessibility && !provider.wheelchairAccessible) return false;
    if (provider.hourlyRate < priceRange[0] || provider.hourlyRate > priceRange[1]) return false;
    return true;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (a.isPoweredByDoHuub && !b.isPoweredByDoHuub) return -1;
    if (!a.isPoweredByDoHuub && b.isPoweredByDoHuub) return 1;
    return b.rating - a.rating;
  });

  const toggleVehicleType = (type: string) => {
    setSelectedVehicleType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedVehicleType([]);
    setSelectedAccessibility(false);
    setPriceRange([0, 100]);
  };

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
          <h1 className="font-semibold flex-1" style={{ color: 'var(--foreground)' }}>Ride Providers</h1>
          <button
            onClick={() => setShowFilters(true)}
            className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <SlidersHorizontal className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Providers List */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="p-6 space-y-4">
          {sortedProviders.map((provider, index) => (
            <button
              key={provider.id}
              onClick={() => onSelectProvider(provider)}
              className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                              }}
            >
              <div className="flex items-start gap-4">
                <img src={caregivingImg} alt="Ride Assistance" className="w-12 h-12 object-contain flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{provider.name}</h3>
                    {provider.isPoweredByDoHuub && (
                      <div
                        className="px-2 py-1 rounded-full text-xs whitespace-nowrap text-white shadow-premium-sm flex-shrink-0"
                        style={{ background: 'var(--primary-gradient)' }}
                      >
                        Powered by DoHuub
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" style={{ color: 'rgb(250, 204, 21)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{provider.rating}</span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>({provider.reviews} reviews)</span>
                  </div>
                  <p className="font-semibold mb-2" style={{ color: 'rgb(168, 85, 247)' }}>${provider.hourlyRate}/hour</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {provider.vehicleTypes.map(type => (
                      <span
                        key={type}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: 'rgb(139, 92, 246)' }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  {provider.wheelchairAccessible && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      <span className="text-base">♿</span>
                      <span>Wheelchair Accessible</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="absolute inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowFilters(false)}
          />
          <div
            className="relative w-full rounded-t-3xl max-h-[80vh] overflow-y-auto animate-slide-up glass"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between sticky top-0 glass"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <X className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Vehicle Type */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Vehicle Type</h3>
                <div className="space-y-2">
                  {['Standard', 'Wheelchair Accessible', 'Pet-Friendly'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleVehicleType(type)}
                      className="w-full px-4 py-3 rounded-xl text-left transition-all duration-300"
                      style={{
                        backgroundColor: selectedVehicleType.includes(type)
                          ? 'rgba(168, 85, 247, 0.1)'
                          : 'var(--muted)',
                        border: selectedVehicleType.includes(type)
                          ? '2px solid rgb(168, 85, 247)'
                          : '2px solid var(--border)',
                        color: 'var(--foreground)'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Accessibility</h3>
                <button
                  onClick={() => setSelectedAccessibility(!selectedAccessibility)}
                  className="w-full px-4 py-3 rounded-xl text-left transition-all duration-300"
                  style={{
                    backgroundColor: selectedAccessibility
                      ? 'rgba(168, 85, 247, 0.1)'
                      : 'var(--muted)',
                    border: selectedAccessibility
                      ? '2px solid rgb(168, 85, 247)'
                      : '2px solid var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  Wheelchair Accessible Only
                </button>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Price Range (per hour)</h3>
                <div className="flex items-center gap-4">
                  <span style={{ color: 'var(--muted-foreground)' }}>${priceRange[0]}</span>
                  <div className="flex-1 h-2 rounded-full relative" style={{ backgroundColor: 'var(--muted)' }}>
                    <div
                      className="absolute h-full rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))',
                        left: `${priceRange[0]}%`,
                        right: `${100 - priceRange[1]}%`
                      }}
                    />
                  </div>
                  <span style={{ color: 'var(--muted-foreground)' }}>${priceRange[1]}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
                  style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(139, 92, 246))' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
