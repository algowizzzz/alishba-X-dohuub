"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    // Create Admin User (Michelle)
    const adminUser = await prisma.user.upsert({
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
    // Create Michelle's Vendor Account (Platform Owner)
    const michelleVendor = await prisma.vendor.upsert({
        where: { userId: adminUser.id },
        update: {},
        create: {
            userId: adminUser.id,
            businessName: 'DoHuub Official',
            description: 'Premium services powered by DoHuub - Your trusted marketplace partner',
            isMichelle: true,
            subscriptionStatus: 'ACTIVE',
            rating: 4.9,
            reviewCount: 523,
            categories: {
                create: [
                    { category: client_1.ServiceCategory.CLEANING },
                    { category: client_1.ServiceCategory.HANDYMAN },
                    { category: client_1.ServiceCategory.BEAUTY },
                    { category: client_1.ServiceCategory.GROCERIES },
                    { category: client_1.ServiceCategory.RENTALS },
                    { category: client_1.ServiceCategory.CAREGIVING },
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
    // Create Sample Vendors
    const vendorData = [
        {
            email: 'sparkle@example.com',
            businessName: 'Sparkle Clean Co.',
            description: 'Professional cleaning services for homes and offices',
            rating: 4.8,
            reviewCount: 189,
        },
        {
            email: 'fixitpro@example.com',
            businessName: 'Fix-It Pro Services',
            description: 'Expert handyman services for all your repair needs',
            rating: 4.7,
            reviewCount: 156,
        },
        {
            email: 'glamourstudio@example.com',
            businessName: 'Glamour Studio',
            description: 'Beauty services that make you shine',
            rating: 4.9,
            reviewCount: 234,
        },
        {
            email: 'freshmarket@example.com',
            businessName: 'Fresh Market Grocers',
            description: 'Farm-fresh produce and quality groceries delivered',
            rating: 4.6,
            reviewCount: 312,
        },
        {
            email: 'comfortcare@example.com',
            businessName: 'Comfort Care Services',
            description: 'Compassionate caregiving and transportation services',
            rating: 4.8,
            reviewCount: 145,
        },
    ];
    const vendors = [];
    for (const data of vendorData) {
        const user = await prisma.user.upsert({
            where: { email: data.email },
            update: {},
            create: {
                email: data.email,
                role: 'VENDOR',
                isEmailVerified: true,
                profile: {
                    create: {
                        firstName: data.businessName.split(' ')[0],
                        lastName: 'Business',
                    },
                },
            },
        });
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
                serviceAreas: {
                    create: [
                        {
                            name: 'Manhattan',
                            city: 'New York',
                            state: 'NY',
                            zipCodes: ['10001', '10002', '10003', '10004', '10005'],
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
                    ],
                },
            },
        });
        vendors.push(vendor);
    }
    // Create Michelle's Listings (Always shown first)
    // Cleaning Listings
    await prisma.cleaningListing.createMany({
        data: [
            {
                vendorId: michelleVendor.id,
                title: 'Premium Deep House Cleaning',
                description: 'Comprehensive deep cleaning service for your entire home. Our trained professionals ensure every corner sparkles.',
                cleaningType: client_1.CleaningType.DEEP_CLEANING,
                basePrice: 150,
                priceUnit: 'per_session',
                duration: 180,
                images: [],
            },
            {
                vendorId: michelleVendor.id,
                title: 'Professional Laundry Service',
                description: 'Full-service laundry including wash, dry, fold, and delivery. Premium fabric care guaranteed.',
                cleaningType: client_1.CleaningType.LAUNDRY,
                basePrice: 45,
                priceUnit: 'per_load',
                images: [],
            },
            {
                vendorId: michelleVendor.id,
                title: 'Office Deep Clean',
                description: 'Professional office cleaning service. Sanitization, carpet cleaning, and workspace organization.',
                cleaningType: client_1.CleaningType.OFFICE_CLEANING,
                basePrice: 200,
                priceUnit: 'per_session',
                duration: 240,
                images: [],
            },
        ],
    });
    // Add vendor cleaning listings
    await prisma.cleaningListing.createMany({
        data: [
            {
                vendorId: vendors[0].id,
                title: 'Apartment Deep Cleaning',
                description: 'Thorough cleaning service perfect for apartments and condos.',
                cleaningType: client_1.CleaningType.DEEP_CLEANING,
                basePrice: 120,
                priceUnit: 'per_session',
                duration: 150,
                images: [],
            },
            {
                vendorId: vendors[0].id,
                title: 'Express Laundry',
                description: 'Same-day laundry service. Pick up and delivery included.',
                cleaningType: client_1.CleaningType.LAUNDRY,
                basePrice: 35,
                priceUnit: 'per_load',
                images: [],
            },
        ],
    });
    // Handyman Listings
    await prisma.handymanListing.createMany({
        data: [
            {
                vendorId: michelleVendor.id,
                title: 'Plumbing Repair & Installation',
                description: 'Expert plumbing services including leak repairs, fixture installation, and drain cleaning.',
                handymanType: client_1.HandymanType.PLUMBING,
                basePrice: 85,
                priceUnit: 'per_hour',
                images: [],
            },
            {
                vendorId: michelleVendor.id,
                title: 'Electrical Services',
                description: 'Licensed electrical work including wiring, outlet installation, and lighting fixtures.',
                handymanType: client_1.HandymanType.ELECTRICAL,
                basePrice: 95,
                priceUnit: 'per_hour',
                images: [],
            },
            {
                vendorId: vendors[1].id,
                title: 'Furniture Assembly',
                description: 'Professional assembly for all types of furniture. IKEA specialists.',
                handymanType: client_1.HandymanType.INSTALLATION,
                basePrice: 65,
                priceUnit: 'per_item',
                images: [],
            },
            {
                vendorId: vendors[1].id,
                title: 'General Home Repairs',
                description: 'Drywall repair, painting touch-ups, door fixes, and more.',
                handymanType: client_1.HandymanType.GENERAL_REPAIR,
                basePrice: 75,
                priceUnit: 'per_hour',
                images: [],
            },
        ],
    });
    // Beauty Listings
    await prisma.beautyListing.createMany({
        data: [
            {
                vendorId: michelleVendor.id,
                title: 'Professional Makeup Application',
                description: 'Full glam makeup for events, weddings, or photoshoots. Includes consultation.',
                beautyType: client_1.BeautyType.MAKEUP,
                basePrice: 120,
                duration: 90,
                images: [],
                portfolio: [],
            },
            {
                vendorId: michelleVendor.id,
                title: 'Hair Styling & Cut',
                description: 'Expert hair styling including cuts, blowouts, and special occasion styles.',
                beautyType: client_1.BeautyType.HAIR,
                basePrice: 80,
                duration: 60,
                images: [],
                portfolio: [],
            },
            {
                vendorId: vendors[2].id,
                title: 'Manicure & Pedicure',
                description: 'Luxurious nail services including gel, acrylics, and nail art.',
                beautyType: client_1.BeautyType.NAILS,
                basePrice: 55,
                duration: 75,
                images: [],
                portfolio: [],
            },
            {
                vendorId: vendors[2].id,
                title: 'Wellness Massage',
                description: 'Relaxing massage therapy including Swedish, deep tissue, and aromatherapy.',
                beautyType: client_1.BeautyType.WELLNESS,
                basePrice: 90,
                duration: 60,
                images: [],
                portfolio: [],
            },
        ],
    });
    // Grocery Listings
    await prisma.groceryListing.createMany({
        data: [
            {
                vendorId: michelleVendor.id,
                name: 'Organic Produce Box',
                description: 'Weekly selection of fresh, organic fruits and vegetables',
                category: 'Fresh Produce',
                price: 45,
                unit: 'box',
                inStock: true,
                stockCount: 100,
            },
            {
                vendorId: michelleVendor.id,
                name: 'Farm Fresh Eggs',
                description: 'Free-range organic eggs, dozen',
                category: 'Dairy & Eggs',
                price: 8,
                unit: 'dozen',
                inStock: true,
                stockCount: 50,
            },
            {
                vendorId: vendors[3].id,
                name: 'Artisan Sourdough Bread',
                description: 'Freshly baked sourdough bread',
                category: 'Bakery',
                price: 7,
                unit: 'loaf',
                inStock: true,
                stockCount: 30,
            },
            {
                vendorId: vendors[3].id,
                name: 'Premium Ground Coffee',
                description: 'Single-origin Arabica beans, medium roast',
                category: 'Beverages',
                price: 18,
                unit: 'bag',
                inStock: true,
                stockCount: 40,
            },
            {
                vendorId: vendors[3].id,
                name: 'Greek Yogurt',
                description: 'Creamy Greek yogurt, plain',
                category: 'Dairy & Eggs',
                price: 6,
                unit: 'container',
                inStock: true,
                stockCount: 60,
            },
        ],
    });
    // Rental Listings
    await prisma.rentalListing.createMany({
        data: [
            {
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
            {
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
        ],
    });
    // Caregiving Listings
    await prisma.caregivingListing.createMany({
        data: [
            {
                vendorId: michelleVendor.id,
                title: 'Medical Appointment Transport',
                description: 'Safe, reliable transportation for doctor visits, pharmacy runs, and medical appointments. Door-to-door service with assistance.',
                caregivingType: client_1.CaregivingType.RIDE_ASSISTANCE,
                basePrice: 45,
                priceUnit: 'per_trip',
                serviceArea: ['10001', '10002', '10003', '10004', '10005'],
                images: [],
            },
            {
                vendorId: michelleVendor.id,
                title: 'Companion Care Services',
                description: 'Compassionate companionship including conversation, light activities, meal prep assistance, and general support.',
                caregivingType: client_1.CaregivingType.COMPANIONSHIP_SUPPORT,
                basePrice: 35,
                priceUnit: 'per_hour',
                serviceArea: ['10001', '10002', '10003', '10004', '10005'],
                images: [],
            },
            {
                vendorId: vendors[4].id,
                title: 'Senior Transportation',
                description: 'Specialized senior transport with wheelchair accessibility and patient assistance.',
                caregivingType: client_1.CaregivingType.RIDE_ASSISTANCE,
                basePrice: 40,
                priceUnit: 'per_trip',
                serviceArea: ['10001', '10002', '10003'],
                images: [],
            },
            {
                vendorId: vendors[4].id,
                title: 'Daily Companion Visits',
                description: 'Regular visits for companionship, light housekeeping, and medication reminders.',
                caregivingType: client_1.CaregivingType.COMPANIONSHIP_SUPPORT,
                basePrice: 30,
                priceUnit: 'per_hour',
                serviceArea: ['10001', '10002', '10003'],
                images: [],
            },
        ],
    });
    // Create Sample Customer
    const customerUser = await prisma.user.upsert({
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
            addresses: {
                create: [
                    {
                        type: client_1.AddressType.HOME,
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
                    {
                        type: client_1.AddressType.WORK,
                        label: 'Work',
                        street: '456 Office Park',
                        city: 'New York',
                        state: 'NY',
                        zipCode: '10002',
                        country: 'USA',
                        latitude: 40.7157,
                        longitude: -73.9864,
                    },
                    {
                        type: client_1.AddressType.DOCTOR,
                        label: 'Doctor',
                        street: '789 Medical Center',
                        city: 'New York',
                        state: 'NY',
                        zipCode: '10003',
                        country: 'USA',
                    },
                ],
            },
        },
    });
    console.log('✅ Seed completed successfully!');
    console.log(`Created admin user: ${adminUser.email}`);
    console.log(`Created ${vendors.length + 1} vendors`);
    console.log(`Created sample customer: ${customerUser.email}`);
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
