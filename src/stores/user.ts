import { create } from 'zustand';
import type { Address, UserProfile } from '@/types/models';
import { SEED_ADDRESSES } from '@/data/seed';
import { uid } from '@/utils/format';

interface UserState {
  onboarded: boolean;
  authenticated: boolean;
  profile: UserProfile;
  interests: string[];
  addresses: Address[];
  defaultAddressId: string;
  locationGranted: boolean;
  notificationsGranted: boolean;

  setProfile: (p: Partial<UserProfile>) => void;
  setInterests: (ids: string[]) => void;
  addAddress: (a: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setLocationGranted: (v: boolean) => void;
  setNotificationsGranted: (v: boolean) => void;
  completeOnboarding: () => void;
  signIn: () => void;
  signOut: () => void;
}

const EMPTY_PROFILE: UserProfile = {
  firstName: 'Badr',
  lastName: 'El Gourari',
  phone: '+212 6 61 23 45 67',
  email: 'badr@lyvo.ma',
  avatar: 'https://i.pravatar.cc/150?img=8',
};

export const useUser = create<UserState>((set) => ({
  onboarded: false,
  authenticated: false,
  profile: EMPTY_PROFILE,
  interests: [],
  addresses: SEED_ADDRESSES,
  defaultAddressId: SEED_ADDRESSES[0]!.id,
  locationGranted: false,
  notificationsGranted: false,

  setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
  setInterests: (interests) => set({ interests }),
  addAddress: (a) =>
    set((s) => {
      const addr: Address = { ...a, id: uid('addr') };
      return { addresses: [...s.addresses, addr] };
    }),
  removeAddress: (id) =>
    set((s) => ({
      addresses: s.addresses.filter((x) => x.id !== id),
      defaultAddressId: s.defaultAddressId === id ? (s.addresses.find((x) => x.id !== id)?.id ?? '') : s.defaultAddressId,
    })),
  setDefaultAddress: (defaultAddressId) => set({ defaultAddressId }),
  setLocationGranted: (locationGranted) => set({ locationGranted }),
  setNotificationsGranted: (notificationsGranted) => set({ notificationsGranted }),
  completeOnboarding: () => set({ onboarded: true, authenticated: true }),
  signIn: () => set({ authenticated: true }),
  signOut: () => set({ authenticated: false, onboarded: false, interests: [] }),
}));
