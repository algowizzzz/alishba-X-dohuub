import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../../../../src/constants/theme';
import { StarRow } from '../../../../src/components/ui';
import { getReviewsByVendor, getReviewAuthorName } from '../../../../src/lib/queries';

const FILTER_TABS = ['All', '5★', '4★', '3★', '2★', '1★'];

function formatRelativeDate(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return '1 month ago';
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return d.toLocaleDateString();
}

function reviewerName(r: any): string {
  return getReviewAuthorName(r);
}

export default function BeautyReviewsScreen() {
  const params = useLocalSearchParams<{ id: string; name: string }>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!params.id) return;
    getReviewsByVendor(params.id).then(setReviews).catch(() => setReviews([]));
  }, [params.id]);

  const filteredReviews = activeFilter === 'All'
    ? reviews
    : reviews.filter(r => r.rating === parseInt(activeFilter));

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Reviews</Text>
          <Text style={styles.headerSubtitle}>{params.name || 'Beauty Services'}</Text>
        </View>
      </View>

      <FlatList
        data={filteredReviews}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Rating Summary */}
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingBig}>{avgRating}</Text>
              <StarRow rating={parseFloat(avgRating) || 0} size={22} />
              <Text style={styles.ratingCount}>{reviews.length} reviews</Text>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
              {FILTER_TABS.map(tab => (
                <TouchableOpacity key={tab} style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]} onPress={() => setActiveFilter(tab)}>
                  <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewName}>{reviewerName(item)}</Text>
              <Text style={styles.reviewDate}>{formatRelativeDate(item.createdAt)}</Text>
            </View>
            <StarRow rating={Number(item.rating) || 0} size={16} />
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
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
  list: { padding: 20, gap: 12 },
  ratingSummary: { alignItems: 'center', padding: 24, backgroundColor: '#FFF', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(46,122,217,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  ratingBig: { fontSize: 48, fontWeight: '700', color: colors.text.primary },
  starsRow: { flexDirection: 'row', gap: 3, marginVertical: 6 },
  ratingCount: { fontSize: fontSize.sm, color: colors.text.secondary },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterTabText: { fontSize: 13, color: colors.text.secondary, fontWeight: '500' },
  filterTabTextActive: { color: '#FFF' },
  reviewCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(46,122,217,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  reviewName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  reviewDate: { fontSize: fontSize.xs, color: colors.text.secondary },
  reviewComment: { fontSize: fontSize.sm, color: colors.text.secondary, lineHeight: 19, marginTop: 6 },
});
