import React, { ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { card, radius, spacing } from '@/theme';
import { tapLight } from '@/utils/haptics';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

export function Card({ children, onPress, style, padded = true }: Props) {
  const base: ViewStyle = { ...card, ...(padded ? { padding: spacing.lg } : { overflow: 'hidden' }) };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable
      onPress={() => {
        tapLight();
        onPress();
      }}
      style={({ pressed }) => [base, { transform: [{ scale: pressed ? 0.98 : 1 }], borderRadius: radius.lg }, style]}>
      {children}
    </Pressable>
  );
}
