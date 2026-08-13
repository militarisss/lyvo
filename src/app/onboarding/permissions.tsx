import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { useUser } from '@/stores/user';
import { useToast } from '@/stores/toast';

export default function Permissions() {
  const { locationGranted, notificationsGranted, setLocationGranted, setNotificationsGranted } = useUser();
  const toast = useToast((s) => s.show);

  return (
    <Screen>
      <Header title="Autorisations" />
      <Text style={[type.h1, { marginTop: spacing.sm }]}>Autour de vous</Text>
      <Text style={[type.bodySoft, { marginTop: spacing.sm }]}>
        LYVO utilise votre position pour vous proposer les meilleurs prestataires à proximité.
      </Text>

      <MapPlaceholder
        height={170}
        style={{ marginTop: spacing.xl }}
        pins={[
          { left: '30%', top: '35%' },
          { left: '62%', top: '55%', accent: true },
          { left: '48%', top: '25%' },
        ]}
      />

      <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
        <PermRow
          icon="location-outline"
          title="Localisation"
          sub="Prestataires proches et adresses automatiques"
          value={locationGranted}
          onChange={(v) => {
            setLocationGranted(v);
            if (v) toast('Localisation activée — Casablanca détectée', 'success');
          }}
        />
        <PermRow
          icon="notifications-outline"
          title="Notifications"
          sub="Confirmations, rappels et suivi en temps réel"
          value={notificationsGranted}
          onChange={(v) => {
            setNotificationsGranted(v);
            if (v) toast('Notifications activées', 'success');
          }}
        />
      </View>

      <Button title="Continuer" onPress={() => router.push('/onboarding/interests')} style={{ marginTop: spacing.xxl }} />
      <Button title="Plus tard" variant="ghost" onPress={() => router.push('/onboarding/interests')} style={{ marginTop: spacing.md }} />
    </Screen>
  );
}

function PermRow({
  icon,
  title,
  sub,
  value,
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={20} color={colors.violetLight} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={type.h3}>{title}</Text>
        <Text style={[type.small, { marginTop: 2 }]}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.cardHi, true: colors.violet }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.violetDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
