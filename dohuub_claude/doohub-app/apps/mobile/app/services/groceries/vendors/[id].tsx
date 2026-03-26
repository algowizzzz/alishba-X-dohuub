import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button, Badge, Rating } from '../../../../src/components/ui';
import { useCartStore } from '../../../../src/store/cartStore';
import { getVendorById, getGroceryListings } from '../../../../src/lib/queries';

type VendorData = {
  id: string;
  businessName: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  rating: number;
  reviewCount: number;
  isMichelle: boolean;
  status: string;
};

type GroceryItem = {
  id: string;
  vendorId: string;
  storeId: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  unit: string;
  image: string | null;
  inStock: boolean;
  stockCount: number;
  status: string;
  Vendor: any;
};

/**
 * Food Vendor Detail Screen matching wireframe:
 * - Vendor header (logo, name, rating)
 * - Category tabs
 * - Product/dish grid
 * - Add to cart buttons
 * - Floating cart button with count
 */
export default function VendorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [menuItems, setMenuItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { items, addItem } = useCartStore();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [vendorData, listings] = await Promise.all([
        getVendorById(id!),
        getGroceryListings(), // fetch all, then filter by vendorId client-side
      ]);
      setVendor(vendorData as VendorData);

      const vendorListings = (listings as GroceryItem[]).filter(l => l.vendorId === id);
      setMenuItems(vendorListings);

      const uniqueCategories = [...new Set(vendorListings.map(l => l.category).filter(Boolean))];
      setCategories(uniqueCategories);
      if (uniqueCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(uniqueCategories[0]);
      }
    } catch (err) {
      console.error('Failed to fetch vendor details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = async (itemId: string) => {
    await addItem(itemId);
  };

  const handleViewCart = () => {
    router.push('/services/groceries/cart');
  };

  if (loading || !vendor) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader showBack title="Vendor" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const renderMenuItem = ({ item }: { item: GroceryItem }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemImage}>
        <Ionicons name="restaurant-outline" size={32} color={colors.text.muted} />
      </View>
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>{item.description ?? ''}</Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToCart(item.id)}
      >
        <Ionicons name="add" size={20} color={colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader showBack title={vendor.businessName} />

      {/* Vendor Header */}
      <View style={styles.vendorHeader}>
        <View style={styles.vendorLogo}>
          <Ionicons name="restaurant" size={40} color={colors.text.muted} />
        </View>
        <View style={styles.vendorInfo}>
          <Rating rating={vendor.rating} reviewCount={vendor.reviewCount} />
          {vendor.description ? (
            <Text style={styles.deliveryText} numberOfLines={2}>{vendor.description}</Text>
          ) : null}
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === category && styles.categoryTabTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <TouchableOpacity style={styles.cartButton} onPress={handleViewCart}>
          <View style={styles.cartButtonContent}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
            <Text style={styles.cartButtonText}>View Cart</Text>
            <Ionicons name="cart" size={20} color={colors.text.inverse} />
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  vendorHeader: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
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
    justifyContent: 'center',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  deliveryText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  deliveryDot: {
    marginHorizontal: spacing.xs,
    color: colors.text.muted,
  },
  categoryTabs: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  categoryTabsContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  categoryTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
    marginRight: spacing.sm,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
  },
  categoryTabText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: colors.text.inverse,
  },
  menuList: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  menuItemDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  menuItemPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  cartButton: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    backgroundColor: colors.status.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cartBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  cartButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.inverse,
    marginRight: spacing.sm,
  },
});

