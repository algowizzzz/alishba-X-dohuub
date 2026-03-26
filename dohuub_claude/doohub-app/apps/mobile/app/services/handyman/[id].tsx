import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { Button, Rating, ImageCarousel, PoweredByDoHuubBadge } from '../../../src/components/ui';
import { getVendorById, getHandymanListings, getReviewsByVendor } from '../../../src/lib/queries';
import { getServiceImages } from '../../../src/constants/serviceImages';

const ACCENT = '#EAB308';

const MOCK_VENDORS: Record<string, any> = {
  '1': { id: '1', businessName: 'DoHuub Official',     rating: 4.9, reviewCount: 1247, isMichelle: true,  description: 'Trusted, verified handyman services across all categories. Our certified professionals handle everything from plumbing to electrical work.' },
  '2': { id: '2', businessName: 'The Handyman Hub',    rating: 4.9, reviewCount: 401,  isMichelle: false, description: 'One-stop solution for all home repair needs with 15+ years of experience serving homeowners across the city.' },
  '3': { id: '3', businessName: 'Home Repair Masters', rating: 4.8, reviewCount: 256,  isMichelle: false, description: 'Specializes in general repairs, painting, and furniture assembly. Fast turnaround and quality guaranteed.' },
  '4': { id: '4', businessName: 'Quick Fix Services',  rating: 4.7, reviewCount: 189,  isMichelle: false, description: 'Fast and efficient solutions for appliance repairs and installations. Available 7 days a week.' },
};

const MOCK_LISTINGS = [
  { id: 'l1', title: 'Plumbing Repair',       basePrice: 85,  priceUnit: 'per_job', rating: 4.8, description: 'Fix leaks, unclog drains, and replace fixtures.',         images: [] },
  { id: 'l2', title: 'Electrical Work',        basePrice: 120, priceUnit: 'per_job', rating: 4.9, description: 'Outlet installation, wiring, panel upgrades.',            images: [] },
  { id: 'l3', title: 'Furniture Assembly',     basePrice: 60,  priceUnit: 'per_job', rating: 4.7, description: 'IKEA and flat-pack furniture assembled quickly.',          images: [] },
  { id: 'l4', title: 'TV & Appliance Install', basePrice: 75,  priceUnit: 'per_job', rating: 4.8, description: 'TV mounting, washing machine and dishwasher installation.', images: [] },
];

const PointsBanner = () => (
  <View style={styles.pointsBanner}>
    <View style={styles.pointsIcon}>
      <Ionicons name="gift" size={20} color={ACCENT} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.pointsTitle}>Earn points on this service</Text>
      <Text style={styles.pointsSub}>1 point per $1 spent • Points added after service completion</Text>
    </View>
  </View>
);

// ─── Vendor Page ─────────────────────────────────────────────────────────────
function VendorPage({ vendorId }: { vendorId: string }) {
  const [vendor, setVendor] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [v, l] = await Promise.all([getVendorById(vendorId), getHandymanListings(vendorId)]);
        setVendor(v || MOCK_VENDORS[vendorId] || null);
        setListings(l?.length > 0 ? l : MOCK_LISTINGS);
      } catch (e) {
        setVendor(MOCK_VENDORS[vendorId] || null);
        setListings(MOCK_LISTINGS);
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId]);

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <Header title="" />
      <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
    </SafeAreaView>
  );

  if (!vendor) return (
    <SafeAreaView style={styles.container}>
      <Header title="Handyman Services" />
      <View style={styles.centered}><Text style={styles.errorText}>Provider not found</Text></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title={vendor.businessName} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Vendor Header Card */}
        <View style={styles.vendorCard}>
          <View style={styles.vendorLogoCircle}>
            {vendor.logo
              ? <Image source={{ uri: vendor.logo }} style={styles.vendorLogo} />
              : <Ionicons name="construct-outline" size={28} color={ACCENT} />}
          </View>
          <View style={styles.vendorCardInfo}>
            <Text style={styles.vendorName}>{vendor.businessName}</Text>
            {vendor.isMichelle && <PoweredByDoHuubBadge />}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {(vendor.rating ?? 4.9).toFixed(1)} ({vendor.reviewCount ?? 0} reviews)
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewProfileBtn}
          onPress={() => router.push({ pathname: '/vendor/[id]', params: { id: vendorId, name: vendor?.businessName, category: 'handyman' } } as any)}
        >
          <Text style={styles.viewProfileText}>View Vendor Profile</Text>
        </TouchableOpacity>

        <PointsBanner />

        {/* Services Offered */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services Offered</Text>
          <View style={styles.servicesGrid}>
            {listings.map((listing: any, index: number) => (
              <TouchableOpacity
                key={listing.id}
                style={styles.serviceCard}
                onPress={() => router.push({
                  pathname: '/services/handyman/[id]',
                  params: { id: vendorId, listingId: listing.id },
                } as any)}
              >
                <Image
                  source={{ uri: listing.images?.[0] || getServiceImages('handyman')[index % 4] }}
                  style={styles.serviceCardImage}
                />
                <View style={styles.serviceCardInfo}>
                  <Text style={styles.serviceCardName} numberOfLines={2}>{listing.title}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.serviceCardRating}>
                      {(listing.rating ?? vendor.rating ?? 4.9).toFixed(1)}
                    </Text>
                  </View>
                  {listing.description ? (
                    <Text style={styles.serviceCardDesc} numberOfLines={2}>{listing.description}</Text>
                  ) : null}
                  <Text style={styles.serviceCardPrice}>
                    ${listing.hourlyRate || listing.basePrice}/{listing.priceUnit?.replace('per_', '') || 'hr'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Service Detail Page ──────────────────────────────────────────────────────
function ServiceDetailPage({ vendorId, listingId }: { vendorId: string; listingId: string }) {
  const [vendor, setVendor] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [v, listings] = await Promise.all([getVendorById(vendorId), getHandymanListings(vendorId)]);
        const resolvedVendor = v || MOCK_VENDORS[vendorId] || null;
        const resolvedListings = listings?.length > 0 ? listings : MOCK_LISTINGS;
        setVendor(resolvedVendor);
        setListing(resolvedListings.find((l: any) => l.id === listingId) || resolvedListings[0]);
        try { setReviews(await getReviewsByVendor(vendorId)); } catch { setReviews([]); }
      } catch (e) {
        setVendor(MOCK_VENDORS[vendorId] || null);
        setListing(MOCK_LISTINGS.find(l => l.id === listingId) || MOCK_LISTINGS[0]);
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId, listingId]);

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <Header title="" />
      <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
    </SafeAreaView>
  );

  if (!listing || !vendor) return (
    <SafeAreaView style={styles.container}>
      <Header title="Service Details" />
      <View style={styles.centered}><Text style={styles.errorText}>Service not found</Text></View>
    </SafeAreaView>
  );

  const images = getServiceImages('handyman', listing.images?.length > 0 ? listing.images : null);
  const included = listing.whatsIncluded || [];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Service Details" />

      <ImageCarousel images={images} height={240} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title + Rating */}
        <View style={styles.detailTitleSection}>
          <Text style={styles.detailTitle}>{listing.title}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>
              {(listing.rating ?? vendor.rating ?? 4.9).toFixed(1)} ({listing.reviewCount ?? vendor.reviewCount ?? 0} reviews)
            </Text>
          </View>
          {listing.description ? (
            <Text style={styles.detailDesc}>{listing.description}</Text>
          ) : null}
        </View>

        {/* Vendor Card */}
        <View style={styles.vendorCardSmall}>
          <View style={styles.vendorLogoSmall}>
            {vendor.logo
              ? <Image source={{ uri: vendor.logo }} style={styles.vendorLogoSmallImg} />
              : <Ionicons name="construct-outline" size={18} color={ACCENT} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vendorNameSmall}>{vendor.businessName}</Text>
            {vendor.isMichelle && <PoweredByDoHuubBadge />}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.vendorRatingSmall}>{(vendor.rating ?? 4.9).toFixed(1)} ({vendor.reviewCount ?? 0})</Text>
            </View>
          </View>
        </View>

        <PointsBanner />

        {/* Pricing */}
        <View style={styles.section}>
          <View style={styles.pricingRow}>
            <View style={styles.pricingLeft}>
              <Ionicons name="cash-outline" size={18} color={colors.primary} />
              <Text style={styles.pricingLabel}>Pricing</Text>
            </View>
            <Text style={styles.pricingValue}>
              ${listing.hourlyRate || listing.basePrice}/{listing.priceUnit?.replace('per_', '') || 'hr'}
            </Text>
          </View>
        </View>

        {/* What's Included */}
        {included.length > 0 && (
          <View style={styles.sectionFlat}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            {included.map((item: string, i: number) => (
              <View key={i} style={styles.includedCard}>
                <Ionicons name="checkmark" size={16} color="#22C55E" />
                <Text style={styles.includedText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reviews */}
        <View style={styles.sectionFlat}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => router.push(`/services/handyman/${vendorId}/reviews` as any)}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {reviews.length > 0 ? reviews.slice(0, 3).map((review: any) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewTopRow}>
                <Text style={styles.reviewerName}>{review.userName || 'Customer'}</Text>
                <Text style={styles.reviewDate}>
                  {review.createdAt
                    ? (() => {
                        const diff = Math.floor((Date.now() - new Date(review.createdAt).getTime()) / 86400000);
                        return diff === 0 ? 'Today' : diff === 1 ? '1 day ago' : diff < 7 ? `${diff} days ago` : diff < 14 ? '1 week ago' : `${Math.floor(diff/7)} weeks ago`;
                      })()
                    : ''}
                </Text>
              </View>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map((s) => (
                  <Ionicons key={s} name="star" size={14} color={s <= (review.rating ?? 5) ? '#FACC15' : '#E5E7EB'} />
                ))}
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          )) : (
            [
              { id: 'm1', name: 'Mike T.', date: '3 days ago', rating: 5, comment: 'Fixed everything quickly and professionally. Highly recommend!' },
              { id: 'm2', name: 'Lisa K.', date: '2 weeks ago', rating: 5, comment: 'Great work, very reliable and affordable.' },
            ].map((mock) => (
              <View key={mock.id} style={styles.reviewCard}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.reviewerName}>{mock.name}</Text>
                  <Text style={styles.reviewDate}>{mock.date}</Text>
                </View>
                <View style={styles.starsRow}>
                  {[1,2,3,4,5].map((s) => (
                    <Ionicons key={s} name="star" size={14} color={s <= mock.rating ? '#FACC15' : '#E5E7EB'} />
                  ))}
                </View>
                <Text style={styles.reviewComment}>{mock.comment}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.cta}>
        <Button
          title="Book Service"
          onPress={() => router.push(`/services/handyman/${vendorId}/book` as any)}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Shared Header ────────────────────────────────────────────────────────────
function Header({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      <View style={styles.backBtn} />
    </View>
  );
}

// ─── Entry Point ──────────────────────────────────────────────────────────────
export default function HandymanDetailScreen() {
  const { id, listingId } = useLocalSearchParams<{ id: string; listingId?: string }>();

  if (listingId) {
    return <ServiceDetailPage vendorId={id} listingId={listingId} />;
  }
  return <VendorPage vendorId={id} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: fontSize.md, color: colors.text.secondary },
  scrollContent: { paddingBottom: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46,122,217,0.08)',
  },
  backBtn: { padding: spacing.xs, width: 36 },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },

  // Vendor page
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    margin: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(234,179,8,0.15)',
  },
  vendorLogoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(234,179,8,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  vendorLogo: { width: 60, height: 60, borderRadius: 30 },
  vendorCardInfo: { flex: 1, gap: 4 },
  vendorName: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontSize: fontSize.sm, color: colors.text.secondary },

  viewProfileBtn: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  viewProfileText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.text.primary },

  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46,122,217,0.08)',
  },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.md },

  // Services grid
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(234,179,8,0.12)',
  },
  serviceCardImage: { width: '100%', height: 110, backgroundColor: 'rgba(234,179,8,0.08)' },
  serviceCardInfo: { padding: spacing.sm, gap: 3 },
  serviceCardName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  serviceCardRating: { fontSize: 12, color: colors.text.secondary },
  serviceCardDesc: { fontSize: 11, color: colors.text.muted, lineHeight: 16 },
  serviceCardPrice: { fontSize: fontSize.sm, fontWeight: '700', color: ACCENT, marginTop: 2 },

  // Points Banner
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
    gap: spacing.md,
  },
  pointsIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(245,158,11,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  pointsTitle: { fontSize: fontSize.sm, fontWeight: '600', color: 'rgb(180,83,9)' },
  pointsSub: { fontSize: 11, color: 'rgb(180,83,9)', opacity: 0.85, marginTop: 2 },

  // Service detail
  detailTitleSection: { padding: spacing.lg, gap: spacing.xs },
  detailTitle: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text.primary },
  detailDesc: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20, marginTop: 4 },

  vendorCardSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(234,179,8,0.12)',
  },
  vendorLogoSmall: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(234,179,8,0.1)',
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  vendorLogoSmallImg: { width: 44, height: 44, borderRadius: 22 },
  vendorNameSmall: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  vendorRatingSmall: { fontSize: 11, color: colors.text.secondary },

  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  pricingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pricingLabel: { fontSize: fontSize.md, color: colors.text.primary, fontWeight: '500' },
  pricingValue: { fontSize: fontSize.lg, fontWeight: '700', color: ACCENT },

  sectionFlat: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  includedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(34,197,94,0.15)',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  includedText: { flex: 1, fontSize: fontSize.sm, color: colors.text.secondary },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: '500' },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46,122,217,0.08)',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: 12, color: colors.text.muted },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: spacing.sm },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },

  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: spacing.lg,
    paddingBottom: 28,
    backgroundColor: colors.background,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46,122,217,0.1)',
  },
});
