/**
 * Service category images + helpers.
 * Prefer real listing/vendor URLs from the API; fall back to category placeholders.
 */

const SIZE = 'w=800&h=500&fit=crop';

export const SERVICE_IMAGES = {
  cleaning: [
    `https://images.unsplash.com/photo-1581578731548-c64695cc6952?${SIZE}`,
    `https://images.unsplash.com/photo-1556911220-bff31c812dce?${SIZE}`,
    `https://images.unsplash.com/photo-1584622650111-993a426fbf0a?${SIZE}`,
    `https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?${SIZE}`,
  ],
  handyman: [
    `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?${SIZE}`,
    `https://images.unsplash.com/photo-1504148455328-c376907d081c?${SIZE}`,
    `https://images.unsplash.com/photo-1621905251918-48416bd8575a?${SIZE}`,
    `https://images.unsplash.com/photo-1581092160607-ee22621dd758?${SIZE}`,
  ],
  beauty: [
    `https://images.unsplash.com/photo-1560066984-138dadb4c035?${SIZE}`,
    `https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?${SIZE}`,
    `https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?${SIZE}`,
    `https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?${SIZE}`,
  ],
  beautyProducts: [
    `https://images.unsplash.com/photo-1596462502278-27bfdc403348?${SIZE}`,
    `https://images.unsplash.com/photo-1571875257727-256c39da42af?${SIZE}`,
    `https://images.unsplash.com/photo-1556228578-0d85b1a4d571?${SIZE}`,
    `https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?${SIZE}`,
  ],
  groceries: [
    `https://images.unsplash.com/photo-1542838132-92c53300491e?${SIZE}`,
    `https://images.unsplash.com/photo-1610348725531-843dff563e2c?${SIZE}`,
    `https://images.unsplash.com/photo-1608198093002-ad4e005484ec?${SIZE}`,
    `https://images.unsplash.com/photo-1534723452862-4c874018d66d?${SIZE}`,
  ],
  food: [
    `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?${SIZE}`,
    `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?${SIZE}`,
    `https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?${SIZE}`,
    `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?${SIZE}`,
  ],
  rentals: [
    `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?${SIZE}`,
    `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?${SIZE}`,
    `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?${SIZE}`,
    `https://images.unsplash.com/photo-1493809842364-78817add7ffb?${SIZE}`,
  ],
  rides: [
    `https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?${SIZE}`,
    `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?${SIZE}`,
    `https://images.unsplash.com/photo-1502877338535-766e1452684a?${SIZE}`,
    `https://images.unsplash.com/photo-1489824904134-891ab64532f1?${SIZE}`,
  ],
  companionship: [
    `https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?${SIZE}`,
    `https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?${SIZE}`,
    `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?${SIZE}`,
    `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?${SIZE}`,
  ],
};

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

/**
 * Normalize API image fields (array, JSON string, single string, null)
 * into a clean list of http(s) URLs.
 */
export function normalizeImageUrls(input?: string[] | string | null): string[] {
  if (!input) return [];

  let values: unknown[] = [];
  if (Array.isArray(input)) {
    values = input;
  } else if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        values = Array.isArray(parsed) ? parsed : [trimmed];
      } catch {
        values = [trimmed];
      }
    } else {
      values = [trimmed];
    }
  }

  return values
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter((v) => v.length > 0 && isHttpUrl(v));
}

/** Returns carousel images: real listing photos first, then category fallbacks. */
export function getServiceImages(
  category: keyof typeof SERVICE_IMAGES,
  dbImages?: string[] | string | null
): string[] {
  const fromDb = normalizeImageUrls(dbImages);
  if (fromDb.length > 0) return fromDb;
  return SERVICE_IMAGES[category];
}

/** Pick a single card image, cycling placeholders by index when needed. */
export function getServiceImage(
  category: keyof typeof SERVICE_IMAGES,
  index: number,
  dbImageUrl?: string | string[] | null
): string {
  if (typeof dbImageUrl === 'string' && isHttpUrl(dbImageUrl)) return dbImageUrl;
  const fromList = normalizeImageUrls(dbImageUrl as any);
  if (fromList.length > 0) return fromList[0];
  const pool = SERVICE_IMAGES[category];
  return pool[index % pool.length];
}

/** For detail/hero screens — first real image or category placeholder. */
export function getHeroImage(
  category: keyof typeof SERVICE_IMAGES,
  dbImages?: string[] | string | null,
  dbImage?: string | null
): string {
  const fromDb = normalizeImageUrls(dbImages);
  if (fromDb.length > 0) return fromDb[0];
  if (dbImage && isHttpUrl(dbImage)) return dbImage;
  return SERVICE_IMAGES[category][0];
}
