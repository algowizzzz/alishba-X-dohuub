import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';

const BEAUTY_PRODUCT_VENDORS = [
  { id: '1', name: 'Beauty on DE Run',  category: 'Full Beauty Store',     rating: 4.9, deliveryTime: '30-45 min', deliveryFee: 2.99, minOrder: 25, isPoweredByDoHuub: true,  image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop' },
  { id: '2', name: 'Glam Studio',       category: 'Makeup & Cosmetics',    rating: 4.8, deliveryTime: '25-40 min', deliveryFee: 1.99, minOrder: 20, isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop' },
  { id: '3', name: 'Beauty Lounge',     category: 'Skincare & Beauty',     rating: 4.7, deliveryTime: '35-50 min', deliveryFee: 3.49, minOrder: 30, isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200&h=200&fit=crop' },
  { id: '4', name: 'Elite Salon & Spa', category: 'Hair & Body Care',      rating: 4.6, deliveryTime: '40-55 min', deliveryFee: 2.49, minOrder: 15, isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop' },
  { id: '5', name: 'Radiance Beauty',   category: 'Skincare & Anti-Aging', rating: 4.5, deliveryTime: '45-60 min', deliveryFee: 0,    minOrder: 35, isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop' },
  { id: '6', name: 'Nail Art Studio',   category: 'Nail Products',         rating: 4.7, deliveryTime: '20-35 min', deliveryFee: 1.49, minOrder: 10, isPoweredByDoHuub: false, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop' },
];

export default function BeautyProductsVendorsList() {
  const navigateToCatalog = (item: typeof BEAUTY_PRODUCT_VENDORS[0]) => {
    router.push({ pathname: '/services/beauty/products/vendors/[id]', params: { id: item.id, name: item.name, isPoweredByDoHuub: String(item.isPoweredByDoHuub), rating: String(item.rating) } } as any);
  };

  const navigateToProfile = (item: typeof BEAUTY_PRODUCT_VENDORS[0]) => {
    router.push({ pathname: '/services/beauty/profile', params: { id: item.id, name: item.name, isPoweredByDoHuub: String(item.isPoweredByDoHuub), rating: String(item.rating) } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Beauty Products</Text>
          <Text style={styles.headerSubtitle}>Select a store</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn}>
          <Ionicons name="cart-outline" size={22} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={BEAUTY_PRODUCT_VENDORS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={{ uri: item.image }} style={styles.vendorImg} resizeMode="cover" />
              <View style={styles.vendorInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.vendorName} numberOfLines={1}>{item.name}</Text>
                  {item.isPoweredByDoHuub && (
                    <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text></View>
                  )}
                </View>
                <Text style={styles.categoryText}>{item.category}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="star" size={13} color="#FACC15" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Ionicons name="time-outline" size={13} color={colors.text.secondary} />
                  <Text style={styles.metaText}>{item.deliveryTime}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="bicycle-outline" size={13} color={colors.text.secondary} />
                  <Text style={styles.metaText}>{item.deliveryFee === 0 ? 'Free delivery' : `$${item.deliveryFee.toFixed(2)} delivery`}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.metaText}>Min ${item.minOrder}</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardBtns}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => navigateToCatalog(item)}>
                <Text style={styles.primaryBtnText}>Shop Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineBtn} onPress={() => navigateToProfile(item)}>
                <Text style={styles.outlineBtnText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cartBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  list: { padding: 24, gap: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: 'rgba(236,72,153,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  vendorImg: { width: 72, height: 72, borderRadius: 12, flexShrink: 0, overflow: 'hidden' },
  vendorInfo: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 },
  vendorName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, flex: 1 },
  dohuubBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, flexShrink: 0 },
  dohuubBadgeText: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  categoryText: { fontSize: fontSize.xs, color: '#EC4899', fontWeight: '500', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  ratingText: { fontSize: fontSize.xs, fontWeight: '600', color: colors.text.primary },
  dot: { fontSize: fontSize.xs, color: colors.text.secondary },
  metaText: { fontSize: fontSize.xs, color: colors.text.secondary },
  cardBtns: { flexDirection: 'row', gap: 8 },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '600' },
  outlineBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(46,122,217,0.2)' },
  outlineBtnText: { color: colors.text.primary, fontSize: fontSize.sm, fontWeight: '500' },
});
