import { ArrowLeft, Star, Gift } from 'lucide-react';
import { Wrench as PhWrench } from '@phosphor-icons/react';
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
          <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>{vendor.name}</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Vendor Profile */}
        <div className="px-6 py-6 glass" style={{ borderBottom: '1px solid rgba(46, 122, 217, 0.1)' }}>
          <div className="flex gap-4 items-start">
            <div
              className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center shadow-premium-md"
              style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))' }}
            >
              <PhWrench size={24} weight="fill" color="#fff" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>{vendor.name}</h2>
                {vendor.isPoweredByDoHuub && (
                  <div
                    className="px-2 py-1 rounded-full text-xs flex items-center gap-1 text-white shadow-premium-sm"
                    style={{ background: 'var(--primary-gradient)' }}
                  >
                    Powered by DoHuub
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{vendor.rating}</span>
                <span style={{ color: 'var(--muted-foreground)' }}>({vendor.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* View Profile Button */}
          {onViewProfile && (
            <button
              onClick={onViewProfile}
              className="w-full mt-4 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-card"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            >
              View Vendor Profile
            </button>
          )}
        </div>

        {/* Services Grid */}
        <div className="px-6 py-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Services Offered</h3>

          <div className="grid grid-cols-2 gap-4">
            {handymanServices.map((service, index) => (
              <button
                key={service.id}
                onClick={() => onServiceSelect(service, vendor)}
                className="p-4 rounded-xl text-left shadow-card transition-all duration-300 hover:shadow-premium-sm hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                                  }}
              >
                {/* Service Image */}
                <div
                  className="w-full aspect-square rounded-lg mb-3 flex items-center justify-center shadow-premium-sm"
                  style={{ background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))' }}
                >
                  <PhWrench size={24} weight="fill" color="#fff" />
                </div>

                {/* Service Name */}
                <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{service.name}</h4>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>{service.rating}</span>
                </div>

                {/* Description */}
                <p className="text-sm line-clamp-1" style={{ color: 'var(--muted-foreground)' }}>{service.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
