// Lightweight in-memory cache of in-app notifications. Realtime sync
// (useRealtimeSync) calls addNotification() when Postgres emits an INSERT on
// the Notification table. Screens that show the notifications list can also
// fetch from the API and call setNotifications().
import { create } from 'zustand';

export interface InAppNotification {
  id: string;
  userId?: string | null;
  title: string;
  body: string;
  type: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: InAppNotification[];
  unreadCount: number;

  setNotifications: (rows: InAppNotification[]) => void;
  addNotification: (n: InAppNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (rows) =>
    set({
      notifications: rows,
      unreadCount: rows.filter((r) => !r.isRead).length,
    }),

  addNotification: (n) =>
    set((state) => {
      // Dedupe by id — realtime can occasionally double-fire.
      if (state.notifications.find((x) => x.id === n.id)) return state;
      const next = [n, ...state.notifications];
      return {
        notifications: next,
        unreadCount: next.filter((r) => !r.isRead).length,
      };
    }),

  markRead: (id) =>
    set((state) => {
      const next = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return { notifications: next, unreadCount: next.filter((r) => !r.isRead).length };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  clear: () => set({ notifications: [], unreadCount: 0 }),
}));
