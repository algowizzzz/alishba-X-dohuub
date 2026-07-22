import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal as RNModal,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  type: 'order' | 'promo' | 'update' | 'reminder' | 'points_earned' | 'booking' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  pointsAmount?: number;
}

interface NotificationsPanelProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_HEIGHT = Math.min(SCREEN_H * 0.78, 640);

const getNotificationIcon = (
  type: string
): { name: keyof typeof Ionicons.glyphMap; color: string; bg: string } => {
  switch (type) {
    case 'order':
    case 'booking':
      return { name: 'cube-outline', color: '#2E7AD9', bg: 'rgba(46, 122, 217, 0.1)' };
    case 'promo':
      return { name: 'notifications-outline', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)' };
    case 'update':
      return { name: 'checkmark-circle-outline', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' };
    case 'reminder':
      return { name: 'time-outline', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
    case 'points_earned':
      return { name: 'gift-outline', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
    default:
      return { name: 'information-circle-outline', color: '#64748B', bg: 'rgba(100, 116, 139, 0.1)' };
  }
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Placed Successfully',
    message:
      'Your cleaning service order #1234 has been placed and confirmed. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    timestamp: '2 minutes ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'promo',
    title: 'Special Offer: 20% Off',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Use code SAVE20 for your next grocery order. Sed do eiusmod tempor incididunt ut labore.',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: '4',
    type: 'order',
    title: 'Order In Progress',
    message:
      'Your beauty service appointment is currently in progress. The specialist will complete the service shortly.',
    timestamp: '2 hours ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'update',
    title: 'Order Completed',
    message:
      'Your order #1122 has been completed successfully. Please rate your experience with the service provider.',
    timestamp: '3 hours ago',
    isRead: true,
  },
  {
    id: '6',
    type: 'reminder',
    title: 'Upcoming Appointment Reminder',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Your handyman service is scheduled for tomorrow at 2:00 PM.',
    timestamp: '5 hours ago',
    isRead: true,
  },
  {
    id: '7',
    type: 'promo',
    title: 'Weekend Flash Sale',
    message:
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Get 30% off on all beauty services this weekend only.',
    timestamp: '1 day ago',
    isRead: true,
  },
];

/**
 * Notifications bottom sheet — slides up over the home screen (and tab bar).
 */
export function NotificationsPanel({ visible, onClose }: NotificationsPanelProps) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      presentationStyle="overFullScreen"
      hardwareAccelerated
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close notifications" />

        <View
          style={[
            styles.panel,
            {
              height: SHEET_HEIGHT,
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <Ionicons name="close" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            bounces
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="notifications-outline" size={40} color="#64748B" />
                </View>
                <Text style={styles.emptyTitle}>No notifications</Text>
                <Text style={styles.emptySubtitle}>You're all caught up!</Text>
              </View>
            ) : (
              notifications.map((notification) => {
                const icon = getNotificationIcon(notification.type);
                return (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationCard,
                      !notification.isRead && styles.notificationCardUnread,
                    ]}
                    onPress={() => handleMarkAsRead(notification.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notificationRow}>
                      <View style={styles.iconWrapper}>
                        <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
                          <Ionicons name={icon.name} size={20} color={icon.color} />
                        </View>
                        {!notification.isRead && <View style={styles.unreadDot} />}
                      </View>

                      <View style={styles.notificationContent}>
                        <View style={styles.titleRow}>
                          <Text
                            style={[
                              styles.notificationTitle,
                              !notification.isRead && styles.notificationTitleUnread,
                            ]}
                            numberOfLines={1}
                          >
                            {notification.title}
                          </Text>
                          {notification.type === 'points_earned' && notification.pointsAmount ? (
                            <View style={styles.pointsBadge}>
                              <Text style={styles.pointsBadgeText}>
                                +{notification.pointsAmount}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.notificationMessage} numberOfLines={2}>
                          {notification.message}
                        </Text>
                        <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(15, 23, 42, 0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  notificationCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
  },
  notificationCardUnread: {
    backgroundColor: 'rgba(46, 122, 217, 0.06)',
    borderColor: 'rgba(46, 122, 217, 0.16)',
  },
  notificationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconWrapper: {
    position: 'relative',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1E293B',
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: '700',
  },
  pointsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
  },
  pointsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
