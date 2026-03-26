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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader, ProviderCard } from '../../../src/components/composite';
import { getCleaningListings } from '../../../src/lib/queries';
import { SAMPLE_CLEANING_VENDORS } from '../../../src/constants/sampleVendors';
import { getServiceImage } from '../../../src/constants/serviceImages';

const SUB_CATEGORIES = [
  { id: 'deep', name: 'Deep Cleaning', icon: 'sparkles' },
  { id: 'laundry', name: 'Laundry', icon: 'water' },
  { id: 'office', name: 'Office Cleaning', icon: 'business' },
];

/**
 * Cleaning Services listing screen matching wireframe:
 * - Header with back button
 * - Sub-category pills (Deep Cleaning, Laundry, Office)
 * - Provider list with Michelle's first
 */
export default function CleaningServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = async () => {
    try {
      setError(null);
      const listings = await getCleaningListings();
      // Group by vendor, keeping the cheapest listing price per vendor
      const vendorMap = new Map();
      let idx = 0;
      listings.forEach((listing: any) => {
        const v = listing.Vendor;
        if (!v) return;
        if (!vendorMap.has(v.id) || listing.basePrice < vendorMap.get(v.id).startingPrice) {
          vendorMap.set(v.id, {
            id: v.id,
            name: v.businessName,
            rating: v.rating ?? 0,
            reviewCount: v.reviewCount ?? 0,
            startingPrice: listing.basePrice ?? 0,
            priceUnit: '/service',
            isPoweredByDoHuub: v.isMichelle ?? false,
            distance: '0.5 mi',
            imageUrl: v.logo || getServiceImage('cleaning', idx),
          });
          idx++;
        }
      });
      const result = Array.from(vendorMap.values());
      // Fall back to sample vendors if no real data
      setProviders(result.length > 0 ? result : SAMPLE_CLEANING_VENDORS);
    } catch (e: any) {
      const msg = e?.message || 'Failed to fetch cleaning providers';
      console.error('Failed to fetch cleaning providers:', e);
      setError(msg);
      // Show sample data on error so the app isn't empty
      setProviders(SAMPLE_CLEANING_VENDORS);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchProviders();
      setLoading(false);
    };
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProviders();
    setRefreshing(false);
  };

  const handleProviderPress = (providerId: string) => {
    router.push(`/services/cleaning/${providerId}`);
  };

  const renderSubCategories = () => (
    <View style={styles.subCategories}>
      {SUB_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.subCategoryPill,
            selectedCategory === cat.id && styles.subCategoryPillActive,
          ]}
          onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
        >
          <Ionicons
            name={cat.icon as any}
            size={16}
            color={selectedCategory === cat.id ? colors.text.inverse : colors.text.primary}
          />
          <Text
            style={[
              styles.subCategoryText,
              selectedCategory === cat.id && styles.subCategoryTextActive,
            ]}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Cleaning Services" showBack />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderSubCategories}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="sparkles-outline" size={48} color={colors.text.muted} />
              <Text style={styles.emptyText}>
                {error ? `Error: ${error}` : 'No cleaning services available'}
              </Text>
              {error && (
                <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <ProviderCard
              id={item.id}
              name={item.name}
              rating={item.rating}
              reviewCount={item.reviewCount}
              distance={item.distance}
              startingPrice={item.startingPrice}
              priceUnit={item.priceUnit}
              isPoweredByDoHuub={item.isPoweredByDoHuub}
              imageUrl={item.imageUrl}
              onPress={() => handleProviderPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
  },
  subCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  subCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
  },
  subCategoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  subCategoryText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  subCategoryTextActive: {
    color: colors.text.inverse,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  retryText: {
    fontSize: fontSize.sm,
    color: colors.text.inverse,
    fontWeight: '600',
  },
});

