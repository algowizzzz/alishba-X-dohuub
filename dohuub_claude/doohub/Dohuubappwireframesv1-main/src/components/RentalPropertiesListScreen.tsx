import { ArrowLeft, Star, Bed, Bath, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

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
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h1 className="text-gray-900 flex-1">Rental Properties</h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <SlidersHorizontal className="w-6 h-6 text-gray-700" strokeWidth={2} />
            {activeFiltersCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">{activeFiltersCount}</span>
              </div>
            )}
          </button>
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

            <div className="px-6 py-6 space-y-6">
              {/* Property Type */}
              <div>
                <h3 className="text-gray-900 mb-3">Property Type</h3>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedPropertyType(type)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedPropertyType === type
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h3 className="text-gray-900 mb-3">Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {bedroomOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelectedBedrooms(option)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedBedrooms === option
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <h3 className="text-gray-900 mb-3">Bathrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {bathroomOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelectedBathrooms(option)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedBathrooms === option
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-gray-900 mb-3">Price per Night</h3>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => setPriceRange(range)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        priceRange === range
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
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
                  className="w-full py-3 border-2 border-gray-900 text-gray-900 rounded-xl"
                >
                  Clear All Filters
                </button>
              )}

              {/* Apply Button */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-gray-900 text-white rounded-xl"
              >
                Show {sortedProperties.length} Properties
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <p className="text-gray-600 text-sm mb-4">
          {sortedProperties.length} properties available
        </p>
        
        <div className="space-y-4">
          {sortedProperties.map(property => (
            <button
              key={property.id}
              onClick={() => onPropertySelect(property)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-gray-900 transition-colors"
            >
              {/* Property Image */}
              <div className="w-full h-48 bg-gray-300 flex items-center justify-center relative">
                <span className="text-gray-500 text-4xl">🏠</span>
                {property.isPoweredByDoHuub && (
                  <div className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1 rounded-full text-xs">
                    Powered by DoHuub
                  </div>
                )}
              </div>

              {/* Property Info */}
              <div className="p-4 text-left">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1 truncate">{property.name}</h3>
                    <p className="text-gray-600 text-sm">{property.location}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                    <span className="text-gray-900 text-sm">{property.rating}</span>
                    <span className="text-gray-600 text-sm">({property.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-gray-600 text-sm">
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
                  <span className="text-gray-900">${property.pricePerNight}</span>
                  <span className="text-gray-600 text-sm">/ night</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}