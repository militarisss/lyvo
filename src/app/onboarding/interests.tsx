import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { CATEGORIES } from '@/data/categories';
import { useUser } from '@/stores/user';
import { useToast } from '@/stores/toast';
import { notifySuccess } from '@/utils/haptics';

export default function Interests() {
  const { profile, setInterests, completeOnboarding } = useUser();
  const [selected, setSelected] = useState<string[]>([]);
  const toast = useToast((s) => s.show);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const finish = () => {
    setInterests(selected);
    completeOnboarding();
    notifySuccess();
    toast(`Bienvenue sur LYVO, ${profile.firstName} !`, 'success');
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <Header title="Centres d’intérêt" />
      <Text style={[type.h1, { marginTop: spacing.sm }]}>Qu’est-ce qui vous intéresse ?</Text>
      <Text style={[type.bodySoft, { marginTop: spacing.sm }]}>
        Nous personnaliserons vos recommandations. Vous pourrez modifier cela à tout moment.
      </Text>

      <View style={styles.grid}>
        {CATEGORIES.flatMap((c) => [
          <Chip key={c.id} label={c.name} icon={c.icon as never} active={selected.includes(c.id)} onPress={() => toggle(c.id)} />,
          ...c.subs.map((s) => (
            <Chip key={s.id} label={s.name} active={selected.includes(s.id)} onPress={() => toggle(s.id)} />
          )),
        ])}
      </View>

      <Button
        title={selected.length ? `C’est parti (${selected.length})` : 'C’est parti'}
        onPress={finish}
        style={{ marginTop: spacing.xxl }}
      />
      <Button title="Passer" variant="ghost" onPress={finish} style={{ marginTop: spacing.md }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xl },
});
