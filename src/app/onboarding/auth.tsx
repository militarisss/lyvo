import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { useToast } from '@/stores/toast';

export default function Auth() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isLogin = mode === 'login';
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>();
  const toast = useToast((s) => s.show);

  const submit = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9) {
      setError('Entrez un numéro marocain valide (9 chiffres).');
      return;
    }
    setError(undefined);
    router.push(`/onboarding/otp?phone=${encodeURIComponent('+212 ' + phone)}`);
  };

  const social = (provider: string) => {
    toast(`Connexion ${provider} simulée — bienvenue !`, 'success');
    router.push('/onboarding/profile-setup');
  };

  return (
    <Screen>
      <Header title={isLogin ? 'Connexion' : 'Créer un compte'} />
      <Text style={[type.h1, { marginTop: spacing.lg }]}>
        {isLogin ? 'Ravi de vous revoir' : 'Votre numéro de téléphone'}
      </Text>
      <Text style={[type.bodySoft, { marginTop: spacing.sm }]}>
        Nous vous enverrons un code de vérification par SMS.
      </Text>

      <View style={styles.phoneRow}>
        <View style={styles.prefix}>
          <Text style={{ fontSize: 18 }}>🇲🇦</Text>
          <Text style={[type.h3, { marginLeft: 6 }]}>+212</Text>
        </View>
        <View style={[styles.phoneInput, !!error && { borderColor: colors.error }]}>
          <PhoneInput value={phone} onChange={setPhone} />
        </View>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button title="Recevoir le code" onPress={submit} style={{ marginTop: spacing.xl }} />

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={type.tiny}>ou continuer avec</Text>
        <View style={styles.line} />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <Button title="Apple" variant="secondary" icon="logo-apple" onPress={() => social('Apple')} style={{ flex: 1 }} />
        <Button title="Google" variant="secondary" icon="logo-google" onPress={() => social('Google')} style={{ flex: 1 }} />
      </View>

      <Text style={[type.tiny, styles.legal]}>
        En continuant, vous acceptez nos Conditions d’utilisation et notre Politique de confidentialité.
      </Text>
    </Screen>
  );
}

function PhoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="6 12 34 56 78"
      placeholderTextColor={colors.textFaint}
      keyboardType="phone-pad"
      style={{ flex: 1, color: colors.text, fontSize: 16, height: '100%', paddingHorizontal: spacing.lg }}
    />
  );
}

const styles = StyleSheet.create({
  phoneRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 54,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    height: 54,
    justifyContent: 'center',
  },
  error: { color: colors.error, fontSize: 12.5, fontWeight: '600', marginTop: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: colors.line },
  legal: { textAlign: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.lg, lineHeight: 17 },
});
