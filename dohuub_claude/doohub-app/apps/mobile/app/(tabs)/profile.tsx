import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { useRewardsStore } from '../../src/store/rewardsStore';
import api from '../../src/services/api';
import { ENDPOINTS } from '../../src/constants/api';
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
} from '../../src/lib/notificationPrefs';

/* ───────── colours (hardcoded, no theme import) ───────── */
const C = {
  bg: '#F0F7FF',
  white: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  primary: '#2E7AD9',
  iconBg: '#E8F1FC',
  destructive: '#EF4444',
  destructiveBg: '#FEE2E2',
  border: 'rgba(46, 122, 217, 0.08)',
  divider: 'rgba(46, 122, 217, 0.15)',
  switchOff: '#CBD5E1',
  overlay: 'rgba(0,0,0,0.45)',
};

/* ───────── menu data ───────── */
interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  toggle?: boolean;
}

const REWARDS_ITEMS: MenuItem[] = [
  { id: 'rewards', label: 'Rewards Wallet', icon: 'gift-outline', route: '/rewards' },
  { id: 'referral', label: 'Refer a Friend', icon: 'people-outline', route: '/rewards/referral' },
];

const GENERAL_ITEMS: MenuItem[] = [
  { id: 'addresses', label: 'Saved Addresses', icon: 'location-outline', route: '/profile/addresses' },
  { id: 'payment', label: 'Payment Methods', icon: 'card-outline', route: '/profile/payment-methods' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline', toggle: true },
  { id: 'help', label: 'Help & Support', icon: 'help-circle-outline', route: '/profile/help' },
  { id: 'terms', label: 'Terms of Service', icon: 'shield-outline', route: '/profile/terms' },
  { id: 'privacy', label: 'Privacy Policy', icon: 'shield-outline', route: '/profile/privacy' },
];

const BOTTOM_ITEMS: MenuItem[] = [
  { id: 'about', label: 'About DoHuub', icon: 'information-circle-outline', route: '/profile/about' },
];

/* ═══════════════════════════════════════════════════════════
   LOG OUT MODAL  (centered card, not bottom sheet)
   ═══════════════════════════════════════════════════════════ */
function LogOutModal({
  visible,
  onClose,
  onConfirm,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={modal.overlay} activeOpacity={1} onPress={onClose}>
        <View style={modal.card} onStartShouldSetResponder={() => true}>
          {/* Header bar */}
          <View style={modal.headerBar}>
            <Text style={modal.headerBarTitle}>Log Out</Text>
            <TouchableOpacity onPress={onClose} style={modal.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={modal.cardBody}>
            {/* Icon */}
            <View style={modal.iconCircleBlue}>
              <Ionicons name="log-out-outline" size={32} color={C.primary} />
            </View>

            {/* Text */}
            <Text style={modal.subtitle}>Are you sure you want to log out?</Text>
            <Text style={modal.body}>
              You will need to log in again to access your account and bookings.
            </Text>

            {/* Buttons stacked */}
            <TouchableOpacity
              style={[modal.btnFull, { backgroundColor: C.primary }]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={modal.btnFullText}>Yes, Log Out</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={modal.btnFullOutline} onPress={onClose}>
              <Text style={modal.btnFullOutlineText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   DELETE ACCOUNT MODAL  (centered card with password input)
   ═══════════════════════════════════════════════════════════ */
function DeleteAccountModal({
  visible,
  onClose,
  onConfirm,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const handleClose = () => { onClose(); };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity style={modal.overlay} activeOpacity={1} onPress={handleClose}>
        <View style={modal.card} onStartShouldSetResponder={() => true}>
          {/* Header bar */}
          <View style={[modal.headerBar, { borderBottomColor: 'rgba(239, 68, 68, 0.2)' }]}>
            <Text style={modal.headerBarTitle}>Delete Account</Text>
            <TouchableOpacity onPress={handleClose} style={modal.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={modal.cardBody}>
            {/* Icon */}
            <View style={modal.iconCircleRed}>
              <Ionicons name="trash-outline" size={32} color={C.destructive} />
            </View>

            {/* Text */}
            <Text style={modal.subtitle}>Delete Your Account?</Text>
            <Text style={modal.body}>
              This action cannot be undone. All your data will be permanently deleted.
            </Text>

            {/* Warning Box */}
            <View style={modal.warningBox}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Ionicons name="warning-outline" size={20} color={C.destructive} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={modal.warningTitle}>You will lose:</Text>
                  <Text style={modal.warningItem}>• All your saved addresses</Text>
                  <Text style={modal.warningItem}>• Payment methods</Text>
                  <Text style={modal.warningItem}>• Order history</Text>
                  <Text style={modal.warningItem}>• Bookings and preferences</Text>
                  <Text style={modal.warningItem}>• Account information</Text>
                </View>
              </View>
            </View>

            {/* Buttons stacked */}
            <TouchableOpacity
              style={[modal.btnFull, { backgroundColor: C.destructive }]}
              onPress={() => onConfirm()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={modal.btnFullText}>Yes, Delete My Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={modal.btnFullOutline} onPress={handleClose}>
              <Text style={modal.btnFullOutlineText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROFILE SCREEN
   ═══════════════════════════════════════════════════════════ */
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

  // Load + persist the master notifications toggle. This drives `pushNotifications`
  // on the shared NotificationSettings, so the granular screen stays in sync.
  useEffect(() => {
    loadNotificationPrefs().then((p) => setNotificationsEnabled(p.pushNotifications));
  }, []);

  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    const current = await loadNotificationPrefs();
    await saveNotificationPrefs({ ...current, pushNotifications: value });
  };

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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    console.log('[DeleteAccount] start', {
      userId: user?.id,
      email: user?.email,
      endpoint: ENDPOINTS.USERS.ME,
      confirm: 'DELETE',
    });
    try {
      const result = await api.delete(ENDPOINTS.USERS.ME, { confirm: 'DELETE' });
      console.log('[DeleteAccount] API success', result);
      // The server has anonymized the account; tear down the local session too.
      await logout();
      console.log('[DeleteAccount] local logout complete');
      setShowDeleteModal(false);
      router.replace('/(auth)/welcome');
    } catch (err: any) {
      console.error('[DeleteAccount] failed', {
        message: err?.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        url: err?.config?.url,
        method: err?.config?.method,
        hasAuthHeader: Boolean(err?.config?.headers?.Authorization || err?.config?.headers?.authorization),
      });
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'We could not delete your account right now. Please try again or contact support.';
      Alert.alert('Delete failed', msg);
    } finally {
      setIsDeleting(false);
      console.log('[DeleteAccount] finished (isDeleting=false)');
    }
  };

  const nav = (route: string) => router.push(route as any);

  /* ── render a single menu row ── */
  const renderRow = (item: MenuItem, isLast: boolean) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, !isLast && styles.menuItemBorder]}
      onPress={() => {
        if (item.toggle) return;
        if (item.route) nav(item.route);
      }}
      activeOpacity={item.toggle ? 1 : 0.7}
    >
      <View style={styles.menuIconCircle}>
        <Ionicons name={item.icon} size={20} color={item.toggle ? C.muted : C.primary} />
      </View>
      <Text style={styles.menuLabel}>{item.label}</Text>

      {item.id === 'rewards' && wallet && wallet.totalPoints > 0 && (
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsBadgeText}>{wallet.totalPoints.toLocaleString()} pts</Text>
        </View>
      )}

      {item.toggle ? (
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
          trackColor={{ false: '#CBD5E1', true: '#2E7AD9' }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={C.muted} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Profile card — horizontal row matching boss ── */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Image
              source={
                user?.profile?.avatar
                  ? { uri: user.profile.avatar }
                  : require('../../assets/placeholder-image.jpeg')
              }
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {[user?.profile?.firstName, user?.profile?.lastName]
                .filter((part) => Boolean(part && String(part).trim()))
                .join(' ') || 'Your Name'}
            </Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
            <TouchableOpacity onPress={() => nav('/profile/edit')}>
              <Text style={styles.editLink}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── All menu rows — flat, no card wrapping, matching boss ── */}
        {REWARDS_ITEMS.map((item, i) => renderRow(item, false))}
        {GENERAL_ITEMS.map((item, i) => renderRow(item, false))}
        {BOTTOM_ITEMS.map((item) => renderRow(item, false))}

        {/* Log Out */}
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemBorder]}
          onPress={() => setShowLogoutModal(true)}
        >
          <View style={styles.menuIconCircle}>
            <Ionicons name="log-out-outline" size={20} color={C.muted} />
          </View>
          <Text style={styles.menuLabel}>Log Out</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowDeleteModal(true)}
        >
          <View style={[styles.menuIconCircle, { backgroundColor: C.destructiveBg }]}>
            <Ionicons name="trash-outline" size={20} color={C.destructive} />
          </View>
          <Text style={[styles.menuLabel, { color: C.destructive }]}>Delete Account</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Modals ── */}
      <LogOutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={isLoggingOut}
      />
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={isDeleting}
      />
    </SafeAreaView>
  );
}

/* ═══════════════════════════════════════════════════════════
   STYLES — main screen
   ═══════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: C.text,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  /* profile — horizontal row matching boss */
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: C.primary,
    overflow: 'hidden',
    backgroundColor: C.iconBg,
    flexShrink: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: C.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: C.muted,
    marginBottom: 6,
  },
  editLink: {
    fontSize: 14,
    fontWeight: '500',
    color: C.primary,
    textDecorationLine: 'underline',
  },

  /* cards / rows */
  card: {
    backgroundColor: C.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 0,
    gap: 12,
  },
  menuItemBorder: {},
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: C.text,
  },
  pointsBadge: {
    backgroundColor: C.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginRight: 4,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

/* ═══════════════════════════════════════════════════════════
   STYLES — modals (shared)
   ═══════════════════════════════════════════════════════════ */
const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  headerBarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeBtn: {
    padding: 4,
  },
  cardBody: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  iconCircleBlue: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F1FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleRed: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  warningBox: {
    width: '100%',
    backgroundColor: 'rgba(254, 226, 226, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 8,
  },
  warningItem: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 22,
  },
  btnFull: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  btnFullText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  btnFullOutline: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  btnFullOutlineText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
});
