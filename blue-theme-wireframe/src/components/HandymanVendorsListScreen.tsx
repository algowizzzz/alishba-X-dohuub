import { ArrowLeft, Star, Gift } from 'lucide-react';
import { Wrench } from '@phosphor-icons/react';
import { IconContainer } from './icons/IconContainer';
import handymanImg from '../assets/handyman.png';

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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Handyman Services</h1>
        </div>
      </div>

      {/* Vendors List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 relative z-10">
        <div className="space-y-4">
          {handymanVendors.map((vendor, index) => (
            <button
              key={vendor.id}
              onClick={() => onVendorSelect(vendor)}
              className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                              }}
            >
              <div className="flex gap-4">
                <img src={handymanImg} alt="Handyman" className="w-10 h-10 object-contain flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.name}</h3>
                    {vendor.isPoweredByDoHuub && (
                      <div
                        className="px-2 py-1 rounded-full text-xs flex items-center gap-1 text-white shadow-premium-sm"
                        style={{ background: 'var(--primary-gradient)' }}
                      >
                        Powered by DoHuub
                      </div>
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{vendor.bio}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.rating}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>({vendor.reviewCount})</span>
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
