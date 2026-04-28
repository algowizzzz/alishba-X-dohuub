import { ArrowLeft, SlidersHorizontal, Star, MapPin, ChevronRight } from 'lucide-react';

interface ServiceListingsScreenProps {
  category: string;
  location: string;
  onBack: () => void;
  onServiceSelect: (service: any) => void;
}

const mockServices = [
  {
    id: 1,
    name: 'DoHuub Premium Cleaning',
    isPowered: true,
    rating: 4.9,
    reviews: 456,
    distance: '1.2 km',
    price: 'From $89',
    image: '🏠',
  },
  {
    id: 2,
    name: 'Sparkle & Shine Services',
    isPowered: false,
    rating: 4.7,
    reviews: 234,
    distance: '2.3 km',
    price: 'From $75',
    image: '✨',
  },
  {
    id: 3,
    name: 'Fresh Start Cleaning Co.',
    isPowered: false,
    rating: 4.8,
    reviews: 189,
    distance: '3.1 km',
    price: 'From $79',
    image: '🧹',
  },
  {
    id: 4,
    name: 'Elite Home Care',
    isPowered: false,
    rating: 4.6,
    reviews: 167,
    distance: '4.5 km',
    price: 'From $85',
    image: '🏡',
  },
];

export function ServiceListingsScreen({ category, location, onBack, onServiceSelect }: ServiceListingsScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
            </button>
            <h3 className="text-gray-900">{category}</h3>
          </div>
          <button>
            <SlidersHorizontal className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
        </div>

        <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700">
          <option>Recommended</option>
          <option>Highest Rated</option>
          <option>Lowest Price</option>
          <option>Nearest</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {mockServices.map((service) => (
            <button
              key={service.id}
              onClick={() => onServiceSelect(service)}
              className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-800 text-left"
            >
              {service.isPowered && (
                <div className="mb-2 inline-block px-3 py-1 bg-gray-800 text-white rounded-full">
                  Powered by DoHuub
                </div>
              )}
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-3xl flex-shrink-0">
                  {service.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 mb-1">{service.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                      <span className="text-gray-700">{service.rating}</span>
                    </div>
                    <span className="text-gray-500">({service.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{service.distance}</span>
                    </div>
                    <span className="text-gray-900">{service.price}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
