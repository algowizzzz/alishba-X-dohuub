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
import { router } from 'expo-router';
import { useRewardsStore } from '../../src/store/rewardsStore';

/**
 * Points History Screen — matches boss wireframe (PointsHistoryScreen.tsx)
 *
 * Layout order (top-to-bottom):
 *  1. Glassmorphic header with back pill + "Points History"
 *  2. Summary stats grid (Total Earned / Redeemed / Expired)
 *  3. Filter tabs: All | Earned | Redeemed | Expired (horizontal pills)
 *  4. Transactions grouped by month — each item is a card with shadow
 *  5. Points Redemption Info footer card
 */

const FILTER_TABS: { key: string; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'EARNED', label: 'Earned' },
  { key: 'REDEEMED', label: 'Redeemed' },
  { key: 'EXPIRED', label: 'Expired' },
];

const TRANSACTION_LABELS: Record<string, string> = {
  EARNED: 'Earned',
  REDEEMED: 'Redeemed',
  EXPIRED: 'Expired',
  REFERRAL: 'Referral Bonus',
  BONUS: 'Sign-up Bonus',
};

const TRANSACTION_ICONS: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  EARNED: { name: 'trending-up', color: 'rgb(34, 197, 94)' },
  REDEEMED: { name: 'trending-down', color: '#2E7AD9' },
  EXPIRED: { name: 'time', color: '#EF4444' },
  REFERRAL: { name: 'people', color: 'rgb(147, 51, 234)' },
  BONUS: { name: 'gift', color: 'rgb(245, 158, 11)' },
};

const getTransactionColor = (type: string) => {
  switch (type) {
    case 'EARNED':
    case 'REFERRAL':
    case 'BONUS':
      return 'rgb(22, 163, 74)';
    case 'REDEEMED':
      return '#2E7AD9';
    case 'EXPIRED':
      return '#EF4444';
    default:
      return '#64748B';
  }
};

const getBadgeStyle = (type: string) => {
  switch (type) {
    case 'EARNED':
    case 'REFERRAL':
    case 'BONUS':
      return { bg: 'rgba(34, 197, 94, 0.1)', text: 'rgb(22, 163, 74)' };
    case 'REDEEMED':
      return { bg: 'rgba(46, 122, 217, 0.1)', text: '#2E7AD9' };
    case 'EXPIRED':
      return { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' };
    default:
      return { bg: '#E8F1FC', text: '#64748B' };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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
    const items: Array<
      | { type: 'header'; title: string; id: string }
      | { type: 'transaction'; data: TransactionSection['data'][0]; id: string }
    > = [];

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
      {/* Summary Stats — above filter tabs per boss wireframe */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: 'rgb(22, 163, 74)' }]}>
            +{summaryStats.earned.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#2E7AD9' }]}>
            -{summaryStats.redeemed.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Redeemed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>
            -{summaryStats.expired.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Expired</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              activeFilter === tab.key && styles.filterTabActive,
            ]}
            onPress={() => handleFilterChange(tab.key)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab.key && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
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
    const badgeStyle = getBadgeStyle(tx.type);
    const badgeLabel = TRANSACTION_LABELS[tx.type] || 'Transaction';
    const pointsColor = getTransactionColor(tx.type);

    return (
      <View style={styles.transactionCard}>
        {/* Icon circle */}
        <View style={[styles.txIconCircle, { backgroundColor: '#F0F7FF' }]}>
          <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
        </View>

        {/* Content */}
        <View style={styles.txContent}>
          {/* Top row: description + points */}
          <View style={styles.txTopRow}>
            <Text style={styles.txDescription} numberOfLines={1}>
              {tx.description}
            </Text>
            <Text style={[styles.txPoints, { color: pointsColor }]}>
              {tx.amount > 0 ? '+' : ''}{tx.amount} pts
            </Text>
          </View>

          {/* Bottom row: badge + dot + date */}
          <View style={styles.txBottomRow}>
            <View style={[styles.txBadge, { backgroundColor: badgeStyle.bg }]}>
              <Text style={[styles.txBadgeText, { color: badgeStyle.text }]}>
                {badgeLabel}
              </Text>
            </View>
            <Text style={styles.txDot}>{'\u2022'}</Text>
            <Text style={styles.txDate}>{formatDate(tx.createdAt)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="gift" size={32} color="#64748B" />
      </View>
      <Text style={styles.emptyTitle}>No transactions found</Text>
      <Text style={styles.emptySubtitle}>
        {activeFilter === 'All'
          ? 'Start earning points on Powered by DoHuub services!'
          : `No ${FILTER_TABS.find((t) => t.key === activeFilter)?.label.toLowerCase()} transactions yet`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Glassmorphic Header */}
      <View style={styles.glassHeader}>
        <TouchableOpacity
          style={styles.backPill}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Points History</Text>
      </View>

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
    backgroundColor: '#F0F7FF',
  },

  // Glassmorphic Header
  glassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
    gap: 16,
  },
  backPill: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },

  headerContent: {
    marginBottom: 8,
  },

  // Summary Stats Grid — above filters per wireframe
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  // Filter Tabs
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#E8F1FC',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#2E7AD9',
    shadowColor: 'rgba(46, 122, 217, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  filterTabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },

  // Month Headers
  monthHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },

  // Transaction Cards — individual cards with shadow per wireframe
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  txIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  txContent: {
    flex: 1,
  },
  txTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  txDescription: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  txPoints: {
    fontSize: 15,
    fontWeight: '600',
  },
  txBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  txBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  txBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  txDot: {
    fontSize: 12,
    color: '#64748B',
  },
  txDate: {
    fontSize: 14,
    color: '#64748B',
  },

  // Redemption Info
  redemptionInfoCard: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  redemptionInfoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgb(180, 83, 9)',
    marginBottom: 8,
  },
  redemptionInfoList: {
    gap: 4,
  },
  redemptionInfoItem: {
    fontSize: 14,
    color: 'rgb(146, 64, 14)',
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  // List
  listContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
});
