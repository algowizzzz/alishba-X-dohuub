import { ArrowLeft, Star, ShoppingCart, Gift } from 'lucide-react';
import { FlowerLotus } from '@phosphor-icons/react';
import { IconContainer } from './icons/IconContainer';
import beautyImg from '../assets/beauty products and services.png';

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
          <div className="flex-1">
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Beauty Products</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Select a store</p>
          </div>
          {cartItemCount > 0 && onViewCart && (
            <button
              onClick={onViewCart}
              className="relative p-2 rounded-xl transition-all duration-300 hover:shadow-card"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <ShoppingCart className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white shadow-premium-sm"
                style={{ background: 'var(--primary-gradient)' }}
              >
                {cartItemCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Vendors List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-4">
          {vendors.map((vendor, index) => (
            <div
              key={vendor.id}
              className="w-full rounded-xl p-4 shadow-card transition-all duration-300 hover:shadow-premium-sm"
              style={{
                backgroundColor: 'var(--card)',
                              }}
            >
              <div className="flex items-start gap-4 mb-3">
                {/* Vendor Image Placeholder */}
                <img src={beautyImg} alt="Beauty Products" className="w-12 h-12 object-contain flex-shrink-0" />

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.name}</h3>
                    {vendor.isPoweredByDoHuub && (
                      <div
                        className="px-2 py-1 rounded-full text-xs whitespace-nowrap flex items-center gap-1 text-white shadow-premium-sm flex-shrink-0"
                        style={{ background: 'var(--primary-gradient)' }}
                      >
                        Powered by DoHuub
                      </div>
                    )}
                  </div>

                  <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{vendor.category}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.rating}</span>
                    </div>
                    <span style={{ color: 'var(--muted-foreground)' }}>{vendor.deliveryTime}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{vendor.deliveryFee}</span>
                  </div>

                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Min order: {vendor.minOrder}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectVendor(vendor)}
                  className="flex-1 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  Shop Now
                </button>
                {onViewProfile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfile(vendor);
                    }}
                    className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
                    style={{
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)'
                    }}
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
