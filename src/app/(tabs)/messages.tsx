import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Avatar } from '@/components/Avatar';
import { EmptyState } from '@/components/EmptyState';
import { useChat } from '@/stores/chat';
import { tapLight } from '@/utils/haptics';

export default function Messages() {
  const conversations = useChat((s) => s.conversations);

  return (
    <Screen scroll={false}>
      <Text style={type.h1}>Messages</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: spacing.xxl }}>
        {conversations.length === 0 ? (
          <EmptyState
            icon="chatbubbles-outline"
            title="Pas encore de messages"
            text="Vos conversations avec les prestataires apparaîtront ici."
            actionLabel="Explorer les services"
            onAction={() => router.push('/(tabs)/explore')}
          />
        ) : (
          conversations.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <Pressable
                key={c.id}
                onPress={() => {
                  tapLight();
                  router.push(`/chat/${c.id}`);
                }}
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.75 }]}>
                <Avatar uri={c.avatar} name={c.providerName} size={50} />
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={[type.h3, { flex: 1 }]} numberOfLines={1}>
                      {c.providerName}
                    </Text>
                    <Text style={type.tiny}>{last?.at}</Text>
                  </View>
                  <View style={styles.titleRow}>
                    <Text style={[type.small, c.unread > 0 && { color: colors.text, fontWeight: '600' }, { flex: 1 }]} numberOfLines={1}>
                      {last?.from === 'me' ? 'Vous : ' : ''}
                      {last?.text ?? 'Pièce jointe'}
                    </Text>
                    {c.unread > 0 && (
                      <View style={styles.unread}>
                        <Text style={styles.unreadText}>{c.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  unread: {
    backgroundColor: colors.violet,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
