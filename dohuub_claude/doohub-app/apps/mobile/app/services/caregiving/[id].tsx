import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, Share, Platform, ActionSheetIOS,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { Button, Rating, ImageCarousel } from '../../../src/components/ui';
import { ReportModal } from '../../../src/components/modals';
import { getVendorById, getCompanionListings, getReviewsByVendor } from '../../../src/lib/queries';

export default function CaregivingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vendor, setVendor] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [v, allListings] = await Promise.all([
        getVendorById(id),
        getCompanionListings(),
      ]);
      setVendor(v);
      // Find the listing for this vendor
      const vendorListing = allListings.find((l: any) => l.vendorId === id) || allListings[0] || null;
      setListing(vendorListing);
      try { setReviews(await getReviewsByVendor(id)); } catch { setReviews([]); }
    } catch (e) {
      console.error('Failed to fetch caregiving provider:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleMoreMenu = () => {
    const options = ['Share', 'Report', 'Cancel'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({ options, cancelButtonIndex: 2, destructiveButtonIndex: 1 }, (i) => {
        if (i === 0) Share.share({ message: `Check out ${vendor?.businessName} on DoHuub!` });
        if (i === 1) setShowReportModal(true);
      });
    } else {
      Alert.alert('Options', '', [
        { text: 'Share', onPress: () => Share.share({ message: `Check out ${vendor?.businessName} on DoHuub!` }) },
        { text: 'Report', style: 'destructive', onPress: () => setShowReportModal(true) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
    </SafeAreaView>
  );

  if (!vendor) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.centered}><Text style={styles.errorText}>Provider not found</Text></View>
    </SafeAreaView>
  );

  const images = listing?.credentialImages?.length > 0
    ? [listing.image, ...listing.credentialImages].filter(Boolean)
    : [listing?.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'];

  const specialties: string[] = listing?.specialties || [];
  const supportTypes: string[] = listing?.supportTypes || [];
  const certifications: string[] = listing?.certifications || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{vendor.businessName}</Text>
        <TouchableOpacity onPress={handleMoreMenu} style={styles.backBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ImageCarousel images={images} height={260} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.infoSection}>
          <Text style={styles.vendorName}>{vendor.businessName}</Text>
          <Rating rating={vendor.rating ?? 0} reviewCount={vendor.reviewCount ?? 0} />
          {listing?.yearsOfExperience && (
            <View style={styles.locationRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color='#8B5CF6' />
              <Text style={styles.locationText}>{listing.yearsOfExperience}+ years experience</Text>
            </View>
          )}
        </View>

        <View style={[styles.pointsBanner, { borderColor: 'rgba(139,92,246,0.3)', backgroundColor: 'rgba(139,92,246,0.08)' }]}>
          <View style={[styles.pointsIcon, { backgroundColor: 'rgba(139,92,246,0.15)' }]}>
            <Ionicons name="heart" size={20} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pointsTitle, { color: '#6D28D9' }]}>Earn points on this booking</Text>
            <Text style={[styles.pointsSub, { color: '#6D28D9' }]}>1 point per $1 spent • Redeemable on future services</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bodyText}>{vendor.description || 'Compassionate professional caregiving services.'}</Text>
        </View>

        {listing?.title && listing?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{listing.title}</Text>
            <Text style={styles.bodyText}>{listing.description}</Text>
          </View>
        )}

        {specialties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            {specialties.map((s: string, i: number) => (
              <View key={i} style={styles.includedRow}>
                <View style={[styles.checkCircle, { backgroundColor: 'rgba(139,92,246,0.12)' }]}>
                  <Ionicons name="checkmark" size={14} color="#8B5CF6" />
                </View>
                <Text style={styles.includedText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((c: string, i: number) => (
              <View key={i} style={styles.certRow}>
                <Ionicons name="ribbon-outline" size={18} color="#8B5CF6" />
                <Text style={styles.certText}>{c}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.priceCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.priceName}>Hourly Rate</Text>
              <Text style={styles.priceDuration}>Flexible scheduling available</Text>
            </View>
            <Text style={[styles.priceValue, { color: '#8B5CF6' }]}>${listing?.hourlyRate || 25}/hr</Text>
          </View>
          {supportTypes.map((t: string, i: number) => (
            <View key={i} style={[styles.priceCard, { borderColor: 'rgba(139,92,246,0.1)' }]}>
              <Text style={styles.priceName}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity onPress={() => router.push(`/services/caregiving/${id}/reviews` as any)}>
              <Text style={[styles.seeAll, { color: '#8B5CF6' }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {reviews.length > 0 ? reviews.slice(0, 2).map((review: any) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={[styles.reviewAvatar, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.reviewAvatarText}>
                    {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewerName}>Customer</Text>
                  <View style={styles.starsRow}>
                    {[1,2,3,4,5].map((s) => (
                      <Ionicons key={s} name="star" size={13} color={s <= review.rating ? '#FACC15' : '#E5E7EB'} />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          )) : (
            <View style={styles.noReviews}>
              <Text style={styles.bodyText}>No reviews yet. Be the first to book!</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.reportBtn} onPress={() => setShowReportModal(true)}>
          <Ionicons name="flag-outline" size={16} color={colors.text.muted} />
          <Text style={styles.reportText}>Report Listing</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.cta}>
        <View>
          <Text style={styles.ctaLabel}>Starting from</Text>
          <Text style={styles.ctaPrice}>${listing?.hourlyRate || 25}/hr</Text>
        </View>
        <Button title="Book Care" onPress={() => router.push(`/services/caregiving/${id}/book` as any)} style={styles.bookBtn} />
      </View>

      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={() => { setIsSubmitting(true); setTimeout(() => { setIsSubmitting(false); setShowReportModal(false); }, 800); }}
        loading={isSubmitting}
        listingName={vendor.businessName}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: fontSize.md, color: colors.text.secondary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 8, paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
    backgroundColor: colors.background, borderBottomWidth: borderWidth.thin, borderBottomColor: 'rgba(46,122,217,0.08)',
  },
  backBtn: { padding: spacing.xs },
  headerTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, textAlign: 'center', marginHorizontal: spacing.sm },
  scrollContent: { paddingBottom: 100 },
  infoSection: { padding: spacing.lg, gap: spacing.sm },
  vendorName: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text.primary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: fontSize.sm, color: colors.text.secondary },
  pointsBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.lg, marginBottom: spacing.md,
    padding: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1, gap: spacing.md,
  },
  pointsIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  pointsTitle: { fontSize: fontSize.sm, fontWeight: '600' },
  pointsSub: { fontSize: 12, opacity: 0.8 },
  section: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderTopWidth: borderWidth.thin, borderTopColor: 'rgba(46,122,217,0.08)' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm },
  bodyText: { fontSize: fontSize.md, color: colors.text.secondary, lineHeight: 24 },
  seeAll: { fontSize: fontSize.sm, textDecorationLine: 'underline' },
  includedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  checkCircle: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  includedText: { flex: 1, fontSize: fontSize.md, color: colors.text.secondary },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  certText: { fontSize: fontSize.md, color: colors.text.secondary, fontWeight: '500' },
  priceCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.md, marginBottom: spacing.sm, borderRadius: borderRadius.lg,
    backgroundColor: colors.surface, borderWidth: borderWidth.thin, borderColor: 'rgba(139,92,246,0.1)',
  },
  priceName: { fontSize: fontSize.md, fontWeight: '500', color: colors.text.primary },
  priceDuration: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  priceValue: { fontSize: fontSize.md, fontWeight: '700' },
  reviewCard: { padding: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.surface, borderWidth: borderWidth.thin, borderColor: 'rgba(46,122,217,0.08)', marginBottom: spacing.sm },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  reviewAvatarText: { fontSize: fontSize.md, fontWeight: '700', color: '#fff' },
  reviewerName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  reviewDate: { fontSize: 12, color: colors.text.muted },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
  noReviews: { padding: spacing.md, alignItems: 'center' },
  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg, marginTop: spacing.sm },
  reportText: { fontSize: fontSize.sm, color: colors.text.muted },
  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: 28,
    backgroundColor: colors.background, borderTopWidth: borderWidth.thin, borderTopColor: 'rgba(46,122,217,0.1)',
  },
  ctaLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  ctaPrice: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text.primary },
  bookBtn: { minWidth: 140 },
});
