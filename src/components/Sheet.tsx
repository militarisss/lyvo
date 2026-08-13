import React, { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, type } from '@/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Bottom sheet simple (Modal natif + slide) — cohérent iOS / Android / web. */
export function Sheet({ visible, onClose, title, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.handle} />
        {title && <Text style={[type.h2, { marginBottom: spacing.lg }]}>{title}</Text>}
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginBottom: spacing.lg,
  },
});
