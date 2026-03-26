import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing, borderRadius } from '../../src/constants/theme';
import { getVendorById, getReviewsByVendor } from '../../src/lib/queries';

const MOCK_SERVICES = [
  { id: 's1', title: 'Standard Cleaning', price: 80, rating: 4.8, desc: 'Regular home cleaning — dusting, vacuuming, mopping.' },
  { id: 's2', title: 'Deep Cleaning', price: 150, rating: 4.9, desc: 'Full deep clean including appliances, baseboards, and cabinets.' },
  { id: 's3', title: 'Move-In / Move-Out', price: 200, rating: 4.7, desc: 'Thorough cleaning for empty properties before or after a move.' },
];

const MOCK_REVIEWS = [
  { id: 'r1', name: 'Emily R.', date: '2 days ago',  rating: 5, comment: 'Absolutely fantastic! The team was professional and thorough.',  photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop'] },
  { id: 'r2', name: 'David L.', date: '1 week ago',  rating: 5, comment: 'Very reliable and detail-oriented. Will book again!',          photos: ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop'] },
  { id: 'r3', name: 'Carol B.', date: '2 weeks ago', rating: 4, comment: 'Good service overall. Arrived on time and did a great job.' },
];

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
      } catch {
        setVendor(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const displayName = vendor?.businessName || name || 'Provider';
  const displayRating = vendor?.rating ?? 4.9;
  const displayReviews = vendor?.reviewCount ?? 97;
  const isPowered = vendor?.isMichelle ?? false;
  const displayReviewList = reviews.length > 0 ? reviews : MOCK_REVIEWS;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vendor Profile</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{displayName}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            {vendor?.logo
              ? <Image source={{ uri: vendor.logo }} style={styles.avatarImg} />
              : <Ionicons name="sparkles" size={36} color={colors.primary} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vendorName}>{displayName}</Text>
            {isPowered && (
              <View style={styles.poweredBadge}>
                <Text style={styles.poweredTxt}>Powered by DoHuub</Text>
              </View>
            )}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={15} color="#F59E0B" />
              <Text style={styles.ratingVal}>{displayRating.toFixed(1)}</Text>
              <Text style={styles.ratingCnt}>({displayReviews} reviews)</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayReviews}+</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5+</Text>
            <Text style={styles.statLabel}>Years Exp.</Text>
          </View>
        </View>

        {/* Points Banner */}
        {isPowered && (
          <View style={styles.pointsBanner}>
            <View style={styles.pointsIcon}>
              <Ionicons name="gift" size={20} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pointsTitle}>Earn points on every booking</Text>
              <Text style={styles.pointsSub}>1 point per $1 spent • Points added after service completion</Text>
            </View>
          </View>
        )}

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutTxt}>
            {vendor?.description || `${displayName} is a trusted service provider delivering high-quality results. With years of experience and a commitment to customer satisfaction, we go above and beyond on every job.`}
          </Text>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services Offered</Text>
          {MOCK_SERVICES.map(s => (
            <View key={s.id} style={styles.serviceRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceName}>{s.title}</Text>
                <Text style={styles.serviceDesc} numberOfLines={1}>{s.desc}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.serviceRating}>{s.rating}</Text>
                </View>
              </View>
              <Text style={styles.servicePrice}>${s.price}</Text>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {displayReviewList.map((r: any) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <Text style={styles.reviewName}>{r.name || r.userName || 'Customer'}</Text>
                <Text style={styles.reviewDate}>{r.date || '1 week ago'}</Text>
              </View>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => (
                  <Ionicons key={s} name="star" size={13} color={s <= (r.rating ?? 5) ? '#FACC15' : '#E5E7EB'} />
                ))}
              </View>
              <Text style={styles.reviewComment}>{r.comment}</Text>
              {(r as any).photos && (r as any).photos.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                  {(r as any).photos.map((photo: string, i: number) => (
                    <Image key={i} source={{ uri: photo }} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden' }} resizeMode="cover" />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  backBtn: { padding: spacing.xs, width: 36 },
  headerTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, textAlign: 'center' },
  scroll: { padding: spacing.lg, gap: 14, paddingBottom: 40 },
  profileCard: { flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  avatarBox: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarImg: { width: 72, height: 72, borderRadius: 36 },
  vendorName: { fontSize: 18, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  poweredBadge: { alignSelf: 'flex-start', backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99, marginBottom: 6 },
  poweredTxt: { fontSize: 11, color: '#FFF', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingVal: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  ratingCnt: { fontSize: fontSize.sm, color: colors.text.secondary },
  statsRow: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(0,0,0,0.08)' },
  pointsBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' },
  pointsIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(245,158,11,0.2)', alignItems: 'center', justifyContent: 'center' },
  pointsTitle: { fontSize: fontSize.sm, fontWeight: '600', color: '#B45309' },
  pointsSub: { fontSize: fontSize.xs, color: '#D97706' },
  section: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', gap: 10 },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary },
  aboutTxt: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  serviceName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 2 },
  serviceDesc: { fontSize: fontSize.xs, color: colors.text.secondary, marginBottom: 4 },
  serviceRating: { fontSize: fontSize.xs, color: colors.text.secondary },
  servicePrice: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
  reviewCard: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 6 },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 18 },
});
