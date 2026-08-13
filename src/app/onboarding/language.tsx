import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { LANGS, useLangStore, useT } from '@/services/i18n';
import { useUser } from '@/stores/user';
import { useToast } from '@/stores/toast';
import { tapLight } from '@/utils/haptics';

export default function Language() {
  const { lang, setLang } = useLangStore();
  const { t } = useT();
  const completeOnboarding = useUser((s) => s.completeOnboarding);
  const toast = useToast((s) => s.show);

  const demoAccess = () => {
    completeOnboarding();
    toast('Mode démo — profil complet chargé', 'success');
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: spacing.xxl }}>
        <Logo size="sm" />
      </View>
      <Text style={[type.h1, styles.title]}>{t('choose_lang')}</Text>

      <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
        {LANGS.map((l) => {
          const active = lang === l.id;
          return (
            <Pressable
              key={l.id}
              onPress={() => {
                tapLight();
                setLang(l.id);
              }}
              style={[styles.langCard, active && styles.langActive]}>
              <Text style={[type.h3, { flex: 1 }]}>{l.native}</Text>
              {active && <Ionicons name="checkmark-circle" size={22} color={colors.violetLight} />}
            </Pressable>
          );
        })}
      </View>

      <Button title={t('continue')} onPress={() => router.push('/onboarding/welcome')} style={{ marginTop: spacing.xxl }} />
      <Button title="🔑 Accès démo direct (sauter l’inscription)" variant="ghost" size="md" onPress={demoAccess} style={{ marginTop: spacing.md }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { textAlign: 'center', marginTop: spacing.xxl },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    height: 64,
  },
  langActive: { borderColor: colors.violetLight, backgroundColor: colors.cardHi },
});
