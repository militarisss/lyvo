import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, type } from '@/theme';
import type { Booking } from '@/types/models';
import { mad, shortDate } from '@/utils/format';
import { Card } from './Card';
import { Badge, STATUS_META } from './Badge';
import { Button } from './Button';
import { useChat } from '@/stores/chat';
import { useToast } from '@/stores/toast';

interface Props {
  booking: Booking;
  onCancel?: (id: string) => void;
}

export function BookingCard({ booking: b, onCancel }: Props) {
  const openChat = useChat((s) => s.openWithProvider);
  const toast = useToast((s) => s.show);
  const meta = STATUS_META[b.status];
  const active = b.status === 'confirmed' || b.status === 'enroute' || b.status === 'inprogress' || b.status === 'pending';

  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.top}>
        <Image source={{ uri: b.cover }} style={styles.img} transition={200} />
        <View style={styles.body}>
          <Badge label={meta.label} tone={meta.tone} />
          <Text style={[type.h3, { marginTop: 6 }]} numberOfLines={1}>
            {b.serviceName}
          </Text>
          <Text style={type.small} numberOfLines={1}>
            {b.providerName}
          </Text>
          <View style={styles.meta}>
            <Ionicons name="calendar-outline" size={12} color={colors.textFaint} />
            <Text style={type.tiny}>
              {shortDate(b.date)} · {b.time}
            </Text>
            <Text style={[type.tiny, { marginLeft: 'auto', color: colors.violetLight, fontWeight: '800', fontSize: 13 }]}>{mad(b.totalMad)}</Text>
          </View>
        </View>
      </View>

      {(active || b.status === 'done') && (
        <View style={styles.actions}>
          {b.trackable && b.status === 'enroute' && (
            <Button title="Suivre" size="sm" icon="navigate-outline" onPress={() => router.push(`/tracking/${b.id}`)} style={{ flex: 1 }} />
          )}
          {active && (
            <Button
              title="Contacter"
              size="sm"
              variant="secondary"
              icon="chatbubble-outline"
              onPress={() => {
                const id = openChat(b.providerId);
                router.push(`/chat/${id}`);
              }}
              style={{ flex: 1 }}
            />
          )}
          {active && b.status !== 'enroute' && onCancel && (
            <Button title="Annuler" size="sm" variant="danger" onPress={() => onCancel(b.id)} style={{ flex: 1 }} />
          )}
          {b.status === 'done' && !b.rated && (
            <Button title="Noter la prestation" size="sm" icon="star-outline" onPress={() => router.push(`/rate/${b.id}`)} style={{ flex: 1 }} />
          )}
          {b.status === 'done' && (
            <Button
              title="Facture"
              size="sm"
              variant="secondary"
              icon="download-outline"
              onPress={() => toast(`Facture ${b.id.toUpperCase()} envoyée par email`, 'success')}
              style={{ flex: 1 }}
            />
          )}
          {b.status === 'done' && b.rated && (
            <Button title="Réserver à nouveau" size="sm" icon="refresh-outline" onPress={() => router.push(`/booking/${b.providerId}?serviceId=${b.serviceId}`)} style={{ flex: 1 }} />
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  top: { flexDirection: 'row' },
  img: { width: 96, height: 108, backgroundColor: colors.cardHi },
  body: { flex: 1, padding: spacing.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
