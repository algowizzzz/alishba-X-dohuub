import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRewardsStore } from '../../src/store/rewardsStore';
import { useAuthStore } from '../../src/store/authStore';

/**
 * Referral Screen — matches boss wireframe (ReferralScreen.tsx)
 *
 * Layout (top-to-bottom):
 *  1. Glassmorphic header with back pill + "Refer a Friend"
 *  2. Hero: purple gradient icon circle + "Share & Earn Points" + subtitle
 *  3. Referral Code card: code display (foreground color) + copy btn + Share/Copy Link buttons
 *  4. "How it Works" purple tinted card with 3 steps (icon circles, no step numbers)
 *  5. Stats grid: Total Referrals | Pending | Points Earned
 *  6. Referral History list
 */

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join DoHuub and get 35 bonus points! Use my referral code: ${referralCode}\n\nhttps://dohuub.com/refer/${referralCode}`,
        title: 'Join DoHuub!',
      });
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        handleCopyLink();
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* Glassmorphic Header */}
      <View style={styles.glassHeader}>
        <TouchableOpacity
          style={styles.backPill}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer a Friend</Text>
      </View>

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
            <TouchableOpacity style={styles.copyIconButton} onPress={handleCopyCode}>
              <Ionicons
                name={copied ? 'checkmark-circle' : 'copy-outline'}
                size={20}
                color={copied ? '#10B981' : '#64748B'}
              />
            </TouchableOpacity>
          </View>

          {/* Share & Copy Link Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-social" size={20} color="#ffffff" />
              <Text style={styles.shareButtonText}>Share Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.copyLinkButton} onPress={handleCopyLink}>
              <Ionicons name="copy-outline" size={20} color="#1E293B" />
              <Text style={styles.copyLinkButtonText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorks}>
          <View style={styles.howItWorksHeader}>
            <View style={styles.howItWorksHeaderIcon}>
              <Ionicons name="sparkles" size={18} color="#7E22CE" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.howItWorksTitle}>How it Works</Text>
              <Text style={styles.howItWorksSubtitle}>Earn rewards in 3 simple steps</Text>
            </View>
          </View>

          {[
            {
              step: '1',
              icon: 'share-social-outline' as const,
              title: 'Share your code',
              description: 'Send your unique code to friends',
            },
            {
              step: '2',
              icon: 'person-add-outline' as const,
              title: 'They sign up & order',
              description: 'Friend joins and completes their first order',
            },
            {
              step: '3',
              icon: 'gift-outline' as const,
              title: 'You both get rewarded!',
              description: 'You get 60 pts  •  They get 35 pts',
            },
          ].map((item, index, arr) => (
            <View key={item.step} style={styles.stepRow}>
              <View style={styles.stepRail}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{item.step}</Text>
                </View>
                {index < arr.length - 1 && <View style={styles.stepConnector} />}
              </View>
              <View style={[styles.stepCard, index === arr.length - 1 && styles.stepCardLast]}>
                <View style={styles.stepIconCircle}>
                  <Ionicons name={item.icon} size={16} color="#7E22CE" />
                </View>
                <View style={styles.stepTextGroup}>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDescription}>{item.description}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Referral Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <View style={[styles.statIconWrap, { backgroundColor: 'rgba(46, 122, 217, 0.15)' }]}>
              <Ionicons name="people" size={18} color="#2E7AD9" />
            </View>
            <Text
              style={[styles.statValue, { color: '#1E40AF' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {totalReferrals}
            </Text>
            <Text style={[styles.statLabel, { color: '#64748B' }]}>Total Referrals</Text>
          </View>

          <View style={[styles.statCard, styles.statCardAmber]}>
            <View style={[styles.statIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.18)' }]}>
              <Ionicons name="time" size={18} color="#D97706" />
            </View>
            <Text
              style={[styles.statValue, { color: '#D97706' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {pendingReferrals}
            </Text>
            <Text style={[styles.statLabel, { color: '#B45309' }]}>Pending</Text>
          </View>

          <View style={[styles.statCard, styles.statCardGreen]}>
            <View style={[styles.statIconWrap, { backgroundColor: 'rgba(34, 197, 94, 0.18)' }]}>
              <Ionicons name="star" size={18} color="#16A34A" />
            </View>
            <Text
              style={[styles.statValue, { color: '#16A34A' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {pointsFromReferrals.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: '#15803D' }]}>Points Earned</Text>
          </View>
        </View>

        {/* Referral History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Referral History</Text>

          {referrals.length > 0 ? (
            referrals.map((referral) => {
              const displayName = referral.refereeUserId || referral.referralCode || '?';
              const initial = displayName[0].toUpperCase();
              const isCompleted = referral.status === 'COMPLETED';

              return (
                <View key={referral.id} style={styles.referralItem}>
                  {/* Avatar */}
                  <View style={styles.referralAvatar}>
                    <Text style={styles.referralInitial}>{initial}</Text>
                  </View>

                  {/* Info */}
                  <View style={styles.referralInfo}>
                    <Text style={styles.referralName} numberOfLines={1}>
                      {referral.referralCode}
                    </Text>
                    <Text style={styles.referralDate}>
                      {formatDate(referral.createdAt)}
                    </Text>
                  </View>

                  {/* Status — matches wireframe: check+points or clock+pending */}
                  {isCompleted ? (
                    <View style={styles.statusCompleted}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.completedPoints}>+{referral.pointsEarned} pts</Text>
                    </View>
                  ) : (
                    <View style={styles.statusPending}>
                      <Ionicons name="time" size={16} color="rgb(245, 158, 11)" />
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#9ca3af" style={{ opacity: 0.5 }} />
              <Text style={styles.emptyTitle}>No referrals yet</Text>
              <Text style={styles.emptySubtitle}>Share your code to start earning!</Text>
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: 'rgb(147, 51, 234)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    // Gradient approximation
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },

  // Code Card
  codeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  codeLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 3,
  },
  copyIconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#E0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    // Purple gradient approximation
    backgroundColor: 'rgb(147, 51, 234)',
    shadowColor: 'rgb(147, 51, 234)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  copyLinkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  copyLinkButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },

  // How It Works
  howItWorks: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  howItWorksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(126, 34, 206, 0.2)',
  },
  howItWorksHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(147, 51, 234, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B21A8',
  },
  howItWorksSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#7E22CE',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  stepRail: {
    width: 28,
    alignItems: 'center',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7E22CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  stepConnector: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(126, 34, 206, 0.25)',
    marginVertical: 4,
    minHeight: 16,
  },
  stepCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.12)',
  },
  stepCardLast: {
    marginBottom: 0,
  },
  stepIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(147, 51, 234, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextGroup: {
    flex: 1,
    minWidth: 0,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#581C87',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 13,
    color: '#7E22CE',
    lineHeight: 18,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  statCardBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: 'rgba(46, 122, 217, 0.2)',
  },
  statCardAmber: {
    backgroundColor: '#FFFBEB',
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  statCardGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: 'rgba(34, 197, 94, 0.25)',
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },

  // History Section
  historySection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },

  // Referral Item — card style per wireframe
  referralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  referralAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0EDFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  referralInitial: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7AD9',
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  referralDate: {
    fontSize: 13,
    color: '#64748B',
  },
  statusCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  statusPending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pendingText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgb(217, 119, 6)',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    opacity: 0.7,
    marginTop: 4,
    textAlign: 'center',
  },
});
