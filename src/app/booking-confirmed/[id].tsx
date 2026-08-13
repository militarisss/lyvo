import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, glow, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { useBookings } from '@/stores/bookings';
import { useChat } from '@/stores/chat';
import { useToast } from '@/stores/toast';
import { fullDate, mad } from '@/utils/format';

export default function BookingConfirmed() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useBookings((s) => s.bookings.find((b) => b.id === id));
  const openChat = useChat((s) => s.openWithProvider);
  const toast = useToast((s) => s.show);
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 14, speed: 6 }).start();
  }, [scale]);

  if (!booking) {
    return (
      <Screen>
        <EmptyState icon="alert-circle-outline" title="Réservation introuvable" text="Retournez à l’accueil pour continuer." actionLabel="Accueil" onAction={() => router.replace('/(tabs)')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
        <Animated.View style={[styles.check, glow.violet, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark" size={44} color="#fff" />
        </Animated.View>
        <Text style={[type.h1, { marginTop: spacing.xl, textAlign: 'center' }]}>Réservation confirmée !</Text>
        <Text style={[type.bodySoft, { marginTop: spacing.sm, textAlign: 'center' }]}>
          Le prestataire a reçu votre demande. Vous recevrez un rappel avant le rendez-vous.
        </Text>
      </View>

      <Card style={{ marginTop: spacing.xxl }}>
        <Row icon="sparkles-outline" label="Service" value={booking.serviceName} />
        <Row icon="business-outline" label="Prestataire" value={booking.providerName} />
        <Row icon="calendar-outline" label="Date" value={fullDate(booking.date)} />
        <Row icon="time-outline" label="Heure" value={booking.time} />
        <Row icon="location-outline" label="Adresse" value={booking.addressLine} />
        <Row icon="card-outline" label="Paiement" value={booking.paymentMethod} />
        <View style={styles.sep} />
        <View style={styles.totalRow}>
          <Text style={type.h3}>Total payé</Text>
          <Text style={styles.total}>{mad(booking.totalMad)}</Text>
        </View>
      </Card>

      <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
        <Button title="Ajouter au calendrier" icon="calendar-outline" variant="secondary" onPress={() => toast('Événement ajouté à votre calendrier', 'success')} />
        <Button
          title="Contacter le prestataire"
          icon="chatbubble-outline"
          variant="secondary"
          onPress={() => {
            const cid = openChat(booking.providerId);
            router.push(`/chat/${cid}`);
          }}
        />
        <Button title="Voir ma réservation" onPress={() => router.replace('/(tabs)/bookings')} />
        <Button title="Retour à l’accueil" variant="ghost" onPress={() => router.replace('/(tabs)')} />
      </View>
    </Screen>
  );
}

function Row({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color={colors.violetLight} />
      <Text style={[type.small, { width: 84 }]}>{label}</Text>
      <Text style={[type.body, { fontSize: 14, flex: 1, fontWeight: '600' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  check: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sep: { height: 1, backgroundColor: colors.line, marginVertical: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  total: { color: colors.violetLight, fontSize: 20, fontWeight: '900' },
});
