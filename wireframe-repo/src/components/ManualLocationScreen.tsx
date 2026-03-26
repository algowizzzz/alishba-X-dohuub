import { ArrowLeft, Search, MapPin } from 'lucide-react';
import { useState } from 'react';

interface ManualLocationScreenProps {
  onConfirm: (location: string) => void;
}

const locations = [
  { city: 'New York', country: 'USA', distance: null },
  { city: 'Los Angeles', country: 'USA', distance: null },
  { city: 'London', country: 'UK', distance: null },
  { city: 'Toronto', country: 'Canada', distance: null },
  { city: 'Sydney', country: 'Australia', distance: null },
  { city: 'Tokyo', country: 'Japan', distance: null },
  { city: 'Paris', country: 'France', distance: null },
  { city: 'Dubai', country: 'UAE', distance: null },
];

export function ManualLocationScreen({ onConfirm }: ManualLocationScreenProps) {
  const [selected, setSelected] = useState('');

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          <h3 className="text-gray-900">Select Location</h3>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search city or region"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mb-4">
          <p className="text-gray-500 mb-3">Popular Cities</p>
          <div className="space-y-2">
            {locations.map((loc) => (
              <button
                key={`${loc.city}-${loc.country}`}
                onClick={() => setSelected(`${loc.city}, ${loc.country}`)}
                className={`w-full p-4 rounded-lg border-2 text-left flex items-center gap-3 ${
                  selected === `${loc.city}, ${loc.country}` 
                    ? 'border-gray-800 bg-gray-100' 
                    : 'border-gray-200'
                }`}
              >
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-900">{loc.city}</p>
                  <p className="text-gray-500">{loc.country}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t-2 border-gray-200">
        <button 
          onClick={() => selected && onConfirm(selected)}
          disabled={!selected}
          className={`w-full py-4 rounded-lg border-2 ${
            selected 
              ? 'bg-gray-800 text-white border-gray-800' 
              : 'bg-gray-200 text-gray-400 border-gray-200'
          }`}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}
