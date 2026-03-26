import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader, StreakCard, MilestoneProgressCard } from '../../src/components/composite';
import { useRewardsStore } from '../../src/store/rewardsStore';

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'EARNED', description: 'Deep House Cleaning', vendor: 'Sparkle Clean Co.', date: 'Dec 5', amount: 125 },
  { id: '2', type: 'REDEEMED', description: 'Discount on Food Order', vendor: 'The Golden Spoon', date: 'Dec 1', amount: -500 },
  { id: '3', type: 'REFERRAL', description: 'Referral bonus - John D. co...', vendor: '', date: 'Nov 28', amount: 60 },
  { id: '4', type: 'EARNED', description: 'Food Order', vendor: 'Sushi Paradise', date: 'Nov 25', amount: 89 },
  { id: '5', type: 'EARNED', description: 'Grocery Order', vendor: 'Organic Market', date: 'Nov 22', amount: 156 },
];

const TX_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  EARNED: 'trending-up',
  REDEEMED: 'trending-down',
  REFERRAL: 'people-outline',
  EXPIRED: 'time-outline',
  BONUS: 'star-outline',
};

export default function RewardsWalletScreen() {
  const {
    wallet,
    streak,
    milestones,
    transactions,
    isLoading,
    fetchWallet,
    fetchStreak,
    fetchMilestones,
    fetchTransactions,
  } = useRewardsStore();

  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    await Promise.all([fetchWallet(), fetchStreak(), fetchMilestones(), fetchTransactions()]);
  }, [fetchWallet, fetchStreak, fetchMilestones, fetchTransactions]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const totalPoints = wallet?.totalPoints ?? 2450;
  const pendingPoints = wallet?.pendingPoints ?? 125;
  const expiringPoints = wallet?.expiringPoints ?? 150;
  const expiryDate = wallet?.expiringDate ? `by ${new Date(wallet.expiringDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'by Feb 15';
  const dollarValue = (totalPoints * 0.01).toFixed(2);

  const displayStreak = streak ?? { currentStreak: 6, longestStreak: 8, lastActiveWeek: null };
  const recentTx = transactions.length > 0 ? transactions.slice(0, 5) : MOCK_TRANSACTIONS;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Rewards Wallet" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Ionicons name="gift-outline" size={20} color="rgba(255,255,255,0.9)" />
            <Text style={styles.balanceLabel}>Available Points</Text>
          </View>
          <Text style={styles.balanceValue}>{totalPoints.toLocaleString()}</Text>
          <Text style={styles.balanceDollar}>≈ ${dollarValue} value</Text>
        </View>

        {/* Pending & Expiring */}
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownTop}>
              <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
              <Text style={styles.breakdownTopLabel}>Pending</Text>
            </View>
            <Text style={styles.breakdownValue}>{pendingPoints.toLocaleString()}</Text>
            <Text style={styles.breakdownSub}>pts</Text>
          </View>
          <View style={[styles.breakdownCard, styles.breakdownCardExpiring]}>
            <View style={styles.breakdownTop}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.status.error} />
              <Text style={[styles.breakdownTopLabel, { color: colors.status.error }]}>Expiring Soon</Text>
            </View>
            <Text style={[styles.breakdownValue, { color: colors.status.error }]}>{expiringPoints.toLocaleString()}</Text>
            <Text style={[styles.breakdownSub, { color: colors.status.error }]}>{expiryDate}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickActionRefer} onPress={() => router.push('/rewards/referral')}>
            <Ionicons name="people-outline" size={18} color="rgb(147,51,234)" />
            <Text style={styles.quickActionReferText}>Refer &amp; Earn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionHistory} onPress={() => router.push('/rewards/history')}>
            <Ionicons name="time-outline" size={18} color={colors.text.primary} />
            <Text style={styles.quickActionHistoryText}>View History</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Streak */}
        <View style={styles.sectionSpacing}>
          <StreakCard
            currentStreak={displayStreak.currentStreak}
            longestStreak={displayStreak.longestStreak}
            lastBookingDate={displayStreak.lastActiveWeek}
          />
        </View>

        {/* Category Milestones */}
        <View style={styles.sectionSpacing}>
          <MilestoneProgressCard milestones={milestones} />
        </View>

        {/* How to Earn Points */}
        <View style={[styles.sectionSpacing, styles.earnBox]}>
          <Text style={styles.earnTitle}>How to Earn Points</Text>
          {[
            'Earn 1 point for every $1 spent on "Powered by DoHuub" services',
            'Get 60 bonus points when your referrals complete their first order',
            '100 points = $1 off your next order',
          ].map((tip, i) => (
            <View key={i} style={styles.earnRow}>
              <View style={styles.earnDot} />
              <Text style={styles.earnText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionSpacing}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/rewards/history')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTx.map((tx: any) => {
            const isPositive = tx.amount > 0;
            const icon = TX_ICON[tx.type] || 'trending-up';
            return (
              <View key={tx.id} style={styles.txRow}>
                <View style={styles.txIcon}>
                  <Ionicons name={icon} size={18} color={isPositive ? colors.primary : colors.status.error} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                  <Text style={styles.txMeta}>
                    {tx.date || new Date(tx.createdAt).toLocaleDateString()}
                    {tx.vendor ? ` • ${tx.vendor}` : ''}
                  </Text>
                </View>
                <Text style={[styles.txAmount, { color: isPositive ? colors.text.primary : colors.status.error }]}>
                  {isPositive ? '+' : ''}{tx.amount} pts
                </Text>
              </View>
            );
          })}
        </View>

        {/* Expiry Notice */}
        <View style={styles.expiryNotice}>
          <Text style={styles.expiryText}>
            Points expire 12 months after earning. Use them before they're gone!
          </Text>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg },

  // Balance Card
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingVertical: spacing.xl,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  balanceLabel: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.85)' },
  balanceValue: { fontSize: 40, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  balanceDollar: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.75)' },

  // Breakdown
  breakdownRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  breakdownCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.border.light,
    padding: spacing.md,
  },
  breakdownCardExpiring: { borderColor: '#FECACA', backgroundColor: '#FFF5F5' },
  breakdownTop: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  breakdownTopLabel: { fontSize: fontSize.xs, color: colors.text.secondary },
  breakdownValue: { fontSize: 24, fontWeight: '700', color: colors.text.primary },
  breakdownSub: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 2 },

  // Quick Actions
  quickActionsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  quickActionRefer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.md,
    backgroundColor: 'rgba(147,51,234,0.08)', borderWidth: borderWidth.default,
    borderColor: 'rgba(147,51,234,0.2)', borderRadius: borderRadius.lg,
  },
  quickActionReferText: { fontSize: fontSize.sm, fontWeight: '600', color: 'rgb(147,51,234)' },
  quickActionHistory: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.md,
    backgroundColor: colors.surface, borderWidth: borderWidth.default,
    borderColor: colors.border.default, borderRadius: borderRadius.lg,
  },
  quickActionHistoryText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },

  sectionSpacing: { marginTop: spacing.lg },

  // Earn Points
  earnBox: {
    backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A',
    borderRadius: borderRadius.lg, padding: spacing.lg,
  },
  earnTitle: { fontSize: fontSize.md, fontWeight: '700', color: '#B45309', marginBottom: spacing.md },
  earnRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'flex-start' },
  earnDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B', marginTop: 5 },
  earnText: { flex: 1, fontSize: fontSize.sm, color: '#B45309', lineHeight: 20 },

  // Recent Activity
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text.primary },
  viewAll: { fontSize: fontSize.sm, color: colors.primary, fontWeight: '500' },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.sm, borderBottomWidth: borderWidth.thin, borderBottomColor: colors.border.light,
  },
  txIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center',
  },
  txInfo: { flex: 1 },
  txDesc: { fontSize: fontSize.sm, fontWeight: '500', color: colors.text.primary },
  txMeta: { fontSize: fontSize.xs, color: colors.text.muted, marginTop: 2 },
  txAmount: { fontSize: fontSize.sm, fontWeight: '700' },

  // Expiry
  expiryNotice: {
    backgroundColor: colors.secondary, borderRadius: borderRadius.lg,
    padding: spacing.md, marginTop: spacing.md, alignItems: 'center',
  },
  expiryText: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center' },
});
