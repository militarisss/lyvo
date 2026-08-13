import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { tapLight } from '@/utils/haptics';

interface Props {
  title: string;
  right?: ReactNode;
}

/** Header de page interne : bouton retour + titre. */
export function Header({ title, right }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => {
          tapLight();
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)');
        }}
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}>
        <Ionicons name="chevron-back" size={20} color={colors.text} />
      </Pressable>
      <Text style={[type.h2, styles.title]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, textAlign: 'center', marginHorizontal: spacing.sm },
  right: { width: 40, alignItems: 'flex-end' },
});
