import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import type { Provider } from '@/types/models';
import { mad } from '@/utils/format';
import { Card } from './Card';
import { Stars } from './Stars';
import { Badge } from './Badge';

interface Props {
  provider: Provider;
  variant?: 'vertical' | 'row';
  width?: number;
}

export function ProviderCard({ provider: p, variant = 'vertical', width = 220 }: Props) {
  const fromPrice = Math.min(...p.services.map((s) => s.priceMad));
  const open = () => router.push(`/provider/${p.id}`);

  if (variant === 'row') {
    return (
      <Card onPress={open} padded={false} style={styles.rowCard}>
        <Image source={{ uri: p.cover }} style={styles.rowImg} transition={200} />
        <View style={styles.rowBody}>
          <View style={styles.rowTitle}>
            <Text style={[type.h3, { flex: 1 }]} numberOfLines={1}>
              {p.name}
            </Text>
            {p.verified && <Ionicons name="shield-checkmark" size={14} color={colors.violetLight} />}
          </View>
          <Text style={type.small} numberOfLines={1}>
            {p.tagline}
          </Text>
          <View style={styles.rowMeta}>
            <Stars rating={p.rating} count={p.reviewsCount} />
            <Text style={styles.dot}>·</Text>
            <Ionicons name="location-outline" size={12} color={colors.textFaint} />
            <Text style={type.tiny}>{p.distanceKm} km</Text>
          </View>
          <Text style={styles.from}>
            dès <Text style={styles.fromPrice}>{mad(fromPrice)}</Text>
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card onPress={open} padded={false} style={[styles.vCard, { width }]}>
      <View>
        <Image source={{ uri: p.cover }} style={styles.vImg} transition={200} />
        {p.premium && (
          <View style={styles.floatBadge}>
            <Badge label="Premium" tone="gold" icon="diamond-outline" />
          </View>
        )}
        {p.isNew && !p.premium && (
          <View style={styles.floatBadge}>
            <Badge label="Nouveau" tone="violet" icon="sparkles-outline" />
          </View>
        )}
      </View>
      <View style={styles.vBody}>
        <View style={styles.rowTitle}>
          <Text style={[type.h3, { flex: 1, fontSize: 15 }]} numberOfLines={1}>
            {p.name}
          </Text>
          {p.verified && <Ionicons name="shield-checkmark" size={13} color={colors.violetLight} />}
        </View>
        <Text style={type.small} numberOfLines={1}>
          {p.tagline}
        </Text>
        <View style={[styles.rowMeta, { marginTop: 6 }]}>
          <Stars rating={p.rating} />
          <Text style={styles.dot}>·</Text>
          <Text style={type.tiny}>{p.distanceKm} km</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.fromPrice}>{mad(fromPrice)}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  vCard: { marginRight: spacing.md },
  vImg: { width: '100%', height: 118, backgroundColor: colors.cardHi },
  vBody: { padding: spacing.md },
  floatBadge: { position: 'absolute', top: 8, left: 8 },
  rowCard: { flexDirection: 'row', marginBottom: spacing.md },
  rowImg: { width: 104, height: 116, backgroundColor: colors.cardHi },
  rowBody: { flex: 1, padding: spacing.md, justifyContent: 'space-between' },
  rowTitle: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  dot: { color: colors.textFaint, marginHorizontal: 2 },
  from: { color: colors.textSoft, fontSize: 12, marginTop: 4 },
  fromPrice: { color: colors.violetLight, fontWeight: '800', fontSize: 13 },
});
