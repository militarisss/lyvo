import React from 'react';
import { View } from 'react-native';
import { Badge } from './Badge';
import type { Provider } from '@/types/models';
import { spacing } from '@/theme';

const META = {
  toppro: { label: 'Top Pro', tone: 'gold' as const, icon: 'trophy-outline' as const },
  select: { label: 'LYVO Select', tone: 'violet' as const, icon: 'diamond-outline' as const },
  highly: { label: 'Très bien noté', tone: 'success' as const, icon: 'star-outline' as const },
};

/** Rangée de badges de confiance d'un prestataire (Vérifié, Top Pro, Select…). */
export function ProBadges({ provider, wrap = true }: { provider: Provider; wrap?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: wrap ? 'wrap' : 'nowrap', gap: spacing.sm }}>
      {provider.verified && <Badge label="LYVO Verified" tone="violet" icon="shield-checkmark" />}
      {(provider.badges ?? []).map((b) => (
        <Badge key={b} label={META[b].label} tone={META[b].tone} icon={META[b].icon} />
      ))}
    </View>
  );
}
