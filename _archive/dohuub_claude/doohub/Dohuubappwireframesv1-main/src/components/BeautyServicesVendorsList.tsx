import { ArrowLeft, Star, Award } from 'lucide-react';

interface BeautyServiceProvider {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  services: string[];
  isPoweredByDoHuub?: boolean;
}

interface BeautyServicesVendorsListProps {
  onBack: () => void;
  onSelectProvider: (provider: BeautyServiceProvider) => void;
  onViewProfile?: (provider: BeautyServiceProvider) => void;
}

export function BeautyServicesVendorsList({
  onBack,
  onSelectProvider,
  onViewProfile
}: BeautyServicesVendorsListProps) {
  const providers: BeautyServiceProvider[] = [
    {
      id: 1,
      name: 'Beauty on DE Run',
      rating: 4.9,
      reviews: 1250,
      services: ['Makeup', 'Hairstyling', 'Skincare', 'Nail Art', 'Spa Services'],
      isPoweredByDoHuub: true
    },
    {
      id: 2,
      name: 'Glam Studio',
      rating: 4.8,
      reviews: 892,
      services: ['Bridal Makeup', 'Hair Coloring', 'Extensions', 'Styling']
    },
    {
      id: 3,
      name: 'Beauty Lounge',
      rating: 4.7,
      reviews: 654,
      services: ['Facials', 'Waxing', 'Threading', 'Pedicure', 'Manicure']
    },
    {
      id: 4,
      name: 'Elite Salon & Spa',
      rating: 4.6,
      reviews: 523,
      services: ['Hair Treatments', 'Massage', 'Body Treatments', 'Makeup']
    },
    {
      id: 5,
      name: 'Radiance Beauty Center',
      rating: 4.5,
      reviews: 431,
      services: ['Skin Care', 'Anti-Aging', 'Laser Treatments', 'Botox']
    },
    {
      id: 6,
      name: 'Nail Art Studio',
      rating: 4.7,
      reviews: 389,
      services: ['Nail Extensions', 'Gel Polish', 'Nail Art', 'Pedicure']
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
            <h1 className="text-gray-900">Beauty Services</h1>
            <p className="text-sm text-gray-600">Select a service provider</p>
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-4 mb-3">
                {/* Provider Image Placeholder */}
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-gray-300">
                  <div className="w-12 h-12 bg-gray-400 rounded-lg"></div>
                </div>

                {/* Provider Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-gray-900">{provider.name}</h3>
                    {provider.isPoweredByDoHuub && (
                      <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Powered by DoHuub
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                      <span className="text-sm text-gray-900">{provider.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">({provider.reviews} reviews)</span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-1">
                    {provider.services.join(' • ')}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectProvider(provider)}
                  className="flex-1 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  View Services
                </button>
                {onViewProfile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfile(provider);
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