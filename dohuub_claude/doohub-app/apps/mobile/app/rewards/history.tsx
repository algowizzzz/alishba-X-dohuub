import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRewardsStore } from '../../src/store/rewardsStore';

type FilterKey = 'All' | 'EARNED' | 'REDEEMED' | 'EXPIRED';

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'EARNED', label: 'Earned' },
  { key: 'REDEEMED', label: 'Redeemed' },
  { key: 'EXPIRED', label: 'Expired' },
];

const EARNED_TYPES = new Set(['EARNED', 'REFERRAL', 'BONUS']);

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

const matchesFilter = (type: string, filter: FilterKey) => {
  if (filter === 'All') return true;
  if (filter === 'EARNED') return EARNED_TYPES.has(type);
  return type === filter;
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
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const { transactions, fetchTransactions } = useRewardsStore();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const filteredTransactions = useMemo(
    () => transactions.filter((tx) => matchesFilter(tx.type, activeFilter)),
    [transactions, activeFilter]
  );

  const summaryStats = useMemo(() => {
    const earned = transactions
      .filter((tx) => EARNED_TYPES.has(tx.type))
      .reduce((sum, tx) => sum + tx.amount, 0);
    const redeemed = transactions
      .filter((tx) => tx.type === 'REDEEMED')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const expired = transactions
      .filter((tx) => tx.type === 'EXPIRED')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    return { earned, redeemed, expired };
  }, [transactions]);

  const groupedTransactions = useMemo((): TransactionSection[] => {
    const groups: Record<string, TransactionSection['data']> = {};

    filteredTransactions.forEach((tx) => {
      const date = new Date(tx.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([, data]) => {
        const date = new Date(data[0].createdAt);
        const title = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return { title, data };
      });
  }, [filteredTransactions]);

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
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text
            style={[styles.statValue, { color: 'rgb(22, 163, 74)' }, isCompact && styles.statValueCompact]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            +{summaryStats.earned.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text
            style={[styles.statValue, { color: '#2E7AD9' }, isCompact && styles.statValueCompact]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            -{summaryStats.redeemed.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Redeemed</Text>
        </View>
        <View style={styles.statCard}>
          <Text
            style={[styles.statValue, { color: '#EF4444' }, isCompact && styles.statValueCompact]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            -{summaryStats.expired.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Total Expired</Text>
        </View>
      </View>
    </View>
  );

  const REDEMPTION_TIPS = [
    { icon: 'cash-outline' as const, text: '100 points = $1 discount' },
    { icon: 'lock-closed-outline' as const, text: 'Minimum 100 points to redeem' },
    { icon: 'time-outline' as const, text: 'Points expire 12 months after earning' },
    { icon: 'shield-checkmark-outline' as const, text: 'Only valid on “Powered by DoHuub” services' },
  ];

  const renderListFooter = () => (
    <View style={styles.redemptionInfoCard}>
      <View style={styles.redemptionInfoHeader}>
        <View style={styles.redemptionInfoIconWrap}>
          <Ionicons name="information-circle" size={22} color="#B45309" />
        </View>
        <View style={styles.redemptionInfoHeaderText}>
          <Text style={styles.redemptionInfoTitle}>Points Redemption Info</Text>
          <Text style={styles.redemptionInfoSubtitle}>How your rewards work</Text>
        </View>
      </View>

      <View style={styles.redemptionInfoList}>
        {REDEMPTION_TIPS.map((tip) => (
          <View key={tip.text} style={styles.redemptionInfoRow}>
            <View style={styles.redemptionTipIcon}>
              <Ionicons name={tip.icon} size={16} color="#B45309" />
            </View>
            <Text style={styles.redemptionInfoItem}>{tip.text}</Text>
          </View>
        ))}
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
    const iconConfig = TRANSACTION_ICONS[tx.type] || { name: 'gift' as const, color: '#64748B' };
    const badgeStyle = getBadgeStyle(tx.type);
    const badgeLabel = TRANSACTION_LABELS[tx.type] || 'Transaction';
    const pointsColor = getTransactionColor(tx.type);

    return (
      <View style={styles.transactionCard}>
        <View style={[styles.txIconCircle, { backgroundColor: '#F0F7FF' }]}>
          <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
        </View>

        <View style={styles.txContent}>
          <View style={styles.txTopRow}>
            <Text style={styles.txDescription} numberOfLines={1}>
              {tx.description}
            </Text>
            <Text style={[styles.txPoints, { color: pointsColor }]}>
              {tx.amount > 0 ? '+' : ''}{tx.amount} pts
            </Text>
          </View>

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
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.glassHeader}>
        <TouchableOpacity style={styles.backPill} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Points History</Text>
      </View>

      <View style={styles.filterWrap}>
        <View style={styles.filterTrack}>
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterTab, active && styles.filterTabActive]}
                onPress={() => setActiveFilter(tab.key)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isCompact && styles.filterTabTextCompact,
                    active && styles.filterTabTextActive,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
    backgroundColor: '#FFFFFF',
  },

  glassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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

  filterWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  filterTrack: {
    flexDirection: 'row',
    backgroundColor: '#E8F1FC',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: '#2E7AD9',
    shadowColor: 'rgba(46, 122, 217, 0.35)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  filterTabText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  filterTabTextCompact: {
    fontSize: 12,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },

  headerContent: {
    marginBottom: 8,
  },

  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
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
  statValueCompact: {
    fontSize: 15,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },

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

  transactionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
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
  },
  txContent: {
    flex: 1,
    minWidth: 0,
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
    flexWrap: 'wrap',
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

  redemptionInfoCard: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  redemptionInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(180, 83, 9, 0.2)',
  },
  redemptionInfoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redemptionInfoHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  redemptionInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
  },
  redemptionInfoSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#B45309',
  },
  redemptionInfoList: {
    gap: 10,
  },
  redemptionInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  redemptionTipIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  redemptionInfoItem: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    fontWeight: '500',
  },

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

  listContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
});
