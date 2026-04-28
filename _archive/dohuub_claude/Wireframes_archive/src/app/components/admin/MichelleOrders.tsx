import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import {
  Search,
  ChevronRight,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Package,
  Home,
  X,
  Wrench,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { DateRangePicker } from "../ui/date-range-picker";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

// Order type definitions
type OrderStatus = "accepted" | "in-progress" | "completed";
type OrderCategory = "service" | "grocery" | "food" | "rental" | "product";

interface BaseOrder {
  id: string;
  orderNumber: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  date: string;
  time: string;
  status: OrderStatus;
  category: OrderCategory;
}

interface ServiceOrder extends BaseOrder {
  category: "service";
  serviceName: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  duration: string;
  specialInstructions?: string;
}

interface GroceryOrder extends BaseOrder {
  category: "grocery" | "food";
  items: Array<{ name: string; quantity: number; price: number }>;
  itemCount: number;
  deliveryAddress: string;
  deliveryWindow: string;
  specialInstructions?: string;
}

interface RentalOrder extends BaseOrder {
  category: "rental";
  propertyName: string;
  propertyAddress: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

interface ProductOrder extends BaseOrder {
  category: "product";
  productName: string;
  quantity: number;
  shippingAddress: string;
  estimatedDelivery: string;
}

type Order = ServiceOrder | GroceryOrder | RentalOrder | ProductOrder;

export function MichelleOrders() {
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

  // Orders state
  const [activeTab, setActiveTab] = useState<OrderStatus>("accepted");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: parseISO("2026-01-01"),
    to: parseISO("2026-01-31"),
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Michelle orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response: any = await api.getOrders({ 
          isMichelle: true,
          status: activeTab === "accepted" ? "ACCEPTED" : activeTab === "in-progress" ? "IN_PROGRESS" : "COMPLETED"
        });
        const mappedOrders: Order[] = (response.orders || response || []).map((order: any) => {
          const baseOrder = {
            id: order.id,
            orderNumber: order.orderNumber || order.id,
            storeId: order.storeId || order.store?.id,
            storeName: order.storeName || order.store?.name,
            customerName: order.customer?.name || order.customerName,
            customerEmail: order.customer?.email || order.customerEmail,
            customerPhone: order.customer?.phone || order.customerPhone,
            total: order.total || 0,
            date: order.createdAt || order.date,
            time: order.scheduledTime || "TBD",
            status: (order.status?.toLowerCase() || "accepted") as OrderStatus,
          };

          // Map based on order type/category
          if (order.items?.length) {
            // Grocery/Food order
            return {
              ...baseOrder,
              category: (order.category || "grocery") as "grocery" | "food",
              items: order.items.map((item: any) => ({
                name: item.name || item.listing?.name,
                quantity: item.quantity || 1,
                price: item.price || item.unitPrice || 0,
              })),
              itemCount: order.items.length,
              deliveryAddress: order.address?.fullAddress || order.deliveryAddress || "",
              deliveryWindow: order.deliveryWindow || "TBD",
              specialInstructions: order.specialInstructions,
            } as GroceryOrder;
          } else if (order.propertyName || order.category === "rental") {
            // Rental order
            return {
              ...baseOrder,
              category: "rental" as const,
              propertyName: order.propertyName || order.listing?.title,
              propertyAddress: order.address?.fullAddress || order.propertyAddress || "",
              checkInDate: order.checkInDate || order.startDate,
              checkOutDate: order.checkOutDate || order.endDate,
              numberOfGuests: order.numberOfGuests || 1,
              specialRequests: order.specialRequests || order.specialInstructions,
            } as RentalOrder;
          } else if (order.productName || order.category === "product") {
            // Product order
            return {
              ...baseOrder,
              category: "product" as const,
              productName: order.productName || order.listing?.title,
              quantity: order.quantity || 1,
              shippingAddress: order.address?.fullAddress || order.shippingAddress || "",
              estimatedDelivery: order.estimatedDelivery || "TBD",
            } as ProductOrder;
          } else {
            // Service order
            return {
              ...baseOrder,
              category: "service" as const,
              serviceName: order.listing?.title || order.serviceName,
              serviceType: order.listing?.category || order.serviceType,
              scheduledDate: order.scheduledDate || order.date,
              scheduledTime: order.scheduledTime || "TBD",
              serviceAddress: order.address?.fullAddress || order.serviceAddress || "",
              duration: order.duration || "N/A",
              specialInstructions: order.specialInstructions,
            } as ServiceOrder;
          }
        });
        setOrders(mappedOrders);
      } catch (err: any) {
        console.error("Failed to fetch Michelle orders:", err);
        setError(err.response?.data?.error || "Failed to load orders. Please try again later.");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  // Get unique stores for filter with category
  const storesMap = new Map<string, { id: string; name: string; category: OrderCategory }>();
    // Fresh Market - Accepted
    {
      id: "3",
      orderNumber: "GRO-45678",
      storeId: "fresh-market",
      storeName: "Fresh Market",
      customerName: "Emily Rodriguez",
      customerEmail: "emily.r@email.com",
      customerPhone: "(555) 345-6789",
      total: 89.5,
      date: "2026-01-07",
      time: "9:15 AM",
      status: "accepted",
      category: "grocery",
      items: [
        { name: "Organic Apples (2lb)", quantity: 1, price: 8.99 },
        { name: "Fresh Salmon Fillet", quantity: 2, price: 24.99 },
        { name: "Whole Grain Bread", quantity: 1, price: 5.99 },
        { name: "Greek Yogurt (6-pack)", quantity: 1, price: 7.99 },
        { name: "Mixed Salad Greens", quantity: 2, price: 6.99 },
      ],
      itemCount: 5,
      deliveryAddress: "789 Pine Avenue, San Francisco, CA 94104",
      deliveryWindow: "2:00 PM - 4:00 PM",
      specialInstructions: "Please leave at front door if no answer",
    },
    // HomeStyle Rentals - Accepted
    {
      id: "4",
      orderNumber: "RNT-34567",
      storeId: "homestyle-rentals",
      storeName: "HomeStyle Rentals",
      customerName: "David Thompson",
      customerEmail: "d.thompson@email.com",
      customerPhone: "(555) 567-8901",
      total: 1200,
      date: "2026-01-07",
      time: "10:00 AM",
      status: "accepted",
      category: "rental",
      propertyName: "Downtown Loft",
      propertyAddress: "555 Mission Street, Unit 12B, San Francisco, CA 94106",
      checkInDate: "2026-01-10",
      checkOutDate: "2026-01-15",
      numberOfGuests: 2,
      specialRequests: "Early check-in if possible",
    },
    // HandyPro Services - Accepted
    {
      id: "5",
      orderNumber: "HND-56789",
      storeId: "handypro",
      storeName: "HandyPro Services",
      customerName: "Robert Chen",
      customerEmail: "r.chen@email.com",
      customerPhone: "(555) 234-5678",
      total: 275,
      date: "2026-01-07",
      time: "11:45 AM",
      status: "accepted",
      category: "service",
      serviceName: "Bathroom Fixture Installation",
      serviceType: "Handyman Services",
      scheduledDate: "2026-01-09",
      scheduledTime: "1:00 PM - 4:00 PM",
      serviceAddress: "890 Valencia Street, San Francisco, CA 94110",
      duration: "3 hours",
    },
    // Michelle's Gourmet Kitchen - Accepted
    {
      id: "6",
      orderNumber: "FD-23456",
      storeId: "gourmet-kitchen",
      storeName: "Michelle's Gourmet Kitchen",
      customerName: "Amanda Wilson",
      customerEmail: "a.wilson@email.com",
      customerPhone: "(555) 678-9012",
      total: 125.5,
      date: "2026-01-07",
      time: "12:30 PM",
      status: "accepted",
      category: "food",
      items: [
        { name: "Grilled Chicken Caesar Salad", quantity: 2, price: 18.99 },
        { name: "Mushroom Risotto", quantity: 1, price: 24.99 },
        { name: "Chocolate Lava Cake", quantity: 2, price: 12.99 },
        { name: "Fresh Lemonade", quantity: 3, price: 4.99 },
      ],
      itemCount: 4,
      deliveryAddress: "234 Hayes Street, San Francisco, CA 94102",
      deliveryWindow: "6:00 PM - 7:00 PM",
    },
    // CaringHands - Accepted
    {
      id: "7",
      orderNumber: "CG-67890",
      storeId: "caring-hands",
      storeName: "CaringHands",
      customerName: "Margaret Davis",
      customerEmail: "m.davis@email.com",
      customerPhone: "(555) 345-6789",
      total: 320,
      date: "2026-01-07",
      time: "8:00 AM",
      status: "accepted",
      category: "service",
      serviceName: "Senior Care - Day Shift",
      serviceType: "Caregiving Services",
      scheduledDate: "2026-01-08",
      scheduledTime: "8:00 AM - 4:00 PM",
      serviceAddress: "567 Geary Boulevard, San Francisco, CA 94118",
      duration: "8 hours",
      specialInstructions: "Patient requires medication assistance at noon",
    },
    // Glam Beauty Products - Accepted
    {
      id: "8",
      orderNumber: "PRD-78901",
      storeId: "glam-products",
      storeName: "Glam Beauty Products",
      customerName: "Sophia Lee",
      customerEmail: "s.lee@email.com",
      customerPhone: "(555) 456-7890",
      total: 185.99,
      date: "2026-01-07",
      time: "1:15 PM",
      status: "accepted",
      category: "product",
      productName: "Premium Skincare Bundle",
      quantity: 1,
      shippingAddress: "678 Mission Street, Apt 12, San Francisco, CA 94103",
      estimatedDelivery: "Jan 10-12, 2026",
    },
    // PetCare Plus - Accepted
    {
      id: "9",
      orderNumber: "PET-89012",
      storeId: "petcare-plus",
      storeName: "PetCare Plus",
      customerName: "James Taylor",
      customerEmail: "j.taylor@email.com",
      customerPhone: "(555) 567-8901",
      total: 95,
      date: "2026-01-07",
      time: "3:45 PM",
      status: "accepted",
      category: "service",
      serviceName: "Dog Walking & Care",
      serviceType: "Pet Care Services",
      scheduledDate: "2026-01-08",
      scheduledTime: "2:00 PM - 3:00 PM",
      serviceAddress: "789 Folsom Street, San Francisco, CA 94107",
      duration: "1 hour",
      specialInstructions: "Two dogs - friendly with other dogs",
    },
    // ========== IN PROGRESS ORDERS (8 stores) ==========
    // CleanCo Services - In Progress
    {
      id: "10",
      orderNumber: "CLN-12346",
      storeId: "cleanco",
      storeName: "CleanCo Services",
      customerName: "Michael Chen",
      customerEmail: "m.chen@email.com",
      customerPhone: "(555) 234-5678",
      total: 200,
      date: "2026-01-06",
      time: "11:30 AM",
      status: "in-progress",
      category: "service",
      serviceName: "Office Deep Clean",
      serviceType: "Commercial Cleaning",
      scheduledDate: "2026-01-07",
      scheduledTime: "6:00 PM - 10:00 PM",
      serviceAddress: "456 Market Street, Suite 300, San Francisco, CA 94103",
      duration: "4 hours",
    },
    // Beauty by Michelle - In Progress
    {
      id: "11",
      orderNumber: "BTY-78902",
      storeId: "beauty-michelle",
      storeName: "Beauty by Michelle",
      customerName: "Rachel Green",
      customerEmail: "r.green@email.com",
      customerPhone: "(555) 789-0123",
      total: 210,
      date: "2026-01-06",
      time: "9:00 AM",
      status: "in-progress",
      category: "service",
      serviceName: "Bridal Hair & Makeup",
      serviceType: "Beauty Services",
      scheduledDate: "2026-01-07",
      scheduledTime: "10:00 AM - 2:00 PM",
      serviceAddress: "901 Sacramento Street, San Francisco, CA 94108",
      duration: "4 hours",
    },
    // Fresh Market - In Progress
    {
      id: "12",
      orderNumber: "GRO-45679",
      storeId: "fresh-market",
      storeName: "Fresh Market",
      customerName: "Thomas Anderson",
      customerEmail: "t.anderson@email.com",
      customerPhone: "(555) 890-1234",
      total: 134.75,
      date: "2026-01-06",
      time: "2:00 PM",
      status: "in-progress",
      category: "grocery",
      items: [
        { name: "Organic Chicken Breast", quantity: 2, price: 18.99 },
        { name: "Fresh Vegetables Mix", quantity: 3, price: 12.99 },
        { name: "Quinoa (2lb)", quantity: 1, price: 14.99 },
        { name: "Almond Milk", quantity: 2, price: 8.99 },
        { name: "Free-Range Eggs (12)", quantity: 1, price: 6.99 },
      ],
      itemCount: 5,
      deliveryAddress: "456 Castro Street, San Francisco, CA 94114",
      deliveryWindow: "5:00 PM - 7:00 PM",
    },
    // HomeStyle Rentals - In Progress
    {
      id: "13",
      orderNumber: "RNT-34568",
      storeId: "homestyle-rentals",
      storeName: "HomeStyle Rentals",
      customerName: "Jennifer White",
      customerEmail: "j.white@email.com",
      customerPhone: "(555) 901-2345",
      total: 850,
      date: "2026-01-05",
      time: "3:30 PM",
      status: "in-progress",
      category: "rental",
      propertyName: "Cozy Studio Apartment",
      propertyAddress: "234 Noe Street, Unit 5A, San Francisco, CA 94114",
      checkInDate: "2026-01-06",
      checkOutDate: "2026-01-10",
      numberOfGuests: 1,
    },
    // HandyPro Services - In Progress
    {
      id: "14",
      orderNumber: "HND-56790",
      storeId: "handypro",
      storeName: "HandyPro Services",
      customerName: "Daniel Martinez",
      customerEmail: "d.martinez@email.com",
      customerPhone: "(555) 012-3456",
      total: 425,
      date: "2026-01-06",
      time: "8:00 AM",
      status: "in-progress",
      category: "service",
      serviceName: "Kitchen Cabinet Installation",
      serviceType: "Handyman Services",
      scheduledDate: "2026-01-07",
      scheduledTime: "9:00 AM - 5:00 PM",
      serviceAddress: "345 Divisadero Street, San Francisco, CA 94117",
      duration: "8 hours",
    },
    // Michelle's Gourmet Kitchen - In Progress
    {
      id: "15",
      orderNumber: "FD-23457",
      storeId: "gourmet-kitchen",
      storeName: "Michelle's Gourmet Kitchen",
      customerName: "Patricia Brown",
      customerEmail: "p.brown@email.com",
      customerPhone: "(555) 123-4567",
      total: 215.99,
      date: "2026-01-07",
      time: "4:30 PM",
      status: "in-progress",
      category: "food",
      items: [
        { name: "Prime Rib Dinner", quantity: 2, price: 42.99 },
        { name: "Lobster Mac & Cheese", quantity: 1, price: 32.99 },
        { name: "Caesar Salad", quantity: 2, price: 12.99 },
        { name: "Tiramisu", quantity: 2, price: 14.99 },
      ],
      itemCount: 4,
      deliveryAddress: "567 California Street, San Francisco, CA 94104",
      deliveryWindow: "7:00 PM - 8:00 PM",
    },
    // CaringHands - In Progress
    {
      id: "16",
      orderNumber: "CG-67891",
      storeId: "caring-hands",
      storeName: "CaringHands",
      customerName: "William Johnson",
      customerEmail: "w.johnson@email.com",
      customerPhone: "(555) 234-5678",
      total: 480,
      date: "2026-01-06",
      time: "6:00 AM",
      status: "in-progress",
      category: "service",
      serviceName: "Overnight Care Service",
      serviceType: "Caregiving Services",
      scheduledDate: "2026-01-07",
      scheduledTime: "8:00 PM - 8:00 AM",
      serviceAddress: "678 Lombard Street, San Francisco, CA 94133",
      duration: "12 hours",
    },
    // Glam Beauty Products - In Progress
    {
      id: "17",
      orderNumber: "PRD-78902",
      storeId: "glam-products",
      storeName: "Glam Beauty Products",
      customerName: "Olivia Davis",
      customerEmail: "o.davis@email.com",
      customerPhone: "(555) 345-6789",
      total: 142.50,
      date: "2026-01-06",
      time: "11:00 AM",
      status: "in-progress",
      category: "product",
      productName: "Luxury Haircare Set",
      quantity: 2,
      shippingAddress: "789 Harrison Street, San Francisco, CA 94107",
      estimatedDelivery: "Jan 9-11, 2026",
    },
    // PetCare Plus - In Progress
    {
      id: "18",
      orderNumber: "PET-89013",
      storeId: "petcare-plus",
      storeName: "PetCare Plus",
      customerName: "Christopher Lee",
      customerEmail: "c.lee@email.com",
      customerPhone: "(555) 456-7890",
      total: 150,
      date: "2026-01-06",
      time: "10:30 AM",
      status: "in-progress",
      category: "service",
      serviceName: "Pet Grooming - Full Service",
      serviceType: "Pet Care Services",
      scheduledDate: "2026-01-07",
      scheduledTime: "11:00 AM - 1:00 PM",
      serviceAddress: "890 Bryant Street, San Francisco, CA 94103",
      duration: "2 hours",
    },
    // ========== COMPLETED ORDERS (9 stores) ==========
    // CleanCo Services - Completed
    {
      id: "19",
      orderNumber: "CLN-12340",
      storeId: "cleanco",
      storeName: "CleanCo Services",
      customerName: "Robert Williams",
      customerEmail: "r.williams@email.com",
      customerPhone: "(555) 678-9012",
      total: 175,
      date: "2026-01-05",
      time: "9:00 AM",
      status: "completed",
      category: "service",
      serviceName: "Move-Out Cleaning",
      serviceType: "Residential Cleaning",
      scheduledDate: "2026-01-06",
      scheduledTime: "9:00 AM - 1:00 PM",
      serviceAddress: "888 Broadway, Apt 4C, San Francisco, CA 94107",
      duration: "4 hours",
    },
    // Beauty by Michelle - Completed
    {
      id: "20",
      orderNumber: "BTY-78900",
      storeId: "beauty-michelle",
      storeName: "Beauty by Michelle",
      customerName: "Nicole Turner",
      customerEmail: "n.turner@email.com",
      customerPhone: "(555) 789-0123",
      total: 95,
      date: "2026-01-04",
      time: "1:00 PM",
      status: "completed",
      category: "service",
      serviceName: "Express Manicure & Pedicure",
      serviceType: "Beauty Services",
      scheduledDate: "2026-01-05",
      scheduledTime: "2:00 PM - 3:30 PM",
      serviceAddress: "901 Fillmore Street, San Francisco, CA 94115",
      duration: "1.5 hours",
    },
    // Fresh Market - Completed
    {
      id: "21",
      orderNumber: "GRO-45670",
      storeId: "fresh-market",
      storeName: "Fresh Market",
      customerName: "Lisa Anderson",
      customerEmail: "l.anderson@email.com",
      customerPhone: "(555) 789-0123",
      total: 156.75,
      date: "2026-01-05",
      time: "8:30 AM",
      status: "completed",
      category: "grocery",
      items: [
        { name: "Organic Chicken Breast", quantity: 2, price: 18.99 },
        { name: "Fresh Vegetables Mix", quantity: 3, price: 12.99 },
        { name: "Quinoa (2lb)", quantity: 1, price: 14.99 },
        { name: "Fresh Berries Mix", quantity: 2, price: 16.99 },
        { name: "Olive Oil", quantity: 1, price: 15.99 },
      ],
      itemCount: 5,
      deliveryAddress: "999 Valencia Street, San Francisco, CA 94108",
      deliveryWindow: "11:00 AM - 1:00 PM",
    },
    // HomeStyle Rentals - Completed
    {
      id: "22",
      orderNumber: "RNT-34565",
      storeId: "homestyle-rentals",
      storeName: "HomeStyle Rentals",
      customerName: "Kevin Harris",
      customerEmail: "k.harris@email.com",
      customerPhone: "(555) 890-1234",
      total: 2100,
      date: "2026-01-01",
      time: "2:00 PM",
      status: "completed",
      category: "rental",
      propertyName: "Luxury 2BR Condo",
      propertyAddress: "123 Embarcadero, Unit 20A, San Francisco, CA 94111",
      checkInDate: "2026-01-02",
      checkOutDate: "2026-01-06",
      numberOfGuests: 4,
    },
    // HandyPro Services - Completed
    {
      id: "23",
      orderNumber: "HND-56788",
      storeId: "handypro",
      storeName: "HandyPro Services",
      customerName: "Steven Miller",
      customerEmail: "s.miller@email.com",
      customerPhone: "(555) 901-2345",
      total: 180,
      date: "2026-01-04",
      time: "7:00 AM",
      status: "completed",
      category: "service",
      serviceName: "Fence Repair",
      serviceType: "Handyman Services",
      scheduledDate: "2026-01-05",
      scheduledTime: "8:00 AM - 11:00 AM",
      serviceAddress: "234 Potrero Avenue, San Francisco, CA 94110",
      duration: "3 hours",
    },
    // Michelle's Gourmet Kitchen - Completed
    {
      id: "24",
      orderNumber: "FD-23455",
      storeId: "gourmet-kitchen",
      storeName: "Michelle's Gourmet Kitchen",
      customerName: "Michelle Rodriguez",
      customerEmail: "m.rodriguez@email.com",
      customerPhone: "(555) 012-3456",
      total: 98.75,
      date: "2026-01-05",
      time: "5:45 PM",
      status: "completed",
      category: "food",
      items: [
        { name: "Spaghetti Carbonara", quantity: 2, price: 16.99 },
        { name: "Margherita Pizza", quantity: 1, price: 18.99 },
        { name: "Garlic Bread", quantity: 2, price: 6.99 },
        { name: "Cannoli", quantity: 2, price: 8.99 },
      ],
      itemCount: 4,
      deliveryAddress: "345 Clement Street, San Francisco, CA 94118",
      deliveryWindow: "7:30 PM - 8:30 PM",
    },
    // CaringHands - Completed
    {
      id: "25",
      orderNumber: "CG-67889",
      storeId: "caring-hands",
      storeName: "CaringHands",
      customerName: "Barbara Scott",
      customerEmail: "b.scott@email.com",
      customerPhone: "(555) 123-4567",
      total: 240,
      date: "2026-01-03",
      time: "9:30 AM",
      status: "completed",
      category: "service",
      serviceName: "Physical Therapy Assistance",
      serviceType: "Caregiving Services",
      scheduledDate: "2026-01-04",
      scheduledTime: "10:00 AM - 2:00 PM",
      serviceAddress: "456 Irving Street, San Francisco, CA 94122",
      duration: "4 hours",
    },
    // Glam Beauty Products - Completed
    {
      id: "26",
      orderNumber: "PRD-78900",
      storeId: "glam-products",
      storeName: "Glam Beauty Products",
      customerName: "Ashley Martinez",
      customerEmail: "a.martinez@email.com",
      customerPhone: "(555) 234-5678",
      total: 67.99,
      date: "2026-01-03",
      time: "12:00 PM",
      status: "completed",
      category: "product",
      productName: "Organic Face Cream Set",
      quantity: 1,
      shippingAddress: "567 Hyde Street, Apt 8, San Francisco, CA 94109",
      estimatedDelivery: "Jan 6-8, 2026",
    },
    // PetCare Plus - Completed
    {
      id: "27",
      orderNumber: "PET-89010",
      storeId: "petcare-plus",
      storeName: "PetCare Plus",
      customerName: "Brian Thompson",
      customerEmail: "b.thompson@email.com",
      customerPhone: "(555) 345-6789",
      total: 120,
      date: "2026-01-04",
      time: "4:00 PM",
      status: "completed",
      category: "service",
      serviceName: "Cat Sitting - Weekend",
      serviceType: "Pet Care Services",
      scheduledDate: "2026-01-05",
      scheduledTime: "9:00 AM - 6:00 PM",
  // Get unique stores for filter with category
  const storesMap = new Map<string, { id: string; name: string; category: OrderCategory }>();
  orders.filter((order) => order.storeId !== "petcare-plus").forEach((order) => {
    if (!storesMap.has(order.storeId)) {
      storesMap.set(order.storeId, {
        id: order.storeId,
        name: order.storeName,
        category: order.category,
      });
    }
  });
  const stores = Array.from(storesMap.values());

  // Get category icon (emoji)
  const getStoreEmoji = (storeId: string) => {
    const emojiMap: Record<string, string> = {
      "cleanco": "🧹",
      "beauty-michelle": "💄",
      "fresh-market": "🛒",
      "homestyle-rentals": "🏠",
      "handypro": "🔧",
      "gourmet-kitchen": "🍔",
      "caring-hands": "💛",
      "glam-products": "💅",
    };
    return emojiMap[storeId] || "🔧";
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Exclude PetCare Plus orders
    if (order.storeId === "petcare-plus") return false;
    
    const matchesStatus = order.status === activeTab;
    const matchesStore = selectedStore === "all" || order.storeId === selectedStore;
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range filtering
    let matchesDateRange = true;
    if (dateRange?.from) {
      const orderDate = parseISO(order.date);
      if (dateRange.to) {
        matchesDateRange = isWithinInterval(orderDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      } else {
        // Only start date selected
        matchesDateRange = orderDate >= dateRange.from;
      }
    }

    return matchesStatus && matchesStore && matchesSearch && matchesDateRange;
  });

  // Group orders by store
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.storeId]) {
      acc[order.storeId] = {
        storeName: order.storeName,
        orders: [],
      };
    }
    acc[order.storeId].orders.push(order);
    return acc;
  }, {} as Record<string, { storeName: string; orders: Order[] }>);

  // Count orders by status
  const statusCounts = {
    accepted: orders.filter((o) => o.status === "accepted").length,
    "in-progress": orders.filter((o) => o.status === "in-progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  // Open order details
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get next status
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    if (currentStatus === "accepted") return "in-progress";
    if (currentStatus === "in-progress") return "completed";
    return null;
  };

  // Get status button text
  const getStatusButtonText = (status: OrderStatus): string => {
    if (status === "accepted") return "Mark In Progress";
    if (status === "in-progress") return "Mark Completed";
    return "";
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="orders"
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
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Michelle's Orders
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage orders across all Michelle's stores
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)} className="w-full">
            {/* Desktop Tabs */}
            <div className="hidden sm:block">
              <TabsList className="w-full justify-start bg-white border border-[#E5E7EB] rounded-t-xl h-[52px] p-0 mb-0">
                <TabsTrigger
                  value="accepted"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  Accepted
                  {statusCounts.accepted > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-[#FEF3C7] text-[#92400E] rounded-full">
                      {statusCounts.accepted}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  In Progress
                  {statusCounts["in-progress"] > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-[#DBEAFE] text-[#1E40AF] rounded-full">
                      {statusCounts["in-progress"]}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1F2937] data-[state=active]:bg-white"
                >
                  Completed
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Mobile Tab Selector */}
            <div className="sm:hidden mb-4">
              <Select value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)}>
                <SelectTrigger className="h-12 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accepted">
                    Accepted {statusCounts.accepted > 0 && `(${statusCounts.accepted})`}
                  </SelectItem>
                  <SelectItem value="in-progress">
                    In Progress {statusCounts["in-progress"] > 0 && `(${statusCounts["in-progress"]})`}
                  </SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filters */}
            <div className="bg-white border border-[#E5E7EB] border-t-0 rounded-b-xl sm:rounded-t-none p-4 sm:p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="store-filter" className="text-sm font-medium text-[#374151] mb-2">
                    Filter by Store
                  </Label>
                  <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger id="store-filter" className="h-10">
                      <SelectValue placeholder="All Stores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      {stores.map((store) => {
                        const emoji = getStoreEmoji(store.id);
                        return (
                          <SelectItem key={store.id} value={store.id}>
                            <div className="flex items-center gap-2">
                              <span>{emoji}</span>
                              <span>-</span>
                              <span>{store.name}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="search" className="text-sm font-medium text-[#374151] mb-2">
                    Search Orders
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by order # or customer name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="date-filter" className="text-sm font-medium text-[#374151] mb-2">
                    Filter by Date
                  </Label>
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                  />
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <TabsContent value={activeTab} className="mt-0">
              {Object.keys(groupedOrders).length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center">
                  <Package className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                    No Orders Found
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {searchQuery || selectedStore !== "all"
                      ? "Try adjusting your filters"
                      : `No ${activeTab} orders at this time`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedOrders).map(([storeId, { storeName, orders: storeOrders }]) => (
                    <div key={storeId} className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                      {/* Store Header */}
                      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-6 py-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-[#1F2937]">
                            {storeName}
                          </h3>
                          <span className="text-sm text-[#6B7280]">
                            {storeOrders.length} {storeOrders.length === 1 ? "order" : "orders"}
                          </span>
                        </div>
                      </div>

                      {/* Orders List */}
                      <div className="divide-y divide-[#E5E7EB]">
                        {storeOrders.map((order) => (
                          <div
                            key={order.id}
                            className="p-6 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                            onClick={() => openOrderDetails(order)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* Order Info */}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-sm font-semibold text-[#1F2937]">
                                    {order.orderNumber}
                                  </span>
                                  <span className="text-sm text-[#6B7280]">•</span>
                                  <span className="text-sm text-[#6B7280]">
                                    {order.category === "service" && (order as ServiceOrder).serviceName}
                                    {order.category === "grocery" && "Grocery Delivery"}
                                    {order.category === "food" && "Food Delivery"}
                                    {order.category === "rental" && (order as RentalOrder).propertyName}
                                    {order.category === "product" && (order as ProductOrder).productName}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap text-sm text-[#6B7280]">
                                  <div className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {order.customerName}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(order.date).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}, {order.time}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4" />
                                    {formatCurrency(order.total)}
                                  </div>
                                  {(order.category === "grocery" || order.category === "food") && (
                                    <div className="flex items-center gap-1.5">
                                      <Package className="w-4 h-4" />
                                      {(order as GroceryOrder).itemCount} items
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action Button */}
                              {getNextStatus(order.status) ? (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(order.id, getNextStatus(order.status)!);
                                  }}
                                  className="w-full sm:w-auto text-sm"
                                >
                                  {order.status === "accepted" && (
                                    <Clock className="w-4 h-4 mr-2" />
                                  )}
                                  {order.status === "in-progress" && (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                  )}
                                  {order.status === "accepted" && (
                                    <>
                                      <span className="hidden sm:inline">Mark In Progress</span>
                                      <span className="sm:hidden">In Progress</span>
                                    </>
                                  )}
                                  {order.status === "in-progress" && (
                                    <>
                                      <span className="hidden sm:inline">Mark Completed</span>
                                      <span className="sm:hidden">Complete</span>
                                    </>
                                  )}
                                  <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openOrderDetails(order);
                                  }}
                                  className="w-full sm:w-auto"
                                >
                                  View Details
                                  <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Order Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1F2937]">
              Order Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              View complete details and information for this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Order Header */}
              <div className="pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-[#1F2937]">
                    {selectedOrder.orderNumber}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full capitalize bg-[#F3F4F6] text-[#374151]">
                    {selectedOrder.status.replace("-", " ")}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280]">{selectedOrder.storeName}</p>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                  Customer Information
                </h3>
                <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-[#6B7280] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {selectedOrder.customerName}
                      </p>
                      <p className="text-sm text-[#6B7280]">{selectedOrder.customerEmail}</p>
                      <p className="text-sm text-[#6B7280]">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service-Specific Details */}
              {selectedOrder.category === "service" && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                    Service Details
                  </h3>
                  <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Service</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ServiceOrder).serviceName}
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {(selectedOrder as ServiceOrder).serviceType}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Scheduled Date</p>
                        <p className="text-sm font-medium text-[#1F2937]">
                          {new Date((selectedOrder as ServiceOrder).scheduledDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Time</p>
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as ServiceOrder).scheduledTime}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Duration</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ServiceOrder).duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Service Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as ServiceOrder).serviceAddress}
                        </p>
                      </div>
                    </div>
                    {(selectedOrder as ServiceOrder).specialInstructions && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Special Instructions</p>
                        <p className="text-sm text-[#1F2937]">
                          {(selectedOrder as ServiceOrder).specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Grocery/Food-Specific Details */}
              {(selectedOrder.category === "grocery" || selectedOrder.category === "food") && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                    Order Details
                  </h3>
                  <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-2">Items ({(selectedOrder as GroceryOrder).itemCount})</p>
                      <div className="space-y-2">
                        {(selectedOrder as GroceryOrder).items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-[#1F2937]">
                              {item.name} <span className="text-[#6B7280]">x{item.quantity}</span>
                            </span>
                            <span className="font-medium text-[#1F2937]">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#E5E7EB]">
                      <p className="text-xs text-[#6B7280] mb-1">Delivery Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as GroceryOrder).deliveryAddress}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Delivery Window</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as GroceryOrder).deliveryWindow}
                      </p>
                    </div>
                    {(selectedOrder as GroceryOrder).specialInstructions && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Special Instructions</p>
                        <p className="text-sm text-[#1F2937]">
                          {(selectedOrder as GroceryOrder).specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rental-Specific Details */}
              {selectedOrder.category === "rental" && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                    Rental Details
                  </h3>
                  <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Property</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as RentalOrder).propertyName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Property Address</p>
                      <div className="flex items-start gap-2">
                        <Home className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as RentalOrder).propertyAddress}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Check-In</p>
                        <p className="text-sm font-medium text-[#1F2937]">
                          {new Date((selectedOrder as RentalOrder).checkInDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Check-Out</p>
                        <p className="text-sm font-medium text-[#1F2937]">
                          {new Date((selectedOrder as RentalOrder).checkOutDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Number of Guests</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as RentalOrder).numberOfGuests}
                      </p>
                    </div>
                    {(selectedOrder as RentalOrder).specialRequests && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Special Requests</p>
                        <p className="text-sm text-[#1F2937]">
                          {(selectedOrder as RentalOrder).specialRequests}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Product-Specific Details */}
              {selectedOrder.category === "product" && (
                <div>
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                    Product Details
                  </h3>
                  <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Product</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ProductOrder).productName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Quantity</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ProductOrder).quantity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Shipping Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-[#1F2937]">
                          {(selectedOrder as ProductOrder).shippingAddress}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Estimated Delivery</p>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {(selectedOrder as ProductOrder).estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-semibold text-[#1F2937] mb-3">
                  Order Summary
                </h3>
                <div className="bg-[#F9FAFB] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1F2937]">Total</span>
                    <span className="text-lg font-bold text-[#1F2937]">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Change Button */}
              {getNextStatus(selectedOrder.status) && (
                <div className="pt-4 border-t border-[#E5E7EB]">
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                    }}
                    className="w-full"
                    size="lg"
                  >
                    {selectedOrder.status === "accepted" && (
                      <Clock className="w-5 h-5 mr-2" />
                    )}
                    {selectedOrder.status === "in-progress" && (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    )}
                    {getStatusButtonText(selectedOrder.status)}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}