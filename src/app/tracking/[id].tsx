import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { Stars } from '@/components/Stars';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { EmptyState } from '@/components/EmptyState';
import { useBookings } from '@/stores/bookings';
import { providerById } from '@/data/providers';
import { useChat } from '@/stores/chat';
import { useToast } from '@/stores/toast';

const STEPS = [
  { key: 'confirmed', label: 'Réservation confirmée' },
  { key: 'enroute', label: 'Prestataire en route' },
  { key: 'arrived', label: 'Arrivé sur place' },
  { key: 'inprogress', label: 'Prestation en cours' },
] as const;

export default function Tracking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useBookings((s) => s.bookings.find((b) => b.id === id));
  const provider = booking ? providerById(booking.providerId) : undefined;
  const openChat = useChat((s) => s.openWithProvider);
  const toast = useToast((s) => s.show);
  const [eta, setEta] = useState(12);

  // ETA simulé qui décompte
  useEffect(() => {
    const t = setInterval(() => setEta((e) => (e > 1 ? e - 1 : e)), 5000);
    return () => clearInterval(t);
  }, []);

  if (!booking || !provider) {
    return (
      <Screen>
        <Header title="Suivi" />
        <EmptyState icon="navigate-outline" title="Suivi indisponible" text="Cette réservation ne peut pas être suivie." actionLabel="Mes réservations" onAction={() => router.replace('/(tabs)/bookings')} />
      </Screen>
    );
  }

  const currentStep = 1; // "en route" — piloté par le backend en V2

  return (
    <Screen>
      <Header title="Suivi en direct" />

      <MapPlaceholder
        height={240}
        route
        pins={[
          { left: '20%', top: '28%', label: provider.name, accent: true },
          { left: '74%', top: '68%', label: 'Vous' },
        ]}
      />

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.etaRow}>
          <View style={{ flex: 1 }}>
            <Text style={type.h2}>Prestataire en route</Text>
            <Text style={[type.small, { marginTop: 2 }]}>{booking.serviceName}</Text>
          </View>
          <View style={styles.etaBadge}>
            <Text style={styles.etaValue}>{eta}</Text>
            <Text style={styles.etaUnit}>min</Text>
          </View>
        </View>

        <View style={styles.sep} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Avatar uri={provider.gallery[0]} name={provider.name} size={46} ring />
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>{provider.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Stars rating={provider.rating} />
              <Text style={type.tiny}>· Scooter Yamaha · 7841-A-6</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
          <Button
            title="Message"
            icon="chatbubble-outline"
            variant="secondary"
            size="md"
            onPress={() => {
              const cid = openChat(provider.id);
              router.push(`/chat/${cid}`);
            }}
            style={{ flex: 1 }}
          />
          <Button title="Appeler" icon="call-outline" variant="secondary" size="md" onPress={() => toast('Appel simulé', 'info')} style={{ flex: 1 }} />
        </View>
      </Card>

      {/* timeline */}
      <Card style={{ marginTop: spacing.lg }}>
        {STEPS.map((s, i) => {
          const done = i <= currentStep;
          const isLast = i === STEPS.length - 1;
          return (
            <View key={s.key} style={{ flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', width: 24 }}>
                <View style={[styles.tlDot, done && styles.tlDotOn]}>
                  {i < currentStep && <Ionicons name="checkmark" size={9} color="#fff" />}
                  {i === currentStep && <View style={styles.tlPulse} />}
                </View>
                {!isLast && <View style={[styles.tlLine, i < currentStep && { backgroundColor: colors.violet }]} />}
              </View>
              <Text style={[type.body, { fontSize: 14, marginLeft: spacing.sm, paddingBottom: isLast ? 0 : 22 }, !done && { color: colors.textFaint }]}>
                {s.label}
              </Text>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  etaRow: { flexDirection: 'row', alignItems: 'center' },
  etaBadge: {
    backgroundColor: colors.violetDim,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    alignItems: 'center',
  },
  etaValue: { color: colors.violetLight, fontSize: 22, fontWeight: '900' },
  etaUnit: { color: colors.textSoft, fontSize: 10, fontWeight: '700' },
  sep: { height: 1, backgroundColor: colors.line, marginVertical: spacing.lg },
  tlDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlDotOn: { backgroundColor: colors.violet, borderColor: colors.violetLight },
  tlPulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  tlLine: { flex: 1, width: 2, backgroundColor: colors.line, marginVertical: 2 },
});
