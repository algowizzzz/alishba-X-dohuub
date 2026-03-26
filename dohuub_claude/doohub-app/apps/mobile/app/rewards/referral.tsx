import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { useRewardsStore } from '../../src/store/rewardsStore';
import { useAuthStore } from '../../src/store/authStore';

/**
 * Referral Screen
 * - Hero section with gift icon
 * - Referral code display with copy button
 * - Share & Copy Link buttons (purple theme)
 * - "How it Works" 3-step guide (purple theme)
 * - Stats: total referrals, pending, points earned (colored cards)
 * - Referral history list with initial avatars & status badges
 * - Pull-to-refresh
 */

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'Pending', bg: '#FEF3C7', text: '#92400E' },
  SIGNED_UP: { label: 'Signed Up', bg: colors.status.infoLight, text: colors.status.info },
  COMPLETED: { label: 'Completed', bg: colors.status.successLight, text: colors.status.success },
  EXPIRED: { label: 'Expired', bg: colors.secondary, text: colors.text.muted },
};

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: 'share-social' as keyof typeof Ionicons.glyphMap,
    title: 'Share your code',
    description: 'Send your unique referral code to friends and family.',
  },
  {
    step: 2,
    icon: 'person-add' as keyof typeof Ionicons.glyphMap,
    title: 'Friend signs up & books',
    description: 'Your friend creates an account and completes their first booking.',
  },
  {
    step: 3,
    icon: 'gift' as keyof typeof Ionicons.glyphMap,
    title: 'You get 60 pts',
    description: 'They get 35 pts',
  },
];

export default function ReferralScreen() {
  const { user } = useAuthStore();
  const { referrals, isLoading, fetchReferrals } = useRewardsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralCode = (user?.id || 'DOHUUB00').substring(0, 8).toUpperCase();

  const loadData = useCallback(async () => {
    await fetchReferrals();
  }, [fetchReferrals]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`https://dohuub.com/refer/${referralCode}`);
    Alert.alert('Copied!', 'Referral link copied to clipboard.');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join DoHuub and get 500 bonus points! Use my referral code: ${referralCode}\n\nDownload the app and sign up to get started.`,
        title: 'Join DoHuub',
      });
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Unable to share. Please try again.');
      }
    }
  };

  // Stats calculations
  const totalReferrals = referrals.length;
  const pendingReferrals = referrals.filter(
    (r) => r.status === 'PENDING' || r.status === 'SIGNED_UP'
  ).length;
  const pointsFromReferrals = referrals
    .filter((r) => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.pointsEarned, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Refer a Friend" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="gift" size={40} color="rgb(147, 51, 234)" />
          </View>
          <Text style={styles.heroTitle}>Share & Earn Points</Text>
          <Text style={styles.heroSubtitle}>
            Invite friends to DoHuub and you both earn rewards!
          </Text>
        </View>

        {/* Referral Code Card */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={20}
                color={copied ? colors.status.success : colors.primary}
              />
              <Text style={[styles.copyText, copied && { color: colors.status.success }]}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Share & Copy Link Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-social" size={20} color={colors.text.inverse} />
              <Text style={styles.shareButtonText}>Share Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.copyLinkButton} onPress={handleCopyLink}>
              <Ionicons name="copy-outline" size={20} color={colors.text.primary} />
              <Text style={styles.copyLinkButtonText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorks}>
          <Text style={styles.howItWorksTitle}>How it Works</Text>
          {HOW_IT_WORKS.map((step, index) => (
            <View key={step.step} style={styles.stepItem}>
              <View style={styles.stepLeft}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </View>
                {index < HOW_IT_WORKS.length - 1 && <View style={styles.stepConnector} />}
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepIconContainer}>
                  <Ionicons name={step.icon} size={20} color="rgb(126, 34, 206)" />
                </View>
                <View style={styles.stepTextGroup}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Referral Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardTotal]}>
            <Text style={styles.statValue}>{totalReferrals}</Text>
            <Text style={styles.statLabel}>Total Referrals</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPending]}>
            <Text style={[styles.statValue, { color: 'rgb(217, 119, 6)' }]}>
              {pendingReferrals}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPoints]}>
            <Text style={[styles.statValue, { color: 'rgb(22, 163, 74)' }]}>
              {pointsFromReferrals.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>
        </View>

        {/* Referral History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Referral History</Text>

          {referrals.length > 0 ? (
            referrals.map((referral) => {
              const statusConfig = STATUS_CONFIG[referral.status] || STATUS_CONFIG.PENDING;
              const displayName = referral.refereeUserId || referral.referralCode || '?';
              const initial = displayName[0].toUpperCase();

              return (
                <View key={referral.id} style={styles.referralItem}>
                  <View style={styles.referralIconContainer}>
                    <Text style={styles.referralInitial}>{initial}</Text>
                  </View>
                  <View style={styles.referralInfo}>
                    <Text style={styles.referralEmail} numberOfLines={1}>
                      {referral.referralCode}
                    </Text>
                    <Text style={styles.referralDate}>
                      {new Date(referral.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={styles.referralRight}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusConfig.bg },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: statusConfig.text }]}>
                        {statusConfig.label}
                      </Text>
                    </View>
                    {referral.pointsEarned > 0 && (
                      <Text style={styles.referralPoints}>
                        +{referral.pointsEarned}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={40} color={colors.text.muted} />
              <Text style={styles.emptyTitle}>No referrals yet</Text>
              <Text style={styles.emptySubtitle}>
                Share your code and start earning bonus points!
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Code Card
  codeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: borderWidth.default,
    borderColor: colors.border.light,
    padding: spacing.lg,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  codeText: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 3,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
  },
  copyText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.primary,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgb(147, 51, 234)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
  },
  shareButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  copyLinkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.border.default,
  },
  copyLinkButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },

  // How It Works
  howItWorks: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: borderRadius.xl,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(147, 51, 234, 0.2)',
    padding: spacing.lg,
  },
  howItWorksTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: 'rgb(126, 34, 206)',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: 'rgb(126, 34, 206)',
  },
  stepConnector: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    marginTop: spacing.xs,
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  stepIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextGroup: {
    flex: 1,
  },
  stepTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: 'rgb(88, 28, 135)',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: fontSize.sm,
    color: 'rgb(126, 34, 206)',
    lineHeight: 20,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statCardTotal: {
    backgroundColor: colors.secondary,
  },
  statCardPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  statCardPoints: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // History Section
  historySection: {
    marginTop: spacing.lg,
  },

  // Referral Item
  referralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  referralIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralInitial: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
  referralInfo: {
    flex: 1,
  },
  referralEmail: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  referralDate: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
  referralRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  referralPoints: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.status.success,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
