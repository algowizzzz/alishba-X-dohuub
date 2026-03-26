import { ArrowLeft, Star, Badge, Gift } from 'lucide-react';
import { SprayBottle } from '@phosphor-icons/react';
import { IconContainer } from './icons/IconContainer';
import cleanLogo1 from '../assets/cleaning/logos/cleaning logo  (1).png';
import cleanLogo2 from '../assets/cleaning/logos/cleaning logo  (2).png';
import cleanLogo3 from '../assets/cleaning/logos/cleaning logo  (3).png';

const cleaningLogos = [cleanLogo1, cleanLogo2, cleanLogo3];

interface Vendor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  tagline: string;
  imageUrl: string;
  isPoweredByDoHuub: boolean;
  startingPrice?: number;
}

interface VendorsListScreenProps {
  category: string;
  onBack: () => void;
  onVendorSelect: (vendor: Vendor) => void;
}

const vendors: Vendor[] = [
  {
    id: '1',
    name: "DoHuub Official Store",
    rating: 4.9,
    reviewCount: 342,
    tagline: "Professional cleaning services for homes and offices",
    imageUrl: "",
    isPoweredByDoHuub: true,
    startingPrice: 75
  },
  {
    id: '2',
    name: "Sparkle & Shine",
    rating: 4.8,
    reviewCount: 256,
    tagline: "Eco-friendly cleaning solutions",
    imageUrl: "",
    isPoweredByDoHuub: false,
    startingPrice: 85
  },
  {
    id: '3',
    name: "Clean Pro Services",
    rating: 4.7,
    reviewCount: 189,
    tagline: "Residential and commercial cleaning experts",
    imageUrl: "",
    isPoweredByDoHuub: false,
    startingPrice: 70
  },
  {
    id: '4',
    name: "Perfect Touch Cleaners",
    rating: 4.6,
    reviewCount: 145,
    tagline: "Deep cleaning specialists",
    imageUrl: "",
    isPoweredByDoHuub: false,
    startingPrice: 90
  },
  {
    id: '5',
    name: "Elite Cleaning Squad",
    rating: 4.5,
    reviewCount: 98,
    tagline: "Premium cleaning services",
    imageUrl: "",
    isPoweredByDoHuub: false,
    startingPrice: 100
  }
];

export function VendorsListScreen({ category, onBack, onVendorSelect }: VendorsListScreenProps) {
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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Cleaning Services</h1>
        </div>
      </div>

      {/* Vendors List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-4">
          {vendors.map((vendor, index) => (
            <button
              key={vendor.id}
              onClick={() => onVendorSelect(vendor)}
              className="w-full p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderLeft: '3px solid var(--primary)',
                              }}
            >
              <div className="flex gap-4">
                {/* Vendor Image */}
                <img src={cleaningLogos[index % cleaningLogos.length]} alt={vendor.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{vendor.name}</h3>
                    {vendor.isPoweredByDoHuub && (
                      <span
                        className="px-2 py-1 text-white text-xs rounded-full flex items-center gap-1 shadow-premium-sm flex-shrink-0"
                        style={{ background: 'var(--primary-gradient)' }}
                      >
                        Powered by DoHuub
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.rating}</span>
                    </div>
                    <span style={{ color: 'var(--muted-foreground)' }}>({vendor.reviewCount})</span>
                  </div>

                  <p className="line-clamp-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>{vendor.tagline}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export type { Vendor };
