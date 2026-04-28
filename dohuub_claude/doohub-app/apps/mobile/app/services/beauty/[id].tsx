import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';
import { getBeautyListings, getReviewsByVendor } from '../../../src/lib/queries';

const ACCENT = '#EC4899';
const SERVICE_CATEGORIES = ['All', 'Makeup', 'Hair', 'Skincare', 'Nails', 'Spa'];

const BEAUTY_TYPE_TO_CATEGORY: Record<string, string> = {
  MAKEUP: 'Makeup',
  HAIR: 'Hair',
  NAILS: 'Nails',
  WELLNESS: 'Skincare',
};

type BeautyService = {
  id: string;
  name: string;
  category: string;
  price: string;
  priceValue: number;
  duration: string;
  rating: number;
  reviews: number;
  image: string;
};

function formatRelativeDate(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
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

export default function BeautyServicesScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; isPoweredByDoHuub: string; rating: string; reviews: string }>();
  const providerName = params.name || 'Beauty Services';
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';
  const vendorId = params.id;

  const [page, setPage] = useState<'services' | 'detail'>('services');
  const [selectedService, setSelectedService] = useState<BeautyService | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [services, setServices] = useState<BeautyService[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!vendorId) return;
      try {
        const [listings, revs] = await Promise.all([
          getBeautyListings(vendorId),
          getReviewsByVendor(vendorId),
        ]);
        if (cancelled) return;
        const vendorRating = parseFloat(params.rating || '4.8');
        const vendorReviewCount = parseInt(params.reviews || '0', 10);
        setServices(listings.map((l: any) => ({
          id: l.id,
          name: l.title,
          category: BEAUTY_TYPE_TO_CATEGORY[l.beautyType] || 'Other',
          price: `$${Number(l.basePrice).toFixed(2)}`,
          priceValue: Number(l.basePrice),
          duration: `${l.duration} min`,
          rating: vendorRating,
          reviews: vendorReviewCount,
          image: l.images?.[0] || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=400&fit=crop',
        })));
        setReviews(revs);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [vendorId, params.rating, params.reviews]);

  const filteredServices = selectedCategory === 'All' ? services : services.filter(s => s.category === selectedCategory);

  const PointsBanner = () => (
    <View style={styles.pointsBanner}>
      <View style={styles.pointsIconWrap}><Ionicons name="gift" size={20} color="#F59E0B" /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.pointsTitle}>Earn points on this service</Text>
        <Text style={styles.pointsSub}>1 point per $1 spent • Points added after service completion</Text>
      </View>
    </View>
  );

  // ── SERVICE DETAIL ────────────────────────────────────────────────────────
  if (page === 'detail' && selectedService) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setPage('services')}>
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Details</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Hero Image */}
          <Image source={{ uri: selectedService.image }} style={styles.heroBanner} resizeMode="cover" />

          <View style={styles.detailBody}>
            {/* Title + Rating */}
            <Text style={styles.serviceName}>{selectedService.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color="#FACC15" />
              <Text style={styles.ratingNum}>{selectedService.rating}</Text>
              <Text style={styles.ratingReviews}>({selectedService.reviews} reviews)</Text>
            </View>
            <Text style={styles.serviceDesc}>
              Experience our premium {selectedService.name.toLowerCase()} service performed by highly trained beauty professionals. We use only the best quality products to ensure stunning results.
            </Text>

            {/* Provider Card */}
            <View style={styles.providerCard}>
              <View style={styles.providerAvatar}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.providerNameRow}>
                  <Text style={styles.providerName}>{providerName}</Text>
                  {isPoweredByDoHuub && <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text></View>}
                </View>
                <Text style={styles.providerRating}>⭐ {params.rating} ({params.reviews} reviews)</Text>
              </View>
            </View>

            {/* Points Banner */}
            {isPoweredByDoHuub && <PointsBanner />}

            {/* Price + Duration */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>Pricing</Text>
                <Text style={[styles.infoVal, { color: colors.primary, fontWeight: '600' }]}>{selectedService.price}</Text>
              </View>
              <View style={[styles.infoRow, { marginTop: 12 }]}>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoVal}>{selectedService.duration}</Text>
              </View>
            </View>

            {/* What's Included */}
            <Text style={styles.sectionTitle}>What's Included</Text>
            {['Professional consultation and assessment', 'Premium quality beauty products and tools', 'Expert application by certified professionals', 'Aftercare advice and maintenance tips'].map((item, i) => (
              <View key={i} style={styles.includedRow}>
                <Text style={{ color: colors.primary, fontSize: 16 }}>✓</Text>
                <Text style={styles.includedText}>{item}</Text>
              </View>
            ))}

            {/* Reviews */}
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/services/beauty/[id]/reviews', params: { id: params.id, name: providerName } } as any)}>
                <Text style={styles.viewAllLink}>View All</Text>
              </TouchableOpacity>
            </View>
            {reviews.length === 0 ? (
              <Text style={{ color: colors.text.secondary, fontSize: fontSize.sm, paddingVertical: 12 }}>No reviews yet.</Text>
            ) : reviews.slice(0, 3).map((review: any) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <Text style={styles.reviewName}>{reviewerName(review)}</Text>
                  <Text style={styles.reviewDate}>{formatRelativeDate(review.createdAt)}</Text>
                </View>
                <View style={styles.starsRow}>
                  {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={14} color={s <= review.rating ? '#FACC15' : '#E5E7EB'} />)}
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                {review.photos && review.photos.length > 0 && (
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                    {review.photos.map((photo: string, i: number) => (
                      <Image key={i} source={{ uri: photo }} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden' }} resizeMode="cover" />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => router.push({ pathname: '/services/beauty/[id]/book', params: { id: params.id, serviceName: selectedService.name, servicePrice: selectedService.price, duration: selectedService.duration, providerName, isPoweredByDoHuub: String(isPoweredByDoHuub) } } as any)}
          >
            <Text style={styles.bookBtnText}>Book Service</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── SERVICES LIST ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{providerName}</Text>
          <Text style={styles.headerSubtitle}>Browse services</Text>
        </View>
        {isPoweredByDoHuub && <View style={styles.dohuubBadge}><Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text></View>}
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
        {SERVICE_CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} style={[styles.tab, selectedCategory === cat && styles.tabActive]} onPress={() => setSelectedCategory(cat)}>
            <Text style={[styles.tabText, selectedCategory === cat && styles.tabTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredServices}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={isPoweredByDoHuub ? <PointsBanner /> : null}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.serviceCard} onPress={() => { setSelectedService(item); setPage('detail'); }}>
            <View style={styles.serviceCardRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceName2}>{item.name}</Text>
                <Text style={styles.serviceDuration}>{item.duration}</Text>
              </View>
              <Text style={styles.servicePrice}>{item.price}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FACC15" />
              <Text style={styles.ratingNum}>{item.rating}</Text>
              <Text style={styles.ratingReviews}>({item.reviews} reviews)</Text>
            </View>
          </TouchableOpacity>
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
  dohuubBadge: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
  dohuubBadgeText: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  tabs: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: 'rgba(46,122,217,0.1)', height: 56, flexShrink: 0 },
  tabsContent: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', height: 56 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', marginRight: 8 },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, color: colors.text.primary, fontWeight: '500' },
  tabTextActive: { color: '#FFF' },
  list: { padding: 20, gap: 10 },
  pointsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 12, padding: 14, marginBottom: 6,
  },
  pointsIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(245,158,11,0.2)', alignItems: 'center', justifyContent: 'center' },
  pointsTitle: { fontSize: 13, fontWeight: '600', color: 'rgb(180,83,9)' },
  pointsSub: { fontSize: 11, color: 'rgb(217,119,6)', marginTop: 2 },
  serviceCard: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  serviceCardRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  serviceName2: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 2 },
  serviceDuration: { fontSize: fontSize.sm, color: colors.text.secondary },
  servicePrice: { fontSize: fontSize.sm, fontWeight: '600', color: colors.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingNum: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  ratingReviews: { fontSize: fontSize.sm, color: colors.text.secondary },
  // Detail page
  heroBanner: {
    width: '100%',
    height: 220,
  },
  detailBody: { padding: 24 },
  serviceName: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  serviceDesc: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 21, marginTop: 8, marginBottom: 20 },
  providerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  providerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center',
  },
  providerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 },
  providerName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  providerRating: { fontSize: fontSize.xs, color: colors.text.secondary },
  infoCard: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel: { flex: 1, fontSize: fontSize.sm, color: colors.text.primary },
  infoVal: { fontSize: fontSize.sm, color: colors.text.secondary },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, marginBottom: 12 },
  includedRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  includedText: { flex: 1, fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  viewAllLink: { fontSize: fontSize.sm, color: colors.primary, fontWeight: '600' },
  reviewCard: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(46,122,217,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 6 },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 19 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16,
    backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 6,
  },
  bookBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  bookBtnText: { color: '#FFF', fontSize: fontSize.md, fontWeight: '600' },
});
