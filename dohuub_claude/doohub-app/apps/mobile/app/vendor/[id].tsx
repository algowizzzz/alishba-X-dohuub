import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Image, Platform, StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getVendorById, getReviewsByVendor } from '../../src/lib/queries';

const cleaningLogos = [
  require('../../assets/cleaning/logos/logo1.png'),
  require('../../assets/cleaning/logos/logo2.png'),
  require('../../assets/cleaning/logos/logo3.png'),
];

const MOCK_SERVICES = [
  { id: 1, name: 'Basic Cleaning', description: 'Essential cleaning for your home', price: 89, duration: '2-3 hours', rating: 4.8 },
  { id: 2, name: 'Deep Cleaning', description: 'Thorough cleaning of every corner', price: 149, duration: '4-5 hours', rating: 4.9 },
  { id: 3, name: 'Move In/Out Cleaning', description: 'Complete cleaning for moving', price: 199, duration: '5-6 hours', rating: 4.7 },
];

const MOCK_REVIEWS = [
  { id: 'r1', name: 'Sarah M.', date: '3 days ago', rating: 5, comment: 'Excellent service! The team was professional, thorough, and my home has never looked better. Highly recommend!' },
  { id: 'r2', name: 'Michael R.', date: '1 week ago', rating: 5, comment: "Very reliable and detail-oriented. They cleaned areas I didn't even think about. Great value for money." },
  { id: 'r3', name: 'Jennifer K.', date: '2 weeks ago', rating: 4, comment: 'Good service overall. A bit pricey but the quality is there. Would use again.' },
];

/**
 * Vendor Profile — exact match to boss wireframe (CleaningVendorProfileScreen.tsx):
 * - Centered vendor logo, name, badge, rating
 * - About card
 * - Service Information (Service Area + Operating Hours)
 * - Services Offered list
 * - Reviews & Ratings with summary + review cards
 */
export default function VendorProfileScreen() {
  const { id, name, category } = useLocalSearchParams<{ id: string; name: string; category: string }>();
  const [vendor, setVendor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const v = await getVendorById(id);
        setVendor(v);
        try { setReviews(await getReviewsByVendor(id)); } catch { setReviews([]); }
      } catch { setVendor(null); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const displayName = vendor?.businessName || name || 'Provider';
  const displayRating = vendor?.rating ?? 4.9;
  const displayReviews = vendor?.reviewCount ?? 342;
  const isPowered = vendor?.isMichelle ?? false;
  const displayReviewList = reviews.length > 0 ? reviews : MOCK_REVIEWS;

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <Header />
        <View style={s.centered}><ActivityIndicator size="large" color="#2E7AD9" /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Centered Vendor Header */}
        <View style={s.vendorHeader}>
          <Image
            source={vendor?.logo ? { uri: vendor.logo } : cleaningLogos[parseInt(id, 10) % cleaningLogos.length || 0]}
            style={s.vendorLogo}
            resizeMode="cover"
          />
          <Text style={s.vendorName}>{displayName}</Text>
          {isPowered && (
            <View style={s.poweredBadge}>
              <Text style={s.poweredText}>Powered by DoHuub</Text>
            </View>
          )}
          <View style={s.ratingRow}>
            <Ionicons name="star" size={18} color="#FACC15" />
            <Text style={s.ratingValue}>{displayRating.toFixed(1)}</Text>
          </View>
        </View>

        {/* About */}
        <View style={s.card}>
          <Text style={s.cardTitle}>About</Text>
          <Text style={s.cardText}>
            {vendor?.description || 'Professional cleaning services with over 5 years of experience. We pride ourselves on attention to detail and customer satisfaction. Our trained staff uses eco-friendly products and follows strict quality standards.'}
          </Text>
        </View>

        {/* Service Information */}
        <View style={s.sectionGap}>
          <Text style={s.sectionTitle}>Service Information</Text>

          <View style={s.card}>
            <View style={s.infoRow}>
              <View style={s.infoIcon}>
                <Ionicons name="location" size={20} color="#2E7AD9" />
              </View>
              <View>
                <Text style={s.infoLabel}>Service Area</Text>
                <Text style={s.infoValue}>Miami-Dade County & Surrounding Areas</Text>
              </View>
            </View>
          </View>

          <View style={s.card}>
            <View style={s.infoRow}>
              <View style={s.infoIcon}>
                <Ionicons name="time" size={20} color="#2E7AD9" />
              </View>
              <Text style={s.infoLabel}>Operating Hours</Text>
            </View>
            <View style={s.hoursBlock}>
              <View style={s.hoursRow}>
                <Text style={s.hoursDay}>Monday - Friday</Text>
                <Text style={s.hoursTime}>8:00 AM - 6:00 PM</Text>
              </View>
              <View style={s.hoursRow}>
                <Text style={s.hoursDay}>Saturday</Text>
                <Text style={s.hoursTime}>9:00 AM - 5:00 PM</Text>
              </View>
              <View style={s.hoursRow}>
                <Text style={s.hoursDay}>Sunday</Text>
                <Text style={s.hoursTime}>10:00 AM - 4:00 PM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Services Offered */}
        <View style={s.sectionGap}>
          <Text style={s.sectionTitle}>Services Offered</Text>
          {MOCK_SERVICES.map((svc) => (
            <TouchableOpacity key={svc.id} style={s.card} activeOpacity={0.7}>
              <View style={s.serviceRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.serviceName}>{svc.name}</Text>
                  <Text style={s.serviceDesc}>{svc.description}</Text>
                  <View style={s.serviceMetaRow}>
                    <View style={s.ratingSmall}>
                      <Ionicons name="star" size={14} color="#FACC15" />
                      <Text style={s.serviceRating}>{svc.rating}</Text>
                    </View>
                    <View style={s.ratingSmall}>
                      <Ionicons name="time-outline" size={14} color="#64748B" />
                      <Text style={s.serviceDuration}>{svc.duration}</Text>
                    </View>
                  </View>
                </View>
                <Text style={s.servicePrice}>${svc.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reviews & Ratings */}
        <View style={s.sectionGap}>
          <View style={s.reviewsHeaderRow}>
            <Text style={s.sectionTitle}>Reviews & Ratings</Text>
            <TouchableOpacity style={s.viewAllBtn}>
              <Text style={s.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={14} color="#2E7AD9" />
            </TouchableOpacity>
          </View>

          {/* Rating Summary */}
          <View style={s.card}>
            <View style={s.ratingSummaryRow}>
              <View style={s.ratingSummaryLeft}>
                <Text style={s.ratingSummaryNumber}>{displayRating.toFixed(1)}</Text>
                <View style={s.starsRow}>
                  {[1,2,3,4,5].map(star => (
                    <Ionicons key={star} name="star" size={14} color="#FACC15" />
                  ))}
                </View>
                <Text style={s.ratingSummaryCount}>{displayReviews} reviews</Text>
              </View>
              <View style={s.ratingBars}>
                {[5,4,3,2,1].map(rating => (
                  <View key={rating} style={s.barRow}>
                    <Text style={s.barLabel}>{rating}</Text>
                    <View style={s.barTrack}>
                      <View style={[s.barFill, { width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Review Cards */}
          {displayReviewList.slice(0, 3).map((review: any, idx: number) => (
            <View key={review.id || idx} style={s.card}>
              <View style={s.reviewTopRow}>
                <View style={s.reviewAvatar}>
                  <Ionicons name="person" size={18} color="#64748B" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.reviewNameRow}>
                    <Text style={s.reviewName}>{review.name || review.userName || 'Customer'}</Text>
                    <Text style={s.reviewDate}>{review.date || '1 week ago'}</Text>
                  </View>
                  <View style={s.starsRow}>
                    {[1,2,3,4,5].map(star => (
                      <Ionicons key={star} name="star" size={14} color={star <= (review.rating ?? 5) ? '#FACC15' : '#E5E7EB'} />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={s.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={s.header}>
      <View style={s.headerInner}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Vendor Profile</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7FF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B' },

  scroll: { padding: 24, gap: 16 },

  // Centered vendor header
  vendorHeader: { alignItems: 'center', paddingVertical: 8 },
  vendorLogo: {
    width: 96, height: 96, borderRadius: 48, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12,
  },
  vendorName: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  poweredBadge: {
    backgroundColor: '#2E7AD9', paddingHorizontal: 16, paddingVertical: 4,
    borderRadius: 20, marginBottom: 12,
  },
  poweredText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingValue: { fontSize: 16, fontWeight: '600', color: '#1E293B' },

  // White cards
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: '500', color: '#1E293B', marginBottom: 12 },
  cardText: { fontSize: 14, color: '#64748B', lineHeight: 22 },

  // Sections
  sectionGap: { gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '500', color: '#1E293B' },

  // Service Information
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F1FC',
    alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { fontSize: 15, fontWeight: '500', color: '#1E293B' },
  infoValue: { fontSize: 13, color: '#64748B', marginTop: 2 },
  hoursBlock: { marginTop: 12, gap: 8 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between' },
  hoursDay: { fontSize: 13, color: '#64748B' },
  hoursTime: { fontSize: 13, fontWeight: '500', color: '#1E293B' },

  // Services Offered
  serviceRow: { flexDirection: 'row', alignItems: 'flex-start' },
  serviceName: { fontSize: 15, fontWeight: '500', color: '#1E293B', marginBottom: 4 },
  serviceDesc: { fontSize: 13, color: '#64748B', marginBottom: 8 },
  serviceMetaRow: { flexDirection: 'row', gap: 16 },
  ratingSmall: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  serviceRating: { fontSize: 13, fontWeight: '500', color: '#1E293B' },
  serviceDuration: { fontSize: 13, color: '#64748B' },
  servicePrice: { fontSize: 16, fontWeight: '600', color: '#2E7AD9', marginLeft: 16 },

  // Reviews
  reviewsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { fontSize: 14, color: '#2E7AD9', fontWeight: '500' },

  ratingSummaryRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  ratingSummaryLeft: { alignItems: 'center' },
  ratingSummaryNumber: { fontSize: 36, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 4 },
  ratingSummaryCount: { fontSize: 13, color: '#64748B' },
  ratingBars: { flex: 1, gap: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { fontSize: 12, color: '#64748B', width: 12 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#E8F1FC', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: '#2E7AD9' },

  reviewTopRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  reviewAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F1FC',
    alignItems: 'center', justifyContent: 'center',
  },
  reviewNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  reviewName: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  reviewDate: { fontSize: 12, color: '#64748B' },
  reviewComment: { fontSize: 13, color: '#64748B', lineHeight: 20 },
});
