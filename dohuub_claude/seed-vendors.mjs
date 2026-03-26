import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const SUPABASE_URL = 'https://qiotpmjbhjpegylqgrwd.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_2gv3hR2WTrHKdTbrhPIxwA_hNqbNFR5';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Realistic images from Unsplash (public CDN)
const IMAGES = {
  cleaning: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800',
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800',
  ],
  handyman: [
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
    'https://images.unsplash.com/photo-1588783529894-9e0ef45a1e24?w=800',
    'https://images.unsplash.com/photo-1621905251189-08b45249ff78?w=800',
    'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800',
  ],
  groceries: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800',
    'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=800',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
  ],
  rentals: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  ],
  caregiving: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
  ],
};

async function clearExistingData() {
  console.log('🗑️  Clearing existing vendor data...');

  const tables = [
    'Review', 'OrderItem', 'Order', 'Booking',
    'CleaningListing', 'HandymanListing', 'BeautyListing',
    'GroceryListing', 'RentalListing', 'CompanionshipListing',
    'RideAssistanceListing', 'VendorCategory', 'Vendor',
  ];
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().gte('createdAt', '1970-01-01');
    if (error && error.code !== 'PGRST116') console.warn(`  ⚠️  ${table} clear:`, error.message);
  }

  // Also clear seed users
  const { error: userErr } = await supabase.from('User').delete().like('email', '%@dohuub-seed.com');
  if (userErr) console.warn('  ⚠️  User clear:', userErr.message);

  console.log('✅ Cleared existing data');
}

async function createVendorUser(slug) {
  const id = randomUUID();
  const email = `vendor.${slug}@dohuub-seed.com`;

  // Check if already exists
  const { data: existing } = await supabase
    .from('User')
    .select('id')
    .eq('email', email)
    .single();
  if (existing) return existing.id;

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('User')
    .insert({ id, email, role: 'VENDOR', updatedAt: now })
    .select('id')
    .single();

  if (error) throw new Error(`User creation failed: ${JSON.stringify(error)}`);
  return data.id;
}

async function createVendor(userId, name, description, logo, coverImage, rating, reviewCount) {
  const id = randomUUID();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('Vendor')
    .insert({
      id,
      userId,
      businessName: name,
      description,
      logo,
      coverImage,
      rating,
      reviewCount,
      status: 'APPROVED',
      isActive: true,
      isMichelle: false,
      updatedAt: now,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Vendor creation failed: ${JSON.stringify(error)}`);
  return data.id;
}

async function linkVendorCategory(vendorId, category) {
  const { error } = await supabase
    .from('VendorCategory')
    .insert({ id: randomUUID(), vendorId, category });

  if (error) throw new Error(`VendorCategory link failed: ${JSON.stringify(error)}`);
}

async function seedCleaning() {
  console.log('\n🧹 Seeding Cleaning vendors...');

  const vendors = [
    {
      name: 'Sparkle Pro Cleaning',
      description: 'Professional deep cleaning service with eco-friendly products. We specialize in homes, apartments, and offices with a 100% satisfaction guarantee.',
      logo: IMAGES.cleaning[0],
      coverImage: IMAGES.cleaning[0],
      rating: 4.8, reviewCount: 189,
      listing: {
        title: 'Premium Home Deep Cleaning',
        description: 'Thorough top-to-bottom cleaning of your entire home. Includes all rooms, bathrooms, kitchen, and living areas using professional-grade eco-friendly products.',
        cleaningType: 'DEEP_CLEANING',
        basePrice: 120,
        priceUnit: 'per_session',
        duration: 180,
        images: IMAGES.cleaning,
        whatsIncluded: ['All rooms cleaned', 'Bathroom sanitization', 'Kitchen degreasing', 'Floor mopping', 'Window cleaning', 'Eco-friendly products'],
      }
    },
    {
      name: 'FreshSpace Cleaners',
      description: 'Expert laundry and ironing services delivered to your door. Same-day pickup and next-day delivery available across the city.',
      logo: IMAGES.cleaning[1],
      coverImage: IMAGES.cleaning[1],
      rating: 4.6, reviewCount: 134,
      listing: {
        title: 'Laundry & Ironing Service',
        description: 'Professional laundry service with pickup and delivery. We handle all fabric types with care and return your clothes fresh, clean, and perfectly ironed.',
        cleaningType: 'LAUNDRY',
        basePrice: 45,
        priceUnit: 'per_load',
        duration: 60,
        images: [IMAGES.cleaning[1], IMAGES.cleaning[2], IMAGES.cleaning[3]],
        whatsIncluded: ['Pickup & delivery', 'Washing & drying', 'Folding & ironing', 'Fabric softener', 'Same-day option'],
      }
    },
    {
      name: 'Office Shine Co.',
      description: 'Specialized commercial and office cleaning. We work after hours so your workplace is spotless every morning. Trusted by 50+ businesses.',
      logo: IMAGES.cleaning[2],
      coverImage: IMAGES.cleaning[2],
      rating: 4.9, reviewCount: 97,
      listing: {
        title: 'Office & Commercial Cleaning',
        description: 'Complete office cleaning solution tailored for businesses. After-hours service available to minimize disruption. Monthly contracts with discounted rates.',
        cleaningType: 'OFFICE_CLEANING',
        basePrice: 200,
        priceUnit: 'per_session',
        duration: 240,
        images: [IMAGES.cleaning[2], IMAGES.cleaning[3], IMAGES.cleaning[0]],
        whatsIncluded: ['Workstation cleaning', 'Common area sanitization', 'Restroom deep clean', 'Trash removal', 'Floor vacuuming & mopping', 'Window wiping'],
      }
    },
  ];

  for (const v of vendors) {
    const slug = v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const uid = await createVendorUser(slug);
    const vendorId = await createVendor(uid, v.name, v.description, v.logo, v.coverImage, v.rating, v.reviewCount);
    await linkVendorCategory(vendorId, 'CLEANING');

    const { error } = await supabase.from('CleaningListing').insert({
      id: randomUUID(),
      vendorId,
      ...v.listing,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    });
    if (error) console.error('CleaningListing error:', error);
    else console.log(`  ✅ ${v.name}`);
  }
}

async function seedHandyman() {
  console.log('\n🔧 Seeding Handyman vendors...');

  const vendors = [
    {
      name: 'FixIt Fast Services',
      description: 'Expert plumbers available 24/7 for emergencies and scheduled repairs. Licensed and insured with 10+ years of experience.',
      logo: IMAGES.handyman[0],
      coverImage: IMAGES.handyman[0],
      rating: 4.7, reviewCount: 215,
      listing: {
        title: 'Plumbing Repair & Installation',
        description: 'Professional plumbing services for all your needs. From leaky faucets to full pipe installations, we handle it all quickly and efficiently.',
        handymanType: 'PLUMBING',
        basePrice: 80,
        hourlyRate: 65,
        priceUnit: 'per_hour',
        images: IMAGES.handyman,
        whatsIncluded: ['Free diagnosis', 'All tools provided', 'Licensed plumber', 'Warranty on work', '24/7 emergency'],
        services: ['Leak repair', 'Pipe installation', 'Drain cleaning', 'Water heater repair'],
      }
    },
    {
      name: 'PowerUp Electrical',
      description: 'Certified electricians for home and commercial wiring, installations, and repairs. Safety-first approach with guaranteed workmanship.',
      logo: IMAGES.handyman[1],
      coverImage: IMAGES.handyman[1],
      rating: 4.8, reviewCount: 178,
      listing: {
        title: 'Electrical Wiring & Repairs',
        description: 'Comprehensive electrical services by certified professionals. Safe, reliable, and code-compliant work for residential and commercial properties.',
        handymanType: 'ELECTRICAL',
        basePrice: 90,
        hourlyRate: 75,
        priceUnit: 'per_hour',
        images: [IMAGES.handyman[1], IMAGES.handyman[2], IMAGES.handyman[3]],
        whatsIncluded: ['Certified electrician', 'Safety inspection', 'Code compliance', 'All permits handled', 'Warranty'],
        services: ['Wiring installation', 'Circuit breaker repair', 'Outlet installation', 'Lighting setup'],
      }
    },
    {
      name: 'HandiHome Solutions',
      description: 'General repair and maintenance for everything around your home. Furniture assembly, mounting, painting — one call handles it all.',
      logo: IMAGES.handyman[2],
      coverImage: IMAGES.handyman[2],
      rating: 4.5, reviewCount: 302,
      listing: {
        title: 'General Home Repairs & Maintenance',
        description: 'All-in-one handyman service for your home. We handle the small and big jobs so you can focus on what matters.',
        handymanType: 'GENERAL_REPAIR',
        basePrice: 60,
        hourlyRate: 50,
        priceUnit: 'per_hour',
        images: [IMAGES.handyman[2], IMAGES.handyman[3], IMAGES.handyman[0]],
        whatsIncluded: ['All tools provided', 'Experienced handyman', 'Flexible scheduling', 'No job too small'],
        services: ['Furniture assembly', 'TV mounting', 'Door repairs', 'Painting & patching'],
      }
    },
  ];

  for (const v of vendors) {
    const slug = v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const uid = await createVendorUser(slug);
    const vendorId = await createVendor(uid, v.name, v.description, v.logo, v.coverImage, v.rating, v.reviewCount);
    await linkVendorCategory(vendorId, 'HANDYMAN');

    const { error } = await supabase.from('HandymanListing').insert({
      id: randomUUID(),
      vendorId,
      ...v.listing,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    });
    if (error) console.error('HandymanListing error:', error);
    else console.log(`  ✅ ${v.name}`);
  }
}

async function seedBeauty() {
  console.log('\n💄 Seeding Beauty vendors...');

  const vendors = [
    {
      name: 'Glam Studio by Sara',
      description: 'Professional makeup and hair styling for events, weddings, and everyday looks. Mobile service — we come to you!',
      logo: IMAGES.beauty[0],
      coverImage: IMAGES.beauty[0],
      rating: 4.9, reviewCount: 412,
      listing: {
        title: 'Bridal & Event Makeup',
        description: 'Full glam makeup for your special day. We use premium products to ensure long-lasting, camera-ready looks tailored to your style.',
        beautyType: 'MAKEUP',
        basePrice: 150,
        duration: 90,
        images: IMAGES.beauty,
        services: ['Bridal makeup', 'Party glam', 'Natural look', 'Airbrush foundation', 'Lash application'],
        portfolio: [IMAGES.beauty[1], IMAGES.beauty[2]],
      }
    },
    {
      name: 'Luxe Hair Lounge',
      description: 'Premium hair services at your doorstep. Cuts, coloring, treatments, and styling by certified stylists with 8+ years experience.',
      logo: IMAGES.beauty[1],
      coverImage: IMAGES.beauty[1],
      rating: 4.7, reviewCount: 289,
      listing: {
        title: 'Hair Styling & Color Treatment',
        description: 'Transform your hair with our professional styling and coloring services. From subtle highlights to bold transformations.',
        beautyType: 'HAIR',
        basePrice: 80,
        duration: 120,
        images: [IMAGES.beauty[1], IMAGES.beauty[2], IMAGES.beauty[3]],
        services: ['Haircut & styling', 'Color & highlights', 'Deep conditioning', 'Blowout', 'Keratin treatment'],
        portfolio: [IMAGES.beauty[0], IMAGES.beauty[3]],
      }
    },
    {
      name: 'Bliss Spa & Wellness',
      description: 'Relaxation and wellness services including massage, facials, and body treatments. Certified therapists with a holistic approach.',
      logo: IMAGES.beauty[2],
      coverImage: IMAGES.beauty[2],
      rating: 4.8, reviewCount: 156,
      listing: {
        title: 'Relaxation Massage & Facial',
        description: 'Rejuvenate your body and mind with our premium spa services. Tailored treatments for deep relaxation and skin renewal.',
        beautyType: 'WELLNESS',
        basePrice: 100,
        duration: 60,
        images: [IMAGES.beauty[2], IMAGES.beauty[3], IMAGES.beauty[0]],
        services: ['Swedish massage', 'Deep tissue massage', 'Hydrating facial', 'Aromatherapy', 'Hot stone therapy'],
        portfolio: [IMAGES.beauty[1], IMAGES.beauty[2]],
      }
    },
  ];

  for (const v of vendors) {
    const slug = v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const uid = await createVendorUser(slug);
    const vendorId = await createVendor(uid, v.name, v.description, v.logo, v.coverImage, v.rating, v.reviewCount);
    await linkVendorCategory(vendorId, 'BEAUTY');

    const { error } = await supabase.from('BeautyListing').insert({
      id: randomUUID(),
      vendorId,
      ...v.listing,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    });
    if (error) console.error('BeautyListing error:', error);
    else console.log(`  ✅ ${v.name}`);
  }
}

async function seedGroceries() {
  console.log('\n🛒 Seeding Grocery vendors...');

  const vendors = [
    {
      name: 'FreshMart Express',
      description: 'Premium fresh produce and groceries delivered within 2 hours. Sourced from local farms and trusted suppliers.',
      logo: IMAGES.groceries[0],
      coverImage: IMAGES.groceries[0],
      rating: 4.6, reviewCount: 523,
    },
    {
      name: 'GreenBasket Organics',
      description: 'Certified organic groceries delivered to your door. 100% natural, no preservatives, supporting local farmers.',
      logo: IMAGES.groceries[1],
      coverImage: IMAGES.groceries[1],
      rating: 4.8, reviewCount: 267,
    },
    {
      name: 'QuickShop Superstore',
      description: 'Everything you need in one place — groceries, household items, snacks, and beverages. Fast 1-hour delivery guaranteed.',
      logo: IMAGES.groceries[2],
      coverImage: IMAGES.groceries[2],
      rating: 4.4, reviewCount: 891,
    },
  ];

  const items = [
    ['Fresh Organic Tomatoes', 'Juicy vine-ripened tomatoes, perfect for salads and cooking', 'Vegetables', 3.99, 'per kg', IMAGES.groceries[0]],
    ['Free-Range Eggs (12)', 'Farm-fresh free-range eggs from local farmers', 'Dairy & Eggs', 5.49, 'per dozen', IMAGES.groceries[1]],
    ['Whole Grain Bread', 'Freshly baked whole grain bread, no preservatives', 'Bakery', 4.29, 'per loaf', IMAGES.groceries[2]],
    ['Organic Milk (1L)', 'Fresh organic whole milk from grass-fed cows', 'Dairy & Eggs', 2.99, 'per liter', IMAGES.groceries[3]],
    ['Baby Spinach (250g)', 'Pre-washed baby spinach leaves ready to eat', 'Vegetables', 3.49, 'per pack', IMAGES.groceries[0]],
    ['Avocados (3 pack)', 'Ripe and ready Hass avocados', 'Fruits', 4.99, 'per pack', IMAGES.groceries[1]],
    ['Chicken Breast (500g)', 'Fresh boneless skinless chicken breast', 'Meat', 7.99, 'per pack', IMAGES.groceries[2]],
    ['Greek Yogurt (500g)', 'Thick and creamy full-fat Greek yogurt', 'Dairy & Eggs', 4.49, 'per pack', IMAGES.groceries[3]],
    ['Orange Juice (1L)', 'Freshly squeezed pure orange juice', 'Beverages', 3.99, 'per liter', IMAGES.groceries[0]],
  ];

  for (let i = 0; i < vendors.length; i++) {
    const v = vendors[i];
    const slug = v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const uid = await createVendorUser(slug);
    const vendorId = await createVendor(uid, v.name, v.description, v.logo, v.coverImage, v.rating, v.reviewCount);
    await linkVendorCategory(vendorId, 'GROCERIES');

    // Add 3 grocery items per vendor
    const vendorItems = items.slice(i * 3, i * 3 + 3);
    for (const [name, description, category, price, unit, image] of vendorItems) {
      const { error } = await supabase.from('GroceryListing').insert({
        id: randomUUID(),
        vendorId,
        name, description, category, price, unit, image,
        inStock: true,
        stockCount: 50,
        status: 'ACTIVE',
        updatedAt: new Date().toISOString(),
      });
      if (error) console.error('GroceryListing error:', error);
    }
    console.log(`  ✅ ${v.name}`);
  }
}

async function seedRentals() {
  console.log('\n🏠 Seeding Rental vendors...');

  const vendors = [
    {
      name: 'Urban Stay Rentals',
      description: 'Stylish short-term apartments in prime city locations. Fully furnished with modern amenities for business and leisure travelers.',
      logo: IMAGES.rentals[0],
      coverImage: IMAGES.rentals[0],
      rating: 4.7, reviewCount: 342,
      listing: {
        title: 'Modern Downtown Studio Apartment',
        description: 'Beautifully designed studio apartment in the heart of the city. Perfect for short stays with all modern amenities included.',
        propertyType: 'apartment',
        address: '123 Downtown Ave',
        city: 'Dubai',
        state: 'Dubai',
        zipCode: '00000',
        bedrooms: 1,
        bathrooms: 1.0,
        maxGuests: 2,
        amenities: ['WiFi', 'Air conditioning', 'Kitchen', 'Washing machine', 'Smart TV', 'Parking'],
        images: IMAGES.rentals,
        pricePerNight: 120,
        pricePerWeek: 750,
        pricePerMonth: 2800,
        cleaningFee: 50,
        minStay: 1,
        maxStay: 90,
      }
    },
    {
      name: 'Cozy Family Homes',
      description: 'Spacious family-friendly homes for longer stays. Pet-friendly options available with full kitchen and outdoor spaces.',
      logo: IMAGES.rentals[1],
      coverImage: IMAGES.rentals[1],
      rating: 4.6, reviewCount: 198,
      listing: {
        title: '3-Bedroom Family Villa with Pool',
        description: 'Spacious family villa with private pool, fully equipped kitchen, and large outdoor area. Ideal for family vacations or extended stays.',
        propertyType: 'villa',
        address: '456 Palm Gardens',
        city: 'Dubai',
        state: 'Dubai',
        zipCode: '00000',
        bedrooms: 3,
        bathrooms: 2.0,
        maxGuests: 6,
        amenities: ['Private pool', 'WiFi', 'Full kitchen', 'BBQ area', 'Parking', 'Maid service'],
        images: [IMAGES.rentals[1], IMAGES.rentals[2], IMAGES.rentals[3]],
        pricePerNight: 280,
        pricePerWeek: 1750,
        pricePerMonth: 6500,
        cleaningFee: 100,
        minStay: 2,
        maxStay: 180,
      }
    },
    {
      name: 'Executive Suite Rentals',
      description: 'Luxury serviced apartments for business professionals. Concierge service, meeting rooms, and premium facilities included.',
      logo: IMAGES.rentals[2],
      coverImage: IMAGES.rentals[2],
      rating: 4.9, reviewCount: 87,
      listing: {
        title: 'Luxury Executive Suite — City View',
        description: 'Premium executive suite with panoramic city views, dedicated workspace, and full hotel-like amenities for the discerning business traveler.',
        propertyType: 'suite',
        address: '789 Business Bay Tower',
        city: 'Dubai',
        state: 'Dubai',
        zipCode: '00000',
        bedrooms: 2,
        bathrooms: 2.0,
        maxGuests: 4,
        amenities: ['Concierge service', 'Gym access', 'Meeting room', 'City view', 'WiFi', 'Daily housekeeping', 'Parking'],
        images: [IMAGES.rentals[2], IMAGES.rentals[3], IMAGES.rentals[0]],
        pricePerNight: 350,
        pricePerWeek: 2200,
        pricePerMonth: 8000,
        cleaningFee: 120,
        minStay: 1,
        maxStay: 365,
      }
    },
  ];

  for (const v of vendors) {
    const slug = v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const uid = await createVendorUser(slug);
    const vendorId = await createVendor(uid, v.name, v.description, v.logo, v.coverImage, v.rating, v.reviewCount);
    await linkVendorCategory(vendorId, 'RENTALS');

    const { error } = await supabase.from('RentalListing').insert({
      id: randomUUID(),
      vendorId,
      ...v.listing,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    });
    if (error) console.error('RentalListing error:', error);
    else console.log(`  ✅ ${v.name}`);
  }
}

async function seedCaregiving() {
  console.log('\n🤝 Seeding Caregiving vendors...');

  const vendors = [
    {
      name: 'CareConnect Pro',
      description: 'Compassionate professional caregivers for elderly and special needs. All caregivers are certified, background-checked, and trained in first aid.',
      logo: IMAGES.caregiving[0],
      coverImage: IMAGES.caregiving[0],
      rating: 4.9, reviewCount: 178,
      listing: {
        title: 'Elderly Care & Companionship',
        description: 'Professional and compassionate care for your elderly loved ones. We provide daily assistance, companionship, and medical monitoring.',
        hourlyRate: 25,
        yearsOfExperience: 8,
        image: IMAGES.caregiving[0],
        certifications: ['First Aid Certified', 'CPR Certified', 'Elder Care Specialist'],
        specialties: ['Elderly care', 'Dementia support', 'Post-surgery care', 'Mobility assistance'],
        supportTypes: ['In-home care', 'Companionship', 'Medical monitoring', 'Meal preparation'],
        languages: ['English', 'Arabic'],
        credentialImages: [IMAGES.caregiving[1]],
      }
    },
    {
      name: 'NurtureCare Services',
      description: 'Specialized post-natal and baby care support. Experienced nurses help new mothers with newborn care, feeding, and recovery.',
      logo: IMAGES.caregiving[1],
      coverImage: IMAGES.caregiving[1],
      rating: 4.8, reviewCount: 134,
      listing: {
        title: 'Post-Natal & Baby Care Support',
        description: 'Expert post-natal care for mother and baby. Our nurses provide hands-on support for newborn care, breastfeeding, and mother recovery.',
        hourlyRate: 30,
        yearsOfExperience: 6,
        image: IMAGES.caregiving[1],
        certifications: ['Registered Nurse', 'Post-Natal Care Specialist', 'Lactation Consultant'],
        specialties: ['Newborn care', 'Breastfeeding support', 'Post-natal recovery', 'Baby sleep training'],
        supportTypes: ['Day care', 'Night support', 'Home visits', 'Video consultations'],
        languages: ['English', 'Arabic', 'Hindi'],
        credentialImages: [IMAGES.caregiving[2]],
      }
    },
    {
      name: 'MindfulCare Companions',
      description: 'Emotional support and social companionship for seniors and those dealing with isolation. Trained counselors provide meaningful connections.',
      logo: IMAGES.caregiving[2],
      coverImage: IMAGES.caregiving[2],
      rating: 4.7, reviewCount: 89,
      listing: {
        title: 'Companionship & Emotional Support',
        description: 'Warm, professional companionship for seniors and individuals seeking social connection. Activities, outings, and daily check-ins available.',
        hourlyRate: 20,
        yearsOfExperience: 5,
        image: IMAGES.caregiving[2],
        certifications: ['Psychology Background', 'Senior Care Certified', 'Mental Health First Aid'],
        specialties: ['Senior companionship', 'Social engagement', 'Activity planning', 'Emotional support'],
        supportTypes: ['Home visits', 'Outdoor activities', 'Phone check-ins', 'Group activities'],
        languages: ['English', 'Arabic'],
        credentialImages: [IMAGES.caregiving[3]],
      }
    },
  ];

  for (const v of vendors) {
    const slug = v.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const uid = await createVendorUser(slug);
    const vendorId = await createVendor(uid, v.name, v.description, v.logo, v.coverImage, v.rating, v.reviewCount);
    await linkVendorCategory(vendorId, 'COMPANIONSHIP');

    const { error } = await supabase.from('CompanionshipListing').insert({
      id: randomUUID(),
      vendorId,
      title: v.listing.title,
      description: v.listing.description,
      hourlyRate: v.listing.hourlyRate,
      yearsOfExperience: v.listing.yearsOfExperience,
      image: v.listing.image,
      certifications: v.listing.certifications,
      specialties: v.listing.specialties,
      supportTypes: v.listing.supportTypes,
      languages: v.listing.languages,
      credentialImages: v.listing.credentialImages,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    });
    if (error) console.error('CompanionshipListing error:', error);
    else console.log(`  ✅ ${v.name}`);
  }
}

async function main() {
  console.log('🚀 DoHuub Vendor Seed Script');
  console.log('================================');

  try {
    await clearExistingData();

    await seedCleaning();
    await seedHandyman();
    await seedBeauty();
    await seedGroceries();
    await seedRentals();
    await seedCaregiving();

    console.log('\n================================');
    console.log('✅ Seed complete! 3 vendors per category added.');
    console.log('📱 Reload the app to see the data.');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

main();
