import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader, ReviewCard } from '../../src/components/composite';
import { Rating, EmptyState } from '../../src/components/ui';
import { getReviewsByVendor, getReviewAuthorName } from '../../src/lib/queries';

const FILTER_TABS = ['All', '5★', '4★', '3★', '2★', '1★'];

/**
 * All Reviews Screen matching wireframe:
 * - Header: "Reviews" with back button
 * - Provider summary (name, avg rating, total reviews)
 * - Filter tabs: All, 5★, 4★, 3★, 2★, 1★
 * - Review cards list (reuse ReviewCard)
 * - Load more / pagination
 */
export default function AllReviewsScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      if (!providerId) return;
      const data = await getReviewsByVendor(providerId);
      setReviews(data.map((r: any) => ({
        id: r.id,
        authorName: getReviewAuthorName(r),
        rating: r.rating,
        date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        comment: r.comment,
      })));
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, [providerId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const filteredReviews = reviews.filter((review) => {
    if (activeFilter === 'All') return true;
    const starRating = parseInt(activeFilter);
    return review.rating === starRating;
  });

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Provider Summary */}
      <View style={styles.providerSummary}>
        <View style={styles.ratingRow}>
          <Rating value={parseFloat(avgRating)} size="lg" showValue />
          <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              activeFilter === tab && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab && styles.filterTabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="star-outline"
      title="No reviews yet"
      message={activeFilter === 'All' 
        ? "This provider doesn't have any reviews yet."
        : `No ${activeFilter} reviews found.`}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Reviews" showBack />

      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <ReviewCard
              id={item.id}
              authorName={item.authorName}
              rating={item.rating}
              date={item.date}
              comment={item.comment}
            />
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContent: {
    marginBottom: spacing.lg,
  },
  providerSummary: {
    padding: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  providerName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reviewCount: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: colors.text.inverse,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  reviewItem: {
    marginBottom: spacing.sm,
  },
});

