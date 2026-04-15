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
      {/* Left: Location Selector */}
      <View style={styles.leftSection}>
        <Text style={styles.homeTitle}>Home</Text>
        <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
          <Ionicons name="location" size={14} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>{locationLabel}</Text>
          <Ionicons name="chevron-down" size={12} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Right Side Icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={onNotificationsPress}>
          <View style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={20} color={colors.text.primary} />
          </View>
          {hasUnreadNotifications && <View style={styles.notificationDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onProfilePress || (() => router.push('/(tabs)/profile'))}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="person-outline" size={20} color={colors.text.primary} />
          </View>
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
    paddingVertical: spacing.sm,
  },
  leftSection: {
    flex: 1,
    gap: 2,
  },
  homeTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text.primary,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.text.secondary,
    maxWidth: 180,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    position: 'relative',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.status.error,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});

