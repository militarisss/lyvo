import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/theme';
import { Logo } from '@/components/Logo';
import { Glow } from '@/components/Glow';
import { useUser } from '@/stores/user';

/** Splash screen animé — route vers l'onboarding ou la Home. */
export default function Splash() {
  const onboarded = useUser((s) => s.onboarded);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8 }),
    ]).start();
    const t = setTimeout(() => {
      router.replace(onboarded ? '/(tabs)' : '/onboarding/language');
    }, 1500);
    return () => clearTimeout(t);
  }, [onboarded, opacity, scale]);

  return (
    <View style={styles.root}>
      <Glow side="center" top={-60} />
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Logo showTag />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
});
