import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastBookingDate?: string | null;
}

const MILESTONES = [
  { weeks: 4, pts: '+25' },
  { weeks: 8, pts: '50 pts' },
  { weeks: 12, pts: '75 pts' },
  { weeks: 16, pts: '100 pts' },
];

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  const targetWeeks = 8;
  const progress = Math.min(currentStreak / targetWeeks, 1);
  const weeksLeft = Math.max(targetWeeks - currentStreak, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="flame" size={20} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.title}>Activity Streak</Text>
          <Text style={styles.subtitle}>Keep ordering to earn bonus points!</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <View style={styles.statInner}>
            <Ionicons name="flame" size={20} color="#F97316" />
            <Text style={styles.statValue}>{currentStreak}</Text>
          </View>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <View style={styles.statInner}>
            <Ionicons name="trophy" size={20} color="#F59E0B" />
            <Text style={styles.statValue}>{longestStreak}</Text>
          </View>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Progress to {targetWeeks} weeks</Text>
          <Text style={styles.progressPts}>+50 pts</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <Text style={styles.weeksLeft}>{weeksLeft} more week{weeksLeft !== 1 ? 's' : ''} to go</Text>
      </View>

      {/* Milestone Dots */}
      <View style={styles.milestonesRow}>
        {MILESTONES.map((m, i) => {
          const reached = currentStreak >= m.weeks;
          return (
            <View key={m.weeks} style={styles.milestoneItem}>
              <View style={[styles.milestoneDot, reached && styles.milestoneDotActive]}>
                <Text style={[styles.milestoneDotText, reached && styles.milestoneDotTextActive]}>
                  {m.weeks}w
                </Text>
              </View>
              <Text style={[styles.milestonePts, reached && styles.milestonePtsActive]}>{m.pts}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.tip}>
        Order from any Powered by DoHuub service each week to maintain your streak
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7ED',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FED7AA',
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
    backgroundColor: '#F97316',
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.xl,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#92400E',
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: '#B45309',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#FED7AA',
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: fontSize.sm,
    color: '#92400E',
  },
  progressPts: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#F97316',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#FED7AA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 4,
  },
  weeksLeft: {
    fontSize: fontSize.xs,
    color: '#B45309',
    marginTop: 2,
  },
  milestonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  milestoneItem: {
    alignItems: 'center',
    gap: 4,
  },
  milestoneDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FED7AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneDotActive: {
    backgroundColor: '#F97316',
  },
  milestoneDotText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
  },
  milestoneDotTextActive: {
    color: '#FFFFFF',
  },
  milestonePts: {
    fontSize: 10,
    color: '#B45309',
  },
  milestonePtsActive: {
    color: '#F97316',
    fontWeight: '600',
  },
  tip: {
    fontSize: fontSize.xs,
    color: '#B45309',
    textAlign: 'center',
    lineHeight: 16,
  },
});
