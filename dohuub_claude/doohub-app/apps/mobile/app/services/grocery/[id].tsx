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
import { colors, fontSize } from '../../../src/constants/theme';
import { useAuthStore } from '../../../src/store/authStore';

interface GroceryItem {
  id: number;
  name: string;
  description: string;
  unit: string;
  price: number;
  category: string;
  image: string;
}
interface CartItem extends GroceryItem { quantity: number; }

const CATEGORIES = ['All', 'Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Beverages', 'Snacks', 'Household'];

const GROCERY_PRODUCTS: GroceryItem[] = [
  { id: 1,  name: 'Fresh Bananas',    description: 'Ripe yellow bananas',            unit: '1 lb',    price: 2.99, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200&h=200&fit=crop' },
  { id: 2,  name: 'Red Apples',       description: 'Crisp and sweet apples',         unit: '2 lbs',   price: 4.99, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop' },
  { id: 3,  name: 'Baby Carrots',     description: 'Pre-washed baby carrots',        unit: '1 lb bag',price: 3.49, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=200&h=200&fit=crop' },
  { id: 4,  name: 'Broccoli',         description: 'Fresh green broccoli crown',     unit: '1 head',  price: 2.49, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&h=200&fit=crop' },
  { id: 5,  name: 'Strawberries',     description: 'Sweet ripe strawberries',        unit: '16 oz',   price: 5.99, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop' },
  { id: 6,  name: 'Whole Milk',       description: 'Fresh whole milk',               unit: '1 gallon',price: 4.49, category: 'Dairy & Eggs',        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop' },
  { id: 7,  name: 'Cheddar Cheese',   description: 'Sharp cheddar cheese block',     unit: '8 oz',    price: 4.99, category: 'Dairy & Eggs',        image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=200&fit=crop' },
  { id: 8,  name: 'Greek Yogurt',     description: 'Creamy plain Greek yogurt',      unit: '32 oz',   price: 6.49, category: 'Dairy & Eggs',        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop' },
  { id: 9,  name: 'Large Eggs',       description: 'Grade A large white eggs',       unit: '12 ct',   price: 3.99, category: 'Dairy & Eggs',        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop' },
  { id: 10, name: 'Sourdough Bread',  description: 'Freshly baked sourdough loaf',   unit: '1 loaf',  price: 5.49, category: 'Bakery',              image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
  { id: 11, name: 'Croissants',       description: 'Buttery flaky croissants',       unit: '4 ct',    price: 4.99, category: 'Bakery',              image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=200&fit=crop' },
  { id: 12, name: 'Bagels',           description: 'Plain New York style bagels',    unit: '6 ct',    price: 3.99, category: 'Bakery',              image: 'https://images.unsplash.com/photo-1585478259715-4d3a76a49d1c?w=200&h=200&fit=crop' },
  { id: 13, name: 'Orange Juice',     description: '100% pure squeezed OJ',          unit: '52 oz',   price: 5.99, category: 'Beverages',           image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop' },
  { id: 14, name: 'Sparkling Water',  description: 'Lemon sparkling water',          unit: '12 pack', price: 7.99, category: 'Beverages',           image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop' },
  { id: 15, name: 'Coconut Water',    description: 'Natural coconut water',          unit: '33.8 oz', price: 4.49, category: 'Beverages',           image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=200&h=200&fit=crop' },
  { id: 16, name: 'Tortilla Chips',   description: 'Restaurant style tortilla chips',unit: '13 oz',   price: 3.99, category: 'Snacks',              image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop' },
  { id: 17, name: 'Trail Mix',        description: 'Mixed nuts and dried fruit',     unit: '10 oz',   price: 5.49, category: 'Snacks',              image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200&h=200&fit=crop' },
  { id: 18, name: 'Paper Towels',     description: 'Select-a-size paper towels',     unit: '6 rolls', price: 8.99, category: 'Household',           image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop' },
  { id: 19, name: 'Dish Soap',        description: 'Original scent dish soap',       unit: '21.6 oz', price: 3.49, category: 'Household',           image: 'https://images.unsplash.com/photo-1585556612588-bf7b7e1cbbb6?w=200&h=200&fit=crop' },
];

export default function GroceryDetailScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; isPoweredByDoHuub: string }>();
  const vendorName = params.name || 'Grocery Store';
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';

  const [step, setStep] = useState<'products' | 'checkout' | 'confirm'>('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { addresses } = useAuthStore();
  const deliveryAddress = addresses?.[0] ?? null;

  const filteredProducts = selectedCategory === 'All'
    ? GROCERY_PRODUCTS
    : GROCERY_PRODUCTS.filter(p => p.category === selectedCategory);

  const getTotalItems = () => cart.reduce((s, i) => s + i.quantity, 0);
  const getSubtotal = () => cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const getItemQty = (id: number) => cart.find(c => c.id === id)?.quantity ?? 0;

  const handleAdd = (item: GroceryItem) => {
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep('checkout')}>
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Order</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Delivery Address */}
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.confirmCard}>
            <View style={styles.confirmCardRow}>
              <View style={styles.confirmIconCircle}>
                <Ionicons name="location" size={18} color="#2E7AD9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.confirmCardLabel}>{deliveryAddress?.label ?? 'Home'}</Text>
                <Text style={styles.confirmCardSub}>{deliveryAddress?.street ?? '123 Main Street, Apt 4B, New York, NY 10001'}</Text>
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
                <Text style={styles.confirmCardSub}>•••• •••• •••• 9012</Text>
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
              <View key={item.id} style={styles.osSummaryItem}>
                <Text style={styles.osSummaryQty}>{item.quantity}x</Text>
                <Text style={[styles.osSummaryName, { flex: 1 }]}>{item.name}</Text>
                <Text style={styles.osSummaryPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.osDivider} />
            <View style={styles.osRow}><Text style={styles.osLabel}>Subtotal</Text><Text style={styles.osVal}>${subtotal.toFixed(2)}</Text></View>
            <View style={styles.osRow}><Text style={styles.osLabel}>Delivery Fee</Text><Text style={styles.osVal}>${deliveryFee.toFixed(2)}</Text></View>
            <View style={styles.osRow}><Text style={styles.osLabel}>Tax</Text><Text style={styles.osVal}>${tax.toFixed(2)}</Text></View>
            <View style={styles.osDivider} />
            <View style={styles.osRow}>
              <Text style={styles.osTotalLabel}>Total</Text>
              <Text style={styles.osTotalVal}>${total.toFixed(2)}</Text>
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
              <Text style={styles.pointsAmount}>+{Math.floor(total)} pts</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2E7AD9' }]} onPress={() => router.replace('/(tabs)/bookings' as any)}>
            <Text style={styles.actionBtnText}>Place Order • ${total.toFixed(2)}</Text>
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
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep('products')}>
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Checkout</Text>
            <Text style={styles.headerSubtitle}>{vendorName}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Delivery Address */}
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardLabel}>{deliveryAddress?.label ?? 'Home'}</Text>
                <Text style={styles.cardSub}>{deliveryAddress?.street ?? '123 Main Street, Apt 4B, New York, NY 10001'}</Text>
              </View>
            </View>
          </View>

          {/* Order Items */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Order Items</Text>
          {cart.map(item => (
            <View key={item.id} style={[styles.card, { marginBottom: 8 }]}>
              <View style={styles.cardRow}>
                <Image source={{ uri: item.image }} style={{ width: 64, height: 64, borderRadius: 10 }} resizeMode="cover" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardLabel}>{item.name}</Text>
                  <Text style={styles.cardSub}>${item.price.toFixed(2)}</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQty(item.id, -1)}>
                      <Ionicons name="remove" size={14} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => handleUpdateQty(item.id, 1)}>
                      <Ionicons name="add" size={14} color={colors.text.primary} />
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

          {/* Redeem Points */}
          {isPoweredByDoHuub && (
            <View style={styles.redeemCard}>
              <View style={styles.redeemLeft}>
                <View style={styles.redeemIconWrap}>
                  <Ionicons name="gift" size={18} color="#10B981" />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.redeemTitle}>Redeem Points</Text>
                  <Text style={styles.redeemSub}>2,450 pts available</Text>
                </View>
              </View>
              <View style={styles.redeemToggle}>
                <View style={styles.toggleTrack}>
                  <View style={styles.toggleThumb} />
                </View>
              </View>
            </View>
          )}

          {/* Price Details */}
          <View style={[styles.card, { marginTop: 12 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Price Details</Text>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>Subtotal</Text><Text style={styles.priceVal}>${subtotal.toFixed(2)}</Text></View>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>Delivery Fee</Text><Text style={styles.priceVal}>${deliveryFee.toFixed(2)}</Text></View>
            <View style={styles.priceRow}><Text style={styles.priceLabel}>Tax</Text><Text style={styles.priceVal}>${tax.toFixed(2)}</Text></View>
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
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => setStep('confirm')}>
            <Text style={styles.actionBtnText}>Confirm Address and Payment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── PRODUCTS LIST ─────────────────────────────────────────────────────────
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

      {/* Product List */}
      <FlatList
        data={filteredProducts}
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
            <View style={styles.productCard}>
              <View style={styles.productCardRow}>
                <Image source={{ uri: item.image }} style={styles.productIcon} resizeMode="cover" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDesc}>{item.description}</Text>
                  <Text style={styles.productUnit}>{item.unit}</Text>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.productCtrl}>
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
  container: { flex: 1, backgroundColor: '#F8FAFF' },
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
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  headerSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  dohuubBadge: { backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  dohuubBadgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  tabs: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16,185,129,0.15)',
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
  tabActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  tabText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  tabTextActive: { color: '#FFFFFF' },
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
  pointsTitle: { fontSize: 13, fontWeight: '600', color: 'rgb(180,83,9)' },
  pointsSub: { fontSize: 11, color: 'rgb(217,119,6)', marginTop: 2 },
  pointsAmount: { fontSize: 15, fontWeight: '700', color: '#F59E0B' },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.12)',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  productCardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  productIcon: {
    width: 72,
    height: 72,
    borderRadius: 10,
    flexShrink: 0,
    overflow: 'hidden',
  },
  productName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 3 },
  productDesc: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  productUnit: { fontSize: 11, color: '#9CA3AF', marginBottom: 4 },
  productPrice: { fontSize: 14, fontWeight: '700', color: '#10B981' },
  productCtrl: { marginLeft: 8, justifyContent: 'center' },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
  },
  qtyBtnSm: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  qtyNum: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', minWidth: 24, textAlign: 'center' },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    borderRadius: 14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cartLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cartItemsText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  cartTotalText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  // Checkout / Confirm styles
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
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  cardSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  cardIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(46,122,217,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeLink: { fontSize: 12, color: '#2E7AD9', fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', minWidth: 20, textAlign: 'center' },
  itemTotal: { fontSize: 14, fontWeight: '600', color: '#10B981' },
  redeemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.25)',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  redeemLeft: { flexDirection: 'row', alignItems: 'center' },
  redeemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16,185,129,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemTitle: { fontSize: 14, fontWeight: '600', color: '#065F46' },
  redeemSub: { fontSize: 12, color: '#059669', marginTop: 2 },
  redeemToggle: { marginLeft: 8 },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    paddingHorizontal: 2,
    alignItems: 'flex-end',
  },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  priceLabel: { fontSize: 14, color: '#6B7280' },
  priceVal: { fontSize: 14, color: '#6B7280' },
  totalLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  totalVal: { fontSize: 15, fontWeight: '700', color: '#10B981' },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.08)', marginVertical: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryVal: { fontSize: 14, fontWeight: '500', color: '#1A1A2E' },
  viewRewardsLink: {
    fontSize: 14,
    color: '#2E7AD9',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
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
  osSummaryItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  osSummaryQty: { fontSize: 14, fontWeight: '600', color: '#1E293B', width: 28 },
  osSummaryName: { fontSize: 14, color: '#1E293B' },
  osSummaryPrice: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  osDivider: { height: 1, backgroundColor: 'rgba(46,122,217,0.1)', marginVertical: 12 },
  osRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  osLabel: { fontSize: 14, color: '#64748B' },
  osVal: { fontSize: 14, color: '#1E293B' },
  osTotalLabel: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  osTotalVal: { fontSize: 15, fontWeight: '600', color: '#2E7AD9' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 6,
  },
  actionBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
