import { ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';
import type { GroceryVendor } from './GroceryVendorsListScreen';

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[]; // Optional review images (up to 5)
}

interface GroceryVendorReviewsScreenProps {
  vendor: GroceryVendor;
  onBack: () => void;
}

// Function to generate reviews based on vendor
const getVendorReviews = (vendorId: number): Review[] => {
  const baseId = vendorId * 100;
  
  switch (vendorId) {
    case 1: // FreshMart
      return [
        { id: baseId + 1, userName: 'Patricia M.', rating: 5, date: 'Nov 28, 2025', comment: 'Great selection and always fresh produce! My go-to grocery store.', images: ['img1', 'img2'] },
        { id: baseId + 2, userName: 'Robert L.', rating: 4, date: 'Nov 25, 2025', comment: 'Good prices and quality. Delivery is fast but sometimes items are out of stock.' },
        { id: baseId + 3, userName: 'Linda K.', rating: 5, date: 'Nov 22, 2025', comment: 'Always reliable! Fresh fruits and vegetables every time.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 4, userName: 'Mark T.', rating: 4, date: 'Nov 20, 2025', comment: 'Good variety of products. Would like to see more organic options.' },
        { id: baseId + 5, userName: 'Susan R.', rating: 5, date: 'Nov 18, 2025', comment: 'Best grocery delivery service! Items are always well-packed.', images: ['img1'] }
      ];
      
    case 2: // QuickShop Express
      return [
        { id: baseId + 1, userName: 'Jason P.', rating: 5, date: 'Nov 29, 2025', comment: 'Super fast delivery! Perfect for last-minute needs.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 2, userName: 'Kelly W.', rating: 4, date: 'Nov 26, 2025', comment: 'Convenient for quick shopping. Prices are a bit higher but worth it for speed.' },
        { id: baseId + 3, userName: 'Brian S.', rating: 5, date: 'Nov 24, 2025', comment: 'Love the convenience! Great for snacks and essentials.', images: ['img1'] },
        { id: baseId + 4, userName: 'Diana H.', rating: 4, date: 'Nov 21, 2025', comment: 'Quick and easy. Wish they had more fresh produce options.' },
        { id: baseId + 5, userName: 'Paul M.', rating: 5, date: 'Nov 19, 2025', comment: 'Perfect for busy days! Always delivers quickly.', images: ['img1', 'img2'] }
      ];
      
    case 3: // Healthy Harvest
      return [
        { id: baseId + 1, userName: 'Jennifer C.', rating: 5, date: 'Nov 30, 2025', comment: 'Amazing organic selection! Everything is fresh and high quality.', images: ['img1', 'img2', 'img3', 'img4'] },
        { id: baseId + 2, userName: 'Michael B.', rating: 5, date: 'Nov 27, 2025', comment: 'Best place for organic groceries! Love their kale and avocados.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 3, userName: 'Sarah N.', rating: 4, date: 'Nov 23, 2025', comment: 'Great organic options but prices are on the higher side.' },
        { id: baseId + 4, userName: 'Thomas J.', rating: 5, date: 'Nov 20, 2025', comment: 'Premium quality organic products. Worth every penny!', images: ['img1', 'img2'] },
        { id: baseId + 5, userName: 'Rachel D.', rating: 5, date: 'Nov 17, 2025', comment: 'Love shopping here! Fresh organic produce always.', images: ['img1', 'img2', 'img3', 'img4', 'img5'] }
      ];
      
    case 4: // Organic Valley
      return [
        { id: baseId + 1, userName: 'Elizabeth G.', rating: 5, date: 'Nov 29, 2025', comment: 'Excellent organic and health foods! The almond milk is fantastic.', images: ['img1', 'img2'] },
        { id: baseId + 2, userName: 'Christopher R.', rating: 5, date: 'Nov 26, 2025', comment: 'Great selection of vegan products! Love the plant-based options.', images: ['img1', 'img2', 'img3', 'img4'] },
        { id: baseId + 3, userName: 'Michelle A.', rating: 4, date: 'Nov 24, 2025', comment: 'Good health food store. Wish they had more gluten-free options.' },
        { id: baseId + 4, userName: 'Steven K.', rating: 5, date: 'Nov 21, 2025', comment: 'Best organic butter and eggs! Quality is unmatched.', images: ['img1'] },
        { id: baseId + 5, userName: 'Nicole F.', rating: 5, date: 'Nov 18, 2025', comment: 'Love the chia seeds and hemp hearts! Great prices too.', images: ['img1', 'img2', 'img3'] }
      ];
      
    case 5: // City Supermart
      return [
        { id: baseId + 1, userName: 'William H.', rating: 4, date: 'Nov 30, 2025', comment: 'Great one-stop shop! Good selection of household items and groceries.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 2, userName: 'Margaret S.', rating: 5, date: 'Nov 28, 2025', comment: 'Best prices in the area! Love the bulk options.', images: ['img1'] },
        { id: baseId + 3, userName: 'Richard T.', rating: 4, date: 'Nov 25, 2025', comment: 'Good variety and fair prices. Delivery could be faster.' },
        { id: baseId + 4, userName: 'Barbara L.', rating: 5, date: 'Nov 22, 2025', comment: 'Everything I need in one place! Great household section.', images: ['img1', 'img2'] },
        { id: baseId + 5, userName: 'Joseph M.', rating: 4, date: 'Nov 19, 2025', comment: 'Solid supermarket. Good for weekly grocery shopping.' }
      ];
      
    case 6: // Green Grocers
      return [
        { id: baseId + 1, userName: 'Karen W.', rating: 5, date: 'Nov 29, 2025', comment: 'Best fresh produce! The organic blueberries are amazing.', images: ['img1', 'img2', 'img3', 'img4', 'img5'] },
        { id: baseId + 2, userName: 'Daniel P.', rating: 5, date: 'Nov 27, 2025', comment: 'Premium fruits and vegetables! Everything is always fresh.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 3, userName: 'Amy R.', rating: 5, date: 'Nov 24, 2025', comment: 'Love the farm fresh eggs and handmade mozzarella!', images: ['img1', 'img2'] },
        { id: baseId + 4, userName: 'George K.', rating: 4, date: 'Nov 21, 2025', comment: 'Great produce quality. Wish they had more variety in other categories.' },
        { id: baseId + 5, userName: 'Laura M.', rating: 5, date: 'Nov 18, 2025', comment: 'The asparagus and mixed greens are always perfect!', images: ['img1', 'img2', 'img3', 'img4'] }
      ];
      
    default:
      return [];
  }
};

export function GroceryVendorReviewsScreen({ vendor, onBack }: GroceryVendorReviewsScreenProps) {
  const reviews = getVendorReviews(vendor.id);
  
  const averageRating = vendor.rating;
  const totalReviews = reviews.length;
  
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-gray-900">Reviews</h1>
            <p className="text-gray-600">{vendor.name}</p>
          </div>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="bg-gray-50 border-b-2 border-gray-200 px-6 py-6">
        <div className="flex items-start gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-gray-900 mb-1" style={{ fontSize: '48px', lineHeight: '1' }}>{averageRating}</div>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(averageRating)
                      ? 'text-gray-700 fill-gray-700'
                      : 'text-gray-300 fill-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm">{totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating - 1];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2 mb-2">
                  <span className="text-gray-700 text-sm w-8">{rating}</span>
                  <Star className="w-4 h-4 text-gray-400 fill-gray-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-600 text-sm w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b-2 border-gray-100 pb-6 last:border-b-0">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-700">{review.userName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-gray-900">{review.userName}</p>
                      <p className="text-gray-500 text-sm">{review.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-gray-700 fill-gray-700'
                          : 'text-gray-300 fill-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 mb-3">{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2">
                  {review.images.map((image, index) => (
                    <div key={index} className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
