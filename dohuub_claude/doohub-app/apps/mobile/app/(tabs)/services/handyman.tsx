import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform, StatusBar, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const handymanImg = require('../../../assets/cat-handyman.png');

const VENDORS = [
  { id: '1', name: 'DoHuub Official',     tagline: 'Trusted, verified handyman services across all categories.',            rating: 4.9, reviews: 1247, isPowered: true,  startingPrice: 65 },
  { id: '2', name: 'The Handyman Hub',    tagline: 'One-stop solution for all home repair needs with 15+ years experience.', rating: 4.9, reviews: 401,  isPowered: false, startingPrice: 70 },
  { id: '3', name: 'Home Repair Masters', tagline: 'Specializes in general repairs, painting, and furniture assembly.',      rating: 4.8, reviews: 256,  isPowered: false, startingPrice: 55 },
  { id: '4', name: 'Quick Fix Services',  tagline: 'Fast and efficient solutions for appliance repairs and installations.',   rating: 4.7, reviews: 189,  isPowered: false, startingPrice: 60 },
];

/**
 * Handyman Services — matching boss wireframe (HandymanVendorsListScreen.tsx):
 * - Glassmorphic header with back button in white card
 * - Vendor cards with handyman image, left blue border
 * - "Powered by DoHuub" badge
 * - Star rating + review count
 */
export default function HandymanServicesScreen() {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={s.container}>
      {/* Header — glassmorphic */}
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

      <ScrollView
        style={s.list}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />}
      >
        {VENDORS.map((vendor, index) => (
          <TouchableOpacity
            key={vendor.id}
            style={s.vendorCard}
            onPress={() => router.push({ pathname: '/services/handyman/[id]', params: { id: vendor.id } } as any)}
            activeOpacity={0.7}
          >
            <View style={s.cardRow}>
              {/* Vendor Image — handyman icon */}
              <Image source={handymanImg} style={s.vendorLogo} resizeMode="contain" />

              {/* Vendor Info */}
              <View style={s.vendorInfo}>
                <View style={s.nameRow}>
                  <Text style={s.vendorName} numberOfLines={1}>{vendor.name}</Text>
                  {vendor.isPowered && (
                    <View style={s.dohuubBadge}>
                      <Text style={s.dohuubBadgeText}>Powered by DoHuub</Text>
                    </View>
                  )}
                </View>

                <View style={s.ratingRow}>
                  <View style={s.ratingInner}>
                    <Ionicons name="star" size={14} color="#FACC15" />
                    <Text style={s.ratingText}>{vendor.rating}</Text>
                  </View>
                  <Text style={s.reviewCount}>({vendor.reviews})</Text>
                </View>

                <Text style={s.tagline} numberOfLines={1}>{vendor.tagline}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

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
});
