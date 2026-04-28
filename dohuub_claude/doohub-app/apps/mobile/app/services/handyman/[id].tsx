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
        setVendor(v);
        setListings(l ?? []);
      } catch (e) {
        setVendor(null);
        setListings([]);
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
        {/* Vendor Header Card — with View Profile inside */}
        <View style={styles.vendorCard}>
          <View style={styles.vendorCardRow}>
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
        setVendor(v);
        setListing((listings ?? []).find((l: any) => l.id === listingId) || (listings ?? [])[0] || null);
        try { setReviews(await getReviewsByVendor(vendorId)); } catch { setReviews([]); }
      } catch (e) {
        setVendor(null);
        setListing(null);
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

        {/* Pricing & Duration */}
        <View style={styles.section}>
          <View style={styles.pricingRow}>
            <View style={styles.pricingLeft}>
              <Ionicons name="cash-outline" size={18} color="#2E7AD9" />
              <Text style={styles.pricingLabel}>Pricing</Text>
            </View>
            <Text style={styles.pricingValue}>
              ${listing.hourlyRate || listing.basePrice}/{listing.priceUnit?.replace('per_', '') || 'job'}
            </Text>
          </View>
          {(listing.duration) && (
            <View style={[styles.pricingRow, { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(46, 122, 217, 0.08)' }]}>
              <View style={styles.pricingLeft}>
                <Ionicons name="time-outline" size={18} color="#2E7AD9" />
                <Text style={styles.pricingLabel}>Duration</Text>
              </View>
              <Text style={styles.pricingValue}>{listing.duration}</Text>
            </View>
          )}
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
              { id: 'm1', name: 'Mike T.', date: '1 day ago', rating: 5, comment: 'Fixed everything quickly and professionally. The electrician was knowledgeable and completed the job ahead of schedule.' },
              { id: 'm2', name: 'Lisa K.', date: '1 week ago', rating: 5, comment: 'Great work, very reliable and affordable. Cleaned up everything after the job was done.' },
              { id: 'm3', name: 'Carlos R.', date: '2 weeks ago', rating: 4, comment: 'Good service overall. Arrived on time and did quality work.' },
            ].map((mock) => (
              <View key={mock.id} style={styles.reviewCard}>
                <View style={styles.reviewCardInner}>
                  <View style={styles.reviewAvatar}>
                    <Ionicons name="person" size={16} color="#64748B" />
                  </View>
                  <View style={{ flex: 1 }}>
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
                </View>
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

// ─── Shared Header — matching boss glassmorphic style ─────────────────────────
function Header({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <TouchableOpacity onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)/services/handyman');
        }} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>
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
  container: { flex: 1, backgroundColor: '#F0F7FF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#64748B' },
  scrollContent: { paddingBottom: 24 },

  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 16, paddingBottom: 24, paddingHorizontal: 24,
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
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: '#1E293B' },

  // Vendor summary white card
  vendorCard: {
    marginHorizontal: 24, marginTop: 24, marginBottom: 16,
    padding: 20, backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  vendorCardRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    marginBottom: 16,
  },
  vendorLogoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#E3F0FF', justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  vendorLogo: { width: 80, height: 80, borderRadius: 40 },
  vendorCardInfo: { flex: 1, gap: 6 },
  vendorName: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontSize: 14, color: '#64748B' },

  viewProfileBtn: {
    paddingVertical: 12,
    borderWidth: 2, borderColor: 'rgba(46, 122, 217, 0.15)',
    borderRadius: 12, alignItems: 'center', backgroundColor: '#FFFFFF',
  },
  viewProfileText: { fontSize: 15, fontWeight: '500', color: '#1E293B' },

  section: { paddingHorizontal: 24, paddingVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 16 },

  // Services grid
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  serviceCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 12,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.15)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  serviceCardImage: { width: '100%', height: 96, backgroundColor: '#E3F0FF' },
  serviceCardInfo: { padding: 12, gap: 4 },
  serviceCardName: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  serviceCardRating: { fontSize: 12, color: '#1E293B' },
  serviceCardDesc: { fontSize: 12, color: '#64748B', lineHeight: 16 },
  serviceCardPrice: { fontSize: 14, fontWeight: '600', color: '#2E7AD9', marginTop: 4 },

  // Points Banner
  pointsBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, marginBottom: 24, padding: 16,
    borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', gap: 12,
  },
  pointsIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  pointsTitle: { fontSize: 14, fontWeight: '600', color: 'rgb(180, 83, 9)' },
  pointsSub: { fontSize: 12, color: 'rgb(217, 119, 6)', marginTop: 2 },

  // Service detail
  detailTitleSection: { padding: 24, gap: 4 },
  detailTitle: { fontSize: 24, fontWeight: '700', color: '#1E293B' },
  detailDesc: { fontSize: 14, color: '#64748B', lineHeight: 20, marginTop: 4 },

  vendorCardSmall: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    marginHorizontal: 24, marginBottom: 16, padding: 16,
    backgroundColor: '#FFFFFF', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.1)',
  },
  vendorLogoSmall: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#E3F0FF', justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  vendorLogoSmallImg: { width: 44, height: 44, borderRadius: 22 },
  vendorNameSmall: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  vendorRatingSmall: { fontSize: 11, color: '#64748B' },

  pricingRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 4,
  },
  pricingLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pricingLabel: { fontSize: 16, color: '#1E293B', fontWeight: '500' },
  pricingValue: { fontSize: 18, fontWeight: '700', color: '#2E7AD9' },

  sectionFlat: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 4 },
  includedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(34, 197, 94, 0.15)',
    padding: 16, marginBottom: 8,
  },
  includedText: { flex: 1, fontSize: 14, color: '#64748B' },
  reviewsHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { fontSize: 14, color: '#2E7AD9', fontWeight: '500' },
  reviewCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(46, 122, 217, 0.1)',
    padding: 16, marginBottom: 8,
  },
  reviewCardInner: {
    flexDirection: 'row', gap: 12,
  },
  reviewAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E8F1FC', alignItems: 'center',
    justifyContent: 'center', marginTop: 2,
  },
  reviewTopRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  reviewerName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  reviewDate: { fontSize: 12, color: '#94A3B8' },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  reviewComment: { fontSize: 14, color: '#64748B', lineHeight: 20 },

  cta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, paddingBottom: 28,
    backgroundColor: '#F0F7FF',
    borderTopWidth: 1, borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
});
