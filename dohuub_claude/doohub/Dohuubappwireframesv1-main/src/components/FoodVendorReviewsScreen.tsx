import { ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';
import type { FoodVendor } from './FoodVendorsListScreen';

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[]; // Optional review images (up to 5)
}

interface FoodVendorReviewsScreenProps {
  vendor: FoodVendor;
  onBack: () => void;
}

// Function to generate reviews based on vendor
const getVendorReviews = (vendorId: number): Review[] => {
  const baseId = vendorId * 100;
  
  switch (vendorId) {
    case 1: // Pizza Palace
      return [
        { id: baseId + 1, userName: 'Sarah M.', rating: 5, date: 'Nov 28, 2025', comment: 'Best pizza in town! The Margherita is absolutely perfect. Crispy crust and fresh ingredients.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 2, userName: 'Mike T.', rating: 4, date: 'Nov 25, 2025', comment: 'Great Italian food. The carbonara was delicious, but delivery took a bit longer than expected.' },
        { id: baseId + 3, userName: 'Jennifer L.', rating: 5, date: 'Nov 22, 2025', comment: 'The tiramisu is to die for! Always consistent quality.', images: ['img1', 'img2'] },
        { id: baseId + 4, userName: 'David R.', rating: 5, date: 'Nov 20, 2025', comment: 'Authentic Italian taste. The garlic knots are a must-try!' },
        { id: baseId + 5, userName: 'Emma K.', rating: 3, date: 'Nov 18, 2025', comment: 'Good pizza but a bit pricey. Portions could be larger.', images: ['img1'] }
      ];
      
    case 2: // Sushi Express
      return [
        { id: baseId + 1, userName: 'Alex W.', rating: 5, date: 'Nov 29, 2025', comment: 'Freshest sushi I\'ve had! The Dragon Roll is incredible.', images: ['img1', 'img2', 'img3', 'img4'] },
        { id: baseId + 2, userName: 'Lisa P.', rating: 5, date: 'Nov 26, 2025', comment: 'Love their sashimi platter. Always fresh and beautifully presented.', images: ['img1', 'img2', 'img3', 'img4', 'img5'] },
        { id: baseId + 3, userName: 'Tom H.', rating: 4, date: 'Nov 24, 2025', comment: 'Great Japanese food. Miso soup was perfect. Only issue was missing wasabi.' },
        { id: baseId + 4, userName: 'Rachel S.', rating: 5, date: 'Nov 21, 2025', comment: 'Best teriyaki chicken! Generous portions and quick delivery.', images: ['img1'] },
        { id: baseId + 5, userName: 'Kevin B.', rating: 4, date: 'Nov 19, 2025', comment: 'Very good sushi. The California rolls are consistently great.' }
      ];
      
    case 3: // Taco Fiesta
      return [
        { id: baseId + 1, userName: 'Maria G.', rating: 5, date: 'Nov 30, 2025', comment: 'Authentic Mexican flavors! The carne asada tacos are amazing.', images: ['img1', 'img2'] },
        { id: baseId + 2, userName: 'Carlos R.', rating: 5, date: 'Nov 27, 2025', comment: 'Best tacos in the city! The guacamole is always fresh.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 3, userName: 'Ashley M.', rating: 4, date: 'Nov 23, 2025', comment: 'Love the churros! Great food overall, just wish there was more salsa.' },
        { id: baseId + 4, userName: 'Juan P.', rating: 5, date: 'Nov 20, 2025', comment: 'Reminds me of home. The fajitas are perfectly seasoned.', images: ['img1'] },
        { id: baseId + 5, userName: 'Nicole T.', rating: 4, date: 'Nov 17, 2025', comment: 'Good portions and fair prices. The horchata is delicious!' }
      ];
      
    case 4: // Biryani House
      return [
        { id: baseId + 1, userName: 'Priya S.', rating: 5, date: 'Nov 29, 2025', comment: 'Authentic Hyderabadi biryani! Takes me back to India. Absolutely delicious.', images: ['img1', 'img2', 'img3', 'img4'] },
        { id: baseId + 2, userName: 'Ahmed K.', rating: 5, date: 'Nov 26, 2025', comment: 'Best butter chicken I\'ve ever had. The naan is perfect too!', images: ['img1', 'img2'] },
        { id: baseId + 3, userName: 'Samantha L.', rating: 4, date: 'Nov 24, 2025', comment: 'Love the flavors! Spice level was perfect. Just wish portions were bigger.' },
        { id: baseId + 4, userName: 'Raj M.', rating: 5, date: 'Nov 21, 2025', comment: 'Finally found authentic Indian food! The lamb curry is exceptional.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 5, userName: 'Emily D.', rating: 5, date: 'Nov 18, 2025', comment: 'The mango lassi is amazing! Great food and fast delivery.' }
      ];
      
    case 5: // Burger Paradise
      return [
        { id: baseId + 1, userName: 'Jake M.', rating: 5, date: 'Nov 30, 2025', comment: 'Best burgers in town! The Paradise Signature is incredible. Juicy and flavorful.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 2, userName: 'Olivia R.', rating: 4, date: 'Nov 28, 2025', comment: 'Great burgers and amazing milkshakes. Fries could be crispier though.', images: ['img1'] },
        { id: baseId + 3, userName: 'Chris P.', rating: 5, date: 'Nov 25, 2025', comment: 'The loaded fries are insane! Portions are huge, great value.', images: ['img1', 'img2', 'img3', 'img4', 'img5'] },
        { id: baseId + 4, userName: 'Amanda W.', rating: 5, date: 'Nov 22, 2025', comment: 'Love the crispy chicken sandwich! Always hot and fresh.' },
        { id: baseId + 5, userName: 'Brandon T.', rating: 4, date: 'Nov 19, 2025', comment: 'Solid American food. The BBQ pulled pork is delicious!', images: ['img1', 'img2'] }
      ];
      
    case 6: // Thai Delight
      return [
        { id: baseId + 1, userName: 'Michelle Y.', rating: 5, date: 'Nov 29, 2025', comment: 'Authentic Thai flavors! The green curry is perfect. Not too spicy, not too mild.', images: ['img1', 'img2'] },
        { id: baseId + 2, userName: 'James L.', rating: 5, date: 'Nov 27, 2025', comment: 'Best pad thai I\'ve ever had! The peanut sauce is incredible.', images: ['img1', 'img2', 'img3', 'img4'] },
        { id: baseId + 3, userName: 'Sophia K.', rating: 4, date: 'Nov 24, 2025', comment: 'Love the tom yum soup! Great flavors, just wish portions were larger.' },
        { id: baseId + 4, userName: 'Daniel M.', rating: 5, date: 'Nov 21, 2025', comment: 'The pineapple fried rice served in a pineapple is amazing! Great presentation.', images: ['img1', 'img2', 'img3'] },
        { id: baseId + 5, userName: 'Anna T.', rating: 5, date: 'Nov 18, 2025', comment: 'Mango sticky rice is heaven! Authentic Thai dessert.', images: ['img1'] }
      ];
      
    default:
      return [];
  }
};

export function FoodVendorReviewsScreen({ vendor, onBack }: FoodVendorReviewsScreenProps) {
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
                <div className="flex gap-2 mb-3">
                  {review.images.map((image, index) => (
                    <div key={index} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-500" />
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