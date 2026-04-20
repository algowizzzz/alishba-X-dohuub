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
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.howItWorksTitle}>How it Works</Text>

          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Ionicons name="people" size={16} color="rgb(126, 34, 206)" />
            </View>
            <View style={styles.stepTextGroup}>
              <Text style={styles.stepTitle}>Share your code</Text>
              <Text style={styles.stepDescription}>Send your unique code to friends</Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Ionicons name="checkmark-circle" size={16} color="rgb(126, 34, 206)" />
            </View>
            <View style={styles.stepTextGroup}>
              <Text style={styles.stepTitle}>They sign up & order</Text>
              <Text style={styles.stepDescription}>Friend joins and completes their first order</Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Ionicons name="gift" size={16} color="rgb(126, 34, 206)" />
            </View>
            <View style={styles.stepTextGroup}>
              <Text style={styles.stepTitle}>You both get rewarded!</Text>
              <Text style={styles.stepDescription}>
                <Text style={styles.stepBold}>You get 60 pts</Text>
                {' \u2022 '}
                <Text style={styles.stepBold}>They get 35 pts</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Referral Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#E0EDFF' }]}>
            <Text style={[styles.statValue, { color: '#1E293B' }]}>{totalReferrals}</Text>
            <Text style={[styles.statLabel, { color: '#64748B' }]}>Total Referrals</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
            <Text style={[styles.statValue, { color: 'rgb(217, 119, 6)' }]}>{pendingReferrals}</Text>
            <Text style={[styles.statLabel, { color: 'rgb(217, 119, 6)' }]}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
            <Text style={[styles.statValue, { color: 'rgb(22, 163, 74)' }]}>{pointsFromReferrals.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: 'rgb(22, 163, 74)' }]}>Points Earned</Text>
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

  // How It Works — simplified: no step numbers/connectors, just icon circles + text
  howItWorks: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(126, 34, 206)',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  stepIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  stepTextGroup: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgb(88, 28, 135)',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgb(126, 34, 206)',
    lineHeight: 20,
  },
  stepBold: {
    fontWeight: '600',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
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
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
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
