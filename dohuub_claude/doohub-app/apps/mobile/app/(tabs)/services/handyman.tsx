import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform, StatusBar, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ServiceSearchBar } from '../../../src/components/ui/ServiceSearchBar';
import { getHandymanListings } from '../../../src/lib/queries';

const handymanImg = require('../../../assets/cat-handyman.png');

const FALLBACK_VENDORS = [
  { id: '1', name: 'DoHuub Official',     tagline: 'Trusted, verified handyman services across all categories.',            rating: 4.9, reviewCount: 1247, isPoweredByDoHuub: true,  startingPrice: 65, vendorId: '1', logo: null },
  { id: '2', name: 'The Handyman Hub',    tagline: 'One-stop solution for all home repair needs with 15+ years experience.', rating: 4.9, reviewCount: 401,  isPoweredByDoHuub: false, startingPrice: 70, vendorId: '2', logo: null },
  { id: '3', name: 'Home Repair Masters', tagline: 'Specializes in general repairs, painting, and furniture assembly.',      rating: 4.8, reviewCount: 256,  isPoweredByDoHuub: false, startingPrice: 55, vendorId: '3', logo: null },
  { id: '4', name: 'Quick Fix Services',  tagline: 'Fast and efficient solutions for appliance repairs and installations.',   rating: 4.7, reviewCount: 189,  isPoweredByDoHuub: false, startingPrice: 60, vendorId: '4', logo: null },
];

export default function HandymanServicesScreen() {
  const [vendors, setVendors] = useState<any[]>(FALLBACK_VENDORS);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchVendors = async () => {
    try {
      const data = await getHandymanListings();
      if (data && data.length > 0) {
        const mapped = data.map((item: any, index: number) => ({
          id: item.id || item.vendorId || String(index),
          name: item.Vendor?.businessName || item.title || FALLBACK_VENDORS[index % FALLBACK_VENDORS.length].name,
          rating: item.Vendor?.rating ?? 0,
          reviewCount: item.Vendor?.reviewCount ?? 0,
          tagline: item.title || item.description || FALLBACK_VENDORS[index % FALLBACK_VENDORS.length].tagline,
          isPoweredByDoHuub: item.Vendor?.isMichelle || false,
          startingPrice: item.basePrice ?? item.hourlyRate ?? FALLBACK_VENDORS[index % FALLBACK_VENDORS.length].startingPrice,
          vendorId: item.vendorId,
          logo: item.Vendor?.logo || null,
        }));
        setVendors(mapped);
      }
    } catch (e) {
      console.error('Failed to fetch handyman vendors:', e);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vendors;
    return vendors.filter(
      (v) =>
        v.name?.toLowerCase().includes(q) ||
        v.tagline?.toLowerCase().includes(q)
    );
  }, [vendors, search]);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerInner}>
          <TouchableOpacity style={s.backBtn} onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/(tabs)');
          }}>
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Handyman Services</Text>
        </View>
      </View>

      <ServiceSearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search handyman services..."
      />

      <ScrollView
        style={s.list}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchVendors();
              setRefreshing(false);
            }}
          />
        }
      >
        {filtered.length === 0 ? (
          <View style={s.emptySearch}>
            <Ionicons name="search-outline" size={36} color="#94A3B8" />
            <Text style={s.emptySearchTitle}>No matches</Text>
            <Text style={s.emptySearchText}>Try a different business or service name</Text>
          </View>
        ) : (
          filtered.map((vendor) => (
            <TouchableOpacity
              key={vendor.id}
              style={s.vendorCard}
              onPress={() => router.push({
                pathname: '/services/handyman/[id]',
                params: { id: vendor.vendorId || vendor.id },
              } as any)}
              activeOpacity={0.7}
            >
              <View style={s.cardRow}>
                <Image
                  source={vendor.logo ? { uri: vendor.logo } : handymanImg}
                  style={s.vendorLogo}
                  resizeMode={vendor.logo ? 'cover' : 'contain'}
                />

                <View style={s.vendorInfo}>
                  <View style={s.nameRow}>
                    <Text style={s.vendorName} numberOfLines={1}>{vendor.name}</Text>
                    {vendor.isPoweredByDoHuub && (
                      <View style={s.dohuubBadge}>
                        <Text style={s.dohuubBadgeText}>Powered by DoHuub</Text>
                      </View>
                    )}
                  </View>

                  <View style={s.ratingRow}>
                    <View style={s.ratingInner}>
                      <Ionicons name="star" size={14} color="#FACC15" />
                      <Text style={s.ratingText}>{Number(vendor.rating || 0).toFixed(1)}</Text>
                    </View>
                    <Text style={s.reviewCount}>({vendor.reviewCount || 0})</Text>
                  </View>

                  <Text style={s.tagline} numberOfLines={1}>{vendor.tagline}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7FF' },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 60,
    paddingBottom: 24, paddingHorizontal: 24,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 30, elevation: 4,
    borderBottomWidth: 1, borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B' },
  list: { flex: 1 },
  listContent: { padding: 24, gap: 16 },
  vendorCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.15)',
    borderLeftWidth: 3, borderLeftColor: '#2E7AD9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardRow: { flexDirection: 'row', gap: 16 },
  vendorLogo: { width: 64, height: 64, borderRadius: 32 },
  vendorInfo: { flex: 1, minWidth: 0 },
  nameRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: 8, marginBottom: 4,
  },
  vendorName: { fontSize: 16, fontWeight: '600', color: '#1E293B', flexShrink: 1 },
  dohuubBadge: {
    backgroundColor: '#2E7AD9', paddingHorizontal: 8,
    paddingVertical: 4, borderRadius: 12, flexShrink: 0,
  },
  dohuubBadgeText: { fontSize: 10, fontWeight: '600', color: '#FFFFFF' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  ratingInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  reviewCount: { fontSize: 14, color: '#64748B' },
  tagline: { fontSize: 14, color: '#64748B' },
  emptySearch: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptySearchTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginTop: 8 },
  emptySearchText: { fontSize: 14, color: '#64748B', textAlign: 'center' },
});
