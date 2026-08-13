import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/**
 * Persistance locale de la démo : localStorage sur web, no-op sur natif
 * (AsyncStorage sera branché en V2 sans toucher aux stores).
 */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const demoStorage = createJSONStorage(() =>
  typeof localStorage !== 'undefined' ? localStorage : noopStorage
);

export function clearDemoData() {
  if (typeof localStorage === 'undefined') return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith('lyvo-'))
    .forEach((k) => localStorage.removeItem(k));
}
