import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

/** Halo violet subtil en haut de l'écran — signature visuelle LYVO. Il « respire » lentement. */
export function Glow({ top = -160, side = 'right' as 'right' | 'left' | 'center' }) {
  const horizontal =
    side === 'center' ? { alignSelf: 'center' as const } : side === 'left' ? { left: -120 } : { right: -120 };
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 2600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { top },
        horizontal,
        {
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1] }),
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }],
        },
      ]}>
      <Animated.View style={[styles.circle, styles.c1]} />
      <Animated.View style={[styles.circle, styles.c2]} />
      <Animated.View style={[styles.circle, styles.c3]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', width: 420, height: 420, alignItems: 'center', justifyContent: 'center' },
  circle: { position: 'absolute', borderRadius: 999 },
  c1: { width: 420, height: 420, backgroundColor: 'rgba(124,44,255,0.07)' },
  c2: { width: 300, height: 300, backgroundColor: 'rgba(124,44,255,0.09)' },
  c3: { width: 180, height: 180, backgroundColor: 'rgba(212,77,255,0.10)' },
});
