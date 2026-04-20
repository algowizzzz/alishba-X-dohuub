import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

interface MainHeaderProps {
  locationLabel?: string;
  onLocationPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  hasUnreadNotifications?: boolean;
}

/**
 * Main header matching boss wireframe (HomeDashboard.tsx):
 * - Location chip button on left (MapPin + label + ▼)
 * - Bell icon + User icon on right (no circle backgrounds)
 */
export function MainHeader({
  locationLabel = 'Home',
  onLocationPress,
  onNotificationsPress,
  onProfilePress,
  hasUnreadNotifications = false,
}: MainHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left: Location Chip */}
      <TouchableOpacity style={styles.locationChip} onPress={onLocationPress}>
        <Ionicons name="location" size={20} color="#2E7AD9" />
        <Text style={styles.locationLabel}>{locationLabel}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {/* Right: Icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={onNotificationsPress}>
          <Ionicons name="notifications-outline" size={24} color="#1E293B" />
          {hasUnreadNotifications && <View style={styles.notificationDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onProfilePress || (() => router.push('/(tabs)/profile'))}
        >
          <Ionicons name="person-outline" size={28} color="#1E293B" />
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
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationLabel: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '400',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#64748B',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});
