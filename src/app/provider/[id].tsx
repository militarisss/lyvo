import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, type } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Stars } from '@/components/Stars';
import { Avatar } from '@/components/Avatar';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { EmptyState } from '@/components/EmptyState';
import { RatingBars } from '@/components/RatingBars';
import { ProBadges } from '@/components/ProBadges';
import { providerById } from '@/data/providers';
import { useFavorites } from '@/stores/favorites';
import { useChat } from '@/stores/chat';
import { useToast } from '@/stores/toast';
import { mad } from '@/utils/format';
import { tapLight, tapMedium } from '@/utils/haptics';

export default function ProviderPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const p = providerById(id ?? '');
  const { providerIds, toggle } = useFavorites();
  const openChat = useChat((s) => s.openWithProvider);
  const toast = useToast((s) => s.show);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!p) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center' }}>
        <EmptyState
          icon="alert-circle-outline"
          title="Prestataire introuvable"
          text="Ce prestataire n’existe plus ou le lien est invalide."
          actionLabel="Retour à l’accueil"
          onAction={() => router.replace('/(tabs)')}
        />
      </View>
    );
  }

  const fav = providerIds.includes(p.id);
  const fromPrice = Math.min(...p.services.map((s) => s.priceMad));

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Galerie */}
        <View>
          <Image source={{ uri: p.gallery[photoIdx] ?? p.cover }} style={styles.hero} transition={250} />
          <View style={[styles.heroTop, { top: insets.top + 8 }]}>
            <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} style={styles.roundBtn}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Pressable
                onPress={() => {
                  tapMedium();
                  toggle(p.id);
                  toast(fav ? 'Retiré des favoris' : 'Ajouté aux favoris', 'success');
                }}
                style={styles.roundBtn}>
                <Ionicons name={fav ? 'heart' : 'heart-outline'} size={19} color={fav ? colors.magenta : '#fff'} />
              </Pressable>
              <Pressable onPress={() => toast('Lien de partage copié', 'success')} style={styles.roundBtn}>
                <Ionicons name="share-outline" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
          <View style={styles.thumbs}>
            {p.gallery.map((g, i) => (
              <Pressable key={g} onPress={() => setPhotoIdx(i)}>
                <Image source={{ uri: g }} style={[styles.thumb, i === photoIdx && styles.thumbActive]} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          {/* En-tête */}
          <Text style={type.h1}>{p.name}</Text>
          <Text style={[type.bodySoft, { marginTop: 4 }]}>{p.tagline}</Text>
          <View style={{ marginTop: spacing.md }}>
            <ProBadges provider={p} />
          </View>

          <View style={styles.metaRow}>
            <Stars rating={p.rating} count={p.reviewsCount} size={15} />
            <Text style={styles.metaDot}>·</Text>
            <Ionicons name="location-outline" size={14} color={colors.textFaint} />
            <Text style={type.small}>
              {p.distanceKm} km · {p.address}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
            {p.openNow ? <Badge label="Ouvert" tone="success" icon="time-outline" /> : <Badge label="Fermé" tone="error" icon="time-outline" />}
            {p.mobile && <Badge label="Se déplace chez vous" tone="neutral" icon="car-outline" />}
            {p.premium && <Badge label="Premium" tone="gold" icon="diamond-outline" />}
          </View>

          {/* actions rapides */}
          <View style={styles.quickRow}>
            <QuickAction icon="call-outline" label="Appeler" onPress={() => toast('Appel simulé — +212 5 22 00 00 00', 'info')} />
            <QuickAction
              icon="chatbubble-outline"
              label="Message"
              onPress={() => {
                const cid = openChat(p.id);
                router.push(`/chat/${cid}`);
              }}
            />
            <QuickAction icon="navigate-outline" label="Itinéraire" onPress={() => toast('Ouverture du GPS simulée', 'info')} />
          </View>

          {/* stats de confiance */}
          {(p.experienceYears || p.missionsCount || p.languages) && (
            <View style={styles.statsRow}>
              {p.experienceYears != null && <Stat value={`${p.experienceYears} ans`} label="d’expérience" />}
              {p.missionsCount != null && <Stat value={p.missionsCount.toLocaleString('fr-FR')} label="missions" />}
              {p.languages && <Stat value={p.languages.map((l) => l.slice(0, 2).toUpperCase()).join(' · ')} label="langues" />}
            </View>
          )}

          {/* description */}
          <Text style={[type.h2, styles.sectionTitle]}>À propos</Text>
          <Text style={type.bodySoft}>{p.description}</Text>

          {/* services */}
          <Text style={[type.h2, styles.sectionTitle]}>Services & tarifs</Text>
          <View style={{ gap: spacing.sm }}>
            {p.services.map((s) => (
              <Card key={s.id} onPress={() => router.push(`/booking/${p.id}?serviceId=${s.id}`)} style={styles.serviceRow}>
                <View style={{ flex: 1 }}>
                  <Text style={type.h3}>{s.name}</Text>
                  {s.description && <Text style={[type.small, { marginTop: 2 }]}>{s.description}</Text>}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
                    <Ionicons name="time-outline" size={12} color={colors.textFaint} />
                    <Text style={type.tiny}>
                      {s.durationMin >= 60 ? `${Math.round(s.durationMin / 60)} h` : `${s.durationMin} min`}
                      {s.atHome ? ' · à domicile' : ' · sur place'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.servicePrice}>{mad(s.priceMad)}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
              </Card>
            ))}
          </View>

          {/* horaires */}
          <Text style={[type.h2, styles.sectionTitle]}>Horaires</Text>
          <Card>
            {p.hours.map((h, i) => (
              <View key={h.days} style={[styles.hourRow, i > 0 && { marginTop: 8 }]}>
                <Text style={type.bodySoft}>{h.days}</Text>
                <Text style={[type.body, { fontWeight: '600' }]}>
                  {h.open} – {h.close}
                </Text>
              </View>
            ))}
          </Card>

          {/* carte */}
          <Text style={[type.h2, styles.sectionTitle]}>Localisation</Text>
          <MapPlaceholder height={160} pins={[{ left: '52%', top: '42%', label: p.name, accent: true }]} />

          {/* avis */}
          <Text style={[type.h2, styles.sectionTitle]}>
            Avis clients <Text style={type.small}>({p.reviewsCount})</Text>
          </Text>
          <Card style={{ marginBottom: spacing.md }}>
            <RatingBars rating={p.rating} count={p.reviewsCount} />
            {p.recommendPct != null && (
              <View style={styles.recommendRow}>
                <Ionicons name="thumbs-up-outline" size={14} color={colors.success} />
                <Text style={[type.small, { color: colors.success, fontWeight: '700' }]}>
                  {p.recommendPct}% des clients recommandent {p.name.split(' ')[0]}
                </Text>
              </View>
            )}
          </Card>
          <View style={{ gap: spacing.md }}>
            {p.reviews.map((r) => (
              <Card key={r.id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <Avatar uri={r.avatar} name={r.author} size={38} />
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>{r.author}</Text>
                    <Text style={type.tiny}>{r.date}</Text>
                  </View>
                  <Stars rating={r.rating} />
                </View>
                <Text style={[type.bodySoft, { marginTop: spacing.md, fontSize: 14 }]}>{r.text}</Text>
              </Card>
            ))}
          </View>

          {/* FAQ */}
          {p.faq.length > 0 && (
            <>
              <Text style={[type.h2, styles.sectionTitle]}>Questions fréquentes</Text>
              <View style={{ gap: spacing.sm }}>
                {p.faq.map((f, i) => (
                  <Card
                    key={f.q}
                    onPress={() => {
                      tapLight();
                      setOpenFaq(openFaq === i ? null : i);
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[type.h3, { flex: 1, fontSize: 14.5 }]}>{f.q}</Text>
                      <Ionicons name={openFaq === i ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textFaint} />
                    </View>
                    {openFaq === i && <Text style={[type.bodySoft, { marginTop: spacing.sm, fontSize: 14 }]}>{f.a}</Text>}
                  </Card>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* CTA fixe */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={type.tiny}>À partir de</Text>
          <Text style={styles.ctaPrice}>{mad(fromPrice)}</Text>
        </View>
        <Button title="Réserver" onPress={() => router.push(`/booking/${p.id}`)} style={{ flex: 1, marginLeft: spacing.lg }} />
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={type.tiny}>{label}</Text>
    </View>
  );
}

function QuickAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icon} size={18} color={colors.violetLight} />
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { width: '100%', height: 290, backgroundColor: colors.cardHi },
  heroTop: { position: 'absolute', left: spacing.lg, right: spacing.lg, flexDirection: 'row', justifyContent: 'space-between' },
  roundBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(6,2,13,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbs: { position: 'absolute', bottom: 12, left: spacing.lg, flexDirection: 'row', gap: 6 },
  thumb: { width: 40, height: 40, borderRadius: 8, opacity: 0.6, borderWidth: 1, borderColor: 'transparent' },
  thumbActive: { opacity: 1, borderColor: colors.violetLight },
  body: { padding: spacing.lg },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.md },
  metaDot: { color: colors.textFaint },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  quick: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  quickLabel: { color: colors.text, fontSize: 13, fontWeight: '700' },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { color: colors.text, fontSize: 15, fontWeight: '800' },
  recommendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.lg },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  servicePrice: { color: colors.violetLight, fontWeight: '800', fontSize: 15 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg2,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    padding: spacing.lg,
  },
  ctaPrice: { color: colors.text, fontSize: 20, fontWeight: '900' },
});
