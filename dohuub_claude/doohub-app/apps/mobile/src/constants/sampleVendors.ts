/**
 * Sample vendor data for all 6 service categories.
 * Used as fallback when no real vendors exist in the database yet.
 * Vendors will add their own data when the app goes live.
 */
import { SERVICE_IMAGES } from './serviceImages';

// ─── Shared types ────────────────────────────────────────────────
export interface SampleVendor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  description: string;
  tagline: string;
  isPoweredByDoHuub: boolean;
  imageUrl: string;
  images: string[];
  startingPrice: number;
  priceUnit: string;
  distance: string;
  availability: string;
  services: SampleService[];
  reviews: SampleReview[];
}

export interface SampleService {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface SampleReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// ─── Reusable review pools ───────────────────────────────────────
const cleaningReviews: SampleReview[] = [
  { id: 'r1', userName: 'John D.', rating: 5, comment: 'Excellent service! Very thorough and professional. My home has never looked better.', date: '2 days ago' },
  { id: 'r2', userName: 'Sarah M.', rating: 5, comment: 'Highly recommend! The team was punctual and did an amazing job.', date: '1 week ago' },
  { id: 'r3', userName: 'Michael R.', rating: 4, comment: 'Good service overall. Would use again.', date: '2 weeks ago' },
];

const handymanReviews: SampleReview[] = [
  { id: 'r1', userName: 'David K.', rating: 5, comment: 'Fixed my leaky faucet and patched drywall in under 2 hours. Very professional!', date: '3 days ago' },
  { id: 'r2', userName: 'Lisa T.', rating: 5, comment: 'Assembled all my IKEA furniture perfectly. Great attention to detail.', date: '1 week ago' },
  { id: 'r3', userName: 'Robert H.', rating: 4, comment: 'Reliable and skilled. Fair pricing too.', date: '2 weeks ago' },
];

const beautyReviews: SampleReview[] = [
  { id: 'r1', userName: 'Emma W.', rating: 5, comment: 'Best bridal makeup I could have asked for! Looked stunning all day.', date: '4 days ago' },
  { id: 'r2', userName: 'Priya S.', rating: 5, comment: 'My hair color came out exactly as I wanted. Will be back!', date: '1 week ago' },
  { id: 'r3', userName: 'Olivia P.', rating: 4, comment: 'Great facial treatment. Skin feels refreshed.', date: '2 weeks ago' },
];

const groceryReviews: SampleReview[] = [
  { id: 'r1', userName: 'James L.', rating: 5, comment: 'Fresh produce and fast delivery. My go-to grocery store now!', date: '1 day ago' },
  { id: 'r2', userName: 'Maria C.', rating: 5, comment: 'Great selection and everything arrived in perfect condition.', date: '5 days ago' },
  { id: 'r3', userName: 'Tom B.', rating: 4, comment: 'Good variety but delivery took a bit longer than expected.', date: '1 week ago' },
];

const rentalReviews: SampleReview[] = [
  { id: 'r1', userName: 'Anna R.', rating: 5, comment: 'Beautiful property, exactly as shown. Host was very responsive.', date: '3 days ago' },
  { id: 'r2', userName: 'Chris M.', rating: 5, comment: 'Spotless apartment with amazing views. Would stay again!', date: '1 week ago' },
  { id: 'r3', userName: 'Jennifer K.', rating: 4, comment: 'Nice place, great location. Minor issue with AC but host fixed it quickly.', date: '2 weeks ago' },
];

const caregivingReviews: SampleReview[] = [
  { id: 'r1', userName: 'Patricia H.', rating: 5, comment: 'So grateful for the wonderful care my mother received. Very compassionate.', date: '2 days ago' },
  { id: 'r2', userName: 'George M.', rating: 5, comment: 'Reliable, professional, and kind. My dad loves his companion.', date: '1 week ago' },
  { id: 'r3', userName: 'Betty S.', rating: 4, comment: 'Good service, very patient with my elderly father.', date: '2 weeks ago' },
];

// ─── CLEANING ────────────────────────────────────────────────────
export const SAMPLE_CLEANING_VENDORS: SampleVendor[] = [
  {
    id: 'sample-cleaning-1',
    name: 'DoHuub Official Store',
    rating: 4.9,
    reviewCount: 342,
    description: 'Professional cleaning services for homes and offices. Our trained team uses eco-friendly products and state-of-the-art equipment to deliver spotless results every time.',
    tagline: 'Professional cleaning services for homes and offices',
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.cleaning[0],
    images: SERVICE_IMAGES.cleaning,
    startingPrice: 75,
    priceUnit: '/service',
    distance: '0.3 mi',
    availability: 'Mon-Sat, 7AM - 8PM',
    services: [
      { id: 's1', name: 'Standard Home Cleaning', price: 75, duration: '2-3 hours' },
      { id: 's2', name: 'Deep Cleaning', price: 150, duration: '4-5 hours' },
      { id: 's3', name: 'Move-In/Out Cleaning', price: 200, duration: '5-6 hours' },
      { id: 's4', name: 'Office Cleaning', price: 120, duration: '3-4 hours' },
    ],
    reviews: cleaningReviews,
  },
  {
    id: 'sample-cleaning-2',
    name: 'Sparkle & Shine',
    rating: 4.8,
    reviewCount: 256,
    description: 'Eco-friendly cleaning solutions using only plant-based, non-toxic products. Safe for kids, pets, and the planet.',
    tagline: 'Eco-friendly cleaning solutions',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.cleaning[1],
    images: SERVICE_IMAGES.cleaning,
    startingPrice: 85,
    priceUnit: '/service',
    distance: '1.2 mi',
    availability: 'Mon-Fri, 8AM - 6PM',
    services: [
      { id: 's1', name: 'Green Home Cleaning', price: 85, duration: '2-3 hours' },
      { id: 's2', name: 'Eco Deep Clean', price: 160, duration: '4-5 hours' },
      { id: 's3', name: 'Carpet & Upholstery', price: 110, duration: '2-3 hours' },
    ],
    reviews: [cleaningReviews[1], cleaningReviews[2]],
  },
  {
    id: 'sample-cleaning-3',
    name: 'Clean Pro Services',
    rating: 4.7,
    reviewCount: 189,
    description: 'Residential and commercial cleaning experts with 10+ years of experience. Satisfaction guaranteed or your money back.',
    tagline: 'Residential and commercial cleaning experts',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.cleaning[2],
    images: SERVICE_IMAGES.cleaning,
    startingPrice: 70,
    priceUnit: '/service',
    distance: '0.8 mi',
    availability: 'Mon-Sat, 8AM - 7PM',
    services: [
      { id: 's1', name: 'Basic Cleaning', price: 70, duration: '2 hours' },
      { id: 's2', name: 'Premium Cleaning', price: 130, duration: '3-4 hours' },
      { id: 's3', name: 'Window Cleaning', price: 90, duration: '2 hours' },
    ],
    reviews: [cleaningReviews[0], cleaningReviews[2]],
  },
  {
    id: 'sample-cleaning-4',
    name: 'Perfect Touch Cleaners',
    rating: 4.6,
    reviewCount: 145,
    description: 'Deep cleaning specialists focusing on kitchens, bathrooms, and high-traffic areas. We make your space shine!',
    tagline: 'Deep cleaning specialists',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.cleaning[3],
    images: SERVICE_IMAGES.cleaning,
    startingPrice: 90,
    priceUnit: '/service',
    distance: '1.5 mi',
    availability: 'Tue-Sun, 9AM - 6PM',
    services: [
      { id: 's1', name: 'Kitchen Deep Clean', price: 90, duration: '2-3 hours' },
      { id: 's2', name: 'Bathroom Sanitization', price: 80, duration: '1-2 hours' },
      { id: 's3', name: 'Full House Deep Clean', price: 180, duration: '5-6 hours' },
    ],
    reviews: [cleaningReviews[2]],
  },
];

// ─── HANDYMAN ────────────────────────────────────────────────────
export const SAMPLE_HANDYMAN_VENDORS: SampleVendor[] = [
  {
    id: 'sample-handyman-1',
    name: 'DoHuub Official',
    rating: 4.9,
    reviewCount: 1247,
    description: 'Trusted, verified handyman services across all categories. Our professionals are background-checked and insured.',
    tagline: 'Trusted, verified handyman services across all categories',
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.handyman[0],
    images: SERVICE_IMAGES.handyman,
    startingPrice: 65,
    priceUnit: '/hour',
    distance: '0.3 mi',
    availability: 'Mon-Sat, 7AM - 8PM',
    services: [
      { id: 's1', name: 'General Repairs', price: 65, duration: 'Per hour' },
      { id: 's2', name: 'Electrical Work', price: 85, duration: 'Per hour' },
      { id: 's3', name: 'Plumbing Repairs', price: 80, duration: 'Per hour' },
      { id: 's4', name: 'Furniture Assembly', price: 55, duration: 'Per hour' },
    ],
    reviews: handymanReviews,
  },
  {
    id: 'sample-handyman-2',
    name: 'The Handyman Hub',
    rating: 4.9,
    reviewCount: 401,
    description: 'One-stop solution for all home repair needs with 15+ years experience. No job too big or too small.',
    tagline: 'One-stop solution for all home repair needs',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.handyman[1],
    images: SERVICE_IMAGES.handyman,
    startingPrice: 70,
    priceUnit: '/hour',
    distance: '0.9 mi',
    availability: 'Mon-Fri, 8AM - 7PM',
    services: [
      { id: 's1', name: 'Home Repairs', price: 70, duration: 'Per hour' },
      { id: 's2', name: 'Painting', price: 60, duration: 'Per hour' },
      { id: 's3', name: 'Drywall Repair', price: 75, duration: 'Per hour' },
    ],
    reviews: [handymanReviews[0], handymanReviews[2]],
  },
  {
    id: 'sample-handyman-3',
    name: 'Home Repair Masters',
    rating: 4.8,
    reviewCount: 256,
    description: 'Specializes in general repairs, painting, and furniture assembly. Quality craftsmanship at competitive prices.',
    tagline: 'General repairs, painting, and furniture assembly',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.handyman[2],
    images: SERVICE_IMAGES.handyman,
    startingPrice: 55,
    priceUnit: '/hour',
    distance: '1.1 mi',
    availability: 'Mon-Sat, 8AM - 6PM',
    services: [
      { id: 's1', name: 'Furniture Assembly', price: 55, duration: 'Per hour' },
      { id: 's2', name: 'Interior Painting', price: 65, duration: 'Per hour' },
      { id: 's3', name: 'Shelf & Mount Installation', price: 60, duration: 'Per hour' },
    ],
    reviews: [handymanReviews[1], handymanReviews[2]],
  },
  {
    id: 'sample-handyman-4',
    name: 'Quick Fix Services',
    rating: 4.7,
    reviewCount: 189,
    description: 'Fast and efficient solutions for appliance repairs and installations. Same-day service available.',
    tagline: 'Fast and efficient appliance repairs',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.handyman[3],
    images: SERVICE_IMAGES.handyman,
    startingPrice: 60,
    priceUnit: '/hour',
    distance: '1.4 mi',
    availability: 'Mon-Sun, 8AM - 9PM',
    services: [
      { id: 's1', name: 'Appliance Repair', price: 60, duration: 'Per hour' },
      { id: 's2', name: 'Installation Services', price: 70, duration: 'Per hour' },
      { id: 's3', name: 'Emergency Repairs', price: 95, duration: 'Per hour' },
    ],
    reviews: [handymanReviews[0]],
  },
];

// ─── BEAUTY ──────────────────────────────────────────────────────
export const SAMPLE_BEAUTY_VENDORS: SampleVendor[] = [
  {
    id: 'sample-beauty-1',
    name: 'Beauty on DE Run',
    rating: 4.9,
    reviewCount: 1250,
    description: 'Full-service beauty studio offering makeup, hairstyling, skincare, nail art, and spa services. Our certified professionals bring luxury to your doorstep.',
    tagline: 'Makeup, Hairstyling, Skincare, Nail Art, Spa Services',
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.beauty[0],
    images: SERVICE_IMAGES.beauty,
    startingPrice: 45,
    priceUnit: '/service',
    distance: '0.4 mi',
    availability: 'Mon-Sun, 9AM - 9PM',
    services: [
      { id: 's1', name: 'Professional Makeup', price: 65, duration: '1-2 hours' },
      { id: 's2', name: 'Hairstyling', price: 45, duration: '1 hour' },
      { id: 's3', name: 'Facial Treatment', price: 80, duration: '1 hour' },
      { id: 's4', name: 'Manicure & Pedicure', price: 55, duration: '1.5 hours' },
    ],
    reviews: beautyReviews,
  },
  {
    id: 'sample-beauty-2',
    name: 'Glam Studio',
    rating: 4.8,
    reviewCount: 892,
    description: 'Specializing in bridal makeup, hair coloring, extensions, and event styling. Making you look your best for life\'s special moments.',
    tagline: 'Bridal Makeup, Hair Coloring, Extensions, Styling',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.beauty[1],
    images: SERVICE_IMAGES.beauty,
    startingPrice: 55,
    priceUnit: '/service',
    distance: '0.7 mi',
    availability: 'Tue-Sun, 10AM - 8PM',
    services: [
      { id: 's1', name: 'Bridal Makeup Package', price: 150, duration: '2-3 hours' },
      { id: 's2', name: 'Hair Coloring', price: 85, duration: '2 hours' },
      { id: 's3', name: 'Hair Extensions', price: 120, duration: '2 hours' },
    ],
    reviews: [beautyReviews[0], beautyReviews[1]],
  },
  {
    id: 'sample-beauty-3',
    name: 'Beauty Lounge',
    rating: 4.7,
    reviewCount: 654,
    description: 'Expert facials, waxing, threading, and nail care. Relaxing atmosphere with premium products for a pampering experience.',
    tagline: 'Facials, Waxing, Threading, Pedicure, Manicure',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.beauty[2],
    images: SERVICE_IMAGES.beauty,
    startingPrice: 35,
    priceUnit: '/service',
    distance: '1.0 mi',
    availability: 'Mon-Sat, 9AM - 7PM',
    services: [
      { id: 's1', name: 'Classic Facial', price: 55, duration: '45 min' },
      { id: 's2', name: 'Full Body Waxing', price: 75, duration: '1 hour' },
      { id: 's3', name: 'Threading', price: 35, duration: '30 min' },
    ],
    reviews: [beautyReviews[2]],
  },
  {
    id: 'sample-beauty-4',
    name: 'Elite Salon & Spa',
    rating: 4.6,
    reviewCount: 523,
    description: 'Premium hair treatments, massage therapy, and body treatments. Where relaxation meets beauty.',
    tagline: 'Hair Treatments, Massage, Body Treatments, Makeup',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.beauty[3],
    images: SERVICE_IMAGES.beauty,
    startingPrice: 50,
    priceUnit: '/service',
    distance: '1.3 mi',
    availability: 'Mon-Sun, 10AM - 8PM',
    services: [
      { id: 's1', name: 'Deep Hair Treatment', price: 70, duration: '1 hour' },
      { id: 's2', name: 'Relaxation Massage', price: 90, duration: '1 hour' },
      { id: 's3', name: 'Body Scrub & Wrap', price: 110, duration: '1.5 hours' },
    ],
    reviews: [beautyReviews[1], beautyReviews[2]],
  },
];

// ─── GROCERIES ───────────────────────────────────────────────────
export const SAMPLE_GROCERY_VENDORS: SampleVendor[] = [
  {
    id: 'sample-grocery-1',
    name: 'DoHuub Supermarket',
    rating: 4.9,
    reviewCount: 534,
    description: 'Your one-stop shop for all grocery needs. Fresh produce, pantry essentials, and household items delivered right to your door.',
    tagline: 'Supermarket, Groceries',
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.groceries[0],
    images: SERVICE_IMAGES.groceries,
    startingPrice: 25,
    priceUnit: ' min order',
    distance: '0.5 mi',
    availability: 'Daily, 7AM - 10PM',
    services: [
      { id: 's1', name: 'Standard Delivery', price: 5, duration: '30-40 min' },
      { id: 's2', name: 'Express Delivery', price: 10, duration: '15-20 min' },
      { id: 's3', name: 'Scheduled Delivery', price: 3, duration: 'Choose time slot' },
    ],
    reviews: groceryReviews,
  },
  {
    id: 'sample-grocery-2',
    name: 'Fresh Market',
    rating: 4.7,
    reviewCount: 312,
    description: 'Organic and locally sourced fresh produce. Supporting local farmers and bringing the freshest ingredients to your kitchen.',
    tagline: 'Organic, Fresh Produce',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.groceries[1],
    images: SERVICE_IMAGES.groceries,
    startingPrice: 20,
    priceUnit: ' min order',
    distance: '0.8 mi',
    availability: 'Daily, 8AM - 9PM',
    services: [
      { id: 's1', name: 'Standard Delivery', price: 6, duration: '35-45 min' },
      { id: 's2', name: 'Farm Box Subscription', price: 35, duration: 'Weekly' },
    ],
    reviews: [groceryReviews[0], groceryReviews[1]],
  },
  {
    id: 'sample-grocery-3',
    name: 'Quick Stop Grocers',
    rating: 4.6,
    reviewCount: 198,
    description: 'Convenience store with all your daily essentials. Fast delivery for when you need items in a hurry.',
    tagline: 'Convenience Store',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.groceries[2],
    images: SERVICE_IMAGES.groceries,
    startingPrice: 10,
    priceUnit: ' min order',
    distance: '0.3 mi',
    availability: 'Daily, 6AM - 11PM',
    services: [
      { id: 's1', name: 'Quick Delivery', price: 4, duration: '20-30 min' },
    ],
    reviews: [groceryReviews[2]],
  },
  {
    id: 'sample-grocery-4',
    name: 'Organic Valley',
    rating: 4.8,
    reviewCount: 267,
    description: 'Premium organic and health foods. Gluten-free, vegan, keto, and specialty diet options all in one place.',
    tagline: 'Organic, Health Foods',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.groceries[3],
    images: SERVICE_IMAGES.groceries,
    startingPrice: 30,
    priceUnit: ' min order',
    distance: '1.5 mi',
    availability: 'Daily, 8AM - 8PM',
    services: [
      { id: 's1', name: 'Standard Delivery', price: 7, duration: '40-50 min' },
      { id: 's2', name: 'Health Box', price: 45, duration: 'Weekly curated' },
    ],
    reviews: [groceryReviews[0], groceryReviews[2]],
  },
];

// ─── RENTALS ─────────────────────────────────────────────────────
export interface SampleProperty {
  id: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  priceUnit: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  isPoweredByDoHuub: boolean;
  imageUrl: string;
  images: string[];
  description: string;
  propertyType: string;
  reviews: SampleReview[];
}

export const SAMPLE_RENTAL_PROPERTIES: SampleProperty[] = [
  {
    id: 'sample-rental-1',
    name: 'Luxury Oceanfront Apartment',
    address: '123 Ocean Drive, Miami Beach, FL',
    bedrooms: 2,
    bathrooms: 2,
    price: 180,
    priceUnit: '/night',
    rating: 4.9,
    reviewCount: 156,
    amenities: ['WiFi', 'Pool', 'Parking', 'AC', 'Ocean View', 'Kitchen'],
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.rentals[0],
    images: SERVICE_IMAGES.rentals,
    description: 'Stunning oceanfront apartment with panoramic views of the Atlantic. Modern furnishings, full kitchen, and resort-style amenities.',
    propertyType: 'Apartment',
    reviews: rentalReviews,
  },
  {
    id: 'sample-rental-2',
    name: 'Modern Downtown Studio',
    address: '456 Brickell Ave, Miami, FL',
    bedrooms: 1,
    bathrooms: 1,
    price: 95,
    priceUnit: '/night',
    rating: 4.7,
    reviewCount: 89,
    amenities: ['WiFi', 'Gym', 'Parking', 'AC', 'City View'],
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.rentals[1],
    images: SERVICE_IMAGES.rentals,
    description: 'Chic studio in the heart of Brickell with city skyline views. Walking distance to restaurants and nightlife.',
    propertyType: 'Studio',
    reviews: [rentalReviews[0], rentalReviews[1]],
  },
  {
    id: 'sample-rental-3',
    name: 'Cozy Family House',
    address: '789 Coral Way, Coral Gables, FL',
    bedrooms: 3,
    bathrooms: 2,
    price: 220,
    priceUnit: '/night',
    rating: 4.8,
    reviewCount: 112,
    amenities: ['WiFi', 'Pool', 'Garden', 'BBQ', 'Parking', 'Washer/Dryer'],
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.rentals[2],
    images: SERVICE_IMAGES.rentals,
    description: 'Spacious family home with private pool and tropical garden. Perfect for families or groups looking for a relaxing getaway.',
    propertyType: 'House',
    reviews: [rentalReviews[1], rentalReviews[2]],
  },
  {
    id: 'sample-rental-4',
    name: 'Beachside Villa',
    address: '321 Collins Ave, South Beach, FL',
    bedrooms: 4,
    bathrooms: 3,
    price: 350,
    priceUnit: '/night',
    rating: 4.9,
    reviewCount: 78,
    amenities: ['WiFi', 'Private Pool', 'Beach Access', 'AC', 'Chef Kitchen', 'Parking'],
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.rentals[3],
    images: SERVICE_IMAGES.rentals,
    description: 'Exclusive beachside villa with direct beach access, private pool, and chef-grade kitchen. The ultimate luxury retreat.',
    propertyType: 'Villa',
    reviews: [rentalReviews[0]],
  },
];

// ─── CAREGIVING (Companions + Rides) ─────────────────────────────
export interface SampleCaregivingProvider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  description: string;
  isPoweredByDoHuub: boolean;
  imageUrl: string;
  images: string[];
  hourlyRate: number;
  yearsExperience: number;
  specialties: string[];
  certifications: string[];
  languages: string[];
  availability: string;
  reviews: SampleReview[];
  subCategory: 'companion' | 'ride';
}

export const SAMPLE_CAREGIVING_PROVIDERS: SampleCaregivingProvider[] = [
  // Companions
  {
    id: 'sample-companion-1',
    name: 'Maria Garcia',
    rating: 4.9,
    reviewCount: 187,
    description: 'Certified caregiver with extensive experience in senior care and companionship. Specializing in dementia care and mobility assistance.',
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.companionship[0],
    images: SERVICE_IMAGES.companionship,
    hourlyRate: 35,
    yearsExperience: 8,
    specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management'],
    certifications: ['Certified Nursing Assistant', 'CPR & First Aid', 'Dementia Care Specialist'],
    languages: ['English', 'Spanish'],
    availability: 'Mon-Sat, 7AM - 7PM',
    reviews: caregivingReviews,
    subCategory: 'companion',
  },
  {
    id: 'sample-companion-2',
    name: 'Patricia Johnson',
    rating: 4.8,
    reviewCount: 156,
    description: 'Compassionate caregiver dedicated to improving quality of life for seniors. Expert in personal care and meal preparation.',
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.companionship[1],
    images: SERVICE_IMAGES.companionship,
    hourlyRate: 32,
    yearsExperience: 6,
    specialties: ['Personal Care', 'Meal Preparation', 'Light Housekeeping'],
    certifications: ['Certified Home Health Aide', 'CPR & First Aid'],
    languages: ['English'],
    availability: 'Mon-Fri, 8AM - 6PM',
    reviews: [caregivingReviews[0], caregivingReviews[1]],
    subCategory: 'companion',
  },
  {
    id: 'sample-companion-3',
    name: 'Susan Williams',
    rating: 4.7,
    reviewCount: 134,
    description: 'Friendly and patient companion specializing in social engagement. Activities, games, and outings to keep seniors active and happy.',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.companionship[2],
    images: SERVICE_IMAGES.companionship,
    hourlyRate: 30,
    yearsExperience: 5,
    specialties: ['Companionship', 'Activities & Games', 'Transportation'],
    certifications: ['CPR & First Aid', 'Senior Companion Certification'],
    languages: ['English'],
    availability: 'Mon-Sun, 9AM - 5PM',
    reviews: [caregivingReviews[2]],
    subCategory: 'companion',
  },
  // Rides
  {
    id: 'sample-ride-1',
    name: 'DoHuub Care Transport',
    rating: 4.9,
    reviewCount: 234,
    description: 'Professional medical and daily living transportation services with trained drivers. Wheelchair accessible vehicles available.',
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.rides[0],
    images: SERVICE_IMAGES.rides,
    hourlyRate: 45,
    yearsExperience: 10,
    specialties: ['Medical Transport', 'Door-to-Door Assistance', 'Wheelchair Accessible'],
    certifications: ['Licensed Medical Transport', 'CPR & First Aid'],
    languages: ['English', 'Spanish'],
    availability: 'Daily, 6AM - 10PM',
    reviews: caregivingReviews,
    subCategory: 'ride',
  },
  {
    id: 'sample-ride-2',
    name: 'SafeRide Seniors',
    rating: 4.8,
    reviewCount: 189,
    description: 'Specialized senior transportation with compassionate care. Our drivers are trained in memory care and mobility assistance.',
    isPoweredByDoHuub: true,
    imageUrl: SERVICE_IMAGES.rides[1],
    images: SERVICE_IMAGES.rides,
    hourlyRate: 40,
    yearsExperience: 7,
    specialties: ['Senior Specialists', 'Memory Care Trained', 'Mobility Assistance'],
    certifications: ['Licensed Transport', 'Dementia Care Trained'],
    languages: ['English'],
    availability: 'Mon-Sat, 7AM - 8PM',
    reviews: [caregivingReviews[0], caregivingReviews[1]],
    subCategory: 'ride',
  },
  {
    id: 'sample-ride-3',
    name: 'CareWheels Transportation',
    rating: 4.7,
    reviewCount: 156,
    description: 'Reliable transportation for appointments and errands. Same-day booking available with pet-friendly options.',
    isPoweredByDoHuub: false,
    imageUrl: SERVICE_IMAGES.rides[2],
    images: SERVICE_IMAGES.rides,
    hourlyRate: 38,
    yearsExperience: 4,
    specialties: ['Same-Day Booking', 'Multiple Stops', 'Pet-Friendly'],
    certifications: ['CPR & First Aid'],
    languages: ['English', 'Creole'],
    availability: 'Mon-Sun, 8AM - 6PM',
    reviews: [caregivingReviews[2]],
    subCategory: 'ride',
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────
const ALL_SAMPLE_VENDORS = [
  ...SAMPLE_CLEANING_VENDORS,
  ...SAMPLE_HANDYMAN_VENDORS,
  ...SAMPLE_BEAUTY_VENDORS,
  ...SAMPLE_GROCERY_VENDORS,
];

export function getSampleVendorById(id: string): SampleVendor | undefined {
  return ALL_SAMPLE_VENDORS.find((v) => v.id === id);
}

export function getSamplePropertyById(id: string): SampleProperty | undefined {
  return SAMPLE_RENTAL_PROPERTIES.find((p) => p.id === id);
}

export function getSampleCaregivingById(id: string): SampleCaregivingProvider | undefined {
  return SAMPLE_CAREGIVING_PROVIDERS.find((p) => p.id === id);
}

export function isSampleId(id: string): boolean {
  return id.startsWith('sample-');
}
