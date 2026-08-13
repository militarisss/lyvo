import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, Message } from '@/types/models';
import { SEED_CONVERSATIONS } from '@/data/seed';
import { providerById } from '@/data/providers';
import { demoStorage } from '@/stores/persist';
import { uid } from '@/utils/format';

const AUTO_REPLIES = [
  'Bien reçu 👍',
  'Parfait, merci pour l’info !',
  'Je vous confirme ça très vite.',
  'C’est noté, à tout à l’heure !',
];

function nowHM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

interface ChatState {
  conversations: Conversation[];
  send: (conversationId: string, text: string) => void;
  markRead: (conversationId: string) => void;
  openWithProvider: (providerId: string) => string; // returns conversation id
  byId: (id: string) => Conversation | undefined;
}

export const useChat = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: SEED_CONVERSATIONS,
  send: (conversationId, text) => {
    const msg: Message = { id: uid('m'), from: 'me', text, at: nowHM(), read: true };
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, messages: [...c.messages, msg] } : c)),
    }));
    // réponse simulée du prestataire
    setTimeout(() => {
      const reply: Message = {
        id: uid('m'),
        from: 'them',
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        at: nowHM(),
        read: true,
      };
      set((s) => ({
        conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, messages: [...c.messages, reply] } : c)),
      }));
    }, 1600);
  },
  markRead: (conversationId) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === conversationId ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) } : c
      ),
    })),
  openWithProvider: (providerId) => {
    const existing = get().conversations.find((c) => c.providerId === providerId);
    if (existing) return existing.id;
    const p = providerById(providerId);
    const conv: Conversation = {
      id: uid('cv'),
      providerId,
      providerName: p?.name ?? 'Prestataire',
      avatar: `https://i.pravatar.cc/150?img=${20 + Math.floor(Math.random() * 40)}`,
      unread: 0,
      messages: [],
    };
    set((s) => ({ conversations: [conv, ...s.conversations] }));
    return conv.id;
  },
      byId: (id) => get().conversations.find((c) => c.id === id),
    }),
    { name: 'lyvo-chat', storage: demoStorage }
  )
);
