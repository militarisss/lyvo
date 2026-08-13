import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Chip } from '@/components/Chip';
import { ProviderCard } from '@/components/ProviderCard';
import { ProviderSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { categoryById } from '@/data/categories';
import { fetchProviders } from '@/services/api';
import type { Provider } from '@/types/models';

export default function CategoryPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = categoryById(id ?? '');
  const [sub, setSub] = useState<string | undefined>();
  const [providers, setProviders] = useState<Provider[] | null>(null);

  useEffect(() => {
    setProviders(null);
    fetchProviders({ categoryId: id, subCategoryId: sub }).then(setProviders);
  }, [id, sub]);

  if (!category) {
    return (
      <Screen>
        <Header title="Catégorie" />
        <EmptyState icon="grid-outline" title="Catégorie introuvable" text="Cette catégorie n’existe pas encore." actionLabel="Explorer" onAction={() => router.replace('/(tabs)/explore')} />
      </Screen>
    );
  }

  return (
    <Screen scroll={false} padded={false}>
      <View style={styles.pad}>
        <Header title={category.name} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }} style={{ flexGrow: 0 }}>
        <Chip label="Tout" active={!sub} onPress={() => setSub(undefined)} />
        {category.subs.map((s) => (
          <Chip key={s.id} label={s.name} active={sub === s.id} onPress={() => setSub(sub === s.id ? undefined : s.id)} />
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.pad, { paddingTop: spacing.lg, paddingBottom: spacing.xxl }]} showsVerticalScrollIndicator={false}>
        {!providers ? (
          <ProviderSkeleton />
        ) : providers.length === 0 ? (
          <EmptyState
            icon="storefront-outline"
            title="Bientôt disponible"
            text={`Les prestataires « ${sub ? category.subs.find((s) => s.id === sub)?.name : category.name} » arrivent très vite sur LYVO.`}
            actionLabel="Voir toute la catégorie"
            onAction={() => setSub(undefined)}
          />
        ) : (
          <>
            <Text style={[type.small, { marginBottom: spacing.md }]}>
              {providers.length} prestataire{providers.length > 1 ? 's' : ''}
            </Text>
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} variant="row" />
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: spacing.lg },
});
