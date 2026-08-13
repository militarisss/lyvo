import { create } from 'zustand';
import type { Lang } from '@/types/models';

/**
 * i18n minimal — FR complet, EN/AR sur les parcours clés (onboarding, navigation).
 * L'arabe active le RTL au niveau des écrans qui consomment `isRTL`.
 * (Sur natif, un vrai flip global passera par I18nManager.forceRTL + reload.)
 */

const dict = {
  fr: {
    welcome_title: 'Votre conciergerie personnelle',
    welcome_sub: 'Réservez un coiffeur, un chef, un chauffeur ou une chambre — en quelques secondes.',
    get_started: 'Commencer',
    already_account: 'J’ai déjà un compte',
    choose_lang: 'Choisissez votre langue',
    continue: 'Continuer',
    home: 'Accueil',
    explore: 'Explorer',
    bookings: 'Réservations',
    messages: 'Messages',
    profile: 'Profil',
    hello: 'Bonjour',
    search_placeholder: 'Rechercher un service, une activité…',
  },
  en: {
    welcome_title: 'Your personal concierge',
    welcome_sub: 'Book a barber, a chef, a driver or a hotel room — in seconds.',
    get_started: 'Get started',
    already_account: 'I already have an account',
    choose_lang: 'Choose your language',
    continue: 'Continue',
    home: 'Home',
    explore: 'Explore',
    bookings: 'Bookings',
    messages: 'Messages',
    profile: 'Profile',
    hello: 'Hello',
    search_placeholder: 'Search a service, an activity…',
  },
  ar: {
    welcome_title: 'خدمة الكونسيرج الخاصة بك',
    welcome_sub: 'احجز حلاقًا أو طاهيًا أو سائقًا أو غرفة فندق — في ثوانٍ.',
    get_started: 'ابدأ الآن',
    already_account: 'لدي حساب بالفعل',
    choose_lang: 'اختر لغتك',
    continue: 'متابعة',
    home: 'الرئيسية',
    explore: 'استكشف',
    bookings: 'الحجوزات',
    messages: 'الرسائل',
    profile: 'الملف الشخصي',
    hello: 'مرحبا',
    search_placeholder: 'ابحث عن خدمة أو نشاط…',
  },
} as const;

type Key = keyof typeof dict.fr;

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: 'fr',
  setLang: (lang) => set({ lang }),
}));

export function useT() {
  const lang = useLangStore((s) => s.lang);
  const t = (k: Key): string => dict[lang][k] ?? dict.fr[k];
  return { t, lang, isRTL: lang === 'ar' };
}

export const LANGS: { id: Lang; label: string; native: string }[] = [
  { id: 'fr', label: 'Français', native: 'Français' },
  { id: 'en', label: 'English', native: 'English' },
  { id: 'ar', label: 'Arabe', native: 'العربية' },
];
