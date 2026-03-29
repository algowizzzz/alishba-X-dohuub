import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../src/store/bookingStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';

const TABS = ['All', 'Upcoming', 'In Progress', 'Completed'];

const MOCK_BOOKINGS = [
  {
    id: 'mock-1',
    status: 'IN_PROGRESS',
    category: 'Deep House Cleaning',
    scheduledDate: '2026-03-28',
    scheduledTime: '10:00 AM',
    total: 120.00,
    pointsEarned: null,
    vendor: { businessName: 'Sparkle Clean Co.', isMichelle: true },
    listing: { title: 'Deep House Cleaning', Vendor: { isMichelle: true } },
    address: { street: '123 Main St', city: 'New York' },
    icon: 'sparkles',
    iconColor: '#2E7AD9',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
  },
  {
    id: 'mock-2',
    status: 'ACCEPTED',
    category: 'Handyman – TV Mounting',
    scheduledDate: '2026-03-30',
    scheduledTime: '2:00 PM',
    total: 85.00,
    pointsEarned: null,
    vendor: { businessName: 'HandyFix Pro', isMichelle: true },
    listing: { title: 'Handyman – TV Mounting', Vendor: { isMichelle: true } },
    address: { street: '456 Park Ave', city: 'Manhattan' },
    icon: 'construct',
    iconColor: '#EAB308',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop',
  },
  {
    id: 'mock-3',
    status: 'COMPLETED',
    category: 'Grocery Delivery',
    scheduledDate: '2026-03-22',
    scheduledTime: '11:00 AM',
    total: 55.00,
    pointsEarned: 55,
    vendor: { businessName: 'FreshCart Express', isMichelle: false },
    listing: { title: 'Grocery Delivery', Vendor: { isMichelle: false } },
    address: { street: '789 Oak Street', city: 'Brooklyn' },
    icon: 'cart',
    iconColor: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
  },
  {
    id: 'mock-4',
    status: 'COMPLETED',
    category: 'Ride Assistance',
    scheduledDate: '2026-03-19',
    scheduledTime: '9:00 AM',
    total: 140.00,
    pointsEarned: 140,
    pointsRedeemed: null,
    vendor: { businessName: 'DoHuub Care Transport', isMichelle: true },
    listing: { title: 'Ride Assistance', Vendor: { isMichelle: true } },
    address: { street: '22 West 34th St', city: 'Manhattan' },
    icon: 'car',
    iconColor: '#A855F7',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=200&fit=crop',
  },
  {
    id: 'mock-5',
    status: 'ACCEPTED',
    category: 'Hair & Makeup',
    scheduledDate: '2026-04-02',
    scheduledTime: '3:00 PM',
    total: 95.00,
    pointsEarned: null,
    pointsRedeemed: 200,
    vendor: { businessName: 'Glow Beauty Studio', isMichelle: false },
    listing: { title: 'Hair & Makeup', Vendor: { isMichelle: false } },
    address: { street: '55 Spring St', city: 'SoHo, New York' },
    icon: 'color-wand',
    iconColor: '#EC4899',
    image: 'https://images.unsplash.com/photo-1560066984-138daaa3b4e0?w=200&h=200&fit=crop',
  },
  {
    id: 'mock-6',
    status: 'COMPLETED',
    category: 'Companionship – 3hrs',
    scheduledDate: '2026-03-15',
    scheduledTime: '1:00 PM',
    total: 105.00,
    pointsEarned: 105,
    vendor: { businessName: 'Maria Garcia', isMichelle: true },
    listing: { title: 'Companionship – 3hrs', Vendor: { isMichelle: true } },
    address: { street: '123 Main St', city: 'New York' },
    icon: 'people',
    iconColor: '#EC4899',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
  },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'rgba(46, 122, 217, 0.1)', text: colors.text.primary, label: 'Pending' },
  ACCEPTED: { bg: '#DCFCE7', text: '#166534', label: 'Accepted' },
  IN_PROGRESS: { bg: '#DBEAFE', text: '#1E40AF', label: 'In Progress' },
  COMPLETED: { bg: '#DCFCE7', text: '#166534', label: 'Completed' },
  CANCELLED: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
  DECLINED: { bg: '#FEE2E2', text: '#991B1B', label: 'Declined' },
};

/**
 * My Bookings screen matching wireframe:
 * - Header with title
 * - Tab filters with glow shadow on active tab
 * - Booking cards with left accent border, 64px icon, powered badge, points badge
 */
export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const { bookings, fetchBookings, isLoading, error, clearError } = useBookingStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    clearError();
    await fetchBookings();
    setRefreshing(false);
  };

  // Use mock data as fallback when no real bookings
  const displayBookings = [...MOCK_BOOKINGS, ...bookings];

  const filteredBookings = displayBookings.filter((booking: any) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return booking.status === 'ACCEPTED';
    if (activeTab === 'In Progress') return booking.status === 'IN_PROGRESS';
    if (activeTab === 'Completed') return booking.status === 'COMPLETED';
    return true;
  });

  const isTrackable = (status: string) =>
    ['ACCEPTED', 'IN_PROGRESS'].includes(status);

  const handleTrackBooking = (bookingId: string) => {
    router.push(`/bookings/${bookingId}/tracking` as any);
  };

  const renderBookingCard = ({ item }: { item: any }) => {
    const status = STATUS_STYLES[item.status] || STATUS_STYLES.PENDING;
    const serviceName = item.listing?.title || item.category || 'Service';
    const isPowered = item.vendor?.isMichelle || item.listing?.Vendor?.isMichelle;
    const pointsEarned = item.pointsEarned;
    const pointsRedeemed = item.pointsRedeemed;
    const iconName = item.icon || 'sparkles';
    const iconColor = item.iconColor || colors.primary;

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => router.push(`/bookings/${item.id}` as any)}
      >
        {/* Left accent border */}
        <View style={styles.accentBorder} />

        <View style={styles.bookingCardInner}>
          <View style={styles.bookingHeader}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.bookingIcon} resizeMode="cover" />
            ) : (
              <View style={[styles.bookingIcon, { backgroundColor: `${iconColor}18` }]}>
                <Ionicons name={iconName as any} size={28} color={iconColor} />
              </View>
            )}
            <View style={styles.bookingInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.bookingTitle} numberOfLines={1}>{serviceName}</Text>
                {isPowered && (
                  <View style={styles.poweredBadge}>
                    <Text style={styles.poweredBadgeText}>Powered by DoHuub</Text>
                  </View>
                )}
              </View>
              <Text style={styles.bookingVendor}>{item.vendor?.businessName || 'Provider'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.detailText}>
                {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'TBD'}
                {item.scheduledTime && ` at ${item.scheduledTime}`}
              </Text>
            </View>
            {item.address && (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {item.address?.street}, {item.address?.city}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bookingFooter}>
            <View style={styles.footerBadges}>
              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
              </View>
              {pointsEarned != null && pointsEarned > 0 && (
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsBadgeText}>+{pointsEarned} pts</Text>
                </View>
              )}
              {pointsRedeemed != null && pointsRedeemed > 0 && (
                <View style={[styles.pointsBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.pointsBadgeText, { color: '#D97706' }]}>-{pointsRedeemed} pts</Text>
                </View>
              )}
            </View>
            {item.total != null && (
              <Text style={styles.bookingTotal}>${item.total.toFixed(2)}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="calendar-outline" size={64} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptyText}>Start exploring services to make your first booking</Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.browseButtonText}>Browse Services</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: '#FEE2E2' }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#991B1B" />
      </View>
      <Text style={styles.emptyTitle}>Unable to load bookings</Text>
      <Text style={styles.emptyText}>{error || 'Please check your connection and try again'}</Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={onRefresh}
      >
        <Text style={styles.browseButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
  },
  tabActive: {
    backgroundColor: colors.primary,
    shadowColor: '#4CA6FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  tabText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.text.inverse,
  },
  list: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  bookingCard: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(46, 122, 217, 0.08)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  accentBorder: {
    width: 3,
    backgroundColor: colors.primary,
  },
  bookingCardInner: {
    flex: 1,
    padding: spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bookingIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
    flexShrink: 0,
  },
  bookingInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  bookingTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    flexShrink: 1,
  },
  poweredBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
  poweredBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  bookingVendor: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  bookingDetails: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: 'rgba(46, 122, 217, 0.1)',
  },
  footerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  pointsBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: '#D1FAE5',
  },
  pointsBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#10B981',
  },
  bookingTotal: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  trackingIndicator: {
    marginRight: spacing.sm,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  trackButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    maxWidth: 280,
  },
  browseButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  browseButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.inverse,
  },
});
