import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Sheet } from '@/components/Sheet';
import { Input } from '@/components/Input';
import { Chip } from '@/components/Chip';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { useUser } from '@/stores/user';
import { useToast } from '@/stores/toast';
import { CASABLANCA_CENTER } from '@/services/location';
import type { Address } from '@/types/models';

const ICONS: Record<Address['label'], keyof typeof Ionicons.glyphMap> = {
  Maison: 'home-outline',
  Travail: 'business-outline',
  Autre: 'location-outline',
};

export default function Addresses() {
  const { addresses, defaultAddressId, addAddress, removeAddress, setDefaultAddress } = useUser();
  const toast = useToast((s) => s.show);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<Address['label']>('Maison');
  const [line, setLine] = useState('');
  const [error, setError] = useState<string | undefined>();

  const save = () => {
    if (line.trim().length < 6) {
      setError('Adresse trop courte.');
      return;
    }
    addAddress({ label, line: line.trim(), city: 'Casablanca', ...CASABLANCA_CENTER });
    setOpen(false);
    setLine('');
    setError(undefined);
    toast('Adresse enregistrée', 'success');
  };

  return (
    <Screen>
      <Header title="Mes adresses" />

      <MapPlaceholder height={150} pins={[{ left: '48%', top: '45%', label: 'Casablanca', accent: true }]} />
      <Text style={[type.tiny, { textAlign: 'center', marginTop: spacing.sm }]}>
        Google Maps / Mapbox sera branché ici (abstraction prête dans services/location).
      </Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        {addresses.map((a) => {
          const isDefault = a.id === defaultAddressId;
          return (
            <Card key={a.id} onPress={() => setDefaultAddress(a.id)} style={styles.row}>
              <View style={styles.icon}>
                <Ionicons name={ICONS[a.label]} size={18} color={colors.violetLight} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={type.h3}>{a.label}</Text>
                  {isDefault && <Text style={styles.defaultTag}>Par défaut</Text>}
                </View>
                <Text style={[type.small, { marginTop: 2 }]}>
                  {a.line}, {a.city}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  removeAddress(a.id);
                  toast('Adresse supprimée', 'info');
                }}
                hitSlop={8}>
                <Ionicons name="trash-outline" size={17} color={colors.textFaint} />
              </Pressable>
            </Card>
          );
        })}
      </View>

      <Button title="Ajouter une adresse" icon="add-outline" onPress={() => setOpen(true)} style={{ marginTop: spacing.xl }} />

      <Sheet visible={open} onClose={() => setOpen(false)} title="Nouvelle adresse">
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {(['Maison', 'Travail', 'Autre'] as const).map((l) => (
            <Chip key={l} label={l} active={label === l} onPress={() => setLabel(l)} />
          ))}
        </View>
        <Input
          label="Adresse complète"
          value={line}
          onChangeText={setLine}
          placeholder="Rue, résidence, appartement…"
          error={error}
          style={{ marginTop: spacing.lg }}
        />
        <Button title="Enregistrer" onPress={save} style={{ marginTop: spacing.xl }} />
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultTag: { color: colors.success, fontSize: 10.5, fontWeight: '800' },
});
