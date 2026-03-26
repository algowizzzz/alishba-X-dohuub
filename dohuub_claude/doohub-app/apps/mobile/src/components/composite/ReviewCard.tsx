import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';
import { Rating } from '../ui/Rating';

interface ReviewCardProps {
  id: string;
  authorName: string;
  authorImage?: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  helpful?: number;
  onHelpful?: () => void;
}

/**
 * Review Card matching wireframes
 * - Author avatar and name
 * - Star rating
 * - Date
 * - Review text
 * - Optional images
 */
export function ReviewCard({
  id,
  authorName,
  authorImage,
  rating,
  date,
  comment,
  images,
  helpful,
  onHelpful,
}: ReviewCardProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {authorImage ? (
          <Image source={{ uri: authorImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {authorName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{authorName}</Text>
          <View style={styles.ratingRow}>
            <Rating value={rating} size="sm" />
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
      </View>

      {/* Comment */}
      <Text style={styles.comment}>{comment}</Text>

      {/* Images */}
      {images && images.length > 0 && (
        <View style={styles.imageContainer}>
          {images.slice(0, 3).map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.reviewImage}
            />
          ))}
          {images.length > 3 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>+{images.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* Helpful */}
      {helpful !== undefined && (
        <View style={styles.footer}>
          <Text style={styles.helpfulText}>
            {helpful} {helpful === 1 ? 'person' : 'people'} found this helpful
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  authorName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  comment: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  moreImages: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.secondary,
  },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.secondary,
  },
  helpfulText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});

