import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

interface CategoryGridProps {
  categories?: Category[];
  columns?: number;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cleaning', name: 'Cleaning', icon: 'sparkles-outline', route: '/services/cleaning' },
  { id: 'handyman', name: 'Handyman', icon: 'hammer-outline', route: '/services/handyman' },
  { id: 'groceries', name: 'Groceries', icon: 'basket-outline', route: '/services/groceries' },
  { id: 'beauty', name: 'Beauty', icon: 'cut-outline', route: '/services/beauty' },
  { id: 'rentals', name: 'Rentals', icon: 'car-outline', route: '/services/rentals' },
  { id: 'caregiving', name: 'Caregiving', icon: 'heart-outline', route: '/services/caregiving' },
];

/**
 * Category Grid matching wireframes
 * - 2-3 columns of category cards
 * - Gray icons with labels
 * - 2px border radius
 */
export function CategoryGrid({
  categories = DEFAULT_CATEGORIES,
  columns = 2,
}: CategoryGridProps) {
  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.card, { width: `${100 / columns - 3}%` }]}
      onPress={() => router.push(item.route as any)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={28} color={colors.text.secondary} />
      </View>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gridContent: {
    gap: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: colors.background,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
});

