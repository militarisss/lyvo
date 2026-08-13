import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FadeInUp } from '@/components/Animate';
import { useToast } from '@/stores/toast';
import { notifySuccess } from '@/utils/haptics';

const PERKS = [
  { icon: 'trending-down-outline', title: 'Frais de service offerts', sub: '0 MAD de frais LYVO sur toutes vos réservations' },
  { icon: 'flash-outline', title: 'Réservation prioritaire', sub: 'Vos demandes passent en tête de file' },
  { icon: 'diamond-outline', title: 'Accès LYVO Select', sub: 'Les prestataires d’exception, réservés aux membres' },
  { icon: 'refresh-circle-outline', title: 'Cashback ×2', sub: '2 % reversés dans votre wallet après chaque prestation' },
  { icon: 'headset-outline', title: 'Concierge dédié', sub: 'Une ligne prioritaire 7j/7, réponse en moins de 5 min' },
  { icon: 'pricetag-outline', title: 'Offres exclusives', sub: 'Ventes privées et avant-premières partenaires' },
] as const;

export default function LyvoPlus() {
  const toast = useToast((s) => s.show);
  const [joined, setJoined] = useState(false);

  return (
    <Screen>
      <Header title="LYVO+" />

      <FadeInUp>
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroBadge}>
            <Ionicons name="diamond" size={12} color="#fff" />
            <Text style={styles.heroBadgeText}>MEMBRE PREMIUM</Text>
          </View>
          <Text style={styles.heroTitle}>LYVO+</Text>
          <Text style={styles.heroSub}>Le service, sans compromis.</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>99 MAD</Text>
            <Text style={styles.priceUnit}>/ mois · sans engagement</Text>
          </View>
        </LinearGradient>
      </FadeInUp>

      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        {PERKS.map((perk, i) => (
          <FadeInUp key={perk.title} delay={120 + i * 70}>
            <Card style={styles.perk}>
              <View style={styles.perkIcon}>
                <Ionicons name={perk.icon} size={19} color={colors.violetLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>{perk.title}</Text>
                <Text style={[type.small, { marginTop: 2 }]}>{perk.sub}</Text>
              </View>
            </Card>
          </FadeInUp>
        ))}
      </View>

      <FadeInUp delay={600}>
        <Card style={{ marginTop: spacing.xl }}>
          <Text style={type.h3}>Rentabilisé dès la 2ᵉ réservation</Text>
          <Text style={[type.small, { marginTop: 6, lineHeight: 19 }]}>
            Un membre LYVO+ économise en moyenne 160 MAD par mois entre les frais offerts, le cashback doublé et les offres
            exclusives.
          </Text>
        </Card>
      </FadeInUp>

      <Button
        title={joined ? 'Vous êtes sur la liste ✓' : 'Rejoindre la liste d’attente'}
        disabled={joined}
        onPress={() => {
          setJoined(true);
          notifySuccess();
          toast('Bienvenue sur la liste LYVO+ — lancement bientôt à Casablanca', 'success');
        }}
        style={{ marginTop: spacing.xl }}
      />
      <Text style={[type.tiny, { textAlign: 'center', marginTop: spacing.md }]}>
        Lancement prévu à Casablanca, puis Rabat et Marrakech. Annulable à tout moment.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: spacing.xl, paddingVertical: spacing.xxl },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(6,2,13,0.3)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    height: 24,
  },
  heroBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: '900', letterSpacing: 1, marginTop: spacing.lg },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: spacing.lg },
  price: { color: '#fff', fontSize: 24, fontWeight: '900' },
  priceUnit: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  perkIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
