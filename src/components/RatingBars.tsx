import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, type } from '@/theme';

/**
 * Répartition 1–5 étoiles dérivée de la note moyenne (mock déterministe,
 * remplacée par les vraies stats côté Supabase en V2).
 */
function distribution(rating: number): number[] {
  const five = Math.round(Math.min(92, 40 + (rating - 4) * 55));
  const four = Math.round((100 - five) * 0.62);
  const three = Math.round((100 - five - four) * 0.55);
  const two = Math.round((100 - five - four - three) * 0.6);
  const one = Math.max(0, 100 - five - four - three - two);
  return [five, four, three, two, one];
}

export function RatingBars({ rating, count }: { rating: number; count: number }) {
  const dist = distribution(rating);
  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <Text style={styles.big}>{rating.toFixed(1)}</Text>
        <View style={{ flexDirection: 'row', gap: 1 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Ionicons key={n} name={n <= Math.round(rating) ? 'star' : 'star-outline'} size={12} color={colors.gold} />
          ))}
        </View>
        <Text style={[type.tiny, { marginTop: 3 }]}>{count} avis</Text>
      </View>
      <View style={styles.bars}>
        {dist.map((pct, i) => (
          <View key={i} style={styles.barRow}>
            <Text style={styles.barLabel}>{5 - i}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.barPct}>{pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing.xl, alignItems: 'center' },
  left: { alignItems: 'center', width: 76 },
  big: { color: colors.text, fontSize: 34, fontWeight: '900', lineHeight: 38 },
  bars: { flex: 1, gap: 5 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barLabel: { color: colors.textFaint, fontSize: 11, fontWeight: '700', width: 8 },
  track: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.cardHi, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: colors.gold },
  barPct: { color: colors.textFaint, fontSize: 10.5, width: 32, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
