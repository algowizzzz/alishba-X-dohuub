import { ArrowLeft, Star, MapPin, Clock, ChevronRight, ShoppingCart, User } from 'lucide-react';
import type { GroceryVendor } from './GroceryVendorsListScreen';

interface GroceryVendorProfileScreenProps {
  vendor: GroceryVendor;
  onBack: () => void;
  onViewStore: () => void;
  onViewAllReviews: () => void;
}

export function GroceryVendorProfileScreen({
  vendor,
  onBack,
  onViewStore,
  onViewAllReviews
}: GroceryVendorProfileScreenProps) {
  // Provide defaults for optional properties
  const reviews = vendor.reviews || 180;
  const vendorCategories = vendor.categories || vendor.storeType?.split(', ') || ['Groceries'];
  const deliveryFee = vendor.deliveryFee || 3.99;
  const address = vendor.address || '456 Market Street';

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
        </button>
        <h1 className="text-gray-900">Store Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Store Header */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-gray-900 mb-2">{vendor.name}</h2>
            {vendor.isPoweredByDoHuub && (
              <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm mb-3">
                Powered by DoHuub
              </div>
            )}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
                <span className="text-gray-900">{vendor.rating}</span>
              </div>
              <span className="text-gray-600">({reviews} reviews)</span>
            </div>
            <p className="text-gray-600">{vendor.deliveryTime} • ${deliveryFee} delivery</p>
          </div>

          {/* About */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-gray-900 mb-3">About</h3>
            <p className="text-gray-600">
              Your trusted neighborhood grocery store offering fresh, quality products at competitive prices. We carefully select each item to ensure you get the best value and freshness for your family.
            </p>
          </div>

          {/* Store Info */}
          <div>
            <h3 className="text-gray-900 mb-3">Store Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-700" />
                <div>
                  <p className="text-gray-900">{address}</p>
                  <p className="text-gray-600 text-sm">Miami, FL 33101</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-xl">
                <Clock className="w-5 h-5 text-gray-700 mt-0.5" />
                <div>
                  <p className="text-gray-900">Delivery Hours</p>
                  <p className="text-gray-600 text-sm">7:00 AM - 11:00 PM Daily</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Reviews & Ratings</h3>
              <button 
                onClick={onViewAllReviews}
                className="flex items-center gap-1 text-gray-900 text-sm"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Rating Summary */}
            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-gray-900 text-4xl mb-1">{vendor.rating}</p>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm w-3">{rating}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: `${rating === 5 ? 78 : rating === 4 ? 18 : 4}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="space-y-3">
              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Karen W.</span>
                      <span className="text-gray-600 text-sm">2 days ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Always fresh produce and great quality meats. My go-to grocery store!
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Tom H.</span>
                      <span className="text-gray-600 text-sm">5 days ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Fast delivery and everything was packaged well. No damaged items.
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">Rachel B.</span>
                      <span className="text-gray-600 text-sm">1 week ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-900 fill-gray-900" />
                      ))}
                      <Star className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Good selection but sometimes items are out of stock. Otherwise great!
                </p>
                {/* Review Images */}
                <div className="flex gap-2">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>
      </div>

    </div>
  );
}