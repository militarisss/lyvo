import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '@/theme';
import { Button } from './Button';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, text, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={30} color={colors.violetLight} />
      </View>
      <Text style={[type.h3, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[type.small, styles.text]}>{text}</Text>
      {actionLabel && onAction && <Button title={actionLabel} size="md" onPress={onAction} style={{ marginTop: spacing.lg }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  text: { textAlign: 'center', marginTop: 6, maxWidth: 260 },
});
