export type Lang = 'fr' | 'en' | 'ar';

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: string;
  birthDate?: string;
}

export interface Address {
  id: string;
  label: 'Maison' | 'Travail' | 'Autre';
  line: string;
  city: string;
  lat: number;
  lng: number;
}

export interface SubCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  tint: string;
  subs: SubCategory[];
}

export interface ServiceExtra {
  id: string;
  name: string;
  priceMad: number;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  priceMad: number;
  durationMin: number;
  atHome: boolean;
  extras?: ServiceExtra[];
}

export interface StaffMember {
  name: string;
  avatar: string;
  rating: number;
  missions: number;
  etaMin: number;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Provider {
  id: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
  tagline: string;
  description: string;
  cover: string;
  gallery: string[];
  verified: boolean;
  premium: boolean;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  address: string;
  city: string;
  lat: number;
  lng: number;
  hours: { days: string; open: string; close: string }[];
  services: Service[];
  reviews: Review[];
  faq: FaqItem[];
  mobile: boolean; // se déplace chez le client
  openNow: boolean;
  isNew?: boolean;
  badges?: ('toppro' | 'select' | 'highly')[];
  languages?: string[];
  experienceYears?: number;
  missionsCount?: number;
  recommendPct?: number;
  staff?: StaffMember[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'enroute' | 'inprogress' | 'done' | 'cancelled';

export interface Booking {
  id: string;
  providerId: string;
  serviceId: string;
  serviceName: string;
  providerName: string;
  cover: string;
  date: string; // ISO date
  time: string; // HH:mm
  addressLine: string;
  priceMad: number;
  feesMad: number;
  discountMad: number;
  totalMad: number;
  status: BookingStatus;
  paymentMethod: string;
  instructions?: string;
  promoCode?: string;
  rated?: boolean;
  trackable: boolean;
  extrasLabels?: string[];
  staffName?: string;
}

export interface Message {
  id: string;
  from: 'me' | 'them';
  text?: string;
  image?: string;
  bookingId?: string;
  at: string; // HH:mm
  read: boolean;
}

export interface Conversation {
  id: string;
  providerId: string;
  providerName: string;
  avatar: string;
  messages: Message[];
  unread: number;
}

export type NotificationKind = 'booking' | 'reminder' | 'enroute' | 'done' | 'promo' | 'message' | 'offer';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface WalletTransaction {
  id: string;
  label: string;
  amountMad: number; // + crédit / - débit
  date: string;
  kind: 'cashback' | 'topup' | 'payment' | 'promo' | 'referral';
}

export interface PromoCode {
  code: string;
  label: string;
  type: 'percent' | 'fixed';
  value: number;
}

export interface PaymentMethod {
  id: string;
  label: string;
  sub?: string;
  icon: string;
  available: boolean;
}
