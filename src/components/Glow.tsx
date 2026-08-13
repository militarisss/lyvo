import React from 'react';
import { StyleSheet, View } from 'react-native';

/** Halo violet subtil en haut de l'écran — signature visuelle LYVO. */
export function Glow({ top = -160, side = 'right' as 'right' | 'left' | 'center' }) {
  const horizontal =
    side === 'center' ? { alignSelf: 'center' as const } : side === 'left' ? { left: -120 } : { right: -120 };
  return (
    <View pointerEvents="none" style={[styles.wrap, { top }, horizontal]}>
      <View style={[styles.circle, styles.c1]} />
      <View style={[styles.circle, styles.c2]} />
      <View style={[styles.circle, styles.c3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', width: 420, height: 420, alignItems: 'center', justifyContent: 'center' },
  circle: { position: 'absolute', borderRadius: 999 },
  c1: { width: 420, height: 420, backgroundColor: 'rgba(124,44,255,0.07)' },
  c2: { width: 300, height: 300, backgroundColor: 'rgba(124,44,255,0.09)' },
  c3: { width: 180, height: 180, backgroundColor: 'rgba(212,77,255,0.10)' },
});
