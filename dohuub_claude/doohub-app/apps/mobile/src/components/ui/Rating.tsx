import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../../constants/theme';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  style?: ViewStyle;
}

export function Rating({
  rating,
  reviewCount,
  size = 'md',
  showCount = true,
  style,
}: RatingProps) {
  const starSize = size === 'sm' ? 14 : size === 'md' ? 18 : 22;
  const textSize = size === 'sm' ? fontSize.xs : size === 'md' ? fontSize.sm : fontSize.md;

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={starSize} color={colors.rating} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={starSize} color={colors.rating} />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={starSize} color={colors.rating} />
        );
      }
    }

    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stars}>{renderStars()}</View>
      <Text style={[styles.rating, { fontSize: textSize }]}>{rating.toFixed(1)}</Text>
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
  },
  rating: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  count: {
    color: colors.text.secondary,
  },
});

