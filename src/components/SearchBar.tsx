import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme';

interface Props {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder: string;
  onPress?: () => void; // mode "faux input" (Home → Explore)
  autoFocus?: boolean;
  onSubmit?: () => void;
  style?: ViewStyle;
}

export function SearchBar({ value, onChangeText, placeholder, onPress, autoFocus, onSubmit, style }: Props) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.base, pressed && { opacity: 0.85 }, style]}>
        <Ionicons name="search-outline" size={18} color={colors.textFaint} />
        <Text style={styles.placeholder}>{placeholder}</Text>
      </Pressable>
    );
  }
  return (
    <View style={[styles.base, style]}>
      <Ionicons name="search-outline" size={18} color={colors.textFaint} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        style={styles.input}
      />
      {!!value && (
        <Pressable onPress={() => onChangeText?.('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.textFaint} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 50,
  },
  placeholder: { color: colors.textFaint, fontSize: 14.5 },
  input: { flex: 1, color: colors.text, fontSize: 14.5, height: '100%' },
});
