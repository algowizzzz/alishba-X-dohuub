import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';
import { getBeautyProducts } from '../../../../src/lib/queries';

interface BeautyProductVendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isPoweredByDoHuub: boolean;
  image?: string;
}

export default function BeautyProductsVendorsList() {
  const [vendors, setVendors] = useState<BeautyProductVendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rows = await getBeautyProducts();
        const byVendor = new Map<string, BeautyProductVendor>();
        for (const r of rows || []) {
          const vendor = Array.isArray(r.Vendor) ? r.Vendor[0] : r.Vendor;
          if (!vendor || byVendor.has(vendor.id)) continue;
          byVendor.set(vendor.id, {
            id: vendor.id,
            name: vendor.businessName,
            category: r.category || 'Beauty Products',
            rating: Number(vendor.rating) || 0,
            deliveryTime: '30-45 min',
            deliveryFee: 0,
            minOrder: 0,
            isPoweredByDoHuub: Boolean(vendor.isMichelle),
            image: r.image || vendor.coverImage || vendor.logo || undefined,
          });
        }
        const list = Array.from(byVendor.values()).sort(
          (a, b) => Number(b.isPoweredByDoHuub) - Number(a.isPoweredByDoHuub) || b.rating - a.rating
        );
        setVendors(list);
      } catch (e) {
        console.warn('Failed to load beauty products vendors:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const navigateToCatalog = (item: BeautyProductVendor) => {
    router.push({ pathname: '/services/beauty/products/vendors/[id]', params: { id: item.id, name: item.name, isPoweredByDoHuub: String(item.isPoweredByDoHuub), rating: String(item.rating) } } as any);
  };

  const navigateToProfile = (item: BeautyProductVendor) => {
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

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
      <FlatList
        data={vendors}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{ color: colors.text.secondary, textAlign: 'center', marginTop: 40 }}>No stores found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.vendorImg} resizeMode="cover" />
              ) : (
                <View style={[styles.vendorImg, { backgroundColor: 'rgba(236,72,153,0.15)', alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="bag-handle" size={28} color="#EC4899" />
                </View>
              )}
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
      )}
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
