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
import { NotificationsPanel } from '../../src/components/modals/NotificationsPanel';

interface ServiceCategory {
  id: string;
  name: string;
  image: any;
  route: string;
  available: boolean;
  restrictedForWork?: boolean;
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cleaning', name: 'Cleaning Services', image: require('../../assets/cat-cleaning.png'), route: '/services/cleaning', available: true },
  { id: 'handyman', name: 'Handyman Services', image: require('../../assets/cat-handyman.png'), route: '/services/handyman', available: true },
  { id: 'groceries', name: 'Groceries & Food', image: require('../../assets/cat-groceries.png'), route: '/services/groceries', available: true },
  { id: 'beauty', name: 'Beauty Services and Products', image: require('../../assets/cat-beauty.png'), route: '/services/beauty/choice', available: true },
  { id: 'rentals', name: 'Rental Properties', image: require('../../assets/cat-rentals.png'), route: '/services/rentals', available: true },
  { id: 'caregiving', name: 'Caregiving Services', image: require('../../assets/cat-caregiving.png'), route: '/services/caregiving', available: true, restrictedForWork: true },
];

/**
 * Home Dashboard — exact match to boss wireframe (HomeDashboard.tsx):
 * - Glassmorphic white header with rounded bottom corners
 * - Location chip + bell + profile icons
 * - Location banner with blue left border
 * - Search bar
 * - Rewards widget (amber gradient)
 * - 2-column category grid with boss images
 * - Light blue background (#F0F7FF)
 */
export default function HomeScreen() {
  const { addresses, selectedAddressId, setSelectedAddress } = useAuthStore();
  const { wallet, fetchWallet, streak, fetchStreak } = useRewardsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

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
    : '123, new york, nj';

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
    setShowNotifications(true);
  };

  return (
    <View style={styles.container}>
      {/* Header with glassmorphism - matching boss */}
      <View style={styles.header}>
        <MainHeader
          locationLabel={displayLabel}
          onLocationPress={handleLocationPress}
          onNotificationsPress={handleNotificationsPress}
          hasUnreadNotifications={hasUnreadNotifications}
        />

        {/* Location Banner with blue left accent */}
        <View style={styles.locationBanner}>
          <View style={styles.locationBannerContent}>
            <Ionicons name="location" size={16} color="#2E7AD9" />
            <Text style={styles.locationBannerText} numberOfLines={1}>{displayStreet}</Text>
          </View>
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
        {/* Search Bar - matching boss */}
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <Ionicons name="search" size={20} color="#64748B" />
          <Text style={styles.searchPlaceholder}>What service do you need?</Text>
        </TouchableOpacity>

        {/* Rewards Widget - matching boss amber gradient style */}
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

        {/* Categories Grid - matching boss 2-column layout */}
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
                  <Image
                    source={category.image}
                    style={[styles.categoryImage, !isAvailable && { opacity: 0.4 }]}
                    resizeMode="contain"
                  />
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

      {/* Notifications Panel - bottom sheet like boss */}
      <NotificationsPanel
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Location Selector Modal */}
      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        addresses={modalAddresses}
        selectedAddressId={selectedAddressId || undefined}
        onSelectAddress={(addr) => setSelectedAddress(addr.id)}
        onAddNew={() => router.push('/location/manual')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#E3F0FF',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#2E7AD9',
  },
  locationBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationBannerText: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
  },
  changeText: {
    fontSize: 14,
    color: '#2E7AD9',
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 24,
    marginVertical: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#64748B',
  },
  rewardsWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
  },
  rewardsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardsPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  rewardsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    width: '47%',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardDisabled: {
    backgroundColor: '#E8F1FC',
    opacity: 0.6,
  },
  categoryImage: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
  },
  categoryNameDisabled: {
    color: '#64748B',
  },
});
