import { create } from 'zustand';
import type { Booking } from '@/types/models';
import { SEED_BOOKINGS } from '@/data/seed';

interface BookingsState {
  bookings: Booking[];
  add: (b: Booking) => void;
  cancel: (id: string) => void;
  markRated: (id: string) => void;
  byId: (id: string) => Booking | undefined;
}

export const useBookings = create<BookingsState>((set, get) => ({
  bookings: SEED_BOOKINGS,
  add: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
  cancel: (id) =>
    set((s) => ({
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)),
    })),
  markRated: (id) =>
    set((s) => ({
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, rated: true } : b)),
    })),
  byId: (id) => get().bookings.find((b) => b.id === id),
}));
