import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/theme';
import { initials } from '@/utils/format';

interface Props {
  uri?: string;
  name?: string;
  size?: number;
  ring?: boolean;
}

export function Avatar({ uri, name = '?', size = 44, ring = false }: Props) {
  const inner = uri ? (
    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} transition={150} />
  ) : (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={{ color: '#fff', fontWeight: '800', fontSize: size * 0.38 }}>{initials(name)}</Text>
    </View>
  );

  if (!ring) return inner;
  const pad = 2;
  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size + pad * 2 + 2, height: size + pad * 2 + 2, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ backgroundColor: colors.bg, borderRadius: 999, padding: pad }}>{inner}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: colors.violet, alignItems: 'center', justifyContent: 'center' },
});
