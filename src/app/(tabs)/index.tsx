import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, gradients, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { FadeInUp, PopIn, Pulse } from '@/components/Animate';
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
  const { profile, interests, addresses, defaultAddressId } = useUser();
  const bookings = useBookings((s) => s.bookings);
  const unreadNotifs = useNotifications((s) => s.items.filter((n) => !n.read).length);
  const { t } = useT();
  const [providers, setProviders] = useState<Provider[] | null>(null);

  useEffect(() => {
    fetchProviders().then(setProviders);
  }, []);

  const currentAddress = (() => {
    const a = addresses.find((x) => x.id === defaultAddressId) ?? addresses[0];
    return a ? `${a.line.split(',').pop()?.trim() ?? a.line}, ${a.city}` : 'Casablanca';
  })();

  const activeBooking = bookings.find((b) => b.status === 'enroute' || b.status === 'inprogress');

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
        <FadeInUp>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={type.h1}>
                {t('hello')} {profile.firstName} 👋
              </Text>
              <Text style={[type.small, { marginTop: 3 }]}>Que peut faire LYVO pour vous aujourd’hui ?</Text>
            </View>
            <Pressable onPress={() => router.push('/notifications')} style={styles.bell}>
              <Ionicons name="notifications-outline" size={21} color={colors.text} />
              {unreadNotifs > 0 && <View style={styles.bellDot} />}
            </Pressable>
            <Pressable onPress={() => router.push('/(tabs)/profile')}>
              <Avatar uri={profile.avatar} name={`${profile.firstName} ${profile.lastName}`} size={44} ring />
            </Pressable>
          </View>
          <Pressable onPress={() => router.push('/addresses')} style={styles.locRow}>
            <Ionicons name="location" size={13} color={colors.violetLight} />
            <Text style={styles.locText}>{currentAddress}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.textFaint} />
          </Pressable>
        </FadeInUp>

        <FadeInUp delay={90}>
          <SearchBar placeholder="De quoi avez-vous besoin ?" onPress={() => router.push('/(tabs)/explore')} style={{ marginTop: spacing.lg }} />
        </FadeInUp>

        {/* Réservation en cours */}
        {activeBooking && (
          <FadeInUp delay={140}>
            <Pressable onPress={() => router.push(activeBooking.trackable ? `/tracking/${activeBooking.id}` : '/(tabs)/bookings')} style={styles.liveCard}>
              <View style={styles.livePulse} />
              <View style={{ flex: 1 }}>
                <Text style={styles.liveTitle}>
                  {activeBooking.status === 'enroute' ? 'Votre pro arrive dans ~12 min' : 'Prestation en cours'}
                </Text>
                <Text style={[type.small, { marginTop: 2 }]} numberOfLines={1}>
                  {activeBooking.serviceName} · {activeBooking.providerName}
                </Text>
              </View>
              <View style={styles.liveCta}>
                <Text style={styles.liveCtaText}>Suivre</Text>
                <Ionicons name="chevron-forward" size={13} color={colors.gold} />
              </View>
            </Pressable>
          </FadeInUp>
        )}
      </View>

      {/* Catégories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm, marginTop: spacing.xl }}>
        {CATEGORIES.map((c, i) => (
          <PopIn key={c.id} delay={160 + i * 55}>
            <CategoryTile category={c} onPress={() => router.push(`/category/${c.id}`)} />
          </PopIn>
        ))}
      </ScrollView>

      {/* Offre du moment */}
      <View style={styles.pad}>
        <FadeInUp delay={300}>
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
              <Pulse>
                <View style={styles.offerArrow}>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </View>
              </Pulse>
            </LinearGradient>
          </Pressable>
        </FadeInUp>
      </View>

      {/* Sections */}
      <HomeSection title="Près de vous" data={near} loading={!providers} onSeeAll={() => router.push('/(tabs)/explore')} delay={0} />
      {recommended.length > 0 && <HomeSection title="Recommandé pour vous" data={recommended} loading={false} delay={110} />}
      <HomeSection title="Les mieux notés" data={topRated} loading={!providers} delay={220} />
      {rebook.length > 0 && <HomeSection title="Réserver à nouveau" data={rebook} loading={false} delay={330} />}

      {/* Bannière LYVO+ */}
      <View style={styles.pad}>
        <FadeInUp delay={380}>
          <Pressable onPress={() => router.push('/plus')}>
            <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.plusBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.plusTitle}>LYVO+</Text>
                <Text style={styles.plusSub}>Frais réduits, réservation prioritaire, cashback ×2 — 99 MAD/mois</Text>
              </View>
              <View style={styles.plusCta}>
                <Text style={styles.plusCtaText}>Découvrir</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </FadeInUp>
      </View>

      <HomeSection title="LYVO Select" data={premium} loading={!providers} wide delay={440} />
      {fresh.length > 0 && <HomeSection title="Nouveautés" data={fresh} loading={false} delay={550} />}

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
  delay = 0,
}: {
  title: string;
  data: Provider[];
  loading: boolean;
  onSeeAll?: () => void;
  wide?: boolean;
  delay?: number;
}) {
  if (!loading && data.length === 0) return null;
  return (
    <FadeInUp delay={delay} distance={26}>
      <View style={styles.pad}>
        <SectionHeader title={title} onSeeAll={onSeeAll} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
        {loading
          ? [0, 1, 2].map((i) => <Skeleton key={i} width={220} height={196} style={{ marginRight: spacing.md }} />)
          : data.map((p, i) => (
              <FadeInUp key={p.id} delay={delay + 80 + i * 70} distance={0}>
                <ProviderCard provider={p} width={wide ? 280 : 220} />
              </FadeInUp>
            ))}
      </ScrollView>
    </FadeInUp>
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
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.md, alignSelf: 'flex-start' },
  locText: { color: colors.textSoft, fontSize: 13, fontWeight: '600' },
  liveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(240,197,104,0.4)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  livePulse: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.gold },
  liveTitle: { color: colors.gold, fontSize: 14, fontWeight: '800' },
  liveCta: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  liveCtaText: { color: colors.gold, fontSize: 13, fontWeight: '800' },
  plusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  plusTitle: { color: '#fff', fontSize: 19, fontWeight: '900', letterSpacing: 1 },
  plusSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12.5, marginTop: 4, lineHeight: 17 },
  plusCta: { backgroundColor: 'rgba(6,2,13,0.35)', borderRadius: radius.full, paddingHorizontal: spacing.lg, paddingVertical: 9 },
  plusCtaText: { color: '#fff', fontSize: 13, fontWeight: '800' },
});
