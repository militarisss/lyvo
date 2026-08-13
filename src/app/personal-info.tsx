import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { spacing } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Avatar } from '@/components/Avatar';
import { useUser } from '@/stores/user';
import { useToast } from '@/stores/toast';

export default function PersonalInfo() {
  const { profile, setProfile } = useUser();
  const toast = useToast((s) => s.show);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});

  const save = () => {
    const e: typeof errors = {};
    if (!firstName.trim()) e.firstName = 'Le prénom est requis.';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) e.email = 'Adresse email invalide.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setProfile({ firstName: firstName.trim(), lastName: lastName.trim(), email, phone });
    toast('Profil mis à jour', 'success');
    router.back();
  };

  return (
    <Screen>
      <Header title="Informations personnelles" />
      <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
        <Avatar uri={profile.avatar} name={`${profile.firstName} ${profile.lastName}`} size={84} ring />
      </View>
      <View style={{ gap: spacing.lg }}>
        <Input label="Prénom" value={firstName} onChangeText={setFirstName} error={errors.firstName} />
        <Input label="Nom" value={lastName} onChangeText={setLastName} />
        <Input label="Téléphone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
      </View>
      <Button title="Enregistrer" onPress={save} style={{ marginTop: spacing.xxl }} />
    </Screen>
  );
}
