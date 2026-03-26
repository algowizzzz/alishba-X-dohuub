// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface GoogleSignInRequest {
  idToken: string;
}

export interface AuthResponse {
  user: UserDto;
  token: string;
  refreshToken: string;
}

export interface UserDto {
  id: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  profile?: UserProfileDto;
  isEmailVerified: boolean;
}

export interface UserProfileDto {
  firstName: string;
  lastName: string;
  avatar?: string;
}

// ============================================
// Address Types
// ============================================

export interface AddressDto {
  id: string;
  type: 'HOME' | 'WORK' | 'DOCTOR' | 'PHARMACY' | 'OTHER';
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  type: 'HOME' | 'WORK' | 'DOCTOR' | 'PHARMACY' | 'OTHER';
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
}

// ============================================
// Vendor Types
// ============================================

export interface VendorDto {
  id: string;
  businessName: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  isMichelle: boolean;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  categories: ServiceCategory[];
  serviceAreas: ServiceAreaDto[];
}

export interface ServiceAreaDto {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCodes: string[];
  isActive: boolean;
}

export type ServiceCategory = 
  | 'CLEANING'
  | 'HANDYMAN'
  | 'BEAUTY'
  | 'GROCERIES'
  | 'RENTALS'
  | 'CAREGIVING';

// ============================================
// Listing Types
// ============================================

export interface CleaningListingDto {
  id: string;
  vendorId: string;
  vendor: VendorDto;
  title: string;
  description: string;
  cleaningType: 'DEEP_CLEANING' | 'LAUNDRY' | 'OFFICE_CLEANING';
  basePrice: number;
  priceUnit: string;
  duration?: number;
  images: string[];
  status: ListingStatus;
}

export interface HandymanListingDto {
  id: string;
  vendorId: string;
  vendor: VendorDto;
  title: string;
  description: string;
  handymanType: 'PLUMBING' | 'ELECTRICAL' | 'INSTALLATION' | 'GENERAL_REPAIR';
  basePrice: number;
  priceUnit: string;
  images: string[];
  status: ListingStatus;
}

export interface BeautyListingDto {
  id: string;
  vendorId: string;
  vendor: VendorDto;
  title: string;
  description: string;
  beautyType: 'MAKEUP' | 'HAIR' | 'NAILS' | 'WELLNESS';
  basePrice: number;
  duration: number;
  images: string[];
  portfolio: string[];
  status: ListingStatus;
}

export interface GroceryListingDto {
  id: string;
  vendorId: string;
  vendor: VendorDto;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
  inStock: boolean;
  stockCount?: number;
}

export interface RentalListingDto {
  id: string;
  vendorId: string;
  vendor: VendorDto;
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  pricePerNight?: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  minStay: number;
  maxStay?: number;
}

export interface CaregivingListingDto {
  id: string;
  vendorId: string;
  vendor: VendorDto;
  title: string;
  description: string;
  caregivingType: 'RIDE_ASSISTANCE' | 'COMPANIONSHIP_SUPPORT';
  basePrice: number;
  priceUnit: string;
  serviceArea: string[];
  images: string[];
}

export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'SUSPENDED' | 'DELETED';

// ============================================
// Booking Types
// ============================================

export interface CreateBookingRequest {
  vendorId: string;
  addressId: string;
  category: ServiceCategory;
  listingId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration?: number;
  specialInstructions?: string;
  // Caregiving specific
  pickupLocation?: string;
  dropoffLocation?: string;
  stops?: string[];
  isRoundTrip?: boolean;
}

export interface BookingDto {
  id: string;
  userId: string;
  vendorId: string;
  vendor: VendorDto;
  addressId: string;
  address: AddressDto;
  category: ServiceCategory;
  listing: any; // Polymorphic listing
  scheduledDate: string;
  scheduledTime: string;
  duration?: number;
  specialInstructions?: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
}

export type BookingStatus = 
  | 'PENDING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DECLINED';

// ============================================
// Order Types (Groceries/Food)
// ============================================

export interface CartItemDto {
  id: string;
  listingId: string;
  listing: GroceryListingDto;
  quantity: number;
}

export interface CartDto {
  id: string;
  vendorId?: string;
  vendor?: VendorDto;
  items: CartItemDto[];
  subtotal: number;
}

export interface CreateOrderRequest {
  addressId: string;
  specialNotes?: string;
}

export interface OrderDto {
  id: string;
  vendorId: string;
  vendor: VendorDto;
  address: AddressDto;
  items: OrderItemDto[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery?: string;
  createdAt: string;
}

export interface OrderItemDto {
  id: string;
  listing: GroceryListingDto;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

// ============================================
// Review Types
// ============================================

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment?: string;
  photos?: string[];
}

export interface ReviewDto {
  id: string;
  userId: string;
  user: UserDto;
  vendorId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  photos: string[];
  createdAt: string;
}

// ============================================
// Payment Types
// ============================================

export interface CreatePaymentIntentRequest {
  bookingId?: string;
  orderId?: string;
}

export interface PaymentIntentDto {
  clientSecret: string;
  amount: number;
  currency: string;
}

// ============================================
// AI Chat Types
// ============================================

export interface ChatMessageDto {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    type?: 'text' | 'service-cards' | 'category-chips';
    services?: any[];
    categories?: string[];
  };
  createdAt: string;
}

export interface SendChatMessageRequest {
  conversationId?: string;
  message: string;
}

export interface ChatResponseDto {
  conversationId: string;
  message: ChatMessageDto;
}

// ============================================
// Notification Types
// ============================================

export interface NotificationDto {
  id: string;
  title: string;
  body: string;
  type: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// ============================================
// Constants
// ============================================

export const SERVICE_CATEGORIES = [
  { id: 'CLEANING', name: 'Cleaning Services', icon: 'sparkles' },
  { id: 'HANDYMAN', name: 'Handyman Services', icon: 'wrench' },
  { id: 'GROCERIES', name: 'Groceries & Food', icon: 'shopping-bag' },
  { id: 'BEAUTY', name: 'Beauty Services', icon: 'scissors' },
  { id: 'RENTALS', name: 'Rental Properties', icon: 'building' },
  { id: 'CAREGIVING', name: 'Caregiving Services', icon: 'heart' },
] as const;

export const CLEANING_TYPES = [
  { id: 'DEEP_CLEANING', name: 'Deep Cleaning' },
  { id: 'LAUNDRY', name: 'Laundry' },
  { id: 'OFFICE_CLEANING', name: 'Office Cleaning' },
] as const;

export const HANDYMAN_TYPES = [
  { id: 'PLUMBING', name: 'Plumbing' },
  { id: 'ELECTRICAL', name: 'Electrical' },
  { id: 'INSTALLATION', name: 'Installation' },
  { id: 'GENERAL_REPAIR', name: 'General Repair' },
] as const;

export const BEAUTY_TYPES = [
  { id: 'MAKEUP', name: 'Makeup' },
  { id: 'HAIR', name: 'Hair' },
  { id: 'NAILS', name: 'Nails' },
  { id: 'WELLNESS', name: 'Wellness' },
] as const;

export const CAREGIVING_TYPES = [
  { id: 'RIDE_ASSISTANCE', name: 'Ride Assistance' },
  { id: 'COMPANIONSHIP_SUPPORT', name: 'Companionship Support' },
] as const;

export const BOOKING_STATUSES = [
  { id: 'PENDING', name: 'Pending', color: '#FFA500' },
  { id: 'ACCEPTED', name: 'Accepted', color: '#4CAF50' },
  { id: 'IN_PROGRESS', name: 'In Progress', color: '#2196F3' },
  { id: 'COMPLETED', name: 'Completed', color: '#4CAF50' },
  { id: 'CANCELLED', name: 'Cancelled', color: '#F44336' },
  { id: 'DECLINED', name: 'Declined', color: '#F44336' },
] as const;

