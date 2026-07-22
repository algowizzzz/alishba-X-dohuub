import React, { useEffect, useState } from 'react';
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
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';
import { StarRow } from '../../../src/components/ui';
import { getReviewsByVendor, getReviewAuthorName, getVendorById } from '../../../src/lib/queries';

function formatRelativeDate(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return d.toLocaleDateString();
}

function reviewerName(r: any): string {
  return getReviewAuthorName(r);
}

export default function FoodVendorProfileScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; cuisine: string; isPoweredByDoHuub: string; rating: string; deliveryTime: string; menuId: string }>();
  const vendorName = params.name || 'Restaurant';
  const cuisine = params.cuisine || 'Multi-Cuisine';
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';
  const rating = parseFloat(params.rating || '4.7');
  const deliveryTime = params.deliveryTime || '25-35 min';
  const menuId = params.menuId || '0';
  const vendorId = params.id || '';

  const cuisineTypes = cuisine.split(', ');

  const [reviews, setReviews] = useState<any[]>([]);
  const [vendor, setVendor] = useState<any>(null);
  useEffect(() => {
    if (!vendorId) return;
    getReviewsByVendor(vendorId).then(setReviews).catch(() => setReviews([]));
    getVendorById(vendorId).then(setVendor).catch(() => setVendor(null));
  }, [vendorId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Restaurant Header */}
        <View style={styles.restaurantHeader}>
          <View style={styles.restaurantIcon}>
            <Ionicons name="restaurant" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.restaurantName}>{vendorName}</Text>
          {isPoweredByDoHuub && (
            <View style={styles.dohuubBadge}>
              <Text style={styles.dohuubBadgeText}>Powered by DoHuub</Text>
            </View>
          )}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#FACC15" />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.reviewCountText}>(250 reviews)</Text>
          </View>
          <Text style={styles.deliveryInfo}>
            {vendor?.estimatedDeliveryTime ?? deliveryTime}
            {vendor?.deliveryFee != null ? ` • $${vendor.deliveryFee.toFixed(2)} delivery` : ''}
          </Text>
        </View>

        <View style={styles.body}>
          {/* About */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.cardBody}>
              Welcome to {vendorName}! We serve delicious, high-quality {cuisineTypes[0]} cuisine made with fresh, locally-sourced ingredients. Our chefs bring years of culinary expertise to create memorable dining experiences.
            </Text>
          </View>

          {/* Restaurant Info */}
          <Text style={styles.sectionTitle}>Restaurant Information</Text>
          {vendor?.address && (
            <View style={styles.infoCard}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.infoLabel}>{vendor.address}</Text>
                <Text style={styles.infoSub}>{[vendor.city, vendor.state, vendor.zipCode].filter(Boolean).join(', ')}</Text>
              </View>
            </View>
          )}
          {vendor?.hoursOfOperation && (
            <View style={styles.infoCard}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.infoLabel}>Delivery Hours</Text>
                <Text style={styles.infoSub}>{vendor.hoursOfOperation}</Text>
              </View>
            </View>
          )}
          {vendor?.contactPhone && (
            <View style={styles.infoCard}>
              <Ionicons name="call" size={20} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.infoLabel}>Contact</Text>
                <Text style={styles.infoSub}>{vendor.contactPhone}</Text>
              </View>
            </View>
          )}

          {/* Reviews & Ratings */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/services/food/reviews', params: { id: params.id, name: vendorName, rating: String(rating), reviewCount: '250' } } as any)}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Rating Summary */}
          <View style={styles.ratingCard}>
            <View style={styles.ratingLeft}>
              <Text style={styles.ratingBig}>{rating}</Text>
              <StarRow rating={Number(rating) || 0} size={16} style={{ marginVertical: 4 }} />
              <Text style={styles.reviewCount}>250 reviews</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              {[5,4,3,2,1].map(star => (
                <View key={star} style={styles.barRow}>
                  <Text style={styles.barLabel}>{star}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${star === 5 ? 80 : star === 4 ? 15 : 5}%` as any }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Reviews */}
          {reviews.length === 0 ? (
            <Text style={{ color: colors.text.secondary, fontSize: fontSize.sm, paddingVertical: 12 }}>No reviews yet.</Text>
          ) : reviews.slice(0, 5).map((review: any) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Ionicons name="person" size={18} color={colors.text.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.reviewNameRow}>
                    <Text style={styles.reviewName}>{reviewerName(review)}</Text>
                    <Text style={styles.reviewDate}>{formatRelativeDate(review.createdAt)}</Text>
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
                  {review.photos.map((photo: string, i: number) => (
                    <Image key={i} source={{ uri: photo }} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden' }} resizeMode="cover" />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* View Menu Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.viewMenuBtn}
          onPress={() => router.push({ pathname: '/services/food/[id]', params: { id: params.id, name: vendorName, cuisine, isPoweredByDoHuub: String(isPoweredByDoHuub), menuId } } as any)}
        >
          <Text style={styles.viewMenuText}>View Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46,122,217,0.08)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
    position: 'sticky' as any,
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  restaurantHeader: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24 },
  restaurantIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  restaurantName: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  dohuubBadge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, marginBottom: 8 },
  dohuubBadgeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  ratingText: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  reviewCountText: { fontSize: fontSize.sm, color: colors.text.secondary },
  deliveryInfo: { fontSize: fontSize.sm, color: colors.text.secondary },
  body: { paddingHorizontal: 20, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 8 },
  cardBody: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 20 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, marginTop: 4 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  infoLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  infoSub: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 2 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  viewAllLink: { fontSize: fontSize.sm, color: colors.primary, fontWeight: '600' },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ratingLeft: { alignItems: 'center' },
  ratingBig: { fontSize: 36, fontWeight: '700', color: colors.text.primary },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
  reviewCount: { fontSize: fontSize.xs, color: colors.text.secondary },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { fontSize: 12, color: colors.text.secondary, width: 10 },
  barBg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: colors.primary },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewNameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 19, marginBottom: 6 },
  reviewOrdered: { fontSize: 11, color: colors.text.muted },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(46,122,217,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 6,
  },
  viewMenuBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  viewMenuText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: '600' },
});
