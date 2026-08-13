import { create } from 'zustand';
import type { WalletTransaction } from '@/types/models';
import { SEED_WALLET, SEED_WALLET_BALANCE } from '@/data/seed';
import { uid } from '@/utils/format';

interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
  topUp: (amount: number) => void;
  pay: (amount: number, label: string) => boolean;
  credit: (amount: number, label: string, kind: WalletTransaction['kind']) => void;
}

export const useWallet = create<WalletState>((set, get) => ({
  balance: SEED_WALLET_BALANCE,
  transactions: SEED_WALLET,
  topUp: (amount) =>
    set((s) => ({
      balance: s.balance + amount,
      transactions: [{ id: uid('w'), label: 'Rechargement', amountMad: amount, date: "Aujourd'hui", kind: 'topup' }, ...s.transactions],
    })),
  pay: (amount, label) => {
    if (get().balance < amount) return false;
    set((s) => ({
      balance: s.balance - amount,
      transactions: [{ id: uid('w'), label: `Paiement — ${label}`, amountMad: -amount, date: "Aujourd'hui", kind: 'payment' }, ...s.transactions],
    }));
    return true;
  },
  credit: (amount, label, kind) =>
    set((s) => ({
      balance: s.balance + amount,
      transactions: [{ id: uid('w'), label, amountMad: amount, date: "Aujourd'hui", kind }, ...s.transactions],
    })),
}));
