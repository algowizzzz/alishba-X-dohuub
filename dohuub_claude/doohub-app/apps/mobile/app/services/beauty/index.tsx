import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';

const BEAUTY_PHOTOS = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200&h=200&fit=crop',
];

const BEAUTY_SERVICE_PROVIDERS = [
  { id: '1', name: 'Beauty on DE Run', rating: 4.9, reviews: 1250, services: ['Makeup', 'Hairstyling', 'Skincare', 'Nail Art', 'Spa Services'], isPoweredByDoHuub: true },
  { id: '2', name: 'Glam Studio',      rating: 4.8, reviews: 892,  services: ['Bridal Makeup', 'Hair Coloring', 'Extensions', 'Styling'],       isPoweredByDoHuub: false },
  { id: '3', name: 'Beauty Lounge',    rating: 4.7, reviews: 654,  services: ['Facials', 'Waxing', 'Threading', 'Pedicure', 'Manicure'],         isPoweredByDoHuub: false },
  { id: '4', name: 'Elite Salon & Spa',rating: 4.6, reviews: 523,  services: ['Hair Treatments', 'Massage', 'Body Treatments', 'Makeup'],        isPoweredByDoHuub: false },
  { id: '5', name: 'Radiance Beauty',  rating: 4.5, reviews: 431,  services: ['Skin Care', 'Anti-Aging', 'Laser Treatments', 'Botox'],           isPoweredByDoHuub: false },
  { id: '6', name: 'Nail Art Studio',  rating: 4.7, reviews: 389,  services: ['Nail Extensions', 'Gel Polish', 'Nail Art', 'Pedicure'],          isPoweredByDoHuub: false },
];

export default function BeautyServicesVendorsList() {
  const navigateToServices = (item: typeof BEAUTY_SERVICE_PROVIDERS[0]) => {
    router.push({ pathname: '/services/beauty/[id]', params: { id: item.id, name: item.name, isPoweredByDoHuub: String(item.isPoweredByDoHuub), rating: String(item.rating), reviews: String(item.reviews) } } as any);
  };

  const navigateToProfile = (item: typeof BEAUTY_SERVICE_PROVIDERS[0]) => {
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

      <FlatList
        data={BEAUTY_SERVICE_PROVIDERS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={{ uri: BEAUTY_PHOTOS[index % BEAUTY_PHOTOS.length] }} style={styles.vendorImg} resizeMode="cover" />
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
