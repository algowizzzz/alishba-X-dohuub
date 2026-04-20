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
import { getVendorById, getCleaningListings, getReviewsByVendor } from '../../../src/lib/queries';
import { getServiceImages } from '../../../src/constants/serviceImages';

// Boss cleaning logos for vendor display
const cleaningLogos = [
  require('../../../assets/cleaning/logos/logo1.png'),
  require('../../../assets/cleaning/logos/logo2.png'),
  require('../../../assets/cleaning/logos/logo3.png'),
];

const MOCK_VENDORS: Record<string, any> = {
  '1': { id: '1', businessName: 'Sparkle Clean Co.',    rating: 4.9, reviewCount: 312, isMichelle: true,  description: 'Top-rated cleaning service with certified professionals. We deliver spotless results every time.' },
  '2': { id: '2', businessName: 'ProClean Services',    rating: 4.8, reviewCount: 198, isMichelle: true,  description: 'Professional cleaning for homes and offices. Eco-friendly products and reliable staff.' },
  '3': { id: '3', businessName: 'Office Shine Co.',     rating: 4.9, reviewCount: 97,  isMichelle: false, description: 'Specializing in commercial and office cleaning with flexible scheduling.' },
  '4': { id: '4', businessName: 'Home Fresh Cleaners',  rating: 4.7, reviewCount: 154, isMichelle: false, description: 'Affordable deep cleaning and regular maintenance for residential properties.' },
};

const MOCK_LISTINGS = [
  { id: 'l1', title: 'Standard Cleaning',    basePrice: 80,  rating: 4.8, description: 'Regular home cleaning — dusting, vacuuming, mopping and surface wipe-downs.', images: [] },
  { id: 'l2', title: 'Deep Cleaning',         basePrice: 150, rating: 4.9, description: 'Full deep clean including appliances, baseboards, and inside cabinets.',         images: [] },
  { id: 'l3', title: 'Office & Commercial',   basePrice: 200, rating: 4.9, description: 'Complete office cleaning solution tailored for businesses of all sizes.',        images: [] },
  { id: 'l4', title: 'Move-In / Move-Out',    basePrice: 180, rating: 4.7, description: 'Thorough cleaning for empty properties before or after a move.',                 images: [] },
];

const PointsBanner = () => (
  <View style={styles.pointsBanner}>
    <View style={styles.pointsIcon}>
      <Ionicons name="gift" size={20} color="#F59E0B" />
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
        const [v, l] = await Promise.all([getVendorById(vendorId), getCleaningListings(vendorId)]);
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
      <Header title="Cleaning Services" />
      <View style={styles.centered}><Text style={styles.errorText}>Provider not found</Text></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title={vendor.businessName} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Vendor Summary — white card matching boss */}
        <View style={styles.vendorSummaryCard}>
          <View style={styles.vendorCardRow}>
            <View style={styles.vendorLogoCircle}>
              <Image
                source={vendor.logo ? { uri: vendor.logo } : cleaningLogos[parseInt(vendorId, 10) % cleaningLogos.length || 0]}
                style={styles.vendorLogo}
                resizeMode="cover"
              />
            </View>
            <View style={styles.vendorCardInfo}>
              <View style={styles.vendorNameRow}>
                <Text style={styles.vendorName}>{vendor.businessName}</Text>
                {vendor.isMichelle && (
                  <View style={styles.dohuubBadge}>
                    <Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text>
                  </View>
                )}
              </View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FACC15" />
                <Text style={styles.ratingValue}>{(vendor.rating ?? 4.9).toFixed(1)}</Text>
                <Text style={styles.reviewCountText}>({vendor.reviewCount ?? 0} reviews)</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewProfileBtn}
            onPress={() => router.push({ pathname: '/vendor/[id]', params: { id: vendorId, name: vendor?.businessName, category: 'cleaning' } } as any)}
          >
            <Text style={styles.viewProfileText}>View Vendor Profile</Text>
          </TouchableOpacity>
        </View>

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
                  pathname: '/services/cleaning/[id]',
                  params: { id: vendorId, listingId: listing.id },
                } as any)}
              >
                <Image
                  source={{ uri: listing.images?.[0] || getServiceImages('cleaning')[index % 4] }}
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
                  <Text style={styles.serviceCardPrice}>${listing.basePrice}</Text>
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
        const [v, listings] = await Promise.all([getVendorById(vendorId), getCleaningListings(vendorId)]);
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

  const images = getServiceImages('cleaning', listing.images?.length > 0 ? listing.images : null);
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
              : <Ionicons name="sparkles" size={18} color={colors.primary} />}
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
            <Text style={styles.pricingValue}>${listing.basePrice}</Text>
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
              onPress={() => router.push(`/services/cleaning/${vendorId}/reviews` as any)}
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
              {review.images?.length > 0 && (
                <View style={styles.reviewImagesRow}>
                  {review.images.slice(0, 3).map((img: string, idx: number) => (
                    <Image key={idx} source={{ uri: img }} style={styles.reviewImagePlaceholder} resizeMode="cover" />
                  ))}
                </View>
              )}
            </View>
          )) : (
            // Mock reviews when none available
            [
              { id: 'm1', name: 'John D.', date: '2 days ago', rating: 5, comment: 'Excellent service! Very thorough and professional. My home has never looked better.', hasImages: true, photos: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=200&h=200&fit=crop'] },
              { id: 'm2', name: 'Sarah M.', date: '1 week ago', rating: 5, comment: 'Highly recommend! The team was punctual and did an amazing job.', hasImages: true, photos: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop'] },
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
                {mock.photos && mock.photos.length > 0 && (
                  <View style={styles.reviewImagesRow}>
                    {mock.photos.map((photo, idx) => (
                      <Image key={idx} source={{ uri: photo }} style={styles.reviewImagePlaceholder} resizeMode="cover" />
                    ))}
                  </View>
                )}
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
          onPress={() => router.push(`/services/cleaning/${vendorId}/book` as any)}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Shared Header — matching boss glassmorphic style ─────────────────────────
function Header({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <TouchableOpacity onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)/services/cleaning');
          }
        }} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>
    </View>
  );
}

// ─── Entry Point ──────────────────────────────────────────────────────────────
export default function CleaningDetailScreen() {
  const { id, listingId } = useLocalSearchParams<{ id: string; listingId?: string }>();

  if (listingId) {
    return <ServiceDetailPage vendorId={id} listingId={listingId} />;
  }
  return <VendorPage vendorId={id} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7FF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: fontSize.md, color: colors.text.secondary },
  scrollContent: { paddingBottom: 24 },

  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 16,
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
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },

  // Vendor summary white card — matching boss
  vendorSummaryCard: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  vendorCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  vendorLogoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  vendorLogo: { width: 80, height: 80, borderRadius: 40 },
  vendorCardInfo: { flex: 1, gap: 6 },
  vendorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  vendorName: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  dohuubBadge: {
    backgroundColor: '#2E7AD9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  dohuubBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingValue: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  reviewCountText: { fontSize: 14, color: '#64748B' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontSize: fontSize.sm, color: colors.text.secondary },

  viewProfileBtn: {
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'rgba(46, 122, 217, 0.15)',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  viewProfileText: { fontSize: 15, fontWeight: '500', color: '#1E293B' },

  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 16 },

  // Services grid — matching boss 2-col with image cards
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceCardImage: { width: '100%', height: 96, backgroundColor: '#E3F0FF' },
  serviceCardInfo: { padding: 12, gap: 4 },
  serviceCardName: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  serviceCardRating: { fontSize: 12, color: '#1E293B' },
  serviceCardDesc: { fontSize: 12, color: '#64748B', lineHeight: 16 },
  serviceCardPrice: { fontSize: 14, fontWeight: '600', color: '#2E7AD9', marginTop: 4 },

  // Points Banner
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 12,
  },
  pointsIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  pointsTitle: { fontSize: 14, fontWeight: '600', color: 'rgb(180, 83, 9)' },
  pointsSub: { fontSize: 12, color: 'rgb(217, 119, 6)', marginTop: 2 },

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
    borderColor: 'rgba(46,122,217,0.08)',
  },
  vendorLogoSmall: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.secondary,
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
  pricingValue: { fontSize: fontSize.lg, fontWeight: '700', color: colors.primary },

  // Flat section (no top border, used for included + reviews)
  sectionFlat: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },

  // What's Included cards
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

  // Reviews
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
  reviewImagesRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  reviewImagePlaceholder: {
    width: 72, height: 72, borderRadius: borderRadius.md,
    overflow: 'hidden',
  },

  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24,
    paddingBottom: 28,
    backgroundColor: '#F0F7FF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
});
