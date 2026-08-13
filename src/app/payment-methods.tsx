import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PAYMENT_METHODS } from '@/services/payment';
import { useToast } from '@/stores/toast';

export default function PaymentMethods() {
  const toast = useToast((s) => s.show);

  return (
    <Screen>
      <Header title="Moyens de paiement" />
      <View style={{ gap: spacing.sm }}>
        {PAYMENT_METHODS.map((m) => (
          <Card key={m.id} style={styles.row}>
            <View style={styles.icon}>
              <Ionicons name={m.icon as keyof typeof Ionicons.glyphMap} size={19} color={colors.violetLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.h3}>{m.label}</Text>
              {m.sub && <Text style={[type.small, { marginTop: 2 }]}>{m.sub}</Text>}
            </View>
            {m.id === 'card' && (
              <Text style={{ color: colors.success, fontSize: 11, fontWeight: '800' }}>Par défaut</Text>
            )}
          </Card>
        ))}
      </View>
      <Button title="Ajouter une carte" icon="add-outline" onPress={() => toast('Ajout de carte — sera branché sur CMI / Stripe', 'info')} style={{ marginTop: spacing.xl }} />
      <Text style={[type.tiny, { textAlign: 'center', marginTop: spacing.lg, lineHeight: 17 }]}>
        Les paiements seront traités par CMI, Stripe ou Payzone via une passerelle sécurisée.{'\n'}Aucune donnée bancaire n’est stockée dans l’application.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
