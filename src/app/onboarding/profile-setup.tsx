import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Avatar } from '@/components/Avatar';
import { useUser } from '@/stores/user';
import { tapLight } from '@/utils/haptics';

const AVATARS = [8, 12, 33, 47, 56, 60].map((n) => `https://i.pravatar.cc/150?img=${n}`);

export default function ProfileSetup() {
  const { profile, setProfile } = useUser();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [birthDate, setBirthDate] = useState(profile.birthDate ?? '');
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});

  const submit = () => {
    const e: typeof errors = {};
    if (!firstName.trim()) e.firstName = 'Votre prénom est requis.';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Adresse email invalide.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setProfile({ firstName: firstName.trim(), lastName: lastName.trim(), email, birthDate: birthDate || undefined, avatar: AVATARS[avatarIdx] });
    router.push('/onboarding/permissions');
  };

  return (
    <Screen>
      <Header title="Votre profil" />

      <Pressable
        onPress={() => {
          tapLight();
          setAvatarIdx((i) => (i + 1) % AVATARS.length);
        }}
        style={styles.avatarWrap}>
        <Avatar uri={AVATARS[avatarIdx]} size={92} ring />
        <View style={styles.camBadge}>
          <Ionicons name="camera-outline" size={14} color="#fff" />
        </View>
        <Text style={[type.tiny, { marginTop: 8 }]}>Touchez pour changer la photo</Text>
      </Pressable>

      <View style={{ gap: spacing.lg, marginTop: spacing.xl }}>
        <Input label="Prénom" value={firstName} onChangeText={setFirstName} placeholder="Badr" error={errors.firstName} />
        <Input label="Nom" value={lastName} onChangeText={setLastName} placeholder="El Gourari" />
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="vous@exemple.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
        <Input label="Date de naissance (optionnel)" value={birthDate} onChangeText={setBirthDate} placeholder="JJ/MM/AAAA" />
      </View>

      <Button title="Continuer" onPress={submit} style={{ marginTop: spacing.xxl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { alignItems: 'center', marginTop: spacing.lg },
  camBadge: {
    position: 'absolute',
    top: 68,
    right: '38%',
    backgroundColor: colors.violet,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },
});
