import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../constants/theme';
import { Badge, Rating } from '../ui';

interface ProviderCardProps {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance?: string;
  startingPrice?: number;
  priceUnit?: string;
  isPoweredByDoHuub?: boolean;
  imageUrl?: string;
  fallbackImageUrl?: string;
  onImageLoad?: (url: string) => void;
  onPress: () => void;
}

/**
 * Provider card matching wireframe:
 * - Provider image (or icon fallback)
 * - Provider name
 * - Rating (stars) + review count
 * - Distance from user
 * - Starting price
 * - "Powered by DoHuub" badge (optional)
 */
export function ProviderCard({
  name,
  rating,
  reviewCount,
  distance,
  startingPrice,
  priceUnit = '/service',
  isPoweredByDoHuub,
  imageUrl,
  fallbackImageUrl,
  onImageLoad,
  onPress,
}: ProviderCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  const src = !imgFailed ? imageUrl : fallbackImageUrl;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Provider Image */}
      {src && !(imgFailed && fallbackFailed) ? (
        <Image
          source={{ uri: src }}
          style={styles.image}
          onLoad={() => { if (src) onImageLoad?.(src); }}
          onError={() => {
            if (!imgFailed) setImgFailed(true);
            else setFallbackFailed(true);
          }}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="business" size={32} color={colors.text.muted} />
        </View>
      )}

      <View style={styles.content}>
        {/* Badge */}
        {isPoweredByDoHuub && (
          <View style={styles.badgeContainer}>
            <Badge text="Powered by DoHuub" variant="dohuub" />
          </View>
        )}

        {/* Name */}
        <Text style={styles.name} numberOfLines={1}>{name}</Text>

        {/* Rating */}
        <Rating rating={rating} reviewCount={reviewCount} size="sm" />

        {/* Footer: Distance + Price */}
        <View style={styles.footer}>
          {distance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
              <Text style={styles.distance}>{distance}</Text>
            </View>
          )}
          {startingPrice && (
            <Text style={styles.price}>
              From ${startingPrice}{priceUnit}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  imagePlaceholder: {
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeContainer: {
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  distance: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  price: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.primary,
  },
});

