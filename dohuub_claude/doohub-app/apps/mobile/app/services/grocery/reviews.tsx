import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../src/constants/theme';

const GREEN = '#10B981';
const AVATAR_URL = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop';

const REVIEWS_BY_VENDOR: Record<string, any[]> = {
  default: [
    { id: 1, name: 'Patricia M.', date: 'Nov 28, 2025', rating: 5, comment: 'Great selection and always fresh produce! My go-to grocery store.', photos: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop'] },
    { id: 2, name: 'Robert L.',   date: 'Nov 25, 2025', rating: 4, comment: 'Good prices and quality. Delivery is fast but sometimes items are out of stock.' },
    { id: 3, name: 'Linda K.',    date: 'Nov 22, 2025', rating: 5, comment: 'Always reliable! Fresh fruits and vegetables every time.', photos: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop'] },
    { id: 4, name: 'Mark T.',     date: 'Nov 20, 2025', rating: 4, comment: 'Good variety of products. Would like to see more organic options.' },
    { id: 5, name: 'Susan R.',    date: 'Nov 18, 2025', rating: 5, comment: 'Best grocery delivery service! Items are always well-packed.', photos: ['https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop'] },
  ],
};

const RATING_DIST = [75, 18, 5, 1, 1]; // % for 5,4,3,2,1

export default function GroceryVendorReviewsScreen() {
  const params = useLocalSearchParams<{ id: string; name: string; rating: string; reviewCount: string }>();
  const vendorName = params.name || 'Grocery Store';
  const rating = parseFloat(params.rating || '4.7');
  const reviewCount = parseInt(params.reviewCount || '100', 10);
  const reviews = REVIEWS_BY_VENDOR[params.id] || REVIEWS_BY_VENDOR.default;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Reviews</Text>
          <Text style={styles.headerSub}>{vendorName}</Text>
        </View>
      </View>

      {/* Rating Summary */}
      <View style={styles.ratingSummary}>
        <View style={styles.ratingLeft}>
          <Text style={styles.ratingBig}>{rating}</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(s => (
              <Ionicons key={s} name="star" size={16} color={s <= Math.floor(rating) ? '#FACC15' : '#E5E7EB'} />
            ))}
          </View>
          <Text style={styles.reviewCnt}>{reviewCount} reviews</Text>
        </View>
        <View style={styles.ratingBars}>
          {[5,4,3,2,1].map((star, i) => (
            <View key={star} style={styles.barRow}>
              <Text style={styles.barLabel}>{star}</Text>
              <Ionicons name="star" size={12} color="#FACC15" />
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${RATING_DIST[i]}%` as any }]} />
              </View>
              <Text style={styles.barCount}>{Math.round(reviewCount * RATING_DIST[i] / 100)}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatarRow}>
                <Image source={{ uri: AVATAR_URL }} style={styles.avatar} resizeMode="cover" />
                <View>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => (
                  <Ionicons key={s} name="star" size={13} color={s <= review.rating ? '#FACC15' : '#E5E7EB'} />
                ))}
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            {review.photos && review.photos.length > 0 && (
              <View style={styles.photosRow}>
                {review.photos.map((photo: string, i: number) => (
                  <Image key={i} source={{ uri: photo }} style={styles.reviewPhoto} resizeMode="cover" />
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(16,185,129,0.1)',
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 15, elevation: 3,
  },
  backBtn: { padding: 8, borderRadius: 12, backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  headerSub: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 1 },
  ratingSummary: {
    flexDirection: 'row', alignItems: 'center', gap: 20,
    paddingHorizontal: 20, paddingVertical: 20,
    backgroundColor: 'rgba(16,185,129,0.04)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(16,185,129,0.1)',
  },
  ratingLeft: { alignItems: 'center', minWidth: 72 },
  ratingBig: { fontSize: 48, fontWeight: '700', color: colors.text.primary, lineHeight: 56 },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
  reviewCnt: { fontSize: fontSize.xs, color: colors.text.secondary },
  ratingBars: { flex: 1, gap: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { fontSize: 12, color: colors.text.secondary, width: 12, textAlign: 'right' },
  barBg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: GREEN },
  barCount: { fontSize: 11, color: colors.text.secondary, width: 28, textAlign: 'right' },
  list: { padding: 20, gap: 12, paddingBottom: 40 },
  reviewCard: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    gap: 8,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 1 },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 19 },
  photosRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  reviewPhoto: { width: 72, height: 72, borderRadius: 8, overflow: 'hidden' },
});
