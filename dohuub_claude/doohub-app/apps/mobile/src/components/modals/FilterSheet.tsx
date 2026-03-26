import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  sortOptions?: FilterOption[];
  selectedSort?: string;
  onSortChange?: (value: string) => void;
  priceRangeOptions?: FilterOption[];
  selectedPriceRange?: string;
  onPriceRangeChange?: (value: string) => void;
  ratingOptions?: FilterOption[];
  selectedRating?: string;
  onRatingChange?: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

/**
 * Filter Bottom Sheet matching wireframes
 * - Sort options
 * - Price range filters
 * - Rating filters
 * - Apply/Reset buttons
 */
export function FilterSheet({
  visible,
  onClose,
  sortOptions = [
    { id: '1', label: 'Recommended', value: 'recommended' },
    { id: '2', label: 'Price: Low to High', value: 'price_asc' },
    { id: '3', label: 'Price: High to Low', value: 'price_desc' },
    { id: '4', label: 'Rating', value: 'rating' },
    { id: '5', label: 'Distance', value: 'distance' },
  ],
  selectedSort = 'recommended',
  onSortChange,
  priceRangeOptions = [
    { id: '1', label: '$', value: '1' },
    { id: '2', label: '$$', value: '2' },
    { id: '3', label: '$$$', value: '3' },
    { id: '4', label: '$$$$', value: '4' },
  ],
  selectedPriceRange,
  onPriceRangeChange,
  ratingOptions = [
    { id: '1', label: '4.5+', value: '4.5' },
    { id: '2', label: '4.0+', value: '4.0' },
    { id: '3', label: '3.5+', value: '3.5' },
    { id: '4', label: 'Any', value: '0' },
  ],
  selectedRating,
  onRatingChange,
  onApply,
  onReset,
}: FilterSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Filter & Sort"
      snapPoints={['75%']}
    >
      {/* Sort Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sort By</Text>
        <View style={styles.optionsList}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortOption,
                selectedSort === option.value && styles.sortOptionSelected,
              ]}
              onPress={() => onSortChange?.(option.value)}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  selectedSort === option.value && styles.sortOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {selectedSort === option.value && (
                <Ionicons name="checkmark" size={20} color={colors.background} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Price Range Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.chipGroup}>
          {priceRangeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.chip,
                selectedPriceRange === option.value && styles.chipSelected,
              ]}
              onPress={() => onPriceRangeChange?.(option.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedPriceRange === option.value && styles.chipTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rating Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating</Text>
        <View style={styles.chipGroup}>
          {ratingOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.chip,
                selectedRating === option.value && styles.chipSelected,
              ]}
              onPress={() => onRatingChange?.(option.value)}
            >
              {option.value !== '0' && (
                <Ionicons
                  name="star"
                  size={14}
                  color={selectedRating === option.value ? colors.background : colors.rating}
                  style={styles.starIcon}
                />
              )}
              <Text
                style={[
                  styles.chipText,
                  selectedRating === option.value && styles.chipTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Reset"
          variant="outline"
          onPress={onReset}
          style={styles.resetButton}
        />
        <Button
          title="Apply Filters"
          onPress={() => {
            onApply();
            onClose();
          }}
          style={styles.applyButton}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  optionsList: {
    gap: spacing.sm,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46, 122, 217, 0.1)',
  },
  sortOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortOptionText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  sortOptionTextSelected: {
    color: colors.background,
    fontWeight: fontWeight.medium,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  chipTextSelected: {
    color: colors.background,
  },
  starIcon: {
    marginRight: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});

