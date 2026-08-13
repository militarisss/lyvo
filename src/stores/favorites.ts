import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoStorage } from '@/stores/persist';

interface FavoritesState {
  providerIds: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      providerIds: ['chef-amine', 'driver-mehdi'],
      toggle: (id) =>
        set((s) => ({
          providerIds: s.providerIds.includes(id) ? s.providerIds.filter((x) => x !== id) : [...s.providerIds, id],
        })),
      has: (id) => get().providerIds.includes(id),
    }),
    { name: 'lyvo-favorites', storage: demoStorage }
  )
);
