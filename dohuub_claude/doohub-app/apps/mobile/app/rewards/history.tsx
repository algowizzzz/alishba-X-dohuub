import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { EmptyState } from '../../src/components/ui';
import { useRewardsStore } from '../../src/store/rewardsStore';

/**
 * Points History Screen
 * - Filter tabs: All | EARNED | REDEEMED | EXPIRED
 * - Summary stats grid (total earned/redeemed/expired)
 * - Transactions grouped by month
 * - Each item: type icon, description, badge + date, +/- points
 * - Points Redemption Info footer
 * - Pull-to-refresh
 */

const FILTER_TABS = ['All', 'EARNED', 'REDEEMED', 'EXPIRED'];

const FILTER_LABELS: Record<string, string> = {
  All: 'All',
  EARNED: 'Earned',
  REDEEMED: 'Redeemed',
  EXPIRED: 'Expired',
};

const TRANSACTION_LABELS: Record<string, string> = {
  EARNED: 'Earned',
  REDEEMED: 'Redeemed',
  EXPIRED: 'Expired',
  REFERRAL: 'Referral Bonus',
  BONUS: 'Sign-up Bonus',
};

const TRANSACTION_ICONS: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  EARNED: { name: 'star', color: colors.status.success },
  REDEEMED: { name: 'cart', color: colors.status.error },
  EXPIRED: { name: 'time', color: colors.text.muted },
  REFERRAL: { name: 'gift', color: colors.primary },
  BONUS: { name: 'flame', color: '#F59E0B' },
};

const getBadgeColors = (type: string) => {
  switch (type) {
    case 'EARNED':
    case 'REFERRAL':
    case 'BONUS':
      return { bg: 'rgba(34, 197, 94, 0.1)', text: 'rgb(22, 163, 74)' };
    case 'REDEEMED':
      return { bg: 'rgba(46, 122, 217, 0.1)', text: colors.primary };
    case 'EXPIRED':
      return { bg: 'rgba(239, 68, 68, 0.1)', text: colors.status.error };
    default:
      return { bg: 'rgba(34, 197, 94, 0.1)', text: 'rgb(22, 163, 74)' };
  }
};

interface TransactionSection {
  title: string;
  data: Array<{
    id: string;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
  }>;
}

export default function PointsHistoryScreen() {
  const { transactions, isLoading, fetchTransactions } = useRewardsStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    await fetchTransactions(activeFilter);
  }, [fetchTransactions, activeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Calculate summary stats from all transactions
  const summaryStats = useMemo(() => {
    const earned = transactions
      .filter((tx) => tx.type === 'EARNED' || tx.type === 'BONUS' || tx.type === 'REFERRAL')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const redeemed = transactions
      .filter((tx) => tx.type === 'REDEEMED')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const expired = transactions
      .filter((tx) => tx.type === 'EXPIRED')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    return { earned, redeemed, expired };
  }, [transactions]);

  // Group transactions by month
  const groupedTransactions = useMemo((): TransactionSection[] => {
    const groups: Record<string, TransactionSection['data']> = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(tx);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, data]) => {
        const date = new Date(data[0].createdAt);
        const title = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return { title, data };
      });
  }, [transactions]);

  // Flatten grouped data for FlatList with section headers
  const flatData = useMemo(() => {
    const items: Array<{ type: 'header'; title: string; id: string } | { type: 'transaction'; data: TransactionSection['data'][0]; id: string }> = [];

    groupedTransactions.forEach((section) => {
      items.push({ type: 'header', title: section.title, id: `header-${section.title}` });
      section.data.forEach((tx) => {
        items.push({ type: 'transaction', data: tx, id: tx.id });
      });
    });

    return items;
  }, [groupedTransactions]);

  const renderListHeader = () => (
    <View style={styles.headerContent}>
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              activeFilter === tab && styles.filterTabActive,
            ]}
            onPress={() => handleFilterChange(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab && styles.filterTabTextActive,
              ]}
            >
              {FILTER_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={20} color={colors.status.success} />
          <Text style={[styles.statValue, { color: 'rgb(22, 163, 74)' }]}>
            +{summaryStats.earned.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cart-outline" size={20} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.primary }]}>
            -{summaryStats.redeemed.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Redeemed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={20} color={colors.status.error} />
          <Text style={[styles.statValue, { color: colors.status.error }]}>
            -{summaryStats.expired.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Expired</Text>
        </View>
      </View>
    </View>
  );

  const renderListFooter = () => (
    <View style={styles.redemptionInfoCard}>
      <Text style={styles.redemptionInfoTitle}>Points Redemption Info</Text>
      <View style={styles.redemptionInfoList}>
        <Text style={styles.redemptionInfoItem}>{'\u2022'}  100 points = $1 discount</Text>
        <Text style={styles.redemptionInfoItem}>{'\u2022'}  Minimum 100 points to redeem</Text>
        <Text style={styles.redemptionInfoItem}>{'\u2022'}  Points expire 12 months after earning</Text>
        <Text style={styles.redemptionInfoItem}>{'\u2022'}  Only valid on "Powered by DoHuub" services</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: (typeof flatData)[number] }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.monthHeader}>
          <Text style={styles.monthTitle}>{item.title}</Text>
        </View>
      );
    }

    const tx = item.data;
    const iconConfig = TRANSACTION_ICONS[tx.type] || TRANSACTION_ICONS.EARNED;
    const isPositive = tx.type === 'EARNED' || tx.type === 'REFERRAL' || tx.type === 'BONUS';
    const badgeColors = getBadgeColors(tx.type);
    const badgeLabel = TRANSACTION_LABELS[tx.type] || 'Earned';

    return (
      <View style={styles.transactionItem}>
        <View style={[styles.txIconContainer, { backgroundColor: iconConfig.color + '15' }]}>
          <Ionicons name={iconConfig.name} size={18} color={iconConfig.color} />
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txDescription} numberOfLines={1}>
            {tx.description}
          </Text>
          <View style={styles.txBadgeDateRow}>
            <View style={[styles.txBadge, { backgroundColor: badgeColors.bg }]}>
              <Text style={[styles.txBadgeText, { color: badgeColors.text }]}>
                {badgeLabel}
              </Text>
            </View>
            <Text style={styles.txBadgeDot}>{'\u2022'}</Text>
            <Text style={styles.txDate}>
              {new Date(tx.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.txPoints,
            { color: isPositive ? colors.status.success : colors.status.error },
          ]}
        >
          {isPositive ? '+' : '-'}{Math.abs(tx.amount).toLocaleString()}
        </Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <EmptyState
      icon="receipt-outline"
      title="No transactions found"
      message={
        activeFilter === 'All'
          ? 'Your points history will appear here once you start earning.'
          : `No ${FILTER_LABELS[activeFilter].toLowerCase()} transactions found.`
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Points History" showBack />

      <FlatList
        data={flatData}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={flatData.length > 0 ? renderListFooter : null}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  headerContent: {
    marginBottom: spacing.sm,
  },

  // Filter Tabs
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.muted,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: colors.text.inverse,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.border.light,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },

  // Month Headers
  monthHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.muted,
  },
  monthTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Transaction Items
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.surface,
  },
  txIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txDescription: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  txBadgeDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  txBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  txBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  txBadgeDot: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
  txDate: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
  txPoints: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  // Redemption Info
  redemptionInfoCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.thin,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  redemptionInfoTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: 'rgb(180, 83, 9)',
    marginBottom: spacing.sm,
  },
  redemptionInfoList: {
    gap: 6,
  },
  redemptionInfoItem: {
    fontSize: fontSize.xs,
    color: 'rgb(146, 64, 14)',
    lineHeight: 18,
  },

  // List
  listContent: {
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
});
