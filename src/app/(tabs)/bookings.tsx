import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { BookingCard } from '@/components/BookingCard';
import { EmptyState } from '@/components/EmptyState';
import { Sheet } from '@/components/Sheet';
import { Button } from '@/components/Button';
import { useBookings } from '@/stores/bookings';
import { useToast } from '@/stores/toast';
import { tapLight } from '@/utils/haptics';

type Tab = 'upcoming' | 'done' | 'cancelled';

const TABS: { id: Tab; label: string }[] = [
  { id: 'upcoming', label: 'À venir' },
  { id: 'done', label: 'Terminées' },
  { id: 'cancelled', label: 'Annulées' },
];

export default function Bookings() {
  const { bookings, cancel } = useBookings();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [toCancel, setToCancel] = useState<string | null>(null);
  const toast = useToast((s) => s.show);

  const filtered = bookings.filter((b) => {
    if (tab === 'upcoming') return ['pending', 'confirmed', 'enroute', 'inprogress'].includes(b.status);
    if (tab === 'done') return b.status === 'done';
    return b.status === 'cancelled';
  });

  return (
    <Screen scroll={false}>
      <Text style={type.h1}>Réservations</Text>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => {
              tapLight();
              setTab(t.id);
            }}
            style={[styles.tab, tab === t.id && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t.id && { color: '#fff' }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl, paddingTop: spacing.lg }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title={tab === 'upcoming' ? 'Aucune réservation à venir' : tab === 'done' ? 'Aucune prestation terminée' : 'Aucune annulation'}
            text={tab === 'upcoming' ? 'Explorez les services autour de vous et réservez en quelques secondes.' : 'Tout est là quand vous en avez besoin.'}
            actionLabel={tab === 'upcoming' ? 'Explorer les services' : undefined}
            onAction={tab === 'upcoming' ? () => router.push('/(tabs)/explore') : undefined}
          />
        ) : (
          filtered.map((b) => <BookingCard key={b.id} booking={b} onCancel={(id) => setToCancel(id)} />)
        )}
      </ScrollView>

      <Sheet visible={!!toCancel} onClose={() => setToCancel(null)} title="Annuler la réservation ?">
        <Text style={type.bodySoft}>
          L’annulation est gratuite jusqu’à 2 h avant le rendez-vous. Le prestataire sera prévenu immédiatement.
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl }}>
          <Button title="Garder" variant="secondary" onPress={() => setToCancel(null)} style={{ flex: 1 }} />
          <Button
            title="Annuler la réservation"
            variant="danger"
            onPress={() => {
              if (toCancel) cancel(toCancel);
              setToCancel(null);
              toast('Réservation annulée', 'info');
            }}
            style={{ flex: 1 }}
          />
        </View>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 4,
    marginTop: spacing.lg,
  },
  tab: { flex: 1, height: 38, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: colors.violet },
  tabText: { color: colors.textSoft, fontSize: 13.5, fontWeight: '700' },
});
