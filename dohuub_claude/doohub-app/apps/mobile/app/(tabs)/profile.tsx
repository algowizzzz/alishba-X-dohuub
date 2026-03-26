import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useRewardsStore } from '../../src/store/rewardsStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { DeleteAccountModal, LogoutModal } from '../../src/components/modals';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: string;
  toggle?: boolean;
}

const REWARDS_ITEMS: MenuItem[] = [
  { id: 'rewards', label: 'Rewards Wallet', icon: 'gift-outline', route: '/rewards', badge: 'points' },
  { id: 'referral', label: 'Refer a Friend', icon: 'people-outline', route: '/rewards/referral' },
];

const GENERAL_ITEMS: MenuItem[] = [
  { id: 'addresses', label: 'Saved Addresses', icon: 'location-outline', route: '/profile/addresses' },
  { id: 'payment', label: 'Payment Methods', icon: 'card-outline', route: '/profile/payment-methods' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline', route: '', toggle: true },
  { id: 'help', label: 'Help & Support', icon: 'help-circle-outline', route: '/profile/help' },
  { id: 'terms', label: 'Terms of Service', icon: 'shield-outline', route: '/profile/terms' },
  { id: 'privacy', label: 'Privacy Policy', icon: 'shield-outline', route: '/profile/privacy' },
  { id: 'about', label: 'About DoHuub', icon: 'information-circle-outline', route: '/profile/about' },
];

/**
 * Profile screen matching wireframe:
 * - User info with avatar (80px, blue border) and Edit Profile link
 * - Flat menu list (rewards, addresses, payment, notifications, support, legal)
 * - Log Out and Delete Account items
 */
export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { wallet, fetchWallet } = useRewardsStore();

  React.useEffect(() => {
    fetchWallet();
  }, []);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      router.replace('/(auth)/welcome');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async (password: string) => {
    setIsDeleting(true);
    try {
      // TODO: Call delete account API with password
      // For now, just log out
      await logout();
      setShowDeleteModal(false);
      router.replace('/(auth)/welcome');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMenuItemPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            {user?.profile?.avatar ? (
              <Image source={{ uri: user.profile.avatar }} style={styles.avatarImage} />
            ) : (
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.avatarImage}
              />
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.profile?.firstName || 'Your'} {user?.profile?.lastName || 'Name'}
            </Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
            <TouchableOpacity onPress={() => handleMenuItemPress('/profile/edit')}>
              <Text style={styles.editProfileLink}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.menuList}>
          {REWARDS_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.route)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.badge === 'points' && wallet && wallet.totalPoints > 0 && (
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsBadgeText}>
                    {wallet.totalPoints.toLocaleString()} pts
                  </Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* General Menu Items */}
        <View style={styles.menuList}>
          {GENERAL_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => item.toggle ? null : handleMenuItemPress(item.route)}
              activeOpacity={item.toggle ? 1 : 0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={20} color={colors.text.secondary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.toggle ? (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.border.default, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
              )}
            </TouchableOpacity>
          ))}

          {/* Log Out */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowLogoutModal(true)}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.secondary }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.text.secondary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text.primary }]}>Log Out</Text>
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowDeleteModal(true)}
          >
            <View style={[styles.menuIconContainer, styles.deleteIconContainer]}>
              <Ionicons name="trash-outline" size={20} color={colors.status.error} />
            </View>
            <Text style={styles.deleteLabel}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Logout Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={isLoggingOut}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={isDeleting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.08)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  editProfileLink: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  menuList: {
    gap: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.xs,
    gap: spacing.md,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
  },
  pointsBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  pointsBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteIconContainer: {
    backgroundColor: colors.status.errorLight,
  },
  deleteLabel: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.status.error,
  },
});
