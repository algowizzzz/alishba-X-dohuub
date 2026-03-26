import { X, Bell, Package, CheckCircle, Info, Clock, Gift } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'order' | 'promo' | 'update' | 'reminder' | 'points_earned';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  pointsAmount?: number;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onMarkNotificationAsRead,
  onClearAllNotifications
}: NotificationsPanelProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5" style={{ color: 'var(--primary)' }} />;
      case 'promo':
        return <Bell className="w-5 h-5" style={{ color: 'rgb(168, 85, 247)' }} />;
      case 'update':
        return <CheckCircle className="w-5 h-5" style={{ color: 'rgb(34, 197, 94)' }} />;
      case 'reminder':
        return <Clock className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />;
      case 'points_earned':
        return <Gift className="w-5 h-5" style={{ color: 'rgb(245, 158, 11)' }} />;
      default:
        return <Info className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />;
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 overflow-hidden"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
      />

      {/* Panel - positioned at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl shadow-premium-lg animate-slide-up"
        style={{
          backgroundColor: 'var(--background)',
          maxHeight: '75%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex-shrink-0 rounded-t-3xl"
          style={{
            background: 'var(--background)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Notifications</h2>
              {unreadCount > 0 && (
                <span
                  className="px-2 py-0.5 text-sm text-white rounded-full"
                  style={{ backgroundColor: 'var(--destructive)' }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-all duration-300 hover:bg-[var(--muted)]"
            >
              <X className="w-5 h-5" style={{ color: 'var(--foreground)' }} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1" style={{ backgroundColor: 'var(--background)' }}>
          {notifications.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <Bell className="w-10 h-10" style={{ color: 'var(--muted-foreground)' }} />
              </div>
              <p className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>No notifications</p>
              <p style={{ color: 'var(--muted-foreground)' }}>You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => onMarkNotificationAsRead(notification.id)}
                  className="w-full p-4 text-left transition-all duration-300 hover:bg-[var(--muted)]"
                  style={{
                    backgroundColor: !notification.isRead ? 'rgba(46, 122, 217, 0.05)' : 'transparent',
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: !notification.isRead ? 'rgba(46, 122, 217, 0.1)' : 'var(--muted)'
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={!notification.isRead ? 'font-medium' : ''}
                            style={{ color: 'var(--foreground)' }}
                          >
                            {notification.title}
                          </p>
                          {notification.type === 'points_earned' && notification.pointsAmount && (
                            <span
                              className="inline-flex items-center justify-center h-5 px-2 text-white text-xs font-bold rounded-full"
                              style={{ background: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(249, 115, 22))' }}
                            >
                              +{notification.pointsAmount}
                            </span>
                          )}
                        </div>
                        {!notification.isRead && (
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                            style={{ backgroundColor: 'var(--primary)' }}
                          />
                        )}
                      </div>
                      <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        {notification.message}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
