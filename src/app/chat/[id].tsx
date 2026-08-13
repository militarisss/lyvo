import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, type } from '@/theme';
import { Avatar } from '@/components/Avatar';
import { EmptyState } from '@/components/EmptyState';
import { useChat } from '@/stores/chat';
import { useBookings } from '@/stores/bookings';
import { useToast } from '@/stores/toast';
import { shortDate } from '@/utils/format';
import { tapLight } from '@/utils/haptics';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const conversation = useChat((s) => s.conversations.find((c) => c.id === id));
  const { send, markRead } = useChat();
  const bookings = useBookings((s) => s.bookings);
  const toast = useToast((s) => s.show);
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (id) markRead(id);
  }, [id, conversation?.messages.length, markRead]);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [conversation?.messages.length]);

  if (!conversation) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}>
        <EmptyState icon="chatbubble-outline" title="Conversation introuvable" text="Elle a peut-être été supprimée." actionLabel="Mes messages" onAction={() => router.replace('/(tabs)/messages')} />
      </View>
    );
  }

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    tapLight();
    send(conversation.id, t);
    setText('');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/messages'))} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Pressable style={styles.headerCenter} onPress={() => router.push(`/provider/${conversation.providerId}`)}>
          <Avatar uri={conversation.avatar} name={conversation.providerName} size={38} />
          <View style={{ flex: 1 }}>
            <Text style={type.h3} numberOfLines={1}>
              {conversation.providerName}
            </Text>
            <Text style={[type.tiny, { color: colors.success }]}>● En ligne</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => toast('Appel simulé', 'info')} style={styles.backBtn}>
          <Ionicons name="call-outline" size={18} color={colors.text} />
        </Pressable>
      </View>

      {/* messages */}
      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {conversation.messages.map((m) => {
          const mine = m.from === 'me';
          const attachedBooking = m.bookingId ? bookings.find((b) => b.id === m.bookingId) : undefined;
          return (
            <View key={m.id} style={[styles.bubbleRow, mine && { justifyContent: 'flex-end' }]}>
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleThem]}>
                {attachedBooking && (
                  <Pressable onPress={() => router.push('/(tabs)/bookings')} style={styles.bookingChip}>
                    <Ionicons name="calendar-outline" size={13} color={colors.violetLight} />
                    <Text style={styles.bookingChipText} numberOfLines={1}>
                      {attachedBooking.serviceName} · {shortDate(attachedBooking.date)} {attachedBooking.time}
                    </Text>
                  </Pressable>
                )}
                {m.text && <Text style={[type.body, { fontSize: 14.5 }]}>{m.text}</Text>}
                <View style={styles.msgMeta}>
                  <Text style={styles.msgTime}>{m.at}</Text>
                  {mine && <Ionicons name="checkmark-done" size={13} color={m.read ? colors.violetLight : colors.textFaint} />}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* composer */}
      <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable onPress={() => toast('Photo jointe (démo)', 'info')} style={styles.attach}>
          <Ionicons name="image-outline" size={20} color={colors.textSoft} />
        </Pressable>
        <Pressable onPress={() => toast('Position partagée (démo)', 'info')} style={styles.attach}>
          <Ionicons name="location-outline" size={20} color={colors.textSoft} />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Écrivez un message…"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          onSubmitEditing={submit}
          returnKeyType="send"
        />
        <Pressable onPress={submit} style={[styles.sendBtn, !text.trim() && { opacity: 0.4 }]}>
          <Ionicons name="arrow-up" size={19} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.bg2,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  list: { padding: spacing.lg, gap: spacing.sm },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '80%', borderRadius: radius.lg, padding: spacing.md, paddingBottom: 8 },
  bubbleMine: { backgroundColor: colors.violet, borderBottomRightRadius: 6 },
  bubbleThem: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderBottomLeftRadius: 6 },
  bookingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6,2,13,0.4)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginBottom: 6,
  },
  bookingChipText: { color: colors.text, fontSize: 12, fontWeight: '600', flexShrink: 1 },
  msgMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-end', marginTop: 3 },
  msgTime: { color: 'rgba(255,255,255,0.55)', fontSize: 10 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.bg2,
  },
  attach: { padding: 4 },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    height: 44,
    color: colors.text,
    fontSize: 14.5,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
