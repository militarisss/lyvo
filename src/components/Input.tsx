import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, type } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  style?: ViewStyle;
}

export function Input({ label, error, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={style}>
      {label && <Text style={[type.label, styles.label]}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textFaint}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
        style={[styles.input, focused && styles.focused, !!error && styles.errored]}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 8 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 52,
    color: colors.text,
    fontSize: 15,
  },
  focused: { borderColor: colors.violetLight },
  errored: { borderColor: colors.error },
  errorText: { color: colors.error, fontSize: 12, marginTop: 6, fontWeight: '600' },
});
