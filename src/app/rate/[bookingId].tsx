import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Stars } from '@/components/Stars';
import { EmptyState } from '@/components/EmptyState';
import { useBookings } from '@/stores/bookings';
import { useWallet } from '@/stores/wallet';
import { useToast } from '@/stores/toast';
import { notifySuccess } from '@/utils/haptics';

const CRITERIA = ['Qualité', 'Ponctualité', 'Professionnalisme', 'Rapport qualité/prix'] as const;

export default function Rate() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const booking = useBookings((s) => s.bookings.find((b) => b.id === bookingId));
  const markRated = useBookings((s) => s.markRated);
  const credit = useWallet((s) => s.credit);
  const toast = useToast((s) => s.show);

  const [overall, setOverall] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [photoAdded, setPhotoAdded] = useState(false);

  if (!booking) {
    return (
      <Screen>
        <Header title="Notation" />
        <EmptyState icon="star-outline" title="Réservation introuvable" text="Impossible de noter cette prestation." actionLabel="Retour" onAction={() => router.back()} />
      </Screen>
    );
  }

  const submit = () => {
    if (overall === 0) {
      toast('Choisissez une note globale', 'error');
      return;
    }
    markRated(booking.id);
    credit(10, `Cashback avis — ${booking.providerName}`, 'cashback');
    notifySuccess();
    toast('Merci ! +10 MAD de cashback ajoutés à votre wallet', 'success');
    router.replace('/(tabs)/bookings');
  };

  return (
    <Screen>
      <Header title="Votre avis" />

      <Card style={{ alignItems: 'center' }}>
        <Text style={type.h2}>{booking.serviceName}</Text>
        <Text style={[type.small, { marginTop: 4 }]}>{booking.providerName}</Text>
        <View style={{ marginTop: spacing.lg }}>
          <Stars rating={overall} onRate={setOverall} size={34} />
        </View>
        <Text style={[type.small, { marginTop: spacing.sm }]}>
          {overall === 0 ? 'Touchez pour noter' : ['', 'Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent !'][overall]}
        </Text>
      </Card>

      <Text style={[type.h2, { marginTop: spacing.xl, marginBottom: spacing.md }]}>En détail</Text>
      <View style={{ gap: spacing.sm }}>
        {CRITERIA.map((c) => (
          <Card key={c} style={styles.critRow}>
            <Text style={[type.body, { fontSize: 14, flex: 1 }]}>{c}</Text>
            <Stars rating={scores[c] ?? 0} onRate={(n) => setScores((s) => ({ ...s, [c]: n }))} size={20} />
          </Card>
        ))}
      </View>

      <Input
        label="Commentaire (optionnel)"
        value={comment}
        onChangeText={setComment}
        placeholder="Partagez votre expérience…"
        multiline
        style={{ marginTop: spacing.xl }}
      />

      <Button
        title={photoAdded ? 'Photo ajoutée ✓' : 'Ajouter une photo'}
        variant="secondary"
        icon="camera-outline"
        onPress={() => setPhotoAdded(true)}
        style={{ marginTop: spacing.lg }}
      />

      <Button title="Publier mon avis" onPress={submit} style={{ marginTop: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  critRow: { flexDirection: 'row', alignItems: 'center' },
});
