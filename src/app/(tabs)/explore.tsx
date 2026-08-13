import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { Sheet } from '@/components/Sheet';
import { ProviderCard } from '@/components/ProviderCard';
import { ProviderSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { CATEGORIES } from '@/data/categories';
import { fetchProviders, searchSuggestions, type SearchFilters, type SortKey } from '@/services/api';
import type { Provider } from '@/types/models';

const HISTORY: string[] = ['Barbier', 'Massage duo', 'Chef à domicile'];

export default function Explore() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [category, setCategory] = useState<string | undefined>(params.category);
  const [results, setResults] = useState<Provider[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('pertinence');
  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    if (params.category) setCategory(params.category);
  }, [params.category]);

  useEffect(() => {
    setLoading(true);
    fetchProviders({ ...filters, categoryId: category, query: submitted || undefined }, sort).then((r) => {
      setResults(r);
      setLoading(false);
    });
  }, [category, submitted, filters, sort]);

  const suggestions = useMemo(() => searchSuggestions(query), [query]);
  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== false).length;

  const submitSearch = (q: string) => {
    setQuery(q);
    setSubmitted(q);
    if (q && !HISTORY.includes(q)) HISTORY.unshift(q);
  };

  return (
    <Screen scroll={false} padded={false}>
      <View style={styles.pad}>
        <Text style={type.h1}>Explorer</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, alignItems: 'center' }}>
          <SearchBar
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              if (!t) setSubmitted('');
            }}
            onSubmit={() => submitSearch(query)}
            placeholder="Rechercher un service, une activité…"
            style={{ flex: 1 }}
          />
          <Pressable onPress={() => setFiltersOpen(true)} style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={colors.text} />
            {activeFilterCount > 0 && (
              <View style={styles.filterDot}>
                <Text style={styles.filterDotText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* suggestions instantanées */}
      {query.length > 0 && query !== submitted && suggestions.length > 0 && (
        <View style={[styles.pad, { marginTop: spacing.sm }]}>
          {suggestions.map((s) => (
            <Pressable key={s} onPress={() => submitSearch(s)} style={styles.suggestion}>
              <Ionicons name="search-outline" size={14} color={colors.textFaint} />
              <Text style={[type.body, { fontSize: 14 }]}>{s}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* historique */}
      {!query && !submitted && !category && (
        <View style={[styles.pad, { marginTop: spacing.md }]}>
          <Text style={type.label}>Recherches récentes</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
            {HISTORY.slice(0, 5).map((h) => (
              <Chip key={h} label={h} icon="time-outline" onPress={() => submitSearch(h)} />
            ))}
          </View>
        </View>
      )}

      {/* catégories */}
      <View style={{ marginTop: spacing.md }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
          <Chip label="Tout" active={!category} onPress={() => setCategory(undefined)} />
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={c.name} active={category === c.id} onPress={() => setCategory(category === c.id ? undefined : c.id)} />
          ))}
        </ScrollView>
      </View>

      {/* bascule liste / carte */}
      <View style={[styles.pad, styles.viewRow]}>
        <Text style={type.small}>{loading ? 'Recherche…' : `${results?.length ?? 0} prestataire${(results?.length ?? 0) > 1 ? 's' : ''}`}</Text>
        <Pressable onPress={() => setShowMap((m) => !m)} style={styles.mapToggle}>
          <Ionicons name={showMap ? 'list-outline' : 'map-outline'} size={15} color={colors.violetLight} />
          <Text style={styles.mapToggleText}>{showMap ? 'Afficher la liste' : 'Afficher sur la carte'}</Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.pad, { paddingBottom: spacing.xxl }]} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ProviderSkeleton />
        ) : showMap ? (
          <View>
            <MapPlaceholder
              height={280}
              pins={(results ?? []).slice(0, 6).map((p, i) => ({
                left: `${18 + ((i * 13) % 62)}%` as `${number}%`,
                top: `${20 + ((i * 17) % 58)}%` as `${number}%`,
                label: p.name,
                accent: p.premium,
              }))}
            />
            <Text style={[type.tiny, { textAlign: 'center', marginTop: spacing.md }]}>
              Carte de démonstration — Google Maps / Mapbox sera branché ici.
            </Text>
          </View>
        ) : (results ?? []).length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="Aucun résultat"
            text="Essayez d’élargir vos filtres ou de modifier votre recherche."
            actionLabel="Réinitialiser les filtres"
            onAction={() => {
              setFilters({});
              setCategory(undefined);
              submitSearch('');
            }}
          />
        ) : (
          (results ?? []).map((p) => <ProviderCard key={p.id} provider={p} variant="row" />)
        )}
      </ScrollView>

      {/* Sheet filtres */}
      <Sheet visible={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filtres">
        <FilterContent
          filters={filters}
          sort={sort}
          onApply={(f, s) => {
            setFilters(f);
            setSort(s);
            setFiltersOpen(false);
          }}
        />
      </Sheet>
    </Screen>
  );
}

function FilterContent({
  filters,
  sort,
  onApply,
}: {
  filters: SearchFilters;
  sort: SortKey;
  onApply: (f: SearchFilters, s: SortKey) => void;
}) {
  const [f, setF] = useState<SearchFilters>(filters);
  const [s, setS] = useState<SortKey>(sort);

  return (
    <View>
      <Text style={[type.label, { marginBottom: spacing.md }]}>Trier par</Text>
      <View style={styles.chipRow}>
        {(
          [
            ['pertinence', 'Pertinence'],
            ['distance', 'Distance'],
            ['rating', 'Note'],
            ['price', 'Prix'],
          ] as [SortKey, string][]
        ).map(([k, label]) => (
          <Chip key={k} label={label} active={s === k} onPress={() => setS(k)} />
        ))}
      </View>

      <Text style={[type.label, { marginVertical: spacing.md }]}>Distance max</Text>
      <View style={styles.chipRow}>
        {[2, 5, 10].map((km) => (
          <Chip
            key={km}
            label={`< ${km} km`}
            active={f.maxDistanceKm === km}
            onPress={() => setF({ ...f, maxDistanceKm: f.maxDistanceKm === km ? undefined : km })}
          />
        ))}
      </View>

      <Text style={[type.label, { marginVertical: spacing.md }]}>Budget max</Text>
      <View style={styles.chipRow}>
        {[150, 400, 1000].map((p) => (
          <Chip
            key={p}
            label={`≤ ${p} MAD`}
            active={f.maxPriceMad === p}
            onPress={() => setF({ ...f, maxPriceMad: f.maxPriceMad === p ? undefined : p })}
          />
        ))}
      </View>

      <Text style={[type.label, { marginVertical: spacing.md }]}>Disponibilité & lieu</Text>
      <View style={styles.chipRow}>
        <Chip label="Ouvert maintenant" icon="time-outline" active={!!f.openNow} onPress={() => setF({ ...f, openNow: !f.openNow || undefined })} />
        <Chip label="Note ≥ 4,8" icon="star-outline" active={f.minRating === 4.8} onPress={() => setF({ ...f, minRating: f.minRating ? undefined : 4.8 })} />
        <Chip label="À domicile" icon="home-outline" active={!!f.atHome} onPress={() => setF({ ...f, atHome: !f.atHome || undefined })} />
        <Chip label="Chez le prestataire" icon="storefront-outline" active={!!f.atProvider} onPress={() => setF({ ...f, atProvider: !f.atProvider || undefined })} />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl }}>
        <Button title="Réinitialiser" variant="ghost" onPress={() => onApply({}, 'pertinence')} style={{ flex: 1 }} />
        <Button title="Appliquer" onPress={() => onApply(f, s)} style={{ flex: 2 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: spacing.lg },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.magenta,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDotText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10 },
  viewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: spacing.md },
  mapToggle: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  mapToggleText: { color: colors.violetLight, fontSize: 13, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
