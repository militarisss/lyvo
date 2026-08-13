import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/theme';
import type { Category } from '@/types/models';
import { tapLight } from '@/utils/haptics';

interface Props {
  category: Category;
  onPress: () => void;
  active?: boolean;
}

export function CategoryTile({ category, onPress, active }: Props) {
  return (
    <Pressable
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={({ pressed }) => [styles.wrap, pressed && { transform: [{ scale: 0.95 }] }]}>
      <View style={[styles.iconBox, active && { borderColor: category.tint, backgroundColor: `${category.tint}22` }]}>
        <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={22} color={active ? category.tint : colors.violetLight} />
      </View>
      <Text style={[styles.label, active && { color: colors.text }]} numberOfLines={1}>
        {category.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: 76 },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: { color: colors.textSoft, fontSize: 11.5, fontWeight: '600' },
});
