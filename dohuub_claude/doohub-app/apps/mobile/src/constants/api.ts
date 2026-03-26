import Constants from 'expo-constants';

// Get the API URL based on environment
const getApiUrl = () => {
  // Use environment variable if set (for Vercel/production builds)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // In production, use Railway API
  if (process.env.NODE_ENV === 'production') {
    return 'https://dohuubclaude-production.up.railway.app';
  }

  // For local development - localhost works for iOS simulator and web
  return 'http://localhost:3001';
};

export const API_URL = getApiUrl();
export const API_VERSION = 'v1';
export const API_BASE = `${API_URL}/api/${API_VERSION}`;

export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    GOOGLE_SIGNIN: '/auth/google-signin',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  
  // Users
  USERS: {
    ME: '/users/me',
  },
  
  // Addresses
  ADDRESSES: '/addresses',
  
  // Vendors
  VENDORS: '/vendors',
  
  // Services
  SERVICES: {
    CLEANING: '/services/cleaning',
    HANDYMAN: '/services/handyman',
    BEAUTY: '/services/beauty',
    GROCERIES: '/services/groceries',
    RENTALS: '/services/rentals',
    CAREGIVING: '/services/caregiving',
  },
  
  // Bookings
  BOOKINGS: '/bookings',
  
  // Orders
  ORDERS: '/orders',
  
  // Cart
  CART: '/cart',
  
  // Reviews
  REVIEWS: '/reviews',
  
  // Payments
  PAYMENTS: '/payments',
  
  // Chat
  CHAT: '/chat',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
};

