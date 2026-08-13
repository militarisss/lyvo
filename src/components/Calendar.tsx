import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, type } from '@/theme';
import { dayLetter, nextDays } from '@/utils/format';
import { tapLight } from '@/utils/haptics';

const SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30', '20:00'];

interface Props {
  date: string | null;
  time: string | null;
  onDate: (d: string) => void;
  onTime: (t: string) => void;
}

export function Calendar({ date, time, onDate, onTime }: Props) {
  const days = nextDays(14);
  return (
    <View>
      <Text style={[type.label, { marginBottom: spacing.md }]}>Choisissez une date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        {days.map((d, i) => {
          const { day, num } = dayLetter(d);
          const active = date === d;
          return (
            <Pressable
              key={d}
              onPress={() => {
                tapLight();
                onDate(d);
              }}
              style={[styles.day, active && styles.dayActive]}>
              <Text style={[styles.dayName, active && { color: '#fff' }]}>{i === 0 ? 'auj.' : day}</Text>
              <Text style={[styles.dayNum, active && { color: '#fff' }]}>{num}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={[type.label, { marginVertical: spacing.md, marginTop: spacing.xl }]}>Choisissez une heure</Text>
      <View style={styles.slots}>
        {SLOTS.map((s) => {
          const active = time === s;
          return (
            <Pressable
              key={s}
              onPress={() => {
                tapLight();
                onTime(s);
              }}
              style={[styles.slot, active && styles.slotActive]}>
              <Text style={[styles.slotText, active && { color: '#fff' }]}>{s}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  day: {
    width: 56,
    height: 68,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dayActive: { backgroundColor: colors.violet, borderColor: colors.violetLight },
  dayName: { color: colors.textFaint, fontSize: 11, fontWeight: '600' },
  dayNum: { color: colors.text, fontSize: 18, fontWeight: '800' },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotActive: { backgroundColor: colors.violet, borderColor: colors.violetLight },
  slotText: { color: colors.textSoft, fontSize: 13.5, fontWeight: '700' },
});
