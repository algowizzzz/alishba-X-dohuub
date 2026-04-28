import { ArrowLeft, Star, Bed, Bath, SlidersHorizontal, X, Gift } from 'lucide-react';
import { House as PhHouse } from '@phosphor-icons/react';
import { IconContainer } from './icons/IconContainer';
import { useState } from 'react';
import rentalListImg1 from '../assets/rental listing/rental listing (1).png';
import rentalListImg2 from '../assets/rental listing/rental listing (2).png';
import rentalListImg3 from '../assets/rental listing/rental listing (3).png';
import rentalListImg4 from '../assets/rental listing/rental listing (4).png';

const rentalPhotos = [rentalListImg1, rentalListImg2, rentalListImg3, rentalListImg4];

export interface Property {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
  pricePerWeek: number;
  pricePerMonth: number;
  rating: number;
  reviews: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqft: number;
  propertyType: 'Apartment' | 'House' | 'Studio' | 'Villa';
  amenities: string[];
  description: string;
  houseRules: string[];
  cancellationPolicy: string;
  checkInInstructions: string; // Custom instructions from host
  isPoweredByDoHuub: boolean;
  photos: string[];
}

interface RentalPropertiesListScreenProps {
  properties: Property[];
  onBack: () => void;
  onPropertySelect: (property: Property) => void;
}

export function RentalPropertiesListScreen({
  properties,
  onBack,
  onPropertySelect
}: RentalPropertiesListScreenProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('All');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('Any');
  const [selectedBathrooms, setSelectedBathrooms] = useState<string>('Any');
  const [priceRange, setPriceRange] = useState<string>('Any');
  const [sortBy, setSortBy] = useState<string>('recommended');

  const propertyTypes = ['All', 'Apartment', 'House', 'Studio', 'Villa'];
  const bedroomOptions = ['Any', '1', '2', '3', '4+'];
  const bathroomOptions = ['Any', '1', '2', '3+'];
  const priceRanges = ['Any', 'Under $100', '$100-$200', '$200-$300', 'Over $300'];

  const filteredProperties = properties.filter(property => {
    if (selectedPropertyType !== 'All' && property.propertyType !== selectedPropertyType) return false;
    if (selectedBedrooms !== 'Any') {
      const beds = selectedBedrooms === '4+' ? 4 : parseInt(selectedBedrooms);
      if (selectedBedrooms === '4+' && property.bedrooms < 4) return false;
      if (selectedBedrooms !== '4+' && property.bedrooms !== beds) return false;
    }
    if (selectedBathrooms !== 'Any') {
      const baths = selectedBathrooms === '3+' ? 3 : parseInt(selectedBathrooms);
      if (selectedBathrooms === '3+' && property.bathrooms < 3) return false;
      if (selectedBathrooms !== '3+' && property.bathrooms !== baths) return false;
    }
    if (priceRange !== 'Any') {
      const price = property.pricePerNight;
      if (priceRange === 'Under $100' && price >= 100) return false;
      if (priceRange === '$100-$200' && (price < 100 || price > 200)) return false;
      if (priceRange === '$200-$300' && (price < 200 || price > 300)) return false;
      if (priceRange === 'Over $300' && price <= 300) return false;
    }
    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    // Always prioritize "Powered by DoHuub" properties first
    if (a.isPoweredByDoHuub && !b.isPoweredByDoHuub) return -1;
    if (!a.isPoweredByDoHuub && b.isPoweredByDoHuub) return 1;

    // Then apply the selected sort
    if (sortBy === 'price-low') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price-high') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const activeFiltersCount = [
    selectedPropertyType !== 'All',
    selectedBedrooms !== 'Any',
    selectedBathrooms !== 'Any',
    priceRange !== 'Any'
  ].filter(Boolean).length;

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
          <h1 className="font-semibold flex-1" style={{ color: 'var(--foreground)' }}>Rental Properties</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative p-2 rounded-xl transition-all duration-300 hover:shadow-card"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <SlidersHorizontal className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
            {activeFiltersCount > 0 && (
              <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-premium-sm"
                style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
              >
                <span className="text-white text-xs font-medium">{activeFiltersCount}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div
            className="w-full rounded-t-3xl max-h-[80vh] overflow-y-auto animate-slide-up shadow-premium-lg"
            style={{ backgroundColor: 'var(--background)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between sticky top-0 glass"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-xl transition-all duration-300 hover:shadow-card"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <X className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Property Type */}
              <div className="">
                <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Property Type</h3>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedPropertyType(type)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                      style={{
                        background: selectedPropertyType === type
                          ? 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))'
                          : 'var(--muted)',
                        color: selectedPropertyType === type ? 'white' : 'var(--foreground)'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="">
                <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {bedroomOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelectedBedrooms(option)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                      style={{
                        background: selectedBedrooms === option
                          ? 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))'
                          : 'var(--muted)',
                        color: selectedBedrooms === option ? 'white' : 'var(--foreground)'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="">
                <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Bathrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {bathroomOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelectedBathrooms(option)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                      style={{
                        background: selectedBathrooms === option
                          ? 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))'
                          : 'var(--muted)',
                        color: selectedBathrooms === option ? 'white' : 'var(--foreground)'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="">
                <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>Price per Night</h3>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => setPriceRange(range)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                      style={{
                        background: priceRange === range
                          ? 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))'
                          : 'var(--muted)',
                        color: priceRange === range ? 'white' : 'var(--foreground)'
                      }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedPropertyType('All');
                    setSelectedBedrooms('Any');
                    setSelectedBathrooms('Any');
                    setPriceRange('Any');
                  }}
                  className="w-full py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
                  style={{
                    backgroundColor: 'var(--card)',
                    color: 'var(--foreground)',
                    border: '2px solid var(--border)'
                  }}
                >
                  Clear All Filters
                </button>
              )}

              {/* Apply Button */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, rgb(20, 184, 166), rgb(6, 148, 162))' }}
              >
                Show {sortedProperties.length} Properties
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
          {sortedProperties.length} properties available
        </p>

        <div className="space-y-4">
          {sortedProperties.map((property, index) => (
            <button
              key={property.id}
              onClick={() => onPropertySelect(property)}
              className="w-full rounded-2xl overflow-hidden text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                              }}
            >
              {/* Property Image */}
              <div className="relative">
                <img src={rentalPhotos[index % rentalPhotos.length]} alt={property.name} className="w-full h-48 object-cover" />
                {property.isPoweredByDoHuub && (
                  <div className="absolute top-3 right-3">
                    <span
                      className="px-3 py-1.5 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-premium-sm"
                      style={{ background: 'var(--primary-gradient)' }}
                    >
                      Powered by DoHuub
                    </span>
                  </div>
                )}
              </div>

              {/* Property Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 truncate" style={{ color: 'var(--foreground)' }}>{property.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{property.location}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                    <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{property.rating}</span>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>({property.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms} bath</span>
                  </div>
                  <span>• {property.propertyType}</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold" style={{ color: 'rgb(20, 184, 166)' }}>${property.pricePerNight}</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>/ night</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
