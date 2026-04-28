import { ArrowLeft, Search, MapPin, Navigation } from 'lucide-react';

interface LocationChangeScreenProps {
  currentLocation: string;
  onBack: () => void;
  onSelect: (location: string) => void;
}

const locations = [
  { city: 'New York', country: 'USA', distance: 'Current' },
  { city: 'Los Angeles', country: 'USA', distance: '2,789 km' },
  { city: 'Miami', country: 'USA', distance: '1,759 km' },
  { city: 'London', country: 'UK', distance: '5,585 km' },
  { city: 'Toronto', country: 'Canada', distance: '550 km' },
  { city: 'Sydney', country: 'Australia', distance: '16,014 km' },
];

export function LocationChangeScreen({ currentLocation, onBack, onSelect }: LocationChangeScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
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
        <button className="w-full p-4 rounded-lg border-2 border-gray-800 bg-gray-100 flex items-center gap-3 mb-4">
          <Navigation className="w-5 h-5 text-gray-700" />
          <p className="text-gray-900">Use Current Location</p>
        </button>

        <p className="text-gray-600 mb-3">Recent Locations</p>
        <div className="space-y-2">
          {locations.map((loc) => (
            <button
              key={`${loc.city}-${loc.country}`}
              onClick={() => onSelect(`${loc.city}, ${loc.country}`)}
              className="w-full p-4 rounded-lg border-2 border-gray-200 text-left flex items-center gap-3 hover:border-gray-400"
            >
              <MapPin className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-gray-900">{loc.city}</p>
                <p className="text-gray-500">{loc.country}</p>
              </div>
              <p className="text-gray-500">{loc.distance}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
