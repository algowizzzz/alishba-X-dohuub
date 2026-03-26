import { X, Bell, Package, CheckCircle, Info, Clock } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'order' | 'promo' | 'update' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
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
        return <Package className="w-5 h-5 text-gray-700" />;
      case 'promo':
        return <Bell className="w-5 h-5 text-gray-700" />;
      case 'update':
        return <CheckCircle className="w-5 h-5 text-gray-700" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-gray-700" />;
      default:
        return <Info className="w-5 h-5 text-gray-700" />;
    }
  };

  return (
    <div 
      className="absolute inset-0 bg-black bg-opacity-50 flex items-end z-50"
      onClick={onClose}
    >
      <div 
        className="w-full bg-white rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-gray-800">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-2">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-6">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No notifications</p>
              <p className="text-gray-400">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-gray-100">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => onMarkNotificationAsRead(notification.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        !notification.isRead ? 'bg-gray-200' : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`${!notification.isRead ? 'text-gray-800' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-gray-400">
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