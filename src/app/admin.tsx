import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, type } from '@/theme';
import { Badge, STATUS_META } from '@/components/Badge';
import { Logo } from '@/components/Logo';
import { PROVIDERS } from '@/data/providers';
import { useBookings } from '@/stores/bookings';
import { mad, shortDate } from '@/utils/format';
import { tapLight } from '@/utils/haptics';

type Tab = 'dashboard' | 'orders' | 'providers' | 'support';

const TABS: { id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { id: 'orders', label: 'Commandes', icon: 'receipt-outline' },
  { id: 'providers', label: 'Prestataires', icon: 'people-outline' },
  { id: 'support', label: 'Support', icon: 'help-buoy-outline' },
];

const WEEK_GMV = [24800, 31200, 27400, 35600, 41200, 38900, 34250];

const TICKETS = [
  { id: 'T-2201', user: 'Imane K.', subject: 'Remboursement prestation annulée', status: 'Ouvert', tone: 'warning' as const, time: 'Il y a 25 min' },
  { id: 'T-2199', user: 'Omar L.', subject: 'Prestataire en retard — geste commercial', status: 'En cours', tone: 'violet' as const, time: 'Il y a 2 h' },
  { id: 'T-2194', user: 'Ghita B.', subject: 'Facture entreprise (TVA)', status: 'Résolu', tone: 'success' as const, time: 'Hier' },
];

export default function Admin() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [tab, setTab] = useState<Tab>('dashboard');
  const bookings = useBookings((s) => s.bookings);

  return (
    <View style={styles.root}>
      {/* top bar */}
      <View style={[styles.topbar, { paddingTop: insets.top + 10 }]}>
        <View style={styles.container}>
          <View style={styles.topbarRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Logo size="sm" />
              <Text style={styles.topbarTag}>Back-office</Text>
            </View>
            <Pressable onPress={() => router.replace('/(tabs)')} style={styles.backApp}>
              <Ionicons name="phone-portrait-outline" size={14} color={colors.violetLight} />
              <Text style={styles.backAppText}>Retour à l’app</Text>
            </Pressable>
          </View>
          {/* tabs */}
          <View style={styles.tabs}>
            {TABS.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => {
                  tapLight();
                  setTab(t.id);
                }}
                style={[styles.tab, tab === t.id && styles.tabOn]}>
                <Ionicons name={t.icon} size={15} color={tab === t.id ? '#fff' : colors.textSoft} />
                <Text style={[styles.tabText, tab === t.id && { color: '#fff' }]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { paddingVertical: spacing.xl, paddingBottom: spacing.xxxl }]}>
        {tab === 'dashboard' && (
          <>
            <Text style={type.h1}>Aujourd’hui à Casablanca</Text>
            <Text style={[type.small, { marginTop: 4 }]}>Samedi 9 août 2026 · données de démonstration</Text>

            <View style={[styles.grid, { marginTop: spacing.xl }]}>
              <StatCard wide={wide} label="Commandes du jour" value="128" trend="+12 % vs sam. dernier" up />
              <StatCard wide={wide} label="Volume d’affaires" value={mad(34250)} trend="+8 %" up />
              <StatCard wide={wide} label="Utilisateurs actifs" value="4 812" trend="+214 cette semaine" up />
              <StatCard wide={wide} label="Prestataires en ligne" value={`${PROVIDERS.length * 14}`} trend={`${PROVIDERS.length} enseignes`} />
              <StatCard wide={wide} label="Taux de complétion" value="96,4 %" trend="-0,3 pt" />
              <StatCard wide={wide} label="Note moyenne" value="★ 4,8" trend="sur 2 130 avis ce mois" />
            </View>

            <View style={[styles.panel, { marginTop: spacing.lg }]}>
              <Text style={type.h3}>Volume d’affaires — 7 derniers jours</Text>
              <View style={styles.chart}>
                {WEEK_GMV.map((v, i) => (
                  <View key={i} style={styles.chartCol}>
                    <Text style={styles.chartValue}>{Math.round(v / 1000)}k</Text>
                    <View style={[styles.chartBar, { height: (v / 45000) * 120 }, i === 6 && { backgroundColor: colors.violetLight }]} />
                    <Text style={styles.chartDay}>{['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][i]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {tab === 'orders' && (
          <>
            <Text style={type.h1}>Commandes</Text>
            <Text style={[type.small, { marginTop: 4, marginBottom: spacing.xl }]}>
              {bookings.length} réservations récentes (données de la session en cours)
            </Text>
            {bookings.map((b) => (
              <View key={b.id} style={styles.row}>
                <View style={{ flex: 2, minWidth: 160 }}>
                  <Text style={[type.h3, { fontSize: 14.5 }]} numberOfLines={1}>{b.serviceName}</Text>
                  <Text style={type.tiny}>{b.id.toUpperCase()} · {b.providerName}</Text>
                </View>
                <Text style={[type.small, { flex: 1.4 }]} numberOfLines={1}>{b.addressLine}</Text>
                <Text style={[type.small, { flex: 1 }]}>{shortDate(b.date)} · {b.time}</Text>
                <Text style={[type.small, { width: 84, fontWeight: '800', color: colors.text, textAlign: 'right' }]}>{mad(b.totalMad)}</Text>
                <View style={{ width: 100, alignItems: 'flex-end' }}>
                  <Badge label={STATUS_META[b.status].label} tone={STATUS_META[b.status].tone} />
                </View>
              </View>
            ))}
          </>
        )}

        {tab === 'providers' && (
          <>
            <Text style={type.h1}>Prestataires</Text>
            <Text style={[type.small, { marginTop: 4, marginBottom: spacing.xl }]}>{PROVIDERS.length} enseignes actives</Text>
            {PROVIDERS.map((p) => (
              <View key={p.id} style={styles.row}>
                <View style={{ flex: 2, minWidth: 160 }}>
                  <Text style={[type.h3, { fontSize: 14.5 }]} numberOfLines={1}>{p.name}</Text>
                  <Text style={type.tiny}>{p.city} · {p.subCategoryId}</Text>
                </View>
                <Text style={[type.small, { flex: 1 }]}>★ {p.rating.toFixed(1)} ({p.reviewsCount})</Text>
                <Text style={[type.small, { flex: 1 }]}>{(p.missionsCount ?? 0).toLocaleString('fr-FR')} missions</Text>
                <View style={{ width: 110, alignItems: 'flex-end' }}>
                  {p.verified ? <Badge label="Vérifié" tone="success" icon="shield-checkmark" /> : <Badge label="En attente" tone="warning" />}
                </View>
              </View>
            ))}
          </>
        )}

        {tab === 'support' && (
          <>
            <Text style={type.h1}>Tickets support</Text>
            <Text style={[type.small, { marginTop: 4, marginBottom: spacing.xl }]}>SLA moyen : 1 h 42 · satisfaction 94 %</Text>
            {TICKETS.map((t) => (
              <View key={t.id} style={styles.row}>
                <View style={{ flex: 2, minWidth: 180 }}>
                  <Text style={[type.h3, { fontSize: 14.5 }]} numberOfLines={1}>{t.subject}</Text>
                  <Text style={type.tiny}>{t.id} · {t.user}</Text>
                </View>
                <Text style={[type.small, { flex: 1 }]}>{t.time}</Text>
                <View style={{ width: 100, alignItems: 'flex-end' }}>
                  <Badge label={t.status} tone={t.tone} />
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, trend, up, wide }: { label: string; value: string; trend?: string; up?: boolean; wide: boolean }) {
  return (
    <View style={[styles.statCard, { width: wide ? '31.5%' : '47.5%' }]}>
      <Text style={type.label}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {trend && (
        <Text style={[type.tiny, up && { color: colors.success }]}>
          {up ? '▲ ' : ''}
          {trend}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  container: { width: '100%', maxWidth: 1080, alignSelf: 'center', paddingHorizontal: spacing.xl },
  topbar: { backgroundColor: colors.bg2, borderBottomWidth: 1, borderBottomColor: colors.line },
  topbarRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topbarTag: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  backApp: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backAppText: { color: colors.violetLight, fontSize: 13, fontWeight: '700' },
  tabs: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, paddingBottom: spacing.md },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: spacing.lg,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tabOn: { backgroundColor: colors.violet, borderColor: colors.violetLight },
  tabText: { color: colors.textSoft, fontSize: 13, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 6,
    flexGrow: 1,
  },
  statValue: { color: colors.text, fontSize: 26, fontWeight: '900', fontVariant: ['tabular-nums'] },
  panel: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 170, marginTop: spacing.xl },
  chartCol: { alignItems: 'center', gap: 6, flex: 1 },
  chartValue: { color: colors.textFaint, fontSize: 10.5, fontVariant: ['tabular-nums'] },
  chartBar: { width: 26, borderRadius: 6, backgroundColor: colors.violetDim },
  chartDay: { color: colors.textFaint, fontSize: 11, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
});
