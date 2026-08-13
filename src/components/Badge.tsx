import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { BookingStatus } from '@/types/models';

interface Props {
  label: string;
  tone?: 'violet' | 'success' | 'warning' | 'error' | 'neutral' | 'gold';
  icon?: keyof typeof Ionicons.glyphMap;
}

const TONES = {
  violet: { bg: colors.violetDim, fg: colors.violetLight },
  success: { bg: colors.successDim, fg: colors.success },
  warning: { bg: colors.warningDim, fg: colors.warning },
  error: { bg: colors.errorDim, fg: colors.error },
  neutral: { bg: 'rgba(169,162,179,0.14)', fg: colors.textSoft },
  gold: { bg: 'rgba(240,197,104,0.14)', fg: colors.gold },
} as const;

export function Badge({ label, tone = 'violet', icon }: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.base, { backgroundColor: t.bg }]}>
      {icon && <Ionicons name={icon} size={11} color={t.fg} style={{ marginRight: 4 }} />}
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

export const STATUS_META: Record<BookingStatus, { label: string; tone: Props['tone'] }> = {
  pending: { label: 'En attente', tone: 'warning' },
  confirmed: { label: 'Confirmée', tone: 'violet' },
  enroute: { label: 'En route', tone: 'gold' },
  inprogress: { label: 'En cours', tone: 'gold' },
  done: { label: 'Terminée', tone: 'success' },
  cancelled: { label: 'Annulée', tone: 'error' },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    height: 22,
    borderRadius: radius.full,
  },
  label: { fontSize: 11, fontWeight: '700' },
});
