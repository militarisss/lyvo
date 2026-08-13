import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';

interface Pin {
  left: `${number}%`;
  top: `${number}%`;
  label?: string;
  accent?: boolean;
}

interface Props {
  height?: number;
  pins?: Pin[];
  route?: boolean; // trace un trajet stylisé
  style?: ViewStyle;
}

/**
 * Carte stylisée LYVO (placeholder premium).
 * Sera remplacée par Google Maps / Mapbox via src/services/location.ts.
 */
export function MapPlaceholder({ height = 200, pins = [], route, style }: Props) {
  return (
    <View style={[styles.wrap, { height }, style]}>
      <LinearGradient colors={['#160C26', '#0C0618']} style={StyleSheet.absoluteFill} />
      {/* grille de rues */}
      {[18, 42, 66, 88].map((t) => (
        <View key={`h${t}`} style={[styles.street, { top: `${t}%`, left: 0, right: 0, height: 1 }]} />
      ))}
      {[15, 38, 62, 84].map((l) => (
        <View key={`v${l}`} style={[styles.street, { left: `${l}%`, top: 0, bottom: 0, width: 1 }]} />
      ))}
      <View style={[styles.block, { left: '20%', top: '24%', width: 52, height: 30 }]} />
      <View style={[styles.block, { left: '68%', top: '48%', width: 40, height: 40 }]} />
      <View style={[styles.block, { left: '44%', top: '70%', width: 64, height: 24 }]} />

      {route && <View style={styles.route} />}

      {pins.map((p, i) => (
        <View key={i} style={[styles.pinWrap, { left: p.left, top: p.top }]}>
          <View style={[styles.pinHalo, p.accent && { backgroundColor: 'rgba(212,77,255,0.25)' }]} />
          <View style={[styles.pin, p.accent && { backgroundColor: colors.magenta }]}>
            <Ionicons name="location" size={13} color="#fff" />
          </View>
          {p.label && <Text style={styles.pinLabel}>{p.label}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  street: { position: 'absolute', backgroundColor: 'rgba(167,85,255,0.08)' },
  block: { position: 'absolute', backgroundColor: 'rgba(167,85,255,0.05)', borderRadius: 4 },
  route: {
    position: 'absolute',
    left: '18%',
    top: '26%',
    width: '58%',
    height: '44%',
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.violetLight,
    borderStyle: 'dashed',
    borderBottomRightRadius: 40,
    opacity: 0.8,
  },
  pinWrap: { position: 'absolute', alignItems: 'center', marginLeft: -14, marginTop: -14 },
  pinHalo: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(124,44,255,0.22)', top: -8 },
  pin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  pinLabel: { color: colors.text, fontSize: 10, fontWeight: '700', marginTop: 4, backgroundColor: colors.overlay, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
});
