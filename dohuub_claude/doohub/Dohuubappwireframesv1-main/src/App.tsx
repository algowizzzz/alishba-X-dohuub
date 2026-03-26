import { FoodGrocerySelectionScreen } from './components/FoodGrocerySelectionScreen';
import { FoodGroceryCheckoutScreen } from './components/FoodGroceryCheckoutScreen';
import { FoodGroceryConfirmationScreen } from './components/FoodGroceryConfirmationScreen';
import { FoodGroceryOrderTrackingScreen } from './components/FoodGroceryOrderTrackingScreen';
import { FoodVendorsListScreen } from './components/FoodVendorsListScreen';
import { FoodVendorDetailScreen } from './components/FoodVendorDetailScreen';
import { FoodVendorReviewsScreen } from './components/FoodVendorReviewsScreen';
import { GroceryVendorsListScreen } from './components/GroceryVendorsListScreen';
import { GroceryVendorDetailScreen } from './components/GroceryVendorDetailScreen';
import { GroceryVendorReviewsScreen } from './components/GroceryVendorReviewsScreen';
import { CartWarningModal } from './components/CartWarningModal';
import { BeautyChoiceScreen } from './components/BeautyChoiceScreen';
import { BeautyServicesVendorsList } from './components/BeautyServicesVendorsList';
import { BeautyServicesList } from './components/BeautyServicesList';
import { BeautyServiceDetailScreen } from './components/BeautyServiceDetailScreen';
import { BeautyServiceBookingScreen } from './components/BeautyServiceBookingScreen';
import { BeautyServiceConfirmationScreen } from './components/BeautyServiceConfirmationScreen';
import { BeautyServiceReviewsScreen } from './components/BeautyServiceReviewsScreen';
import { BeautyProductsVendorsList } from './components/BeautyProductsVendorsList';
import { BeautyProductsCatalog } from './components/BeautyProductsCatalog';
import { RentalPropertiesListScreen } from './components/RentalPropertiesListScreen';
import { PropertyDetailScreen } from './components/PropertyDetailScreen';
import { PropertyCalendarScreen } from './components/PropertyCalendarScreen';
import { PropertyStayDetailsScreen } from './components/PropertyStayDetailsScreen';
import { PropertyBookingScreen } from './components/PropertyBookingScreen';
import { PropertyConfirmationScreen } from './components/PropertyConfirmationScreen';
import { CaregivingChoiceScreen } from './components/CaregivingChoiceScreen';
import { RideProvidersListScreen } from './components/RideProvidersListScreen';
import { RideProviderDetailScreen } from './components/RideProviderDetailScreen';
import { RideBookingFormScreen } from './components/RideBookingFormScreen';
import { CompanionsListScreen } from './components/CompanionsListScreen';
import { CompanionDetailScreen } from './components/CompanionDetailScreen';
import { CompanionshipBookingFormScreen } from './components/CompanionshipBookingFormScreen';
import { CaregivingConfirmationScreen } from './components/CaregivingConfirmationScreen';
import { CaregivingOrderTrackingScreen } from './components/CaregivingOrderTrackingScreen';
import { CleaningVendorProfileScreen } from './components/CleaningVendorProfileScreen';
import { HandymanVendorProfileScreen } from './components/HandymanVendorProfileScreen';
import { FoodVendorProfileScreen } from './components/FoodVendorProfileScreen';
import { GroceryVendorProfileScreen } from './components/GroceryVendorProfileScreen';
import { BeautyProviderProfileScreen } from './components/BeautyProviderProfileScreen';
import { BeautyProductsVendorProfileScreen } from './components/BeautyProductsVendorProfileScreen';
import { HostProfileScreen } from './components/HostProfileScreen';

import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LocationPermissionScreen } from './components/LocationPermissionScreen';
import { ManualLocationScreen } from './components/ManualLocationScreen';
import { OnboardingCarousel } from './components/OnboardingCarousel';
import { WelcomeAuthScreen } from './components/WelcomeAuthScreen';
import { EmailRegistrationScreen } from './components/EmailRegistrationScreen';
import { OTPVerificationScreen } from './components/OTPVerificationScreen';
import { ProfileSetupScreen } from './components/ProfileSetupScreen';
import { SavedAddressesSetupScreen } from './components/SavedAddressesSetupScreen';
import { AddAddressScreen } from './components/AddAddressScreen';
import { EditAddressScreen } from './components/EditAddressScreen';
import { TermsOfServiceScreen } from './components/TermsOfServiceScreen';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { AboutDoHuubScreen } from './components/AboutDoHuubScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { LocationChangeScreen } from './components/LocationChangeScreen';
import { ServiceListingsScreen } from './components/ServiceListingsScreen';
import { ServiceDetailsScreen } from './components/ServiceDetailsScreen';
import { AllReviewsScreen } from './components/AllReviewsScreen';
import { ReportListingScreen } from './components/ReportListingScreen';
import { BookingCustomizationScreen } from './components/BookingCustomizationScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { BookingConfirmationScreen } from './components/BookingConfirmationScreen';
import { MyBookingsScreen } from './components/MyBookingsScreen';
import { BookingDetailsScreen } from './components/BookingDetailsScreen';
import { RatingReviewScreen } from './components/RatingReviewScreen';
import { AIChatScreen } from './components/AIChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { EditProfileScreen } from './components/EditProfileScreen';
import { SavedAddressesScreen } from './components/SavedAddressesScreen';
import { OrderHistoryScreen } from './components/OrderHistoryScreen';
import { PaymentMethodsScreen } from './components/PaymentMethodsScreen';
import { AddPaymentCardScreen } from './components/AddPaymentCardScreen';
import { EditPaymentCardScreen } from './components/EditPaymentCardScreen';
import { NotificationsSettingsScreen } from './components/NotificationsSettingsScreen';
import { HelpSupportScreen } from './components/HelpSupportScreen';
import { SignInScreen } from './components/SignInScreen';
import { EmailSignInScreen } from './components/EmailSignInScreen';
import { VendorsListScreen } from './components/VendorsListScreen';
import { VendorDetailScreen } from './components/VendorDetailScreen';
import { CleaningServiceDetailScreen } from './components/CleaningServiceDetailScreen';
import { CleaningServiceBookingFormScreen } from './components/CleaningServiceBookingFormScreen';
import { CleaningServiceConfirmationScreen } from './components/CleaningServiceConfirmationScreen';
import { OrderTrackingScreen } from './components/OrderTrackingScreen';
import { CleaningServiceReviewsScreen } from './components/CleaningServiceReviewsScreen';
import { VendorReviewsScreen } from './components/VendorReviewsScreen';
import { PaymentProcessingScreen } from './components/PaymentProcessingScreen';
import { ReviewSubmissionScreen } from './components/ReviewSubmissionScreen';
import { HandymanVendorsListScreen } from './components/HandymanVendorsListScreen';
import { HandymanVendorDetailScreen } from './components/HandymanVendorDetailScreen';
import { HandymanServiceDetailScreen } from './components/HandymanServiceDetailScreen';
import { HandymanServiceBookingFormScreen } from './components/HandymanServiceBookingFormScreen';
import { HandymanServiceConfirmationScreen } from './components/HandymanServiceConfirmationScreen';
import type { Address } from './components/AddAddressScreen';
import type { CardData } from './components/AddPaymentCardScreen';
import type { Notification } from './components/HomeDashboard';
import type { Property } from './components/RentalPropertiesListScreen';
import type { PropertyBookingData } from './components/PropertyBookingScreen';
import type { Vendor, Service, BookingData } from './components/VendorDetailScreen';
import type { HandymanVendor, HandymanService } from './components/HandymanVendorDetailScreen';
import type { HandymanBookingData } from './components/HandymanServiceBookingFormScreen';
import type { FoodVendor } from './components/FoodVendorsListScreen';
import type { GroceryVendor } from './components/GroceryVendorsListScreen';
import type { CartItem, MenuItem } from './components/FoodVendorDetailScreen';
import type { GroceryCartItem, GroceryItem } from './components/GroceryVendorDetailScreen';
import type { BeautyBookingData } from './components/BeautyServiceBookingScreen';
import type { RideProvider } from './components/RideProvidersListScreen';
import type { Companion } from './components/CompanionsListScreen';

export type Screen = 
  | 'splash'
  | 'locationPermission'
  | 'manualLocation'
  | 'onboarding'
  | 'welcomeAuth'
  | 'signIn'
  | 'emailSignIn'
  | 'emailRegistration'
  | 'otpVerification'
  | 'profileSetup'
  | 'savedAddressesSetup'
  | 'addAddress'
  | 'editAddress'
  | 'termsOfService'
  | 'privacyPolicy'
  | 'aboutDoHuub'
  | 'home'
  | 'locationChange'
  | 'login'
  | 'serviceListings'
  | 'serviceDetails'
  | 'bookingCustomization'
  | 'payment'
  | 'bookingConfirmation'
  | 'myBookings'
  | 'bookingDetails'
  | 'ratingReview'
  | 'aiChat'
  | 'profile'
  | 'editProfile'
  | 'savedAddresses'
  | 'orderHistory'
  | 'paymentMethods'
  | 'addPaymentCard'
  | 'editPaymentCard'
  | 'notificationSettings'
  | 'helpSupport'
  | 'allReviews'
  | 'reportListing'
  | 'vendorsList'
  | 'vendorDetail'
  | 'cleaningServiceDetail'
  | 'cleaningServiceBooking'
  | 'cleaningServiceConfirmation'
  | 'orderTracking'
  | 'cleaningServiceReviews'
  | 'paymentProcessing'
  | 'reviewSubmission'
  | 'handymanVendorsList'
  | 'handymanVendorDetail'
  | 'handymanServiceDetail'
  | 'handymanServiceBooking'
  | 'handymanServiceConfirmation'
  | 'handymanServiceReviews'
  | 'foodVendorReviews'
  | 'groceryVendorReviews'
  | 'beautyProviderReviews'
  | 'beautyProductsVendorReviews'
  | 'hostReviews'
  | 'companionReviews'
  | 'rideProviderReviews'
  | 'foodGrocerySelection'
  | 'foodGroceryCheckout'
  | 'foodGroceryConfirmation'
  | 'foodGroceryOrderTracking'
  | 'cartWarningModal'
  | 'beautyChoice'
  | 'beautyServicesVendorsList'
  | 'beautyServicesList'
  | 'beautyServiceDetail'
  | 'beautyServiceReviews'
  | 'beautyProductsVendorsList'
  | 'beautyProductsCatalog'
  | 'beautyServicesBooking'
  | 'beautyServicesConfirmation'
  | 'rentalPropertiesList'
  | 'propertyDetail'
  | 'propertyCalendar'
  | 'propertyStayDetails'
  | 'propertyBooking'
  | 'propertyConfirmation'
  | 'caregivingChoice'
  | 'rideProvidersList'
  | 'rideProviderDetail'
  | 'rideBookingForm'
  | 'companionsList'
  | 'companionDetail'
  | 'companionshipBookingForm'
  | 'caregivingConfirmation'
  | 'caregivingOrderTracking'
  | 'cleaningVendorProfile'
  | 'handymanVendorProfile'
  | 'foodVendorProfile'
  | 'groceryVendorProfile'
  | 'beautyProviderProfile'
  | 'beautyProductsVendorProfile'
  | 'hostProfile';

export interface AppState {
  userEmail: string;
  userName: string;
  userLocation: string;
  selectedCategory: string;
  selectedService: any;
  selectedBooking: any;
  selectedAddress?: Address;
  selectedAddressId: string;
  addressType?: 'Home' | 'Work' | 'Other';
  bookings: any[];
  previousScreen?: Screen;
  addresses: Address[];
  notifications: Notification[];
  paymentCards: CardData[];
  foodVendors: FoodVendor[];
  groceryVendors: GroceryVendor[];
  cart: CartItem[];
  groceryCart: GroceryCartItem[];
  selectedFoodVendor?: FoodVendor;
  selectedGroceryVendor?: GroceryVendor;
  currentCartVendorId?: number | string;
  currentCartVendorName?: string;
  foodGroceryOrderType?: 'food' | 'grocery';
  pendingFoodGroceryOrder?: any;
  selectedBeautyServiceProvider?: any;
  selectedBeautyService?: any;
  selectedBeautyProductVendor?: any;
  beautyProductsCart: Array<{ id: number; name: string; price: number; category: string; size: string; quantity: number }>;
  beautyCartType?: 'services' | 'products';
  beautyBookingData?: BeautyBookingData;
  currentBookingType?: 'cleaning' | 'handyman' | 'beauty' | 'rental';
  properties: Property[];
  selectedProperty?: Property;
  propertyCheckInDate?: string;
  propertyCheckOutDate?: string;
  propertyDuration?: string;
  propertyGuests?: number;
  propertySpecialRequests?: string;
  propertyTotalPrice?: number;
  propertyBookingData?: PropertyBookingData;
  selectedRideProvider?: RideProvider;
  selectedCompanion?: Companion;
  caregivingServiceType?: 'ride' | 'companionship';
  caregivingBookingData?: any;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [pendingCartAction, setPendingCartAction] = useState<{
    item: MenuItem | GroceryItem;
    vendor: FoodVendor | GroceryVendor;
    type: 'food' | 'grocery';
  } | null>(null);
  const [appState, setAppState] = useState<AppState>({
    userEmail: '',
    userName: '',
    userLocation: 'New York, USA',
    selectedCategory: '',
    selectedService: null,
    selectedBooking: null,
    bookings: [
      {
        id: 1001,
        type: 'cleaning',
        service: 'Deep House Cleaning',
        vendor: 'Sparkle Clean Co.',
        date: '2024-12-05',
        time: '10:00 AM',
        address: '123 Main St, New York, NY 10001',
        status: 'accepted',
        price: '$150',
        category: 'Cleaning Services'
      },
      {
        id: 1002,
        type: 'cleaning',
        service: 'Office Cleaning',
        vendor: 'Fresh Start Cleaning',
        date: '2024-12-03',
        time: '2:00 PM',
        address: '456 Park Ave, New York, NY 10022',
        status: 'in-progress',
        price: '$200',
        category: 'Cleaning Services'
      },
      {
        id: 1003,
        type: 'handyman',
        service: 'Plumbing Repair',
        vendor: 'Home Repair Masters',
        date: '2024-12-06',
        time: '1:00 PM',
        address: '225 Sumach Street, Apt 2505, Toronto',
        status: 'accepted',
        price: '$85',
        category: 'Handyman Services'
      },
      {
        id: 1004,
        type: 'handyman',
        service: 'Electrical Wiring',
        vendor: 'Expert Handyman Services',
        date: '2024-12-04',
        time: '3:00 PM',
        address: '890 Queen St, Toronto, ON M5H 2N2',
        status: 'in-progress',
        price: '$120',
        category: 'Handyman Services'
      },
      {
        id: 1005,
        type: 'cleaning',
        service: 'Apartment Cleaning',
        vendor: 'Sparkle Clean Co.',
        date: '2024-11-28',
        time: '9:00 AM',
        address: '789 Broadway, New York, NY 10003',
        status: 'completed',
        price: '$120',
        category: 'Cleaning Services',
        hasReview: true
      },
      {
        id: 1006,
        type: 'handyman',
        service: 'Furniture Assembly',
        vendor: 'Home Repair Masters',
        date: '2024-11-26',
        time: '10:30 AM',
        address: '100 King St, Toronto, ON M5X 1C7',
        status: 'completed',
        price: '$65',
        category: 'Handyman Services',
        hasReview: false
      },
      {
        id: 1007,
        type: 'cleaning',
        service: 'Move-Out Cleaning',
        vendor: 'Fresh Start Cleaning',
        date: '2024-11-25',
        time: '11:00 AM',
        address: '321 5th Avenue, New York, NY 10016',
        status: 'completed',
        price: '$180',
        category: 'Cleaning Services',
        hasReview: false
      },
      // Beauty Service Bookings - All Statuses
      {
        id: 1008,
        type: 'beauty',
        service: 'Professional Makeup',
        vendor: 'Beauty on DE Run',
        providerName: 'Beauty on DE Run',
        date: '2024-12-06',
        time: '2:00 PM',
        address: '123 Main St, New York, NY 10001',
        status: 'accepted',
        price: '$80.00',
        estimatedPrice: '$80.00',
        category: 'Beauty Services and Products',
        hasReview: false
      },
      {
        id: 1010,
        type: 'beauty',
        service: 'Hair Styling & Treatment',
        vendor: 'Beauty on DE Run',
        providerName: 'Beauty on DE Run',
        date: '2024-12-04',
        time: '11:00 AM',
        address: '456 Park Ave, New York, NY 10022',
        status: 'in-progress',
        price: '$120.00',
        estimatedPrice: '$120.00',
        category: 'Beauty Services and Products',
        hasReview: false
      },
      {
        id: 1011,
        type: 'beauty',
        service: 'Full Body Massage',
        vendor: 'Beauty on DE Run',
        providerName: 'Beauty on DE Run',
        date: '2024-11-28',
        time: '3:00 PM',
        address: '789 Broadway, New York, NY 10003',
        status: 'completed',
        price: '$150.00',
        estimatedPrice: '$150.00',
        category: 'Beauty Services and Products',
        hasReview: false
      },
      // Beauty Products Orders - All Statuses
      {
        id: 1009,
        type: 'beauty-products',
        service: 'Beauty Products Order',
        vendor: 'Beauty on DE Run',
        date: '2024-12-03',
        time: '4:30 PM',
        address: '123 Main St, New York, NY 10001',
        status: 'completed',
        price: '$125.47',
        category: 'Beauty Services and Products',
        items: [
          { id: 1, name: 'HD Foundation', price: 35.99, quantity: 1, category: 'Makeup', size: '30ml' },
          { id: 5, name: 'Vitamin C Serum', price: 28.99, quantity: 1, category: 'Skincare', size: '30ml' },
          { id: 6, name: 'Hyaluronic Acid Moisturizer', price: 32.00, quantity: 1, category: 'Skincare', size: '50ml' },
          { id: 2, name: 'Matte Lipstick', price: 18.99, quantity: 1, category: 'Makeup', size: '3.5g' }
        ],
        hasReview: false,
        paymentMethod: 'Visa •••• 4532'
      },
      {
        id: 1012,
        type: 'beauty-products',
        service: 'Beauty Products Order',
        vendor: 'Glamour Beauty Shop',
        date: '2024-12-05',
        time: '1:30 PM',
        address: '225 Sumach Street, Apt 2505, Toronto',
        status: 'accepted',
        price: '$89.95',
        category: 'Beauty Services and Products',
        items: [
          { id: 3, name: 'Luxury Mascara', price: 24.99, quantity: 1, category: 'Makeup', size: '8ml' },
          { id: 7, name: 'Night Cream', price: 42.00, quantity: 1, category: 'Skincare', size: '50ml' },
          { id: 4, name: 'Eyebrow Pencil', price: 12.99, quantity: 2, category: 'Makeup', size: '1.2g' }
        ],
        hasReview: false,
        paymentMethod: 'Mastercard •••• 8765'
      },
      {
        id: 1013,
        type: 'beauty-products',
        service: 'Beauty Products Order',
        vendor: 'Pure Beauty Essentials',
        date: '2024-12-04',
        time: '5:15 PM',
        address: '890 Queen St, Toronto, ON M5H 2N2',
        status: 'in-progress',
        price: '$156.80',
        category: 'Beauty Services and Products',
        items: [
          { id: 8, name: 'Retinol Serum', price: 45.99, quantity: 1, category: 'Skincare', size: '30ml' },
          { id: 9, name: 'Face Cleanser', price: 22.99, quantity: 2, category: 'Skincare', size: '150ml' },
          { id: 10, name: 'Eye Shadow Palette', price: 38.99, quantity: 1, category: 'Makeup', size: '12 colors' },
          { id: 11, name: 'Lip Gloss Set', price: 25.99, quantity: 1, category: 'Makeup', size: '5pc' }
        ],
        hasReview: false,
        paymentMethod: 'Visa •••• 4532'
      },
      {
        id: 1014,
        type: 'beauty-products',
        service: 'Beauty Products Order',
        vendor: 'Beauty on DE Run',
        date: '2024-11-27',
        time: '12:00 PM',
        address: '100 King St, Toronto, ON M5X 1C7',
        status: 'completed',
        price: '$198.50',
        category: 'Beauty Services and Products',
        items: [
          { id: 12, name: 'Premium Face Mask Set', price: 55.99, quantity: 1, category: 'Skincare', size: '10pc' },
          { id: 13, name: 'Anti-Aging Cream', price: 68.00, quantity: 1, category: 'Skincare', size: '50ml' },
          { id: 14, name: 'Setting Spray', price: 28.99, quantity: 1, category: 'Makeup', size: '100ml' },
          { id: 15, name: 'Makeup Brush Set', price: 45.52, quantity: 1, category: 'Makeup', size: '12pc' }
        ],
        hasReview: true,
        paymentMethod: 'Amex •••• 1009'
      },
      // Food Orders - All Statuses
      {
        id: 2001,
        type: 'food',
        service: 'Food Order',
        vendor: 'The Golden Spoon',
        date: '2024-12-05',
        time: '12:30 PM',
        address: '123 Main St, New York, NY 10001',
        status: 'accepted',
        price: '$45.99',
        category: 'Groceries & Food',
        items: [
          { id: 1, name: 'Grilled Chicken Salad', price: 15.99, quantity: 1 },
          { id: 2, name: 'Margherita Pizza', price: 18.99, quantity: 1 },
          { id: 3, name: 'Lemonade', price: 5.50, quantity: 2 }
        ],
        hasReview: false,
        paymentMethod: 'Visa •••• 4532'
      },
      {
        id: 2002,
        type: 'food',
        service: 'Food Order',
        vendor: 'Burger Haven',
        date: '2024-12-04',
        time: '7:15 PM',
        address: '456 Park Ave, New York, NY 10022',
        status: 'in-progress',
        price: '$32.50',
        category: 'Groceries & Food',
        items: [
          { id: 1, name: 'Classic Cheeseburger', price: 12.99, quantity: 2 },
          { id: 2, name: 'French Fries', price: 4.99, quantity: 2 }
        ],
        hasReview: false,
        paymentMethod: 'Mastercard •••• 8765'
      },
      {
        id: 2003,
        type: 'food',
        service: 'Food Order',
        vendor: 'Sushi Paradise',
        date: '2024-11-30',
        time: '6:45 PM',
        address: '789 Broadway, New York, NY 10003',
        status: 'completed',
        price: '$68.75',
        category: 'Groceries & Food',
        items: [
          { id: 1, name: 'California Roll', price: 12.99, quantity: 2 },
          { id: 2, name: 'Spicy Tuna Roll', price: 14.99, quantity: 1 },
          { id: 3, name: 'Miso Soup', price: 4.99, quantity: 2 },
          { id: 4, name: 'Green Tea', price: 3.50, quantity: 2 }
        ],
        hasReview: false,
        paymentMethod: 'Visa •••• 4532'
      },
      {
        id: 2004,
        type: 'food',
        service: 'Food Order',
        vendor: 'Pizza Express',
        date: '2024-11-28',
        time: '8:00 PM',
        address: '321 5th Avenue, New York, NY 10016',
        status: 'completed',
        price: '$52.00',
        category: 'Groceries & Food',
        items: [
          { id: 1, name: 'Pepperoni Pizza (Large)', price: 22.99, quantity: 1 },
          { id: 2, name: 'Vegetarian Pizza (Medium)', price: 18.99, quantity: 1 },
          { id: 3, name: 'Garlic Bread', price: 5.99, quantity: 1 },
          { id: 4, name: 'Coca Cola', price: 2.50, quantity: 2 }
        ],
        hasReview: true,
        paymentMethod: 'Amex •••• 1009'
      },
      // Grocery Orders - All Statuses
      {
        id: 3001,
        type: 'grocery',
        service: 'Grocery Order',
        vendor: 'Fresh Market',
        date: '2024-12-05',
        time: '9:00 AM',
        address: '225 Sumach Street, Apt 2505, Toronto',
        status: 'accepted',
        price: '$127.50',
        category: 'Groceries & Food',
        items: [
          { id: 1, name: 'Organic Bananas (1kg)', price: 3.99, quantity: 2 },
          { id: 2, name: 'Fresh Milk (2L)', price: 5.99, quantity: 3 },
          { id: 3, name: 'Whole Wheat Bread', price: 4.50, quantity: 2 },
          { id: 4, name: 'Free Range Eggs (12pc)', price: 6.99, quantity: 2 },
          { id: 5, name: 'Organic Chicken Breast (1kg)', price: 15.99, quantity: 3 },
          { id: 6, name: 'Mixed Vegetables', price: 8.99, quantity: 2 }
        ],
        hasReview: false,
        paymentMethod: 'Visa •••• 4532'
      },
      {
        id: 3002,
        type: 'grocery',
        service: 'Grocery Order',
        vendor: 'Green Grocers',
        date: '2024-12-04',
        time: '2:30 PM',
        address: '890 Queen St, Toronto, ON M5H 2N2',
        status: 'in-progress',
        price: '$89.25',
        category: 'Groceries & Food',
        items: [
          { id: 1, name: 'Fresh Tomatoes (1kg)', price: 4.99, quantity: 2 },
          { id: 2, name: 'Cucumber (3pc)', price: 2.99, quantity: 1 },
          { id: 3, name: 'Red Onions (1kg)', price: 3.50, quantity: 1 },
          { id: 4, name: 'Pasta (500g)', price: 3.99, quantity: 3 },
          { id: 5, name: 'Olive Oil (1L)', price: 12.99, quantity: 1 },
          { id: 6, name: 'Cheese (500g)', price: 8.99, quantity: 2 },
          { id: 7, name: 'Orange Juice (1L)', price: 5.99, quantity: 3 }
        ],
        hasReview: false,
        paymentMethod: 'Mastercard •••• 8765'
      },
      {
        id: 3003,
        type: 'grocery',
        service: 'Grocery Order',
        vendor: 'Organic Market',
        date: '2024-11-29',
        time: '10:15 AM',
        address: '100 King St, Toronto, ON M5X 1C7',
        status: 'completed',
        price: '$156.80',
        category: 'Groceries & Food',
        items: [
          { id: 1, name: 'Organic Apples (2kg)', price: 8.99, quantity: 2 },
          { id: 2, name: 'Organic Strawberries (500g)', price: 6.99, quantity: 2 },
          { id: 3, name: 'Organic Spinach (300g)', price: 4.99, quantity: 3 },
          { id: 4, name: 'Organic Ground Beef (1kg)', price: 18.99, quantity: 2 },
          { id: 5, name: 'Greek Yogurt (1kg)', price: 7.99, quantity: 2 },
          { id: 6, name: 'Almond Milk (1L)', price: 5.99, quantity: 4 },
          { id: 7, name: 'Quinoa (500g)', price: 9.99, quantity: 2 },
          { id: 8, name: 'Organic Honey (500g)', price: 12.99, quantity: 1 }
        ],
        hasReview: false,
        paymentMethod: 'Visa •••• 4532'
      },
      {
        id: 3004,
        type: 'grocery',
        service: 'Grocery Order',
        vendor: 'Fresh Market',
        date: '2024-11-26',
        time: '11:30 AM',
        address: '123 Main St, New York, NY 10001',
        status: 'completed',
        price: '$94.50',
        category: 'Groceries & Food',
        items: [
          { id: 1, name: 'Fresh Salmon (500g)', price: 16.99, quantity: 1 },
          { id: 2, name: 'Broccoli (500g)', price: 3.99, quantity: 2 },
          { id: 3, name: 'Sweet Potatoes (1kg)', price: 4.50, quantity: 2 },
          { id: 4, name: 'Brown Rice (2kg)', price: 8.99, quantity: 1 },
          { id: 5, name: 'Avocados (4pc)', price: 6.99, quantity: 2 },
          { id: 6, name: 'Coconut Water (1L)', price: 4.99, quantity: 3 },
          { id: 7, name: 'Dark Chocolate (100g)', price: 3.99, quantity: 4 }
        ],
        hasReview: true,
        paymentMethod: 'Mastercard •••• 8765'
      },
      // Rental Properties - All Statuses
      {
        id: 4001,
        type: 'rental',
        service: 'Luxury Downtown Apartment',
        vendor: 'DoHuub Properties',
        date: '2024-12-10',
        time: '3:00 PM',
        checkInDate: '2024-12-10',
        checkOutDate: '2024-12-15',
        duration: '5 nights',
        guests: 2,
        address: '123 Main St, New York, NY 10001',
        status: 'accepted',
        price: '$750',
        category: 'Rental Properties',
        hasReview: false,
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 1,
        isPoweredByDoHuub: true,
        checkInInstructions: 'The building entrance code is #5678. Take the elevator to the 8th floor, apartment 8D. Key lockbox is next to the door, code is 1234. Fresh towels and linens are in the hallway closet, extra pillows in the bedroom cupboard. WiFi password is "SoHoLoft2024". Coffee and tea in the kitchen. Any questions, call Sarah at (212) 555-0123. Hope you enjoy your stay!'
      },
      {
        id: 4002,
        type: 'rental',
        service: 'Cozy Studio Near Central Park',
        vendor: 'DoHuub Properties',
        date: '2024-12-03',
        time: '3:00 PM',
        checkInDate: '2024-12-03',
        checkOutDate: '2024-12-10',
        duration: '1 week',
        guests: 1,
        address: '456 Park Ave, New York, NY 10022',
        status: 'in-progress',
        price: '$980',
        category: 'Rental Properties',
        hasReview: false,
        propertyType: 'Studio',
        bedrooms: 1,
        bathrooms: 1,
        isPoweredByDoHuub: true,
        checkInInstructions: 'Main entrance is on Delancey Street. Ring buzzer #4C and I will let you in remotely. Your apartment is 4th floor walk-up, key is under the doormat. Fresh towels in the bathroom cabinet, extra blankets in the closet. Kitchen has coffee, tea, and basics. Laundromat is 2 blocks away on Orchard St. Metro is 5-minute walk. Text me anytime at (917) 555-0147. Enjoy the neighborhood!'
      },
      {
        id: 4003,
        type: 'rental',
        service: 'Modern Family House',
        vendor: 'Prime Rentals Inc.',
        date: '2024-11-20',
        time: '3:00 PM',
        checkInDate: '2024-11-20',
        checkOutDate: '2024-11-27',
        duration: '1 week',
        guests: 4,
        address: '789 Broadway, New York, NY 10003',
        status: 'completed',
        price: '$1,400',
        category: 'Rental Properties',
        hasReview: false,
        propertyType: 'House',
        bedrooms: 3,
        bathrooms: 2,
        isPoweredByDoHuub: false,
        checkInInstructions: 'Street parking is available (check signs). The house has a red door with brass knocker. Keys are in the lockbox on the railing, code is 2468. Towels in the linen closet, extra blankets upstairs. Dog bowls and treats in the mudroom if you brought your pup! Prospect Park is 10-minute walk. Farmers market on Saturdays. Spare keys with neighbor at #156. Text Jennifer at (347) 555-0176 anytime. Hope you love Park Slope!'
      }
    ],
    addresses: [],
    selectedAddressId: '',
    notifications: [
      {
        id: '1',
        type: 'order',
        title: 'Order Placed Successfully',
        message: 'Your cleaning service order #1234 has been placed and confirmed. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        timestamp: '2 minutes ago',
        isRead: false
      },
      {
        id: '3',
        type: 'promo',
        title: 'Special Offer: 20% Off',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Use code SAVE20 for your next grocery order. Sed do eiusmod tempor incididunt ut labore.',
        timestamp: '1 hour ago',
        isRead: false
      },
      {
        id: '4',
        type: 'order',
        title: 'Order In Progress',
        message: 'Your beauty service appointment is currently in progress. The specialist will complete the service shortly.',
        timestamp: '2 hours ago',
        isRead: true
      },
      {
        id: '5',
        type: 'update',
        title: 'Order Completed',
        message: 'Your order #1122 has been completed successfully. Please rate your experience with the service provider.',
        timestamp: '3 hours ago',
        isRead: true
      },
      {
        id: '6',
        type: 'reminder',
        title: 'Upcoming Appointment Reminder',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Your handyman service is scheduled for tomorrow at 2:00 PM.',
        timestamp: '5 hours ago',
        isRead: true
      },
      {
        id: '7',
        type: 'promo',
        title: 'Weekend Flash Sale',
        message: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Get 30% off on all beauty services this weekend only.',
        timestamp: '1 day ago',
        isRead: true
      },
      {
        id: '8',
        type: 'update',
        title: 'Payment Successful',
        message: 'Your payment of $89.99 has been processed successfully. Lorem ipsum dolor sit amet for order #5678.',
        timestamp: '2 days ago',
        isRead: true
      },
      {
        id: '9',
        type: 'order',
        title: 'Booking Confirmed',
        message: 'Consectetur adipiscing elit sed do eiusmod tempor. Your caregiving service booking has been confirmed for next week.',
        timestamp: '3 days ago',
        isRead: true
      },
      {
        id: '10',
        type: 'reminder',
        title: 'Review Your Recent Order',
        message: 'Ut labore et dolore magna aliqua. We would love to hear about your experience with our cleaning service.',
        timestamp: '4 days ago',
        isRead: true
      },
      {
        id: '11',
        type: 'promo',
        title: 'New Service Available',
        message: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Check out our new rental properties service now available in your area.',
        timestamp: '5 days ago',
        isRead: true
      },
      {
        id: '12',
        type: 'update',
        title: 'Profile Updated',
        message: 'Sed do eiusmod tempor incididunt. Your profile information has been successfully updated.',
        timestamp: '1 week ago',
        isRead: true
      }
    ],
    paymentCards: [],
    foodVendors: [],
    groceryVendors: [],
    cart: [],
    groceryCart: [],
    beautyProductsCart: [],
    properties: [
      {
        id: 1,
        name: 'Luxury Downtown Apartment',
        location: 'Manhattan, New York, NY',
        pricePerNight: 150,
        pricePerWeek: 980,
        pricePerMonth: 3800,
        rating: 4.9,
        reviews: 234,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        sqft: 850,
        propertyType: 'Apartment',
        amenities: ['WiFi', 'Kitchen', 'AC', 'Heating', 'TV', 'Washer'],
        description: 'Beautiful modern apartment in the heart of Manhattan with stunning city views. Perfect for business travelers and tourists alike. Walking distance to major attractions.',
        houseRules: ['No smoking', 'No pets', 'Check-in: 3:00 PM', 'Check-out: 11:00 AM', 'Quiet hours: 10 PM - 8 AM'],
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in. 50% refund if cancelled within 24-48 hours. No refund for cancellations within 24 hours.',
        isPoweredByDoHuub: true,
        photos: ['1', '2', '3', '4', '5']
      },
      {
        id: 2,
        name: 'Cozy Studio Near Central Park',
        location: 'Upper West Side, New York, NY',
        pricePerNight: 140,
        pricePerWeek: 910,
        pricePerMonth: 3500,
        rating: 4.8,
        reviews: 189,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        sqft: 500,
        propertyType: 'Studio',
        amenities: ['WiFi', 'Kitchen', 'AC', 'Heating', 'TV'],
        description: 'Charming studio apartment just steps away from Central Park. Enjoy the vibrant neighborhood with excellent dining and shopping options. Perfect for couples.',
        houseRules: ['No smoking', 'No pets', 'Check-in: 3:00 PM', 'Check-out: 11:00 AM', 'Maximum 2 guests'],
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in. 50% refund if cancelled within 24-48 hours. No refund for cancellations within 24 hours.',
        isPoweredByDoHuub: true,
        photos: ['1', '2', '3', '4', '5']
      },
      {
        id: 3,
        name: 'Modern Family House',
        location: 'Brooklyn, New York, NY',
        pricePerNight: 200,
        pricePerWeek: 1300,
        pricePerMonth: 5000,
        rating: 4.7,
        reviews: 156,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        sqft: 1500,
        propertyType: 'House',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'AC', 'Heating', 'TV', 'Washer'],
        description: 'Spacious family home in a quiet Brooklyn neighborhood. Features a private backyard and modern amenities. Close to subway stations and local attractions.',
        houseRules: ['No smoking indoors', 'Pets allowed with approval', 'Check-in: 3:00 PM', 'Check-out: 11:00 AM', 'Please keep noise to minimum after 10 PM'],
        cancellationPolicy: 'Free cancellation up to 7 days before check-in. 50% refund if cancelled within 3-7 days. No refund for cancellations within 3 days.',
        isPoweredByDoHuub: false,
        photos: ['1', '2', '3', '4', '5', '6']
      },
      {
        id: 4,
        name: 'Elegant Loft in SoHo',
        location: 'SoHo, New York, NY',
        pricePerNight: 250,
        pricePerWeek: 1650,
        pricePerMonth: 6400,
        rating: 4.9,
        reviews: 298,
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        sqft: 1200,
        propertyType: 'Apartment',
        amenities: ['WiFi', 'Kitchen', 'AC', 'Heating', 'TV', 'Washer', 'Pool'],
        description: 'Stunning loft with high ceilings and exposed brick walls. Located in the trendy SoHo district with world-class shopping and dining at your doorstep.',
        houseRules: ['No smoking', 'No pets', 'Check-in: 3:00 PM', 'Check-out: 11:00 AM', 'Building quiet hours: 10 PM - 8 AM'],
        cancellationPolicy: 'Free cancellation up to 5 days before check-in. 50% refund if cancelled within 3-5 days. No refund for cancellations within 3 days.',
        checkInInstructions: 'The building entrance code is #5678. Take the elevator to the 8th floor, apartment 8D. Key lockbox is next to the door, code is 1234. Fresh towels and linens are in the hallway closet, extra pillows in the bedroom cupboard. WiFi password is "SoHoLoft2024". Coffee and tea in the kitchen. Any questions, call Sarah at (212) 555-0123. Hope you enjoy your stay!',
        isPoweredByDoHuub: true,
        photos: ['1', '2', '3', '4', '5', '6']
      },
      {
        id: 5,
        name: 'Waterfront Villa',
        location: 'Staten Island, New York, NY',
        pricePerNight: 350,
        pricePerWeek: 2310,
        pricePerMonth: 9000,
        rating: 5.0,
        reviews: 87,
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        sqft: 2500,
        propertyType: 'Villa',
        amenities: ['WiFi', 'Kitchen', 'Parking', 'Pool', 'AC', 'Heating', 'TV', 'Washer'],
        description: 'Luxurious waterfront villa with breathtaking views and private pool. Perfect for family gatherings and special occasions. Features modern amenities throughout.',
        houseRules: ['No smoking indoors', 'No parties or events', 'Check-in: 3:00 PM', 'Check-out: 11:00 AM', 'Pool supervision required for children'],
        cancellationPolicy: 'Free cancellation up to 14 days before check-in. 50% refund if cancelled within 7-14 days. No refund for cancellations within 7 days.',
        checkInInstructions: 'Main gate code is 9876, park in spot #15. Front door key is in the blue mailbox by entrance, combination is 5-4-3-2. Pool towels are in the cabana, beach towels in the garage. Private beach path is behind the property. Extra linens in master bedroom closet. Garbage goes out Thursday mornings. Grill propane tank is full, enjoy! Any issues, call Mike at (718) 555-0199. Have a wonderful stay!',
        isPoweredByDoHuub: false,
        photos: ['1', '2', '3', '4', '5', '6', '7']
      },
      {
        id: 6,
        name: 'Compact City Studio',
        location: 'Lower East Side, New York, NY',
        pricePerNight: 90,
        pricePerWeek: 595,
        pricePerMonth: 2300,
        rating: 4.5,
        reviews: 145,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        sqft: 400,
        propertyType: 'Studio',
        amenities: ['WiFi', 'Kitchen', 'AC', 'Heating'],
        description: 'Budget-friendly studio in a vibrant neighborhood. Great for solo travelers or couples looking to explore NYC. Close to public transportation.',
        houseRules: ['No smoking', 'No pets', 'Check-in: 3:00 PM', 'Check-out: 11:00 AM', 'Quiet hours: 10 PM - 8 AM'],
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in. 50% refund if cancelled within 24-48 hours. No refund for cancellations within 24 hours.',
        checkInInstructions: 'Main entrance is on Delancey Street. Ring buzzer #4C and I will let you in remotely. Your apartment is 4th floor walk-up, key is under the doormat. Fresh towels in the bathroom cabinet, extra blankets in the closet. Kitchen has coffee, tea, and basics. Laundromat is 2 blocks away on Orchard St. Metro is 5-minute walk. Text me anytime at (917) 555-0147. Enjoy the neighborhood!',
        isPoweredByDoHuub: true,
        photos: ['1', '2', '3', '4']
      },
      {
        id: 7,
        name: 'Penthouse with Rooftop',
        location: 'Midtown, New York, NY',
        pricePerNight: 400,
        pricePerWeek: 2660,
        pricePerMonth: 10400,
        rating: 4.9,
        reviews: 178,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        sqft: 1800,
        propertyType: 'Apartment',
        amenities: ['WiFi', 'Kitchen', 'AC', 'Heating', 'TV', 'Washer', 'Pool'],
        description: 'Exclusive penthouse with private rooftop terrace offering panoramic Manhattan views. High-end finishes and designer furniture throughout.',
        houseRules: ['No smoking', 'No pets', 'Check-in: 4:00 PM', 'Check-out: 11:00 AM', 'Rooftop access until 11 PM'],
        cancellationPolicy: 'Free cancellation up to 7 days before check-in. 50% refund if cancelled within 3-7 days. No refund for cancellations within 3 days.',
        checkInInstructions: 'Concierge will have your key packet ready, just show ID. Parking is Level B2, spot #37. Elevator code for penthouse floor is 7890. Rooftop key is in the kitchen drawer. Fresh towels and robes in the master bath, extra pillows in the hallway closet. WiFi is "PenthouseNYC" password "Manhattan2024". Building gym is 24/7. Concierge can help with anything. Call David at (646) 555-0188. Enjoy the views!',
        isPoweredByDoHuub: true,
        photos: ['1', '2', '3', '4', '5', '6', '7', '8']
      },
      {
        id: 8,
        name: 'Charming Brownstone',
        location: 'Park Slope, Brooklyn, NY',
        pricePerNight: 180,
        pricePerWeek: 1190,
        pricePerMonth: 4600,
        rating: 4.8,
        reviews: 201,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        sqft: 1100,
        propertyType: 'House',
        amenities: ['WiFi', 'Kitchen', 'AC', 'Heating', 'TV', 'Washer'],
        description: 'Classic Brooklyn brownstone in family-friendly Park Slope. Features original architectural details and modern comforts. Near Prospect Park.',
        houseRules: ['No smoking', 'Pets welcome', 'Check-in: 3:00 PM', 'Check-out: 11:00 AM', 'Please respect neighbors'],
        cancellationPolicy: 'Free cancellation up to 5 days before check-in. 50% refund if cancelled within 3-5 days. No refund for cancellations within 3 days.',
        checkInInstructions: 'Street parking is available (check signs). The house has a red door with brass knocker. Keys are in the lockbox on the railing, code is 2468. Towels in the linen closet, extra blankets upstairs. Dog bowls and treats in the mudroom if you brought your pup! Prospect Park is 10-minute walk. Farmers market on Saturdays. Spare keys with neighbor at #156. Text Jennifer at (347) 555-0176 anytime. Hope you love Park Slope!',
        isPoweredByDoHuub: false,
        photos: ['1', '2', '3', '4', '5']
      }
    ]
  });

  const navigate = (screen: Screen, data?: any) => {
    if (data) {
      setAppState(prev => ({ ...prev, ...data }));
    }
    setCurrentScreen(screen);
  };

  const updateAppState = (data: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...data }));
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setAppState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      )
    }));
  };

  const handleClearAllNotifications = () => {
    setAppState(prev => ({
      ...prev,
      notifications: []
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => navigate('locationPermission')} />;
      case 'locationPermission':
        return <LocationPermissionScreen 
          onAllow={() => navigate('onboarding')}
          onManual={() => navigate('manualLocation')}
        />;
      case 'manualLocation':
        return <ManualLocationScreen 
          onConfirm={(location) => navigate('onboarding', { userLocation: location })}
        />;
      case 'onboarding':
        return <OnboardingCarousel onComplete={() => navigate('welcomeAuth')} />;
      case 'welcomeAuth':
        return <WelcomeAuthScreen 
          onEmail={() => navigate('emailRegistration')}
          onGoogle={() => navigate('profileSetup')}
          onSignIn={() => navigate('signIn')}
          onTerms={() => navigate('termsOfService', { previousScreen: 'welcomeAuth' })}
          onPrivacy={() => navigate('privacyPolicy', { previousScreen: 'welcomeAuth' })}
        />;
      case 'emailRegistration':
        return <EmailRegistrationScreen 
          onBack={() => navigate('welcomeAuth')}
          onContinue={(email) => navigate('otpVerification', { userEmail: email })}
        />;
      case 'otpVerification':
        return <OTPVerificationScreen 
          email={appState.userEmail}
          onBack={() => navigate('emailRegistration')}
          onVerify={() => navigate('profileSetup')}
        />;
      case 'profileSetup':
        return <ProfileSetupScreen 
          onContinue={(name) => navigate('savedAddressesSetup', { userName: name })}
        />;
      case 'savedAddressesSetup':
        return <SavedAddressesSetupScreen 
          onDone={() => navigate('home')}
          onSkip={() => navigate('home')}
          onAddAddress={(type) => navigate('addAddress', { addressType: type, previousScreen: 'savedAddressesSetup' })}
        />;
      case 'addAddress':
        return <AddAddressScreen 
          defaultType={appState.addressType}
          onBack={() => {
            const backScreen = appState.previousScreen === 'savedAddressesSetup' ? 'savedAddressesSetup' : 
                              appState.previousScreen === 'home' ? 'home' : 
                              appState.previousScreen === 'cleaningServiceBooking' ? 'cleaningServiceBooking' : 'savedAddresses';
            navigate(backScreen);
          }}
          onSave={(address) => {
            const newAddress = { ...address, id: Date.now() };
            const updatedAddresses = [...appState.addresses, newAddress];
            // If this is the first address, set it as selected
            const selectedId = appState.addresses.length === 0 ? newAddress.id.toString() : appState.selectedAddressId;
            updateAppState({ 
              addresses: updatedAddresses,
              selectedAddressId: selectedId
            });
            const backScreen = appState.previousScreen === 'savedAddressesSetup' ? 'savedAddressesSetup' : 
                              appState.previousScreen === 'home' ? 'home' : 
                              appState.previousScreen === 'cleaningServiceBooking' ? 'cleaningServiceBooking' : 'savedAddresses';
            navigate(backScreen);
          }}
        />;
      case 'editAddress':
        return <EditAddressScreen 
          address={appState.selectedAddress!}
          onBack={() => navigate('savedAddresses')}
          onSave={(address) => {
            const updatedAddresses = appState.addresses.map(a => a.id === address.id ? address : a);
            updateAppState({ addresses: updatedAddresses });
            navigate('savedAddresses');
          }}
        />;
      case 'termsOfService':
        return <TermsOfServiceScreen 
          onBack={() => navigate(appState.previousScreen || 'welcomeAuth')}
        />;
      case 'privacyPolicy':
        return <PrivacyPolicyScreen 
          onBack={() => navigate(appState.previousScreen || 'welcomeAuth')}
        />;
      case 'aboutDoHuub':
        return <AboutDoHuubScreen 
          onBack={() => navigate('profile')}
        />;
      case 'home':
        return <HomeDashboard 
          addresses={appState.addresses}
          selectedAddressId={appState.selectedAddressId}
          onSelectAddress={(addressId) => updateAppState({ selectedAddressId: addressId })}
          location={appState.userLocation}
          navigate={navigate}
          onCategorySelect={(category) => {
            // Navigate to vendors list for Cleaning Services, otherwise use regular flow
            if (category === 'Cleaning Services') {
              navigate('vendorsList', { selectedCategory: category });
            } else if (category === 'Handyman Services') {
              navigate('handymanVendorsList', { selectedCategory: category });
            } else if (category === 'Groceries & Food') {
              navigate('foodGrocerySelection', { selectedCategory: category });
            } else if (category === 'Beauty Services and Products') {
              navigate('beautyChoice', { selectedCategory: category });
            } else if (category === 'Rental Properties') {
              navigate('rentalPropertiesList', { selectedCategory: category });
            } else if (category === 'Caregiving Services') {
              navigate('caregivingChoice', { selectedCategory: category });
            } else {
              navigate('serviceListings', { selectedCategory: category });
            }
          }}
          onLocationChange={() => navigate('locationChange')}
          onAddAddress={() => navigate('addAddress', { previousScreen: 'home' })}
          notifications={appState.notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
        />;
      case 'locationChange':
        return <LocationChangeScreen 
          currentLocation={appState.userLocation}
          onBack={() => navigate('home')}
          onSelect={(location) => navigate('home', { userLocation: location })}
        />;
      case 'serviceListings':
        return <ServiceListingsScreen 
          category={appState.selectedCategory}
          location={appState.userLocation}
          onBack={() => navigate('home')}
          onServiceSelect={(service) => navigate('serviceDetails', { selectedService: service })}
        />;
      case 'serviceDetails':
        return <ServiceDetailsScreen 
          service={appState.selectedService}
          onBack={() => navigate('serviceListings')}
          onBook={() => navigate('bookingCustomization')}
          onReviews={() => navigate('allReviews')}
          onReport={() => navigate('reportListing')}
        />;
      case 'allReviews':
        return <AllReviewsScreen 
          service={appState.selectedService}
          onBack={() => navigate('serviceDetails')}
        />;
      case 'reportListing':
        return <ReportListingScreen 
          onBack={() => navigate('serviceDetails')}
          onSubmit={() => navigate('serviceDetails')}
        />;
      case 'bookingCustomization':
        return <BookingCustomizationScreen 
          service={appState.selectedService}
          category={appState.selectedCategory}
          onBack={() => navigate('serviceDetails')}
          onContinue={() => navigate('payment')}
        />;
      case 'payment':
        return <PaymentScreen 
          service={appState.selectedService}
          onBack={() => navigate('bookingCustomization')}
          onComplete={(booking) => {
            const newBooking = { ...booking, id: Date.now() };
            updateAppState({ bookings: [...appState.bookings, newBooking] });
            navigate('bookingConfirmation', { selectedBooking: newBooking });
          }}
        />;
      case 'bookingConfirmation':
        return <BookingConfirmationScreen 
          booking={appState.selectedBooking}
          onViewDetails={() => navigate('bookingDetails')}
          onHome={() => navigate('home')}
        />;
      case 'myBookings':
        return <MyBookingsScreen 
          bookings={appState.bookings}
          navigate={navigate}
          onBookingSelect={(booking) => {
            // Handle food & grocery & beauty product orders
            if (booking.type === 'food' || booking.type === 'grocery' || booking.type === 'beauty-products') {
              updateAppState({ selectedBooking: booking });
              navigate('foodGroceryOrderTracking');
            }
            // Handle cleaning service bookings
            else if (booking.type === 'cleaning') {
              // Convert the simple booking to BookingData format
              const bookingData: BookingData = {
                service: typeof booking.service === 'string' 
                  ? { id: 1, name: booking.service, price: booking.price, rating: 4.9, reviews: 234, duration: '2-3 hours' }
                  : booking.service,
                vendor: typeof booking.vendor === 'string'
                  ? { id: 1, name: booking.vendor, rating: 4.9, reviewCount: 234, isPoweredByDoHuub: true }
                  : booking.vendor,
                date: booking.date,
                time: booking.time,
                address: typeof booking.address === 'string'
                  ? { id: 1, label: 'Home', street: booking.address, city: 'New York', state: 'NY', zipCode: '10001', isDefault: true }
                  : booking.address,
                paymentCard: appState.paymentCards[0] || { 
                  id: 1, 
                  cardNumber: '4532123456781234', 
                  cardholderName: 'John Doe', 
                  expiryMonth: '12', 
                  expiryYear: '25', 
                  cvv: '123', 
                  isDefault: true 
                },
                estimatedPrice: booking.price,
                referenceNumber: `CL${booking.id}`,
                hasReview: booking.hasReview,
                status: booking.status,
                id: booking.id
              };
              updateAppState({ cleaningBookingData: bookingData, currentBookingType: 'cleaning' });
              navigate('orderTracking');
            } 
            // Handle handyman service bookings
            else if (booking.type === 'handyman') {
              // Convert the simple booking to HandymanBookingData format
              const bookingData: HandymanBookingData = {
                service: typeof booking.service === 'string' 
                  ? { id: 1, name: booking.service, description: 'Professional handyman service', price: booking.price, duration: '1-2 hours', rating: 4.8 }
                  : booking.service,
                vendor: typeof booking.vendor === 'string'
                  ? { id: 1, name: booking.vendor, rating: 4.8, completedJobs: 150, responseTime: '15 min', isPoweredByDoHuub: true }
                  : booking.vendor,
                date: booking.date,
                time: booking.time,
                address: typeof booking.address === 'string'
                  ? { id: 1, type: 'Home', street: booking.address, isDefault: true }
                  : booking.address,
                paymentCard: appState.paymentCards[0] || { 
                  id: 1, 
                  cardNumber: '4532123456781234', 
                  cardholderName: 'John Doe', 
                  expiryMonth: '12', 
                  expiryYear: '25', 
                  cvv: '123', 
                  isDefault: true,
                  cardType: 'Visa',
                  lastFourDigits: '1234'
                },
                estimatedPrice: booking.price,
                referenceNumber: `HM${booking.id}`,
                hasReview: booking.hasReview,
                status: booking.status,
                id: booking.id
              };
              updateAppState({ handymanBookingData: bookingData, currentBookingType: 'handyman' });
              navigate('orderTracking');
            }
            // Handle beauty service bookings
            else if (booking.type === 'beauty') {
              // Convert the simple booking to BeautyBookingData format
              const bookingData: BeautyBookingData = {
                service: typeof booking.service === 'string' 
                  ? { id: 1, name: booking.service, category: 'Beauty Services', price: booking.price, duration: '1 hour', rating: 4.9, reviews: 156 }
                  : booking.service,
                providerName: booking.providerName || booking.vendor || 'Beauty Provider',
                date: booking.date,
                time: booking.time,
                address: typeof booking.address === 'string'
                  ? { id: 1, label: 'Home', street: booking.address, city: 'New York', state: 'NY', zipCode: '10001', isDefault: true }
                  : booking.address,
                paymentCard: appState.paymentCards[0] || { 
                  id: 1, 
                  cardNumber: '4532123456781234', 
                  cardholderName: 'John Doe', 
                  expiryMonth: '12', 
                  expiryYear: '25', 
                  cvv: '123', 
                  isDefault: true 
                },
                estimatedPrice: booking.estimatedPrice || booking.price,
                referenceNumber: `BE${booking.id}`,
                hasReview: booking.hasReview,
                status: booking.status,
                id: booking.id
              };
              updateAppState({ beautyBookingData: bookingData, currentBookingType: 'beauty' });
              navigate('orderTracking');
            }
            // Handle rental property bookings
            else if (booking.type === 'rental') {
              // Convert the simple booking to PropertyBookingData format
              const totalPrice = parseInt(booking.price.replace(/[^0-9]/g, ''));
              // Calculate per-night price from duration
              const durationMatch = booking.duration?.match(/(\d+)/);
              const nights = durationMatch ? parseInt(durationMatch[1]) : 1;
              const pricePerNight = Math.round(totalPrice / nights);
              
              const bookingData: PropertyBookingData = {
                type: 'rental',
                property: {
                  id: booking.id,
                  name: typeof booking.service === 'string' ? booking.service : booking.service?.name,
                  location: booking.address,
                  propertyType: booking.propertyType || 'Apartment',
                  pricePerNight: pricePerNight,
                  pricePerWeek: Math.round(pricePerNight * 7 * 0.85),
                  pricePerMonth: Math.round(pricePerNight * 30 * 0.75),
                  rating: 4.8,
                  reviews: 89,
                  bedrooms: booking.bedrooms || 2,
                  bathrooms: booking.bathrooms || 1,
                  maxGuests: (booking.bedrooms || 2) * 2,
                  sqft: (booking.bedrooms || 2) * 400,
                  photos: [],
                  amenities: ['WiFi', 'Kitchen', 'Heating', 'TV'],
                  description: 'Beautiful property available for rent.',
                  houseRules: ['No smoking', 'No pets', 'Check-in: 3:00 PM', 'Check-out: 11:00 AM'],
                  cancellationPolicy: 'Free cancellation up to 24 hours before check-in. After that, 50% refund up to 7 days before check-in.',
                  isPoweredByDoHuub: booking.isPoweredByDoHuub || false,
                  checkInInstructions: booking.checkInInstructions || 'Check-in instructions will be provided closer to your arrival date.'
                },
                service: { name: typeof booking.service === 'string' ? booking.service : booking.service?.name },
                checkInDate: booking.checkInDate || booking.date,
                checkOutDate: booking.checkOutDate || booking.date,
                date: booking.checkInDate || booking.date,
                time: booking.time || '3:00 PM',
                duration: booking.duration || '1 night',
                guests: booking.guests || 1,
                specialRequests: booking.specialRequests || '',
                address: typeof booking.address === 'string'
                  ? { id: 1, label: 'Home', street: booking.address, city: 'New York', state: 'NY', zipCode: '10001', isDefault: true }
                  : booking.address,
                paymentCard: appState.paymentCards[0] || { 
                  id: 1, 
                  cardNumber: '4532123456781234', 
                  cardholderName: 'John Doe', 
                  expiryMonth: '12', 
                  expiryYear: '25', 
                  cvv: '123', 
                  isDefault: true 
                },
                totalPrice: totalPrice,
                referenceNumber: booking.referenceNumber || `RP${booking.id}`,
                hasReview: booking.hasReview,
                status: booking.status,
                id: booking.id
              };
              updateAppState({ propertyBookingData: bookingData, currentBookingType: 'rental' });
              navigate('orderTracking');
            }
            // Handle caregiving service bookings (ride or companionship)
            else if (booking.type === 'caregiving-ride' || booking.type === 'caregiving-companionship') {
              const serviceType = booking.type === 'caregiving-ride' ? 'ride' : 'companionship';
              const caregivingData = {
                date: booking.date,
                time: booking.time,
                duration: booking.duration,
                total: parseInt(booking.price.replace(/[^0-9]/g, '')),
                stops: booking.stops,
                isRoundTrip: booking.isRoundTrip,
                returnTime: booking.returnTime,
                vehicleType: booking.vehicleType,
                passengers: booking.passengers,
                specialRequests: booking.specialRequests,
                supportTypes: booking.supportTypes,
                paymentMethod: { type: 'Card', last4: booking.paymentMethod?.split('••••')[1]?.trim() || '0000' }
              };
              
              if (serviceType === 'ride') {
                caregivingData.provider = { name: booking.vendor };
                caregivingData.pickupAddress = typeof booking.address === 'string'
                  ? { label: 'Home', street: booking.address }
                  : booking.address;
              } else {
                caregivingData.companion = { 
                  name: booking.vendor,
                  yearsExperience: booking.companionYearsExperience || 5
                };
                caregivingData.serviceLocation = typeof booking.address === 'string'
                  ? { label: 'Home', street: booking.address }
                  : booking.address;
              }
              
              updateAppState({ 
                caregivingServiceType: serviceType,
                caregivingBookingData: caregivingData 
              });
              navigate('caregivingOrderTracking');
            }
            // For other bookings, use the existing flow
            else {
              navigate('bookingDetails', { selectedBooking: booking });
            }
          }}
        />;
      case 'bookingDetails':
        return <BookingDetailsScreen 
          booking={appState.selectedBooking}
          onBack={() => navigate('myBookings')}
          onRate={() => navigate('ratingReview')}
        />;
      case 'ratingReview':
        return <RatingReviewScreen 
          booking={appState.selectedBooking}
          onBack={() => navigate('bookingDetails')}
          onSubmit={() => navigate('myBookings')}
        />;
      case 'aiChat':
        return <AIChatScreen 
          navigate={navigate}
          onServiceSelect={(service) => navigate('serviceDetails', { selectedService: service })}
        />;
      case 'profile':
        return <ProfileScreen 
          userName={appState.userName}
          userEmail={appState.userEmail}
          navigate={navigate}
        />;
      case 'editProfile':
        return <EditProfileScreen 
          userName={appState.userName}
          onBack={() => navigate('profile')}
          onSave={(name) => navigate('profile', { userName: name })}
        />;
      case 'savedAddresses':
        return <SavedAddressesScreen 
          addresses={appState.addresses}
          onBack={() => navigate('profile')}
          onAddAddress={() => navigate('addAddress', { previousScreen: 'savedAddresses' })}
          onEditAddress={(address) => navigate('editAddress', { selectedAddress: address })}
          onDeleteAddress={(id) => {
            const updatedAddresses = appState.addresses.filter(a => a.id !== id);
            updateAppState({ addresses: updatedAddresses });
          }}
          onSetDefault={(id) => {
            const updatedAddresses = appState.addresses.map(addr => ({
              ...addr,
              isDefault: addr.id === id
            }));
            updateAppState({ addresses: updatedAddresses });
          }}
        />;
      case 'orderHistory':
        return <OrderHistoryScreen 
          bookings={appState.bookings}
          onBack={() => navigate('profile')}
          onReorder={(service) => navigate('serviceDetails', { selectedService: service })}
        />;
      case 'paymentMethods':
        return <PaymentMethodsScreen 
          onBack={() => navigate('profile')}
          onAddCard={() => navigate('addPaymentCard')}
          cards={appState.paymentCards}
          onEditCard={(card) => navigate('editPaymentCard', { selectedCard: card })}
          onDeleteCard={(id) => {
            const updatedCards = appState.paymentCards.filter(c => c.id !== id);
            updateAppState({ paymentCards: updatedCards });
          }}
          onSetDefault={(id) => {
            const updatedCards = appState.paymentCards.map(c => ({
              ...c,
              isDefault: c.id === id
            }));
            updateAppState({ paymentCards: updatedCards });
          }}
        />;
      case 'addPaymentCard':
        return <AddPaymentCardScreen 
          onBack={() => navigate('paymentMethods')}
          onSave={(card) => {
            const newCard = { ...card, id: Date.now() };
            updateAppState({ paymentCards: [...appState.paymentCards, newCard] });
            navigate('paymentMethods');
          }}
        />;
      case 'editPaymentCard':
        return <EditPaymentCardScreen 
          card={appState.selectedCard!}
          onBack={() => navigate('paymentMethods')}
          onSave={(card) => {
            const updatedCards = appState.paymentCards.map(c => c.id === card.id ? card : c);
            updateAppState({ paymentCards: updatedCards });
            navigate('paymentMethods');
          }}
        />;
      case 'notificationSettings':
        return <NotificationsSettingsScreen 
          onBack={() => navigate('profile')}
        />;
      case 'helpSupport':
        return <HelpSupportScreen 
          onBack={() => navigate('profile')}
          onAIChat={() => navigate('aiChat')}
        />;
      case 'signIn':
        return <SignInScreen 
          onEmail={() => navigate('emailSignIn')}
          onGoogle={() => navigate('home')}
          onBack={() => navigate('welcomeAuth')}
        />;
      case 'emailSignIn':
        return <EmailSignInScreen 
          onBack={() => navigate('signIn')}
          onSignIn={(email) => navigate('home', { userEmail: email })}
        />;
      case 'vendorsList':
        return <VendorsListScreen 
          category={appState.selectedCategory}
          onBack={() => navigate('home')}
          onVendorSelect={(vendor) => navigate('vendorDetail', { selectedVendor: vendor })}
        />;
      case 'vendorDetail':
        return <VendorDetailScreen 
          vendor={appState.selectedVendor!}
          onBack={() => navigate('vendorsList')}
          onServiceSelect={(service, vendor) => navigate('cleaningServiceDetail', { selectedCleaningService: service, selectedVendor: vendor })}
          onViewProfile={() => navigate('cleaningVendorProfile')}
        />;
      case 'cleaningServiceDetail':
        return <CleaningServiceDetailScreen 
          service={appState.selectedCleaningService!}
          vendor={appState.selectedVendor!}
          onBack={() => navigate('vendorDetail')}
          onBook={() => navigate('cleaningServiceBooking')}
          onViewAllReviews={() => navigate('cleaningServiceReviews')}
        />;
      case 'cleaningServiceBooking':
        return <CleaningServiceBookingFormScreen 
          service={appState.selectedCleaningService!}
          vendor={appState.selectedVendor!}
          addresses={appState.addresses}
          paymentCards={appState.paymentCards}
          onBack={() => navigate('cleaningServiceDetail')}
          onConfirm={(bookingData) => {
            updateAppState({ cleaningBookingData: bookingData, currentBookingType: 'cleaning' });
            navigate('paymentProcessing');
          }}
          onAddAddress={() => navigate('addAddress', { previousScreen: 'cleaningServiceBooking' })}
          onAddPaymentCard={() => navigate('addPaymentCard')}
        />;
      case 'paymentProcessing':
        return <PaymentProcessingScreen 
          onComplete={() => {
            if (appState.currentBookingType === 'handyman') {
              // Handle handyman booking
              const updatedBookingData = {
                ...appState.handymanBookingData!,
                hasReview: false,
                status: 'accepted'
              };
              const newBooking = {
                ...updatedBookingData,
                id: Date.now(),
                type: 'handyman'
              };
              updateAppState({ 
                handymanBookingData: updatedBookingData,
                bookings: [...appState.bookings, newBooking] 
              });
              navigate('handymanServiceConfirmation');
            } else if (appState.currentBookingType === 'beauty') {
              // Handle beauty booking
              const updatedBookingData = {
                ...appState.beautyBookingData!,
                hasReview: false,
                status: 'accepted'
              };
              const newBooking = {
                ...updatedBookingData,
                id: Date.now(),
                type: 'beauty'
              };
              updateAppState({ 
                beautyBookingData: updatedBookingData,
                bookings: [...appState.bookings, newBooking] 
              });
              navigate('beautyServicesConfirmation');
            } else if (appState.currentBookingType === 'rental') {
              // Rental properties handle their own booking creation and navigation
              // Do nothing here since it's already handled in the PropertyBookingScreen onConfirm
            } else {
              // Handle cleaning booking
              const updatedBookingData = {
                ...appState.cleaningBookingData!,
                hasReview: false,
                status: 'accepted'
              };
              const newBooking = {
                ...updatedBookingData,
                id: Date.now(),
                type: 'cleaning'
              };
              updateAppState({ 
                cleaningBookingData: updatedBookingData,
                bookings: [...appState.bookings, newBooking] 
              });
              navigate('cleaningServiceConfirmation');
            }
          }}
        />;
      case 'cleaningServiceConfirmation':
        return <CleaningServiceConfirmationScreen 
          bookingData={appState.cleaningBookingData!}
          onTrackOrder={() => navigate('orderTracking')}
          onHome={() => navigate('home')}
        />;
      case 'orderTracking':
        return <OrderTrackingScreen 
          bookingData={
            appState.currentBookingType === 'handyman' 
              ? appState.handymanBookingData! 
              : appState.currentBookingType === 'beauty'
              ? appState.beautyBookingData!
              : appState.currentBookingType === 'rental'
              ? appState.propertyBookingData!
              : appState.cleaningBookingData!
          }
          onBack={() => navigate('myBookings')}
          onRequestReview={(bookingData) => {
            if (appState.currentBookingType === 'handyman') {
              updateAppState({ handymanBookingData: bookingData });
            } else if (appState.currentBookingType === 'beauty') {
              updateAppState({ beautyBookingData: bookingData });
            } else if (appState.currentBookingType === 'rental') {
              updateAppState({ propertyBookingData: bookingData as any });
            } else {
              updateAppState({ cleaningBookingData: bookingData });
            }
            navigate('reviewSubmission');
          }}
          onReorder={() => {
            // Navigate back to booking form with pre-filled data
            if (appState.currentBookingType === 'handyman') {
              const bookingData = appState.handymanBookingData!;
              updateAppState({
                selectedHandymanVendor: bookingData.vendor,
                selectedHandymanService: bookingData.service
              });
              navigate('handymanServiceDetail');
            } else if (appState.currentBookingType === 'beauty') {
              const bookingData = appState.beautyBookingData!;
              updateAppState({
                selectedBeautyServiceProvider: { name: bookingData.providerName },
                selectedBeautyService: bookingData.service
              });
              navigate('beautyServiceDetail');
            } else if (appState.currentBookingType === 'rental') {
              const bookingData = appState.propertyBookingData!;
              updateAppState({
                selectedProperty: bookingData.property
              });
              navigate('propertyDetail');
            } else {
              const bookingData = appState.cleaningBookingData!;
              updateAppState({
                selectedVendor: bookingData.vendor,
                selectedCleaningService: bookingData.service
              });
              navigate('cleaningServiceDetail');
            }
          }}
        />;
      case 'cleaningServiceReviews':
        return <CleaningServiceReviewsScreen 
          serviceName={appState.selectedCleaningService!.name}
          overallRating={appState.selectedCleaningService!.rating}
          totalReviews={234}
          onBack={() => navigate('cleaningServiceDetail')}
        />;
      case 'beautyServiceReviews':
        return <BeautyServiceReviewsScreen 
          serviceName={appState.selectedBeautyService!.name}
          overallRating={appState.selectedBeautyService!.rating}
          totalReviews={156}
          onBack={() => navigate('beautyServiceDetail')}
        />;
      case 'reviewSubmission':
        return <ReviewSubmissionScreen 
          bookingData={
            appState.currentBookingType === 'handyman' 
              ? appState.handymanBookingData! 
              : appState.currentBookingType === 'beauty'
              ? appState.beautyBookingData!
              : appState.currentBookingType === 'cleaning'
              ? appState.cleaningBookingData!
              : appState.selectedBooking // For food/grocery orders
          }
          onBack={() => {
            // Go back to appropriate tracking screen
            if (appState.selectedBooking?.type === 'food' || appState.selectedBooking?.type === 'grocery' || appState.selectedBooking?.type === 'beauty-products') {
              navigate('foodGroceryOrderTracking');
            } else {
              navigate('orderTracking');
            }
          }}
          onSubmit={(reviewData) => {
            // Handle review submission - could save to state or API
            console.log('Review submitted:', reviewData);
            // Update booking status to include review
            const bookingId = appState.currentBookingType === 'handyman' 
              ? appState.handymanBookingData?.id 
              : appState.currentBookingType === 'beauty'
              ? appState.beautyBookingData?.id
              : appState.currentBookingType === 'cleaning'
              ? appState.cleaningBookingData?.id
              : appState.selectedBooking?.id; // For food/grocery
            const updatedBookings = appState.bookings.map(b => 
              b.id === bookingId ? { ...b, hasReview: true } : b
            );
            
            // Also update the specific booking data state
            if (appState.currentBookingType === 'handyman') {
              updateAppState({ 
                bookings: updatedBookings,
                handymanBookingData: { ...appState.handymanBookingData!, hasReview: true }
              });
            } else if (appState.currentBookingType === 'beauty') {
              updateAppState({ 
                bookings: updatedBookings,
                beautyBookingData: { ...appState.beautyBookingData!, hasReview: true }
              });
            } else if (appState.currentBookingType === 'cleaning') {
              updateAppState({ 
                bookings: updatedBookings,
                cleaningBookingData: { ...appState.cleaningBookingData!, hasReview: true }
              });
            } else {
              // For food/grocery/beauty-products, also update selectedBooking
              updateAppState({ 
                bookings: updatedBookings,
                selectedBooking: { ...appState.selectedBooking!, hasReview: true }
              });
            }
            
            // Navigate back to appropriate tracking screen
            if (appState.selectedBooking?.type === 'food' || appState.selectedBooking?.type === 'grocery' || appState.selectedBooking?.type === 'beauty-products') {
              navigate('foodGroceryOrderTracking');
            } else {
              navigate('orderTracking');
            }
          }}
          onReviewLater={() => {
            // Navigate back to appropriate tracking screen
            if (appState.selectedBooking?.type === 'food' || appState.selectedBooking?.type === 'grocery' || appState.selectedBooking?.type === 'beauty-products') {
              navigate('foodGroceryOrderTracking');
            } else {
              navigate('orderTracking');
            }
          }}
        />;
      case 'handymanVendorsList':
        return <HandymanVendorsListScreen 
          category={appState.selectedCategory}
          onBack={() => navigate('home')}
          onVendorSelect={(vendor) => navigate('handymanVendorDetail', { selectedHandymanVendor: vendor })}
        />;
      case 'handymanVendorDetail':
        return <HandymanVendorDetailScreen 
          vendor={appState.selectedHandymanVendor!}
          onBack={() => navigate('handymanVendorsList')}
          onServiceSelect={(service, vendor) => navigate('handymanServiceDetail', { selectedHandymanService: service, selectedHandymanVendor: vendor })}
          onViewProfile={() => navigate('handymanVendorProfile')}
        />;
      case 'handymanServiceDetail':
        return <HandymanServiceDetailScreen 
          service={appState.selectedHandymanService!}
          vendor={appState.selectedHandymanVendor!}
          onBack={() => navigate('handymanVendorDetail')}
          onBook={() => navigate('handymanServiceBooking')}
          onViewAllReviews={() => navigate('handymanServiceReviews')}
        />;
      case 'handymanServiceBooking':
        return <HandymanServiceBookingFormScreen 
          service={appState.selectedHandymanService!}
          vendor={appState.selectedHandymanVendor!}
          addresses={appState.addresses}
          paymentCards={appState.paymentCards}
          onBack={() => navigate('handymanServiceDetail')}
          onConfirm={(bookingData) => {
            updateAppState({ handymanBookingData: bookingData, currentBookingType: 'handyman' });
            navigate('paymentProcessing');
          }}
          onAddAddress={() => navigate('addAddress', { previousScreen: 'handymanServiceBooking' })}
          onAddPaymentCard={() => navigate('addPaymentCard')}
        />;
      case 'handymanServiceConfirmation':
        return <HandymanServiceConfirmationScreen 
          bookingData={appState.handymanBookingData!}
          onTrackOrder={() => navigate('orderTracking')}
          onHome={() => navigate('home')}
        />;
      case 'handymanServiceReviews':
        return <CleaningServiceReviewsScreen 
          serviceName={appState.selectedHandymanService!.name}
          overallRating={appState.selectedHandymanService!.rating}
          totalReviews={234}
          onBack={() => navigate('handymanServiceDetail')}
        />;
      case 'foodGrocerySelection':
        return <FoodGrocerySelectionScreen 
          onBack={() => navigate('home')}
          onFood={() => navigate('foodVendorsList')}
          onGrocery={() => navigate('groceryVendorsList')}
        />;
      case 'foodVendorsList':
        return <FoodVendorsListScreen 
          onBack={() => navigate('foodGrocerySelection')}
          onVendorSelect={(vendor) => navigate('foodVendorDetail', { selectedFoodVendor: vendor, foodGroceryOrderType: 'food' })}
          onViewProfile={(vendor) => {
            updateAppState({ selectedFoodVendor: vendor });
            navigate('foodVendorProfile');
          }}
        />;
      case 'groceryVendorsList':
        return <GroceryVendorsListScreen 
          onBack={() => navigate('foodGrocerySelection')}
          onVendorSelect={(vendor) => navigate('groceryVendorDetail', { selectedGroceryVendor: vendor, foodGroceryOrderType: 'grocery' })}
          onViewProfile={(vendor) => {
            updateAppState({ selectedGroceryVendor: vendor });
            navigate('groceryVendorProfile');
          }}
        />;
      case 'foodVendorDetail':
        return <FoodVendorDetailScreen 
          vendor={appState.selectedFoodVendor!}
          initialCart={appState.cart}
          onBack={() => navigate('foodVendorsList')}
          onAddToCart={(item) => {
            // Check if cart has items from a different vendor
            if (appState.cart.length > 0 && appState.currentCartVendorId && appState.currentCartVendorId !== appState.selectedFoodVendor?.id) {
              // Navigate to warning screen
              setPendingCartAction({ item, vendor: appState.selectedFoodVendor!, type: 'food' });
              navigate('cartWarningModal');
            } else {
              // Same vendor or empty cart - add item directly
              const cartItem: CartItem = { ...item, quantity: 1 };
              const newCart = [...appState.cart, cartItem];
              updateAppState({ 
                cart: newCart,
                currentCartVendorId: appState.selectedFoodVendor!.id,
                currentCartVendorName: appState.selectedFoodVendor!.name
              });
            }
          }}
          onUpdateCart={(updatedCart) => {
            updateAppState({ cart: updatedCart });
            // If cart is empty, clear vendor tracking
            if (updatedCart.length === 0) {
              updateAppState({ currentCartVendorId: undefined, currentCartVendorName: undefined });
            }
          }}
          onCheckout={() => navigate('foodGroceryCheckout', { foodGroceryOrderType: 'food' })}
          onViewReviews={() => navigate('foodVendorReviews')}
        />;
      case 'foodVendorReviews':
        return <FoodVendorReviewsScreen 
          vendor={appState.selectedFoodVendor!}
          onBack={() => navigate('foodVendorDetail')}
        />;
      case 'groceryVendorDetail':
        return <GroceryVendorDetailScreen 
          vendor={appState.selectedGroceryVendor!}
          initialCart={appState.groceryCart}
          onBack={() => navigate('groceryVendorsList')}
          onAddToCart={(item) => {
            // Check if cart has items from a different vendor
            if (appState.groceryCart.length > 0 && appState.currentCartVendorId && appState.currentCartVendorId !== appState.selectedGroceryVendor?.id) {
              // Navigate to warning screen
              setPendingCartAction({ item, vendor: appState.selectedGroceryVendor!, type: 'grocery' });
              navigate('cartWarningModal');
            } else {
              // Same vendor or empty cart - add item directly
              const cartItem: GroceryCartItem = { ...item, quantity: 1 };
              const newCart = [...appState.groceryCart, cartItem];
              updateAppState({ 
                groceryCart: newCart,
                currentCartVendorId: appState.selectedGroceryVendor!.id,
                currentCartVendorName: appState.selectedGroceryVendor!.name
              });
            }
          }}
          onUpdateCart={(updatedCart) => {
            updateAppState({ groceryCart: updatedCart });
            // If cart is empty, clear vendor tracking
            if (updatedCart.length === 0) {
              updateAppState({ currentCartVendorId: undefined, currentCartVendorName: undefined });
            }
          }}
          onCheckout={() => navigate('foodGroceryCheckout', { foodGroceryOrderType: 'grocery' })}
          onViewReviews={() => navigate('groceryVendorReviews')}
        />;
      case 'groceryVendorReviews':
        return <GroceryVendorReviewsScreen 
          vendor={appState.selectedGroceryVendor!}
          onBack={() => navigate('groceryVendorDetail')}
        />;
      case 'cartWarningModal':
        return <CartWarningModal 
          currentVendorName={appState.currentCartVendorName || ''}
          newVendorName={pendingCartAction?.vendor.name || ''}
          onCancel={() => {
            // Go back to the vendor detail screen
            setPendingCartAction(null);
            if (pendingCartAction?.type === 'food') {
              navigate('foodVendorDetail');
            } else {
              navigate('groceryVendorDetail');
            }
          }}
          onConfirm={() => {
            // Clear existing cart and add new item
            if (pendingCartAction) {
              if (pendingCartAction.type === 'food') {
                updateAppState({ 
                  cart: [{ ...pendingCartAction.item as MenuItem, quantity: 1 }],
                  currentCartVendorId: pendingCartAction.vendor.id,
                  currentCartVendorName: pendingCartAction.vendor.name
                });
                setPendingCartAction(null);
                navigate('foodVendorDetail');
              } else {
                updateAppState({ 
                  groceryCart: [{ ...pendingCartAction.item as GroceryItem, quantity: 1 }],
                  currentCartVendorId: pendingCartAction.vendor.id,
                  currentCartVendorName: pendingCartAction.vendor.name
                });
                setPendingCartAction(null);
                navigate('groceryVendorDetail');
              }
            }
          }}
        />;
      case 'foodGroceryCheckout':
        return <FoodGroceryCheckoutScreen 
          cart={appState.foodGroceryOrderType === 'food' ? appState.cart : appState.groceryCart}
          vendor={appState.foodGroceryOrderType === 'food' ? appState.selectedFoodVendor! : appState.selectedGroceryVendor!}
          orderType={appState.foodGroceryOrderType!}
          addresses={appState.addresses}
          paymentCards={appState.paymentCards}
          onBack={() => {
            if (appState.foodGroceryOrderType === 'food') {
              navigate('foodVendorDetail');
            } else if (appState.selectedBeautyProductVendor) {
              // Coming from beauty products
              navigate('beautyProductsCatalog');
            } else {
              navigate('groceryVendorDetail');
            }
          }}
          onAddAddress={() => navigate('addAddress', { previousScreen: 'foodGroceryCheckout' })}
          onAddPaymentCard={() => navigate('addPaymentCard')}
          onProceedToPayment={(orderData) => {
            // Store the pending order data
            updateAppState({ pendingFoodGroceryOrder: orderData });
            navigate('foodGroceryConfirmation');
          }}
        />;
      case 'foodGroceryConfirmation':
        return <FoodGroceryConfirmationScreen 
          orderData={appState.pendingFoodGroceryOrder!}
          addresses={appState.addresses}
          paymentCards={appState.paymentCards}
          onBack={() => navigate('foodGroceryCheckout')}
          onChangeAddress={() => navigate('savedAddresses')}
          onChangePayment={() => navigate('paymentMethods')}
          onOrderPlaced={(orderData) => {
            // Create a new order and add to bookings
            const isBeautyProducts = appState.selectedBeautyProductVendor !== undefined;
            const newOrder = {
              id: Date.now(),
              type: isBeautyProducts ? 'beauty-products' : (appState.foodGroceryOrderType === 'food' ? 'food' : 'grocery'),
              service: isBeautyProducts ? 'Beauty Products Order' : `${appState.foodGroceryOrderType === 'food' ? 'Food' : 'Grocery'} Order`,
              vendor: orderData.vendorName,
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
              address: orderData.address ? (typeof orderData.address === 'string' ? orderData.address : `${orderData.address.street}, ${orderData.address.city}`) : 'N/A',
              status: 'accepted',
              price: `$${orderData.total.toFixed(2)}`,
              category: isBeautyProducts ? 'Beauty Services and Products' : 'Groceries & Food',
              items: orderData.items,
              hasReview: false
            };
            
            updateAppState({ 
              bookings: [...appState.bookings, newOrder],
              cart: [],
              groceryCart: [],
              beautyProductsCart: [],
              currentCartVendorId: undefined,
              pendingFoodGroceryOrder: undefined,
              selectedBeautyProductVendor: undefined
            });
            
            // Navigate to home
            navigate('home');
          }}
        />;
      case 'foodGroceryOrderTracking':
        return <FoodGroceryOrderTrackingScreen 
          order={appState.selectedBooking}
          onBack={() => navigate('myBookings')}
          onReorder={() => {
            // Pre-fill cart with order items and navigate to checkout
            const booking = appState.selectedBooking;
            
            if (booking.type === 'food') {
              // Convert order items to cart items
              const cartItems: CartItem[] = booking.items.map(item => ({
                id: item.id,
                name: item.name,
                description: '',
                price: item.price,
                category: 'Main Course',
                quantity: item.quantity
              }));
              
              // Update state with pre-filled cart
              updateAppState({ 
                cart: cartItems,
                currentCartVendorId: booking.vendor,
                selectedFoodVendor: {
                  id: 1,
                  name: booking.vendor,
                  cuisine: 'Restaurant',
                  rating: 4.5,
                  deliveryTime: '30-40 min',
                  deliveryFee: '$2.99',
                  minOrder: '$10.00'
                }
              });
              
              // Navigate to checkout
              navigate('foodGroceryCheckout');
            } else if (booking.type === 'beauty-products') {
              // Convert order items to grocery cart items (reuse grocery flow for beauty products)
              const groceryCartItems: GroceryCartItem[] = booking.items.map(item => ({
                id: item.id,
                name: item.name,
                category: item.category || 'Beauty',
                price: item.price,
                unit: item.size || 'each',
                quantity: item.quantity
              }));
              
              // Update state with pre-filled grocery cart and set beauty vendor
              updateAppState({ 
                groceryCart: groceryCartItems,
                currentCartVendorId: booking.vendor,
                selectedGroceryVendor: {
                  id: 1,
                  name: booking.vendor,
                  category: 'Beauty Products',
                  rating: 4.5,
                  deliveryTime: '30-40 min',
                  deliveryFee: '$2.99',
                  minOrder: '$15.00'
                },
                selectedBeautyProductVendor: {
                  id: 1,
                  name: booking.vendor,
                  category: 'Beauty Products',
                  rating: 4.5,
                  deliveryTime: '30-40 min',
                  deliveryFee: '$2.99',
                  minOrder: '$15.00'
                }
              });
              
              // Navigate to checkout
              navigate('foodGroceryCheckout');
            } else {
              // Convert order items to grocery cart items
              const groceryCartItems: GroceryCartItem[] = booking.items.map(item => ({
                id: item.id,
                name: item.name,
                category: 'Grocery',
                price: item.price,
                unit: 'each',
                quantity: item.quantity
              }));
              
              // Update state with pre-filled grocery cart
              updateAppState({ 
                groceryCart: groceryCartItems,
                currentCartVendorId: booking.vendor,
                selectedGroceryVendor: {
                  id: 1,
                  name: booking.vendor,
                  category: 'Grocery Store',
                  rating: 4.5,
                  deliveryTime: '30-40 min',
                  deliveryFee: '$2.99',
                  minOrder: '$10.00'
                }
              });
              
              // Navigate to checkout
              navigate('foodGroceryCheckout');
            }
          }}
          onReview={() => {
            // Navigate to review submission for food/grocery
            navigate('reviewSubmission');
          }}
        />;
      case 'beautyChoice':
        return <BeautyChoiceScreen 
          onBack={() => navigate('home')}
          onSelectServices={() => navigate('beautyServicesVendorsList')}
          onSelectProducts={() => navigate('beautyProductsVendorsList')}
        />;
      case 'beautyServicesVendorsList':
        return <BeautyServicesVendorsList 
          onBack={() => navigate('beautyChoice')}
          onSelectProvider={(provider) => {
            updateAppState({ selectedBeautyServiceProvider: provider });
            navigate('beautyServicesList');
          }}
          onViewProfile={(provider) => {
            updateAppState({ selectedBeautyServiceProvider: provider });
            navigate('beautyProviderProfile');
          }}
        />;
      case 'beautyServicesList':
        return <BeautyServicesList 
          providerName={appState.selectedBeautyServiceProvider?.name || 'Beauty Provider'}
          onBack={() => navigate('beautyServicesVendorsList')}
          onSelectService={(service) => {
            updateAppState({ selectedBeautyService: service });
            navigate('beautyServiceDetail');
          }}
        />;
      case 'beautyServiceDetail':
        return <BeautyServiceDetailScreen 
          service={appState.selectedBeautyService}
          provider={{
            name: appState.selectedBeautyServiceProvider?.name || 'Beauty Provider',
            rating: 4.9,
            reviewCount: '156',
            isPoweredByDoHuub: true
          }}
          onBack={() => navigate('beautyServicesList')}
          onBookService={() => {
            navigate('beautyServicesBooking');
          }}
          onViewAllReviews={() => {
            navigate('beautyServiceReviews');
          }}
        />;
      case 'beautyServicesBooking':
        return <BeautyServiceBookingScreen 
          service={appState.selectedBeautyService}
          providerName={appState.selectedBeautyServiceProvider?.name || 'Beauty Provider'}
          onBack={() => navigate('beautyServiceDetail')}
          onConfirmBooking={(bookingData) => {
            updateAppState({ 
              beautyBookingData: bookingData,
              currentBookingType: 'beauty'
            });
            navigate('paymentProcessing');
          }}
          addresses={appState.addresses}
          paymentCards={appState.paymentCards}
          onAddPaymentCard={() => navigate('addPaymentCard', { previousScreen: 'beautyServicesBooking' })}
        />;
      case 'beautyServicesConfirmation':
        return <BeautyServiceConfirmationScreen 
          bookingData={appState.beautyBookingData!}
          onTrackOrder={() => {
            // Navigate to bookings tab and show tracking
            navigate('myBookings');
            // Use setTimeout to allow the bookings screen to render first
            setTimeout(() => {
              navigate('orderTracking');
            }, 100);
          }}
          onHome={() => navigate('home')}
        />;
      case 'beautyProductsVendorsList':
        return <BeautyProductsVendorsList 
          onBack={() => navigate('beautyChoice')}
          onSelectVendor={(vendor) => {
            updateAppState({ selectedBeautyProductVendor: vendor });
            navigate('beautyProductsCatalog');
          }}
          onViewProfile={(vendor) => {
            updateAppState({ selectedBeautyProductVendor: vendor });
            navigate('beautyProductsVendorProfile');
          }}
          cartItemCount={appState.beautyProductsCart.reduce((sum, item) => sum + item.quantity, 0)}
          onViewCart={() => {
            // Navigate to checkout with beauty products
            updateAppState({
              foodGroceryOrderType: 'grocery', // Reuse grocery checkout logic
              groceryCart: appState.beautyProductsCart.map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price,
                unit: item.size,
                quantity: item.quantity
              })),
              selectedGroceryVendor: {
                id: appState.selectedBeautyProductVendor?.id || 1,
                name: appState.selectedBeautyProductVendor?.name || 'Beauty Store',
                category: 'Beauty Products',
                rating: appState.selectedBeautyProductVendor?.rating || 4.5,
                deliveryTime: appState.selectedBeautyProductVendor?.deliveryTime || '30-40 min',
                deliveryFee: appState.selectedBeautyProductVendor?.deliveryFee || '$2.99',
                minOrder: appState.selectedBeautyProductVendor?.minOrder || '$15.00'
              }
            });
            navigate('foodGroceryCheckout');
          }}
        />;
      case 'beautyProductsCatalog':
        return <BeautyProductsCatalog 
          vendorName={appState.selectedBeautyProductVendor?.name || 'Beauty Store'}
          onBack={() => navigate('beautyProductsVendorsList')}
          onAddToCart={(product) => {
            const existingItem = appState.beautyProductsCart.find(item => item.id === product.id);
            if (existingItem) {
              updateAppState({
                beautyProductsCart: appState.beautyProductsCart.map(item =>
                  item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
              });
            } else {
              updateAppState({
                beautyProductsCart: [
                  ...appState.beautyProductsCart,
                  { ...product, quantity: 1 }
                ]
              });
            }
          }}
          onRemoveFromCart={(productId) => {
            const existingItem = appState.beautyProductsCart.find(item => item.id === productId);
            if (existingItem && existingItem.quantity > 1) {
              updateAppState({
                beautyProductsCart: appState.beautyProductsCart.map(item =>
                  item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
              });
            } else {
              updateAppState({
                beautyProductsCart: appState.beautyProductsCart.filter(item => item.id !== productId)
              });
            }
          }}
          cartItems={appState.beautyProductsCart.map(item => ({ id: item.id, quantity: item.quantity }))}
          onViewCart={() => {
            // Navigate to checkout with beauty products
            updateAppState({
              foodGroceryOrderType: 'grocery', // Reuse grocery checkout logic
              groceryCart: appState.beautyProductsCart.map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price,
                unit: item.size,
                quantity: item.quantity
              })),
              selectedGroceryVendor: {
                id: appState.selectedBeautyProductVendor?.id || 1,
                name: appState.selectedBeautyProductVendor?.name || 'Beauty Store',
                category: 'Beauty Products',
                rating: appState.selectedBeautyProductVendor?.rating || 4.5,
                deliveryTime: appState.selectedBeautyProductVendor?.deliveryTime || '30-40 min',
                deliveryFee: appState.selectedBeautyProductVendor?.deliveryFee || '$2.99',
                minOrder: appState.selectedBeautyProductVendor?.minOrder || '$15.00'
              }
            });
            navigate('foodGroceryCheckout');
          }}
        />;
      case 'rentalPropertiesList':
        return <RentalPropertiesListScreen 
          properties={appState.properties}
          onBack={() => navigate('home')}
          onPropertySelect={(property) => {
            updateAppState({ selectedProperty: property });
            navigate('propertyDetail');
          }}
        />;
      case 'propertyDetail':
        return <PropertyDetailScreen 
          property={appState.selectedProperty!}
          onBack={() => navigate('rentalPropertiesList')}
          onCheckAvailability={() => navigate('propertyCalendar')}
          onViewHostProfile={() => navigate('hostProfile')}
        />;
      case 'propertyCalendar':
        return <PropertyCalendarScreen 
          onBack={() => navigate('propertyDetail')}
          onContinue={(checkIn, checkOut, duration) => {
            updateAppState({
              propertyCheckInDate: checkIn,
              propertyCheckOutDate: checkOut,
              propertyDuration: duration
            });
            navigate('propertyStayDetails');
          }}
        />;
      case 'propertyStayDetails':
        return <PropertyStayDetailsScreen 
          property={appState.selectedProperty!}
          checkInDate={appState.propertyCheckInDate!}
          checkOutDate={appState.propertyCheckOutDate!}
          duration={appState.propertyDuration!}
          onBack={() => navigate('propertyCalendar')}
          onContinue={(guests, specialRequests, totalPrice) => {
            updateAppState({
              propertyGuests: guests,
              propertySpecialRequests: specialRequests,
              propertyTotalPrice: totalPrice
            });
            navigate('propertyBooking');
          }}
        />;
      case 'propertyBooking':
        return <PropertyBookingScreen 
          property={appState.selectedProperty!}
          checkInDate={appState.propertyCheckInDate!}
          checkOutDate={appState.propertyCheckOutDate!}
          duration={appState.propertyDuration!}
          guests={appState.propertyGuests!}
          specialRequests={appState.propertySpecialRequests!}
          totalPrice={appState.propertyTotalPrice!}
          addresses={appState.addresses}
          paymentCards={appState.paymentCards}
          onBack={() => navigate('propertyStayDetails')}
          onAddAddress={() => navigate('addAddress', { previousScreen: 'propertyBooking' })}
          onAddPaymentCard={() => navigate('addPaymentCard', { previousScreen: 'propertyBooking' })}
          onConfirm={(bookingData) => {
            updateAppState({ 
              propertyBookingData: bookingData,
              currentBookingType: 'rental'
            });
            navigate('paymentProcessing');
            
            setTimeout(() => {
              const newBooking = {
                id: Date.now(),
                type: 'rental',
                service: bookingData.property.name,
                vendor: bookingData.property.isPoweredByDoHuub ? 'DoHuub Properties' : 'Property Rental',
                date: bookingData.checkInDate,
                time: '3:00 PM',
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                duration: bookingData.duration,
                guests: bookingData.guests,
                address: `${bookingData.address.street}, ${bookingData.address.city}`,
                status: 'accepted',
                price: `$${bookingData.totalPrice}`,
                category: 'Rental Properties',
                hasReview: false,
                referenceNumber: bookingData.referenceNumber,
                propertyType: bookingData.property.propertyType,
                bedrooms: bookingData.property.bedrooms,
                bathrooms: bookingData.property.bathrooms,
                isPoweredByDoHuub: bookingData.property.isPoweredByDoHuub,
                specialRequests: bookingData.specialRequests,
                property: bookingData.property
              };
              
              updateAppState({ 
                bookings: [...appState.bookings, newBooking],
                selectedBooking: newBooking
              });
              
              navigate('propertyConfirmation');
            }, 2000);
          }}
        />;
      case 'propertyConfirmation':
        return <PropertyConfirmationScreen 
          bookingData={appState.propertyBookingData!}
          onTrackOrder={() => {
            navigate('orderTracking');
          }}
          onHome={() => navigate('home')}
        />;
      case 'caregivingChoice':
        return <CaregivingChoiceScreen 
          onBack={() => navigate('home')}
          onSelectRideAssistance={() => {
            updateAppState({ caregivingServiceType: 'ride' });
            navigate('rideProvidersList');
          }}
          onSelectCompanionship={() => {
            updateAppState({ caregivingServiceType: 'companionship' });
            navigate('companionsList');
          }}
        />;
      case 'rideProvidersList':
        return <RideProvidersListScreen 
          onBack={() => navigate('caregivingChoice')}
          onSelectProvider={(provider) => {
            updateAppState({ selectedRideProvider: provider });
            navigate('rideProviderDetail');
          }}
        />;
      case 'rideProviderDetail':
        return <RideProviderDetailScreen 
          provider={appState.selectedRideProvider!}
          onBack={() => navigate('rideProvidersList')}
          onBookRide={() => navigate('rideBookingForm')}
          onViewAllReviews={() => navigate('rideProviderReviews')}
        />;
      case 'rideBookingForm':
        return <RideBookingFormScreen 
          provider={appState.selectedRideProvider!}
          savedAddresses={appState.addresses}
          paymentMethods={appState.paymentCards}
          onBack={() => navigate('rideProviderDetail')}
          onConfirmBooking={(bookingData) => {
            updateAppState({ caregivingBookingData: bookingData });
            navigate('paymentProcessing');
            
            setTimeout(() => {
              const newBooking = {
                id: Date.now(),
                type: 'caregiving-ride',
                service: `Ride Service - ${bookingData.provider.name}`,
                vendor: bookingData.provider.name,
                date: bookingData.date,
                time: bookingData.time,
                duration: `${bookingData.duration} hours`,
                address: `${bookingData.pickupAddress.street}, ${bookingData.pickupAddress.city}`,
                status: 'accepted',
                price: `$${bookingData.total}`,
                category: 'Caregiving Services',
                hasReview: false,
                stops: bookingData.stops,
                isRoundTrip: bookingData.isRoundTrip,
                returnTime: bookingData.returnTime,
                vehicleType: bookingData.vehicleType,
                passengers: bookingData.passengers,
                specialRequests: bookingData.specialRequests,
                paymentMethod: `${bookingData.paymentMethod.type} •••• ${bookingData.paymentMethod.last4}`
              };
              
              updateAppState({ 
                bookings: [...appState.bookings, newBooking],
                selectedBooking: newBooking
              });
              
              navigate('caregivingConfirmation');
            }, 2000);
          }}
        />;
      case 'companionsList':
        return <CompanionsListScreen 
          onBack={() => navigate('caregivingChoice')}
          onSelectCompanion={(companion) => {
            updateAppState({ selectedCompanion: companion });
            navigate('companionDetail');
          }}
        />;
      case 'companionDetail':
        return <CompanionDetailScreen 
          companion={appState.selectedCompanion!}
          onBack={() => navigate('companionsList')}
          onBookCompanion={() => navigate('companionshipBookingForm')}
          onViewAllReviews={() => navigate('companionReviews')}
        />;
      case 'companionshipBookingForm':
        return <CompanionshipBookingFormScreen 
          companion={appState.selectedCompanion!}
          savedAddresses={appState.addresses}
          paymentMethods={appState.paymentCards}
          onBack={() => navigate('companionDetail')}
          onConfirmBooking={(bookingData) => {
            updateAppState({ caregivingBookingData: bookingData });
            navigate('paymentProcessing');
            
            setTimeout(() => {
              const newBooking = {
                id: Date.now(),
                type: 'caregiving-companionship',
                service: `Companionship with ${bookingData.companion.name}`,
                vendor: bookingData.companion.name,
                date: bookingData.date,
                time: bookingData.time,
                duration: `${bookingData.duration} hours`,
                address: `${bookingData.serviceLocation.street}, ${bookingData.serviceLocation.city}`,
                status: 'accepted',
                price: `$${bookingData.total}`,
                category: 'Caregiving Services',
                hasReview: false,
                supportTypes: bookingData.supportTypes,
                specialRequests: bookingData.specialRequests,
                paymentMethod: `${bookingData.paymentMethod.type} •••• ${bookingData.paymentMethod.last4}`,
                companionYearsExperience: bookingData.companion.yearsExperience
              };
              
              updateAppState({ 
                bookings: [...appState.bookings, newBooking],
                selectedBooking: newBooking
              });
              
              navigate('caregivingConfirmation');
            }, 2000);
          }}
        />;
      case 'caregivingConfirmation':
        return <CaregivingConfirmationScreen 
          serviceType={appState.caregivingServiceType!}
          bookingData={appState.caregivingBookingData!}
          onViewTracking={() => navigate('caregivingOrderTracking')}
          onBackToHome={() => navigate('home')}
        />;
      case 'caregivingOrderTracking':
        return <CaregivingOrderTrackingScreen 
          serviceType={appState.caregivingServiceType!}
          bookingData={appState.caregivingBookingData!}
          onBack={() => navigate('home')}
        />;
      case 'cleaningVendorProfile':
        return <CleaningVendorProfileScreen 
          vendor={appState.selectedVendor!}
          onBack={() => navigate('vendorDetail')}
          onViewAllReviews={() => navigate('cleaningServiceReviews')}
          onSelectService={(service) => {
            updateAppState({ selectedCleaningService: service });
            navigate('cleaningServiceDetail');
          }}
        />;
      case 'handymanVendorProfile':
        return <HandymanVendorProfileScreen 
          vendor={appState.selectedHandymanVendor!}
          onBack={() => navigate('handymanVendorDetail')}
          onViewAllReviews={() => navigate('handymanServiceReviews')}
          onSelectService={(service) => {
            updateAppState({ selectedHandymanService: service });
            navigate('handymanServiceDetail');
          }}
        />;
      case 'foodVendorProfile':
        return <FoodVendorProfileScreen 
          vendor={appState.selectedFoodVendor!}
          onBack={() => navigate('foodVendorsList')}
          onViewMenu={() => {
            // Navigate to food vendor detail to see menu
            const vendor = appState.selectedFoodVendor!;
            navigate('foodVendorDetail', { 
              selectedFoodVendor: vendor
            });
          }}
          onViewAllReviews={() => {
            navigate('foodVendorReviews');
          }}
        />;
      case 'groceryVendorProfile':
        return <GroceryVendorProfileScreen 
          vendor={appState.selectedGroceryVendor!}
          onBack={() => navigate('groceryVendorsList')}
          onViewStore={() => {
            // Navigate to grocery vendor detail to see products
            const vendor = appState.selectedGroceryVendor!;
            navigate('groceryVendorDetail', { 
              selectedGroceryVendor: vendor
            });
          }}
          onViewAllReviews={() => {
            navigate('groceryVendorReviews');
          }}
        />;
      case 'beautyProviderProfile':
        return <BeautyProviderProfileScreen 
          provider={appState.selectedBeautyServiceProvider!}
          onBack={() => navigate('beautyServicesVendorsList')}
          onViewServices={() => navigate('beautyServicesList')}
          onViewAllReviews={() => {
            navigate('beautyProviderReviews');
          }}
        />;
      case 'beautyProductsVendorProfile':
        return <BeautyProductsVendorProfileScreen 
          vendor={appState.selectedBeautyProductVendor!}
          onBack={() => navigate('beautyProductsVendorsList')}
          onViewStore={() => navigate('beautyProductsCatalog')}
          onViewAllReviews={() => {
            navigate('beautyProductsVendorReviews');
          }}
        />;
      case 'hostProfile':
        return <HostProfileScreen 
          property={appState.selectedProperty!}
          onBack={() => navigate('propertyDetail')}
          onSelectProperty={(property) => {
            updateAppState({ selectedProperty: property });
            navigate('propertyDetail');
          }}
          onViewAllReviews={() => {
            navigate('hostReviews');
          }}
        />;
      case 'foodVendorReviews':
        return <VendorReviewsScreen 
          vendorName={appState.selectedFoodVendor?.name || 'Food Vendor'}
          overallRating={appState.selectedFoodVendor?.rating || 4.8}
          totalReviews={234}
          onBack={() => navigate('foodVendorProfile')}
        />;
      case 'groceryVendorReviews':
        return <VendorReviewsScreen 
          vendorName={appState.selectedGroceryVendor?.name || 'Grocery Vendor'}
          overallRating={appState.selectedGroceryVendor?.rating || 4.8}
          totalReviews={234}
          onBack={() => navigate('groceryVendorProfile')}
        />;
      case 'beautyProviderReviews':
        return <VendorReviewsScreen 
          vendorName={appState.selectedBeautyServiceProvider?.name || 'Beauty Provider'}
          overallRating={appState.selectedBeautyServiceProvider?.rating || 4.8}
          totalReviews={234}
          onBack={() => navigate('beautyProviderProfile')}
        />;
      case 'beautyProductsVendorReviews':
        return <VendorReviewsScreen 
          vendorName={appState.selectedBeautyProductVendor?.name || 'Beauty Store'}
          overallRating={appState.selectedBeautyProductVendor?.rating || 4.8}
          totalReviews={234}
          onBack={() => navigate('beautyProductsVendorProfile')}
        />;
      case 'hostReviews':
        return <VendorReviewsScreen 
          vendorName={appState.selectedProperty?.host || 'Property Host'}
          overallRating={appState.selectedProperty?.rating || 4.8}
          totalReviews={234}
          onBack={() => navigate('hostProfile')}
        />;
      case 'companionReviews':
        return <VendorReviewsScreen 
          vendorName={appState.selectedCompanion?.name || 'Companion'}
          overallRating={appState.selectedCompanion?.rating || 4.8}
          totalReviews={234}
          onBack={() => navigate('companionDetail')}
        />;
      case 'rideProviderReviews':
        return <VendorReviewsScreen 
          vendorName={appState.selectedRideProvider?.name || 'Ride Provider'}
          overallRating={appState.selectedRideProvider?.rating || 4.8}
          totalReviews={234}
          onBack={() => navigate('rideProviderDetail')}
        />;
      default:
        return <SplashScreen onComplete={() => navigate('locationPermission')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[430px] h-[932px] bg-gray-50 relative overflow-hidden border-4 border-gray-800 rounded-[3rem] shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-800 rounded-b-3xl z-50"></div>
        <div className="w-full h-full overflow-y-auto pt-8">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}