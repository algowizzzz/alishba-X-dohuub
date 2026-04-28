import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/store/authStore';
import api from '../src/services/api';

interface Notification {
  id: string;
  type: 'order' | 'promo' | 'update' | 'reminder' | 'points_earned' | 'booking' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  pointsAmount?: number;
  actionRoute?: string;
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

const getNotificationIcon = (type: string): { name: keyof typeof Ionicons.glyphMap; color: string; bg: string } => {
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
/**
 * Notifications Screen — exact copy of boss wireframe (NotificationsPanel.tsx)
 */
export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((s) => s.user?.id);

  const fetchNotifications = async () => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('Notification')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      if (error) throw error;
      const dbNotifications = (data || []).map((n: any) => ({
        id: n.id,
        type: n.type || 'system',
        title: n.title,
        message: n.body,
        timestamp: formatTimeAgo(n.createdAt),
        read: n.isRead,
        pointsAmount: n.data?.pointsAmount,
        actionRoute: n.data?.bookingId ? `/bookings/${n.data.bookingId}` : undefined,
      }));
      setNotifications(dbNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      setNotifications(notifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      ));
      try {
        await api.put(`/api/v1/notifications/${notification.id}/read`);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
    if (notification.actionRoute) {
      router.push(notification.actionRoute as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header — exact match to boss: title + red badge + X button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7AD9" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="notifications-outline" size={40} color="#64748B" />
          </View>
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>You're all caught up!</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {notifications.map((notification) => {
            const icon = getNotificationIcon(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationCardUnread,
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationRow}>
                  {/* Icon with unread dot */}
                  <View style={styles.iconWrapper}>
                    <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}>
                      <Ionicons name={icon.name} size={20} color={icon.color} />
                    </View>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>

                  {/* Content */}
                  <View style={styles.notificationContent}>
                    <View style={styles.titleRow}>
                      <Text style={[
                        styles.notificationTitle,
                        !notification.read && styles.notificationTitleUnread,
                      ]} numberOfLines={1}>
                        {notification.title}
                      </Text>
                      {notification.type === 'points_earned' && notification.pointsAmount && (
                        <View style={styles.pointsBadge}>
                          <Text style={styles.pointsBadgeText}>+{notification.pointsAmount}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(46, 122, 217, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F1FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F1FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 24,
    gap: 12,
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(46, 122, 217, 0.1)',
  },
  notificationCardUnread: {
    backgroundColor: 'rgba(46, 122, 217, 0.05)',
    borderColor: 'rgba(46, 122, 217, 0.15)',
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
    borderColor: '#F0F7FF',
  },
  notificationContent: {
    flex: 1,
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
    fontWeight: '600',
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
