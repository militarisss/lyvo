import React from 'react';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ProviderCard } from '@/components/ProviderCard';
import { EmptyState } from '@/components/EmptyState';
import { PROVIDERS } from '@/data/providers';
import { useFavorites } from '@/stores/favorites';

export default function Favorites() {
  const ids = useFavorites((s) => s.providerIds);
  const favs = PROVIDERS.filter((p) => ids.includes(p.id));

  return (
    <Screen>
      <Header title="Favoris" />
      {favs.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Aucun favori"
          text="Touchez le cœur sur une fiche prestataire pour la retrouver ici."
          actionLabel="Explorer les services"
          onAction={() => router.push('/(tabs)/explore')}
        />
      ) : (
        favs.map((p) => <ProviderCard key={p.id} provider={p} variant="row" />)
      )}
    </Screen>
  );
}
