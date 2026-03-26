import { ArrowLeft, Star, MapPin, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import type { HandymanVendor } from './HandymanVendorsListScreen';

export interface HandymanService {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  rating: number;
}

interface HandymanVendorDetailScreenProps {
  vendor: HandymanVendor;
  onBack: () => void;
  onServiceSelect: (service: HandymanService, vendor: HandymanVendor) => void;
  onViewProfile?: () => void;
}

const handymanServices: HandymanService[] = [
  {
    id: '1',
    name: 'Plumbing Repair',
    description: 'Fix leaks, unclog drains, and repair pipes',
    price: '$85/hour',
    duration: '1-2 hours',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Electrical Work',
    description: 'Install fixtures, repair outlets, and wiring',
    price: '$95/hour',
    duration: '1-3 hours',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Furniture Assembly',
    description: 'Assemble furniture, shelves, and more',
    price: '$65',
    duration: '1-2 hours',
    rating: 4.9
  },
  {
    id: '4',
    name: 'Painting Services',
    description: 'Interior and exterior painting',
    price: '$80/hour',
    duration: '2-4 hours',
    rating: 4.7
  },
  {
    id: '5',
    name: 'TV Mounting',
    description: 'Professional TV mounting and cable management',
    price: '$75',
    duration: '1 hour',
    rating: 4.8
  },
  {
    id: '6',
    name: 'Minor Repairs',
    description: 'General home repairs and maintenance',
    price: '$70/hour',
    duration: '1-2 hours',
    rating: 4.7
  }
];

export function HandymanVendorDetailScreen({ vendor, onBack, onServiceSelect, onViewProfile }: HandymanVendorDetailScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">{vendor.name}</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Vendor Profile */}
        <div className="px-6 py-6 border-b-2 border-gray-200">
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-gray-900">{vendor.name}</h2>
                {vendor.isPoweredByDoHuub && (
                  <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded">
                    Powered by DoHuub
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                <span className="text-gray-900">{vendor.rating}</span>
                <span className="text-gray-600">({vendor.reviewCount} reviews)</span>
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
        <div className="px-6 py-6">
          <h3 className="text-gray-900 mb-4">Services Offered</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {handymanServices.map((service) => (
              <button
                key={service.id}
                onClick={() => onServiceSelect(service, vendor)}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-800 text-left"
              >
                {/* Service Image */}
                <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-400 text-5xl">🔧</span>
                </div>
                
                {/* Service Name */}
                <h4 className="text-gray-900 mb-1">{service.name}</h4>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-gray-700 fill-gray-700" />
                  <span className="text-gray-700 text-sm">{service.rating}</span>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-1">{service.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}