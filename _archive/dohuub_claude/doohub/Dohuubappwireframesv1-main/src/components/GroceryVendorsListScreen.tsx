import { ArrowLeft, Star, Clock, BadgeCheck, Image as ImageIcon } from 'lucide-react';

export interface GroceryVendor {
  id: number;
  name: string;
  storeType: string;
  rating: number;
  deliveryTime: string;
  isPoweredByDoHuub?: boolean;
  reviews?: number;
  categories?: string[];
  deliveryFee?: number;
  address?: string;
}

interface GroceryVendorsListScreenProps {
  onBack: () => void;
  onVendorSelect: (vendor: GroceryVendor) => void;
  onViewProfile?: (vendor: GroceryVendor) => void;
}

export function GroceryVendorsListScreen({
  onBack,
  onVendorSelect,
  onViewProfile
}: GroceryVendorsListScreenProps) {
  const vendors: GroceryVendor[] = [
    {
      id: 1,
      name: 'DoHuub Supermarket',
      storeType: 'Supermarket, Groceries',
      rating: 4.9,
      deliveryTime: '30-40 min',
      isPoweredByDoHuub: true
    },
    {
      id: 2,
      name: 'Fresh Market',
      storeType: 'Organic, Fresh Produce',
      rating: 4.7,
      deliveryTime: '35-45 min'
    },
    {
      id: 3,
      name: 'Quick Stop Grocers',
      storeType: 'Convenience Store',
      rating: 4.6,
      deliveryTime: '20-30 min'
    },
    {
      id: 4,
      name: 'Organic Valley',
      storeType: 'Organic, Health Foods',
      rating: 4.8,
      deliveryTime: '40-50 min'
    },
    {
      id: 5,
      name: 'City Supermart',
      storeType: 'Supermarket, Household',
      rating: 4.5,
      deliveryTime: '30-40 min'
    },
    {
      id: 6,
      name: 'Green Grocers',
      storeType: 'Fruits & Vegetables',
      rating: 4.7,
      deliveryTime: '25-35 min'
    }
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-gray-900">Grocery Delivery</h1>
            <p className="text-gray-600">Shop from top stores</p>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="w-full bg-white rounded-xl border-2 border-gray-200 p-4"
            >
              <div className="flex gap-4 mb-3">
                {/* Vendor Image */}
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900 truncate">{vendor.name}</h3>
                    {vendor.isPoweredByDoHuub && (
                      <div className="flex items-center gap-1 bg-gray-900 text-white px-2 py-1 rounded-full flex-shrink-0">
                        <BadgeCheck className="w-3 h-3" />
                        <span className="text-xs">DoHuub</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 truncate">{vendor.storeType}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                      <span className="text-gray-700">{vendor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{vendor.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onVendorSelect(vendor)}
                  className="flex-1 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Shop Now
                </button>
                {onViewProfile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfile(vendor);
                    }}
                    className="flex-1 py-2 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    View Profile
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}