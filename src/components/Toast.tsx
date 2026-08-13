import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, glow, radius, spacing } from '@/theme';
import { useToast } from '@/stores/toast';

const ICONS = { success: 'checkmark-circle', error: 'alert-circle', info: 'information-circle' } as const;
const TINTS = { success: colors.success, error: colors.error, info: colors.violetLight } as const;

/** Hôte global — monté une seule fois dans le root layout. */
export function ToastHost() {
  const { message, kind } = useToast();
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    Animated.spring(y, { toValue: message ? 0 : -120, useNativeDriver: true, bounciness: 6 }).start();
  }, [message, y]);

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { top: insets.top + 8, transform: [{ translateY: y }] }]}>
      {message && (
        <View style={[styles.toast, glow.soft]}>
          <Ionicons name={ICONS[kind]} size={18} color={TINTS[kind]} />
          <Text style={styles.text} numberOfLines={2}>
            {message}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.cardHi,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    maxWidth: 340,
  },
  text: { color: colors.text, fontSize: 13.5, fontWeight: '600', flexShrink: 1 },
});
