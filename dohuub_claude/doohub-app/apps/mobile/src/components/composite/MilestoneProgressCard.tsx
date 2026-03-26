import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

interface Milestone {
  id: string;
  category: string;
  progress: number;
  total: number;
  pointsEarned?: number;
}

interface MilestoneProgressCardProps {
  milestones: Milestone[];
}

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  CLEANING: 'brush-outline',
  HANDYMAN: 'construct-outline',
  FOOD: 'fast-food-outline',
  GROCERIES: 'cart-outline',
  BEAUTY: 'cut-outline',
  RENTALS: 'home-outline',
  CAREGIVING: 'heart-outline',
};

const CATEGORY_LABELS: Record<string, string> = {
  CLEANING: 'Cleaning Services',
  HANDYMAN: 'Handyman Services',
  FOOD: 'Food Delivery',
  GROCERIES: 'Grocery Delivery',
  BEAUTY: 'Beauty Services',
  RENTALS: 'Rental Properties',
  CAREGIVING: 'Caregiving Services',
};

const MOCK_MILESTONES: Milestone[] = [
  { id: '1', category: 'CLEANING', progress: 2, total: 3 },
  { id: '2', category: 'HANDYMAN', progress: 0, total: 3 },
  { id: '3', category: 'FOOD', progress: 1, total: 3 },
  { id: '4', category: 'GROCERIES', progress: 2, total: 3 },
  { id: '5', category: 'BEAUTY', progress: 0, total: 3 },
  { id: '6', category: 'RENTALS', progress: 0, total: 3 },
  { id: '7', category: 'CAREGIVING', progress: 0, total: 3 },
];

export function MilestoneProgressCard({ milestones }: MilestoneProgressCardProps) {
  const data = milestones.length > 0 ? milestones : MOCK_MILESTONES;
  const achieved = data.filter((m) => m.progress >= m.total).length;
  const remaining = data.reduce((sum, m) => sum + Math.max(m.total - m.progress, 0), 0);
  const ptsEarned = data.reduce((sum, m) => sum + (m.pointsEarned || 0), 0) || 175;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="radio-button-on" size={20} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.title}>Category Milestones</Text>
          <Text style={styles.subtitle}>Complete orders to earn bonus points</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsBox}>
        <View style={styles.statItem}>
          <Text style={styles.statValueOrange}>{achieved}</Text>
          <Text style={styles.statLabel}>Achieved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValueDark}>{remaining}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValueGreen}>+{ptsEarned}</Text>
          <Text style={styles.statLabel}>Pts Earned</Text>
        </View>
      </View>

      {/* Category List */}
      {data.map((m) => {
        const icon = CATEGORY_ICONS[m.category] || 'star-outline';
        const label = CATEGORY_LABELS[m.category] || m.category;
        const dots = Array.from({ length: m.total }, (_, i) => i < m.progress);

        return (
          <TouchableOpacity key={m.id} style={styles.categoryRow}>
            <View style={styles.categoryIcon}>
              <Ionicons name={icon} size={18} color="#92400E" />
            </View>
            <Text style={styles.categoryLabel}>{label}</Text>
            <View style={styles.dotsRow}>
              {dots.map((filled, i) => (
                <View key={i} style={[styles.dot, filled && styles.dotFilled]} />
              ))}
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBEB',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: '#92400E',
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: '#B45309',
    marginTop: 2,
  },
  statsBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValueOrange: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: '#F59E0B',
  },
  statValueDark: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: '#1E293B',
  },
  statValueGreen: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: '#10B981',
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: '#B45309',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#FDE68A',
    marginVertical: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    gap: spacing.sm,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    color: '#92400E',
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FDE68A',
  },
  dotFilled: {
    backgroundColor: '#F59E0B',
  },
});
