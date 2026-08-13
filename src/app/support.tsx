import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Sheet } from '@/components/Sheet';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useBookings } from '@/stores/bookings';
import { useToast } from '@/stores/toast';
import { tapLight } from '@/utils/haptics';

const FAQ = [
  { q: 'Comment annuler une réservation ?', a: 'Depuis l’onglet Réservations → votre réservation → Annuler. Gratuit jusqu’à 2 h avant le rendez-vous.' },
  { q: 'Quand suis-je débité ?', a: 'Au moment de la confirmation. En espèces, vous payez le prestataire à la fin de la prestation.' },
  { q: 'Les prestataires sont-ils vérifiés ?', a: 'Chaque prestataire « Vérifié » a fourni ses documents et passé un entretien avec l’équipe LYVO.' },
  { q: 'Comment fonctionne le cashback ?', a: 'Après chaque prestation notée, un pourcentage revient dans votre Wallet LYVO.' },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [message, setMessage] = useState('');
  const bookings = useBookings((s) => s.bookings);
  const toast = useToast((s) => s.show);
  const lastBooking = bookings[0];

  return (
    <Screen>
      <Header title="Aide & support" />

      <View style={styles.contactRow}>
        <Contact icon="chatbubbles-outline" label="Chat" onPress={() => toast('Chat support ouvert (démo)', 'info')} />
        <Contact icon="logo-whatsapp" label="WhatsApp" onPress={() => toast('WhatsApp +212 6 00 00 00 00 (démo)', 'info')} />
        <Contact icon="call-outline" label="Téléphone" onPress={() => toast('05 22 00 00 00 (démo)', 'info')} />
        <Contact icon="mail-outline" label="Email" onPress={() => toast('support@lyvo.ma (démo)', 'info')} />
      </View>

      <Text style={[type.h2, { marginTop: spacing.xl, marginBottom: spacing.md }]}>Questions fréquentes</Text>
      <View style={{ gap: spacing.sm }}>
        {FAQ.map((f, i) => (
          <Card
            key={f.q}
            onPress={() => {
              tapLight();
              setOpenFaq(openFaq === i ? null : i);
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[type.h3, { flex: 1, fontSize: 14.5 }]}>{f.q}</Text>
              <Ionicons name={openFaq === i ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textFaint} />
            </View>
            {openFaq === i && <Text style={[type.bodySoft, { marginTop: spacing.sm, fontSize: 14 }]}>{f.a}</Text>}
          </Card>
        ))}
      </View>

      <Button title="Signaler un problème avec une réservation" variant="secondary" icon="flag-outline" onPress={() => setReportOpen(true)} style={{ marginTop: spacing.xl }} />

      <Sheet visible={reportOpen} onClose={() => setReportOpen(false)} title="Signaler un problème">
        {lastBooking && (
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={type.h3}>{lastBooking.serviceName}</Text>
            <Text style={[type.small, { marginTop: 2 }]}>
              {lastBooking.providerName} · {lastBooking.date} {lastBooking.time}
            </Text>
          </Card>
        )}
        <Input label="Décrivez le problème" value={message} onChangeText={setMessage} placeholder="Que s’est-il passé ?" multiline />
        <Button
          title="Envoyer"
          onPress={() => {
            if (message.trim().length < 10) {
              toast('Décrivez le problème en quelques mots (10 caractères min.)', 'error');
              return;
            }
            setReportOpen(false);
            setMessage('');
            toast('Signalement envoyé — réponse sous 2 h ouvrées', 'success');
          }}
          style={{ marginTop: spacing.xl }}
        />
      </Sheet>
    </Screen>
  );
}

function Contact({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={({ pressed }) => [styles.contact, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icon} size={21} color={colors.violetLight} />
      <Text style={styles.contactLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contactRow: { flexDirection: 'row', gap: spacing.sm },
  contact: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
  },
  contactLabel: { color: colors.text, fontSize: 11.5, fontWeight: '700' },
});
