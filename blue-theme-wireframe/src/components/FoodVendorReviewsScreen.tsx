import { ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';
import profilePhoto from '../assets/profile photo (2).png';
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
            <h1 className="font-semibold" style={{ color: 'var(--foreground)' }}>Reviews</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{vendor.name}</p>
          </div>
        </div>
      </div>

      {/* Rating Summary */}
      <div
        className="px-6 py-6 glass relative z-10"
        style={{ borderBottom: '1px solid rgba(46, 122, 217, 0.1)' }}
      >
        <div className="flex items-start gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{averageRating}</div>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4"
                  style={{
                    color: star <= Math.floor(averageRating) ? 'rgb(250, 204, 21)' : 'var(--muted)',
                    fill: star <= Math.floor(averageRating) ? 'rgb(250, 204, 21)' : 'transparent'
                  }}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating - 1];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-2 mb-2">
                  <span className="text-sm w-8" style={{ color: 'var(--foreground)' }}>{rating}</span>
                  <Star className="w-4 h-4" style={{ color: 'rgb(250, 204, 21)', fill: 'rgb(250, 204, 21)' }} />
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ background: 'var(--primary-gradient)', width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm w-8" style={{ color: 'var(--muted-foreground)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="p-4 rounded-xl shadow-card"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                              }}
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <img src={profilePhoto} alt={review.userName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium" style={{ color: 'var(--foreground)' }}>{review.userName}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{review.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4"
                      style={{
                        color: star <= review.rating ? 'rgb(250, 204, 21)' : 'var(--muted)',
                        fill: star <= review.rating ? 'rgb(250, 204, 21)' : 'transparent'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.images.map((image, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      <ImageIcon className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
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
