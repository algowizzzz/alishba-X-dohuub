import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  MapPin,
  Star,
  Building2,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface ServiceListing {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  basePrice: number;
  maxPrice?: number;
  pricingType: "fixed" | "hourly" | "range";
  duration?: string; // For hourly services
  thumbnail?: string;
  imageGallery: string[];
  whatsIncluded: string[];
  vehicleTypes?: string[]; // For Ride Assistance category
  specialFeatures?: string[]; // For Ride Assistance category
  bookings: number;
  bookingTrend: number;
  isActive: boolean;
  regions: string[];
  rating?: number;
  reviews?: number;
  status: "published" | "draft";
}

const mockListings: ServiceListing[] = [
  {
    id: "1",
    name: "Deep Cleaning Service",
    shortDescription: "Complete top-to-bottom home cleaning for a spotless living space",
    longDescription: "Our comprehensive deep cleaning service includes detailed cleaning of all rooms, bathrooms, kitchen, and common areas. We use professional-grade equipment and eco-friendly products to ensure your home is not just clean, but healthy and safe for your family.",
    basePrice: 150,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional equipment & supplies",
      "Trained professionals",
      "Eco-friendly products available",
      "Quality guarantee",
      "All rooms and bathrooms",
      "Kitchen deep cleaning"
    ],
    bookings: 45,
    bookingTrend: 12,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA", "Chicago, IL"],
    rating: 4.8,
    reviews: 23,
    status: "published"
  },
  {
    id: "2",
    name: "Regular Cleaning (Weekly)",
    shortDescription: "Weekly maintenance cleaning to keep your space fresh and tidy",
    longDescription: "Our regular cleaning service is designed to maintain the cleanliness of your home on a weekly basis. We focus on key areas such as living rooms, bedrooms, bathrooms, and kitchens to ensure your home remains fresh and inviting.",
    basePrice: 80,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional equipment & supplies",
      "Trained professionals",
      "Eco-friendly products available",
      "Living rooms and bedrooms",
      "Bathrooms and kitchens"
    ],
    bookings: 67,
    bookingTrend: 8,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX"],
    rating: 4.9,
    reviews: 45,
    status: "published"
  },
  {
    id: "3",
    name: "Move-Out Cleaning",
    shortDescription: "Complete cleaning for moving out, includes appliances and deep cleaning of all areas",
    longDescription: "Our move-out cleaning service is perfect for preparing your home for a new tenant or a fresh start. We clean all areas thoroughly, including appliances, to ensure your home is left in pristine condition.",
    basePrice: 200,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional equipment & supplies",
      "Trained professionals",
      "All appliances cleaned",
      "Deep cleaning all areas",
      "Quality guarantee"
    ],
    bookings: 18,
    bookingTrend: -5,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 5.0,
    reviews: 12,
    status: "published"
  },
  {
    id: "4",
    name: "Office Cleaning",
    shortDescription: "Professional office space cleaning for small to medium businesses",
    longDescription: "Our office cleaning service is tailored to meet the needs of small to medium-sized businesses. We provide thorough cleaning of all office areas, including desks, conference rooms, and common spaces.",
    basePrice: 120,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional equipment & supplies",
      "Trained professionals",
      "Desks and workstations",
      "Conference rooms",
      "Common areas"
    ],
    bookings: 32,
    bookingTrend: 15,
    isActive: true,
    regions: ["New York, NY", "Chicago, IL"],
    status: "published"
  },
  {
    id: "5",
    name: "Carpet Cleaning",
    shortDescription: "Professional carpet steam cleaning for all room sizes",
    longDescription: "Our carpet cleaning service uses advanced steam cleaning technology to remove deep-set stains and odors from carpets of all sizes. We ensure your carpets are left clean and fresh.",
    basePrice: 150,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional equipment & supplies",
      "Trained professionals",
      "Steam cleaning technology",
      "Stain removal",
      "Odor elimination"
    ],
    bookings: 8,
    bookingTrend: -2,
    isActive: false,
    regions: ["New York, NY"],
    status: "draft"
  },
];

const mockHandymanListings: ServiceListing[] = [
  {
    id: "1",
    name: "Plumbing Repair & Fixes",
    shortDescription: "Expert plumbing repairs for leaks, clogs, and fixture installations",
    longDescription: "Our skilled handyman professionals handle all your plumbing needs, from fixing leaky faucets and toilets to unclogging drains and installing new fixtures. We arrive with all necessary tools and parts to get the job done right the first time.",
    basePrice: 85,
    pricingType: "hourly",
    duration: "1-2 hours",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Tools & equipment provided",
      "Skilled handyman professional",
      "Quality workmanship guarantee",
      "Clean-up after service",
      "Parts & materials sourcing"
    ],
    bookings: 43,
    bookingTrend: 15,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY", "Queens, NY"],
    rating: 4.9,
    reviews: 29,
    status: "published"
  },
  {
    id: "2",
    name: "Furniture Assembly Service",
    shortDescription: "Professional assembly for all furniture brands and types",
    longDescription: "Save time and frustration with our expert furniture assembly service. We assemble all types of furniture including beds, desks, shelving units, and more. All tools provided, and we'll clean up the packaging when we're done.",
    basePrice: 75,
    pricingType: "hourly",
    duration: "1-3 hours",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Tools & equipment provided",
      "Skilled handyman professional",
      "Quality workmanship guarantee",
      "Packaging removal",
      "Furniture placement assistance"
    ],
    bookings: 67,
    bookingTrend: 22,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY"],
    rating: 4.8,
    reviews: 51,
    status: "published"
  },
  {
    id: "3",
    name: "Drywall Repair & Painting",
    shortDescription: "Professional drywall patching and painting services",
    longDescription: "Fix holes, cracks, and imperfections in your walls with our drywall repair service. We patch, sand, and paint to match your existing walls perfectly. Ideal for moving out, preparing for sale, or general home maintenance.",
    basePrice: 95,
    pricingType: "hourly",
    duration: "2-4 hours",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Tools & equipment provided",
      "Skilled handyman professional",
      "Quality workmanship guarantee",
      "Materials included",
      "Color matching service",
      "Surface preparation"
    ],
    bookings: 34,
    bookingTrend: 10,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY", "Queens, NY"],
    rating: 4.7,
    reviews: 23,
    status: "published"
  },
  {
    id: "4",
    name: "Electrical Repairs & Installation",
    shortDescription: "Safe and reliable electrical work for your home",
    longDescription: "From installing light fixtures and ceiling fans to replacing outlets and switches, our licensed professionals handle all your basic electrical needs safely and efficiently.",
    basePrice: 90,
    pricingType: "hourly",
    duration: "1-2 hours",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Tools & equipment provided",
      "Skilled handyman professional",
      "Quality workmanship guarantee",
      "Licensed & insured",
      "Safety inspection included"
    ],
    bookings: 28,
    bookingTrend: 8,
    isActive: true,
    regions: ["New York, NY", "Queens, NY"],
    rating: 5.0,
    reviews: 18,
    status: "published"
  },
  {
    id: "5",
    name: "Carpentry & Wood Work",
    shortDescription: "Custom carpentry and woodworking services for your home",
    longDescription: "From installing shelves and cabinets to building custom storage solutions, our experienced carpenters bring your vision to life with quality craftsmanship.",
    basePrice: 80,
    pricingType: "hourly",
    duration: "2-5 hours",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Tools & equipment provided",
      "Skilled handyman professional",
      "Quality workmanship guarantee",
      "Custom measurements",
      "Professional finish"
    ],
    bookings: 15,
    bookingTrend: -3,
    isActive: false,
    regions: ["New York, NY"],
    status: "draft"
  },
];

const mockBeautyServicesListings: ServiceListing[] = [
  {
    id: "1",
    name: "Professional Makeup",
    shortDescription: "Full professional makeup application for special events and occasions",
    longDescription: "Our certified beauty specialists provide complete professional makeup services using high-quality products. Perfect for weddings, photo shoots, special events, or any occasion where you want to look your absolute best.",
    basePrice: 120,
    pricingType: "hourly",
    duration: "60 mins",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional beauty products",
      "Certified beauty specialist",
      "Clean & hygienic setup",
      "Full face makeup application",
      "Lash application included"
    ],
    bookings: 52,
    bookingTrend: 18,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.9,
    reviews: 38,
    status: "published"
  },
  {
    id: "2",
    name: "Hair Styling & Blowout",
    shortDescription: "Professional hair styling and blowout services for any occasion",
    longDescription: "Transform your look with our professional hair styling and blowout service. Our beauty specialists work with all hair types to create stunning styles that last.",
    basePrice: 85,
    pricingType: "hourly",
    duration: "45 mins",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional beauty products",
      "Certified beauty specialist",
      "Clean & hygienic setup",
      "Wash and conditioning",
      "Heat protection products"
    ],
    bookings: 73,
    bookingTrend: 25,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA", "Chicago, IL"],
    rating: 4.8,
    reviews: 56,
    status: "published"
  },
  {
    id: "3",
    name: "Bridal Beauty Package",
    shortDescription: "Complete bridal beauty service including makeup and hair styling",
    longDescription: "Our signature bridal package includes full makeup application, hair styling, and a trial session to ensure you look perfect on your special day. We use premium products and provide touch-up kits.",
    basePrice: 280,
    pricingType: "hourly",
    duration: "120 mins",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional beauty products",
      "Certified beauty specialist",
      "Clean & hygienic setup",
      "Trial session included",
      "Touch-up kit provided",
      "Premium product usage"
    ],
    bookings: 28,
    bookingTrend: 12,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 5.0,
    reviews: 22,
    status: "published"
  },
  {
    id: "4",
    name: "Facial Treatment",
    shortDescription: "Relaxing facial treatment with deep cleansing and moisturizing",
    longDescription: "Rejuvenate your skin with our professional facial treatment. Includes deep cleansing, exfoliation, extractions, massage, and a custom mask tailored to your skin type.",
    basePrice: 95,
    pricingType: "hourly",
    duration: "60 mins",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional beauty products",
      "Certified beauty specialist",
      "Clean & hygienic setup",
      "Deep cleansing",
      "Custom mask treatment",
      "Facial massage"
    ],
    bookings: 41,
    bookingTrend: 8,
    isActive: true,
    regions: ["New York, NY", "Chicago, IL"],
    rating: 4.7,
    reviews: 31,
    status: "published"
  },
  {
    id: "5",
    name: "Manicure & Pedicure Combo",
    shortDescription: "Complete nail care service for hands and feet",
    longDescription: "Pamper yourself with our comprehensive manicure and pedicure combo. Includes nail shaping, cuticle care, exfoliation, massage, and polish application with your choice of colors.",
    basePrice: 75,
    pricingType: "hourly",
    duration: "90 mins",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional beauty products",
      "Certified beauty specialist",
      "Clean & hygienic setup",
      "Nail shaping & filing",
      "Polish application",
      "Hand & foot massage"
    ],
    bookings: 19,
    bookingTrend: -5,
    isActive: false,
    regions: ["New York, NY"],
    status: "draft"
  },
];

const mockBeautyProductsListings: ServiceListing[] = [
  {
    id: "1",
    name: "Lipstick",
    shortDescription: "Long-lasting lipstick in a variety of shades",
    longDescription: "Our lipsticks are formulated to provide long-lasting color and a comfortable wear. Available in a wide range of shades to suit any occasion.",
    basePrice: 15,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Long-lasting formula",
      "Comfortable wear",
      "Wide range of shades"
    ],
    bookings: 120,
    bookingTrend: 10,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.8,
    reviews: 50,
    status: "published"
  },
  {
    id: "2",
    name: "Foundation",
    shortDescription: "Lightweight foundation for a flawless finish",
    longDescription: "Our foundation is designed to provide a lightweight, natural-looking finish. Available in a range of shades to match your skin tone.",
    basePrice: 20,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Lightweight formula",
      "Natural-looking finish",
      "Range of shades"
    ],
    bookings: 95,
    bookingTrend: 5,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.7,
    reviews: 45,
    status: "published"
  },
  {
    id: "3",
    name: "Eyeshadow Palette",
    shortDescription: "Professional eyeshadow palette with 12 shades",
    longDescription: "Our eyeshadow palette includes 12 professional-grade shades for a variety of looks. Perfect for both beginners and professionals.",
    basePrice: 30,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "12 professional-grade shades",
      "Variety of looks",
      "Suitable for beginners and professionals"
    ],
    bookings: 70,
    bookingTrend: 3,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.6,
    reviews: 40,
    status: "published"
  },
  {
    id: "4",
    name: "Mascara",
    shortDescription: "Volume-boosting mascara for fuller lashes",
    longDescription: "Our mascara is designed to boost the volume and length of your lashes. Available in a range of shades to suit your eye color.",
    basePrice: 10,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Volume-boosting formula",
      "Fuller lashes",
      "Range of shades"
    ],
    bookings: 100,
    bookingTrend: 8,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.9,
    reviews: 55,
    status: "published"
  },
  {
    id: "5",
    name: "Nail Polish",
    shortDescription: "Long-lasting nail polish in a variety of shades",
    longDescription: "Our nail polish is formulated to provide long-lasting color and a smooth finish. Available in a wide range of shades to suit any occasion.",
    basePrice: 12,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Long-lasting formula",
      "Smooth finish",
      "Wide range of shades"
    ],
    bookings: 85,
    bookingTrend: 6,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.8,
    reviews: 48,
    status: "published"
  },
];

const mockGroceryProductListings: ServiceListing[] = [
  {
    id: "1",
    name: "Fresh Bananas",
    shortDescription: "Ripe yellow bananas, perfect for snacking or baking",
    longDescription: "Our fresh bananas are hand-picked at peak ripeness. Rich in potassium and naturally sweet, they're perfect for a healthy snack, smoothies, or your favorite banana bread recipe.",
    basePrice: 2.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "1 lb",
      "Fresh & ripe",
      "Rich in potassium"
    ],
    bookings: 145,
    bookingTrend: 12,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY"],
    rating: 4.8,
    reviews: 89,
    status: "published"
  },
  {
    id: "2",
    name: "Organic Avocados",
    shortDescription: "Creamy organic avocados, great for toast or guacamole",
    longDescription: "Premium organic avocados sourced from certified farms. Perfect for making guacamole, adding to salads, or spreading on toast. Rich in healthy fats and nutrients.",
    basePrice: 5.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "4 count",
      "Certified organic",
      "Creamy texture"
    ],
    bookings: 98,
    bookingTrend: 18,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY", "Queens, NY"],
    rating: 4.9,
    reviews: 67,
    status: "published"
  },
  {
    id: "3",
    name: "Whole Milk",
    shortDescription: "Fresh whole milk from local dairy farms",
    longDescription: "Farm-fresh whole milk delivered straight from local dairy farms. Rich, creamy, and packed with calcium and vitamin D. Perfect for drinking, cooking, or adding to your morning coffee.",
    basePrice: 4.49,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "1 gallon",
      "Locally sourced",
      "Rich in calcium"
    ],
    bookings: 234,
    bookingTrend: 8,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY"],
    rating: 4.7,
    reviews: 142,
    status: "published"
  },
  {
    id: "4",
    name: "Sourdough Bread",
    shortDescription: "Artisan sourdough bread baked fresh daily",
    longDescription: "Our artisan sourdough bread is made using traditional methods with natural fermentation. Baked fresh daily with a crispy crust and soft, tangy interior. Perfect for sandwiches or toast.",
    basePrice: 6.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "1 loaf",
      "Baked daily",
      "Natural ingredients"
    ],
    bookings: 167,
    bookingTrend: 22,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY", "Queens, NY"],
    rating: 5.0,
    reviews: 103,
    status: "published"
  },
  {
    id: "5",
    name: "Organic Baby Spinach",
    shortDescription: "Fresh organic baby spinach, pre-washed and ready to eat",
    longDescription: "Tender organic baby spinach leaves, carefully grown without pesticides. Pre-washed and ready to use in salads, smoothies, or cooking. Packed with iron, vitamins, and antioxidants.",
    basePrice: 3.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "5 oz bag",
      "Pre-washed",
      "Certified organic"
    ],
    bookings: 76,
    bookingTrend: -5,
    isActive: false,
    regions: ["New York, NY"],
    rating: 4.6,
    reviews: 45,
    status: "draft"
  },
];

const mockFoodProductListings: ServiceListing[] = [
  {
    id: "1",
    name: "Truffle Fettuccine Alfredo",
    shortDescription: "Creamy fettuccine pasta with white truffle oil and parmesan",
    longDescription: "Our signature truffle fettuccine alfredo features fresh pasta in a rich, creamy sauce infused with premium white truffle oil. Topped with freshly grated parmesan and cracked black pepper. A luxurious comfort food experience.",
    basePrice: 18.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Regular portion",
      "American, Italian cuisines",
      "Fresh ingredients"
    ],
    bookings: 234,
    bookingTrend: 38,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY"],
    rating: 4.9,
    reviews: 167,
    status: "published"
  },
  {
    id: "2",
    name: "Grilled Chicken with Rice & Veggies",
    shortDescription: "Marinated grilled chicken breast with jasmine rice and seasonal vegetables",
    longDescription: "Perfectly grilled chicken breast marinated in herbs and spices, served with fluffy jasmine rice and a medley of fresh seasonal vegetables. A healthy, protein-packed meal that's both delicious and nutritious.",
    basePrice: 14.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Regular portion",
      "American, Mediterranean cuisines",
      "Gluten-free option"
    ],
    bookings: 312,
    bookingTrend: 45,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY", "Queens, NY"],
    rating: 4.8,
    reviews: 223,
    status: "published"
  },
  {
    id: "3",
    name: "Spicy Thai Basil Chicken",
    shortDescription: "Stir-fried chicken with Thai basil, chilies, and vegetables",
    longDescription: "Authentic Thai street food favorite featuring tender chicken stir-fried with fresh Thai basil, bird's eye chilies, garlic, and crisp vegetables. Served with steamed jasmine rice. Adjust spice level to your preference.",
    basePrice: 13.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Regular portion",
      "Thai, Asian cuisines",
      "Customizable spice level"
    ],
    bookings: 198,
    bookingTrend: 29,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY"],
    rating: 4.9,
    reviews: 145,
    status: "published"
  },
  {
    id: "4",
    name: "Chicken Tikka Masala",
    shortDescription: "Tender chicken in a creamy tomato-based curry sauce",
    longDescription: "Classic Indian dish featuring marinated chicken tikka pieces simmered in a rich, creamy tomato-based sauce with aromatic spices. Served with basmati rice and naan bread. A comforting favorite that's mild yet flavorful.",
    basePrice: 15.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Regular portion",
      "Indian, Pakistani cuisines",
      "Includes rice & naan"
    ],
    bookings: 267,
    bookingTrend: 35,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY", "Queens, NY"],
    rating: 5.0,
    reviews: 189,
    status: "published"
  },
  {
    id: "5",
    name: "Vegan Buddha Bowl",
    shortDescription: "Quinoa, roasted vegetables, chickpeas, and tahini dressing",
    longDescription: "A nutritious and colorful bowl featuring fluffy quinoa, roasted seasonal vegetables, crispy chickpeas, fresh greens, avocado, and a creamy tahini-lemon dressing. Completely plant-based and packed with protein, fiber, and nutrients.",
    basePrice: 12.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Regular portion",
      "Vegan, Vegetarian, Healthy cuisines",
      "Gluten-free"
    ],
    bookings: 145,
    bookingTrend: 18,
    isActive: false,
    regions: ["New York, NY"],
    rating: 4.7,
    reviews: 98,
    status: "draft"
  },
];

const mockRentalPropertiesListings: ServiceListing[] = [
  {
    id: "1",
    name: "Luxury Downtown Apartment",
    shortDescription: "Modern 2BR apartment with stunning city views in the heart of Manhattan",
    longDescription: "Experience luxury living in this beautifully designed 2-bedroom apartment featuring floor-to-ceiling windows, premium appliances, and breathtaking skyline views. Located in prime downtown Manhattan with easy access to shops, restaurants, and public transportation.",
    basePrice: 250,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "2 Bedrooms, 1 Bathroom",
      "850 ft²",
      "WiFi, Kitchen, Air Conditioning",
      "City View"
    ],
    bookings: 45,
    bookingTrend: 18,
    isActive: true,
    regions: ["Manhattan, New York, NY"],
    rating: 4.9,
    reviews: 67,
    status: "published"
  },
  {
    id: "2",
    name: "Cozy Brooklyn Brownstone",
    shortDescription: "Charming 3BR brownstone with private garden in historic Brooklyn neighborhood",
    longDescription: "Step into this beautifully restored brownstone featuring original details, modern amenities, and a private garden. Perfect for families or groups seeking authentic Brooklyn charm with easy subway access to Manhattan.",
    basePrice: 320,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "3 Bedrooms, 2 Bathrooms",
      "1,400 ft²",
      "Garden, Free Parking, Pet Friendly",
      "Family/Kid Friendly"
    ],
    bookings: 38,
    bookingTrend: 12,
    isActive: true,
    regions: ["Brooklyn, New York, NY"],
    rating: 4.8,
    reviews: 52,
    status: "published"
  },
  {
    id: "3",
    name: "Modern Studio with River View",
    shortDescription: "Stylish studio apartment overlooking the East River with premium amenities",
    longDescription: "This contemporary studio offers breathtaking East River views, a fully equipped kitchen, and access to building amenities including gym and rooftop terrace. Ideal for solo travelers or couples.",
    basePrice: 180,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Studio, 1 Bathroom",
      "550 ft²",
      "Waterfront, Gym, Rooftop Access",
      "Self Check-in"
    ],
    bookings: 62,
    bookingTrend: 22,
    isActive: true,
    regions: ["Queens, New York, NY"],
    rating: 4.7,
    reviews: 89,
    status: "published"
  },
  {
    id: "4",
    name: "Spacious Midtown Loft",
    shortDescription: "Open-concept 2BR loft with high ceilings and designer finishes",
    longDescription: "This stunning loft features soaring 14-foot ceilings, exposed brick, and contemporary design throughout. Located steps from Times Square with all the best of NYC at your doorstep.",
    basePrice: 375,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "2 Bedrooms, 1.5 Bathrooms",
      "1,100 ft²",
      "Doorman, Elevator, Smart Lock",
      "Long-Term Stays Allowed"
    ],
    bookings: 28,
    bookingTrend: 8,
    isActive: true,
    regions: ["Manhattan, New York, NY"],
    rating: 5.0,
    reviews: 41,
    status: "published"
  },
  {
    id: "5",
    name: "Waterfront Condo with Balcony",
    shortDescription: "Elegant 1BR condo with private balcony and harbor views",
    longDescription: "Wake up to stunning harbor views from this elegant condo featuring a private balcony, modern kitchen, and access to building pool and fitness center. Perfect for a relaxing getaway.",
    basePrice: 220,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "1 Bedroom, 1 Bathroom",
      "700 ft²",
      "Balcony, Pool, Waterfront",
      "Free Parking"
    ],
    bookings: 15,
    bookingTrend: -3,
    isActive: false,
    regions: ["Jersey City, NJ"],
    rating: 4.6,
    reviews: 33,
    status: "draft"
  },
];

const mockRideAssistanceListings: ServiceListing[] = [
  {
    id: "1",
    name: "CareWheels Transportation",
    shortDescription: "Professional senior transportation services for medical appointments, errands, and social activities",
    longDescription: "CareWheels Transportation provides compassionate, reliable transportation services specifically designed for seniors and individuals needing assistance. Our trained drivers offer door-to-door service with mobility assistance, ensuring safe and comfortable travel to medical appointments, social events, shopping, and daily activities. We offer standard and wheelchair-accessible vehicles to meet all your transportation needs.",
    basePrice: 35,
    pricingType: "hourly",
    duration: "Flexible",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Trained caregiver driver",
      "Door-to-door service",
      "Mobility assistance",
      "Medical appointments",
      "Social & recreation trips",
      "Shopping & errands"
    ],
    vehicleTypes: ["Standard", "Wheelchair Accessible"],
    specialFeatures: [
      "Same-day booking",
      "Multiple stops included",
      "Pet-friendly options"
    ],
    bookings: 124,
    bookingTrend: 22,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY", "Queens, NY"],
    rating: 4.9,
    reviews: 187,
    status: "published"
  },
  {
    id: "2",
    name: "Senior Care Rides",
    shortDescription: "Specialized transportation for seniors with memory care and accessibility needs",
    longDescription: "Senior Care Rides offers specialized transportation services with a focus on memory care and accessibility. Our compassionate drivers are trained in dementia and Alzheimer's care, providing patient, understanding service that maintains familiar routines. We offer wheelchair-accessible vehicles and pet-friendly options to ensure comfortable, stress-free transportation for all your needs.",
    basePrice: 38,
    pricingType: "hourly",
    duration: "Flexible",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Memory care trained drivers",
      "Wheelchair accessible vehicles",
      "Patient, calm approach",
      "Family communication",
      "Pet-friendly service",
      "Flexible scheduling"
    ],
    vehicleTypes: ["Standard", "Pet-Friendly", "Wheelchair Accessible"],
    specialFeatures: [
      "Memory care trained drivers",
      "Flexible scheduling",
      "Family communication updates"
    ],
    bookings: 98,
    bookingTrend: 18,
    isActive: true,
    regions: ["New York, NY", "Queens, NY", "Manhattan, NY"],
    rating: 4.8,
    reviews: 142,
    status: "published"
  },
  {
    id: "3",
    name: "SafeTransit Solutions",
    shortDescription: "Premium transportation services with luxury and standard vehicle options",
    longDescription: "SafeTransit Solutions provides premium transportation services for seniors and individuals requiring specialized care. From everyday errands to special occasions, we offer both standard and luxury vehicles with professional, courteous drivers. Our services include airport transfers, medical appointments, social events, and long-distance travel, all delivered with the highest standards of safety and comfort.",
    basePrice: 40,
    pricingType: "hourly",
    duration: "Flexible",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional drivers",
      "Luxury & standard vehicles",
      "Airport transfers",
      "Long-distance travel",
      "Special event service",
      "Complimentary refreshments"
    ],
    vehicleTypes: ["Standard", "Luxury"],
    specialFeatures: [
      "Flight tracking included",
      "Complimentary refreshments",
      "Professional chauffeur service"
    ],
    bookings: 76,
    bookingTrend: 15,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY"],
    rating: 4.9,
    reviews: 103,
    status: "published"
  },
];

const mockCompanionshipSupportListings: ServiceListing[] = [
  {
    id: "1",
    name: "Maria Garcia - Certified Companion",
    shortDescription: "Experienced caregiver specializing in senior companionship and dementia care",
    longDescription: "Certified caregiver with 8 years of extensive experience in senior care and companionship. Specializes in dementia care, mobility assistance, and medication management. Provides compassionate support including conversation, light activities, meal preparation, and accompaniment to appointments.",
    basePrice: 35,
    pricingType: "hourly",
    duration: "Flexible",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Certified Nursing Assistant",
      "CPR & First Aid Certified",
      "Dementia Care Specialist",
      "Conversation & Social Interaction",
      "Light Activities & Games",
      "Medication Reminders"
    ],
    bookings: 156,
    bookingTrend: 24,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY"],
    rating: 4.9,
    reviews: 87,
    status: "published"
  },
  {
    id: "2",
    name: "Robert Chen - Senior Care Specialist",
    shortDescription: "Compassionate companion with expertise in mobility assistance and personal care",
    longDescription: "Dedicated senior care specialist with 10 years of experience providing personalized companionship services. Certified in mobility assistance and personal care, offering support with daily activities, errands, shopping, and social engagement. Fluent in English and Mandarin.",
    basePrice: 38,
    pricingType: "hourly",
    duration: "Flexible",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Mobility Assistance Certified",
      "CPR & First Aid",
      "Personal Care Assistance",
      "Errands & Shopping",
      "Meal Preparation Assistance",
      "Bilingual (English/Mandarin)"
    ],
    bookings: 234,
    bookingTrend: 35,
    isActive: true,
    regions: ["New York, NY", "Queens, NY"],
    rating: 4.8,
    reviews: 145,
    status: "published"
  },
  {
    id: "3",
    name: "Sarah Williams - Compassionate Caregiver",
    shortDescription: "Caring companion providing emotional support and daily living assistance",
    longDescription: "Warm and patient caregiver with 6 years of experience in companionship support. Specializes in providing emotional support, light housekeeping, and accompaniment to appointments. Creates meaningful connections while supporting independence and dignity.",
    basePrice: 32,
    pricingType: "hourly",
    duration: "Flexible",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "CPR & First Aid Certified",
      "Light Housekeeping",
      "Accompaniment to Appointments",
      "Conversation & Social Interaction",
      "Meal Preparation Assistance",
      "Pet-Friendly Care"
    ],
    bookings: 178,
    bookingTrend: 30,
    isActive: true,
    regions: ["Manhattan, NY", "Brooklyn, NY"],
    rating: 4.9,
    reviews: 112,
    status: "published"
  },
];

function ServiceListingCard({ listing }: { listing: ServiceListing }) {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [isActive, setIsActive] = useState(listing.isActive);
  const isRentalProperty = profileId === "22" || profileId === "23" || profileId === "24";

  const formatPrice = () => {
    if (listing.pricingType === "range" && listing.maxPrice) {
      return `$${listing.basePrice} - $${listing.maxPrice}${isRentalProperty ? "/night" : ""}`;
    } else if (listing.pricingType === "hourly") {
      return `$${listing.basePrice}/hour`;
    } else {
      return `$${listing.basePrice}${isRentalProperty ? "/night" : ""}`;
    }
  };

  return (
    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-4 sm:p-6 lg:p-7 mb-6 hover:border-[#2E7AD9] hover:shadow-[0_4px_16px_rgba(46,122,217,0.20)] transition-all">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-7">
        {/* Thumbnail Image */}
        <div className="flex-shrink-0">
          {listing.thumbnail ? (
            <img
              src={listing.thumbnail}
              alt={listing.name}
              className="w-full sm:w-[200px] h-[200px] rounded-lg object-cover"
            />
          ) : (
            <div className="w-full sm:w-[200px] h-[200px] rounded-lg bg-[#F8FAFF] flex items-center justify-center">
              <Building2 className="w-12 h-12 text-[#9CA3AF]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] mb-1.5 break-words">{listing.name}</h3>
              <p className="text-sm sm:text-[15px] text-[#6B7280] mb-4 leading-relaxed">
                {listing.shortDescription}
              </p>
            </div>
          </div>

          {/* Pricing & Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-[rgba(46,122,217,0.25)]">
            {/* Price */}
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">💵 Price</p>
              <p className="text-base font-semibold text-[#1A1A2E]">
                {formatPrice()}
              </p>
              {listing.duration && listing.pricingType === "hourly" && (
                <p className="text-xs text-[#6B7280] mt-0.5">Est: {listing.duration}</p>
              )}
            </div>

            {/* Bookings */}
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">📅 Bookings</p>
              <p className="text-base font-semibold text-[#1A1A2E] flex items-center gap-2">
                {listing.bookings}
                {listing.bookingTrend !== 0 && (
                  <span className={`text-[13px] font-normal ${listing.bookingTrend > 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                    {listing.bookingTrend > 0 ? '+' : ''}{listing.bookingTrend}%
                  </span>
                )}
              </p>
            </div>

            {/* Active Status */}
            <div>
              <p className="text-[13px] text-[#6B7280] mb-1">Status</p>
              <p className={`text-base font-semibold flex items-center gap-1.5 ${isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                {isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          {/* What's Included */}
          {listing.whatsIncluded && listing.whatsIncluded.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#1A1A2E] mb-2">What's Included:</p>
              <div className="flex flex-wrap gap-2">
                {listing.whatsIncluded.slice(0, 4).map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFF] text-[#1A1A2E] text-xs rounded-lg"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    {item}
                  </span>
                ))}
                {listing.whatsIncluded.length > 4 && (
                  <span className="inline-flex items-center px-3 py-1.5 text-[#6B7280] text-xs">
                    +{listing.whatsIncluded.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rating & Regions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-[#6B7280] mb-4 sm:mb-0">
            {listing.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{listing.rating} ({listing.reviews} reviews)</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>
                {listing.regions.length} region{listing.regions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-[140px]">
          <Button
            variant="outline"
            size="sm"
            className="h-10 justify-center sm:justify-start text-sm flex-1 sm:flex-none"
            onClick={() => navigate(`/admin/michelle-profiles/${profileId}/listings/edit/${listing.id}`)}
          >
            <Edit className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit Service</span>
            <span className="sm:hidden">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`h-10 justify-center sm:justify-start text-sm flex-1 sm:flex-none ${isActive ? 'text-[#DC2626] border-[#DC2626] hover:bg-[#FEE2E2]' : 'text-[#10B981] border-[#10B981] hover:bg-[#D1FAE5]'}`}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  const { profileId } = useParams();
  
  // Check if this is a Beauty Products or Grocery profile
  const isBeautyProductsProfile = profileId === "13" || profileId === "14" || profileId === "15";
  const isGroceryProfile = profileId === "7" || profileId === "8" || profileId === "9";
  const isFoodProfile = profileId === "19" || profileId === "20" || profileId === "21";
  const isRentalPropertiesProfile = profileId === "22" || profileId === "23" || profileId === "24";
  const isRideAssistanceProfile = profileId === "25" || profileId === "26" || profileId === "27";
  const isCompanionshipSupportProfile = profileId === "32" || profileId === "33" || profileId === "34";
  const isProductProfile = isBeautyProductsProfile || isGroceryProfile || isFoodProfile;

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-[120px] h-[120px] rounded-full bg-[#F8FAFF] flex items-center justify-center mb-6">
        <Building2 className="w-16 h-16 text-[rgba(46, 122, 217, 0.18)]" />
      </div>
      <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">
        {isRentalPropertiesProfile ? "No Properties Added Yet" : isProductProfile ? "No Products Added Yet" : "No Services Added Yet"}
      </h3>
      <p className="text-[15px] text-[#6B7280] mb-6 text-center max-w-md">
        {isRentalPropertiesProfile
          ? "Add your first rental property to start accepting bookings"
          : isFoodProfile
          ? "Create your first food item for this kitchen to start selling"
          : isProductProfile 
          ? "Create your first product listing for this shop to start selling"
          : "Create your first service offering for this profile to start accepting bookings"
        }
      </p>
      <Button
        onClick={() => navigate(`/admin/michelle-profiles/${profileId}/listings/create`)}
        className="h-11 px-6 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white"
      >
        <Plus className="w-5 h-5 mr-2" />
        {isRentalPropertiesProfile ? "Add First Property" : isRideAssistanceProfile ? "Add First Service" : isFoodProfile ? "Add First Food Item" : isProductProfile ? "Create First Product" : "Create First Service"}
      </Button>
    </div>
  );
}

export function ServiceListings() {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [filter, setFilter] = useState("all");
  const [showInactive, setShowInactive] = useState(false);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Determine which listings and profile data to show based on profileId
  // Profile IDs: "1", "2", "3" are Cleaning Services
  // Profile IDs: "4", "5", "6" are Handyman Services
  // Profile IDs: "10", "11", "12" are Beauty Services
  // Profile IDs: "13", "14", "15" are Beauty Products
  // Profile IDs: "7", "8", "9" are Grocery
  // Profile IDs: "19", "20", "21" are Food
  // Profile IDs: "22", "23", "24" are Rental Properties
  // Profile IDs: "25", "26", "27" are Ride Assistance
  const isCleaningProfile = profileId === "1" || profileId === "2" || profileId === "3";
  const isHandymanProfile = profileId === "4" || profileId === "5" || profileId === "6";
  const isBeautyServicesProfile = profileId === "10" || profileId === "11" || profileId === "12";
  const isBeautyProductsProfile = profileId === "13" || profileId === "14" || profileId === "15";
  const isGroceryProfile = profileId === "7" || profileId === "8" || profileId === "9";
  const isFoodProfile = profileId === "19" || profileId === "20" || profileId === "21";
  const isRentalPropertiesProfile = profileId === "22" || profileId === "23" || profileId === "24";
  const isRideAssistanceProfile = profileId === "25" || profileId === "26" || profileId === "27";
  const isCompanionshipSupportProfile = profileId === "32" || profileId === "33" || profileId === "34";
  
  const currentListings = isHandymanProfile
    ? mockHandymanListings
    : isBeautyServicesProfile
    ? mockBeautyServicesListings
    : isBeautyProductsProfile
    ? mockBeautyProductsListings
    : isGroceryProfile
    ? mockGroceryProductListings
    : isFoodProfile
    ? mockFoodProductListings
    : isRentalPropertiesProfile
    ? mockRentalPropertiesListings
    : isRideAssistanceProfile
    ? mockRideAssistanceListings.filter(listing => {
        // Profile 25 (CareWheels) -> Listing 1
        // Profile 26 (Senior Care Rides) -> Listing 2
        // Profile 27 (SafeTransit Solutions) -> Listing 3
        if (profileId === "25") return listing.id === "1";
        if (profileId === "26") return listing.id === "2";
        if (profileId === "27") return listing.id === "3";
        return false;
      })
    : isCompanionshipSupportProfile
    ? mockCompanionshipSupportListings.filter(listing => {
        // Profile 32 (Caring Companions) -> Listing 1
        // Profile 33 (Senior Care Network) -> Listing 2
        // Profile 34 (Compassionate Care) -> Listing 3
        if (profileId === "32") return listing.id === "1";
        if (profileId === "33") return listing.id === "2";
        if (profileId === "34") return listing.id === "3";
        return false;
      })
    : mockListings;
  
  // Mock profile data
  const getProfileInfo = () => {
    if (profileId === "1") return { name: "Sparkle Clean by Michelle", category: "🧹 Cleaning Services" };
    if (profileId === "2") return { name: "Michelle's Deep Clean Express", category: "🧹 Cleaning Services" };
    if (profileId === "3") return { name: "Green & Clean by Michelle", category: "🧹 Cleaning Services" };
    if (profileId === "4") return { name: "Fix-It Pro by Michelle", category: "🔧 Handyman Services" };
    if (profileId === "5") return { name: "Michelle's Home Repair Hub", category: "🔧 Handyman Services" };
    if (profileId === "6") return { name: "Handyman Express Solutions", category: "🔧 Handyman Services" };
    if (profileId === "7") return { name: "Fresh Harvest by Michelle", category: "🛒 Grocery" };
    if (profileId === "8") return { name: "Organic Essentials Delivery", category: "🛒 Grocery" };
    if (profileId === "9") return { name: "Michelle's Meal Prep & Groceries", category: "🛒 Grocery" };
    if (profileId === "10") return { name: "Beauty by Michelle", category: "💄 Beauty Services" };
    if (profileId === "11") return { name: "Glam Studio Mobile", category: "💄 Beauty Services" };
    if (profileId === "12") return { name: "Michelle's Spa On-The-Go", category: "💄 Beauty Services" };
    if (profileId === "13") return { name: "Glam Cosmetics Shop", category: "🛍️ Beauty Products" };
    if (profileId === "14") return { name: "Pure Skincare Boutique", category: "🛍️ Beauty Products" };
    if (profileId === "15") return { name: "Beauty Essentials by Michelle", category: "🛍️ Beauty Products" };
    if (profileId === "19") return { name: "Mama's Kitchen", category: "🍲 Food" };
    if (profileId === "20") return { name: "Chef's Table by Michelle", category: "🍲 Food" };
    if (profileId === "21") return { name: "Homestyle Meals", category: "🍲 Food" };
    if (profileId === "22") return { name: "Michelle's Properties", category: "🏠 Rental Properties" };
    if (profileId === "23") return { name: "Urban Stays by Michelle", category: "🏠 Rental Properties" };
    if (profileId === "24") return { name: "Cozy Rentals", category: "🏠 Rental Properties" };
    if (profileId === "25") return { name: "CareWheels Transportation", category: "🚗 Ride Assistance" };
    if (profileId === "26") return { name: "Senior Care Rides", category: "🚗 Ride Assistance" };
    if (profileId === "27") return { name: "SafeTransit Solutions", category: "🚗 Ride Assistance" };
    if (profileId === "32") return { name: "Caring Companions by Michelle", category: "🤝 Companionship Support" };
    if (profileId === "33") return { name: "Michelle's Senior Care Network", category: "🤝 Companionship Support" };
    if (profileId === "34") return { name: "Compassionate Care Services", category: "🤝 Companionship Support" };
    return { name: "Sparkle Clean by Michelle", category: "🧹 Cleaning Services" };
  };
  
  const { name: profileName, category: profileCategory } = getProfileInfo();
  
  const activeListings = currentListings.filter(l => l.isActive);
  const inactiveListings = currentListings.filter(l => !l.isActive);
  const totalBookings = currentListings.reduce((sum, l) => sum + l.bookings, 0);

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="michelle"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
        `}
      >
        <div className="max-w-[1400px]">
          {/* Back Navigation */}
          <Link
            to="/admin/michelle-profiles"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profiles
          </Link>

          {/* Page Header */}
          <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E] mb-4">
            Manage Listings: {profileName}
          </h1>

          {/* Profile Context */}
          <div className="bg-[#F8FAFF] border border-[rgba(46,122,217,0.25)] rounded-lg px-4 sm:px-5 py-4 mb-6 sm:mb-8 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm sm:text-base font-semibold text-[#1A1A2E] mb-1">
                  Profile: {profileName}
                </p>
                <p className="text-sm sm:text-[15px] text-[#6B7280]">
                  Category: {profileCategory}
                </p>
              </div>
              <div className="text-xs sm:text-sm text-[#6B7280] flex flex-wrap gap-2">
                <span>{currentListings.length} listings</span>
                <span className="hidden sm:inline">•</span>
                <span>{activeListings.length} active</span>
                <span className="hidden sm:inline">•</span>
                <span>{totalBookings} bookings</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          {currentListings.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 sm:mb-8">
              <Button
                onClick={() => navigate(`/admin/michelle-profiles/${profileId}/listings/create`)}
                className="h-11 px-6 bg-[#2E7AD9] hover:bg-[#1E5DB0] text-white font-semibold w-full sm:w-auto"
              >
                <Plus className="w-[18px] h-[18px] mr-2" />
                {isRentalPropertiesProfile ? "Add New Property" : isFoodProfile ? "Add New Food Item" : (isBeautyProductsProfile || isGroceryProfile) ? "Create New Product" : "Create New Service"}
              </Button>

              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-11">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRentalPropertiesProfile ? "All Properties" : isFoodProfile ? "All Food Items" : (isBeautyProductsProfile || isGroceryProfile) ? "All Products" : "All Services"}</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Listings */}
          {currentListings.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Active Listings */}
              {activeListings.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#1A1A2E] mb-5">
                    Active Listings ({activeListings.length})
                  </h2>
                  {activeListings.map((listing) => (
                    <ServiceListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}

              {/* Inactive Listings */}
              {inactiveListings.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowInactive(!showInactive)}
                    className="flex items-center gap-2 text-xl font-bold text-[#1A1A2E] mb-5 hover:text-[#1A1A2E] transition-colors"
                  >
                    <span>Inactive Listings ({inactiveListings.length})</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${showInactive ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showInactive && (
                    <div>
                      {inactiveListings.map((listing) => (
                        <ServiceListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}