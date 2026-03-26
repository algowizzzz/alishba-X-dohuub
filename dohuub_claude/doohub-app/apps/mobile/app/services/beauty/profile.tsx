import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';

const BEAUTY_PHOTOS = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
];

const MOCK_REVIEWS = [
  { name: 'Sophia L.', date: '2 days ago', rating: 5, comment: 'Absolutely amazing experience! The stylist was professional and the results exceeded my expectations.', service: 'Hairstyling', photos: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop'] },
  { name: 'Emma W.', date: '4 days ago', rating: 5, comment: 'Best makeup artist I have ever worked with. Made me look stunning for my event!', service: 'Makeup', photos: ['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200&h=200&fit=crop'] },
  { name: 'Mia J.', date: '1 week ago', rating: 4, comment: 'Great nail art, very creative designs. Will definitely come back.', service: 'Nail Art' },
];

export default function BeautyVendorProfileScreen() {
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    isPoweredByDoHuub: string;
    rating: string;
    reviews: string;
    services: string;
  }>();

  const vendorName = params.name || 'Beauty Studio';
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';
  const rating = parseFloat(params.rating || '4.8');
  const reviewCount = parseInt(params.reviews || '500', 10);
  const servicesList = params.services ? params.services.split(',') : ['Makeup', 'Hairstyling', 'Skincare'];
  const photoIndex = parseInt(params.id || '0', 10) % BEAUTY_PHOTOS.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vendor Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: BEAUTY_PHOTOS[photoIndex] }}
            style={styles.vendorPhoto}
            resizeMode="cover"
          />
          <Text style={styles.vendorName}>{vendorName}</Text>
          {isPoweredByDoHuub && (
            <View style={styles.dohuubBadge}>
              <Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text>
            </View>
          )}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#FACC15" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.reviewCountText}>({reviewCount} reviews)</Text>
          </View>
          <Text style={styles.locationText}>New York, NY • Beauty & Wellness</Text>
        </View>

        <View style={styles.body}>
          {/* Services Offered */}
          <Text style={styles.sectionTitle}>Services Offered</Text>
          <View style={styles.servicesGrid}>
            {servicesList.map((service, i) => (
              <View key={i} style={styles.serviceChip}>
                <Ionicons name="sparkles" size={13} color={colors.primary} />
                <Text style={styles.serviceChipText}>{service.trim()}</Text>
              </View>
            ))}
          </View>

          {/* About */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.cardBody}>
              {vendorName} is a premier beauty destination offering a full range of professional beauty services. Our experienced team of specialists is dedicated to making you look and feel your best, using premium products and the latest techniques.
            </Text>
          </View>

          {/* Info */}
          <Text style={styles.sectionTitle}>Information</Text>
          <View style={styles.infoCard}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>123 Beauty Avenue</Text>
              <Text style={styles.infoSub}>New York, NY 10001</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>Working Hours</Text>
              <Text style={styles.infoSub}>9:00 AM – 8:00 PM, Mon – Sat</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="call" size={20} color={colors.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoSub}>+1 (212) 555-0{100 + parseInt(params.id || '1', 10)}</Text>
            </View>
          </View>

          {/* Ratings summary */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
            <TouchableOpacity><Text style={styles.viewAllLink}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.ratingCard}>
            <View style={styles.ratingLeft}>
              <Text style={styles.ratingBig}>{rating}</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={14} color="#FACC15" />)}
              </View>
              <Text style={styles.reviewCountSmall}>{reviewCount} reviews</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              {[5,4,3,2,1].map(star => (
                <View key={star} style={styles.barRow}>
                  <Text style={styles.barLabel}>{star}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${star === 5 ? 72 : star === 4 ? 20 : 8}%` as any }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {MOCK_REVIEWS.map((review, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Ionicons name="person" size={18} color={colors.text.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.reviewNameRow}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {[1,2,3,4,5].map(s => (
                      <Ionicons key={s} name="star" size={12} color={s <= review.rating ? '#FACC15' : '#E5E7EB'} />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              {review.photos && review.photos.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, marginBottom: 4 }}>
                  {review.photos.map((photo, i) => (
                    <Image key={i} source={{ uri: photo }} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden' }} resizeMode="cover" />
                  ))}
                </View>
              )}
              <Text style={styles.reviewService}>Service: {review.service}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push({
            pathname: '/services/beauty/[id]',
            params: { id: params.id, name: vendorName, isPoweredByDoHuub: String(isPoweredByDoHuub), rating: String(rating), reviews: String(reviewCount) },
          } as any)}
        >
          <Text style={styles.bookBtnText}>View Services</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  profileHeader: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24 },
  vendorPhoto: { width: 100, height: 100, borderRadius: 50, marginBottom: 14, borderWidth: 3, borderColor: colors.primary },
  vendorName: { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 8, textAlign: 'center' },
  dohuubBadge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, marginBottom: 8 },
  dohuubBadgeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  ratingText: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  reviewCountText: { fontSize: 13, color: '#6B7280' },
  locationText: { fontSize: 13, color: '#6B7280' },
  body: { paddingHorizontal: 20, gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A2E', marginTop: 4 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(46,122,217,0.08)', borderRadius: 99,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(46,122,217,0.15)',
  },
  serviceChipText: { fontSize: 13, color: colors.primary, fontWeight: '500' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  cardBody: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  infoSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  viewAllLink: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  ratingCard: { flexDirection: 'row', alignItems: 'center', gap: 20, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  ratingLeft: { alignItems: 'center' },
  ratingBig: { fontSize: 36, fontWeight: '700', color: '#1A1A2E' },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
  reviewCountSmall: { fontSize: 11, color: '#6B7280' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { fontSize: 12, color: '#6B7280', width: 10 },
  barBg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: colors.primary },
  reviewCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  reviewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  reviewNameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reviewName: { fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
  reviewDate: { fontSize: 11, color: '#6B7280' },
  reviewComment: { fontSize: 13, color: '#6B7280', lineHeight: 19, marginBottom: 6 },
  reviewService: { fontSize: 11, color: '#9CA3AF' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: 'rgba(46,122,217,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 6 },
  bookBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  bookBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
