import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { useT } from '@/services/i18n';

const FEATURES = [
  { icon: 'sparkles-outline', text: 'Coiffeur, chef, ménage, chauffeur… tout au même endroit' },
  { icon: 'shield-checkmark-outline', text: 'Prestataires vérifiés et notés par la communauté' },
  { icon: 'flash-outline', text: 'Réservation en moins de 60 secondes, prix ferme' },
] as const;

export default function Welcome() {
  const { t, isRTL } = useT();

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: spacing.xxxl }}>
        <Logo />
      </View>

      <Text style={[type.hero, styles.title, isRTL && { writingDirection: 'rtl' }]}>{t('welcome_title')}</Text>
      <Text style={[type.bodySoft, styles.sub, isRTL && { writingDirection: 'rtl' }]}>{t('welcome_sub')}</Text>

      <View style={{ gap: spacing.md, marginTop: spacing.xxl }}>
        {FEATURES.map((f) => (
          <View key={f.icon} style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={18} color={colors.violetLight} />
            </View>
            <Text style={[type.body, { flex: 1, fontSize: 14 }]}>{f.text}</Text>
          </View>
        ))}
      </View>

      <View style={{ flex: 1 }} />
      <Button title={t('get_started')} onPress={() => router.push('/onboarding/auth?mode=signup')} />
      <Button
        title={t('already_account')}
        variant="ghost"
        onPress={() => router.push('/onboarding/auth?mode=login')}
        style={{ marginTop: spacing.md }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { textAlign: 'center', marginTop: spacing.xxl },
  sub: { textAlign: 'center', marginTop: spacing.md, paddingHorizontal: spacing.lg },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
