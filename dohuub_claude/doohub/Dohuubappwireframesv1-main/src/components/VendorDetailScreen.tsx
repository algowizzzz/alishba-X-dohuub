import { ArrowLeft, Star } from 'lucide-react';
import type { Vendor } from './VendorsListScreen';

interface Service {
  id: string;
  name: string;
  description: string;
  rating: number;
  imageUrl: string;
  price: string;
}

interface VendorDetailScreenProps {
  vendor: Vendor;
  onBack: () => void;
  onServiceSelect: (service: Service, vendor: Vendor) => void;
  onViewProfile?: () => void;
}

const services: Service[] = [
  {
    id: '1',
    name: 'Residential Cleaning',
    description: 'Complete home cleaning service',
    rating: 4.9,
    imageUrl: '',
    price: '$150'
  },
  {
    id: '2',
    name: 'Industrial Cleaning',
    description: 'Heavy-duty industrial facility cleaning',
    rating: 4.8,
    imageUrl: '',
    price: '$500'
  },
  {
    id: '3',
    name: 'Carpet Cleaning',
    description: 'Deep carpet and upholstery cleaning',
    rating: 4.9,
    imageUrl: '',
    price: '$120'
  },
  {
    id: '4',
    name: 'Window Cleaning',
    description: 'Interior and exterior window cleaning',
    rating: 4.7,
    imageUrl: '',
    price: '$100'
  },
  {
    id: '5',
    name: 'Duct Cleaning',
    description: 'Air duct and ventilation system cleaning',
    rating: 4.8,
    imageUrl: '',
    price: '$300'
  },
  {
    id: '6',
    name: 'Office Cleaning',
    description: 'Commercial office space cleaning',
    rating: 4.9,
    imageUrl: '',
    price: '$250'
  }
];

export function VendorDetailScreen({ vendor, onBack, onServiceSelect, onViewProfile }: VendorDetailScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">{vendor.name}</h1>
      </div>

      {/* Vendor Summary */}
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex gap-4 items-center">
          {/* Vendor Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">👤</span>
          </div>

          {/* Vendor Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-gray-900">{vendor.name}</h2>
              {vendor.isPoweredByDoHuub && (
                <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded">
                  Powered by DoHuub
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                <span className="text-gray-700">{vendor.rating}</span>
              </div>
              <span className="text-gray-500">({vendor.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        
        {/* View Profile Button */}
        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="w-full mt-4 py-2 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
          >
            View Vendor Profile
          </button>
        )}
      </div>

      {/* Services Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <h3 className="text-gray-900 mb-4">Services Offered</h3>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onServiceSelect(service, vendor)}
              className="border-2 border-gray-300 rounded-xl overflow-hidden text-left hover:border-gray-400 transition-colors"
            >
              {/* Service Image */}
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-3xl">🧹</span>
              </div>

              {/* Service Info */}
              <div className="p-3">
                <h4 className="text-gray-900 mb-1">{service.name}</h4>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-gray-700 fill-gray-700" />
                  <span className="text-gray-700 text-sm">{service.rating}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-1">{service.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export type { Service };