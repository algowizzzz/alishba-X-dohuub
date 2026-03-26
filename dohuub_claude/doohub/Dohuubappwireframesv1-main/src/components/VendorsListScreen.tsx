import { ArrowLeft, Star, Badge } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  tagline: string;
  imageUrl: string;
  isPoweredByDoHuub: boolean;
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
    isPoweredByDoHuub: true
  },
  {
    id: '2',
    name: "Sparkle & Shine",
    rating: 4.8,
    reviewCount: 256,
    tagline: "Eco-friendly cleaning solutions",
    imageUrl: "",
    isPoweredByDoHuub: false
  },
  {
    id: '3',
    name: "Clean Pro Services",
    rating: 4.7,
    reviewCount: 189,
    tagline: "Residential and commercial cleaning experts",
    imageUrl: "",
    isPoweredByDoHuub: false
  },
  {
    id: '4',
    name: "Perfect Touch Cleaners",
    rating: 4.6,
    reviewCount: 145,
    tagline: "Deep cleaning specialists",
    imageUrl: "",
    isPoweredByDoHuub: false
  },
  {
    id: '5',
    name: "Elite Cleaning Squad",
    rating: 4.5,
    reviewCount: 98,
    tagline: "Premium cleaning services",
    imageUrl: "",
    isPoweredByDoHuub: false
  }
];

export function VendorsListScreen({ category, onBack, onVendorSelect }: VendorsListScreenProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Cleaning Services</h1>
      </div>

      {/* Vendors List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <button
              key={vendor.id}
              onClick={() => onVendorSelect(vendor)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-left hover:border-gray-400 transition-colors"
            >
              <div className="flex gap-4">
                {/* Vendor Image */}
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400">👤</span>
                </div>

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900">{vendor.name}</h3>
                    {vendor.isPoweredByDoHuub && (
                      <span className="flex-shrink-0 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                        Powered by DoHuub
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                      <span className="text-gray-700">{vendor.rating}</span>
                    </div>
                    <span className="text-gray-500">({vendor.reviewCount})</span>
                  </div>

                  <p className="text-gray-600 line-clamp-1">{vendor.tagline}</p>
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