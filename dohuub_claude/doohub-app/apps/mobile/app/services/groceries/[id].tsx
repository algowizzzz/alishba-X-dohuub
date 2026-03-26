import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';
import { Button, Badge, Rating, ImageCarousel } from '../../../src/components/ui';
import { ReportModal } from '../../../src/components/modals';
import { getVendorById, getGroceryListings } from '../../../src/lib/queries';
import { getHeroImage } from '../../../src/constants/serviceImages';
import { isSampleId, getSampleVendorById } from '../../../src/constants/sampleVendors';

interface StoreData {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  isPoweredByDoHuub: boolean;
  categories: { id: string; name: string; itemCount: number }[];
  deliveryFee: number;
  minOrder: number;
  deliveryTime: string;
}

/**
 * Store Detail screen matching wireframe
 */
export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    loadStore();
  }, [id]);

  const loadStore = async () => {
    try {
      if (!id) return;

      // Handle sample vendor IDs
      if (isSampleId(id)) {
        const sample = getSampleVendorById(id);
        if (sample) {
          setStore({
            id: sample.id,
            name: sample.name,
            description: sample.description,
            rating: sample.rating,
            reviewCount: sample.reviewCount,
            isPoweredByDoHuub: sample.isPoweredByDoHuub,
            categories: [
              { id: '1', name: 'Fresh Produce', itemCount: 45 },
              { id: '2', name: 'Dairy & Eggs', itemCount: 28 },
              { id: '3', name: 'Pantry Essentials', itemCount: 62 },
              { id: '4', name: 'Beverages', itemCount: 35 },
            ],
            deliveryFee: 4.99,
            minOrder: Number(sample.startingPrice) || 15,
            deliveryTime: '30-45 min',
          });
        }
        setLoading(false);
        return;
      }

      const vendor = await getVendorById(id);
      const listings = await getGroceryListings();
      const vendorListings = listings.filter((l: any) => l.vendorId === id);

      // Group listings by category
      const categoryMap: Record<string, number> = {};
      vendorListings.forEach((l: any) => {
        const cat = l.category || 'Other';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      const categories = Object.entries(categoryMap).map(([name, count], idx) => ({
        id: String(idx + 1),
        name,
        itemCount: count,
      }));

      setStore({
        id: vendor.id,
        name: vendor.businessName,
        description: vendor.description || 'Fresh groceries and everyday essentials.',
        rating: vendor.rating || 0,
        reviewCount: vendor.reviewCount || 0,
        isPoweredByDoHuub: vendor.isMichelle || false,
        categories: categories.length > 0 ? categories : [{ id: '1', name: 'All Products', itemCount: vendorListings.length }],
        deliveryFee: 4.99,
        minOrder: 15,
        deliveryTime: '30-45 min',
      });
    } catch (e) {
      console.error('Failed to load store:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowse = () => {
    router.push(`/services/groceries/stores/${id}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/services/groceries/${id}/category/${categoryId}`);
  };

  const handleReport = async (reason: string, comment: string) => {
    setIsSubmittingReport(true);
    try {
      // Report submission would go here
      setShowReportModal(false);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!store) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader showBack title="Store" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg }}>
          <Text style={{ fontSize: fontSize.md, color: colors.text.secondary }}>Store not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleViewReviews = () => {
    router.push(`/reviews/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        showBack
        rightIcon="ellipsis-vertical"
        onRightAction={() => {}}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <ImageCarousel
          images={[
            getHeroImage('groceries'),
            'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop&q=80',
            'https://images.unsplash.com/photo-1506617564268-805a3a5b6e4c?w=600&h=400&fit=crop&q=80',
          ]}
          height={240}
        />

        {/* Header Info */}
        <View style={styles.headerInfo}>
          {store.isPoweredByDoHuub && (
            <Badge text="Powered by DoHuub" variant="dohuub" />
          )}
          <Text style={styles.name}>{store.name}</Text>
          <Rating rating={store.rating} reviewCount={store.reviewCount} />
          
          {/* Delivery Info */}
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryItem}>
              <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.deliveryText}>{store.deliveryTime}</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Ionicons name="bicycle-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.deliveryText}>${store.deliveryFee} delivery</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Ionicons name="card-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.deliveryText}>${store.minOrder} min</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{store.description}</Text>
        </View>

        {/* Points Earning Banner */}
        <View style={styles.pointsBanner}>
          <View style={styles.pointsIconCircle}>
            <Ionicons name="gift" size={20} color="#F59E0B" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.pointsTitle}>Earn points on this service</Text>
            <Text style={styles.pointsSubtext}>1 point per $1 spent • Points added after service completion</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          {store.categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.itemCount} items</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Reviews Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity onPress={handleViewReviews}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewsPreview}>
            <Text style={styles.noReviewsText}>
              {store.reviewCount} reviews with {store.rating} average rating
            </Text>
          </View>
        </View>

        {/* Report Listing */}
        <TouchableOpacity style={styles.reportButton} onPress={() => setShowReportModal(true)}>
          <Ionicons name="flag-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.reportText}>Report Listing</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button title="Start Shopping" onPress={handleBrowse} fullWidth />
      </View>

      {/* Report Modal */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        loading={isSubmittingReport}
        listingName={store.name}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  heroImage: {
    height: 220,
    backgroundColor: colors.primary,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  headerInfo: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  deliveryInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  deliveryText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  seeAllLink: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.secondary,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
  categoryCount: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  reviewsPreview: {
    padding: spacing.md,
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderRadius: borderRadius.md,
  },
  noReviewsText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  reportText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: colors.background,
  },
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 12,
  },
  pointsIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#92400E',
  },
  pointsSubtext: {
    fontSize: fontSize.xs,
    color: '#B45309',
    marginTop: 2,
  },
});
