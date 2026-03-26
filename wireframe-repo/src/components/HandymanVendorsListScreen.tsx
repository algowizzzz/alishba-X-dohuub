import { ArrowLeft, Star, MapPin, Search, Gift } from 'lucide-react';

export interface HandymanVendor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  isPoweredByDoHuub?: boolean;
  bio: string;
  startingPrice?: number;
}

interface HandymanVendorsListScreenProps {
  category: string;
  onBack: () => void;
  onVendorSelect: (vendor: HandymanVendor) => void;
}

const handymanVendors: HandymanVendor[] = [
  {
    id: '1',
    name: 'DoHuub Official',
    rating: 4.9,
    reviewCount: 1247,
    isPoweredByDoHuub: true,
    bio: 'Trusted, verified handyman services across all categories.',
    startingPrice: 65,
  },
  {
    id: '2',
    name: 'The Handyman Hub',
    rating: 4.9,
    reviewCount: 401,
    isPoweredByDoHuub: false,
    bio: 'One-stop solution for all home repair needs with 15+ years experience.',
    startingPrice: 70,
  },
  {
    id: '3',
    name: 'Home Repair Masters',
    rating: 4.8,
    reviewCount: 256,
    isPoweredByDoHuub: false,
    bio: 'Specializes in general repairs, painting, and furniture assembly.',
    startingPrice: 55,
  },
  {
    id: '4',
    name: 'Quick Fix Services',
    rating: 4.7,
    reviewCount: 189,
    isPoweredByDoHuub: false,
    bio: 'Fast and efficient solutions for appliance repairs and installations.',
    startingPrice: 60,
  }
];

export function HandymanVendorsListScreen({ category, onBack, onVendorSelect }: HandymanVendorsListScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
          </button>
          <h1 className="text-gray-900">Handyman Services</h1>
        </div>
      </div>

      {/* Vendors List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {handymanVendors.map((vendor) => (
            <button
              key={vendor.id}
              onClick={() => onVendorSelect(vendor)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gray-800 text-left"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-xl">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-gray-900">{vendor.name}</h3>
                    {vendor.isPoweredByDoHuub && (
                      <>
                        <span className="px-2 py-1 bg-gray-900 text-white text-xs rounded">
                          Powered by DoHuub
                        </span>
                        <span className="inline-flex items-center justify-center min-w-[52px] h-6 px-2 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                          <Gift className="w-3 h-3 mr-1" />
                          {vendor.startingPrice || 50}+
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{vendor.bio}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                    <span className="text-gray-900">{vendor.rating}</span>
                    <span className="text-gray-600">({vendor.reviewCount})</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}