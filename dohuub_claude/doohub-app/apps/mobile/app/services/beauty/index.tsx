import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';
import { getBeautyListings } from '../../../src/lib/queries';

interface BeautyProvider {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  services: string[];
  isPoweredByDoHuub: boolean;
  image?: string;
}

export default function BeautyServicesVendorsList() {
  const [providers, setProviders] = useState<BeautyProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const rows = await getBeautyListings();
        // Group listings by vendor — each vendor card aggregates the services they offer.
        const byVendor = new Map<string, BeautyProvider>();
        for (const r of rows || []) {
          const vendor = Array.isArray(r.Vendor) ? r.Vendor[0] : r.Vendor;
          if (!vendor) continue;
          const existing = byVendor.get(vendor.id);
          if (existing) {
            if (r.beautyType && !existing.services.includes(r.beautyType)) {
              existing.services.push(r.beautyType);
            }
          } else {
            byVendor.set(vendor.id, {
              id: vendor.id,
              name: vendor.businessName,
              rating: Number(vendor.rating) || 0,
              reviews: Number(vendor.reviewCount) || 0,
              services: r.beautyType ? [r.beautyType] : [],
              isPoweredByDoHuub: Boolean(vendor.isMichelle),
              image: vendor.logo || vendor.coverImage || undefined,
            });
          }
        }
        const list = Array.from(byVendor.values()).sort(
          (a, b) => Number(b.isPoweredByDoHuub) - Number(a.isPoweredByDoHuub) || b.rating - a.rating
        );
        setProviders(list);
      } catch (e) {
        console.warn('Failed to load beauty providers:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const navigateToServices = (item: BeautyProvider) => {
    router.push({ pathname: '/services/beauty/[id]', params: { id: item.id, name: item.name, isPoweredByDoHuub: String(item.isPoweredByDoHuub), rating: String(item.rating), reviews: String(item.reviews) } } as any);
  };

  const navigateToProfile = (item: BeautyProvider) => {
    router.push({ pathname: '/services/beauty/profile', params: { id: item.id, name: item.name, isPoweredByDoHuub: String(item.isPoweredByDoHuub), rating: String(item.rating), reviews: String(item.reviews), services: item.services.join(',') } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Beauty Services</Text>
          <Text style={styles.headerSubtitle}>Select a service provider</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
      <FlatList
        data={providers}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{ color: colors.text.secondary, textAlign: 'center', marginTop: 40 }}>No beauty providers found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.vendorImg} resizeMode="cover" />
              ) : (
                <View style={[styles.vendorImg, { backgroundColor: 'rgba(46,122,217,0.15)', alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="sparkles" size={28} color={colors.primary} />
                </View>
              )}
              <View style={styles.vendorInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.vendorName}>{item.name}</Text>
                  {item.isPoweredByDoHuub && (
                    <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text></View>
                  )}
                </View>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#FACC15" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
                </View>
                <Text style={styles.servicesText} numberOfLines={1}>{item.services.join(' • ')}</Text>
              </View>
            </View>
            <View style={styles.cardBtns}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => navigateToServices(item)}>
                <Text style={styles.primaryBtnText}>View Services</Text>
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
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  headerSubtitle: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  list: { padding: 24, gap: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  vendorImg: { width: 72, height: 72, borderRadius: 12, flexShrink: 0, overflow: 'hidden' },
  vendorInfo: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  vendorName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  dohuubBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, flexShrink: 0 },
  dohuubBadgeText: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  ratingText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewsText: { fontSize: fontSize.sm, color: colors.text.secondary },
  servicesText: { fontSize: fontSize.sm, color: colors.text.secondary },
  cardBtns: { flexDirection: 'row', gap: 8 },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '600' },
  outlineBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(46,122,217,0.2)' },
  outlineBtnText: { color: colors.text.primary, fontSize: fontSize.sm, fontWeight: '500' },
});
