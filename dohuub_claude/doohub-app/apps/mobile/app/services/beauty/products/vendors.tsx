import React, { useState, useEffect, useCallback } from 'react';
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
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Rating } from '../../../../src/components/ui';
import { getVendorsByCategory } from '../../../../src/lib/queries';

type VendorItem = {
  id: string;
  businessName: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  rating: number;
  reviewCount: number;
  isMichelle: boolean;
  status: string;
  VendorCategory: Array<{ category: string }>;
};

/**
 * Beauty Products Vendors List matching wireframe:
 * - List of beauty product vendors
 * - Vendor cards (logo, name, rating, product count)
 * - Filter by product type
 */
export default function BeautyVendorsScreen() {
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVendors = useCallback(async () => {
    try {
      const data = await getVendorsByCategory('BEAUTY_PRODUCTS');
      setVendors(data as VendorItem[]);
    } catch (err) {
      console.error('Failed to fetch beauty vendors:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchVendors();
  };

  const handleVendorPress = (vendorId: string) => {
    router.push(`/services/beauty/products/vendors/${vendorId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Beauty Vendors" showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const renderVendor = ({ item }: { item: VendorItem }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => handleVendorPress(item.id)}
    >
      <View style={styles.vendorLogo}>
        <Ionicons name="storefront" size={32} color={colors.text.muted} />
      </View>
      <View style={styles.vendorInfo}>
        <View style={styles.vendorHeader}>
          <Text style={styles.vendorName}>{item.businessName}</Text>
          {item.isMichelle && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DoHuub</Text>
            </View>
          )}
        </View>
        <Rating rating={item.rating} reviewCount={item.reviewCount} />
        {item.description ? (
          <View style={styles.vendorMeta}>
            <Text style={styles.categoriesText} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Beauty Vendors" showBack />

      <FlatList
        data={vendors}
        keyExtractor={(item) => item.id}
        renderItem={renderVendor}
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
  listContent: {
    padding: spacing.lg,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  vendorLogo: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  vendorName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  vendorMeta: {
    marginTop: spacing.xs,
  },
  productCount: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  categoriesText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
});

