import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';
import { useAuthStore } from '../../../src/store/authStore';
import { getFoodListings } from '../../../src/lib/queries';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}
interface CartItem extends MenuItem { quantity: number; }

const CATEGORIES = ['All', "Chef's Recommendations", 'Starters', 'Mains', 'Desserts', 'Ice Cream', 'Beverages'];

export default function FoodMenuScreen() {
  const params = useLocalSearchParams<{ id: string; storeId?: string; vendorId?: string; name: string; cuisine: string; isPoweredByDoHuub: string; menuId: string }>();
  const vendorName = params.name || 'Restaurant';
  const cuisine = params.cuisine || '';
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';
  const storeId = params.storeId || params.id || '';
  const vendorId = params.vendorId || '';

  const [step, setStep] = useState<'menu' | 'checkout' | 'confirm'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const { addresses } = useAuthStore();
  const deliveryAddress = addresses?.[0] ?? null;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!storeId && !vendorId) { setMenuLoading(false); return; }
      try {
        const rows = await getFoodListings({ storeId: storeId || undefined, vendorId: vendorId || undefined });
        if (cancelled) return;
        setMenuItems(rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          price: Number(r.price),
          category: r.category,
          image: r.image,
        })));
      } finally {
        if (!cancelled) setMenuLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [storeId, vendorId]);

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const getTotalItems = () => cart.reduce((s, i) => s + i.quantity, 0);
  const getSubtotal = () => cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const getItemQty = (id: string) => cart.find(c => c.id === id)?.quantity ?? 0;

  const handleAdd = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, quantity: c.quantity + delta } : c).filter(c => c.quantity > 0));
  };

  const handleRemove = (id: string) => {
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
