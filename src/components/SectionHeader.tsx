import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@/theme';

interface Props {
  title: string;
  onSeeAll?: () => void;
  top?: number;
}

export function SectionHeader({ title, onSeeAll, top = spacing.xl }: Props) {
  return (
    <View style={[styles.row, { marginTop: top }]}>
      <Text style={type.h2}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Text style={styles.link}>Tout voir</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing.md },
  link: { color: colors.violetLight, fontSize: 13, fontWeight: '700' },
});
