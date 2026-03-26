import { ArrowLeft, Star, Clock, Image as ImageIcon, Gift } from 'lucide-react';
import { ForkKnife } from '@phosphor-icons/react';
import { IconContainer } from './icons/IconContainer';
import foodImg from '../assets/food.png';

export interface FoodVendor {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  isPoweredByDoHuub?: boolean;
  reviews?: number;
  cuisineTypes?: string[];
  deliveryFee?: number;
  address?: string;
  minOrderAmount?: number;
}

interface FoodVendorsListScreenProps {
  onBack: () => void;
  onVendorSelect: (vendor: FoodVendor) => void;
  onViewProfile?: (vendor: FoodVendor) => void;
}

export function FoodVendorsListScreen({
  onBack,
  onVendorSelect,
  onViewProfile
}: FoodVendorsListScreenProps) {
  const vendors: FoodVendor[] = [
    {
      id: 1,
      name: 'DoHuub Kitchen',
      cuisine: 'Multi-Cuisine',
      rating: 4.9,
      deliveryTime: '20-30 min',
      isPoweredByDoHuub: true,
      minOrderAmount: 25
    },
    {
      id: 2,
      name: 'The Italian Corner',
      cuisine: 'Italian, Pizza',
      rating: 4.7,
      deliveryTime: '25-35 min',
      minOrderAmount: 20
    },
    {
      id: 3,
      name: 'Sushi Masters',
      cuisine: 'Japanese, Sushi',
      rating: 4.8,
      deliveryTime: '30-40 min',
      minOrderAmount: 30
    },
    {
      id: 4,
      name: 'Biryani House',
      cuisine: 'Indian, Biryani',
      rating: 4.6,
      deliveryTime: '35-45 min',
      minOrderAmount: 15
    },
    {
      id: 5,
      name: 'Burger Paradise',
      cuisine: 'American, Burgers',
      rating: 4.5,
      deliveryTime: '20-30 min',
      minOrderAmount: 12
    },
    {
      id: 6,
      name: 'Thai Delight',
      cuisine: 'Thai, Asian',
      rating: 4.7,
      deliveryTime: '30-40 min',
      minOrderAmount: 18
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
          <div>
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Food Delivery</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Choose from top restaurants</p>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-4">
          {vendors.map((vendor, index) => (
            <div
              key={vendor.id}
              className="w-full rounded-xl p-4 shadow-card"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                              }}
            >
              <div className="flex gap-4 mb-3">
                {/* Vendor Image */}
                <img src={foodImg} alt="Food" className="w-16 h-16 object-contain flex-shrink-0" />

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium truncate" style={{ color: 'var(--foreground)' }}>{vendor.name}</h3>
                    {vendor.isPoweredByDoHuub && (
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs shadow-premium-sm flex-shrink-0"
                        style={{ background: 'var(--primary-gradient)' }}
                      >
                        <span>DoHuub</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm mb-2 truncate" style={{ color: 'var(--muted-foreground)' }}>{vendor.cuisine}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                      <span style={{ color: 'var(--foreground)' }}>{vendor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
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
                  className="flex-1 py-2.5 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'var(--primary-gradient)' }}
                >
                  View Menu
                </button>
                {onViewProfile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfile(vendor);
                    }}
                    className="flex-1 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
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
