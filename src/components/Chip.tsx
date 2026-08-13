import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';
import { tapLight } from '@/utils/haptics';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Chip({ label, active, onPress, icon }: Props) {
  return (
    <Pressable
      onPress={() => {
        tapLight();
        onPress?.();
      }}
      style={({ pressed }) => [styles.base, active && styles.active, pressed && { opacity: 0.8 }]}>
      {icon && <Ionicons name={icon} size={14} color={active ? '#fff' : colors.textSoft} style={{ marginRight: 6 }} />}
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  active: { backgroundColor: colors.violet, borderColor: colors.violetLight },
  label: { color: colors.textSoft, fontSize: 13, fontWeight: '600' },
  labelActive: { color: '#fff' },
});
