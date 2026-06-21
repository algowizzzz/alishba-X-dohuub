import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import api from "../../../services/api";
import {
  ArrowLeft,
  Pause,
  Play,
  Copy,
  Check,
  MapPin,
  Building2,
  Download,
  FileText,
  TrendingUp,
  Star,
  Package,
  BarChart3,
  Shield,
  CheckCircle2,
  X,
  DollarSign,
  Calendar,
  Bed,
  Bath,
  Users,
  Maximize2,
  Wifi,
  Utensils,
  Wind,
  Flame,
  Tv,
  Car,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface VendorData {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  businessType: string;
  logoUrl?: string;
  category: string;
  status: "active" | "pending" | "inactive" | "suspended" | "trial";
  joinedDate: string;
  trialDaysLeft?: number;
  stats: {
    totalRevenue: number;
    totalBookings: number;
    avgRating: number;
    reviewCount: number;
  };
  subscription: {
    plan: string;
    status: string;
    monthlyFee: number;
    nextBillingDate: string;
  };
  regions: {
    name: string;
    listingsCount: number;
    isActive: boolean;
  }[];
}

interface ServiceListing {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  basePrice: number;
  maxPrice?: number;
  pricingType: "fixed" | "hourly" | "range";
  duration?: string; // For hourly services: "1-2 hours", "2-3 hours", etc.
  thumbnail?: string;
  imageGallery: string[];
  whatsIncluded: string[];
  bookings: number;
  bookingTrend: number;
  isActive: boolean;
  regions: string[];
  rating?: number;
  reviews?: number;
  status: "published" | "draft";
  // Rental Properties specific fields
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  totalArea?: number;
  areaUnit?: string;
  amenities?: string[];
  // Ride Assistance specific fields
  vehicleTypes?: string[];
  specialFeatures?: string[];
}

// Mock data
const mockVendor: VendorData = {
  id: "1",
  businessName: "Sarah's Cleaning Co.",
  ownerName: "Sarah Johnson",
  email: "sarah@cleaningco.com",
  phone: "(555) 123-4567",
  address: "123 Main St, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Cleaning Services",
  status: "active",
  joinedDate: "2024-10-15",
  stats: {
    totalRevenue: 12450,
    totalBookings: 234,
    avgRating: 4.7,
    reviewCount: 45,
  },
  subscription: {
    plan: "Pro Plan",
    status: "Active",
    monthlyFee: 49,
    nextBillingDate: "2026-02-15",
  },
  regions: [
    { name: "New York, NY", listingsCount: 8, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 5, isActive: true },
  ],
};

const mockHandymanVendor: VendorData = {
  id: "2",
  businessName: "QuickFix Handyman",
  ownerName: "Mike Torres",
  email: "mike@quickfixhandyman.com",
  phone: "(555) 234-5678",
  address: "456 Oak Ave, Los Angeles, CA 90001",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Handyman Services",
  status: "active",
  joinedDate: "2024-09-20",
  stats: {
    totalRevenue: 15680,
    totalBookings: 189,
    avgRating: 4.9,
    reviewCount: 78,
  },
  subscription: {
    plan: "Basic Plan",
    status: "Active",
    monthlyFee: 29,
    nextBillingDate: "2026-02-20",
  },
  regions: [
    { name: "Los Angeles, CA", listingsCount: 8, isActive: true },
    { name: "Orange County, CA", listingsCount: 4, isActive: true },
  ],
};

const mockHandymanVendor2: VendorData = {
  id: "5",
  businessName: "Tech Repair Pro",
  ownerName: "David Chen",
  email: "support@techrepair.com",
  phone: "(555) 789-0123",
  address: "789 Elm St, New York, NY 10003",
  taxId: "XX-XXXXXXX",
  businessType: "Sole Proprietor",
  category: "Handyman Services",
  status: "suspended",
  joinedDate: "2024-08-10",
  stats: {
    totalRevenue: 8420,
    totalBookings: 102,
    avgRating: 3.2,
    reviewCount: 23,
  },
  subscription: {
    plan: "Basic Plan",
    status: "Suspended",
    monthlyFee: 29,
    nextBillingDate: "2026-02-10",
  },
  regions: [
    { name: "New York, NY", listingsCount: 4, isActive: true },
    { name: "Jersey City, NJ", listingsCount: 2, isActive: false },
  ],
};

const mockBeautyServicesVendor: VendorData = {
  id: "4",
  businessName: "Beauty Bliss Salon",
  ownerName: "Jessica Martinez",
  email: "hello@beautybliss.com",
  phone: "(555) 456-7890",
  address: "321 Park Ave, New York, NY 10022",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Beauty Services",
  status: "trial",
  joinedDate: "2025-01-01",
  trialDaysLeft: 3,
  stats: {
    totalRevenue: 4250,
    totalBookings: 45,
    avgRating: 4.8,
    reviewCount: 12,
  },
  subscription: {
    plan: "Trial",
    status: "Trial",
    monthlyFee: 0,
    nextBillingDate: "2026-01-11",
  },
  regions: [
    { name: "New York, NY", listingsCount: 5, isActive: true },
  ],
};

// Regular Beauty Services Vendor 2
const mockBeautyServicesVendor2: VendorData = {
  id: "31",
  businessName: "Urban Beauty Products",
  ownerName: "Marcus Johnson",
  email: "shop@urbanbeauty.com",
  phone: "(555) 789-0125",
  address: "456 Madison Ave, New York, NY 10022",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Beauty Services",
  status: "active",
  joinedDate: "2024-09-15",
  stats: {
    totalRevenue: 45200,
    totalBookings: 423,
    avgRating: 4.4,
    reviewCount: 67,
  },
  subscription: {
    plan: "Pro Plan",
    status: "Active",
    monthlyFee: 49,
    nextBillingDate: "2026-02-15",
  },
  regions: [
    { name: "New York, NY", listingsCount: 25, isActive: true },
  ],
};

// Michelle Beauty Services Profiles
const mockMichelleBeautyProfile1: VendorData = {
  id: "10",
  businessName: "Beauty by Michelle",
  ownerName: "Michelle Rodriguez",
  email: "beauty@dohuub.com",
  phone: "(555) 100-0010",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Beauty Services",
  status: "active",
  joinedDate: "2024-06-15",
  stats: {
    totalRevenue: 8920,
    totalBookings: 67,
    avgRating: 4.7,
    reviewCount: 32,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 5, isActive: true },
  ],
};

const mockMichelleBeautyProfile2: VendorData = {
  id: "11",
  businessName: "Glam Studio Mobile",
  ownerName: "Michelle Rodriguez",
  email: "glam@dohuub.com",
  phone: "(555) 100-0011",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Beauty Services",
  status: "active",
  joinedDate: "2024-05-20",
  stats: {
    totalRevenue: 15450,
    totalBookings: 134,
    avgRating: 4.9,
    reviewCount: 78,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 8, isActive: true },
    { name: "Los Angeles, CA", listingsCount: 4, isActive: true },
  ],
};

const mockMichelleBeautyProfile3: VendorData = {
  id: "12",
  businessName: "Michelle's Spa On-The-Go",
  ownerName: "Michelle Rodriguez",
  email: "spa@dohuub.com",
  phone: "(555) 100-0012",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Beauty Services",
  status: "active",
  joinedDate: "2024-04-10",
  stats: {
    totalRevenue: 18920,
    totalBookings: 189,
    avgRating: 4.8,
    reviewCount: 98,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 7, isActive: true },
    { name: "Los Angeles, CA", listingsCount: 5, isActive: true },
    { name: "Chicago, IL", listingsCount: 3, isActive: true },
  ],
};

// Michelle Beauty Products Profiles
const mockMichelleBeautyProductsProfile1: VendorData = {
  id: "13",
  businessName: "Glam Cosmetics Shop",
  ownerName: "Michelle Rodriguez",
  email: "glam@dohuub.com",
  phone: "(555) 100-0013",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Beauty Products",
  status: "active",
  joinedDate: "2024-03-15",
  stats: {
    totalRevenue: 23450,
    totalBookings: 234,
    avgRating: 4.8,
    reviewCount: 412,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 12, isActive: true },
    { name: "Los Angeles, CA", listingsCount: 8, isActive: true },
  ],
};

const mockMichelleBeautyProductsProfile2: VendorData = {
  id: "14",
  businessName: "Pure Skincare Boutique",
  ownerName: "Michelle Rodriguez",
  email: "skincare@dohuub.com",
  phone: "(555) 100-0014",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Beauty Products",
  status: "active",
  joinedDate: "2024-02-20",
  stats: {
    totalRevenue: 18920,
    totalBookings: 189,
    avgRating: 4.9,
    reviewCount: 356,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 15, isActive: true },
    { name: "Los Angeles, CA", listingsCount: 10, isActive: true },
    { name: "Chicago, IL", listingsCount: 6, isActive: true },
  ],
};

const mockMichelleBeautyProductsProfile3: VendorData = {
  id: "15",
  businessName: "Beauty Essentials by Michelle",
  ownerName: "Michelle Rodriguez",
  email: "essentials@dohuub.com",
  phone: "(555) 100-0015",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Beauty Products",
  status: "active",
  joinedDate: "2024-01-10",
  stats: {
    totalRevenue: 14500,
    totalBookings: 145,
    avgRating: 4.7,
    reviewCount: 267,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 8, isActive: true },
  ],
};

// Michelle Food Profiles
const mockMichelleFoodProfile1: VendorData = {
  id: "19",
  businessName: "Mama's Kitchen",
  ownerName: "Michelle Rodriguez",
  email: "mamaskitchen@dohuub.com",
  phone: "(555) 100-0019",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Food",
  status: "active",
  joinedDate: "2024-01-20",
  stats: {
    totalRevenue: 52400,
    totalBookings: 567,
    avgRating: 4.9,
    reviewCount: 312,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 15, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 10, isActive: true },
  ],
};

const mockMichelleFoodProfile2: VendorData = {
  id: "20",
  businessName: "Chef's Table by Michelle",
  ownerName: "Michelle Rodriguez",
  email: "chefstable@dohuub.com",
  phone: "(555) 100-0020",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Food",
  status: "active",
  joinedDate: "2024-02-10",
  stats: {
    totalRevenue: 48900,
    totalBookings: 478,
    avgRating: 4.8,
    reviewCount: 289,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 12, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 8, isActive: true },
    { name: "Queens, NY", listingsCount: 5, isActive: true },
  ],
};

const mockMichelleFoodProfile3: VendorData = {
  id: "21",
  businessName: "Homestyle Meals",
  ownerName: "Michelle Rodriguez",
  email: "homestyle@dohuub.com",
  phone: "(555) 100-0021",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Food",
  status: "active",
  joinedDate: "2024-03-05",
  stats: {
    totalRevenue: 33400,
    totalBookings: 334,
    avgRating: 4.7,
    reviewCount: 198,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 10, isActive: true },
  ],
};

// RENTAL PROPERTIES - Michelle's Stores
const mockMichelleRentalProfile1: VendorData = {
  id: "22",
  businessName: "Michelle's Properties",
  ownerName: "Michelle Rodriguez",
  email: "properties@dohuub.com",
  phone: "(555) 100-0022",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Rental Properties",
  status: "active",
  joinedDate: "2024-01-15",
  stats: {
    totalRevenue: 21750,
    totalBookings: 87,
    avgRating: 4.9,
    reviewCount: 123,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "Manhattan, New York, NY", listingsCount: 3, isActive: true },
    { name: "Brooklyn, New York, NY", listingsCount: 1, isActive: true },
    { name: "Queens, New York, NY", listingsCount: 1, isActive: true },
  ],
};

const mockMichelleRentalProfile2: VendorData = {
  id: "23",
  businessName: "Urban Stays by Michelle",
  ownerName: "Michelle Rodriguez",
  email: "urbanstays@dohuub.com",
  phone: "(555) 100-0023",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Rental Properties",
  status: "active",
  joinedDate: "2024-02-20",
  stats: {
    totalRevenue: 16000,
    totalBookings: 64,
    avgRating: 4.8,
    reviewCount: 89,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "Manhattan, New York, NY", listingsCount: 2, isActive: true },
    { name: "Brooklyn, New York, NY", listingsCount: 1, isActive: true },
  ],
};

const mockMichelleRentalProfile3: VendorData = {
  id: "24",
  businessName: "Cozy Rentals",
  ownerName: "Michelle Rodriguez",
  email: "cozyrentals@dohuub.com",
  phone: "(555) 100-0024",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Rental Properties",
  status: "active",
  joinedDate: "2024-03-10",
  stats: {
    totalRevenue: 11250,
    totalBookings: 45,
    avgRating: 4.7,
    reviewCount: 67,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "Jersey City, NJ", listingsCount: 2, isActive: true },
  ],
};

// RIDE ASSISTANCE - Michelle's Stores
const mockMichelleRideAssistanceProfile1: VendorData = {
  id: "25",
  businessName: "CareWheels Transportation",
  ownerName: "Michelle Rodriguez",
  email: "carewheels@dohuub.com",
  phone: "(555) 100-0025",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Ride Assistance",
  status: "active",
  joinedDate: "2024-04-05",
  stats: {
    totalRevenue: 14720,
    totalBookings: 92,
    avgRating: 4.9,
    reviewCount: 156,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 4, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 3, isActive: true },
  ],
};

const mockMichelleRideAssistanceProfile2: VendorData = {
  id: "26",
  businessName: "Senior Care Rides",
  ownerName: "Michelle Rodriguez",
  email: "seniorcarerides@dohuub.com",
  phone: "(555) 100-0026",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Ride Assistance",
  status: "active",
  joinedDate: "2024-03-20",
  stats: {
    totalRevenue: 20100,
    totalBookings: 134,
    avgRating: 4.8,
    reviewCount: 223,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 5, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 4, isActive: true },
    { name: "Queens, NY", listingsCount: 2, isActive: true },
  ],
};

const mockMichelleRideAssistanceProfile3: VendorData = {
  id: "27",
  businessName: "SafeTransit Solutions",
  ownerName: "Michelle Rodriguez",
  email: "safetransit@dohuub.com",
  phone: "(555) 100-0027",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Ride Assistance",
  status: "active",
  joinedDate: "2024-05-15",
  stats: {
    totalRevenue: 10050,
    totalBookings: 67,
    avgRating: 4.7,
    reviewCount: 98,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 3, isActive: true },
  ],
};

// Regular Ride Assistance Vendors
const mockRideAssistanceVendor1: VendorData = {
  id: "28",
  businessName: "CareWheels Transportation",
  ownerName: "Robert Johnson",
  email: "info@carewheels.com",
  phone: "(555) 789-0014",
  address: "789 Care Ave, New York, NY 10016",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Ride Assistance",
  status: "active",
  joinedDate: "2024-09-15",
  stats: {
    totalRevenue: 15600,
    totalBookings: 124,
    avgRating: 4.9,
    reviewCount: 187,
  },
  subscription: {
    plan: "Pro Plan",
    status: "Active",
    monthlyFee: 49,
    nextBillingDate: "2025-02-15",
  },
  regions: [
    { name: "New York, NY", listingsCount: 1, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 1, isActive: true },
  ],
};

const mockRideAssistanceVendor2: VendorData = {
  id: "29",
  businessName: "Senior Care Rides",
  ownerName: "Patricia Williams",
  email: "rides@seniorcare.com",
  phone: "(555) 789-0015",
  address: "456 Queens Blvd, Queens, NY 11101",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Ride Assistance",
  status: "active",
  joinedDate: "2024-10-08",
  stats: {
    totalRevenue: 12400,
    totalBookings: 98,
    avgRating: 4.8,
    reviewCount: 142,
  },
  subscription: {
    plan: "Basic Plan",
    status: "Active",
    monthlyFee: 29,
    nextBillingDate: "2025-02-08",
  },
  regions: [
    { name: "Queens, NY", listingsCount: 1, isActive: true },
    { name: "Manhattan, NY", listingsCount: 1, isActive: true },
  ],
};

const mockRideAssistanceVendor3: VendorData = {
  id: "30",
  businessName: "SafeTransit Solutions",
  ownerName: "David Chen",
  email: "contact@safetransit.com",
  phone: "(555) 789-0018",
  address: "123 Transit St, Manhattan, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Ride Assistance",
  status: "trial",
  joinedDate: "2025-01-03",
  trialDaysLeft: 7,
  stats: {
    totalRevenue: 3800,
    totalBookings: 76,
    avgRating: 4.9,
    reviewCount: 103,
  },
  subscription: {
    plan: "Trial",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "2025-01-10",
  },
  regions: [
    { name: "Manhattan, NY", listingsCount: 1, isActive: true },
  ],
};

// COMPANIONSHIP SUPPORT - Michelle's Stores
const mockMichelleCompanionshipProfile1: VendorData = {
  id: "32",
  businessName: "Caring Companions by Michelle",
  ownerName: "Michelle Rodriguez",
  email: "companions@dohuub.com",
  phone: "(555) 100-0032",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Companionship Support",
  status: "active",
  joinedDate: "2024-08-01",
  stats: {
    totalRevenue: 12800,
    totalBookings: 156,
    avgRating: 4.9,
    reviewCount: 87,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 5, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 3, isActive: true },
  ],
};

const mockMichelleCompanionshipProfile2: VendorData = {
  id: "33",
  businessName: "Michelle's Senior Care Network",
  ownerName: "Michelle Rodriguez",
  email: "seniorcare@dohuub.com",
  phone: "(555) 100-0033",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Companionship Support",
  status: "active",
  joinedDate: "2024-07-15",
  stats: {
    totalRevenue: 18600,
    totalBookings: 234,
    avgRating: 4.8,
    reviewCount: 145,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 6, isActive: true },
    { name: "Queens, NY", listingsCount: 4, isActive: true },
  ],
};

const mockMichelleCompanionshipProfile3: VendorData = {
  id: "34",
  businessName: "Compassionate Care Services",
  ownerName: "Michelle Rodriguez",
  email: "compassionate@dohuub.com",
  phone: "(555) 100-0034",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Companionship Support",
  status: "active",
  joinedDate: "2024-09-01",
  stats: {
    totalRevenue: 14200,
    totalBookings: 178,
    avgRating: 4.9,
    reviewCount: 112,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "Manhattan, NY", listingsCount: 4, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 3, isActive: true },
  ],
};

// Regular Companionship Support Vendors
const mockCompanionshipVendor1: VendorData = {
  id: "35",
  businessName: "Caring Hearts Companions",
  ownerName: "Sarah Thompson",
  email: "info@caringhearts.com",
  phone: "(555) 789-0019",
  address: "567 Care Blvd, New York, NY 10018",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Companionship Support",
  status: "active",
  joinedDate: "2024-08-10",
  stats: {
    totalRevenue: 19800,
    totalBookings: 167,
    avgRating: 4.9,
    reviewCount: 143,
  },
  subscription: {
    plan: "Pro Plan",
    status: "Active",
    monthlyFee: 49,
    nextBillingDate: "2025-02-10",
  },
  regions: [
    { name: "New York, NY", listingsCount: 1, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 1, isActive: true },
  ],
};

const mockCompanionshipVendor2: VendorData = {
  id: "36",
  businessName: "Golden Years Companionship",
  ownerName: "Michael Anderson",
  email: "hello@goldenyears.com",
  phone: "(555) 789-0020",
  address: "789 Senior Lane, Queens, NY 11102",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Companionship Support",
  status: "active",
  joinedDate: "2024-09-20",
  stats: {
    totalRevenue: 16500,
    totalBookings: 132,
    avgRating: 4.8,
    reviewCount: 98,
  },
  subscription: {
    plan: "Basic Plan",
    status: "Active",
    monthlyFee: 29,
    nextBillingDate: "2025-02-20",
  },
  regions: [
    { name: "Queens, NY", listingsCount: 1, isActive: true },
    { name: "Manhattan, NY", listingsCount: 1, isActive: true },
  ],
};

const mockCompanionshipVendor3: VendorData = {
  id: "37",
  businessName: "Friendship & Care Services",
  ownerName: "Lisa Martinez",
  email: "contact@friendshipcare.com",
  phone: "(555) 789-0021",
  address: "321 Companion St, Manhattan, NY 10002",
  taxId: "XX-XXXXXXX",
  businessType: "Sole Proprietor",
  category: "Companionship Support",
  status: "trial",
  joinedDate: "2025-01-04",
  trialDaysLeft: 6,
  stats: {
    totalRevenue: 4200,
    totalBookings: 45,
    avgRating: 4.9,
    reviewCount: 34,
  },
  subscription: {
    plan: "Trial",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "2025-01-11",
  },
  regions: [
    { name: "Manhattan, NY", listingsCount: 1, isActive: true },
  ],
};

// Regular Beauty Products Vendors
const mockBeautyProductsVendor1: VendorData = {
  id: "16",
  businessName: "Luxe Beauty Boutique",
  ownerName: "Sophia Martinez",
  email: "info@luxebeauty.com",
  phone: "(555) 456-7891",
  address: "456 Sunset Blvd, Los Angeles, CA 90028",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Beauty Products",
  status: "active",
  joinedDate: "2024-08-22",
  stats: {
    totalRevenue: 28900,
    totalBookings: 342,
    avgRating: 4.9,
    reviewCount: 156,
  },
  subscription: {
    plan: "Pro Plan",
    status: "Active",
    monthlyFee: 49,
    nextBillingDate: "2026-02-22",
  },
  regions: [
    { name: "Los Angeles, CA", listingsCount: 12, isActive: true },
  ],
};

const mockBeautyProductsVendor2: VendorData = {
  id: "17",
  businessName: "Natural Glow Cosmetics",
  ownerName: "Emma Chen",
  email: "contact@naturalglow.com",
  phone: "(555) 789-0124",
  address: "789 Michigan Ave, Chicago, IL 60611",
  taxId: "XX-XXXXXXX",
  businessType: "Sole Proprietor",
  category: "Beauty Products",
  status: "trial",
  joinedDate: "2025-01-02",
  trialDaysLeft: 5,
  stats: {
    totalRevenue: 6400,
    totalBookings: 78,
    avgRating: 4.6,
    reviewCount: 23,
  },
  subscription: {
    plan: "Trial",
    status: "Trial",
    monthlyFee: 0,
    nextBillingDate: "2026-01-09",
  },
  regions: [
    { name: "Chicago, IL", listingsCount: 8, isActive: true },
  ],
};

// Michelle Grocery Profiles
const mockMichelleGroceryProfile1: VendorData = {
  id: "7",
  businessName: "Fresh Harvest by Michelle",
  ownerName: "Michelle Rodriguez",
  email: "freshharvest@dohuub.com",
  phone: "(555) 100-0007",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Grocery",
  status: "active",
  joinedDate: "2024-04-10",
  stats: {
    totalRevenue: 18920,
    totalBookings: 178,
    avgRating: 4.7,
    reviewCount: 289,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 6, isActive: true },
    { name: "Los Angeles, CA", listingsCount: 4, isActive: true },
  ],
};

const mockMichelleGroceryProfile2: VendorData = {
  id: "8",
  businessName: "Organic Essentials Delivery",
  ownerName: "Michelle Rodriguez",
  email: "organic@dohuub.com",
  phone: "(555) 100-0008",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Grocery",
  status: "active",
  joinedDate: "2024-03-22",
  stats: {
    totalRevenue: 24560,
    totalBookings: 245,
    avgRating: 4.9,
    reviewCount: 412,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 8, isActive: true },
    { name: "Los Angeles, CA", listingsCount: 5, isActive: true },
    { name: "Chicago, IL", listingsCount: 3, isActive: true },
  ],
};

const mockMichelleGroceryProfile3: VendorData = {
  id: "9",
  businessName: "Michelle's Meal Prep & Groceries",
  ownerName: "Michelle Rodriguez",
  email: "mealprep@dohuub.com",
  phone: "(555) 100-0009",
  address: "DoHuub HQ, New York, NY 10001",
  taxId: "XX-XXXXXXX",
  businessType: "DoHuub Store",
  category: "Grocery",
  status: "active",
  joinedDate: "2024-02-15",
  stats: {
    totalRevenue: 15230,
    totalBookings: 67,
    avgRating: 4.6,
    reviewCount: 134,
  },
  subscription: {
    plan: "DoHuub Platform",
    status: "Active",
    monthlyFee: 0,
    nextBillingDate: "N/A",
  },
  regions: [
    { name: "New York, NY", listingsCount: 5, isActive: true },
  ],
};

// Regular Grocery Vendors
const mockGroceryVendor1: VendorData = {
  id: "18",
  businessName: "Green Valley Grocers",
  ownerName: "Robert Green",
  email: "info@greenvalley.com",
  phone: "(555) 234-8901",
  address: "234 Market St, Seattle, WA 98101",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Grocery",
  status: "active",
  joinedDate: "2024-07-15",
  stats: {
    totalRevenue: 32100,
    totalBookings: 412,
    avgRating: 4.8,
    reviewCount: 187,
  },
  subscription: {
    plan: "Pro Plan",
    status: "Active",
    monthlyFee: 49,
    nextBillingDate: "2026-02-15",
  },
  regions: [
    { name: "Seattle, WA", listingsCount: 15, isActive: true },
  ],
};

const mockGroceryVendor2: VendorData = {
  id: "19",
  businessName: "Farm Fresh Direct",
  ownerName: "Lisa Anderson",
  email: "contact@farmfreshdirect.com",
  phone: "(555) 345-9012",
  address: "567 Harvest Ln, Portland, OR 97201",
  taxId: "XX-XXXXXXX",
  businessType: "Sole Proprietor",
  category: "Grocery",
  status: "active",
  joinedDate: "2024-09-01",
  stats: {
    totalRevenue: 19800,
    totalBookings: 234,
    avgRating: 4.7,
    reviewCount: 98,
  },
  subscription: {
    plan: "Basic Plan",
    status: "Active",
    monthlyFee: 29,
    nextBillingDate: "2026-02-01",
  },
  regions: [
    { name: "Portland, OR", listingsCount: 10, isActive: true },
  ],
};

// Regular Food Vendors
const mockFoodVendor1: VendorData = {
  id: "11",
  businessName: "Golden Spoon Restaurant",
  ownerName: "James Chen",
  email: "info@goldenspoon.com",
  phone: "(555) 456-0123",
  address: "789 Culinary Ave, New York, NY 10012",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Food",
  status: "active",
  joinedDate: "2024-09-20",
  stats: {
    totalRevenue: 45600,
    totalBookings: 342,
    avgRating: 4.9,
    reviewCount: 267,
  },
  subscription: {
    plan: "Pro Plan",
    status: "Active",
    monthlyFee: 49,
    nextBillingDate: "2026-02-20",
  },
  regions: [
    { name: "New York, NY", listingsCount: 15, isActive: true },
    { name: "Brooklyn, NY", listingsCount: 8, isActive: true },
  ],
};

const mockFoodVendor2: VendorData = {
  id: "12",
  businessName: "Taste of India Kitchen",
  ownerName: "Priya Sharma",
  email: "orders@tasteofindia.com",
  phone: "(555) 567-1234",
  address: "456 Spice Rd, Los Angeles, CA 90015",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Food",
  status: "active",
  joinedDate: "2024-11-05",
  stats: {
    totalRevenue: 38900,
    totalBookings: 289,
    avgRating: 4.8,
    reviewCount: 198,
  },
  subscription: {
    plan: "Basic Plan",
    status: "Active",
    monthlyFee: 29,
    nextBillingDate: "2026-02-05",
  },
  regions: [
    { name: "Los Angeles, CA", listingsCount: 12, isActive: true },
  ],
};

const mockFoodVendor3: VendorData = {
  id: "13",
  businessName: "Vegan Delights Cafe",
  ownerName: "Emma Williams",
  email: "hello@vegandelights.com",
  phone: "(555) 678-2345",
  address: "123 Green St, San Francisco, CA 94102",
  taxId: "XX-XXXXXXX",
  businessType: "Sole Proprietor",
  category: "Food",
  status: "active",
  joinedDate: "2024-10-12",
  stats: {
    totalRevenue: 27800,
    totalBookings: 234,
    avgRating: 4.7,
    reviewCount: 156,
  },
  subscription: {
    plan: "Pro Plan",
    status: "Active",
    monthlyFee: 49,
    nextBillingDate: "2026-02-12",
  },
  regions: [
    { name: "San Francisco, CA", listingsCount: 10, isActive: true },
  ],
};

// Regular Rental Properties Vendor
const mockRentalPropertiesVendor: VendorData = {
  id: "6",
  businessName: "Cozy Home Rentals",
  ownerName: "David Thompson",
  email: "info@cozyhomerentals.com",
  phone: "(555) 789-3456",
  address: "567 Park Ave, New York, NY 10022",
  taxId: "XX-XXXXXXX",
  businessType: "LLC",
  category: "Rental Properties",
  status: "active",
  joinedDate: "2024-06-10",
  stats: {
    totalRevenue: 48500,
    totalBookings: 145,
    avgRating: 4.8,
    reviewCount: 208,
  },
  subscription: {
    plan: "Premium Plan",
    status: "Active",
    monthlyFee: 99,
    nextBillingDate: "2026-02-10",
  },
  regions: [
    { name: "Manhattan, New York, NY", listingsCount: 5, isActive: true },
    { name: "Brooklyn, New York, NY", listingsCount: 3, isActive: true },
    { name: "Queens, New York, NY", listingsCount: 2, isActive: true },
  ],
};

const mockVendorListings: ServiceListing[] = [
  {
    id: "1",
    name: "Premium Deep Cleaning",
    shortDescription: "Thorough deep cleaning for homes of all sizes with premium products",
    longDescription: "Our premium deep cleaning service provides a comprehensive clean of your entire home. We tackle every nook and cranny with professional equipment and eco-friendly products, ensuring your space is not just clean but healthy.",
    basePrice: 180,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional equipment & supplies",
      "Trained professionals",
      "Eco-friendly products available",
      "Quality guarantee",
      "All rooms deep cleaned",
      "Kitchen and bathrooms sanitized"
    ],
    bookings: 52,
    bookingTrend: 18,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY"],
    rating: 4.9,
    reviews: 38,
    status: "published"
  },
  {
    id: "2",
    name: "Regular Weekly Cleaning",
    shortDescription: "Affordable weekly maintenance cleaning to keep your home fresh",
    longDescription: "Stay on top of household chores with our convenient weekly cleaning service. We handle the routine cleaning tasks so you can focus on what matters most.",
    basePrice: 85,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional equipment & supplies",
      "Trained professionals",
      "Vacuuming and mopping",
      "Bathroom cleaning",
      "Kitchen tidying"
    ],
    bookings: 87,
    bookingTrend: 12,
    isActive: true,
    regions: ["New York, NY", "Brooklyn, NY"],
    rating: 4.8,
    reviews: 64,
    status: "published"
  },
  {
    id: "3",
    name: "Move-In/Move-Out Special",
    shortDescription: "Complete cleaning for properties during tenant transitions",
    longDescription: "Perfect for landlords and renters, our move-in/move-out service ensures properties are spotless for new occupants. We clean every surface, inside appliances, and leave the space move-in ready.",
    basePrice: 220,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Professional equipment & supplies",
      "Trained professionals",
      "Inside appliances cleaned",
      "Windows and fixtures",
      "Deep carpet cleaning",
      "Quality inspection"
    ],
    bookings: 23,
    bookingTrend: 8,
    isActive: true,
    regions: ["New York, NY"],
    rating: 5.0,
    reviews: 19,
    status: "published"
  }
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
  }
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
    bookings: 12,
    bookingTrend: 18,
    isActive: true,
    regions: ["New York, NY"],
    rating: 4.9,
    reviews: 9,
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
    bookings: 18,
    bookingTrend: 25,
    isActive: true,
    regions: ["New York, NY"],
    rating: 4.8,
    reviews: 11,
    status: "published"
  },
  {
    id: "3",
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
    bookings: 10,
    bookingTrend: 8,
    isActive: true,
    regions: ["New York, NY"],
    rating: 4.7,
    reviews: 7,
    status: "published"
  },
];

const mockBeautyProductsListings: ServiceListing[] = [
  {
    id: "1",
    name: "HD Foundation",
    shortDescription: "Full coverage liquid foundation with 12-hour wear",
    longDescription: "Our HD Foundation provides flawless, full coverage that lasts all day. Available in a wide range of shades to match every skin tone perfectly.",
    basePrice: 35,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Long-lasting formula",
      "Full coverage",
      "Wide shade range",
      "12-hour wear"
    ],
    bookings: 156,
    bookingTrend: 22,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.8,
    reviews: 89,
    status: "published"
  },
  {
    id: "2",
    name: "Luxury Lipstick Collection",
    shortDescription: "Premium matte lipstick in 15 stunning shades",
    longDescription: "Indulge in our luxury lipstick collection featuring rich, long-lasting color with a comfortable matte finish. Each shade is carefully crafted for maximum pigmentation.",
    basePrice: 28,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Matte finish",
      "15 available shades",
      "Long-lasting color",
      "High pigmentation"
    ],
    bookings: 203,
    bookingTrend: 18,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA", "Chicago, IL"],
    rating: 4.9,
    reviews: 124,
    status: "published"
  },
  {
    id: "3",
    name: "Eyeshadow Palette - Nude Collection",
    shortDescription: "12-shade neutral eyeshadow palette with mirror",
    longDescription: "Create endless looks with our versatile nude eyeshadow palette. Features 12 highly pigmented shades in matte and shimmer finishes, perfect for everyday wear.",
    basePrice: 45,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "12 eyeshadow shades",
      "Built-in mirror",
      "Matte & shimmer finishes",
      "Blendable formula"
    ],
    bookings: 98,
    bookingTrend: 12,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.7,
    reviews: 67,
    status: "published"
  },
  {
    id: "4",
    name: "Hydrating Face Serum",
    shortDescription: "Anti-aging serum with hyaluronic acid - 30ml",
    longDescription: "Our premium hydrating serum delivers deep moisture and reduces fine lines. Formulated with hyaluronic acid and vitamin C for radiant, youthful-looking skin.",
    basePrice: 52,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "30ml bottle",
      "Hyaluronic acid formula",
      "Vitamin C enriched",
      "Anti-aging benefits"
    ],
    bookings: 134,
    bookingTrend: 28,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA", "Chicago, IL"],
    rating: 5.0,
    reviews: 102,
    status: "published"
  }
];

const mockGroceryProductListings: ServiceListing[] = [
  {
    id: "1",
    name: "Fresh Bananas",
    shortDescription: "Ripe yellow bananas - premium quality",
    longDescription: "Fresh, ripe yellow bananas sourced from sustainable farms. Perfect for snacking, smoothies, or baking. Rich in potassium and naturally sweet.",
    basePrice: 2.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "1 lb fresh bananas",
      "Ripe and ready to eat",
      "Farm-fresh quality",
      "Sustainable sourcing"
    ],
    bookings: 234,
    bookingTrend: 15,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.8,
    reviews: 156,
    status: "published"
  },
  {
    id: "2",
    name: "Organic Avocados",
    shortDescription: "Creamy organic Hass avocados - pack of 4",
    longDescription: "Premium organic Hass avocados, perfectly ripe and ready to enjoy. Great for toast, salads, guacamole, or healthy snacks. Hand-selected for quality.",
    basePrice: 8.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "4 count pack",
      "100% organic",
      "Hand-selected quality",
      "Perfectly ripe"
    ],
    bookings: 198,
    bookingTrend: 22,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.9,
    reviews: 143,
    status: "published"
  },
  {
    id: "3",
    name: "Fresh Whole Milk",
    shortDescription: "Farm fresh whole milk - 1 gallon",
    longDescription: "Creamy, delicious whole milk from local dairy farms. Pasteurized and homogenized for safety and quality. Perfect for drinking, cooking, and baking.",
    basePrice: 5.49,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "1 gallon container",
      "Farm fresh",
      "Pasteurized",
      "Vitamin D fortified"
    ],
    bookings: 312,
    bookingTrend: 18,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA", "Chicago, IL"],
    rating: 4.7,
    reviews: 201,
    status: "published"
  },
  {
    id: "4",
    name: "Artisan Sourdough Bread",
    shortDescription: "Freshly baked artisan sourdough loaf",
    longDescription: "Traditional sourdough bread baked fresh daily. Made with natural starter, premium flour, and sea salt. Crusty exterior with a soft, tangy interior.",
    basePrice: 7.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "1 whole loaf",
      "Freshly baked daily",
      "Natural ingredients",
      "No preservatives"
    ],
    bookings: 167,
    bookingTrend: 28,
    isActive: true,
    regions: ["New York, NY"],
    rating: 5.0,
    reviews: 98,
    status: "published"
  },
  {
    id: "5",
    name: "Organic Mixed Greens",
    shortDescription: "Fresh organic salad mix - 5 oz container",
    longDescription: "A vibrant mix of organic lettuce, spinach, arugula, and other premium greens. Pre-washed and ready to enjoy. Perfect for healthy salads and sandwiches.",
    basePrice: 4.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "5 oz container",
      "100% organic",
      "Pre-washed",
      "Mixed varieties"
    ],
    bookings: 245,
    bookingTrend: 20,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.6,
    reviews: 134,
    status: "published"
  },
  {
    id: "6",
    name: "Free-Range Eggs",
    shortDescription: "Farm fresh free-range eggs - dozen",
    longDescription: "Premium free-range eggs from happy, healthy hens. Rich golden yolks and superior taste. Perfect for breakfast, baking, and cooking.",
    basePrice: 6.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "12 count carton",
      "Free-range hens",
      "Farm fresh",
      "Hormone-free"
    ],
    bookings: 289,
    bookingTrend: 16,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA", "Chicago, IL"],
    rating: 4.8,
    reviews: 187,
    status: "published"
  }
];

const mockFoodProductListings: ServiceListing[] = [
  {
    id: "1",
    name: "Chicken Tikka Masala",
    shortDescription: "Tender chicken in a creamy tomato-based curry sauce",
    longDescription: "Classic Indian dish featuring marinated chicken tikka pieces simmered in a rich, creamy tomato-based sauce with aromatic spices. Served with basmati rice and naan bread.",
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
    id: "2",
    name: "Spicy Thai Basil Chicken",
    shortDescription: "Stir-fried chicken with Thai basil, chilies, and vegetables",
    longDescription: "Authentic Thai street food favorite featuring tender chicken stir-fried with fresh Thai basil, bird's eye chilies, garlic, and crisp vegetables. Served with steamed jasmine rice.",
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
    id: "3",
    name: "Mediterranean Falafel Wrap",
    shortDescription: "Crispy falafel with hummus, fresh veggies, and tahini sauce",
    longDescription: "Delicious vegetarian wrap featuring crispy chickpea falafel, creamy hummus, fresh lettuce, tomatoes, cucumbers, and drizzled with tahini sauce. Wrapped in warm pita bread.",
    basePrice: 11.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Regular portion",
      "Mediterranean, Middle Eastern cuisines",
      "Vegetarian, Vegan option"
    ],
    bookings: 176,
    bookingTrend: 22,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA"],
    rating: 4.8,
    reviews: 121,
    status: "published"
  },
  {
    id: "4",
    name: "Classic Cheeseburger with Fries",
    shortDescription: "Juicy beef patty with cheese, lettuce, tomato, and crispy fries",
    longDescription: "All-American favorite featuring a perfectly grilled beef patty topped with melted cheddar, crisp lettuce, fresh tomato, pickles, and our special sauce. Served with golden crispy fries.",
    basePrice: 12.99,
    pricingType: "fixed",
    thumbnail: undefined,
    imageGallery: [],
    whatsIncluded: [
      "Regular portion",
      "American cuisine",
      "Includes french fries"
    ],
    bookings: 234,
    bookingTrend: 28,
    isActive: true,
    regions: ["New York, NY", "Los Angeles, CA", "Chicago, IL"],
    rating: 4.7,
    reviews: 167,
    status: "published"
  },
  {
    id: "5",
    name: "Vegan Buddha Bowl",
    shortDescription: "Quinoa, roasted vegetables, chickpeas, and tahini dressing",
    longDescription: "A nutritious and colorful bowl featuring fluffy quinoa, roasted seasonal vegetables, crispy chickpeas, fresh greens, avocado, and a creamy tahini-lemon dressing.",
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
    isActive: true,
    regions: ["San Francisco, CA", "Los Angeles, CA"],
    rating: 4.7,
    reviews: 98,
    status: "published"
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
    whatsIncluded: [],
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    totalArea: 850,
    areaUnit: "ft²",
    amenities: ["WiFi", "Kitchen", "Air Conditioning", "TV", "City View", "Elevator", "Heating"],
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
    whatsIncluded: [],
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    totalArea: 1400,
    areaUnit: "ft²",
    amenities: ["WiFi", "Kitchen", "Garden", "Free Parking", "Pet Friendly", "Washer", "Dryer", "Heating"],
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
    whatsIncluded: [],
    bedrooms: 0,
    bathrooms: 1,
    maxGuests: 2,
    totalArea: 550,
    areaUnit: "ft²",
    amenities: ["WiFi", "Kitchen", "Air Conditioning", "Waterfront View", "Gym Access", "Rooftop Access", "Self Check-in"],
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
    whatsIncluded: [],
    bedrooms: 2,
    bathrooms: 1.5,
    maxGuests: 5,
    totalArea: 1100,
    areaUnit: "ft²",
    amenities: ["WiFi", "Kitchen", "Doorman", "Elevator", "Smart Lock", "Air Conditioning", "Heating"],
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
    whatsIncluded: [],
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    totalArea: 700,
    areaUnit: "ft²",
    amenities: ["WiFi", "Kitchen", "Balcony", "Pool Access", "Waterfront View", "Free Parking", "Gym Access"],
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

const getStatusColor = (status: string) => {
  const colors: Record<string, { dot: string; text: string }> = {
    active: { dot: "bg-[#10B981]", text: "text-[#10B981]" },
    pending: { dot: "bg-[#F59E0B]", text: "text-[#F59E0B]" },
    inactive: { dot: "bg-[#9CA3AF]", text: "text-[#9CA3AF]" },
    suspended: { dot: "bg-[#DC2626]", text: "text-[#DC2626]" },
    trial: { dot: "bg-[#2E7AD9]", text: "text-[#2E7AD9]" },
  };
  return colors[status] || colors.inactive;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Active",
    pending: "Pending",
    inactive: "Inactive",
    suspended: "Suspended",
    trial: "Trial",
  };
  return labels[status] || status;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 rounded-lg hover:bg-[#F0F7FF] transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-[#10B981]" />
      ) : (
        <Copy className="w-4 h-4 text-[#6B7280]" />
      )}
    </button>
  );
}

function VendorListingCard({ listing, isProductListing, isRentalProperty, isRideAssistance, isCompanionshipSupport }: { listing: ServiceListing; isProductListing?: boolean; isRentalProperty?: boolean; isRideAssistance?: boolean; isCompanionshipSupport?: boolean }) {
  const [showDetails, setShowDetails] = useState(false);

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, JSX.Element> = {
      "WiFi": <Wifi className="w-4 h-4 text-[#1A1A2E]" />,
      "Kitchen": <Utensils className="w-4 h-4 text-[#1A1A2E]" />,
      "AC": <Wind className="w-4 h-4 text-[#1A1A2E]" />,
      "Air Conditioning": <Wind className="w-4 h-4 text-[#1A1A2E]" />,
      "Heating": <Flame className="w-4 h-4 text-[#1A1A2E]" />,
      "TV": <Tv className="w-4 h-4 text-[#1A1A2E]" />,
    };
    return iconMap[amenity] || <CheckCircle2 className="w-4 h-4 text-[#1A1A2E]" />;
  };

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
    <>
      <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-6 mb-5 hover:border-[#2E7AD9] hover:shadow-[0_4px_16px_rgba(46,122,217,0.20)] transition-all">
        <div className="flex gap-6">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {listing.thumbnail ? (
              <img
                src={listing.thumbnail}
                alt={listing.name}
                className="w-[180px] h-[180px] rounded-lg object-cover"
              />
            ) : (
              <div className="w-[180px] h-[180px] rounded-lg bg-white flex items-center justify-center">
                <Building2 className="w-12 h-12 text-[#9CA3AF]" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-[#1A1A2E] mb-1.5">{listing.name}</h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {listing.shortDescription}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-[rgba(46,122,217,0.25)]">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">💵 Price</p>
                <p className="text-sm font-semibold text-[#1A1A2E]">{formatPrice()}</p>
                {listing.duration && listing.pricingType === "hourly" && (
                  <p className="text-xs text-[#6B7280] mt-0.5">{listing.duration}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">📅 Bookings</p>
                <p className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-2">
                  {listing.bookings}
                  {listing.bookingTrend !== 0 && (
                    <span className={`text-xs font-normal ${listing.bookingTrend > 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                      {listing.bookingTrend > 0 ? '+' : ''}{listing.bookingTrend}%
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Status</p>
                <p className={`text-sm font-semibold flex items-center gap-1.5 ${listing.isActive ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                  <span className={`w-2 h-2 rounded-full ${listing.isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                  {listing.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {/* What's Included - Only show for services, not products */}
            {!isProductListing && listing.whatsIncluded && listing.whatsIncluded.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-[#1A1A2E] mb-2">What's Included:</p>
                <div className="flex flex-wrap gap-2">
                  {listing.whatsIncluded.slice(0, 3).map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#1A1A2E] text-xs rounded-lg"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                      {item}
                    </span>
                  ))}
                  {listing.whatsIncluded.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-1 text-[#6B7280] text-xs">
                      +{listing.whatsIncluded.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Rating & Regions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 text-xs text-[#6B7280]">
                {listing.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>{listing.rating} ({listing.reviews} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{listing.regions.length} region{listing.regions.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              {/* View Details Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-4 text-xs font-semibold"
                onClick={() => setShowDetails(true)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[rgba(46,122,217,0.25)] px-6 py-5 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Listing Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-[#F0F7FF] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Thumbnail */}
              {listing.thumbnail ? (
                <div className="w-full h-[300px] rounded-xl overflow-hidden">
                  <img
                    src={listing.thumbnail}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-[300px] rounded-xl bg-white flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-[#9CA3AF]" />
                </div>
              )}

              {/* Service Name & Status */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-[#1A1A2E]">{listing.name}</h3>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${listing.isActive ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#F0F7FF] text-[#6B7280]'}`}>
                    <span className={`w-2 h-2 rounded-full ${listing.isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                    {listing.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
                <p className="text-[15px] text-[#6B7280] leading-relaxed">{listing.shortDescription}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Price</span>
                  </div>
                  <p className="text-xl font-bold text-[#1A1A2E]">{formatPrice()}</p>
                  <p className="text-xs text-[#6B7280] mt-1 capitalize">{listing.pricingType} pricing</p>
                  {listing.duration && listing.pricingType === "hourly" && (
                    <p className="text-xs text-[#1A1A2E] font-semibold mt-1">Est: {listing.duration}</p>
                  )}
                </div>
                
                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Bookings</span>
                  </div>
                  <p className="text-xl font-bold text-[#1A1A2E]">{listing.bookings}</p>
                  {listing.bookingTrend !== 0 && (
                    <p className={`text-xs mt-1 font-semibold ${listing.bookingTrend > 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                      {listing.bookingTrend > 0 ? '↗' : '↘'} {listing.bookingTrend > 0 ? '+' : ''}{listing.bookingTrend}% this month
                    </p>
                  )}
                </div>

                <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                  <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
                    <Star className="w-4 h-4" />
                    <span>Rating</span>
                  </div>
                  {listing.rating ? (
                    <>
                      <p className="text-xl font-bold text-[#1A1A2E]">{listing.rating} ⭐</p>
                      <p className="text-xs text-[#6B7280] mt-1">{listing.reviews} reviews</p>
                    </>
                  ) : (
                    <p className="text-sm text-[#9CA3AF]">No ratings yet</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-bold text-[#1A1A2E] mb-3">Full Description</h4>
                <p className="text-[15px] text-[#6B7280] leading-relaxed">{listing.longDescription}</p>
              </div>

              {/* Property Details - Only for Rental Properties */}
              {isRentalProperty && (listing.bedrooms !== undefined || listing.bathrooms !== undefined || listing.maxGuests !== undefined || listing.totalArea !== undefined) && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-4">Property Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {listing.bedrooms !== undefined && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                        <Bed className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                        <div>
                          <p className="text-lg font-bold text-[#1A1A2E]">{listing.bedrooms}</p>
                          <p className="text-xs text-[#6B7280]">Bedrooms</p>
                        </div>
                      </div>
                    )}
                    
                    {listing.bathrooms !== undefined && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                        <Bath className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                        <div>
                          <p className="text-lg font-bold text-[#1A1A2E]">{listing.bathrooms}</p>
                          <p className="text-xs text-[#6B7280]">Bathrooms</p>
                        </div>
                      </div>
                    )}
                    
                    {listing.maxGuests !== undefined && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                        <Users className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                        <div>
                          <p className="text-lg font-bold text-[#1A1A2E]">{listing.maxGuests}</p>
                          <p className="text-xs text-[#6B7280]">Max Guests</p>
                        </div>
                      </div>
                    )}
                    
                    {listing.totalArea !== undefined && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                        <Maximize2 className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                        <div>
                          <p className="text-lg font-bold text-[#1A1A2E]">{listing.totalArea} {listing.areaUnit || 'ft²'}</p>
                          <p className="text-xs text-[#6B7280]">Area</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities - Only for Rental Properties */}
              {isRentalProperty && listing.amenities && listing.amenities.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-4">Amenities</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {listing.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="text-sm text-[#1A1A2E]">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Included - Special format for Ride Assistance */}
              {!isProductListing && isRideAssistance && listing.vehicleTypes && listing.specialFeatures && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-4">What's Included</h4>
                  
                  {/* Available Vehicle Types */}
                  <div className="mb-6">
                    <h5 className="text-[15px] font-semibold text-[#1A1A2E] mb-3">Available Vehicle Types</h5>
                    <div className="space-y-2">
                      {listing.vehicleTypes.map((vehicleType, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                        >
                          <Car className="w-5 h-5 text-[#1A1A2E] flex-shrink-0" />
                          <span className="text-[15px] text-[#1A1A2E]">{vehicleType}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Features */}
                  <div>
                    <h5 className="text-[15px] font-semibold text-[#1A1A2E] mb-3">Special Features</h5>
                    <ul className="space-y-2">
                      {listing.specialFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-[15px] text-[#1A1A2E]">
                          <span className="mt-1.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* What's Included - Standard format for other services */}
              {!isProductListing && !isRideAssistance && listing.whatsIncluded && listing.whatsIncluded.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-3">What's Included</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {listing.whatsIncluded.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                        <span className="text-sm text-[#1A1A2E]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Regions */}
              <div>
                <h4 className="text-lg font-bold text-[#1A1A2E] mb-3">Service Regions</h4>
                <div className="flex flex-wrap gap-2">
                  {listing.regions.map((region, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                    >
                      <MapPin className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-sm text-[#1A1A2E]">{region}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Gallery */}
              {listing.imageGallery && listing.imageGallery.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-3">Image Gallery</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {listing.imageGallery.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[rgba(46,122,217,0.25)] px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
                className="h-11 px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function VendorDetail() {
  const { id } = useParams();
  const location = useLocation();

  // Detect if this is a Michelle store based on the URL path
  const isMichelleStore = location.pathname.includes('/vendors/michelle/');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // State
  const [vendor, setVendor] = useState<VendorData>(() => {
    if (id === "2") return mockHandymanVendor;
    if (id === "3") return mockGroceryVendor1; // Green Valley Grocers
    if (id === "4") return mockBeautyServicesVendor;
    if (id === "5") return mockHandymanVendor2;
    if (id === "6") return mockRentalPropertiesVendor; // Cozy Home Rentals (regular vendor)
    if (id === "7") return mockGroceryVendor2; // Farm Fresh Direct
    if (id === "10") return mockMichelleBeautyProfile1;
    if (id === "11") return mockMichelleBeautyProfile2;
    if (id === "12") return mockMichelleBeautyProfile3;
    if (id === "13") return mockMichelleBeautyProductsProfile1; // Glam Cosmetics Shop
    if (id === "14") return mockMichelleBeautyProductsProfile2; // Pure Skincare Boutique
    if (id === "15") return mockMichelleBeautyProductsProfile3; // Beauty Essentials by Michelle
    if (id === "16") return mockBeautyProductsVendor1; // Luxe Beauty Boutique
    if (id === "17") return mockBeautyProductsVendor2; // Natural Glow Cosmetics
    if (id === "19") return mockMichelleFoodProfile1; // Mama's Kitchen
    if (id === "20") return mockMichelleFoodProfile2; // Chef's Table by Michelle
    if (id === "21") return mockMichelleFoodProfile3; // Homestyle Meals
    if (id === "22") return mockMichelleRentalProfile1; // Michelle's Properties
    if (id === "23") return mockMichelleRentalProfile2; // Urban Stays by Michelle
    if (id === "24") return mockMichelleRentalProfile3; // Cozy Rentals
    if (id === "25") return mockMichelleRideAssistanceProfile1; // CareWheels Transportation
    if (id === "26") return mockMichelleRideAssistanceProfile2; // Senior Care Rides
    if (id === "27") return mockMichelleRideAssistanceProfile3; // SafeTransit Solutions
    if (id === "28") return mockRideAssistanceVendor1; // CareWheels Transportation (regular vendor)
    if (id === "29") return mockRideAssistanceVendor2; // Senior Care Rides (regular vendor)
    if (id === "30") return mockRideAssistanceVendor3; // SafeTransit Solutions (regular vendor)
    if (id === "31") return mockBeautyServicesVendor2; // Urban Beauty Products (Beauty Services)
    if (id === "32") return mockMichelleCompanionshipProfile1; // Caring Companions by Michelle
    if (id === "33") return mockMichelleCompanionshipProfile2; // Michelle's Senior Care Network
    if (id === "34") return mockMichelleCompanionshipProfile3; // Compassionate Care Services
    if (id === "35") return mockCompanionshipVendor1; // Caring Hearts Companions (regular vendor)
    if (id === "36") return mockCompanionshipVendor2; // Golden Years Companionship (regular vendor)
    if (id === "37") return mockCompanionshipVendor3; // Friendship & Care Services (regular vendor)
    return mockVendor;
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [usingDemoData, setUsingDemoData] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get<{ success: boolean; data: any }>(`/api/v1/admin/vendors/${id}`)
      .then((r) => {
        const v = (r as any)?.data;
        if (!v) return;
        const profile = v.user?.profile;
        const ownerName = profile
          ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
          : v.user?.email?.split("@")[0] || "";
        const status =
          v.status === "SUSPENDED" ? "suspended"
          : v.subscriptionStatus === "TRIAL" ? "trial"
          : v.status === "PENDING" ? "pending"
          : v.isActive ? "active" : "inactive";
        const totalListings =
          (v._count?.cleaningListings || 0) +
          (v._count?.handymanListings || 0) +
          (v._count?.beautyListings || 0) +
          (v._count?.groceryListings || 0) +
          (v._count?.rentalListings || 0) +
          (v._count?.foodListings || 0) +
          (v._count?.beautyProductListings || 0) +
          (v._count?.rideAssistanceListings || 0) +
          (v._count?.companionshipListings || 0);

        setVendor((prev) => ({
          ...prev,
          id: v.id,
          businessName: v.businessName || prev.businessName,
          ownerName: ownerName || prev.ownerName,
          email: v.user?.email || v.contactEmail || prev.email,
          phone: v.user?.phone || v.contactPhone || prev.phone,
          status: status as any,
          joinedDate: v.createdAt || prev.joinedDate,
          stats: {
            totalRevenue: prev.stats.totalRevenue,
            totalBookings: v._count?.bookings || 0,
            avgRating: v.rating || 0,
            reviewCount: v._count?.reviews || 0,
          },
          regions: Array.isArray(v.stores)
            ? v.stores.flatMap((s: any) =>
                (s.regions || []).map((sr: any) => ({
                  name: sr.region
                    ? `${sr.region.city || sr.region.name}${sr.region.state ? `, ${sr.region.state}` : ""}`
                    : "",
                  listingsCount: totalListings,
                  isActive: sr.isActive ?? true,
                }))
              )
            : prev.regions,
        }));
        setUsingDemoData(false);
      })
      .catch(() => {
        // keep mock fallback
      });
  }, [id]);

  const statusColor = getStatusColor(vendor.status);

  const [statusBusy, setStatusBusy] = useState(false);
  const handleStatusChange = async (next: "active" | "suspended") => {
    if (!id) return;
    if (next === "suspended" && !window.confirm(`Suspend ${vendor.businessName}?`)) return;
    const apiStatus = next === "suspended" ? "SUSPENDED" : "APPROVED";
    setStatusBusy(true);
    try {
      await api.patch(`/api/v1/admin/vendors/${id}/status`, { status: apiStatus });
      setVendor((prev) => ({ ...prev, status: next }));
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to update vendor status");
    } finally {
      setStatusBusy(false);
    }
  };

  // Determine if this vendor is a handyman or beauty services category
  const isHandymanVendor = vendor.category === "Handyman Services";
  const isBeautyServicesVendor = vendor.category === "Beauty Services";
  const isBeautyProductsVendor = vendor.category === "Beauty Products";
  const isGroceryVendor = vendor.category === "Grocery";
  const isFoodVendor = vendor.category === "Food";
  const isRentalPropertiesVendor = vendor.category === "Rental Properties";
  const isRideAssistanceVendor = vendor.category === "Ride Assistance";
  const isCompanionshipSupportVendor = vendor.category === "Companionship Support";

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu={isMichelleStore ? "michelle" : "vendors"}
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Back Navigation */}
          <Link
            to={isMichelleStore ? "/admin/michelle-profiles" : "/admin/vendors"}
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] hover:underline mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isMichelleStore ? "Back to Michelle's Stores" : "Back to All Vendors"}
            </span>
            <span className="sm:hidden">
              {isMichelleStore ? "Back to Stores" : "Back to Vendors"}
            </span>
          </Link>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1A1A2E]">
              <span className="hidden sm:inline">Vendor Details: {vendor.businessName}</span>
              <span className="sm:hidden">Vendor Details</span>
            </h1>
          </div>

          {/* Header Section */}
          <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 lg:p-7 mb-6 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
              {/* Logo */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                {vendor.logoUrl ? (
                  <img
                    src={vendor.logoUrl}
                    alt={vendor.businessName}
                    className="w-20 h-20 lg:w-[100px] lg:h-[100px] rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 lg:w-[100px] lg:h-[100px] rounded-xl bg-white border border-[rgba(46,122,217,0.25)] flex items-center justify-center shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                    <Building2 className="w-10 h-10 lg:w-12 lg:h-12 text-[#9CA3AF]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl lg:text-[28px] font-bold text-[#1A1A2E] mb-2">
                      {vendor.businessName}
                    </h2>
                    {isMichelleStore && (
                      <div className="inline-flex items-center gap-1 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-2">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        Powered by DoHuub
                      </div>
                    )}
                    <p className="text-sm lg:text-base text-[#6B7280] mb-2">
                      {vendor.stats.reviewCount} reviews • {vendor.stats.avgRating} ⭐ average
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${statusColor.dot}`} />
                      <span className={`text-sm lg:text-base font-semibold ${statusColor.text}`}>
                        {getStatusLabel(vendor.status)}
                      </span>
                    </div>
                    <p className="text-sm lg:text-base text-[#6B7280] mb-1">
                      Owner: {vendor.ownerName}
                    </p>
                    <p className="text-sm lg:text-[15px] text-[#6B7280] mb-1">
                      🧹 {vendor.category}
                    </p>
                    <p className="text-xs lg:text-sm text-[#9CA3AF]">
                      Joined: {new Date(vendor.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {!isMichelleStore && (vendor.status === "active" || vendor.status === "trial" ? (
                    <Button
                      variant="outline"
                      disabled={statusBusy}
                      onClick={() => handleStatusChange("suspended")}
                      className="flex-1 sm:flex-none h-11 text-[#DC2626] border-[#FEE2E2] hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      {statusBusy ? "Suspending..." : "Suspend"}
                    </Button>
                  ) : vendor.status === "suspended" ? (
                    <Button
                      variant="outline"
                      disabled={statusBusy}
                      onClick={() => handleStatusChange("active")}
                      className="flex-1 sm:flex-none h-11 text-[#10B981] border-[#D1FAE5] hover:bg-[#D1FAE5] hover:text-[#10B981]"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {statusBusy ? "Restoring..." : "Unsuspend"}
                    </Button>
                  ) : null)}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop Tabs */}
            <div className="hidden lg:block">
              <TabsList className="w-full justify-start bg-white border border-[rgba(46,122,217,0.25)] rounded-t-xl h-[52px] p-0">
                <TabsTrigger value="overview" className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#2E7AD9] data-[state=active]:text-[#2E7AD9]">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="listings" className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#2E7AD9] data-[state=active]:text-[#2E7AD9]">
                  Listings
                </TabsTrigger>
                {!isMichelleStore && (
                  <TabsTrigger value="subscription" className="h-full px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#2E7AD9] data-[state=active]:text-[#2E7AD9]">
                    Subscription
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {/* Mobile Tab Selector */}
            <div className="lg:hidden mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="h-12 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="listings">Listings</SelectItem>
                  {!isMichelleStore && (
                    <SelectItem value="subscription">Subscription</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Tab Content Container */}
            <div className="bg-white border border-[rgba(46,122,217,0.25)] border-t-0 rounded-b-xl lg:rounded-t-none p-5 sm:p-6 lg:p-8">
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-8">
                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] mb-4">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 sm:p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Total Revenue</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] mb-1">
                        ${vendor.stats.totalRevenue.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-[#10B981]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+23%</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 sm:p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Total Bookings</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] mb-1">
                        {vendor.stats.totalBookings}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-[#10B981]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+15%</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 sm:p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Average Rating</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] mb-1">
                        {vendor.stats.avgRating} ⭐
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {vendor.stats.reviewCount} reviews
                      </p>
                    </div>

                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-lg p-4 sm:p-5 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <p className="text-xs uppercase text-[#6B7280] mb-2">Subscription</p>
                      <p className="text-2xl sm:text-[28px] font-bold text-[#1A1A2E] mb-1">
                        {vendor.subscription.status}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {vendor.subscription.plan}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] mb-4">
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-x-12">
                    {/* Business Name */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Business Name</label>
                      <div className="flex items-center">
                        <p className="text-base text-[#1A1A2E]">{vendor.businessName}</p>
                        <CopyButton text={vendor.businessName} />
                      </div>
                    </div>

                    {/* Owner Name */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Owner Name</label>
                      <p className="text-base text-[#1A1A2E]">{vendor.ownerName}</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Email</label>
                      <div className="flex items-center">
                        <a
                          href={`mailto:${vendor.email}`}
                          className="text-base text-[#2E7AD9] hover:underline"
                        >
                          {vendor.email}
                        </a>
                        <CopyButton text={vendor.email} />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Phone</label>
                      <div className="flex items-center">
                        <a
                          href={`tel:${vendor.phone}`}
                          className="text-base text-[#2E7AD9] hover:underline"
                        >
                          {vendor.phone}
                        </a>
                        <CopyButton text={vendor.phone} />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Business Address</label>
                      <div className="flex items-center">
                        <p className="text-base text-[#1A1A2E]">{vendor.address}</p>
                        <CopyButton text={vendor.address} />
                      </div>
                    </div>

                    {/* Tax ID */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Tax ID/EIN</label>
                      <p className="text-base text-[#1A1A2E]">{vendor.taxId}</p>
                    </div>

                    {/* Business Type */}
                    <div>
                      <label className="block text-sm text-[#6B7280] mb-1">Business Type</label>
                      <p className="text-base text-[#1A1A2E]">{vendor.businessType}</p>
                    </div>
                  </div>
                </div>

                {/* Active Regions */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E]">
                      Active Regions
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      Geographic areas where this vendor operates
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {vendor.regions.map((region, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[rgba(46,122,217,0.25)] rounded-lg shadow-[0_4px_16px_rgba(46,122,217,0.18)]"
                      >
                        <MapPin className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-sm text-[#1A1A2E]">{region.name}</span>
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span className="text-xs text-[#6B7280]">
                          {region.listingsCount} listings
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Listings Tab */}
              <TabsContent value="listings" className="mt-0">
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
                      {isRentalPropertiesVendor ? "Property Listings" : (isBeautyProductsVendor || isGroceryVendor || isFoodVendor) ? "Product Listings" : "Service Listings"}
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      {isRentalPropertiesVendor
                        ? "All active and inactive property listings from this vendor"
                        : (isBeautyProductsVendor || isGroceryVendor || isFoodVendor) 
                        ? "All active and inactive product offerings from this vendor" 
                        : "All active and inactive service offerings from this vendor"}
                    </p>
                  </div>
                  <div className="space-y-5">
                    {isHandymanVendor ? mockHandymanListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} />
                    )) : isBeautyServicesVendor ? mockBeautyServicesListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} />
                    )) : isBeautyProductsVendor ? mockBeautyProductsListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={true} />
                    )) : isGroceryVendor ? mockGroceryProductListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={true} />
                    )) : isFoodVendor ? mockFoodProductListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={true} />
                    )) : isRentalPropertiesVendor ? mockRentalPropertiesListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} isRentalProperty={true} />
                    )) : isRideAssistanceVendor ? mockRideAssistanceListings
                      .filter((listing) => {
                        // Filter for Michelle profiles - one listing per store
                        if (id === "25") return listing.id === "1"; // CareWheels
                        if (id === "26") return listing.id === "2"; // Senior Care Rides
                        if (id === "27") return listing.id === "3"; // SafeTransit
                        // For regular vendors (28, 29, 30), show the corresponding listing
                        if (id === "28") return listing.id === "1"; // CareWheels
                        if (id === "29") return listing.id === "2"; // Senior Care Rides
                        if (id === "30") return listing.id === "3"; // SafeTransit
                        return true;
                      })
                      .map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} isRideAssistance={true} />
                    )) : isCompanionshipSupportVendor ? mockCompanionshipSupportListings
                      .filter((listing) => {
                        // Filter for Michelle profiles - one listing per store
                        if (id === "32") return listing.id === "1"; // Caring Companions
                        if (id === "33") return listing.id === "2"; // Senior Care Network
                        if (id === "34") return listing.id === "3"; // Compassionate Care
                        // For regular vendors (35, 36, 37), show the corresponding listing
                        if (id === "35") return listing.id === "1"; // Caring Hearts
                        if (id === "36") return listing.id === "2"; // Golden Years
                        if (id === "37") return listing.id === "3"; // Friendship & Care
                        return true;
                      })
                      .map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} isCompanionshipSupport={true} />
                    )) : mockVendorListings.map((listing) => (
                      <VendorListingCard key={listing.id} listing={listing} isProductListing={false} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="mt-0">
                <div className="space-y-6">
                  {/* Current Subscription */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#1A1A2E]">Current Subscription</h3>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-[#10B981]" />
                        <span className="text-base font-semibold text-[#10B981]">Active</span>
                      </div>
                    </div>

                    {/* Plan Details Card */}
                    <div className="bg-white border border-[rgba(46,122,217,0.25)] rounded-xl p-5 sm:p-6 mb-4 shadow-[0_4px_16px_rgba(46,122,217,0.18)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Plan</p>
                          <p className="text-lg font-bold text-[#1A1A2E]">Yearly Subscription</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Price</p>
                          <p className="text-lg font-bold text-[#1A1A2E]">$39.00/month</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Billing</p>
                          <p className="text-base text-[#1A1A2E]">Billed $468 annually</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Next Billing</p>
                          <p className="text-base text-[#1A1A2E]">
                            Feb 15, 2026 <span className="text-[#6B7280]">(in 41 days)</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Subscription Start</p>
                          <p className="text-base text-[#1A1A2E]">Jan 15, 2025</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Duration</p>
                          <p className="text-base text-[#1A1A2E]">12 months</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}