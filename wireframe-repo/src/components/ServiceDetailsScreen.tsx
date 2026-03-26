import { ArrowLeft, Heart, Star, MapPin, ChevronRight, Flag } from 'lucide-react';

interface ServiceDetailsScreenProps {
  service: any;
  onBack: () => void;
  onBook: () => void;
  onReviews: () => void;
  onReport: () => void;
}

export function ServiceDetailsScreen({ service, onBack, onBook, onReviews, onReport }: ServiceDetailsScreenProps) {
  if (!service) return null;

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="relative">
        <div className="h-64 bg-gray-200 flex items-center justify-center text-6xl">
          {service.image}
        </div>
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
          <Heart className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 rounded-full text-gray-700">
          1/5
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {service.isPowered && (
          <div className="mb-3 inline-block px-4 py-2 bg-gray-800 text-white rounded-full">
            ✓ Powered by DoHuub
          </div>
        )}

        <h2 className="text-gray-900 mb-3">{service.name}</h2>

        <button onClick={onReviews} className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-gray-700 fill-gray-700" />
            <span className="text-gray-900">{service.rating}</span>
          </div>
          <span className="text-gray-600">({service.reviews} reviews)</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex items-center gap-2 mb-6 text-gray-600">
          <MapPin className="w-5 h-5" />
          <span>{service.distance} away</span>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-900 mb-2">About</h3>
          <p className="text-gray-600">
            Professional cleaning services with experienced staff. We provide deep cleaning, laundry services, and office cleaning solutions. All our cleaners are background-checked and insured.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-900 mb-3">Pricing</h3>
          <div className="space-y-2">
            <div className="flex justify-between p-3 border-2 border-gray-200 rounded-lg">
              <span className="text-gray-700">Deep Cleaning</span>
              <span className="text-gray-900">$89/session</span>
            </div>
            <div className="flex justify-between p-3 border-2 border-gray-200 rounded-lg">
              <span className="text-gray-700">Laundry Service</span>
              <span className="text-gray-900">$45/load</span>
            </div>
            <div className="flex justify-between p-3 border-2 border-gray-200 rounded-lg">
              <span className="text-gray-700">Office Cleaning</span>
              <span className="text-gray-900">$120/session</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Reviews</h3>
            <button onClick={onReviews} className="text-gray-700 underline">See all</button>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <p className="text-gray-900">Sarah M.</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                      <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                      <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                      <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                      <Star className="w-4 h-4 text-gray-700 fill-gray-700" />
                    </div>
                  </div>
                  <span className="text-gray-500">2 days ago</span>
                </div>
                <p className="text-gray-600">Excellent service! Very thorough and professional. Would definitely recommend.</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onReport} className="flex items-center gap-2 text-gray-500 mt-6">
          <Flag className="w-4 h-4" />
          <span>Report Listing</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-gray-600">Starting from</p>
          <p className="text-gray-900">{service.price}</p>
        </div>
        <button onClick={onBook} className="px-8 py-4 bg-gray-800 text-white rounded-lg border-2 border-gray-800">
          Book Now
        </button>
      </div>
    </div>
  );
}