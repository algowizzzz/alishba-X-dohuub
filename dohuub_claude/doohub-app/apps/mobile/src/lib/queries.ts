import { supabase } from './supabase';

// ============ VENDORS ============

export async function getVendorsByCategory(category: string) {
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
  return data || [];
}

export async function getVendorById(vendorId: string) {
  const { data, error } = await supabase
    .from('Vendor')
    .select(`
      id, businessName, description, logo, coverImage, contactEmail, contactPhone, website,
      rating, reviewCount, isMichelle, status
    `)
    .eq('id', vendorId)
    .single();

  if (error) throw error;
  return data;
}

// ============ CLEANING ============

export async function getCleaningListings(vendorId?: string) {
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
  return data || [];
}

// ============ HANDYMAN ============

export async function getHandymanListings(vendorId?: string) {
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
  return data || [];
}

// ============ BEAUTY ============

export async function getBeautyListings(vendorId?: string) {
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
  return data || [];
}

export async function getBeautyProducts(vendorId?: string) {
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
  return data || [];
}

// ============ GROCERIES ============

export async function getGroceryListings(storeId?: string) {
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
  return data || [];
}

// ============ FOOD ============

export async function getFoodListings(storeId?: string) {
  let query = supabase
    .from('FoodListing')
    .select(`
      id, vendorId, storeId, name, description, cuisines, category, price, image, restaurantName, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('status', 'ACTIVE');

  if (storeId) query = query.eq('storeId', storeId);

  const { data, error } = await query.order('createdAt', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ============ RENTALS ============

export async function getRentalListings() {
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
  return data || [];
}

export async function getRentalById(listingId: string) {
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
  return data;
}

// ============ RIDE ASSISTANCE ============

export async function getRideListings() {
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
  return data || [];
}

// ============ COMPANIONSHIP ============

export async function getCompanionListings() {
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
  return data || [];
}

// ============ REVIEWS ============

export async function getReviewsByVendor(vendorId: string) {
  const { data, error } = await supabase
    .from('Review')
    .select('id, rating, comment, vendorResponse, photos, createdAt, userId')
    .eq('vendorId', vendorId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data || [];
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
  const { data, error } = await supabase
    .from('VendorStore')
    .select(`
      id, name, category, description, logo, status,
      Vendor(id, businessName, logo, coverImage, rating, reviewCount, isMichelle)
    `)
    .eq('category', category)
    .eq('status', 'ACTIVE');

  if (error) throw error;
  return data || [];
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
