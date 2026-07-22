import { supabase } from './supabase';
import api from '../services/api';

/** Prefer API (Prisma) over Supabase so ratings/reviews aren't blocked by RLS. */
async function apiGetList<T = any>(path: string, params?: Record<string, any>): Promise<T[]> {
  const res = await api.get<{ success?: boolean; data?: T[] }>(path, params);
  return Array.isArray(res?.data) ? res.data : [];
}

function normalizeVendor(vendor: any) {
  if (!vendor) return null;
  return {
    ...vendor,
    id: vendor.id,
    businessName: vendor.businessName,
    logo: vendor.logo ?? null,
    coverImage: vendor.coverImage ?? null,
    rating: typeof vendor.rating === 'number' ? vendor.rating : Number(vendor.rating) || 0,
    reviewCount: typeof vendor.reviewCount === 'number' ? vendor.reviewCount : Number(vendor.reviewCount) || 0,
    isMichelle: Boolean(vendor.isMichelle),
  };
}

/** Keep both PascalCase Vendor and camelCase vendor for existing screens. */
function normalizeListing(item: any) {
  const vendor = normalizeVendor(item.vendor || item.Vendor);
  return {
    ...item,
    vendorId: item.vendorId || vendor?.id,
    Vendor: vendor,
    vendor,
  };
}

function normalizeReview(r: any) {
  const user = r.user || r.User || {};
  const profile = user.profile || user.UserProfile || r.User?.UserProfile || null;
  return {
    ...r,
    rating: Number(r.rating) || 0,
    comment: r.comment || '',
    photos: Array.isArray(r.photos) ? r.photos : [],
    createdAt: r.createdAt,
    User: {
      id: user.id,
      email: user.email,
      UserProfile: profile
        ? {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            avatar: profile.avatar || null,
          }
        : null,
    },
    user: {
      id: user.id,
      email: user.email,
      profile,
    },
  };
}

// ============ VENDORS ============

export async function getVendorsByCategory(category: string) {
  try {
    const data = await apiGetList('/vendors', { category, limit: 100 });
    if (data.length > 0) return data.map(normalizeVendor);
  } catch (e) {
    console.warn('[queries] getVendorsByCategory API failed, falling back to Supabase', e);
  }

  const { data, error } = await supabase
    .from('Vendor')
    .select(`
      id, businessName, description, logo, coverImage, rating, reviewCount, isMichelle, status,
      VendorCategory!inner(category)
    `)
    .eq('VendorCategory.category', category)
    .eq('status', 'APPROVED')
    .eq('isActive', true)
    .order('isMichelle', { ascending: false })
    .order('rating', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeVendor);
}

export async function getVendorById(vendorId: string) {
  try {
    const res = await api.get<{ success?: boolean; data?: any }>(`/vendors/${vendorId}`);
    if (res?.data) return normalizeVendor(res.data);
  } catch (e) {
    console.warn('[queries] getVendorById API failed, falling back to Supabase', e);
  }

  const { data, error } = await supabase
    .from('Vendor')
    .select(`
      id, businessName, description, logo, coverImage, contactEmail, contactPhone, website,
      address, city, state, zipCode, hoursOfOperation, deliveryFee, minOrderAmount, estimatedDeliveryTime,
      rating, reviewCount, isMichelle, status
    `)
    .eq('id', vendorId)
    .single();

  if (error) throw error;
  return normalizeVendor(data);
}

// ============ CLEANING ============

export async function getCleaningListings(vendorId?: string) {
  try {
    const data = await apiGetList('/services/cleaning', { limit: 100 });
    const mapped = data.map(normalizeListing);
    if (vendorId) return mapped.filter((l) => l.vendorId === vendorId);
    if (mapped.length > 0) return mapped;
  } catch (e) {
    console.warn('[queries] getCleaningListings API failed, falling back to Supabase', e);
  }

  let query = supabase
    .from('CleaningListing')
    .select(`
      id, vendorId, title, description, cleaningType, basePrice, priceUnit, images, whatsIncluded, duration, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE');

  if (vendorId) query = query.eq('vendorId', vendorId);

  const { data, error } = await query.order('createdAt', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeListing);
}

// ============ HANDYMAN ============

export async function getHandymanListings(vendorId?: string) {
  try {
    const data = await apiGetList('/services/handyman', { limit: 100 });
    const mapped = data.map(normalizeListing);
    if (vendorId) return mapped.filter((l) => l.vendorId === vendorId);
    if (mapped.length > 0) return mapped;
  } catch (e) {
    console.warn('[queries] getHandymanListings API failed, falling back to Supabase', e);
  }

  let query = supabase
    .from('HandymanListing')
    .select(`
      id, vendorId, title, description, handymanType, basePrice, hourlyRate, priceUnit, services, images, whatsIncluded, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE');

  if (vendorId) query = query.eq('vendorId', vendorId);

  const { data, error } = await query.order('createdAt', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeListing);
}

// ============ BEAUTY ============

export async function getBeautyListings(vendorId?: string) {
  try {
    const data = await apiGetList('/services/beauty', { limit: 100 });
    const mapped = data.map(normalizeListing);
    if (vendorId) return mapped.filter((l) => l.vendorId === vendorId);
    if (mapped.length > 0) return mapped;
  } catch (e) {
    console.warn('[queries] getBeautyListings API failed, falling back to Supabase', e);
  }

  let query = supabase
    .from('BeautyListing')
    .select(`
      id, vendorId, title, description, beautyType, basePrice, duration, services, images, portfolio, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE');

  if (vendorId) query = query.eq('vendorId', vendorId);

  const { data, error } = await query.order('createdAt', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeListing);
}

export async function getBeautyProducts(vendorId?: string) {
  try {
    const data = await apiGetList('/services/beauty-products', { limit: 100 });
    const mapped = data.map(normalizeListing);
    if (vendorId) return mapped.filter((l) => l.vendorId === vendorId);
    if (mapped.length > 0) return mapped;
  } catch (e) {
    console.warn('[queries] getBeautyProducts API failed, falling back to Supabase', e);
  }

  let query = supabase
    .from('BeautyProductListing')
    .select(`
      id, vendorId, name, description, category, brand, price, image, inStock, stockCount, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE');

  if (vendorId) query = query.eq('vendorId', vendorId);

  const { data, error } = await query.order('createdAt', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeListing);
}

// ============ GROCERIES ============

export async function getGroceryListings(storeId?: string) {
  try {
    const params: Record<string, any> = { limit: 100 };
    if (storeId) params.storeId = storeId;
    const data = await apiGetList('/services/groceries', params);
    const mapped = data.map(normalizeListing);
    if (mapped.length > 0) return mapped;
  } catch (e) {
    console.warn('[queries] getGroceryListings API failed, falling back to Supabase', e);
  }

  let query = supabase
    .from('GroceryListing')
    .select(`
      id, vendorId, storeId, name, description, category, price, unit, image, inStock, stockCount, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE');

  if (storeId) query = query.eq('storeId', storeId);

  const { data, error } = await query.order('createdAt', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeListing);
}

// ============ FOOD ============

export async function getFoodListings(opts?: { storeId?: string; vendorId?: string } | string) {
  const storeId = typeof opts === 'string' ? opts : opts?.storeId;
  const vendorId = typeof opts === 'string' ? undefined : opts?.vendorId;

  try {
    const params: Record<string, any> = { limit: 100 };
    if (storeId) params.storeId = storeId;
    if (vendorId) params.vendorId = vendorId;
    const data = await apiGetList('/services/food', params);
    const mapped = data.map(normalizeListing);
    if (mapped.length > 0) return mapped;
  } catch (e) {
    console.warn('[queries] getFoodListings API failed, falling back to Supabase', e);
  }

  let query = supabase
    .from('FoodListing')
    .select(`
      id, vendorId, storeId, name, description, cuisines, category, price, image, restaurantName, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE');

  if (storeId) query = query.eq('storeId', storeId);
  if (vendorId) query = query.eq('vendorId', vendorId);

  const { data, error } = await query.order('createdAt', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeListing);
}

// ============ RENTALS ============

export async function getRentalListings() {
  try {
    const data = await apiGetList('/services/rentals', { limit: 100 });
    const mapped = data.map(normalizeListing);
    if (mapped.length > 0) return mapped;
  } catch (e) {
    console.warn('[queries] getRentalListings API failed, falling back to Supabase', e);
  }

  const { data, error } = await supabase
    .from('RentalListing')
    .select(`
      id, vendorId, title, description, propertyType, address, city, state, zipCode,
      bedrooms, bathrooms, maxGuests, amenities, images,
      pricePerNight, pricePerWeek, pricePerMonth, cleaningFee, minStay, maxStay, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeListing);
}

export async function getRentalById(listingId: string) {
  try {
    const res = await api.get<{ success?: boolean; data?: any }>(`/services/rentals/${listingId}`);
    if (res?.data) return normalizeListing(res.data);
  } catch (e) {
    console.warn('[queries] getRentalById API failed, falling back to Supabase', e);
  }

  const { data, error } = await supabase
    .from('RentalListing')
    .select(`
      id, vendorId, title, description, propertyType, address, city, state, zipCode,
      latitude, longitude, bedrooms, bathrooms, maxGuests, amenities, images,
      pricePerNight, pricePerWeek, pricePerMonth, cleaningFee, rules, minStay, maxStay, status,
      Vendor(id, businessName, rating, reviewCount, isMichelle, contactPhone, contactEmail)
    `)
    .eq('id', listingId)
    .single();

  if (error) throw error;
  return normalizeListing(data);
}

// ============ RIDE ASSISTANCE ============

export async function getRideListings() {
  try {
    const data = await apiGetList('/services/ride-assistance', { limit: 100 });
    const mapped = data.map(normalizeListing);
    if (mapped.length > 0) return mapped;
  } catch (e) {
    console.warn('[queries] getRideListings API failed, falling back to Supabase', e);
  }

  const { data, error } = await supabase
    .from('RideAssistanceListing')
    .select(`
      id, vendorId, title, description, longDescription, hourlyRate, image, images,
      vehicleTypes, specialFeatures, coverageArea, totalSeats, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeListing);
}

// ============ COMPANIONSHIP ============

export async function getCompanionListings() {
  try {
    const data = await apiGetList('/services/companionship', { limit: 100 });
    const mapped = data.map(normalizeListing);
    if (mapped.length > 0) return mapped;
  } catch (e) {
    console.warn('[queries] getCompanionListings API failed, falling back to Supabase', e);
  }

  const { data, error } = await supabase
    .from('CompanionshipListing')
    .select(`
      id, vendorId, title, description, hourlyRate, yearsOfExperience, image,
      certifications, specialties, supportTypes, languages, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeListing);
}

// ============ REVIEWS ============

export async function getReviewsByVendor(vendorId: string) {
  try {
    const res = await api.get<{ success?: boolean; data?: any[] }>(
      `/vendors/${vendorId}/reviews`,
      { limit: 50 }
    );
    const rows = Array.isArray(res?.data) ? res.data : [];
    return rows.map(normalizeReview);
  } catch (e) {
    console.warn('[queries] getReviewsByVendor API failed, falling back to Supabase', e);
  }

  const { data, error } = await supabase
    .from('Review')
    .select(`
      id, rating, comment, vendorResponse, photos, createdAt, userId,
      User(id, email, UserProfile(firstName, lastName, avatar))
    `)
    .eq('vendorId', vendorId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeReview);
}

/** Display name for a normalized review row. */
export function getReviewAuthorName(r: any): string {
  const profile = r?.User?.UserProfile || r?.user?.profile;
  if (profile?.firstName) {
    const initial = profile.lastName ? ` ${String(profile.lastName).charAt(0)}.` : '';
    return `${profile.firstName}${initial}`;
  }
  const email = r?.User?.email || r?.user?.email;
  if (email) return String(email).split('@')[0];
  return 'Customer';
}

// ============ VENDOR STORES ============

export async function getStoresByVendor(vendorId: string) {
  const { data, error } = await supabase
    .from('VendorStore')
    .select('id, name, category, description, logo, status')
    .eq('vendorId', vendorId)
    .eq('status', 'ACTIVE');

  if (error) throw error;
  return data || [];
}

export async function getStoresByCategory(category: string) {
  try {
    // Public grocery/food store browse often comes via groceries/food service endpoints.
    // Prefer vendors list with category when available; otherwise Supabase.
    const vendors = await apiGetList('/vendors', { category, limit: 100 });
    if (vendors.length > 0) {
      return vendors.map((v: any) => ({
        id: v.id,
        name: v.businessName,
        category,
        description: v.description,
        logo: v.logo,
        status: 'ACTIVE',
        Vendor: normalizeVendor(v),
      }));
    }
  } catch (e) {
    console.warn('[queries] getStoresByCategory API failed, falling back to Supabase', e);
  }

  const { data, error } = await supabase
    .from('VendorStore')
    .select(`
      id, name, category, description, logo, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('category', category)
    .eq('status', 'ACTIVE');

  if (error) throw error;
  return (data || []).map((s: any) => ({
    ...s,
    Vendor: normalizeVendor(s.Vendor),
  }));
}

// ============ REWARDS ============

export async function getRewardsWallet(userId: string) {
  const { data, error } = await supabase
    .from('RewardsWallet')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getPointsTransactions(userId: string, type?: string) {
  let query = supabase
    .from('PointsTransaction')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (type && type !== 'All') {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getUserStreak(userId: string) {
  const { data, error } = await supabase
    .from('UserStreak')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getCategoryMilestones(userId: string) {
  const { data, error } = await supabase
    .from('CategoryMilestone')
    .select('*')
    .eq('userId', userId)
    .order('category');

  if (error) throw error;
  return data || [];
}

export async function getReferrals(userId: string) {
  const { data, error } = await supabase
    .from('Referral')
    .select('*')
    .eq('referrerUserId', userId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============ PAYMENT METHODS ============

export async function getPaymentMethods(userId: string) {
  const { data, error } = await supabase
    .from('PaymentMethod')
    .select('*')
    .eq('userId', userId)
    .order('isDefault', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============ BOOKINGS (Extended) ============

export async function getBookingById(bookingId: string) {
  const { data, error } = await supabase
    .from('Booking')
    .select(`
      *,
      Vendor(id, businessName, logo, rating, contactPhone, contactEmail),
      Address(id, label, street, city, state, zipCode)
    `)
    .eq('id', bookingId)
    .single();

  if (error) throw error;
  return data;
}

export async function getBookingStatusHistory(bookingId: string) {
  const { data, error } = await supabase
    .from('BookingStatusHistory')
    .select('*')
    .eq('bookingId', bookingId)
    .order('createdAt', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============ ORDERS ============

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('Order')
    .select(`
      *,
      OrderItem(*),
      Vendor(id, businessName, logo, rating, contactPhone)
    `)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
}

export async function getOrdersByUser(userId: string) {
  const { data, error } = await supabase
    .from('Order')
    .select(`
      *,
      Vendor(id, businessName, logo),
      OrderItem(id, name, quantity, price)
    `)
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============ ADDRESSES ============

export async function getAddressesByUser(userId: string) {
  const { data, error } = await supabase
    .from('Address')
    .select('*')
    .eq('userId', userId)
    .order('isDefault', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============ REGIONS ============

export async function getRegions() {
  const { data, error } = await supabase
    .from('Region')
    .select('*')
    .eq('isActive', true)
    .order('name');

  if (error) throw error;
  return data || [];
}
