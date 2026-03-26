import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../src/constants/theme';
import { ScreenHeader } from '../src/components/composite';
import { EmptyState } from '../src/components/ui';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/store/authStore';

interface Notification {
  id: string;
  type: 'booking' | 'order' | 'promo' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
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

const getNotificationIcon = (type: Notification['type']): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'booking':
      return 'calendar-outline';
    case 'order':
      return 'cube-outline';
    case 'promo':
      return 'pricetag-outline';
    case 'system':
      return 'settings-outline';
    default:
      return 'notifications-outline';
  }
};

/**
 * Notifications Panel/List Screen matching wireframe:
 * - Header: "Notifications"
 * - Notification cards with icon, title, message, timestamp
 * - Read/unread indicator
 * - Mark all as read
 * - Empty state
 */
export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((s) => s.user?.id);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('Notification')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      if (error) throw error;
      setNotifications((data || []).map((n: any) => ({
        id: n.id,
        type: n.type || 'system',
        title: n.title,
        message: n.body,
        timestamp: formatTimeAgo(n.createdAt),
        read: n.isRead,
        actionRoute: n.data?.bookingId ? `/bookings/${n.data.bookingId}` : undefined,
      })));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
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

  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await supabase
        .from('Notification')
        .update({ isRead: true })
        .eq('userId', userId)
        .eq('isRead', false);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await supabase
          .from('Notification')
          .update({ isRead: true })
          .eq('id', notification.id);
        setNotifications(notifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        ));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
    if (notification.actionRoute) {
      router.push(notification.actionRoute as any);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.notificationUnread]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, !item.read && styles.iconContainerUnread]}>
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={24}
          color={!item.read ? colors.primary : colors.text.secondary}
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, !item.read && styles.notificationTitleUnread]}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Notifications"
        showBack
        rightIcon={unreadCount > 0 ? 'checkmark-done-outline' : undefined}
        onRightAction={unreadCount > 0 ? handleMarkAllRead : undefined}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="notifications-off-outline"
              title="No notifications"
              message="You're all caught up! Check back later for updates."
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: 'rgba(46, 122, 217, 0.1)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  notificationUnread: {
    backgroundColor: 'rgba(46, 122, 217, 0.03)',
    borderColor: colors.border.default,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconContainerUnread: {
    backgroundColor: 'rgba(46, 122, 217, 0.1)',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notificationTitle: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.info,
    marginLeft: spacing.sm,
  },
  notificationMessage: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
});

