import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useRewardsStore } from '../../src/store/rewardsStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { MainHeader } from '../../src/components/composite';
import { LocationModal } from '../../src/components/modals';

interface ServiceCategory {
  id: string;
  name: string;
  image: any;
  route: string;
  available: boolean;
  restrictedForWork?: boolean;
  bgColor: string;
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cleaning', name: 'Cleaning Services', image: require('../../assets/cat-cleaning.png'), route: '/services/cleaning', available: true, bgColor: colors.category.cleaningLight },
  { id: 'handyman', name: 'Handyman Services', image: require('../../assets/cat-handyman.png'), route: '/services/handyman', available: true, bgColor: colors.category.handymanLight },
  { id: 'groceries', name: 'Groceries & Food', image: require('../../assets/cat-groceries.png'), route: '/services/groceries', available: true, bgColor: colors.category.groceriesLight },
  { id: 'beauty', name: 'Beauty Services and Products', image: require('../../assets/cat-beauty.png'), route: '/services/beauty/choice', available: true, bgColor: colors.category.beautyLight },
  { id: 'rentals', name: 'Rental Properties', image: require('../../assets/cat-rentals.png'), route: '/services/rentals', available: true, bgColor: colors.category.rentalsLight },
  { id: 'caregiving', name: 'Caregiving Services', image: require('../../assets/cat-caregiving.png'), route: '/services/caregiving', available: true, restrictedForWork: true, bgColor: colors.category.caregivingLight },
];

/**
 * Home Dashboard matching wireframe exactly:
 * - Location selector header
 * - Notification bell + profile icons
 * - Location banner
 * - Search bar (links to AI chat)
 * - 2-column category grid with gray icons
 * - NO Featured Services section
 * - NO Quick Actions section
 */
export default function HomeScreen() {
  const { addresses, selectedAddressId, setSelectedAddress } = useAuthStore();
  const { wallet, fetchWallet, streak, fetchStreak } = useRewardsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Map authStore addresses to LocationModal format
  const modalAddresses = addresses.map((a) => ({
    id: a.id,
    type: a.type.toLowerCase() as 'home' | 'work' | 'doctor' | 'pharmacy' | 'other',
    label: a.label,
    address: `${a.street}, ${a.city}, ${a.state} ${a.zipCode}`,
    isDefault: a.isDefault,
  }));

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const displayLabel = selectedAddress?.label || 'Home';
  const displayStreet = selectedAddress
    ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
    : '123 Main Street, Apt 4B, New York, NY';

  useEffect(() => {
    fetchWallet();
    fetchStreak();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchWallet(), fetchStreak()]);
    setRefreshing(false);
  }, []);

  const handleCategoryPress = (category: ServiceCategory) => {
    // Check if caregiving is restricted for work address
    if (category.restrictedForWork && selectedAddress?.type === 'WORK') {
      return;
    }
    router.push(category.route as any);
  };

  const handleSearchPress = () => {
    router.push('/(tabs)/chat');
  };

  const handleLocationPress = () => {
    setShowLocationModal(true);
  };

  const handleNotificationsPress = () => {
    router.push('/notifications');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MainHeader
          locationLabel={displayLabel}
          onLocationPress={handleLocationPress}
          onNotificationsPress={handleNotificationsPress}
          hasUnreadNotifications={hasUnreadNotifications}
        />

        {/* Location Banner */}
        <View style={styles.locationBanner}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>{displayStreet}</Text>
          <TouchableOpacity onPress={handleLocationPress}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <Ionicons name="search" size={20} color={colors.text.muted} />
          <Text style={styles.searchPlaceholder}>What service do you need?</Text>
        </TouchableOpacity>

        {/* Rewards Widget - always visible */}
        <TouchableOpacity
          style={styles.rewardsWidget}
          onPress={() => router.push('/rewards')}
        >
          <View style={styles.rewardsLeft}>
            <Ionicons name="gift" size={20} color="#D97706" />
            <Text style={styles.rewardsPoints}>{((wallet?.totalPoints ?? 0) || 2450).toLocaleString()} pts</Text>
          </View>
          <View style={styles.rewardsRight}>
            <Ionicons name="flame" size={20} color="#F97316" />
            <Text style={styles.streakText}>{(streak?.currentStreak ?? 0) || 6} week streak</Text>
          </View>
        </TouchableOpacity>

        {/* Categories Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          <View style={styles.categoriesGrid}>
            {SERVICE_CATEGORIES.map((category) => {
              const isAvailable = category.restrictedForWork
                ? selectedAddress?.type !== 'WORK'
                : category.available;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, !isAvailable && styles.categoryCardDisabled]}
                  onPress={() => handleCategoryPress(category)}
                  disabled={!isAvailable}
                >
                  <View style={[styles.categoryIcon, !isAvailable && styles.categoryIconDisabled]}>
                    <Image
                      source={category.image}
                      style={[styles.categoryImage, !isAvailable && { opacity: 0.4 }]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.categoryName, !isAvailable && styles.categoryNameDisabled]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Location Selector Modal */}
      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        addresses={modalAddresses}
        selectedAddressId={selectedAddressId || undefined}
        onSelectAddress={(addr) => setSelectedAddress(addr.id)}
        onAddNew={() => router.push('/profile/add-address')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: '#2E7AD9',
  },
  locationText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  changeText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  locationBannerEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: '#FEF9C3',
    borderWidth: borderWidth.default,
    borderColor: '#FDE047',
    borderRadius: borderRadius.lg,
  },
  locationTextEmpty: {
    flex: 1,
    fontSize: fontSize.sm,
    color: '#A16207',
  },
  changeTextEmpty: {
    fontSize: fontSize.sm,
    color: '#A16207',
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
  },
  searchPlaceholder: {
    fontSize: fontSize.md,
    color: colors.text.muted,
  },
  section: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%',
    padding: spacing.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  categoryCardDisabled: {
    borderColor: 'rgba(46, 122, 217, 0.1)',
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    opacity: 0.6,
  },
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryIconDisabled: {
    opacity: 0.4,
  },
  categoryImage: {
    width: 72,
    height: 72,
  },
  categoryName: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  categoryNameDisabled: {
    color: colors.text.muted,
  },
  rewardsWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: borderRadius.lg,
    backgroundColor: '#FFFBEB',
  },
  rewardsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rewardsPoints: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#92400E',
  },
  rewardsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  streakText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#92400E',
  },
});
