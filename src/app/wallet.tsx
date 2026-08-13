import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Sheet } from '@/components/Sheet';
import { Chip } from '@/components/Chip';
import { useWallet } from '@/stores/wallet';
import { useToast } from '@/stores/toast';
import { mad } from '@/utils/format';
import type { WalletTransaction } from '@/types/models';

const KIND_ICON: Record<WalletTransaction['kind'], keyof typeof Ionicons.glyphMap> = {
  cashback: 'refresh-circle-outline',
  topup: 'add-circle-outline',
  payment: 'arrow-up-circle-outline',
  promo: 'pricetag-outline',
  referral: 'gift-outline',
};

export default function Wallet() {
  const { balance, transactions, topUp } = useWallet();
  const toast = useToast((s) => s.show);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [amount, setAmount] = useState(200);

  const cashback = transactions.filter((t) => t.kind === 'cashback' || t.kind === 'referral').reduce((n, t) => n + t.amountMad, 0);
  const promos = transactions.filter((t) => t.kind === 'promo').reduce((n, t) => n + t.amountMad, 0);

  return (
    <Screen>
      <Header title="Wallet LYVO" />

      <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <Text style={styles.cardLabel}>SOLDE DISPONIBLE</Text>
        <Text style={styles.cardValue}>{mad(balance)}</Text>
        <View style={styles.cardRow}>
          <View style={styles.cardStat}>
            <Text style={styles.cardStatValue}>{mad(cashback)}</Text>
            <Text style={styles.cardStatLabel}>Cashback gagné</Text>
          </View>
          <View style={styles.cardStat}>
            <Text style={styles.cardStatValue}>{mad(promos)}</Text>
            <Text style={styles.cardStatLabel}>Crédits promo</Text>
          </View>
        </View>
      </LinearGradient>

      <Button title="Ajouter du crédit" icon="add-outline" onPress={() => setTopUpOpen(true)} style={{ marginTop: spacing.lg }} />

      <Text style={[type.h2, { marginTop: spacing.xl, marginBottom: spacing.md }]}>Historique</Text>
      <View style={{ gap: spacing.sm }}>
        {transactions.map((t) => (
          <View key={t.id} style={styles.tx}>
            <View style={styles.txIcon}>
              <Ionicons name={KIND_ICON[t.kind]} size={17} color={t.amountMad >= 0 ? colors.success : colors.textSoft} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontSize: 14, fontWeight: '600' }]}>{t.label}</Text>
              <Text style={type.tiny}>{t.date}</Text>
            </View>
            <Text style={[styles.txAmount, { color: t.amountMad >= 0 ? colors.success : colors.text }]}>
              {t.amountMad >= 0 ? '+' : ''}
              {mad(t.amountMad)}
            </Text>
          </View>
        ))}
      </View>

      <Sheet visible={topUpOpen} onClose={() => setTopUpOpen(false)} title="Ajouter du crédit">
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          {[100, 200, 500, 1000].map((a) => (
            <Chip key={a} label={mad(a)} active={amount === a} onPress={() => setAmount(a)} />
          ))}
        </View>
        <Button
          title={`Recharger ${mad(amount)}`}
          onPress={() => {
            topUp(amount);
            setTopUpOpen(false);
            toast(`${mad(amount)} ajoutés à votre wallet`, 'success');
          }}
          style={{ marginTop: spacing.xl }}
        />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.xl },
  cardLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  cardValue: { color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 6 },
  cardRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  cardStat: { flex: 1, backgroundColor: 'rgba(6,2,13,0.25)', borderRadius: radius.md, padding: spacing.md },
  cardStatValue: { color: '#fff', fontSize: 16, fontWeight: '800' },
  cardStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  tx: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txAmount: { fontSize: 14, fontWeight: '800' },
});
