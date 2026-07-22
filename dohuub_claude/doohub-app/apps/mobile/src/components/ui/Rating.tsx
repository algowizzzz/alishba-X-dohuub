import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../../constants/theme';

const FILLED_STAR = '#F59E0B';
const EMPTY_STAR = '#94A3B8';

interface StarRowProps {
  rating?: number;
  size?: number;
  style?: ViewStyle;
}

/** Five stars with clear filled / half / empty states. */
export function StarRow({ rating = 0, size = 16, style }: StarRowProps) {
  const value = Number.isFinite(Number(rating)) ? Number(rating) : 0;
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;

  return (
    <View style={[styles.stars, style]}>
      {[0, 1, 2, 3, 4].map((i) => {
        if (i < fullStars) {
          return <Ionicons key={i} name="star" size={size} color={FILLED_STAR} style={styles.star} />;
        }
        if (i === fullStars && hasHalf) {
          return <Ionicons key={i} name="star-half" size={size} color={FILLED_STAR} style={styles.star} />;
        }
        return <Ionicons key={i} name="star-outline" size={size} color={EMPTY_STAR} style={styles.star} />;
      })}
    </View>
  );
}

interface RatingProps {
  rating?: number;
  /** Alias used by some screens — same as rating. */
  value?: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showValue?: boolean;
  style?: ViewStyle;
}

export function Rating({
  rating,
  value,
  reviewCount,
  size = 'md',
  showCount = true,
  showValue = true,
  style,
}: RatingProps) {
  const safeRating = Number.isFinite(Number(rating ?? value)) ? Number(rating ?? value) : 0;
  const starSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const textSize = size === 'sm' ? fontSize.xs : size === 'md' ? fontSize.sm : fontSize.md;

  return (
    <View style={[styles.container, style]}>
      <StarRow rating={safeRating} size={starSize} />
      {showValue && (
        <Text style={[styles.rating, { fontSize: textSize }]}>{safeRating.toFixed(1)}</Text>
      )}
      {showCount && reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: textSize }]}>({reviewCount})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 3,
  },
  rating: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  count: {
    color: colors.text.secondary,
  },
});
