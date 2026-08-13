import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, radius, spacing, type } from '@/theme';
import { Button } from '@/components/Button';
import { Glow } from '@/components/Glow';
import { Logo } from '@/components/Logo';
import { FadeInUp } from '@/components/Animate';
import { CATEGORIES } from '@/data/categories';
import { tapLight } from '@/utils/haptics';

const STEPS = [
  { icon: 'search-outline', title: 'Choisissez', text: 'Un service parmi 40+ catégories, du ménage au chef à domicile.' },
  { icon: 'calendar-outline', title: 'Réservez', text: 'Créneau, adresse, prix ferme — en moins de 60 secondes.' },
  { icon: 'sparkles-outline', title: 'Profitez', text: 'Un pro vérifié arrive. Suivi en direct, paiement sécurisé.' },
] as const;

const TRUST = [
  { icon: 'shield-checkmark-outline', title: 'Identité vérifiée', text: 'Documents, références et entretien pour chaque pro.' },
  { icon: 'card-outline', title: 'Paiement sécurisé', text: 'Débit seulement une fois la prestation réalisée.' },
  { icon: 'star-outline', title: 'Qualité notée', text: 'Chaque mission évaluée. Sous 4,5, un pro sort du réseau.' },
  { icon: 'headset-outline', title: 'Support 7j/7', text: 'Une vraie équipe à Casablanca, réponse en moins de 2 h.' },
] as const;

const TESTIMONIALS = [
  { name: 'Salma R.', city: 'Casablanca — Maârif', text: '« Mon canapé nettoyé en 1 h 30, réservé la veille au soir. C’est devenu un réflexe. »', rating: 5 },
  { name: 'Youssef T.', city: 'Casablanca — Aïn Diab', text: '« Chauffeur toujours à l’heure pour l’aéroport, même à 5 h du matin. »', rating: 5 },
  { name: 'Camélia R.', city: 'Marrakech — Hivernage', text: '« Un chef à domicile pour l’anniversaire de ma mère. Soirée parfaite. »', rating: 5 },
] as const;

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger — bientôt'];

const FAQ = [
  { q: 'Comment les prestataires sont-ils sélectionnés ?', a: 'Vérification d’identité, contrôle des références, entretien et mission test. Moins d’un candidat sur cinq rejoint LYVO.' },
  { q: 'Quand suis-je débité ?', a: 'Le montant est réservé à la commande et débité uniquement une fois la prestation terminée. En espèces, vous payez le pro directement.' },
  { q: 'Puis-je annuler ?', a: 'Oui, gratuitement jusqu’à 2 h avant le rendez-vous, directement dans l’app.' },
  { q: 'Dans quelles villes êtes-vous disponibles ?', a: 'Casablanca, Rabat et Marrakech aujourd’hui. Tanger et Agadir arrivent en 2027.' },
];

export default function Landing() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wide = width >= 860;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const openApp = () => router.push('/');

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: spacing.xxxl }}>
      {/* nav */}
      <View style={[styles.nav, { paddingTop: insets.top + 14 }]}>
        <View style={[styles.container, styles.navRow]}>
          <Logo size="sm" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
            {wide && (
              <>
                <NavLink label="Services" />
                <NavLink label="Villes" />
                <NavLink label="LYVO+" onPress={() => router.push('/plus')} />
              </>
            )}
            <Button title="Ouvrir l’app" size="sm" onPress={openApp} />
          </View>
        </View>
      </View>

      {/* hero */}
      <View style={styles.hero}>
        <Glow side="center" top={-140} />
        <View style={[styles.container, { alignItems: 'center' }]}>
          <FadeInUp>
            <Text style={[styles.heroTitle, wide && { fontSize: 58, lineHeight: 64 }]}>
              Votre ville.{'\n'}
              <Text style={{ color: colors.violetLight }}>À votre service.</Text>
            </Text>
          </FadeInUp>
          <FadeInUp delay={120}>
            <Text style={styles.heroSub}>
              Ménage, chauffeur, beauté, dépannage, chef à domicile — des professionnels vérifiés, réservés en 60 secondes,
              partout à Casablanca, Rabat et Marrakech.
            </Text>
          </FadeInUp>
          <FadeInUp delay={240}>
            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl }}>
              <Button title="Découvrir LYVO" onPress={openApp} />
              <Button title="Devenir prestataire" variant="secondary" onPress={() => router.push('/pro')} />
            </View>
          </FadeInUp>
          <FadeInUp delay={360}>
            <View style={styles.heroStats}>
              <HeroStat value="4,8 ★" label="note moyenne" />
              <View style={styles.heroStatSep} />
              <HeroStat value="21 000+" label="missions réalisées" />
              <View style={styles.heroStatSep} />
              <HeroStat value="3 villes" label="et bientôt plus" />
            </View>
          </FadeInUp>
        </View>
      </View>

      {/* catégories */}
      <Section title="Un seul réflexe pour tout" sub="9 univers, plus de 40 services — et le catalogue grandit chaque mois.">
        <View style={[styles.catGrid, { justifyContent: wide ? 'center' : 'flex-start' }]}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => {
                tapLight();
                router.push(`/category/${c.id}`);
              }}
              style={({ pressed }) => [styles.catCard, pressed && { borderColor: colors.violetLight }]}>
              <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={22} color={c.tint} />
              <Text style={styles.catName}>{c.name}</Text>
              <Text style={type.tiny}>{c.subs.length} services</Text>
            </Pressable>
          ))}
        </View>
      </Section>

      {/* comment ça marche */}
      <Section title="Comment ça marche" sub="Trois étapes, zéro appel téléphonique, zéro négociation.">
        <View style={[styles.threeCol, !wide && { flexDirection: 'column' }]}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.stepCard}>
              <View style={styles.stepNum}>
                <Text style={{ color: colors.violetLight, fontWeight: '900' }}>{i + 1}</Text>
              </View>
              <Ionicons name={s.icon} size={24} color={colors.violetLight} style={{ marginTop: spacing.md }} />
              <Text style={[type.h2, { marginTop: spacing.sm }]}>{s.title}</Text>
              <Text style={[type.small, { marginTop: 6, lineHeight: 19 }]}>{s.text}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* trust */}
      <Section title="LYVO Verified" sub="La confiance n’est pas une option — c’est le produit.">
        <View style={[styles.threeCol, { flexWrap: 'wrap' }, !wide && { flexDirection: 'column' }]}>
          {TRUST.map((t) => (
            <View key={t.title} style={[styles.trustCard, wide && { width: '46%' }]}>
              <View style={styles.trustIcon}>
                <Ionicons name={t.icon} size={19} color={colors.violetLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={type.h3}>{t.title}</Text>
                <Text style={[type.small, { marginTop: 4, lineHeight: 18 }]}>{t.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </Section>

      {/* avis */}
      <Section title="Ils utilisent LYVO" sub="Plus de 2 000 avis 5 étoiles ce trimestre.">
        <View style={[styles.threeCol, !wide && { flexDirection: 'column' }]}>
          {TESTIMONIALS.map((t) => (
            <View key={t.name} style={styles.quoteCard}>
              <View style={{ flexDirection: 'row', gap: 2 }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Ionicons key={i} name="star" size={13} color={colors.gold} />
                ))}
              </View>
              <Text style={[type.body, { marginTop: spacing.md, lineHeight: 22, fontSize: 14.5 }]}>{t.text}</Text>
              <Text style={[type.h3, { marginTop: spacing.lg, fontSize: 14 }]}>{t.name}</Text>
              <Text style={type.tiny}>{t.city}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* villes */}
      <Section title="Disponible dans votre ville">
        <View style={styles.cities}>
          {CITIES.map((c) => (
            <View key={c} style={[styles.cityChip, c.includes('bientôt') && { opacity: 0.55 }]}>
              <Ionicons name="location" size={13} color={colors.violetLight} />
              <Text style={styles.cityText}>{c}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* LYVO+ */}
      <View style={styles.container}>
        <Pressable onPress={() => router.push('/plus')}>
          <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.plusBand}>
            <View style={{ flex: 1, minWidth: 220 }}>
              <Text style={styles.plusTitle}>LYVO+</Text>
              <Text style={styles.plusSub}>Frais offerts, priorité et concierge dédié — 99 MAD/mois.</Text>
            </View>
            <View style={styles.plusBtn}>
              <Text style={styles.plusBtnText}>En savoir plus</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </View>
          </LinearGradient>
        </Pressable>
      </View>

      {/* FAQ */}
      <Section title="Questions fréquentes">
        <View style={{ gap: spacing.sm, maxWidth: 720, width: '100%', alignSelf: 'center' }}>
          {FAQ.map((f, i) => (
            <Pressable key={f.q} onPress={() => setOpenFaq(openFaq === i ? null : i)} style={styles.faqCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[type.h3, { flex: 1 }]}>{f.q}</Text>
                <Ionicons name={openFaq === i ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textFaint} />
              </View>
              {openFaq === i && <Text style={[type.small, { marginTop: spacing.sm, lineHeight: 20 }]}>{f.a}</Text>}
            </Pressable>
          ))}
        </View>
      </Section>

      {/* footer */}
      <View style={styles.footer}>
        <View style={[styles.container, { alignItems: 'center', gap: spacing.md }]}>
          <Logo size="sm" />
          <Text style={[type.small, { textAlign: 'center' }]}>Votre conciergerie personnelle — Casablanca · Rabat · Marrakech</Text>
          <View style={{ flexDirection: 'row', gap: spacing.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
            <FooterLink label="Ouvrir l’app" onPress={openApp} />
            <FooterLink label="LYVO+" onPress={() => router.push('/plus')} />
            <FooterLink label="Devenir prestataire" onPress={() => router.push('/pro')} />
            <FooterLink label="Confidentialité" onPress={() => router.push('/legal')} />
          </View>
          <Text style={type.tiny}>© 2026 LYVO — Fait avec soin à Casablanca 🇲🇦</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function NavLink({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress ?? (() => {})} hitSlop={8}>
      <Text style={{ color: colors.textSoft, fontSize: 14, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: colors.text, fontSize: 17, fontWeight: '900' }}>{value}</Text>
      <Text style={type.tiny}>{label}</Text>
    </View>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <View style={[styles.container, { marginTop: 72 }]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {sub && <Text style={styles.sectionSub}>{sub}</Text>}
      <View style={{ marginTop: spacing.xl }}>{children}</View>
    </View>
  );
}

function FooterLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={6}>
      <Text style={{ color: colors.violetLight, fontSize: 13, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  container: { width: '100%', maxWidth: 1040, alignSelf: 'center', paddingHorizontal: spacing.xl },
  nav: { borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: spacing.md, backgroundColor: colors.bg2 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { paddingTop: 84, paddingBottom: 40, overflow: 'hidden' },
  heroTitle: { color: colors.text, fontSize: 40, lineHeight: 46, fontWeight: '900', textAlign: 'center', letterSpacing: -1 },
  heroSub: { color: colors.textSoft, fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 560, marginTop: spacing.xl },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginTop: spacing.xxl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  heroStatSep: { width: 1, height: 26, backgroundColor: colors.line },
  sectionTitle: { color: colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  sectionSub: { color: colors.textSoft, fontSize: 14.5, textAlign: 'center', marginTop: spacing.sm, alignSelf: 'center', maxWidth: 480 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  catCard: {
    width: 150,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 6,
    flexGrow: 1,
    maxWidth: 200,
  },
  catName: { color: colors.text, fontSize: 14.5, fontWeight: '700' },
  threeCol: { flexDirection: 'row', gap: spacing.md },
  stepCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexGrow: 1,
  },
  trustIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  cities: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    height: 44,
  },
  cityText: { color: colors.text, fontSize: 14.5, fontWeight: '700' },
  plusBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    marginTop: 72,
    flexWrap: 'wrap',
  },
  plusTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1 },
  plusSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4 },
  plusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(6,2,13,0.35)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
  },
  plusBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  faqCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  footer: { borderTopWidth: 1, borderTopColor: colors.line, marginTop: 72, paddingVertical: spacing.xxl },
});
