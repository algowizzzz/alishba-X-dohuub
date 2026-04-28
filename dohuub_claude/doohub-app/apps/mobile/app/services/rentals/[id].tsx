import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GALLERY_IMAGES = [
  require('../../../assets/rental-1.png'),
  require('../../../assets/rental-2.png'),
  require('../../../assets/rental-3.png'),
  require('../../../assets/rental-4.png'),
];
import { colors, fontSize } from '../../../src/constants/theme';
import { getReviewsByVendor, getRentalById } from '../../../src/lib/queries';

const TEAL = '#14B8A6';

const AMENITY_ICONS: Record<string, string> = {
  WiFi: 'wifi-outline', Parking: 'car-outline', TV: 'tv-outline', AC: 'thermometer-outline',
  Pool: 'water-outline', Kitchen: 'restaurant-outline', Washer: 'shirt-outline', Heating: 'flame-outline',
};

function formatRelativeDate(iso: string): string {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 1) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return d.toLocaleDateString();
}

function reviewerName(r: any): string {
  const p = r?.User?.UserProfile;
  if (p?.firstName) return `${p.firstName} ${p.lastName?.[0] ?? ''}.`.trim();
  if (r?.User?.email) return r.User.email.split('@')[0];
  return 'Anonymous';
}

export default function PropertyDetailScreen() {
  const params = useLocalSearchParams<{
    id: string; name: string; location: string; pricePerNight: string; pricePerWeek: string; pricePerMonth: string;
    rating: string; reviews: string; bedrooms: string; bathrooms: string; maxGuests: string; sqft: string;
    propertyType: string; amenities: string; description: string; houseRules: string; isPoweredByDoHuub: string;
    imageIndex: string;
  }>();

  const [activeImg, setActiveImg] = useState(0);
  const isPowered = params.isPoweredByDoHuub === 'true';
  const amenities = params.amenities ? params.amenities.split(',') : [];
  const houseRules = params.houseRules ? params.houseRules.split('||') : [];

  const [reviews, setReviews] = useState<any[]>([]);
  useEffect(() => {
    if (!params.id) return;
    // Fetch reviews via the rental's vendorId
    (async () => {
      try {
        const rental = await getRentalById(params.id);
        const vendorId = (rental as any)?.vendorId ?? (rental as any)?.Vendor?.id;
        if (vendorId) {
          const revs = await getReviewsByVendor(vendorId);
          setReviews(revs);
        }
      } catch { setReviews([]); }
    })();
  }, [params.id]);

  const goToCalendar = () => {
    router.push({ pathname: '/services/rentals/[id]/calendar', params: { ...params } } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Swipeable Photo Gallery */}
        <View style={styles.galleryBox}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImg(idx);
            }}
          >
            {GALLERY_IMAGES.map((src, i) => (
              <Image key={i} source={src} style={styles.galleryImg} resizeMode="cover" />
            ))}
          </ScrollView>
          {isPowered && (
            <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text></View>
          )}
          <View style={styles.photoDots}>
            {GALLERY_IMAGES.map((_, i) => (
              <View key={i} style={[styles.photoDot, i === activeImg && styles.photoDotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <Text style={styles.propName}>{params.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FACC15" />
              <Text style={styles.ratingVal}>{params.rating}</Text>
              <Text style={styles.ratingCnt}>({params.reviews})</Text>
            </View>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={15} color={colors.text.secondary} />
            <Text style={styles.locationTxt}>{params.location}</Text>
          </View>

          {/* Points Banner */}
          {isPowered && (
            <View style={styles.pointsBanner}>
              <View style={styles.pointsIconWrap}>
                <Ionicons name="gift-outline" size={20} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.pointsBannerTitle}>Earn points on this booking</Text>
                <Text style={styles.pointsBannerSub}>1 point per $1 spent • Points added after checkout</Text>
              </View>
            </View>
          )}

          {/* Host Card */}
          <TouchableOpacity style={styles.hostCard} onPress={() => router.push({ pathname: '/services/rentals/host/[id]', params: { id: params.id, name: params.name, isPoweredByDoHuub: params.isPoweredByDoHuub } } as any)}>
            <Image
              source={{ uri: isPowered
                ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop'
                : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
              }}
              style={styles.hostAvatar}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.hostName}>{isPowered ? 'Hosted by DoHuub' : 'Hosted by Sarah Johnson'}</Text>
              <Text style={styles.hostSub}>{isPowered ? 'Professional property management' : 'Superhost · 5 years hosting'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.secondary} />
          </TouchableOpacity>

          {/* Key Details Grid */}
          <View style={styles.detailGrid}>
            {[
              { icon: 'bed-outline',       label: 'Bedrooms',   value: params.bedrooms },
              { icon: 'water-outline',     label: 'Bathrooms',  value: params.bathrooms },
              { icon: 'people-outline',    label: 'Max Guests', value: params.maxGuests },
              { icon: 'expand-outline',    label: 'Area',       value: `${params.sqft} ft²` },
            ].map(d => (
              <View key={d.label} style={styles.detailCard}>
                <Ionicons name={d.icon as any} size={22} color={TEAL} />
                <Text style={styles.detailVal}>{d.value}</Text>
                <Text style={styles.detailLabel}>{d.label}</Text>
              </View>
            ))}
          </View>

          {/* Pricing */}
          <View style={styles.pricingCard}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            {[
              { label: 'Per Night', value: `$${params.pricePerNight}`, teal: true },
              { label: 'Per Week',  value: `$${params.pricePerWeek}`,  teal: false },
              { label: 'Per Month', value: `$${params.pricePerMonth}`, teal: false },
            ].map(r => (
              <View key={r.label} style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>{r.label}</Text>
                <Text style={[styles.pricingValue, r.teal && { color: TEAL, fontWeight: '700' }]}>{r.value}</Text>
              </View>
            ))}
          </View>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenities.map(a => (
              <View key={a} style={styles.amenityCard}>
                <Ionicons name={(AMENITY_ICONS[a] || 'checkmark-circle-outline') as any} size={20} color={TEAL} />
                <Text style={styles.amenityTxt}>{a}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descTxt}>{params.description}</Text>

          {/* Location Map Placeholder */}
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={32} color={colors.text.secondary} />
          </View>
          <Text style={styles.mapLocation}>{params.location}</Text>

          {/* House Rules */}
          <Text style={styles.sectionTitle}>House Rules</Text>
          {houseRules.map((rule, i) => (
            <View key={i} style={styles.ruleRow}>
              <View style={styles.ruleDot} />
              <Text style={styles.ruleTxt}>{rule}</Text>
            </View>
          ))}

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/services/rentals/[id]/reviews', params: { id: params.id, name: params.name } } as any)}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          {reviews.length === 0 ? (
            <Text style={{ color: colors.text.secondary, fontSize: fontSize.sm, paddingVertical: 12 }}>No reviews yet.</Text>
          ) : reviews.slice(0, 3).map((r: any) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <Text style={styles.reviewName}>{reviewerName(r)}</Text>
                <Text style={styles.reviewDate}>{formatRelativeDate(r.createdAt)}</Text>
              </View>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={14} color={s <= r.rating ? '#FACC15' : '#E5E7EB'} />)}
              </View>
              <Text style={styles.reviewComment}>{r.comment}</Text>
              {r.photos && r.photos.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                  {r.photos.map((photo: string, i: number) => (
                    <Image key={i} source={{ uri: photo }} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden' }} resizeMode="cover" />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.stickyBar}>
        <TouchableOpacity style={styles.ctaBtn} onPress={goToCalendar}>
          <Text style={styles.ctaBtnText}>Check Availability</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  headerTitle: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  galleryBox: { height: 260, backgroundColor: TEAL },
  galleryImg: { width: SCREEN_WIDTH, height: 260 },
  dohuubBadge: { position: 'absolute', top: 14, right: 14, backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
  dohuubBadgeText: { fontSize: 11, color: '#FFF', fontWeight: '600' },
  photoDots: { position: 'absolute', bottom: 14, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  photoDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  photoDotActive: { backgroundColor: '#FFF', width: 10, height: 10, borderRadius: 5 },
  content: { padding: 20, gap: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  propName: { fontSize: 20, fontWeight: '700', color: colors.text.primary, flex: 1, marginRight: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingVal: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  ratingCnt: { fontSize: fontSize.sm, color: colors.text.secondary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: -8 },
  locationTxt: { fontSize: fontSize.sm, color: colors.text.secondary },
  pointsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
  },
  pointsIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(245,158,11,0.2)', alignItems: 'center', justifyContent: 'center' },
  pointsBannerTitle: { fontSize: fontSize.sm, fontWeight: '600', color: '#B45309' },
  pointsBannerSub: { fontSize: fontSize.xs, color: '#D97706' },
  hostCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  hostAvatar: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden' },
  hostName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, textDecorationLine: 'underline' },
  hostSub: { fontSize: fontSize.xs, color: colors.text.secondary },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  detailCard: { width: '47%', padding: 14, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  detailVal: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  detailLabel: { fontSize: fontSize.xs, color: colors.text.secondary },
  pricingCard: {
    padding: 16, borderRadius: 12,
    backgroundColor: 'rgba(20,184,166,0.08)', borderWidth: 1, borderColor: 'rgba(20,184,166,0.25)',
  },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  pricingLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  pricingValue: { fontSize: fontSize.sm, fontWeight: '500', color: colors.text.primary },
  sectionTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary, marginBottom: 6 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  amenityCard: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', width: '47%' },
  amenityTxt: { fontSize: fontSize.sm, fontWeight: '500', color: colors.text.primary },
  descTxt: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
  mapPlaceholder: { height: 140, backgroundColor: '#E5E7EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mapLocation: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 6 },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  ruleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: TEAL, marginTop: 6, flexShrink: 0 },
  ruleTxt: { fontSize: fontSize.sm, color: colors.text.secondary, flex: 1 },
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  viewAllLink: { fontSize: fontSize.sm, color: TEAL, fontWeight: '500' },
  reviewCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 6 },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 18 },
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1, borderTopColor: 'rgba(20,184,166,0.15)',
  },
  ctaBtn: { backgroundColor: TEAL, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  ctaBtnText: { color: '#FFF', fontSize: fontSize.sm, fontWeight: '700' },
});
