import { PrismaClient, ServiceCategory, CleaningType, HandymanType, BeautyType, CaregivingType, AddressType, BookingStatus, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // ============================================
  // 1. ADMIN ACCOUNTS
  // ============================================
  
  // Michelle (Platform Owner)
  const michelleUser = await prisma.user.upsert({
    where: { email: 'michelle@doohub.com' },
    update: {},
    create: {
      email: 'michelle@doohub.com',
      phone: '+1234567890',
      role: 'ADMIN',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Michelle',
          lastName: 'Williams',
        },
      },
    },
  });

  // Demo Admin
  const demoAdminUser = await prisma.user.upsert({
    where: { email: 'demo-admin@doohub.com' },
    update: {},
    create: {
      email: 'demo-admin@doohub.com',
      phone: '+1111111111',
      role: 'ADMIN',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Demo',
          lastName: 'Admin',
        },
      },
    },
  });

  console.log('✅ Admin accounts created');

  // ============================================
  // 1.5 REGIONS (US + Canada Cities) - NEW
  // ============================================

  const regionData = [
    // United States
    { name: 'New York, NY', city: 'New York', state: 'NY', country: 'USA', countryCode: 'US' },
    { name: 'Los Angeles, CA', city: 'Los Angeles', state: 'CA', country: 'USA', countryCode: 'US' },
    { name: 'Chicago, IL', city: 'Chicago', state: 'IL', country: 'USA', countryCode: 'US' },
    { name: 'Brooklyn, NY', city: 'Brooklyn', state: 'NY', country: 'USA', countryCode: 'US' },
    { name: 'San Francisco, CA', city: 'San Francisco', state: 'CA', country: 'USA', countryCode: 'US' },
    { name: 'Queens, NY', city: 'Queens', state: 'NY', country: 'USA', countryCode: 'US' },
    { name: 'Santa Monica, CA', city: 'Santa Monica', state: 'CA', country: 'USA', countryCode: 'US' },
    { name: 'Jersey City, NJ', city: 'Jersey City', state: 'NJ', country: 'USA', countryCode: 'US' },
    { name: 'Manhattan, NY', city: 'Manhattan', state: 'NY', country: 'USA', countryCode: 'US' },
    { name: 'Bronx, NY', city: 'Bronx', state: 'NY', country: 'USA', countryCode: 'US' },
    // Canada
    { name: 'Toronto, ON', city: 'Toronto', province: 'ON', country: 'Canada', countryCode: 'CA' },
    { name: 'Vancouver, BC', city: 'Vancouver', province: 'BC', country: 'Canada', countryCode: 'CA' },
    { name: 'Montreal, QC', city: 'Montreal', province: 'QC', country: 'Canada', countryCode: 'CA' },
    { name: 'Calgary, AB', city: 'Calgary', province: 'AB', country: 'Canada', countryCode: 'CA' },
    { name: 'Ottawa, ON', city: 'Ottawa', province: 'ON', country: 'Canada', countryCode: 'CA' },
    { name: 'Edmonton, AB', city: 'Edmonton', province: 'AB', country: 'Canada', countryCode: 'CA' },
    { name: 'Mississauga, ON', city: 'Mississauga', province: 'ON', country: 'Canada', countryCode: 'CA' },
    { name: 'Winnipeg, MB', city: 'Winnipeg', province: 'MB', country: 'Canada', countryCode: 'CA' },
  ];

  for (const region of regionData) {
    await prisma.region.upsert({
      where: { name_country: { name: region.name, country: region.country } },
      update: {},
      create: {
        name: region.name,
        city: region.city,
        state: region.state || null,
        province: (region as any).province || null,
        country: region.country,
        countryCode: region.countryCode,
        isActive: true,
      },
    });
  }

  console.log('✅ Regions created (10 US + 8 Canada)');

  // ============================================
  // 2. MICHELLE'S VENDOR (Platform Owner)
  // ============================================
  
  const michelleVendor = await prisma.vendor.upsert({
    where: { userId: michelleUser.id },
    update: {},
    create: {
      userId: michelleUser.id,
      businessName: 'DoHuub Official',
      description: 'Premium services powered by DoHuub - Your trusted marketplace partner',
      isMichelle: true,
      subscriptionStatus: 'ACTIVE',
      rating: 4.9,
      reviewCount: 523,
      categories: {
        create: [
          { category: ServiceCategory.CLEANING },
          { category: ServiceCategory.HANDYMAN },
          { category: ServiceCategory.BEAUTY },
          { category: ServiceCategory.GROCERIES },
          { category: ServiceCategory.RENTALS },
          { category: ServiceCategory.RIDE_ASSISTANCE },
          { category: ServiceCategory.COMPANIONSHIP },
        ],
      },
      serviceAreas: {
        create: [
          {
            name: 'Manhattan',
            city: 'New York',
            state: 'NY',
            zipCodes: ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'],
          },
          {
            name: 'Brooklyn',
            city: 'Brooklyn',
            state: 'NY',
            zipCodes: ['11201', '11202', '11203', '11204', '11205', '11206', '11207', '11208', '11209', '11210'],
          },
        ],
      },
      availability: {
        create: [
          { dayOfWeek: 0, startTime: '09:00', endTime: '18:00' },
          { dayOfWeek: 1, startTime: '08:00', endTime: '20:00' },
          { dayOfWeek: 2, startTime: '08:00', endTime: '20:00' },
          { dayOfWeek: 3, startTime: '08:00', endTime: '20:00' },
          { dayOfWeek: 4, startTime: '08:00', endTime: '20:00' },
          { dayOfWeek: 5, startTime: '08:00', endTime: '20:00' },
          { dayOfWeek: 6, startTime: '09:00', endTime: '18:00' },
        ],
      },
    },
  });

  // ============================================
  // 3. VENDOR ACCOUNTS
  // ============================================
  
  const vendorData = [
    {
      email: 'demo-vendor@doohub.com',
      phone: '+1222222222',
      businessName: 'Demo Vendor Services',
      description: 'Full-service demo vendor for testing',
      firstName: 'Demo',
      lastName: 'Vendor',
      rating: 4.5,
      reviewCount: 45,
      categories: [ServiceCategory.CLEANING, ServiceCategory.HANDYMAN],
    },
    {
      email: 'sparkle@example.com',
      phone: '+1333333333',
      businessName: 'Sparkle Clean Co.',
      description: 'Professional cleaning services for homes and offices',
      firstName: 'Sparkle',
      lastName: 'Business',
      rating: 4.8,
      reviewCount: 189,
      categories: [ServiceCategory.CLEANING],
    },
    {
      email: 'fixitpro@example.com',
      phone: '+1444444444',
      businessName: 'Fix-It Pro Services',
      description: 'Expert handyman services for all your repair needs',
      firstName: 'Fix-It',
      lastName: 'Pro',
      rating: 4.7,
      reviewCount: 156,
      categories: [ServiceCategory.HANDYMAN],
    },
    {
      email: 'glamourstudio@example.com',
      phone: '+1555555555',
      businessName: 'Glamour Studio',
      description: 'Beauty services that make you shine',
      firstName: 'Glamour',
      lastName: 'Studio',
      rating: 4.9,
      reviewCount: 234,
      categories: [ServiceCategory.BEAUTY],
    },
    {
      email: 'freshmarket@example.com',
      phone: '+1666666666',
      businessName: 'Fresh Market Grocers',
      description: 'Farm-fresh produce and quality groceries delivered',
      firstName: 'Fresh',
      lastName: 'Market',
      rating: 4.6,
      reviewCount: 312,
      categories: [ServiceCategory.GROCERIES],
    },
    {
      email: 'comfortcare@example.com',
      phone: '+1777777777',
      businessName: 'Comfort Care Services',
      description: 'Compassionate caregiving and transportation services',
      firstName: 'Comfort',
      lastName: 'Care',
      rating: 4.8,
      reviewCount: 145,
      categories: [ServiceCategory.RIDE_ASSISTANCE, ServiceCategory.COMPANIONSHIP],
    },
    {
      email: 'nyrentals@example.com',
      phone: '+1888888888',
      businessName: 'NY Rentals',
      description: 'Premium property rentals across New York City',
      firstName: 'NY',
      lastName: 'Rentals',
      rating: 4.7,
      reviewCount: 98,
      categories: [ServiceCategory.RENTALS],
    },
  ];

  const vendors: any[] = [];
  const vendorUsers: any[] = [];

  for (const data of vendorData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        phone: data.phone,
        role: 'VENDOR',
        isEmailVerified: true,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
    });
    vendorUsers.push(user);

    const vendor = await prisma.vendor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: data.businessName,
        description: data.description,
        rating: data.rating,
        reviewCount: data.reviewCount,
        subscriptionStatus: 'ACTIVE',
        categories: {
          create: data.categories.map(cat => ({ category: cat })),
        },
        serviceAreas: {
          create: [
            {
              name: 'Manhattan',
              city: 'New York',
              state: 'NY',
              zipCodes: ['10001', '10002', '10003', '10004', '10005'],
            },
            {
              name: 'Brooklyn',
              city: 'Brooklyn',
              state: 'NY',
              zipCodes: ['11201', '11202', '11203', '11204', '11205'],
            },
          ],
        },
        availability: {
          create: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
          ],
        },
      },
    });

    vendors.push(vendor);
  }

  // Alias vendors by index
  const [demoVendor, sparkleClean, fixItPro, glamourStudio, freshMarket, comfortCare, nyRentals] = vendors;

  console.log('✅ Vendor accounts created');

  // ============================================
  // 4. CUSTOMER ACCOUNTS
  // ============================================
  
  // Demo Customer 1
  const demoCustomer = await prisma.user.upsert({
    where: { email: 'demo-customer@doohub.com' },
    update: {},
    create: {
      email: 'demo-customer@doohub.com',
      phone: '+1999999991',
      role: 'CUSTOMER',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Demo',
          lastName: 'Customer',
        },
      },
    },
  });

  // Demo Customer 2
  const demoCustomer2 = await prisma.user.upsert({
    where: { email: 'demo-customer2@doohub.com' },
    update: {},
    create: {
      email: 'demo-customer2@doohub.com',
      phone: '+1999999992',
      role: 'CUSTOMER',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Jane',
          lastName: 'Smith',
        },
      },
    },
  });

  // John Doe (existing)
  const johnDoe = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      phone: '+1987654321',
      role: 'CUSTOMER',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    },
  });

  // Sarah Jones
  const sarahJones = await prisma.user.upsert({
    where: { email: 'sarah.jones@example.com' },
    update: {},
    create: {
      email: 'sarah.jones@example.com',
      phone: '+1999999993',
      role: 'CUSTOMER',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Jones',
        },
      },
    },
  });

  // Mike Wilson
  const mikeWilson = await prisma.user.upsert({
    where: { email: 'mike.wilson@example.com' },
    update: {},
    create: {
      email: 'mike.wilson@example.com',
      phone: '+1999999994',
      role: 'CUSTOMER',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Mike',
          lastName: 'Wilson',
        },
      },
    },
  });

  // Emily Brown
  const emilyBrown = await prisma.user.upsert({
    where: { email: 'emily.brown@example.com' },
    update: {},
    create: {
      email: 'emily.brown@example.com',
      phone: '+1999999995',
      role: 'CUSTOMER',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Emily',
          lastName: 'Brown',
        },
      },
    },
  });

  console.log('✅ Customer accounts created');

  // ============================================
  // 5. ADDRESSES
  // ============================================
  
  // Demo Customer Addresses
  const demoCustomerHomeAddress = await prisma.address.create({
    data: {
      userId: demoCustomer.id,
      type: AddressType.HOME,
      label: 'Home',
      street: '100 Demo Street',
      apartment: 'Apt 1A',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      latitude: 40.7484,
      longitude: -73.9967,
      isDefault: true,
    },
  });

  await prisma.address.createMany({
    data: [
      {
        userId: demoCustomer.id,
        type: AddressType.WORK,
        label: 'Office',
        street: '200 Business Ave',
        apartment: 'Floor 5',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        country: 'USA',
        latitude: 40.7157,
        longitude: -73.9864,
      },
      {
        userId: demoCustomer.id,
        type: AddressType.DOCTOR,
        label: 'Dr. Smith',
        street: '300 Medical Plaza',
        apartment: 'Suite 201',
        city: 'New York',
        state: 'NY',
        zipCode: '10003',
        country: 'USA',
      },
    ],
  });

  // Demo Customer 2 Addresses
  const demoCustomer2HomeAddress = await prisma.address.create({
    data: {
      userId: demoCustomer2.id,
      type: AddressType.HOME,
      label: 'My Place',
      street: '150 Park Lane',
      apartment: 'Unit 3B',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      country: 'USA',
      latitude: 40.6892,
      longitude: -73.9857,
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: demoCustomer2.id,
      type: AddressType.PHARMACY,
      label: 'CVS Pharmacy',
      street: '400 Main St',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11202',
      country: 'USA',
    },
  });

  // Sarah Jones Address
  const sarahHomeAddress = await prisma.address.create({
    data: {
      userId: sarahJones.id,
      type: AddressType.HOME,
      label: 'Home',
      street: '500 Riverside Dr',
      apartment: 'Apt 12C',
      city: 'Manhattan',
      state: 'NY',
      zipCode: '10004',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.0060,
      isDefault: true,
    },
  });

  // Mike Wilson Addresses
  const mikeHomeAddress = await prisma.address.create({
    data: {
      userId: mikeWilson.id,
      type: AddressType.HOME,
      label: 'Home',
      street: '600 Ocean Ave',
      city: 'Queens',
      state: 'NY',
      zipCode: '11375',
      country: 'USA',
      latitude: 40.7282,
      longitude: -73.8317,
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: mikeWilson.id,
      type: AddressType.WORK,
      label: 'Work',
      street: '700 Corporate Blvd',
      apartment: 'Floor 10',
      city: 'Manhattan',
      state: 'NY',
      zipCode: '10005',
      country: 'USA',
    },
  });

  // John Doe Addresses
  const johnHomeAddress = await prisma.address.create({
    data: {
      userId: johnDoe.id,
      type: AddressType.HOME,
      label: 'Home',
      street: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      latitude: 40.7484,
      longitude: -73.9967,
      isDefault: true,
    },
  });

  // Emily Brown Address
  const emilyHomeAddress = await prisma.address.create({
    data: {
      userId: emilyBrown.id,
      type: AddressType.HOME,
      label: 'Home',
      street: '800 Central Park West',
      apartment: 'Apt 5A',
      city: 'New York',
      state: 'NY',
      zipCode: '10025',
      country: 'USA',
      isDefault: true,
    },
  });

  console.log('✅ Addresses created');

  // ============================================
  // 6. PAYMENT METHODS (Mock Cards)
  // ============================================
  
  await prisma.paymentMethod.createMany({
    data: [
      {
        userId: demoCustomer.id,
        stripePaymentMethodId: 'pm_demo_visa_4242',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2028,
        isDefault: true,
      },
      {
        userId: demoCustomer.id,
        stripePaymentMethodId: 'pm_demo_mc_5555',
        type: 'card',
        last4: '5555',
        brand: 'mastercard',
        expiryMonth: 6,
        expiryYear: 2027,
        isDefault: false,
      },
      {
        userId: demoCustomer2.id,
        stripePaymentMethodId: 'pm_demo2_visa_1234',
        type: 'card',
        last4: '1234',
        brand: 'visa',
        expiryMonth: 9,
        expiryYear: 2029,
        isDefault: true,
      },
      {
        userId: sarahJones.id,
        stripePaymentMethodId: 'pm_sarah_amex_0005',
        type: 'card',
        last4: '0005',
        brand: 'amex',
        expiryMonth: 3,
        expiryYear: 2028,
        isDefault: true,
      },
      {
        userId: mikeWilson.id,
        stripePaymentMethodId: 'pm_mike_discover_9424',
        type: 'card',
        last4: '9424',
        brand: 'discover',
        expiryMonth: 11,
        expiryYear: 2027,
        isDefault: true,
      },
    ],
  });

  console.log('✅ Payment methods created');

  // ============================================
  // 7. SERVICE LISTINGS
  // ============================================
  
  // CLEANING LISTINGS
  const cleaningListings = await Promise.all([
    prisma.cleaningListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Premium Deep House Cleaning',
        description: 'Comprehensive deep cleaning service for your entire home. Our trained professionals ensure every corner sparkles.',
        cleaningType: CleaningType.DEEP_CLEANING,
        basePrice: 150,
        priceUnit: 'per_session',
        duration: 180,
        images: [],
      },
    }),
    prisma.cleaningListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Professional Laundry Service',
        description: 'Full-service laundry including wash, dry, fold, and delivery. Premium fabric care guaranteed.',
        cleaningType: CleaningType.LAUNDRY,
        basePrice: 45,
        priceUnit: 'per_load',
        images: [],
      },
    }),
    prisma.cleaningListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Office Deep Clean',
        description: 'Professional office cleaning service. Sanitization, carpet cleaning, and workspace organization.',
        cleaningType: CleaningType.OFFICE_CLEANING,
        basePrice: 200,
        priceUnit: 'per_session',
        duration: 240,
        images: [],
      },
    }),
    prisma.cleaningListing.create({
      data: {
        vendorId: sparkleClean.id,
        title: 'Apartment Deep Cleaning',
        description: 'Thorough cleaning service perfect for apartments and condos.',
        cleaningType: CleaningType.DEEP_CLEANING,
        basePrice: 120,
        priceUnit: 'per_session',
        duration: 150,
        images: [],
      },
    }),
    prisma.cleaningListing.create({
      data: {
        vendorId: sparkleClean.id,
        title: 'Express Laundry',
        description: 'Same-day laundry service. Pick up and delivery included.',
        cleaningType: CleaningType.LAUNDRY,
        basePrice: 35,
        priceUnit: 'per_load',
        images: [],
      },
    }),
    prisma.cleaningListing.create({
      data: {
        vendorId: sparkleClean.id,
        title: 'Move-Out Cleaning',
        description: 'Complete move-out cleaning to get your deposit back. Includes deep clean of all rooms.',
        cleaningType: CleaningType.DEEP_CLEANING,
        basePrice: 250,
        priceUnit: 'per_session',
        duration: 300,
        images: [],
      },
    }),
    prisma.cleaningListing.create({
      data: {
        vendorId: demoVendor.id,
        title: 'Basic Home Cleaning',
        description: 'Regular home cleaning service. Great for weekly or bi-weekly maintenance.',
        cleaningType: CleaningType.DEEP_CLEANING,
        basePrice: 80,
        priceUnit: 'per_session',
        duration: 120,
        images: [],
      },
    }),
  ]);

  // HANDYMAN LISTINGS
  const handymanListings = await Promise.all([
    prisma.handymanListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Plumbing Repair & Installation',
        description: 'Expert plumbing services including leak repairs, fixture installation, and drain cleaning.',
        handymanType: HandymanType.PLUMBING,
        basePrice: 85,
        priceUnit: 'per_hour',
        images: [],
      },
    }),
    prisma.handymanListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Electrical Services',
        description: 'Licensed electrical work including wiring, outlet installation, and lighting fixtures.',
        handymanType: HandymanType.ELECTRICAL,
        basePrice: 95,
        priceUnit: 'per_hour',
        images: [],
      },
    }),
    prisma.handymanListing.create({
      data: {
        vendorId: fixItPro.id,
        title: 'Furniture Assembly',
        description: 'Professional assembly for all types of furniture. IKEA specialists.',
        handymanType: HandymanType.INSTALLATION,
        basePrice: 65,
        priceUnit: 'per_item',
        images: [],
      },
    }),
    prisma.handymanListing.create({
      data: {
        vendorId: fixItPro.id,
        title: 'General Home Repairs',
        description: 'Drywall repair, painting touch-ups, door fixes, and more.',
        handymanType: HandymanType.GENERAL_REPAIR,
        basePrice: 75,
        priceUnit: 'per_hour',
        images: [],
      },
    }),
    prisma.handymanListing.create({
      data: {
        vendorId: fixItPro.id,
        title: 'Drywall Patching',
        description: 'Expert drywall repair and patching. Seamless finish guaranteed.',
        handymanType: HandymanType.GENERAL_REPAIR,
        basePrice: 60,
        priceUnit: 'per_hour',
        images: [],
      },
    }),
    prisma.handymanListing.create({
      data: {
        vendorId: demoVendor.id,
        title: 'Basic Plumbing',
        description: 'Simple plumbing fixes - leaky faucets, toilet repairs, drain clearing.',
        handymanType: HandymanType.PLUMBING,
        basePrice: 70,
        priceUnit: 'per_hour',
        images: [],
      },
    }),
  ]);

  // BEAUTY LISTINGS
  const beautyListings = await Promise.all([
    prisma.beautyListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Professional Makeup Application',
        description: 'Full glam makeup for events, weddings, or photoshoots. Includes consultation.',
        beautyType: BeautyType.MAKEUP,
        basePrice: 120,
        duration: 90,
        images: [],
        portfolio: [],
      },
    }),
    prisma.beautyListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Hair Styling & Cut',
        description: 'Expert hair styling including cuts, blowouts, and special occasion styles.',
        beautyType: BeautyType.HAIR,
        basePrice: 80,
        duration: 60,
        images: [],
        portfolio: [],
      },
    }),
    prisma.beautyListing.create({
      data: {
        vendorId: glamourStudio.id,
        title: 'Manicure & Pedicure',
        description: 'Luxurious nail services including gel, acrylics, and nail art.',
        beautyType: BeautyType.NAILS,
        basePrice: 55,
        duration: 75,
        images: [],
        portfolio: [],
      },
    }),
    prisma.beautyListing.create({
      data: {
        vendorId: glamourStudio.id,
        title: 'Wellness Massage',
        description: 'Relaxing massage therapy including Swedish, deep tissue, and aromatherapy.',
        beautyType: BeautyType.WELLNESS,
        basePrice: 90,
        duration: 60,
        images: [],
        portfolio: [],
      },
    }),
    prisma.beautyListing.create({
      data: {
        vendorId: glamourStudio.id,
        title: 'Bridal Makeup Package',
        description: 'Complete bridal package including trial, wedding day makeup, and touch-up kit.',
        beautyType: BeautyType.MAKEUP,
        basePrice: 250,
        duration: 150,
        images: [],
        portfolio: [],
      },
    }),
    prisma.beautyListing.create({
      data: {
        vendorId: glamourStudio.id,
        title: 'Hair Coloring',
        description: 'Professional hair coloring including highlights, balayage, and full color.',
        beautyType: BeautyType.HAIR,
        basePrice: 120,
        duration: 120,
        images: [],
        portfolio: [],
      },
    }),
  ]);

  // GROCERY LISTINGS
  const groceryListings = await Promise.all([
    prisma.groceryListing.create({
      data: {
        vendorId: michelleVendor.id,
        name: 'Organic Produce Box',
        description: 'Weekly selection of fresh, organic fruits and vegetables',
        category: 'Fresh Produce',
        price: 45,
        unit: 'box',
        inStock: true,
        stockCount: 100,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: michelleVendor.id,
        name: 'Farm Fresh Eggs',
        description: 'Free-range organic eggs, dozen',
        category: 'Dairy & Eggs',
        price: 8,
        unit: 'dozen',
        inStock: true,
        stockCount: 50,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Artisan Sourdough Bread',
        description: 'Freshly baked sourdough bread',
        category: 'Bakery',
        price: 7,
        unit: 'loaf',
        inStock: true,
        stockCount: 30,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Premium Ground Coffee',
        description: 'Single-origin Arabica beans, medium roast',
        category: 'Beverages',
        price: 18,
        unit: 'bag',
        inStock: true,
        stockCount: 40,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Greek Yogurt',
        description: 'Creamy Greek yogurt, plain',
        category: 'Dairy & Eggs',
        price: 6,
        unit: 'container',
        inStock: true,
        stockCount: 60,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Organic Bananas',
        description: 'Fresh organic bananas',
        category: 'Fresh Produce',
        price: 3,
        unit: 'bunch',
        inStock: true,
        stockCount: 80,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Whole Milk',
        description: 'Farm fresh whole milk',
        category: 'Dairy & Eggs',
        price: 5,
        unit: 'gallon',
        inStock: true,
        stockCount: 45,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Orange Juice',
        description: 'Fresh squeezed orange juice',
        category: 'Beverages',
        price: 6,
        unit: 'bottle',
        inStock: true,
        stockCount: 35,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Chicken Breast',
        description: 'Premium boneless skinless chicken breast',
        category: 'Meat & Seafood',
        price: 12,
        unit: 'lb',
        inStock: true,
        stockCount: 25,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Salmon Fillet',
        description: 'Fresh Atlantic salmon fillet',
        category: 'Meat & Seafood',
        price: 18,
        unit: 'lb',
        inStock: true,
        stockCount: 20,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Mixed Greens',
        description: 'Fresh mixed salad greens',
        category: 'Fresh Produce',
        price: 5,
        unit: 'bag',
        inStock: true,
        stockCount: 50,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Pasta',
        description: 'Italian style spaghetti pasta',
        category: 'Pantry',
        price: 3,
        unit: 'box',
        inStock: true,
        stockCount: 100,
      },
    }),
    prisma.groceryListing.create({
      data: {
        vendorId: freshMarket.id,
        name: 'Olive Oil',
        description: 'Extra virgin olive oil',
        category: 'Pantry',
        price: 12,
        unit: 'bottle',
        inStock: true,
        stockCount: 30,
      },
    }),
  ]);

  // RENTAL LISTINGS
  const rentalListings = await Promise.all([
    prisma.rentalListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Luxury Manhattan Apartment',
        description: 'Stunning 2-bedroom apartment with city views. Modern amenities, doorman building.',
        propertyType: 'Apartment',
        address: '123 Park Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['WiFi', 'Gym', 'Doorman', 'Laundry', 'Rooftop', 'Central AC'],
        images: [],
        pricePerNight: 350,
        pricePerWeek: 2100,
        pricePerMonth: 7500,
        minStay: 1,
        maxStay: 180,
      },
    }),
    prisma.rentalListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Cozy Studio in Brooklyn',
        description: 'Charming studio apartment in trendy Williamsburg. Walking distance to subway.',
        propertyType: 'Studio',
        address: '456 Bedford Avenue',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11211',
        bedrooms: 0,
        bathrooms: 1,
        amenities: ['WiFi', 'Kitchen', 'Laundry', 'Pet Friendly'],
        images: [],
        pricePerNight: 150,
        pricePerWeek: 900,
        pricePerMonth: 3200,
        minStay: 1,
        maxStay: 365,
      },
    }),
    prisma.rentalListing.create({
      data: {
        vendorId: nyRentals.id,
        title: 'Modern Loft in SoHo',
        description: 'Stunning loft space in the heart of SoHo. High ceilings, exposed brick.',
        propertyType: 'Loft',
        address: '789 Broadway',
        city: 'New York',
        state: 'NY',
        zipCode: '10003',
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['WiFi', 'Kitchen', 'Washer/Dryer', 'Central AC', 'Elevator'],
        images: [],
        pricePerNight: 275,
        pricePerWeek: 1650,
        pricePerMonth: 5500,
        minStay: 2,
        maxStay: 90,
      },
    }),
    prisma.rentalListing.create({
      data: {
        vendorId: nyRentals.id,
        title: 'Family Home in Queens',
        description: 'Spacious 3-bedroom house perfect for families. Large backyard, quiet neighborhood.',
        propertyType: 'House',
        address: '321 Forest Hills',
        city: 'Queens',
        state: 'NY',
        zipCode: '11375',
        bedrooms: 3,
        bathrooms: 2.5,
        amenities: ['WiFi', 'Parking', 'Backyard', 'Washer/Dryer', 'Kitchen', 'Pet Friendly'],
        images: [],
        pricePerNight: 400,
        pricePerWeek: 2400,
        pricePerMonth: 8000,
        minStay: 3,
        maxStay: 365,
      },
    }),
    prisma.rentalListing.create({
      data: {
        vendorId: nyRentals.id,
        title: 'Penthouse Suite',
        description: 'Luxurious penthouse with panoramic city views. Private terrace, premium finishes.',
        propertyType: 'Apartment',
        address: '555 5th Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10017',
        bedrooms: 3,
        bathrooms: 3,
        amenities: ['WiFi', 'Gym', 'Doorman', 'Concierge', 'Private Terrace', 'Central AC', 'Hot Tub'],
        images: [],
        pricePerNight: 800,
        pricePerWeek: 5000,
        pricePerMonth: 18000,
        minStay: 2,
        maxStay: 30,
      },
    }),
  ]);

  // CAREGIVING LISTINGS
  const caregivingListings = await Promise.all([
    prisma.caregivingListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Medical Appointment Transport',
        description: 'Safe, reliable transportation for doctor visits, pharmacy runs, and medical appointments. Door-to-door service with assistance.',
        caregivingType: CaregivingType.RIDE_ASSISTANCE,
        basePrice: 45,
        priceUnit: 'per_trip',
        serviceArea: ['10001', '10002', '10003', '10004', '10005'],
        images: [],
      },
    }),
    prisma.caregivingListing.create({
      data: {
        vendorId: michelleVendor.id,
        title: 'Companion Care Services',
        description: 'Compassionate companionship including conversation, light activities, meal prep assistance, and general support.',
        caregivingType: CaregivingType.COMPANIONSHIP_SUPPORT,
        basePrice: 35,
        priceUnit: 'per_hour',
        serviceArea: ['10001', '10002', '10003', '10004', '10005'],
        images: [],
      },
    }),
    prisma.caregivingListing.create({
      data: {
        vendorId: comfortCare.id,
        title: 'Senior Transportation',
        description: 'Specialized senior transport with wheelchair accessibility and patient assistance.',
        caregivingType: CaregivingType.RIDE_ASSISTANCE,
        basePrice: 40,
        priceUnit: 'per_trip',
        serviceArea: ['10001', '10002', '10003'],
        images: [],
      },
    }),
    prisma.caregivingListing.create({
      data: {
        vendorId: comfortCare.id,
        title: 'Daily Companion Visits',
        description: 'Regular visits for companionship, light housekeeping, and medication reminders.',
        caregivingType: CaregivingType.COMPANIONSHIP_SUPPORT,
        basePrice: 30,
        priceUnit: 'per_hour',
        serviceArea: ['10001', '10002', '10003'],
        images: [],
      },
    }),
    prisma.caregivingListing.create({
      data: {
        vendorId: comfortCare.id,
        title: 'Grocery Shopping Assistance',
        description: 'Help with grocery shopping including transportation and carrying bags.',
        caregivingType: CaregivingType.COMPANIONSHIP_SUPPORT,
        basePrice: 25,
        priceUnit: 'per_hour',
        serviceArea: ['10001', '10002', '10003', '10004', '10005'],
        images: [],
      },
    }),
    prisma.caregivingListing.create({
      data: {
        vendorId: comfortCare.id,
        title: 'Prescription Pickup',
        description: 'Pick up and deliver prescriptions from your pharmacy.',
        caregivingType: CaregivingType.RIDE_ASSISTANCE,
        basePrice: 30,
        priceUnit: 'per_trip',
        serviceArea: ['10001', '10002', '10003', '10004', '10005'],
        images: [],
      },
    }),
  ]);

  console.log('✅ Service listings created');

  // ============================================
  // 8. BOOKINGS
  // ============================================
  
  // BK001 - Completed Cleaning
  const booking1 = await prisma.booking.create({
    data: {
      userId: demoCustomer.id,
      vendorId: michelleVendor.id,
      addressId: demoCustomerHomeAddress.id,
      category: ServiceCategory.CLEANING,
      cleaningListingId: cleaningListings[0].id,
      scheduledDate: new Date('2025-12-15'),
      scheduledTime: '10:00',
      duration: 180,
      subtotal: 150,
      serviceFee: 15,
      total: 165,
      status: BookingStatus.COMPLETED,
      completedAt: new Date('2025-12-15T13:10:00'),
    },
  });

  // BK002 - Completed Beauty
  const booking2 = await prisma.booking.create({
    data: {
      userId: demoCustomer.id,
      vendorId: glamourStudio.id,
      addressId: demoCustomerHomeAddress.id,
      category: ServiceCategory.BEAUTY,
      beautyListingId: beautyListings[2].id,
      scheduledDate: new Date('2025-12-20'),
      scheduledTime: '14:00',
      duration: 75,
      subtotal: 55,
      serviceFee: 5,
      total: 60,
      status: BookingStatus.COMPLETED,
      completedAt: new Date('2025-12-20T15:15:00'),
    },
  });

  // BK003 - Completed Cleaning (Sarah)
  const booking3 = await prisma.booking.create({
    data: {
      userId: sarahJones.id,
      vendorId: sparkleClean.id,
      addressId: sarahHomeAddress.id,
      category: ServiceCategory.CLEANING,
      cleaningListingId: cleaningListings[3].id,
      scheduledDate: new Date('2025-12-22'),
      scheduledTime: '09:00',
      duration: 150,
      subtotal: 120,
      serviceFee: 12,
      total: 132,
      status: BookingStatus.COMPLETED,
      completedAt: new Date('2025-12-22T11:30:00'),
    },
  });

  // BK004 - Completed Handyman (Mike)
  const booking4 = await prisma.booking.create({
    data: {
      userId: mikeWilson.id,
      vendorId: fixItPro.id,
      addressId: mikeHomeAddress.id,
      category: ServiceCategory.HANDYMAN,
      handymanListingId: handymanListings[2].id,
      scheduledDate: new Date('2025-12-28'),
      scheduledTime: '11:00',
      subtotal: 65,
      serviceFee: 6.50,
      total: 71.50,
      status: BookingStatus.COMPLETED,
      completedAt: new Date('2025-12-28T12:45:00'),
    },
  });

  // BK005 - Completed Ride Assistance (DemoCustomer2)
  const booking5 = await prisma.booking.create({
    data: {
      userId: demoCustomer2.id,
      vendorId: michelleVendor.id,
      addressId: demoCustomer2HomeAddress.id,
      category: ServiceCategory.RIDE_ASSISTANCE,
      caregivingListingId: caregivingListings[0].id, // Legacy reference
      scheduledDate: new Date('2026-01-02'),
      scheduledTime: '08:30',
      pickupLocation: '150 Park Lane, Brooklyn',
      dropoffLocation: '300 Medical Plaza, NY',
      subtotal: 45,
      serviceFee: 4.50,
      total: 49.50,
      status: BookingStatus.COMPLETED,
      completedAt: new Date('2026-01-02T10:00:00'),
    },
  });

  // BK006 - Completed Companionship
  const booking6 = await prisma.booking.create({
    data: {
      userId: demoCustomer.id,
      vendorId: comfortCare.id,
      addressId: demoCustomerHomeAddress.id,
      category: ServiceCategory.COMPANIONSHIP,
      caregivingListingId: caregivingListings[3].id, // Legacy reference
      scheduledDate: new Date('2026-01-05'),
      scheduledTime: '13:00',
      duration: 120,
      subtotal: 60,
      serviceFee: 6,
      total: 66,
      status: BookingStatus.COMPLETED,
      completedAt: new Date('2026-01-05T15:00:00'),
    },
  });

  // BK007 - Accepted Cleaning (upcoming)
  const booking7 = await prisma.booking.create({
    data: {
      userId: demoCustomer.id,
      vendorId: michelleVendor.id,
      addressId: demoCustomerHomeAddress.id,
      category: ServiceCategory.CLEANING,
      cleaningListingId: cleaningListings[2].id,
      scheduledDate: new Date('2026-01-13'),
      scheduledTime: '09:00',
      duration: 240,
      subtotal: 200,
      serviceFee: 20,
      total: 220,
      status: BookingStatus.ACCEPTED,
    },
  });

  // BK008 - Pending Beauty (upcoming)
  const booking8 = await prisma.booking.create({
    data: {
      userId: demoCustomer.id,
      vendorId: glamourStudio.id,
      addressId: demoCustomerHomeAddress.id,
      category: ServiceCategory.BEAUTY,
      beautyListingId: beautyListings[5].id,
      scheduledDate: new Date('2026-01-15'),
      scheduledTime: '15:00',
      duration: 120,
      subtotal: 120,
      serviceFee: 12,
      total: 132,
      status: BookingStatus.PENDING,
    },
  });

  // BK009 - Accepted Handyman (Sarah - upcoming)
  const booking9 = await prisma.booking.create({
    data: {
      userId: sarahJones.id,
      vendorId: fixItPro.id,
      addressId: sarahHomeAddress.id,
      category: ServiceCategory.HANDYMAN,
      handymanListingId: handymanListings[3].id,
      scheduledDate: new Date('2026-01-14'),
      scheduledTime: '10:00',
      subtotal: 75,
      serviceFee: 7.50,
      total: 82.50,
      status: BookingStatus.ACCEPTED,
    },
  });

  // BK010 - Pending Beauty (Mike - upcoming)
  const booking10 = await prisma.booking.create({
    data: {
      userId: mikeWilson.id,
      vendorId: michelleVendor.id,
      addressId: mikeHomeAddress.id,
      category: ServiceCategory.BEAUTY,
      beautyListingId: beautyListings[0].id,
      scheduledDate: new Date('2026-01-16'),
      scheduledTime: '11:00',
      duration: 90,
      subtotal: 120,
      serviceFee: 12,
      total: 132,
      status: BookingStatus.PENDING,
    },
  });

  // BK011 - Accepted Rental (DemoCustomer2 - upcoming)
  const booking11 = await prisma.booking.create({
    data: {
      userId: demoCustomer2.id,
      vendorId: nyRentals.id,
      addressId: demoCustomer2HomeAddress.id,
      category: ServiceCategory.RENTALS,
      rentalListingId: rentalListings[2].id,
      scheduledDate: new Date('2026-01-20'),
      scheduledTime: '14:00',
      endTime: '14:00',
      subtotal: 825,
      serviceFee: 0,
      total: 825,
      status: BookingStatus.ACCEPTED,
      specialInstructions: '3-night stay',
    },
  });

  // BK012 - Pending Ride Assistance
  const booking12 = await prisma.booking.create({
    data: {
      userId: demoCustomer.id,
      vendorId: comfortCare.id,
      addressId: demoCustomerHomeAddress.id,
      category: ServiceCategory.RIDE_ASSISTANCE,
      caregivingListingId: caregivingListings[2].id, // Legacy reference
      scheduledDate: new Date('2026-01-18'),
      scheduledTime: '09:30',
      pickupLocation: '100 Demo Street, NY',
      dropoffLocation: '300 Medical Plaza, NY',
      subtotal: 40,
      serviceFee: 4,
      total: 44,
      status: BookingStatus.PENDING,
    },
  });

  // BK013 - In Progress Cleaning
  const booking13 = await prisma.booking.create({
    data: {
      userId: demoCustomer.id,
      vendorId: sparkleClean.id,
      addressId: demoCustomerHomeAddress.id,
      category: ServiceCategory.CLEANING,
      cleaningListingId: cleaningListings[4].id,
      scheduledDate: new Date('2026-01-11'),
      scheduledTime: '10:00',
      subtotal: 35,
      serviceFee: 3.50,
      total: 38.50,
      status: BookingStatus.IN_PROGRESS,
    },
  });

  // BK014 - Cancelled
  const booking14 = await prisma.booking.create({
    data: {
      userId: demoCustomer.id,
      vendorId: fixItPro.id,
      addressId: demoCustomerHomeAddress.id,
      category: ServiceCategory.HANDYMAN,
      handymanListingId: handymanListings[4].id,
      scheduledDate: new Date('2026-01-08'),
      scheduledTime: '14:00',
      subtotal: 60,
      serviceFee: 6,
      total: 66,
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date('2026-01-07'),
      cancellationReason: 'Customer schedule conflict',
    },
  });

  // BK015 - Declined
  const booking15 = await prisma.booking.create({
    data: {
      userId: emilyBrown.id,
      vendorId: glamourStudio.id,
      addressId: emilyHomeAddress.id,
      category: ServiceCategory.BEAUTY,
      beautyListingId: beautyListings[4].id,
      scheduledDate: new Date('2026-01-10'),
      scheduledTime: '09:00',
      duration: 150,
      subtotal: 250,
      serviceFee: 25,
      total: 275,
      status: BookingStatus.DECLINED,
      cancellationReason: 'Vendor unavailable',
    },
  });

  // Add booking status history for completed bookings
  await prisma.bookingStatusHistory.createMany({
    data: [
      { bookingId: booking1.id, status: BookingStatus.PENDING, createdAt: new Date('2025-12-14T18:30:00') },
      { bookingId: booking1.id, status: BookingStatus.ACCEPTED, note: 'Vendor confirmed', createdAt: new Date('2025-12-14T19:15:00') },
      { bookingId: booking1.id, status: BookingStatus.IN_PROGRESS, note: 'Service started', createdAt: new Date('2025-12-15T10:05:00') },
      { bookingId: booking1.id, status: BookingStatus.COMPLETED, note: 'Service completed', createdAt: new Date('2025-12-15T13:10:00') },
      { bookingId: booking13.id, status: BookingStatus.PENDING, createdAt: new Date('2026-01-10T20:00:00') },
      { bookingId: booking13.id, status: BookingStatus.ACCEPTED, note: 'Vendor confirmed', createdAt: new Date('2026-01-10T20:30:00') },
      { bookingId: booking13.id, status: BookingStatus.IN_PROGRESS, note: 'Pickup completed', createdAt: new Date('2026-01-11T10:15:00') },
    ],
  });

  console.log('✅ Bookings created');

  // ============================================
  // 9. ORDERS (Groceries)
  // ============================================
  
  // ORD001 - Delivered
  const order1 = await prisma.order.create({
    data: {
      userId: demoCustomer.id,
      vendorId: freshMarket.id,
      addressId: demoCustomerHomeAddress.id,
      subtotal: 38,
      deliveryFee: 5,
      serviceFee: 2.85,
      total: 45.85,
      status: OrderStatus.COMPLETED,
      deliveredAt: new Date('2025-12-18T14:30:00'),
      items: {
        create: [
          { listingId: groceryListings[2].id, quantity: 1, price: 7, total: 7 },
          { listingId: groceryListings[3].id, quantity: 1, price: 18, total: 18 },
          { listingId: groceryListings[6].id, quantity: 1, price: 5, total: 5 },
          { listingId: groceryListings[1].id, quantity: 1, price: 8, total: 8 },
        ],
      },
    },
  });

  // ORD002 - Delivered
  const order2 = await prisma.order.create({
    data: {
      userId: sarahJones.id,
      vendorId: michelleVendor.id,
      addressId: sarahHomeAddress.id,
      subtotal: 45,
      deliveryFee: 5,
      serviceFee: 2.75,
      total: 52.75,
      status: OrderStatus.COMPLETED,
      deliveredAt: new Date('2025-12-25T12:00:00'),
      items: {
        create: [
          { listingId: groceryListings[0].id, quantity: 1, price: 45, total: 45 },
        ],
      },
    },
  });

  // ORD003 - Delivered
  const order3 = await prisma.order.create({
    data: {
      userId: demoCustomer2.id,
      vendorId: freshMarket.id,
      addressId: demoCustomer2HomeAddress.id,
      subtotal: 27,
      deliveryFee: 5,
      serviceFee: 2.70,
      total: 34.70,
      status: OrderStatus.COMPLETED,
      deliveredAt: new Date('2026-01-03T15:45:00'),
      items: {
        create: [
          { listingId: groceryListings[4].id, quantity: 1, price: 6, total: 6 },
          { listingId: groceryListings[7].id, quantity: 1, price: 6, total: 6 },
          { listingId: groceryListings[8].id, quantity: 1, price: 12, total: 12 },
          { listingId: groceryListings[11].id, quantity: 1, price: 3, total: 3 },
        ],
      },
    },
  });

  // ORD004 - Delivered
  const order4 = await prisma.order.create({
    data: {
      userId: mikeWilson.id,
      vendorId: freshMarket.id,
      addressId: mikeHomeAddress.id,
      subtotal: 35,
      deliveryFee: 5,
      serviceFee: 3.50,
      total: 43.50,
      status: OrderStatus.COMPLETED,
      deliveredAt: new Date('2026-01-08T11:20:00'),
      items: {
        create: [
          { listingId: groceryListings[9].id, quantity: 1, price: 18, total: 18 },
          { listingId: groceryListings[10].id, quantity: 1, price: 5, total: 5 },
          { listingId: groceryListings[12].id, quantity: 1, price: 12, total: 12 },
        ],
      },
    },
  });

  // ORD005 - Out for Delivery
  const order5 = await prisma.order.create({
    data: {
      userId: demoCustomer.id,
      vendorId: freshMarket.id,
      addressId: demoCustomerHomeAddress.id,
      subtotal: 23,
      deliveryFee: 5,
      serviceFee: 2.30,
      total: 30.30,
      status: OrderStatus.OUT_FOR_DELIVERY,
      estimatedDelivery: new Date('2026-01-11T14:00:00'),
      items: {
        create: [
          { listingId: groceryListings[2].id, quantity: 1, price: 7, total: 7 },
          { listingId: groceryListings[1].id, quantity: 1, price: 8, total: 8 },
          { listingId: groceryListings[6].id, quantity: 1, price: 5, total: 5 },
          { listingId: groceryListings[5].id, quantity: 1, price: 3, total: 3 },
        ],
      },
    },
  });

  // ORD006 - Preparing
  const order6 = await prisma.order.create({
    data: {
      userId: demoCustomer2.id,
      vendorId: michelleVendor.id,
      addressId: demoCustomer2HomeAddress.id,
      subtotal: 53,
      deliveryFee: 5,
      serviceFee: 4.70,
      total: 62.70,
      status: OrderStatus.IN_PROGRESS,
      estimatedDelivery: new Date('2026-01-11T16:00:00'),
      items: {
        create: [
          { listingId: groceryListings[0].id, quantity: 1, price: 45, total: 45 },
          { listingId: groceryListings[1].id, quantity: 1, price: 8, total: 8 },
        ],
      },
    },
  });

  // ORD007 - Confirmed
  const order7 = await prisma.order.create({
    data: {
      userId: sarahJones.id,
      vendorId: freshMarket.id,
      addressId: sarahHomeAddress.id,
      subtotal: 30,
      deliveryFee: 5,
      serviceFee: 3.25,
      total: 38.25,
      status: OrderStatus.ACCEPTED,
      estimatedDelivery: new Date('2026-01-12T11:00:00'),
      items: {
        create: [
          { listingId: groceryListings[3].id, quantity: 1, price: 18, total: 18 },
          { listingId: groceryListings[4].id, quantity: 1, price: 6, total: 6 },
          { listingId: groceryListings[7].id, quantity: 1, price: 6, total: 6 },
        ],
      },
    },
  });

  // ORD008 - Pending
  const order8 = await prisma.order.create({
    data: {
      userId: demoCustomer.id,
      vendorId: freshMarket.id,
      addressId: demoCustomerHomeAddress.id,
      subtotal: 35,
      deliveryFee: 5,
      serviceFee: 3.50,
      total: 43.50,
      status: OrderStatus.PENDING,
      estimatedDelivery: new Date('2026-01-12T15:00:00'),
      items: {
        create: [
          { listingId: groceryListings[8].id, quantity: 1, price: 12, total: 12 },
          { listingId: groceryListings[9].id, quantity: 1, price: 18, total: 18 },
          { listingId: groceryListings[10].id, quantity: 1, price: 5, total: 5 },
        ],
      },
    },
  });

  // ORD009 - Cancelled
  const order9 = await prisma.order.create({
    data: {
      userId: emilyBrown.id,
      vendorId: freshMarket.id,
      addressId: emilyHomeAddress.id,
      subtotal: 12,
      deliveryFee: 5,
      serviceFee: 1.20,
      total: 18.20,
      status: OrderStatus.CANCELLED,
      cancelledAt: new Date('2026-01-09'),
      specialNotes: 'Customer request',
      items: {
        create: [
          { listingId: groceryListings[2].id, quantity: 1, price: 7, total: 7 },
          { listingId: groceryListings[6].id, quantity: 1, price: 5, total: 5 },
        ],
      },
    },
  });

  console.log('✅ Orders created');

  // ============================================
  // 10. REVIEWS
  // ============================================
  
  await prisma.review.createMany({
    data: [
      {
        userId: demoCustomer.id,
        vendorId: michelleVendor.id,
        bookingId: booking1.id,
        rating: 5,
        comment: 'Absolutely spotless! The team was professional and thorough. Will definitely book again.',
        photos: [],
        createdAt: new Date('2025-12-16'),
      },
      {
        userId: demoCustomer.id,
        vendorId: glamourStudio.id,
        bookingId: booking2.id,
        rating: 4,
        comment: 'Great manicure, loved the nail art. Slight wait time but worth it.',
        photos: [],
        createdAt: new Date('2025-12-21'),
      },
      {
        userId: sarahJones.id,
        vendorId: sparkleClean.id,
        bookingId: booking3.id,
        rating: 5,
        comment: 'My apartment has never looked better! Highly recommend.',
        photos: [],
        createdAt: new Date('2025-12-23'),
      },
      {
        userId: mikeWilson.id,
        vendorId: fixItPro.id,
        bookingId: booking4.id,
        rating: 5,
        comment: 'Fast and efficient. Assembled 3 pieces of furniture in under 2 hours.',
        photos: [],
        createdAt: new Date('2025-12-29'),
      },
      {
        userId: demoCustomer2.id,
        vendorId: michelleVendor.id,
        bookingId: booking5.id,
        rating: 5,
        comment: 'So helpful with my mom\'s doctor appointment. Driver was patient and kind.',
        photos: [],
        createdAt: new Date('2026-01-03'),
      },
      {
        userId: demoCustomer.id,
        vendorId: comfortCare.id,
        bookingId: booking6.id,
        rating: 4,
        comment: 'Wonderful companion for my grandmother. She really enjoyed the visit.',
        photos: [],
        createdAt: new Date('2026-01-06'),
      },
    ],
  });

  console.log('✅ Reviews created');

  // ============================================
  // 11. TRANSACTIONS
  // ============================================
  
  await prisma.transaction.createMany({
    data: [
      {
        bookingId: booking1.id,
        amount: 165,
        platformFee: 16.50,
        vendorPayout: 148.50,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date('2025-12-15'),
      },
      {
        bookingId: booking2.id,
        amount: 60,
        platformFee: 6.00,
        vendorPayout: 54.00,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date('2025-12-20'),
      },
      {
        bookingId: booking3.id,
        amount: 132,
        platformFee: 13.20,
        vendorPayout: 118.80,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date('2025-12-22'),
      },
      {
        orderId: order1.id,
        amount: 45.85,
        platformFee: 4.59,
        vendorPayout: 41.26,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date('2025-12-18'),
      },
      {
        orderId: order2.id,
        amount: 52.75,
        platformFee: 5.28,
        vendorPayout: 47.47,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date('2025-12-25'),
      },
      {
        bookingId: booking4.id,
        amount: 71.50,
        platformFee: 7.15,
        vendorPayout: 64.35,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date('2025-12-28'),
      },
      {
        bookingId: booking5.id,
        amount: 49.50,
        platformFee: 4.95,
        vendorPayout: 44.55,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date('2026-01-02'),
      },
      {
        orderId: order3.id,
        amount: 34.70,
        platformFee: 3.47,
        vendorPayout: 31.23,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date('2026-01-03'),
      },
      {
        bookingId: booking6.id,
        amount: 66,
        platformFee: 6.60,
        vendorPayout: 59.40,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date('2026-01-05'),
      },
      {
        orderId: order5.id,
        amount: 30.30,
        platformFee: 3.03,
        vendorPayout: 27.27,
        status: PaymentStatus.PROCESSING,
      },
      {
        bookingId: booking7.id,
        amount: 220,
        platformFee: 22.00,
        vendorPayout: 198.00,
        status: PaymentStatus.PENDING,
      },
      {
        bookingId: booking11.id,
        amount: 825,
        platformFee: 82.50,
        vendorPayout: 742.50,
        status: PaymentStatus.PENDING,
      },
    ],
  });

  console.log('✅ Transactions created');

  // ============================================
  // 12. NOTIFICATIONS
  // ============================================
  
  await prisma.notification.createMany({
    data: [
      // Demo Customer Notifications
      {
        userId: demoCustomer.id,
        title: 'Booking Confirmed',
        body: 'Your cleaning service has been confirmed for Jan 13 at 9:00 AM',
        type: 'booking_update',
        isRead: true,
        createdAt: new Date('2026-01-10'),
      },
      {
        userId: demoCustomer.id,
        title: 'Order Out for Delivery',
        body: 'Your grocery order is on its way! ETA: 2:00 PM',
        type: 'order_update',
        isRead: false,
        createdAt: new Date('2026-01-11T12:00:00'),
      },
      {
        userId: demoCustomer.id,
        title: 'New Year Special',
        body: 'Get 20% off your next beauty service! Code: NEWYEAR20',
        type: 'promo',
        isRead: false,
        createdAt: new Date('2026-01-01'),
      },
      {
        userId: demoCustomer.id,
        title: 'Review Reminder',
        body: 'How was your cleaning service? Leave a review!',
        type: 'booking_update',
        isRead: true,
        createdAt: new Date('2025-12-16'),
      },
      {
        userId: demoCustomer.id,
        title: 'Payment Received',
        body: 'Payment of $165 confirmed for booking',
        type: 'payment',
        isRead: true,
        createdAt: new Date('2025-12-15'),
      },
      // Demo Customer 2 Notifications
      {
        userId: demoCustomer2.id,
        title: 'Rental Confirmed',
        body: 'Your stay at Modern Loft in SoHo is confirmed for Jan 20',
        type: 'booking_update',
        isRead: true,
        createdAt: new Date('2026-01-09'),
      },
      {
        userId: demoCustomer2.id,
        title: 'Order Preparing',
        body: 'Your grocery order is being prepared',
        type: 'order_update',
        isRead: false,
        createdAt: new Date('2026-01-11T10:00:00'),
      },
      {
        userId: demoCustomer2.id,
        title: 'Welcome to DoHuub!',
        body: 'Thanks for joining. Explore our services!',
        type: 'promo',
        isRead: true,
        createdAt: new Date('2025-12-01'),
      },
      // Vendor Notifications
      {
        userId: vendorUsers[0].id, // Demo Vendor
        title: 'New Booking Request',
        body: 'You have a new cleaning booking request',
        type: 'booking_update',
        isRead: true,
        createdAt: new Date('2026-01-10'),
      },
      {
        userId: vendorUsers[0].id,
        title: 'Payout Processed',
        body: '$148.50 has been transferred to your account',
        type: 'payment',
        isRead: true,
        createdAt: new Date('2025-12-17'),
      },
      {
        userId: vendorUsers[0].id,
        title: 'New Review',
        body: 'John D. left a 5-star review!',
        type: 'review',
        isRead: false,
        createdAt: new Date('2025-12-16'),
      },
    ],
  });

  console.log('✅ Notifications created');

  // ============================================
  // 13. CHAT CONVERSATIONS
  // ============================================
  
  const conversation1 = await prisma.chatConversation.create({
    data: {
      userId: demoCustomer.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'Hi, I need help finding a cleaning service for my apartment',
            createdAt: new Date('2026-01-08T10:00:00'),
          },
          {
            role: 'assistant',
            content: 'I\'d be happy to help you find a cleaning service! We have several great options available. Could you tell me:\n1. What type of cleaning do you need? (Deep cleaning, regular cleaning, laundry)\n2. What\'s the size of your apartment?\n3. When would you like the service?',
            createdAt: new Date('2026-01-08T10:00:05'),
          },
          {
            role: 'user',
            content: 'Deep cleaning, 2 bedroom, this weekend if possible',
            createdAt: new Date('2026-01-08T10:01:00'),
          },
          {
            role: 'assistant',
            content: 'Perfect! Here are some excellent options for a 2-bedroom deep cleaning:\n\n**DoHuub Official** - Premium Deep House Cleaning\n- Price: $150/session (180 min)\n- Rating: 4.9 ⭐ (523 reviews)\n- Available this Saturday at 10 AM\n\n**Sparkle Clean Co.** - Apartment Deep Cleaning\n- Price: $120/session (150 min)\n- Rating: 4.8 ⭐ (189 reviews)\n- Available Sunday at 9 AM\n\nWould you like me to book one of these for you?',
            metadata: { recommendedServices: ['cleaning'] },
            createdAt: new Date('2026-01-08T10:01:10'),
          },
          {
            role: 'user',
            content: 'The DoHuub one sounds good, book Saturday please',
            createdAt: new Date('2026-01-08T10:02:00'),
          },
          {
            role: 'assistant',
            content: 'Great choice! I\'ve initiated a booking for:\n\n📋 **Premium Deep House Cleaning**\n📅 This Saturday at 10:00 AM\n📍 100 Demo Street, Apt 1A\n💰 $150 + $15 service fee = $165\n\nPlease confirm the booking in your cart to complete the reservation!',
            createdAt: new Date('2026-01-08T10:02:15'),
          },
        ],
      },
    },
  });

  const conversation2 = await prisma.chatConversation.create({
    data: {
      userId: demoCustomer.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'What caregiving services do you offer?',
            createdAt: new Date('2026-01-10T14:00:00'),
          },
          {
            role: 'assistant',
            content: 'We offer comprehensive caregiving services designed to support seniors and those who need assistance:\n\n**Ride Assistance:**\n- Medical appointment transport\n- Pharmacy pickups\n- Grocery shopping trips\n- General transportation needs\n\n**Companionship Support:**\n- Daily companion visits\n- Conversation and social interaction\n- Light housekeeping\n- Medication reminders\n- Meal preparation assistance\n\nOur caregivers are vetted, compassionate, and experienced. Would you like details on any specific service?',
            metadata: { recommendedServices: ['caregiving'] },
            createdAt: new Date('2026-01-10T14:00:10'),
          },
        ],
      },
    },
  });

  console.log('✅ Chat conversations created');

  // ============================================
  // SUMMARY
  // ============================================
  
  console.log('\n🎉 Comprehensive seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log('  - Regions: 18 (10 US + 8 Canada)');
  console.log('  - Admin accounts: 2');
  console.log('  - Vendor accounts: 8 (including DoHuub Official)');
  console.log('  - Customer accounts: 6');
  console.log('  - Addresses: 10');
  console.log('  - Payment methods: 5');
  console.log('  - Cleaning listings: 7');
  console.log('  - Handyman listings: 6');
  console.log('  - Beauty listings: 6');
  console.log('  - Grocery listings: 13');
  console.log('  - Rental listings: 5');
  console.log('  - Caregiving listings: 6');
  console.log('  - Bookings: 15');
  console.log('  - Orders: 9');
  console.log('  - Reviews: 6');
  console.log('  - Transactions: 12');
  console.log('  - Notifications: 11');
  console.log('  - Chat conversations: 2');
  console.log('\n🔐 Demo Login Credentials:');
  console.log('  Customer: demo-customer@doohub.com');
  console.log('  Customer 2: demo-customer2@doohub.com');
  console.log('  Vendor: demo-vendor@doohub.com');
  console.log('  Admin: demo-admin@doohub.com');
  console.log('  Platform Owner: michelle@doohub.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
