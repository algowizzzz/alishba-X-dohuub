import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';
import { useAuthStore } from '../../../src/store/authStore';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}
interface CartItem extends MenuItem { quantity: number; }

const CATEGORIES = ['All', "Chef's Recommendations", 'Starters', 'Mains', 'Desserts', 'Ice Cream', 'Beverages'];

const getVendorMenu = (menuId: number): MenuItem[] => {
  const b = menuId * 100;
  switch (menuId) {
    case 1: return [
      { id: b+1,  name: 'Signature Margherita Pizza',  description: 'Our famous wood-fired pizza with fresh mozzarella',  price: 16.99, category: "Chef's Recommendations", image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=120&h=120&fit=crop' },
      { id: b+2,  name: 'Truffle Fettuccine Alfredo',  description: 'Creamy alfredo with black truffle oil',               price: 18.99, category: "Chef's Recommendations", image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=120&h=120&fit=crop' },
      { id: b+3,  name: 'Garlic Knots',                description: 'Soft bread knots with garlic butter and herbs',       price: 6.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=120&h=120&fit=crop' },
      { id: b+4,  name: 'Bruschetta',                  description: 'Toasted bread with tomatoes, basil, and olive oil',   price: 8.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=120&h=120&fit=crop' },
      { id: b+5,  name: 'Mozzarella Sticks',           description: 'Breaded mozzarella with marinara sauce',              price: 7.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=120&h=120&fit=crop' },
      { id: b+6,  name: 'Pepperoni Pizza',             description: 'Loaded with pepperoni and cheese',                    price: 15.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop' },
      { id: b+7,  name: 'BBQ Chicken Pizza',           description: 'BBQ sauce, chicken, onions, and cilantro',            price: 17.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&h=120&fit=crop' },
      { id: b+8,  name: 'Spaghetti Carbonara',         description: 'Creamy carbonara with bacon and parmesan',            price: 15.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=120&h=120&fit=crop' },
      { id: b+9,  name: 'Lasagna',                     description: 'Layers of pasta, meat sauce, and cheese',             price: 16.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=120&h=120&fit=crop' },
      { id: b+10, name: 'Tiramisu',                    description: 'Classic Italian coffee-flavored dessert',             price: 7.99,  category: 'Desserts',               image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=120&h=120&fit=crop' },
      { id: b+11, name: 'Gelato Trio',                 description: 'Three scoops of Italian gelato',                      price: 7.99,  category: 'Ice Cream',              image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=120&h=120&fit=crop' },
      { id: b+12, name: 'Italian Soda',                description: 'Sparkling soda with fruit syrup',                     price: 3.99,  category: 'Beverages',              image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=120&h=120&fit=crop' },
      { id: b+13, name: 'Iced Tea',                    description: 'Fresh brewed iced tea',                               price: 2.99,  category: 'Beverages',              image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=120&h=120&fit=crop' },
    ];
    case 2: return [
      { id: b+1,  name: 'Dragon Roll',              description: 'Specialty roll with eel, avocado, and tobiko',  price: 18.99, category: "Chef's Recommendations", image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=120&h=120&fit=crop' },
      { id: b+2,  name: "Chef's Sashimi Platter",   description: 'Assorted fresh sashimi selection',              price: 24.99, category: "Chef's Recommendations", image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=120&h=120&fit=crop' },
      { id: b+3,  name: 'Edamame',                  description: 'Steamed soybeans with sea salt',                price: 5.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=120&h=120&fit=crop' },
      { id: b+4,  name: 'Miso Soup',                description: 'Traditional Japanese soybean soup',             price: 4.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=120&h=120&fit=crop' },
      { id: b+5,  name: 'Gyoza',                    description: 'Pan-fried pork dumplings',                      price: 8.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=120&h=120&fit=crop' },
      { id: b+6,  name: 'California Roll',          description: 'Crab, avocado, and cucumber roll',              price: 10.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=120&h=120&fit=crop' },
      { id: b+7,  name: 'Spicy Tuna Roll',          description: 'Spicy tuna with cucumber',                      price: 12.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=120&h=120&fit=crop' },
      { id: b+8,  name: 'Teriyaki Chicken',         description: 'Grilled chicken with teriyaki glaze',           price: 15.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=120&h=120&fit=crop' },
      { id: b+9,  name: 'Mochi Ice Cream',          description: 'Rice cake filled with ice cream',               price: 6.99,  category: 'Desserts',               image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=120&h=120&fit=crop' },
      { id: b+10, name: 'Green Tea',                description: 'Hot or iced Japanese green tea',                price: 3.99,  category: 'Beverages',              image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=120&h=120&fit=crop' },
    ];
    case 3: return [
      { id: b+1, name: 'Carne Asada Tacos',   description: 'Grilled steak tacos with special marinade', price: 14.99, category: "Chef's Recommendations", image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&h=120&fit=crop' },
      { id: b+2, name: 'Chips & Guacamole',   description: 'Fresh guacamole with tortilla chips',       price: 8.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=120&h=120&fit=crop' },
      { id: b+3, name: 'Beef Tacos',          description: 'Seasoned beef with fresh toppings',         price: 11.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=120&h=120&fit=crop' },
      { id: b+4, name: 'Chicken Burrito',     description: 'Large burrito with grilled chicken',        price: 13.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=120&h=120&fit=crop' },
      { id: b+5, name: 'Fish Tacos',          description: 'Grilled fish with cabbage slaw',            price: 13.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1611250188496-e966043a0629?w=120&h=120&fit=crop' },
      { id: b+6, name: 'Churros',             description: 'Fried dough with cinnamon sugar',           price: 6.99,  category: 'Desserts',               image: 'https://images.unsplash.com/photo-1624371414361-e670edf4a5f1?w=120&h=120&fit=crop' },
      { id: b+7, name: 'Horchata',            description: 'Sweet rice milk with cinnamon',             price: 4.99,  category: 'Beverages',              image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=120&h=120&fit=crop' },
    ];
    case 4: return [
      { id: b+1, name: 'Hyderabadi Biryani',  description: 'Traditional Hyderabad style biryani with lamb', price: 19.99, category: "Chef's Recommendations", image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&h=120&fit=crop' },
      { id: b+2, name: 'Samosas',             description: 'Crispy pastries filled with spiced potatoes',   price: 6.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=120&h=120&fit=crop' },
      { id: b+3, name: 'Chicken Tikka',       description: 'Marinated chicken in tandoor',                  price: 11.99, category: 'Starters',               image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=120&h=120&fit=crop' },
      { id: b+4, name: 'Butter Chicken',      description: 'Creamy tomato curry with chicken',              price: 16.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=120&h=120&fit=crop' },
      { id: b+5, name: 'Chicken Biryani',     description: 'Fragrant basmati rice with spiced chicken',     price: 15.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=120&h=120&fit=crop' },
      { id: b+6, name: 'Palak Paneer',        description: 'Cottage cheese in spinach gravy',               price: 14.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=120&h=120&fit=crop' },
      { id: b+7, name: 'Gulab Jamun',         description: 'Sweet milk balls in syrup',                     price: 5.99,  category: 'Desserts',               image: 'https://images.unsplash.com/photo-1601050690117-94f5f7a7b1a2?w=120&h=120&fit=crop' },
      { id: b+8, name: 'Mango Lassi',         description: 'Yogurt drink with mango',                       price: 4.99,  category: 'Beverages',              image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=120&h=120&fit=crop' },
    ];
    case 5: return [
      { id: b+1, name: 'Paradise Signature Burger',   description: 'Double patty with special sauce and premium toppings', price: 16.99, category: "Chef's Recommendations", image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop' },
      { id: b+2, name: 'Chicken Wings',               description: 'Buffalo wings with ranch dressing',                   price: 11.99, category: 'Starters',               image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=120&h=120&fit=crop' },
      { id: b+3, name: 'Onion Rings',                 description: 'Crispy beer-battered onion rings',                    price: 7.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=120&h=120&fit=crop' },
      { id: b+4, name: 'Classic Burger',              description: 'Beef patty with lettuce, tomato, and pickles',        price: 12.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=120&h=120&fit=crop' },
      { id: b+5, name: 'Bacon Cheeseburger',          description: 'Double patty with bacon and cheese',                  price: 15.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=120&h=120&fit=crop' },
      { id: b+6, name: 'Crispy Chicken Sandwich',     description: 'Fried chicken with coleslaw',                         price: 13.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=120&h=120&fit=crop' },
      { id: b+7, name: 'Milkshake',                   description: 'Thick shake - vanilla, chocolate, or strawberry',     price: 5.99,  category: 'Beverages',              image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=120&h=120&fit=crop' },
    ];
    case 6: return [
      { id: b+1, name: 'Royal Thai Curry',    description: 'Premium curry with seafood and coconut',       price: 19.99, category: "Chef's Recommendations", image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=120&h=120&fit=crop' },
      { id: b+2, name: 'Spring Rolls',        description: 'Fresh vegetables wrapped in rice paper',        price: 7.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1606516284428-cf54c2cb50a3?w=120&h=120&fit=crop' },
      { id: b+3, name: 'Tom Yum Soup',        description: 'Spicy and sour Thai soup',                     price: 8.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=120&h=120&fit=crop' },
      { id: b+4, name: 'Pad Thai',            description: 'Stir-fried rice noodles with shrimp',          price: 14.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=120&h=120&fit=crop' },
      { id: b+5, name: 'Green Curry',         description: 'Coconut curry with chicken and vegetables',    price: 15.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=120&h=120&fit=crop' },
      { id: b+6, name: 'Mango Sticky Rice',   description: 'Sweet rice with fresh mango',                  price: 7.99,  category: 'Desserts',               image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=120&h=120&fit=crop' },
      { id: b+7, name: 'Thai Iced Tea',       description: 'Sweet tea with condensed milk',                price: 4.99,  category: 'Beverages',              image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=120&h=120&fit=crop' },
    ];
    default: return [
      { id: b+1, name: 'DoHuub Special',    description: 'Our chef\'s daily special',     price: 14.99, category: "Chef's Recommendations", image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop' },
      { id: b+2, name: 'Seasonal Starter',  description: 'Fresh seasonal appetizer',      price: 8.99,  category: 'Starters',               image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=120&h=120&fit=crop' },
      { id: b+3, name: 'Signature Main',    description: 'House specialty main course',   price: 16.99, category: 'Mains',                  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop' },
      { id: b+4, name: 'Daily Dessert',     description: 'Freshly made dessert',          price: 6.99,  category: 'Desserts',               image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=120&h=120&fit=crop' },
      { id: b+5, name: 'Fresh Juice',       description: 'Seasonal fresh juice',          price: 4.99,  category: 'Beverages',              image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=120&h=120&fit=crop' },
    ];
  }
};

export default function FoodMenuScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; cuisine: string; isPoweredByDoHuub: string; menuId: string }>();
  const vendorName = params.name || 'Restaurant';
  const cuisine = params.cuisine || '';
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';
  const menuId = parseInt(params.menuId || '0', 10);

  const [step, setStep] = useState<'menu' | 'checkout' | 'confirm'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { addresses } = useAuthStore();
  const deliveryAddress = addresses?.[0] ?? null;

  const menuItems = getVendorMenu(menuId);
  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const getTotalItems = () => cart.reduce((s, i) => s + i.quantity, 0);
  const getSubtotal = () => cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const getItemQty = (id: number) => cart.find(c => c.id === id)?.quantity ?? 0;

  const handleAdd = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, quantity: c.quantity + delta } : c).filter(c => c.quantity > 0));
  };

  const handleRemove = (id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const subtotal = getSubtotal();
  const deliveryFee = 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  // ── CONFIRM ORDER — matching boss wireframe ─────────────────────────────
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header — no vendor name */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep('checkout')}>
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Order</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Delivery Address */}
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.confirmCard}>
            <View style={styles.confirmCardRow}>
              <View style={styles.confirmIconCircle}>
                <Ionicons name="location" size={18} color="#2E7AD9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.confirmCardLabel}>{deliveryAddress?.label ?? 'Home'}</Text>
                <Text style={styles.confirmCardSub}>{deliveryAddress?.street ?? '123 Main Street, Miami, FL'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Method */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Payment Method</Text>
          <View style={styles.confirmCard}>
            <View style={styles.confirmCardRow}>
              <View style={styles.confirmIconCircle}>
                <Ionicons name="card" size={18} color="#2E7AD9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.confirmCardLabel}>Credit Card</Text>
                <Text style={styles.confirmCardSub}>•••• •••• •••• 4242</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Order Summary — in white card */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Order Summary</Text>
          <View style={styles.orderSummaryCard}>
            {cart.map(item => (
              <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.summaryQty}>{item.quantity}x</Text>
                <Text style={[styles.summaryName, { flex: 1 }]}>{item.name}</Text>
                <Text style={styles.summaryPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryVal}>${deliveryFee.toFixed(2)}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax</Text><Text style={styles.summaryVal}>${tax.toFixed(2)}</Text></View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalVal}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Points earned */}
          {isPoweredByDoHuub && (
            <View style={styles.pointsBanner}>
              <View style={styles.pointsIconWrap}>
                <Ionicons name="gift" size={20} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pointsTitle}>Points you'll earn</Text>
                <Text style={styles.pointsSub}>1 point per $1 spent • Added after delivery</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#F59E0B' }}>+{Math.floor(total)} pts</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.placeOrderBtn} onPress={() => router.replace('/(tabs)/bookings' as any)}>
            <Text style={styles.placeOrderText}>Place Order • ${total.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── CHECKOUT ──────────────────────────────────────────────────────────────
  if (step === 'checkout') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep('menu')}>
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Checkout</Text>
            <Text style={styles.headerSubtitle}>{vendorName}</Text>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Delivery Address */}
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardLabel}>{deliveryAddress?.label ?? 'Home'}</Text>
                <Text style={styles.cardSub}>{deliveryAddress?.street ?? '123 Main Street, Miami, FL'}</Text>
              </View>
            </View>
          </View>

          {/* Order Items */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Order Items</Text>
          {cart.map(item => (
            <View key={item.id} style={[styles.card, { marginBottom: 8 }]}>
              <View style={styles.cardRow}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={{ width: 64, height: 64, borderRadius: 10 }} resizeMode="cover" />
                ) : (
                  <Image source={require('../../../assets/food.png')} style={{ width: 64, height: 64 }} resizeMode="contain" />
                )}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardLabel}>{item.name}</Text>
                  <Text style={styles.cardSub}>${item.price.toFixed(2)}</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQty(item.id, -1)}>
                      <Ionicons name="remove" size={16} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQty(item.id, 1)}>
                      <Ionicons name="add" size={16} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => handleRemove(item.id)} style={{ marginTop: 8 }}>
                    <Ionicons name="trash-outline" size={20} color={colors.text.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {/* Price Details */}
          <View style={[styles.card, { marginTop: 12 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Price Details</Text>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>Subtotal</Text><Text style={styles.priceVal}>${subtotal.toFixed(2)}</Text></View>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>Delivery Fee</Text><Text style={styles.priceVal}>${deliveryFee.toFixed(2)}</Text></View>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>Tax (8%)</Text><Text style={styles.priceVal}>${tax.toFixed(2)}</Text></View>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Points preview */}
          {isPoweredByDoHuub && (
            <View style={[styles.pointsBanner, { marginTop: 16 }]}>
              <View style={styles.pointsIconWrap}>
                <Ionicons name="gift" size={20} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pointsTitle}>Points you'll earn</Text>
                <Text style={styles.pointsSub}>1 point per $1 spent • Added after delivery</Text>
              </View>
              <Text style={styles.pointsAmount}>+{Math.floor(total)} pts</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.placeOrderBtn} onPress={() => setStep('confirm')}>
            <Text style={styles.placeOrderText}>Confirm Address and Payment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── MENU ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { flex: 1 }]}>{vendorName}</Text>
        {isPoweredByDoHuub && (
          <View style={styles.dohuubBadge}>
            <Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text>
          </View>
        )}
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, selectedCategory === cat && styles.tabActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.tabText, selectedCategory === cat && styles.tabTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: cart.length > 0 ? 100 : 24 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={isPoweredByDoHuub ? (
          <View style={styles.pointsBanner}>
            <View style={styles.pointsIconWrap}>
              <Ionicons name="gift" size={20} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.pointsTitle}>Earn points on this service</Text>
              <Text style={styles.pointsSub}>1 point per $1 spent • Points added after delivery</Text>
            </View>
          </View>
        ) : null}
        renderItem={({ item }) => {
          const qty = getItemQty(item.id);
          return (
            <View style={styles.menuCard}>
              <View style={styles.menuCardRow}>
                <Image source={{ uri: item.image }} style={styles.menuItemImg} resizeMode="cover" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
                  <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.menuItemCtrl}>
                  {qty === 0 ? (
                    <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(item)}>
                      <Ionicons name="add" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qtyControls}>
                      <TouchableOpacity style={styles.qtyBtnSm} onPress={() => handleUpdateQty(item.id, -1)}>
                        <Ionicons name="remove" size={14} color={colors.text.primary} />
                      </TouchableOpacity>
                      <Text style={styles.qtyNum}>{qty}</Text>
                      <TouchableOpacity style={styles.qtyBtnSm} onPress={() => handleUpdateQty(item.id, 1)}>
                        <Ionicons name="add" size={14} color={colors.text.primary} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Cart Footer */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.cartFooter} onPress={() => setStep('checkout')}>
          <View style={styles.cartLeft}>
            <Ionicons name="cart" size={20} color="#FFFFFF" />
            <Text style={styles.cartItemsText}>{getTotalItems()} items</Text>
          </View>
          <Text style={styles.cartTotalText}>View Cart • ${getSubtotal().toFixed(2)}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  dohuubBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  dohuubBadgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  tabs: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46,122,217,0.1)',
    height: 56,
    flexShrink: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    marginRight: 8,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, color: colors.text.primary, fontWeight: '500' },
  tabTextActive: { color: '#FFFFFF' },
  content: { flex: 1 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, marginBottom: 8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 4,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  cardSub: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 2 },
  changeLink: { fontSize: fontSize.xs, color: colors.primary, fontWeight: '600' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, minWidth: 20, textAlign: 'center' },
  itemTotal: { fontSize: fontSize.sm, fontWeight: '600', color: colors.primary },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  priceLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  priceVal: { fontSize: fontSize.sm, color: colors.text.secondary },
  totalLabel: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  totalVal: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)', marginVertical: 8 },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  summaryQty: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.secondary, width: 24 },
  summaryName: { fontSize: fontSize.sm, color: colors.text.primary },
  summaryPrice: { fontSize: fontSize.sm, fontWeight: '600', color: colors.primary },
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  pointsIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245,158,11,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsTitle: { fontSize: fontSize.sm, fontWeight: '600', color: 'rgb(180,83,9)' },
  pointsSub: { fontSize: fontSize.xs, color: 'rgb(217,119,6)', marginTop: 2 },
  pointsAmount: { fontSize: fontSize.md, fontWeight: '700', color: '#F59E0B' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  placeOrderBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeOrderText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: '600' },

  // Confirm Order screen styles
  confirmCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  confirmCardRow: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  confirmIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E8F1FC', alignItems: 'center', justifyContent: 'center',
  },
  confirmCardLabel: { fontSize: 15, fontWeight: '500', color: '#1E293B' },
  confirmCardSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  changeBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: 'rgba(46,122,217,0.2)',
    backgroundColor: 'rgba(46,122,217,0.05)',
  },
  changeBtnText: { fontSize: 13, fontWeight: '500', color: '#2E7AD9' },
  orderSummaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  summaryDivider: { height: 1, backgroundColor: 'rgba(46,122,217,0.1)', marginVertical: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#64748B' },
  summaryVal: { fontSize: 14, color: '#1E293B' },
  summaryTotalLabel: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  summaryTotalVal: { fontSize: 15, fontWeight: '600', color: '#2E7AD9' },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(46,122,217,0.1)',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuCardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  menuItemImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
    flexShrink: 0,
    overflow: 'hidden',
  },
  menuItemName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 4 },
  menuItemDesc: { fontSize: fontSize.xs, color: colors.text.secondary, lineHeight: 17, marginBottom: 6 },
  menuItemPrice: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
  menuItemCtrl: { marginLeft: 8, justifyContent: 'center' },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  qtyBtnSm: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  qtyNum: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, minWidth: 24, textAlign: 'center' },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cartLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cartItemsText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: '500' },
  cartTotalText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: '600' },
});
