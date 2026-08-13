import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, gradients, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { CategoryTile } from '@/components/CategoryTile';
import { ProviderCard } from '@/components/ProviderCard';
import { Avatar } from '@/components/Avatar';
import { Skeleton } from '@/components/Skeleton';
import { CATEGORIES } from '@/data/categories';
import { fetchProviders } from '@/services/api';
import type { Provider } from '@/types/models';
import { useUser } from '@/stores/user';
import { useBookings } from '@/stores/bookings';
import { useNotifications } from '@/stores/notifications';
import { useT } from '@/services/i18n';

export default function Home() {
  const { profile, interests } = useUser();
  const bookings = useBookings((s) => s.bookings);
  const unreadNotifs = useNotifications((s) => s.items.filter((n) => !n.read).length);
  const { t } = useT();
  const [providers, setProviders] = useState<Provider[] | null>(null);

  useEffect(() => {
    fetchProviders().then(setProviders);
  }, []);

  const near = providers ? [...providers].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6) : [];
  const topRated = providers ? [...providers].sort((a, b) => b.rating - a.rating).slice(0, 6) : [];
  const premium = providers ? providers.filter((p) => p.premium) : [];
  const fresh = providers ? providers.filter((p) => p.isNew) : [];
  const recommended = providers
    ? providers.filter((p) => interests.includes(p.categoryId) || interests.includes(p.subCategoryId)).slice(0, 6)
    : [];
  const rebook = bookings
    .filter((b) => b.status === 'done')
    .map((b) => providers?.find((p) => p.id === b.providerId))
    .filter(Boolean) as Provider[];

  return (
    <Screen padded={false}>
      <View style={styles.pad}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={type.small}>
              {t('hello')} 👋
            </Text>
            <Text style={[type.h1, { marginTop: 2 }]}>{profile.firstName}</Text>
          </View>
          <Pressable onPress={() => router.push('/notifications')} style={styles.bell}>
            <Ionicons name="notifications-outline" size={21} color={colors.text} />
            {unreadNotifs > 0 && <View style={styles.bellDot} />}
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <Avatar uri={profile.avatar} name={`${profile.firstName} ${profile.lastName}`} size={44} ring />
          </Pressable>
        </View>

        <SearchBar placeholder={t('search_placeholder')} onPress={() => router.push('/(tabs)/explore')} style={{ marginTop: spacing.lg }} />
      </View>

      {/* Catégories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm, marginTop: spacing.xl }}>
        {CATEGORIES.map((c) => (
          <CategoryTile key={c.id} category={c} onPress={() => router.push(`/category/${c.id}`)} />
        ))}
      </ScrollView>

      {/* Offre du moment */}
      <View style={styles.pad}>
        <Pressable onPress={() => router.push('/provider/atlas-detailing')}>
          <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.offer}>
            <View style={{ flex: 1 }}>
              <View style={styles.offerBadge}>
                <Ionicons name="flash" size={11} color={colors.gold} />
                <Text style={styles.offerBadgeText}>OFFRE DU MOMENT</Text>
              </View>
              <Text style={[type.h2, { marginTop: spacing.md }]}>-20 % sur le detailing auto</Text>
              <Text style={[type.small, { marginTop: 4 }]}>Atlas Detailing · jusqu’à dimanche</Text>
            </View>
            <View style={styles.offerArrow}>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Sections */}
      <HomeSection title="Près de vous" data={near} loading={!providers} onSeeAll={() => router.push('/(tabs)/explore')} />
      {recommended.length > 0 && <HomeSection title="Recommandé pour vous" data={recommended} loading={false} />}
      <HomeSection title="Les mieux notés" data={topRated} loading={!providers} />
      {rebook.length > 0 && <HomeSection title="Réserver à nouveau" data={rebook} loading={false} />}
      <HomeSection title="Expériences premium" data={premium} loading={!providers} wide />
      {fresh.length > 0 && <HomeSection title="Nouveautés" data={fresh} loading={false} />}

      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

function HomeSection({
  title,
  data,
  loading,
  onSeeAll,
  wide,
}: {
  title: string;
  data: Provider[];
  loading: boolean;
  onSeeAll?: () => void;
  wide?: boolean;
}) {
  if (!loading && data.length === 0) return null;
  return (
    <View>
      <View style={styles.pad}>
        <SectionHeader title={title} onSeeAll={onSeeAll} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
        {loading
          ? [0, 1, 2].map((i) => <Skeleton key={i} width={220} height={196} style={{ marginRight: spacing.md }} />)
          : data.map((p) => <ProviderCard key={p.id} provider={p} width={wide ? 280 : 220} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bell: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.magenta,
    borderWidth: 1.5,
    borderColor: colors.card,
  },
  offer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(240,197,104,0.12)',
    paddingHorizontal: 9,
    height: 22,
    borderRadius: radius.full,
  },
  offerBadgeText: { color: colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  offerArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
