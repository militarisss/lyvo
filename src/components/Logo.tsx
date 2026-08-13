import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, glow, gradients } from '@/theme';

interface Props {
  size?: 'sm' | 'lg';
  showTag?: boolean;
}

export function Logo({ size = 'lg', showTag = false }: Props) {
  const big = size === 'lg';
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.mark, glow.violet, big ? { width: 76, height: 76, borderRadius: 24 } : { width: 40, height: 40, borderRadius: 13 }]}>
        <Text style={[styles.markText, { fontSize: big ? 38 : 20 }]}>L</Text>
      </LinearGradient>
      <Text style={[styles.name, { fontSize: big ? 34 : 20, marginTop: big ? 18 : 8 }]}>LYVO</Text>
      {showTag && <Text style={styles.tag}>Votre conciergerie personnelle</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  mark: { alignItems: 'center', justifyContent: 'center' },
  markText: { color: '#fff', fontWeight: '900' },
  name: { color: colors.text, fontWeight: '900', letterSpacing: 10, marginLeft: 10 },
  tag: { color: colors.textSoft, fontSize: 13, marginTop: 8 },
});
