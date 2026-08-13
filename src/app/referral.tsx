import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { REFERRAL_CODE, REFERRAL_REWARD_MAD } from '@/data/seed';
import { useToast } from '@/stores/toast';
import { mad } from '@/utils/format';

export default function Referral() {
  const toast = useToast((s) => s.show);

  return (
    <Screen>
      <Header title="Invitez vos amis" />

      <View style={styles.hero}>
        <View style={styles.gift}>
          <Ionicons name="gift-outline" size={38} color={colors.violetLight} />
        </View>
        <Text style={[type.h1, { textAlign: 'center', marginTop: spacing.lg }]}>
          Gagnez {mad(REFERRAL_REWARD_MAD)} par ami invité
        </Text>
        <Text style={[type.bodySoft, { textAlign: 'center', marginTop: spacing.sm }]}>
          Votre ami reçoit {mad(REFERRAL_REWARD_MAD)} et vous recevez {mad(REFERRAL_REWARD_MAD)} après sa première réservation.
        </Text>
      </View>

      <Card style={{ marginTop: spacing.xl, alignItems: 'center' }}>
        <Text style={type.label}>Votre code de parrainage</Text>
        <Text style={styles.code}>{REFERRAL_CODE}</Text>
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
        <Button title="Copier" icon="copy-outline" variant="secondary" onPress={() => toast('Code copié !', 'success')} style={{ flex: 1 }} />
        <Button title="Partager" icon="share-social-outline" onPress={() => toast('Partage ouvert (démo)', 'info')} style={{ flex: 1 }} />
      </View>

      <Text style={[type.h2, { marginTop: spacing.xxl, marginBottom: spacing.md }]}>Comment ça marche</Text>
      {[
        ['1', 'Partagez votre code avec vos proches'],
        ['2', 'Ils s’inscrivent et réservent une première prestation'],
        ['3', `Vous recevez chacun ${mad(REFERRAL_REWARD_MAD)} dans votre wallet`],
      ].map(([n, text]) => (
        <View key={n} style={styles.step}>
          <View style={styles.stepNum}>
            <Text style={{ color: colors.violetLight, fontWeight: '800' }}>{n}</Text>
          </View>
          <Text style={[type.body, { flex: 1, fontSize: 14 }]}>{text}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: spacing.lg },
  gift: {
    width: 84,
    height: 84,
    borderRadius: radius.xl,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: { color: colors.violetLight, fontSize: 26, fontWeight: '900', letterSpacing: 3, marginTop: spacing.sm },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
