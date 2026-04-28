import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Image, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../../src/constants/theme';
import { getBeautyProducts } from '../../../../../src/lib/queries';

const CATEGORY_TABS = ['All', 'Makeup', 'Skincare', 'Haircare', 'Fragrances', 'Tools & Brushes', 'Bath & Body'];

type Product = { id: string; name: string; description: string; category: string; price: number; size: string; image: string };

type Step = 'products' | 'checkout' | 'review' | 'confirm';

export default function BeautyProductsCatalog() {
  const params = useLocalSearchParams<{ id: string; name: string; isPoweredByDoHuub: string; rating: string }>();
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';
  const vendorId = params.id || '';

  const [step, setStep] = useState<Step>('products');
  const [activeTab, setActiveTab] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!vendorId) return;
    getBeautyProducts(vendorId).then((rows: any[]) => {
      setProducts(rows.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        price: Number(r.price),
        size: r.quantityAmount && r.quantityUnit ? `${r.quantityAmount}${r.quantityUnit}` : '',
        image: r.image || '',
      })));
    }).catch(() => setProducts([]));
  }, [vendorId]);

  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter(p => p.category === activeTab);

  const cartItems = products.filter(p => cart[p.id] > 0);
  const subtotal = cartItems.reduce((sum, p) => sum + cart[p.id] * p.price, 0);
  const deliveryFee = 2.99;
  const pointsDiscount = redeemPoints ? Math.min(5.00, subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - pointsDiscount;
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const pointsEarned = isPoweredByDoHuub ? Math.floor(total) : 0;
  const orderNumber = `BP-${Math.floor(10000 + Math.random() * 90000)}`;

  const addToCart = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart(prev => {
    if (!prev[id]) return prev;
    const updated = { ...prev, [id]: prev[id] - 1 };
    if (updated[id] === 0) delete updated[id];
    return updated;
  });

  // ─── REVIEW / CONFIRM ORDER — matching boss wireframe ────────────────────
  if (step === 'review') {
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
          <View style={[styles.sectionCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F1FC', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="location" size={18} color="#2E7AD9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#1E293B' }}>Home</Text>
                <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>123 Main Street, Apt 4B, New York, NY 10001</Text>
              </View>
            </View>
            <TouchableOpacity style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(46,122,217,0.2)', backgroundColor: 'rgba(46,122,217,0.05)' }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: '#2E7AD9' }}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Method */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={[styles.sectionCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F1FC', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="card" size={18} color="#2E7AD9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#1E293B' }}>Credit Card</Text>
                <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>•••• •••• •••• 9012</Text>
              </View>
            </View>
            <TouchableOpacity style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(46,122,217,0.2)', backgroundColor: 'rgba(46,122,217,0.05)' }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: '#2E7AD9' }}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Order Summary */}
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.sectionCard}>
            {cartItems.map(p => (
              <View key={p.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#1E293B' }}>{p.name} × {cart[p.id]}</Text>
                <Text style={{ fontSize: 14, color: '#1E293B' }}>${(p.price * cart[p.id]).toFixed(2)}</Text>
              </View>
            ))}
            <View style={{ height: 1, backgroundColor: 'rgba(46,122,217,0.1)', marginVertical: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Subtotal</Text>
              <Text style={{ fontSize: 14, color: '#1E293B' }}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Delivery Fee</Text>
              <Text style={{ fontSize: 14, color: '#1E293B' }}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(46,122,217,0.1)', marginVertical: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E293B' }}>Total</Text>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#2E7AD9' }}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.checkoutFooter}>
          <TouchableOpacity style={styles.confirmBtn} onPress={() => router.replace('/(tabs)/bookings' as any)}>
            <Text style={styles.confirmBtnText}>Place Order • ${total.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── ORDER PLACED SCREEN ──────────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.confirmScroll} showsVerticalScrollIndicator={false}>
          {/* Success circle */}
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={40} color="#FFF" />
          </View>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successSubtitle}>Order #{orderNumber}</Text>

          {/* Points earned */}
          {isPoweredByDoHuub && (
            <View style={styles.pointsEarnedCard}>
              <Ionicons name="gift-outline" size={18} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.pointsEarnedTitle}>+{pointsEarned} Points Earned!</Text>
                <Text style={styles.pointsEarnedSub}>Added to your rewards wallet after delivery</Text>
              </View>
            </View>
          )}

          {/* Order summary */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {cartItems.map(p => (
              <View key={p.id} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{p.name} × {cart[p.id]}</Text>
                <Text style={styles.summaryValue}>${(p.price * cart[p.id]).toFixed(2)}</Text>
              </View>
            ))}
            <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' }]}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            {redeemPoints && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: '#D97706' }]}>Points Redeemed</Text>
                <Text style={[styles.summaryValue, { color: '#D97706' }]}>-${pointsDiscount.toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, { marginTop: 4 }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Delivery info */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.infoText}>123 Main Street, Dubai</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.infoText}>Card •••• 9012</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryActionBtn} onPress={() => router.push('/(tabs)' as any)}>
            <Text style={styles.primaryActionBtnText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => router.push('/rewards' as any)}>
            <Text style={styles.secondaryActionBtnText}>View My Rewards</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── CHECKOUT SCREEN ───────────────────────────────────────────────────────
  if (step === 'checkout') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep('products')}>
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Checkout</Text>
            <Text style={styles.headerSubtitle}>{cartCount} item{cartCount !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.checkoutScroll} showsVerticalScrollIndicator={false}>
          {/* Delivery Address */}
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.infoText}>123 Main Street, Dubai</Text>
              </View>
              <TouchableOpacity><Text style={styles.changeLink}>Change</Text></TouchableOpacity>
            </View>
          </View>

          {/* Order Items */}
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.sectionCard}>
            {cartItems.map(p => (
              <View key={p.id} style={styles.checkoutItem}>
                <View style={styles.checkoutItemImgWrap}>
                  <Image source={{ uri: p.image }} style={styles.checkoutItemIcon} resizeMode="cover" />
                  <View style={styles.checkoutItemFallback}>
                    <Ionicons name="bag-outline" size={24} color="#2E7AD9" />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={styles.checkoutItemName}>{p.name}</Text>
                    <Text style={styles.checkoutItemTotal}>${(p.price * cart[p.id]).toFixed(2)}</Text>
                  </View>
                  <Text style={styles.checkoutItemUnitPrice}>${p.price.toFixed(2)}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <View style={styles.qtyControls}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => {
                          if (cart[p.id] > 1) setCart({ ...cart, [p.id]: cart[p.id] - 1 });
                        }}
                      >
                        <Ionicons name="remove" size={18} color="#1E293B" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{cart[p.id]}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => setCart({ ...cart, [p.id]: cart[p.id] + 1 })}
                      >
                        <Ionicons name="add" size={18} color="#1E293B" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => {
                      const newCart = { ...cart };
                      delete newCart[p.id];
                      setCart(newCart);
                    }}>
                      <Ionicons name="trash-outline" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Price Details */}
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.sectionCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            {redeemPoints && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: '#D97706' }]}>Points Redeemed</Text>
                <Text style={[styles.summaryValue, { color: '#D97706' }]}>-${pointsDiscount.toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' }]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>

        {/* Fixed bottom button matching boss */}
        <View style={styles.checkoutFooter}>
          <TouchableOpacity style={styles.confirmBtn} onPress={() => setStep('review')}>
            <Text style={styles.confirmBtnText}>Confirm Address and Payment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── PRODUCTS SCREEN ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{params.name || 'Beauty Products'}</Text>
          <Text style={styles.headerSubtitle}>Browse products</Text>
        </View>
        <TouchableOpacity style={styles.cartIconBtn} onPress={cartCount > 0 ? () => setStep('checkout') : undefined}>
          <Ionicons name="cart-outline" size={22} color={colors.text.primary} />
          {cartCount > 0 && (
            <View style={styles.cartDot}><Text style={styles.cartDotText}>{cartCount}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      {/* Points Banner */}
      {isPoweredByDoHuub && (
        <View style={styles.pointsBanner}>
          <Ionicons name="gift-outline" size={16} color="#D97706" />
          <Text style={styles.pointsBannerText}>Earn points on every purchase · 1 point per $1 spent</Text>
        </View>
      )}

      {/* Category Tabs */}
      <View style={styles.tabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ height: 52, flexShrink: 0 }}
          contentContainerStyle={styles.tabsContent}
        >
          {CATEGORY_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productIconWrap} resizeMode="cover" />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDesc}>{item.description}</Text>
              <View style={styles.productMeta}>
                <Text style={styles.productSize}>{item.size}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.qtyControls}>
              {cart[item.id] ? (
                <View style={styles.qtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)}>
                    <Ionicons name="remove" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{cart[item.id]}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item.id)}>
                    <Ionicons name="add" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item.id)}>
                  <Ionicons name="add" size={18} color="#FFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* Cart Footer — tappable, goes to checkout */}
      {cartCount > 0 && (
        <TouchableOpacity style={styles.cartFooter} activeOpacity={0.85} onPress={() => setStep('checkout')}>
          <View style={styles.cartCountBadge}><Text style={styles.cartCountText}>{cartCount}</Text></View>
          <Text style={styles.cartFooterLabel}>View Cart</Text>
          <Text style={styles.cartFooterTotal}>${subtotal.toFixed(2)}</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  cartIconBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cartDot: { position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#EC4899', alignItems: 'center', justifyContent: 'center' },
  cartDotText: { fontSize: 9, fontWeight: '700', color: '#FFF' },

  // Points banner
  pointsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 12,
    backgroundColor: '#FFFBEB', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  pointsBannerText: { fontSize: fontSize.xs, color: '#92400E', fontWeight: '500', flex: 1 },

  // Tabs
  tabs: { marginTop: 12 },
  tabsContent: { paddingHorizontal: 20, paddingBottom: 8, height: 52, alignItems: 'center' },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', marginRight: 8 },
  tabActive: { backgroundColor: '#EC4899', borderColor: '#EC4899' },
  tabText: { fontSize: 13, color: colors.text.secondary, fontWeight: '500' },
  tabTextActive: { color: '#FFF' },

  // Products
  list: { padding: 20, gap: 12, paddingBottom: 100 },
  productCard: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: 'rgba(236,72,153,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  productIconWrap: { width: 72, height: 72, borderRadius: 12, flexShrink: 0, overflow: 'hidden' },
  productInfo: { flex: 1, minWidth: 0 },
  productName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 3 },
  productDesc: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 6 },
  productMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  productSize: { fontSize: fontSize.xs, color: colors.text.secondary, backgroundColor: '#F5F5F5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  productPrice: { fontSize: fontSize.sm, fontWeight: '700', color: colors.primary },
  qtyControls: { flexShrink: 0 },
  addBtn: { width: 34, height: 34, borderRadius: 99, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(46,122,217,0.2)', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 6 },
  qtyBtn: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  qtyNum: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, minWidth: 18, textAlign: 'center' },

  // Cart footer
  cartFooter: {
    position: 'absolute', bottom: 24, left: 20, right: 20,
    backgroundColor: colors.primary, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  cartCountBadge: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  cartCountText: { fontSize: fontSize.xs, fontWeight: '700', color: '#FFF' },
  cartFooterLabel: { fontSize: fontSize.sm, fontWeight: '600', color: '#FFF', flex: 1, marginLeft: 10 },
  cartFooterTotal: { fontSize: fontSize.md, fontWeight: '700', color: '#FFF', marginRight: 8 },

  // Checkout / Confirm shared
  checkoutScroll: { padding: 20, gap: 16, paddingBottom: 40 },
  confirmScroll: { padding: 20, gap: 16, paddingBottom: 40, alignItems: 'center' },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(46,122,217,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary, marginBottom: 10 },
  changeLink: { fontSize: fontSize.xs, color: colors.primary, fontWeight: '500' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: fontSize.sm, color: colors.text.secondary },
  checkoutItem: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)' },
  checkoutItemImgWrap: { width: 56, height: 56, borderRadius: 10, overflow: 'hidden', backgroundColor: '#F0F7FF' },
  checkoutItemIcon: { width: 56, height: 56, borderRadius: 10, position: 'absolute', top: 0, left: 0 },
  checkoutItemFallback: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  checkoutItemName: { fontSize: 14, fontWeight: '600', color: '#1E293B', flex: 1 },
  checkoutItemTotal: { fontSize: 15, fontWeight: '600', color: '#2E7AD9' },
  checkoutItemUnitPrice: { fontSize: 13, color: '#64748B', marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F7FF', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 2 },
  qtyBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, color: '#1E293B', fontWeight: '500' },
  qtyText: { fontSize: 15, fontWeight: '600', color: '#1E293B', minWidth: 28, textAlign: 'center' },
  checkoutItemSize: { fontSize: fontSize.xs, color: colors.text.secondary },
  checkoutItemQty: { fontSize: fontSize.sm, color: colors.text.secondary },
  checkoutItemPrice: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, minWidth: 60, textAlign: 'right' },
  redeemCard: { backgroundColor: '#FFFBEB', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#FDE68A' },
  redeemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  redeemTitle: { fontSize: fontSize.sm, fontWeight: '600', color: '#92400E' },
  redeemSub: { fontSize: fontSize.xs, color: '#B45309' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  summaryValue: { fontSize: fontSize.sm, color: colors.text.primary, fontWeight: '500' },
  totalLabel: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary },
  totalValue: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
  placeOrderBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  placeOrderBtnText: { fontSize: fontSize.sm, fontWeight: '700', color: '#FFF' },
  checkoutFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, paddingBottom: 28,
    backgroundColor: '#F0F7FF',
    borderTopWidth: 1, borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  confirmBtn: {
    backgroundColor: '#2E7AD9', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  confirmBtnText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  // Confirm screen
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  successTitle: { fontSize: 22, fontWeight: '700', color: colors.text.primary },
  successSubtitle: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: 8 },
  pointsEarnedCard: { backgroundColor: '#FFFBEB', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#FDE68A', width: '100%' },
  pointsEarnedTitle: { fontSize: fontSize.sm, fontWeight: '700', color: '#92400E' },
  pointsEarnedSub: { fontSize: fontSize.xs, color: '#B45309' },
  primaryActionBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', width: '100%', marginTop: 8 },
  primaryActionBtnText: { fontSize: fontSize.sm, fontWeight: '700', color: '#FFF' },
  secondaryActionBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: 'rgba(46,122,217,0.2)' },
  secondaryActionBtnText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.primary },
});
