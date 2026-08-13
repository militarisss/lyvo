import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { useNotifications } from '@/stores/notifications';
import type { NotificationKind } from '@/types/models';
import { tapLight } from '@/utils/haptics';

const KIND_ICON: Record<NotificationKind, keyof typeof Ionicons.glyphMap> = {
  booking: 'calendar-outline',
  reminder: 'alarm-outline',
  enroute: 'navigate-outline',
  done: 'checkmark-circle-outline',
  promo: 'pricetag-outline',
  message: 'chatbubble-outline',
  offer: 'sparkles-outline',
};

export default function Notifications() {
  const { items, markAllRead, markRead } = useNotifications();
  const hasUnread = items.some((n) => !n.read);

  return (
    <Screen>
      <Header
        title="Notifications"
        right={
          hasUnread ? (
            <Pressable onPress={markAllRead} hitSlop={8}>
              <Ionicons name="checkmark-done-outline" size={20} color={colors.violetLight} />
            </Pressable>
          ) : undefined
        }
      />
      {items.length === 0 ? (
        <EmptyState icon="notifications-outline" title="Rien pour l’instant" text="Vos confirmations, rappels et offres apparaîtront ici." />
      ) : (
        <View style={{ gap: spacing.sm }}>
          {items.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => {
                tapLight();
                markRead(n.id);
              }}
              style={({ pressed }) => [styles.row, !n.read && styles.rowUnread, pressed && { opacity: 0.8 }]}>
              <View style={[styles.icon, !n.read && { backgroundColor: colors.violetDim }]}>
                <Ionicons name={KIND_ICON[n.kind]} size={18} color={n.read ? colors.textFaint : colors.violetLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.h3, { fontSize: 14.5 }, n.read && { color: colors.textSoft }]}>{n.title}</Text>
                <Text style={[type.small, { marginTop: 2 }]}>{n.body}</Text>
                <Text style={[type.tiny, { marginTop: 4 }]}>{n.time}</Text>
              </View>
              {!n.read && <View style={styles.dot} />}
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  rowUnread: { borderColor: colors.lineStrong, backgroundColor: colors.cardHi },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: 'rgba(169,162,179,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.magenta, marginTop: 6 },
});
