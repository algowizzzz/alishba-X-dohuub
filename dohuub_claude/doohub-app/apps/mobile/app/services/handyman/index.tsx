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
import { getHandymanListings } from '../../../src/lib/queries';
import { getServiceImages } from '../../../src/constants/serviceImages';

const SUB_CATEGORIES = [
  { id: 'electrical', name: 'Electrical', icon: 'flash' },
  { id: 'plumbing', name: 'Plumbing', icon: 'water' },
  { id: 'installation', name: 'Installation', icon: 'construct' },
];

export default function HandymanServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharedImage, setSharedImage] = useState<string | null>(null);

  const fetchProviders = async () => {
    try {
      setError(null);
      const listings = await getHandymanListings();
      const vendorMap = new Map();
      let idx = 0;
      listings.forEach((listing: any) => {
        const v = listing.Vendor;
        if (!v) return;
        const price = listing.hourlyRate ?? listing.basePrice ?? 0;
        if (!vendorMap.has(v.id) || price < vendorMap.get(v.id).startingPrice) {
          vendorMap.set(v.id, {
            id: v.id,
            name: v.businessName,
            rating: v.rating ?? 0,
            reviewCount: v.reviewCount ?? 0,
            startingPrice: price,
            priceUnit: '/hour',
            isPoweredByDoHuub: v.isMichelle ?? false,
            distance: '0.5 mi',
            imageUrl: v.logo || getServiceImages('handyman')[idx % 4],
          });
          idx++;
        }
      });
      setProviders(Array.from(vendorMap.values()));
    } catch (e: any) {
      console.error('Failed to fetch handyman providers:', e);
      setError(e?.message || 'Failed to load handyman services');
      setProviders([]);
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
    router.push(`/services/handyman/${providerId}`);
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
      <ScreenHeader title="Handyman Services" showBack />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderSubCategories}
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
              fallbackImageUrl={sharedImage || undefined}
              onImageLoad={(url) => { if (!sharedImage) setSharedImage(url); }}
              onPress={() => handleProviderPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {error || 'No handyman services available'}
              </Text>
              {error && (
                <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              )}
            </View>
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
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: '#9CA3AF',
    textAlign: 'center' as const,
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  retryText: {
    fontSize: fontSize.xs,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
});

