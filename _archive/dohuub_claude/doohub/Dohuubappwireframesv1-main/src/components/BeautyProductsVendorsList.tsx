import { ArrowLeft, Star, Award, ShoppingCart } from 'lucide-react';

interface BeautyProductVendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  minOrder: string;
  isPoweredByDoHuub?: boolean;
}

interface BeautyProductsVendorsListProps {
  onBack: () => void;
  onSelectVendor: (vendor: BeautyProductVendor) => void;
  cartItemCount?: number;
  onViewCart?: () => void;
  onViewProfile?: (vendor: BeautyProductVendor) => void;
}

export function BeautyProductsVendorsList({
  onBack,
  onSelectVendor,
  cartItemCount = 0,
  onViewCart,
  onViewProfile
}: BeautyProductsVendorsListProps) {
  const vendors: BeautyProductVendor[] = [
    {
      id: 1,
      name: 'Beauty on DE Run',
      category: 'Beauty & Cosmetics',
      rating: 4.9,
      deliveryTime: '30-40 min',
      deliveryFee: '$2.99',
      minOrder: '$15.00',
      isPoweredByDoHuub: true
    },
    {
      id: 2,
      name: 'Glam Cosmetics Shop',
      category: 'Makeup & Beauty',
      rating: 4.8,
      deliveryTime: '35-45 min',
      deliveryFee: '$3.49',
      minOrder: '$20.00'
    },
    {
      id: 3,
      name: 'Skincare Paradise',
      category: 'Skincare Products',
      rating: 4.7,
      deliveryTime: '40-50 min',
      deliveryFee: '$2.99',
      minOrder: '$18.00'
    },
    {
      id: 4,
      name: 'Natural Beauty Store',
      category: 'Organic Beauty',
      rating: 4.6,
      deliveryTime: '45-55 min',
      deliveryFee: '$3.99',
      minOrder: '$25.00'
    },
    {
      id: 5,
      name: 'Luxury Fragrances',
      category: 'Perfumes & Scents',
      rating: 4.8,
      deliveryTime: '30-40 min',
      deliveryFee: '$2.99',
      minOrder: '$30.00'
    },
    {
      id: 6,
      name: 'Hair Care Depot',
      category: 'Hair Products',
      rating: 4.5,
      deliveryTime: '35-45 min',
      deliveryFee: '$3.49',
      minOrder: '$15.00'
    }
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900">Beauty Products</h1>
            <p className="text-sm text-gray-600">Select a store</p>
          </div>
          {cartItemCount > 0 && onViewCart && (
            <button
              onClick={onViewCart}
              className="relative p-2 text-gray-900"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white rounded-full text-xs flex items-center justify-center">
                {cartItemCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Vendors List */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-4 mb-3">
                {/* Vendor Image Placeholder */}
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-gray-300">
                  <div className="w-12 h-12 bg-gray-400 rounded-lg"></div>
                </div>

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900">{vendor.name}</h3>
                    {vendor.isPoweredByDoHuub && (
                      <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Powered by DoHuub
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{vendor.category}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                      <span className="text-gray-900">{vendor.rating}</span>
                    </div>
                    <span className="text-gray-600">{vendor.deliveryTime}</span>
                    <span className="text-gray-600">{vendor.deliveryFee}</span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">Min order: {vendor.minOrder}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectVendor(vendor)}
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