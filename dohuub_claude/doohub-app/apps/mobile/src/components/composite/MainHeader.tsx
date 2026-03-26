import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, borderWidth, fontSize } from '../../constants/theme';

interface MainHeaderProps {
  locationLabel?: string;
  onLocationPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  hasUnreadNotifications?: boolean;
}

/**
 * Main header matching wireframe:
 * - Location selector dropdown on left
 * - Notification bell + profile icon on right
 */
export function MainHeader({
  locationLabel = 'Select Location',
  onLocationPress,
  onNotificationsPress,
  onProfilePress,
  hasUnreadNotifications = false,
}: MainHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Location Selector */}
      <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
        <Ionicons name="location-outline" size={18} color={colors.primary} />
        <Text style={styles.locationText}>{locationLabel}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.text.muted} />
      </TouchableOpacity>

      {/* Right Side Icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={onNotificationsPress}>
          <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
          {hasUnreadNotifications && <View style={styles.notificationDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onProfilePress || (() => router.push('/(tabs)/profile'))}
        >
          <Ionicons name="person-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.error,
  },
});

