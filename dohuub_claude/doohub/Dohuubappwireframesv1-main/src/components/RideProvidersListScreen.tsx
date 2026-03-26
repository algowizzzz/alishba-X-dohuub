import { ArrowLeft, Star, SlidersHorizontal, Car, X } from 'lucide-react';
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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900 flex-1">Ride Providers</h1>
        <button onClick={() => setShowFilters(true)}>
          <SlidersHorizontal className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
      </div>

      {/* Providers List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {sortedProviders.map(provider => (
            <button
              key={provider.id}
              onClick={() => onSelectProvider(provider)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-gray-900 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Car className="w-8 h-8 text-gray-600" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900">{provider.name}</h3>
                    {provider.isPoweredByDoHuub && (
                      <div className="bg-gray-900 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">
                        Powered by DoHuub
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                      <span className="text-gray-900 text-sm">{provider.rating}</span>
                    </div>
                    <span className="text-gray-600 text-sm">({provider.reviews} reviews)</span>
                  </div>
                  <p className="text-gray-900 mb-2">${provider.hourlyRate}/hour</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {provider.vehicleTypes.map(type => (
                      <span key={type} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {type}
                      </span>
                    ))}
                  </div>
                  {provider.wheelchairAccessible && (
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
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
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6 text-gray-700" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Vehicle Type */}
              <div>
                <h3 className="text-gray-900 mb-3">Vehicle Type</h3>
                <div className="space-y-2">
                  {['Standard', 'Wheelchair Accessible', 'Pet-Friendly'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleVehicleType(type)}
                      className={`w-full px-4 py-3 rounded-xl border-2 text-left ${
                        selectedVehicleType.includes(type)
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              <div>
                <h3 className="text-gray-900 mb-3">Accessibility</h3>
                <button
                  onClick={() => setSelectedAccessibility(!selectedAccessibility)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-left ${
                    selectedAccessibility
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                >
                  Wheelchair Accessible Only
                </button>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-gray-900 mb-3">Price Range (per hour)</h3>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">${priceRange[0]}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                    <div
                      className="absolute h-full bg-gray-900 rounded-full"
                      style={{
                        left: `${priceRange[0]}%`,
                        right: `${100 - priceRange[1]}%`
                      }}
                    />
                  </div>
                  <span className="text-gray-600">${priceRange[1]}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-900 rounded-xl"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl"
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