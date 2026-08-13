import { create } from 'zustand';

export type ToastKind = 'success' | 'error' | 'info';

interface ToastState {
  message: string | null;
  kind: ToastKind;
  show: (message: string, kind?: ToastKind) => void;
  hide: () => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToast = create<ToastState>((set) => ({
  message: null,
  kind: 'info',
  show: (message, kind = 'info') => {
    if (timer) clearTimeout(timer);
    set({ message, kind });
    timer = setTimeout(() => set({ message: null }), 2600);
  },
  hide: () => {
    if (timer) clearTimeout(timer);
    set({ message: null });
  },
}));
