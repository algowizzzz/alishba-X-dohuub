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
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';

const MOCK_REVIEWS = [
  { name: 'Emma L.',  date: '1 day ago',  rating: 5, comment: 'Amazing food! The burger was cooked perfectly and arrived hot. Will definitely order again.', ordered: 'Signature Burger, Fries', photos: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop'] },
  { name: 'James K.', date: '3 days ago', rating: 5, comment: 'Great service and delicious food. Delivery was quick and the driver was friendly.', ordered: 'Main Course', photos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop'] },
  { name: 'Maria S.', date: '1 week ago', rating: 4, comment: 'Good food but took longer than estimated. Still tasty though.', ordered: 'Starter, Dessert' },
];

export default function FoodVendorProfileScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; cuisine: string; isPoweredByDoHuub: string; rating: string; deliveryTime: string; menuId: string }>();
  const vendorName = params.name || 'Restaurant';
  const cuisine = params.cuisine || 'Multi-Cuisine';
  const isPoweredByDoHuub = params.isPoweredByDoHuub === 'true';
  const rating = parseFloat(params.rating || '4.7');
  const deliveryTime = params.deliveryTime || '25-35 min';
  const menuId = params.menuId || '0';

  const cuisineTypes = cuisine.split(', ');

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
          <Text style={styles.deliveryInfo}>{deliveryTime} • $2.99 delivery</Text>
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
          <View style={styles.infoCard}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>123 Main Street</Text>
              <Text style={styles.infoSub}>Miami, FL 33101</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>Delivery Hours</Text>
              <Text style={styles.infoSub}>11:00 AM - 10:00 PM Daily</Text>
            </View>
          </View>

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
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={14} color="#FACC15" />)}
              </View>
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
              {(review as any).photos && (review as any).photos.length > 0 && (
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, marginBottom: 4 }}>
                  {(review as any).photos.map((photo: string, i: number) => (
                    <Image key={i} source={{ uri: photo }} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden' }} resizeMode="cover" />
                  ))}
                </View>
              )}
              <Text style={styles.reviewOrdered}>Ordered: {review.ordered}</Text>
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
