import type { PaymentMethod } from '@/types/models';

/**
 * Abstraction de paiement.
 * Chaque provider (CMI, Stripe, Payzone…) implémente PaymentGateway.
 * Les clés API ne vivent JAMAIS ici : elles seront lues côté backend
 * (Supabase Edge Function) qui créera l'intention de paiement.
 */

export interface PaymentIntent {
  bookingId: string;
  amountMad: number;
  methodId: string;
}

export interface PaymentResult {
  ok: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentGateway {
  id: 'mock' | 'cmi' | 'stripe' | 'payzone';
  pay(intent: PaymentIntent): Promise<PaymentResult>;
}

class MockGateway implements PaymentGateway {
  id = 'mock' as const;
  async pay(intent: PaymentIntent): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 1200));
    return { ok: true, transactionId: `tx_${intent.bookingId}_${Date.now()}` };
  }
}

class CmiGateway implements PaymentGateway {
  id = 'cmi' as const;
  async pay(): Promise<PaymentResult> {
    // TODO: appeler l'Edge Function `create-cmi-session` puis ouvrir la page 3DS.
    return { ok: false, error: 'CMI non configuré — utilisez le paiement de démonstration.' };
  }
}

class StripeGateway implements PaymentGateway {
  id = 'stripe' as const;
  async pay(): Promise<PaymentResult> {
    // TODO: PaymentSheet via @stripe/stripe-react-native + Edge Function `create-payment-intent`.
    return { ok: false, error: 'Stripe non configuré.' };
  }
}

const ACTIVE_GATEWAY: PaymentGateway = new MockGateway();

export function getGateway(): PaymentGateway {
  return ACTIVE_GATEWAY;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', label: 'Carte bancaire', sub: 'Visa •• 4832', icon: 'card-outline', available: true },
  { id: 'applepay', label: 'Apple Pay', icon: 'logo-apple', available: true },
  { id: 'googlepay', label: 'Google Pay', icon: 'logo-google', available: true },
  { id: 'wallet', label: 'Wallet LYVO', icon: 'wallet-outline', available: true },
  { id: 'cash', label: 'Espèces', sub: 'Payez le prestataire sur place', icon: 'cash-outline', available: true },
];
