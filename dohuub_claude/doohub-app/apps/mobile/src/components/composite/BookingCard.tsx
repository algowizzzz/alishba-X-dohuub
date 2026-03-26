import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, borderWidth } from '../../constants/theme';
import { Button } from '../ui/Button';

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface BookingCardProps {
  id: string;
  serviceName: string;
  providerName: string;
  providerImage?: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
  onPress?: () => void;
  onRebook?: () => void;
  onReview?: () => void;
  onCancel?: () => void;
}

/**
 * Booking Card matching wireframes
 * - Provider image and info
 * - Date/time display
 * - Status badge
 * - Action buttons based on status
 */
export function BookingCard({
  id,
  serviceName,
  providerName,
  providerImage,
  date,
  time,
  status,
  price,
  onPress,
  onRebook,
  onReview,
  onCancel,
}: BookingCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          color: colors.status.warning,
          bgColor: '#FEF3C7',
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          color: colors.status.info,
          bgColor: '#DBEAFE',
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          color: colors.status.info,
          bgColor: '#DBEAFE',
        };
      case 'completed':
        return {
          label: 'Completed',
          color: colors.status.success,
          bgColor: '#DCFCE7',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: colors.status.error,
          bgColor: '#FEE2E2',
        };
      default:
        return {
          label: 'Unknown',
          color: colors.text.secondary,
          bgColor: colors.secondary,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.providerInfo}>
          {providerImage ? (
            <Image source={{ uri: providerImage }} style={styles.providerImage} />
          ) : (
            <View style={styles.providerImagePlaceholder}>
              <Ionicons name="person" size={20} color={colors.text.muted} />
            </View>
          )}
          <View style={styles.providerDetails}>
            <Text style={styles.serviceName} numberOfLines={1}>{serviceName}</Text>
            <Text style={styles.providerName} numberOfLines={1}>{providerName}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>{date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>{time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.detailText}>${price}</Text>
        </View>
      </View>

      {/* Actions based on status */}
      {status === 'completed' && (onRebook || onReview) && (
        <View style={styles.actions}>
          {onReview && (
            <Button
              title="Leave Review"
              variant="outline"
              size="sm"
              onPress={onReview}
              style={styles.actionButton}
            />
          )}
          {onRebook && (
            <Button
              title="Book Again"
              size="sm"
              onPress={onRebook}
              style={styles.actionButton}
            />
          )}
        </View>
      )}

      {(status === 'pending' || status === 'confirmed') && onCancel && (
        <View style={styles.actions}>
          <Button
            title="Cancel Booking"
            variant="outline"
            size="sm"
            onPress={onCancel}
            style={styles.actionButton}
          />
        </View>
      )}
    </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  providerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46, 122, 217, 0.1)',
  },
  providerImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  providerName: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.secondary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.secondary,
  },
  actionButton: {
    flex: 1,
  },
});

