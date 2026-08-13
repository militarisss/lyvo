import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { tapLight } from '@/utils/haptics';

interface Props {
  rating: number;
  count?: number;
  size?: number;
  onRate?: (n: number) => void; // mode interactif
}

export function Stars({ rating, count, size = 13, onRate }: Props) {
  if (onRate) {
    return (
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            onPress={() => {
              tapLight();
              onRate(n);
            }}
            hitSlop={6}>
            <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={size} color={n <= rating ? colors.gold : colors.textFaint} style={{ marginRight: 6 }} />
          </Pressable>
        ))}
      </View>
    );
  }
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={size} color={colors.gold} />
      <Text style={[styles.value, { fontSize: size - 1 }]}>{rating.toFixed(1)}</Text>
      {count != null && <Text style={[styles.count, { fontSize: size - 2 }]}>({count})</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  value: { color: colors.text, fontWeight: '700', marginLeft: 4 },
  count: { color: colors.textFaint, marginLeft: 3 },
});
