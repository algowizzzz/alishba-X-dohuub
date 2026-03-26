/**
 * Realistic placeholder images for each service category.
 * Uses picsum.photos (served via Unsplash) — allows hotlinking from any origin
 * including localhost, so images load in both dev and production.
 * Seeded URLs are deterministic (same seed = same image every time).
 * When vendors go live they upload their own images — these are fallbacks.
 */

const PICSUM = 'https://picsum.photos/seed';
const SIZE = '800/500';

export const SERVICE_IMAGES = {
  cleaning: [
    `${PICSUM}/clean-home/${SIZE}`,
    `${PICSUM}/clean-mop/${SIZE}`,
    `${PICSUM}/clean-sparkle/${SIZE}`,
    `${PICSUM}/clean-bucket/${SIZE}`,
  ],
  handyman: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&fit=crop',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=500&fit=crop',
  ],
  beautyProducts: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=500&fit=crop',
  ],
  groceries: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&h=500&fit=crop',
  ],
  food: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop',
  ],
  rentals: [
    `${PICSUM}/rental-apt/${SIZE}`,
    `${PICSUM}/house-front/${SIZE}`,
    `${PICSUM}/modern-room/${SIZE}`,
    `${PICSUM}/cozy-home/${SIZE}`,
  ],
  rides: [
    `${PICSUM}/city-car1/${SIZE}`,
    `${PICSUM}/taxi-ride/${SIZE}`,
    `${PICSUM}/night-drive/${SIZE}`,
    `${PICSUM}/car-road/${SIZE}`,
  ],
  companionship: [
    `${PICSUM}/friends-01/${SIZE}`,
    `${PICSUM}/companion-2/${SIZE}`,
    `${PICSUM}/care-giver/${SIZE}`,
    `${PICSUM}/help-elder/${SIZE}`,
  ],
};

/** Returns all fallback images for a category (for carousels) */
export function getServiceImages(
  category: keyof typeof SERVICE_IMAGES,
  dbImages?: string[] | null
): string[] {
  if (dbImages && dbImages.length > 0) return dbImages;
  return SERVICE_IMAGES[category];
}

/** Pick a single placeholder image for a card, cycling through the array by index */
export function getServiceImage(
  category: keyof typeof SERVICE_IMAGES,
  index: number,
  dbImageUrl?: string | null
): string {
  if (dbImageUrl) return dbImageUrl;
  const pool = SERVICE_IMAGES[category];
  return pool[index % pool.length];
}

/** For detail/hero screens — use first DB image or first placeholder */
export function getHeroImage(
  category: keyof typeof SERVICE_IMAGES,
  dbImages?: string[] | null,
  dbImage?: string | null
): string {
  if (dbImages && dbImages.length > 0) return dbImages[0];
  if (dbImage) return dbImage;
  return SERVICE_IMAGES[category][0];
}
