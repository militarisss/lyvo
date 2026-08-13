import type { Booking, Conversation, NotificationItem, PromoCode, WalletTransaction, Address } from '@/types/models';
import { todayIso } from '@/utils/format';

const face = (n: number) => `https://i.pravatar.cc/150?img=${n}`;
const img = (seed: string) => `https://picsum.photos/seed/${seed}/640/420`;

export const SEED_ADDRESSES: Address[] = [
  { id: 'addr-home', label: 'Maison', line: 'Rés. Yasmine, Apt 12, Maârif', city: 'Casablanca', lat: 33.5731, lng: -7.6433 },
  { id: 'addr-work', label: 'Travail', line: 'Casablanca Finance City, Tour Ivoire', city: 'Casablanca', lat: 33.5678, lng: -7.6659 },
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    providerId: 'onyx-barber',
    serviceId: 'svc-home',
    serviceName: 'Coupe à domicile',
    providerName: 'Onyx Barber Club',
    cover: img('onyxbarber'),
    date: todayIso(),
    time: '17:30',
    addressLine: 'Rés. Yasmine, Apt 12, Maârif',
    priceMad: 280,
    feesMad: 15,
    discountMad: 0,
    totalMad: 295,
    status: 'enroute',
    paymentMethod: 'Carte •• 4832',
    trackable: true,
  },
  {
    id: 'bk-1000',
    providerId: 'nova-clean',
    serviceId: 'svc-4h',
    serviceName: 'Ménage complet — 4 h',
    providerName: 'Nova Clean',
    cover: img('novaclean'),
    date: '2026-08-12',
    time: '09:00',
    addressLine: 'Rés. Yasmine, Apt 12, Maârif',
    priceMad: 320,
    feesMad: 15,
    discountMad: 50,
    totalMad: 285,
    status: 'confirmed',
    paymentMethod: 'Espèces',
    promoCode: 'BIENVENUE',
    trackable: false,
  },
  {
    id: 'bk-0999',
    providerId: 'sakura-spa',
    serviceId: 'svc-deep',
    serviceName: 'Deep tissue — 60 min',
    providerName: 'Sakura Spa',
    cover: img('sakuraspa'),
    date: '2026-08-02',
    time: '14:00',
    addressLine: 'Rue Jean Jaurès, Gauthier',
    priceMad: 350,
    feesMad: 0,
    discountMad: 0,
    totalMad: 350,
    status: 'done',
    paymentMethod: 'Wallet LYVO',
    rated: false,
    trackable: false,
  },
  {
    id: 'bk-0998',
    providerId: 'wash-express',
    serviceId: 'svc-full',
    serviceName: 'Intérieur + extérieur',
    providerName: 'Wash Express',
    cover: img('washexpress'),
    date: '2026-07-28',
    time: '11:00',
    addressLine: 'CFC, Tour Ivoire — parking',
    priceMad: 150,
    feesMad: 10,
    discountMad: 0,
    totalMad: 160,
    status: 'cancelled',
    paymentMethod: 'Carte •• 4832',
    trackable: false,
  },
];

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'cv-onyx',
    providerId: 'onyx-barber',
    providerName: 'Onyx Barber Club',
    avatar: face(68),
    unread: 1,
    messages: [
      { id: 'm1', from: 'me', text: 'Bonjour, vous êtes bien en route ?', at: '16:58', read: true },
      { id: 'm2', from: 'them', text: 'Bonjour ! Oui, j’arrive vers 17h25, je suis sur Bd Zerktouni.', at: '17:02', read: true },
      { id: 'm3', from: 'them', text: 'Je me gare, j’arrive dans 5 min 👍', at: '17:21', read: false, bookingId: 'bk-1001' },
    ],
  },
  {
    id: 'cv-nova',
    providerId: 'nova-clean',
    providerName: 'Nova Clean',
    avatar: face(47),
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Votre réservation de mercredi 09:00 est confirmée. L’équipe sera composée de 2 personnes.', at: 'Hier', read: true, bookingId: 'bk-1000' },
      { id: 'm2', from: 'me', text: 'Parfait, le gardien vous ouvrira le parking.', at: 'Hier', read: true },
    ],
  },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', kind: 'enroute', title: 'Votre barbier est en route', body: 'Onyx Barber Club arrive vers 17:25 — suivez-le en direct.', time: 'Il y a 10 min', read: false },
  { id: 'n2', kind: 'message', title: 'Nouveau message', body: 'Onyx Barber Club : « Je me gare, j’arrive dans 5 min »', time: 'Il y a 12 min', read: false },
  { id: 'n3', kind: 'booking', title: 'Réservation confirmée', body: 'Nova Clean — ménage complet, mer. 12 août à 09:00.', time: 'Hier', read: true },
  { id: 'n4', kind: 'promo', title: '-20 % sur le detailing', body: 'Atlas Detailing : offre membres LYVO jusqu’à dimanche.', time: 'Hier', read: true },
  { id: 'n5', kind: 'done', title: 'Prestation terminée', body: 'Sakura Spa — notez votre expérience et gagnez 10 MAD de cashback.', time: '2 août', read: true },
  { id: 'n6', kind: 'offer', title: 'Nouveau sur LYVO', body: 'Glow Studio rejoint LYVO — -15 % sur la première réservation.', time: '30 juil.', read: true },
  { id: 'n7', kind: 'reminder', title: 'Rappel', body: 'Votre chauffeur Mehdi vous attendra demain à 06:15.', time: '28 juil.', read: true },
];

export const SEED_WALLET: WalletTransaction[] = [
  { id: 'w1', label: 'Cashback — Sakura Spa', amountMad: 10, date: '2 août', kind: 'cashback' },
  { id: 'w2', label: 'Paiement — Sakura Spa', amountMad: -350, date: '2 août', kind: 'payment' },
  { id: 'w3', label: 'Crédit de bienvenue', amountMad: 50, date: '25 juil.', kind: 'promo' },
  { id: 'w4', label: 'Rechargement carte', amountMad: 500, date: '25 juil.', kind: 'topup' },
  { id: 'w5', label: 'Parrainage — Yassine', amountMad: 40, date: '20 juil.', kind: 'referral' },
];

export const SEED_WALLET_BALANCE = 250;

export const PROMO_CODES: PromoCode[] = [
  { code: 'LYVO20', label: '-20 % sur votre réservation', type: 'percent', value: 20 },
  { code: 'BIENVENUE', label: '-50 MAD de bienvenue', type: 'fixed', value: 50 },
];

export const SERVICE_FEE_MAD = 15;
export const REFERRAL_CODE = 'BADR-LYVO';
export const REFERRAL_REWARD_MAD = 40;
