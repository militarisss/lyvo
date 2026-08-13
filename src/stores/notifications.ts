import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NotificationItem } from '@/types/models';
import { SEED_NOTIFICATIONS } from '@/data/seed';
import { demoStorage } from '@/stores/persist';

interface NotificationsState {
  items: NotificationItem[];
  unreadCount: () => number;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export const useNotifications = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: SEED_NOTIFICATIONS,
      unreadCount: () => get().items.filter((n) => !n.read).length,
      markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
      markRead: (id) => set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
    }),
    { name: 'lyvo-notifications', storage: demoStorage }
  )
);
