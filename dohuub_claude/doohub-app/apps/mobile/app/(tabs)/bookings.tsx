import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useBookingStore } from '../../src/store/bookingStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';

type TabKey = 'All' | 'Upcoming' | 'In Progress' | 'Completed';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'Upcoming', label: 'Upcoming' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Completed', label: 'Completed' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'rgba(46, 122, 217, 0.1)', text: colors.text.primary, label: 'Pending' },
  ACCEPTED: { bg: '#DCFCE7', text: '#166534', label: 'Accepted' },
  IN_PROGRESS: { bg: '#DBEAFE', text: '#1E40AF', label: 'In Progress' },
  COMPLETED: { bg: '#DCFCE7', text: '#166534', label: 'Completed' },
  CANCELLED: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
  DECLINED: { bg: '#FEE2E2', text: '#991B1B', label: 'Declined' },
};

const EMPTY_COPY: Record<
  TabKey,
  { title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; showBrowse: boolean }
> = {
  All: {
    title: 'No bookings yet',
    subtitle: 'Explore services and book your first appointment — cleaning, beauty, rides, and more.',
    icon: 'calendar-outline',
    showBrowse: true,
  },
  Upcoming: {
    title: 'Nothing upcoming',
    subtitle: 'When you book a service, your confirmed appointments will show up here.',
    icon: 'calendar-outline',
    showBrowse: true,
  },
  'In Progress': {
    title: 'No active bookings',
    subtitle: 'Services that are currently underway will appear in this tab.',
    icon: 'time-outline',
    showBrowse: false,
  },
  Completed: {
    title: 'No completed bookings',
    subtitle: 'Finished services will land here so you can review and rebook anytime.',
    icon: 'checkmark-done-outline',
    showBrowse: false,
  },
};

function matchesTab(status: string, tab: TabKey) {
  if (tab === 'All') return true;
  if (tab === 'Upcoming') return status === 'ACCEPTED' || status === 'PENDING';
  if (tab === 'In Progress') return status === 'IN_PROGRESS';
  if (tab === 'Completed') return status === 'COMPLETED';
  return true;
}

/**
 * My Bookings screen:
 * - Segmented filter tabs with icons + counts
 * - Polished empty state per tab
 */
export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const { bookings, fetchBookings, clearError } = useBookingStore();
  const [refreshing, setRefreshing] = useState(false);
  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useSharedValue(0);

  const activeIndex = TABS.findIndex((t) => t.key === activeTab);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (tabWidth <= 0) return;
    indicatorX.value = withSpring(activeIndex * tabWidth, {
      damping: 20,
      stiffness: 220,
      mass: 0.6,
    });
  }, [activeIndex, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width / TABS.length;
    setTabWidth(w);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    clearError();
    await fetchBookings();
    setRefreshing(false);
  };

  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = {
      All: bookings.length,
      Upcoming: 0,
      'In Progress': 0,
      Completed: 0,
    };
    for (const booking of bookings) {
      if (matchesTab(booking.status, 'Upcoming')) counts.Upcoming += 1;
      if (matchesTab(booking.status, 'In Progress')) counts['In Progress'] += 1;
      if (matchesTab(booking.status, 'Completed')) counts.Completed += 1;
    }
    return counts;
  }, [bookings]);

  const filteredBookings = bookings.filter((booking: any) =>
    matchesTab(booking.status, activeTab)
  );

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
        activeOpacity={0.85}
      >
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
                <Text style={styles.bookingTitle} numberOfLines={1}>
                  {serviceName}
                </Text>
                {isPowered && (
                  <View style={styles.poweredBadge}>
                    <Text style={styles.poweredBadgeText}>Powered by DoHuub</Text>
                  </View>
                )}
              </View>
              <Text style={styles.bookingVendor}>
                {item.vendor?.businessName || 'Provider'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.detailText}>
                {item.scheduledDate
                  ? new Date(item.scheduledDate).toLocaleDateString()
                  : 'TBD'}
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
                  <Text style={[styles.pointsBadgeText, { color: '#D97706' }]}>
                    -{pointsRedeemed} pts
                  </Text>
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

  const renderEmptyState = () => {
    const copy = EMPTY_COPY[activeTab];

    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyArt}>
          <View style={styles.emptyRingOuter} />
          <View style={styles.emptyRingMid} />
          <View style={styles.emptyIcon}>
            <Ionicons name={copy.icon} size={36} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.emptyTitle}>{copy.title}</Text>
        <Text style={styles.emptyText}>{copy.subtitle}</Text>

        {copy.showBrowse && (
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)')}
            activeOpacity={0.9}
          >
            <Ionicons name="compass-outline" size={18} color="#FFFFFF" />
            <Text style={styles.browseButtonText}>Browse Services</Text>
          </TouchableOpacity>
        )}

        {activeTab !== 'All' && (
          <TouchableOpacity
            style={styles.emptySecondary}
            onPress={() => setActiveTab('All')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptySecondaryText}>View all bookings</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>
          {tabCounts.All === 0
            ? 'Track and manage your services'
            : `${tabCounts.All} booking${tabCounts.All === 1 ? '' : 's'} total`}
        </Text>
      </View>

      <View style={styles.filterWrap}>
        <View style={styles.filterTrack} onLayout={onTrackLayout}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.filterTab}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[styles.filterTabText, active && styles.filterTabTextActive]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
          {tabWidth > 0 && (
            <Animated.View
              style={[
                styles.slidingUnderline,
                { width: Math.max(tabWidth * 0.42, 28) },
                { left: (tabWidth - Math.max(tabWidth * 0.42, 28)) / 2 },
                indicatorStyle,
              ]}
            />
          )}
        </View>
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  filterWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  filterTrack: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  filterTab: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  filterTabText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  filterTabTextActive: {
    color: '#1E293B',
    fontWeight: '700',
  },
  slidingUnderline: {
    position: 'absolute',
    bottom: -1,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#2E7AD9',
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
    borderColor: 'rgba(15, 23, 42, 0.08)',
    overflow: 'hidden',
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
    backgroundColor: '#F1F5F9',
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
    borderTopColor: 'rgba(15, 23, 42, 0.06)',
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

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 56,
  },
  emptyArt: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyRingOuter: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(46, 122, 217, 0.06)',
  },
  emptyRingMid: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text.secondary,
    marginBottom: 28,
    textAlign: 'center',
    maxWidth: 300,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 22,
    backgroundColor: colors.primary,
    borderRadius: 14,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptySecondary: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  emptySecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
