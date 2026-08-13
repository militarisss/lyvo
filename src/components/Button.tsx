import React, { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, glow, radius, spacing, type } from '@/theme';
import { tapLight } from '@/utils/haptics';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'lg' | 'md' | 'sm';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', size = 'lg', icon, loading, disabled, style }: Props) {
  const heights: Record<Size, number> = { lg: 54, md: 46, sm: 38 };
  const fontSizes: Record<Size, number> = { lg: 16, md: 15, sm: 13 };
  const h = heights[size];
  const dim = disabled || loading;

  const content = (pressed: boolean) => (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.violetLight} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={fontSizes[size] + 2}
              color={variant === 'danger' ? colors.error : variant === 'primary' ? '#fff' : colors.text}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={[
              type.h3,
              { fontSize: fontSizes[size] },
              variant === 'danger' && { color: colors.error },
              pressed && { opacity: 0.9 },
            ]}>
            {title}
          </Text>
        </>
      )}
    </>
  );

  const base: ViewStyle = {
    height: h,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    opacity: dim ? 0.55 : 1,
  };

  const handlePress = () => {
    if (dim) return;
    tapLight();
    onPress?.();
  };

  if (variant === 'primary') {
    return (
      <Pressable onPress={handlePress} disabled={dim} style={({ pressed }) => [glow.violet, { borderRadius: radius.md, transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}>
        {({ pressed }) => (
          <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={base}>
            {content(pressed)}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  const variantStyle: ViewStyle =
    variant === 'secondary'
      ? { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.lineStrong }
      : variant === 'danger'
        ? { backgroundColor: colors.errorDim, borderWidth: 1, borderColor: 'rgba(255,92,122,0.35)' }
        : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line };

  return (
    <Pressable
      onPress={handlePress}
      disabled={dim}
      style={({ pressed }) => [base, variantStyle, { transform: [{ scale: pressed ? 0.98 : 1 }] }, style]}>
      {({ pressed }) => content(pressed)}
    </Pressable>
  );
}
