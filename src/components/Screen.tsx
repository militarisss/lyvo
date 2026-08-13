import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';
import { Glow } from './Glow';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  glow?: boolean;
  style?: ViewStyle;
  /** espace bas supplémentaire (au-dessus d'une barre CTA fixe) */
  bottomSpace?: number;
}

export function Screen({ children, scroll = true, padded = true, glow = true, style, bottomSpace = 0 }: Props) {
  const insets = useSafeAreaInsets();
  const inner: ViewStyle = {
    paddingTop: insets.top + spacing.md,
    paddingBottom: insets.bottom + spacing.xl + bottomSpace,
    ...(padded ? { paddingHorizontal: spacing.lg } : null),
  };

  return (
    <View style={[styles.root, style]}>
      {glow && <Glow />}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={inner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
});
