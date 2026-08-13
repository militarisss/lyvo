import { create } from 'zustand';
import type { NotificationItem } from '@/types/models';
import { SEED_NOTIFICATIONS } from '@/data/seed';

interface NotificationsState {
  items: NotificationItem[];
  unreadCount: () => number;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export const useNotifications = create<NotificationsState>((set, get) => ({
  items: SEED_NOTIFICATIONS,
  unreadCount: () => get().items.filter((n) => !n.read).length,
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
  markRead: (id) => set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
}));
