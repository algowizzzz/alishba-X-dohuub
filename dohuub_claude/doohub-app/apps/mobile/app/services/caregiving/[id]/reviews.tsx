import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader, ReviewCard } from '../../../../src/components/composite';
import { Rating, EmptyState } from '../../../../src/components/ui';
import { getReviewsByVendor, getReviewAuthorName } from '../../../../src/lib/queries';

const FILTER_TABS = ['All', '5★', '4★', '3★', '2★', '1★'];

/**
 * Caregiving Service Reviews Screen
 */
export default function CaregivingReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      if (!id) return;
      const data = await getReviewsByVendor(id);
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

  useEffect(() => { loadReviews(); }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const filteredReviews = reviews.filter((review) => {
    if (activeFilter === 'All') return true;
    const starRating = parseInt(activeFilter);
    return review.rating === starRating;
  });

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.summary}>
        <View style={styles.ratingBig}>
          <Text style={styles.ratingValue}>{avgRating}</Text>
          <Rating rating={parseFloat(avgRating) || 0} size="md" showCount={false} showValue={false} />
          <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
        </View>
      </View>

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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
        ListEmptyComponent={
          <EmptyState
            icon="star-outline"
            title="No reviews"
            message="No reviews found for this filter."
          />
        }
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
  summary: {
    padding: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  ratingBig: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  ratingValue: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.text.primary,
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

