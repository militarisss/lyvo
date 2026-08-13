import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { useToast } from '@/stores/toast';
import { notifySuccess } from '@/utils/haptics';

const LEN = 6;

export default function Otp() {
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(30);
  const inputRef = useRef<TextInput>(null);
  const toast = useToast((s) => s.show);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (code.length === LEN) {
      notifySuccess();
      router.push('/onboarding/profile-setup');
    }
  }, [code]);

  return (
    <Screen>
      <Header title="Vérification" />
      <Text style={[type.h1, { marginTop: spacing.lg }]}>Entrez le code reçu</Text>
      <Text style={[type.bodySoft, { marginTop: spacing.sm }]}>
        Code envoyé au <Text style={{ color: colors.text, fontWeight: '700' }}>{phone ?? 'votre numéro'}</Text>
        {'\n'}
        <Text style={type.tiny}>(démo : tapez n’importe quels 6 chiffres)</Text>
      </Text>

      <Pressable onPress={() => inputRef.current?.focus()} style={styles.boxes}>
        {Array.from({ length: LEN }).map((_, i) => {
          const filled = i < code.length;
          const current = i === code.length;
          return (
            <View key={i} style={[styles.box, current && styles.boxActive, filled && styles.boxFilled]}>
              <Text style={styles.digit}>{code[i] ?? ''}</Text>
            </View>
          );
        })}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, LEN))}
          keyboardType="number-pad"
          autoFocus
          style={styles.hidden}
        />
      </Pressable>

      <Button
        title={seconds > 0 ? `Renvoyer le code (${seconds}s)` : 'Renvoyer le code'}
        variant="ghost"
        disabled={seconds > 0}
        onPress={() => {
          setSeconds(30);
          toast('Nouveau code envoyé par SMS', 'success');
        }}
        style={{ marginTop: spacing.xxl }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  boxes: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xxl, justifyContent: 'center' },
  box: {
    width: 48,
    height: 58,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: colors.violetLight },
  boxFilled: { borderColor: colors.lineStrong, backgroundColor: colors.cardHi },
  digit: { color: colors.text, fontSize: 22, fontWeight: '800' },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
